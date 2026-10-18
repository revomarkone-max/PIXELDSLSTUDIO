"""
pixeldsl.cloth - small, deterministic cloth simulation for capes.

The cape is a chain of points hanging from the back of the chest. Each
animation is simulated in the model's own space (facing the camera, yaw 0):
Verlet integration with gravity, drag from the motion of the clip (walking
or running pushes the cape back), fixed segment lengths, and collision
against the real SDF of the body and clothes. Looping clips run a few warm-up
cycles first so frame 0 matches the last frame; one-shot clips start from the
settled idle state. The result drives the cape joints, so the cape primitives
follow it. Same model + clip -> same result, frame for frame.
"""
import numpy as np

from . import engine

CHAIN = ["cape_top", "cape_mid", "cape_low"]
END_LOCAL = np.array([0.0, -12.0, 0.0])   # tip of the last segment in cape_low's frame
GRAVITY = np.array([0.0, -420.0, 0.0])    # units / s^2 (78 units ~ 1.8 m)
SPEED = {"walk": 30.0, "run": 70.0}       # forward speed of the clip -> wind from the front
THICKNESS = 1.6
SUBSTEPS = 6
WARMUP = 3


def _frame_axes(p0, p1, side):
    """Rotation whose -y points from p0 to p1, keeping x close to `side`."""
    y = p0 - p1
    y /= max(np.linalg.norm(y), 1e-9)
    z = np.cross(side, y)
    z /= max(np.linalg.norm(z), 1e-9)
    x = np.cross(y, z)
    return np.stack([x, y, z], axis=1)


class CapeSim:
    def __init__(self, model):
        self.m = model
        names = model.skel.names
        rest = model.skel.rest
        self.attach_local = rest["cape_top"] - rest["chest"]
        pts = [rest[n] for n in CHAIN] + [rest["cape_low"] + END_LOCAL]
        self.lengths = [float(np.linalg.norm(pts[i + 1] - pts[i])) for i in range(len(pts) - 1)]
        self.cache = {}
        self.solid = [p for p in model.solid_prims if not p.get("group", "").startswith("weapon")]

    def _body(self, J):
        return engine.Scene(engine.resolve_primitives(self.solid, J), self.m.group_k)

    def _collide(self, scene, P):
        d = scene.distance(P)
        bad = d < THICKNESS
        if not bad.any():
            return P
        e = 0.05
        grad = np.stack([scene.distance(P + v) - scene.distance(P - v)
                         for v in (np.array([e, 0, 0]), np.array([0, e, 0]), np.array([0, 0, e]))], axis=1)
        grad /= np.maximum(np.linalg.norm(grad, axis=1, keepdims=True), 1e-9)
        P = P.copy()
        P[bad] += grad[bad] * (THICKNESS - d[bad])[:, None]
        return P

    def _step(self, P, prev, anchor, scene, dt, wind):
        vel = (P - prev) / dt
        acc = GRAVITY + (wind - vel) * 2.2          # gravity + air drag toward the wind speed
        new = P + (P - prev) * 0.985 + acc * dt * dt
        new[0] = anchor
        for _ in range(4):                          # length constraints (top point pinned)
            for i in range(len(self.lengths)):
                a, b = new[i], new[i + 1]
                d = b - a
                L = np.linalg.norm(d)
                if L < 1e-9:
                    continue
                corr = d * (1.0 - self.lengths[i] / L)
                if i == 0:
                    new[i + 1] -= corr
                else:
                    new[i] += corr * 0.5
                    new[i + 1] -= corr * 0.5
            new[1:] = self._collide(scene, new[1:])
            new[1:, 1] = np.maximum(new[1:, 1], THICKNESS)   # the ground
        return new, P

    def _anchor(self, J):
        pos, R = J["chest"]
        return pos + R @ self.attach_local

    def simulate(self, anim):
        if anim in self.cache:
            return self.cache[anim]
        m = self.m
        n, fps, loops = m.frames(anim), m.fps(anim), m.loops(anim)
        wind = np.array([0.0, 0.0, -SPEED.get(anim, 0.0)])   # model faces +z: moving forward = wind from +z
        dt = 1.0 / fps / SUBSTEPS
        if loops:
            us = [f / n for f in range(n)]
            P = self._rest_points(m.raw_pose(anim, 0.0, 270))
            prev = P.copy()
            record = []
            for cycle in range(WARMUP + 1):
                for f in range(n):
                    for s in range(SUBSTEPS):
                        u = (f + s / SUBSTEPS) / n
                        J = m.raw_pose(anim, u, 270)
                        P, prev = self._step(P, prev, self._anchor(J), self._body(J), dt, wind)
                    if cycle == WARMUP:
                        record.append(P.copy())
        else:
            us = [f / (n - 1) if n > 1 else 0.0 for f in range(n)]
            idle = self.simulate("idle")
            P = idle[0].copy(); prev = P.copy()
            record = [P.copy()]
            for f in range(1, n):
                for s in range(1, SUBSTEPS + 1):
                    u = us[f - 1] + (us[f] - us[f - 1]) * s / SUBSTEPS
                    J = m.raw_pose(anim, u, 270)
                    P, prev = self._step(P, prev, self._anchor(J), self._body(J), dt * (n / max(n - 1, 1)), wind)
                record.append(P.copy())
        self.cache[anim] = record
        self.cache[anim + ":u"] = us
        return record

    def _rest_points(self, J):
        pts = [J[n][0] for n in CHAIN]
        pos, R = J["cape_low"]
        pts.append(pos + R @ END_LOCAL)
        return np.array(pts)

    def apply(self, J, anim, u, yaw_R, root_pos):
        """Override the cape joints in a posed skeleton (already rotated by yaw_R about root_pos)."""
        rec = self.simulate(anim)
        us = self.cache[anim + ":u"]
        i = int(np.argmin([abs(u - x) if not self.m.loops(anim) else min(abs(u - x), 1 - abs(u - x)) for x in us]))
        P = root_pos + (rec[i] - root_pos) @ yaw_R.T
        side = J["chest"][1][:, 0]
        J = dict(J)
        for k, name in enumerate(CHAIN):
            J[name] = (P[k], _frame_axes(P[k], P[k + 1], side))
        return J
