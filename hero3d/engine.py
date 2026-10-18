"""
hero3d.engine - 2.5D pixel-art character renderer.

A character is a skeleton (joints with rest positions) posed by an animation,
plus a list of SDF primitives attached to joints (the base body and any
clothing/skin layers). Each frame is ray-marched with an orthographic camera
tilted like the game camera, then toon-shaded with per-material colour ramps
and outlined, giving crisp pixel art that stays consistent in every direction.

World units = art pixels. y is up, the character faces +z at rest, ground at y=0.
The model is rotated (not the camera), so the light stays fixed on screen.
Requires numpy.
"""
import math
import numpy as np

# ----------------------------------------------------------------------------- math

def rot_x(a):
    a = math.radians(a); c, s = math.cos(a), math.sin(a)
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]], dtype=np.float64)


def rot_y(a):
    a = math.radians(a); c, s = math.cos(a), math.sin(a)
    return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]], dtype=np.float64)


def rot_z(a):
    a = math.radians(a); c, s = math.cos(a), math.sin(a)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]], dtype=np.float64)


def euler(rx=0.0, ry=0.0, rz=0.0):
    """Applied as Y (twist) * X (flex) * Z (side) - intuitive for limbs."""
    return rot_y(ry) @ rot_x(rx) @ rot_z(rz)


def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


# ----------------------------------------------------------------------------- skeleton

class Skeleton:
    """joints: list of (name, parent or None, rest position in world units)."""

    def __init__(self, joints):
        self.names = [j[0] for j in joints]
        self.parent = {j[0]: j[1] for j in joints}
        self.rest = {j[0]: np.array(j[2], dtype=np.float64) for j in joints}
        self.offset = {}
        for name, parent, pos in joints:
            self.offset[name] = self.rest[name] - (self.rest[parent] if parent else 0.0)

    def pose(self, rotations=None, root_offset=(0, 0, 0)):
        """rotations: {joint: (rx, ry, rz)} local rotations. Returns {joint: (pos, R)}."""
        rotations = rotations or {}
        out = {}
        for name in self.names:  # parents are listed before children
            p = self.parent[name]
            local = euler(*rotations.get(name, (0.0, 0.0, 0.0)))
            if p is None:
                pos = self.offset[name] + np.array(root_offset, dtype=np.float64)
                R = local
            else:
                ppos, pR = out[p]
                pos = ppos + pR @ self.offset[name]
                R = pR @ local
            out[name] = (pos, R)
        return out


# ----------------------------------------------------------------------------- primitives
# Every primitive is a dict with "kind", geometry in a joint's local frame, "mat",
# "group" (members of a group are smooth-blended with group k), optional "cut": True
# (subtracted from its group).

def _len(v):
    return np.sqrt(np.einsum("ij,ij->i", v, v))


def sd_sphere(P, c, r):
    return _len(P - c) - r


def sd_ellipsoid(P, c, R, radii):
    q = (P - c) @ R  # into local frame (R columns are local axes)
    q = q / radii
    k0 = _len(q)
    k1 = _len(q / radii)
    return k0 * (k0 - 1.0) / np.maximum(k1, 1e-6)


def sd_round_cone(P, a, b, r1, r2):
    # iq's round cone (capsule with different radii)
    ba = b - a
    l2 = float(ba @ ba)
    if l2 < 1e-9:
        return _len(P - a) - max(r1, r2)
    rr = r1 - r2
    a2 = l2 - rr * rr
    il2 = 1.0 / l2
    pa = P - a
    y = pa @ ba
    z = y - l2
    xv = pa * l2 - np.outer(y, ba)
    x2 = np.einsum("ij,ij->i", xv, xv)
    y2 = y * y * l2
    z2 = z * z * l2
    k = math.copysign(1.0, rr) * rr * rr * x2
    res = np.empty(P.shape[0])
    m1 = np.sign(z) * a2 * z2 > k
    m2 = (~m1) & (np.sign(y) * a2 * y2 < k)
    m3 = ~(m1 | m2)
    res[m1] = np.sqrt(x2[m1] + z2[m1]) * il2 - r2
    res[m2] = np.sqrt(x2[m2] + y2[m2]) * il2 - r1
    res[m3] = (np.sqrt(x2[m3] * a2 * il2) + y[m3] * rr) * il2 - r1
    return res


def sd_capped_cone(P, a, b, ra, rb, round_r=0.0):
    # iq's capped cone: flat caps (robes, collars, bands), optional rounding
    ra, rb = ra - round_r, rb - round_r
    ba = b - a
    baba = float(ba @ ba)
    pa = P - a
    papa = np.einsum("ij,ij->i", pa, pa)
    paba = (pa @ ba) / baba
    x = np.sqrt(np.maximum(papa - paba * paba * baba, 0.0))
    cax = np.maximum(0.0, x - np.where(paba < 0.5, ra, rb))
    cay = np.abs(paba - 0.5) - 0.5
    rba = rb - ra
    k = rba * rba + baba
    f = np.clip((rba * (x - ra) + paba * baba) / k, 0.0, 1.0)
    cbx = x - ra - f * rba
    cby = paba - f
    s = np.where((cbx < 0.0) & (cay < 0.0), -1.0, 1.0)
    return s * np.sqrt(np.minimum(cax * cax + cay * cay * baba, cbx * cbx + cby * cby * baba)) - round_r


def sd_box(P, c, R, half, round_r=0.0):
    q = np.abs((P - c) @ R) - (np.asarray(half) - round_r)
    outside = _len(np.maximum(q, 0.0))
    inside = np.minimum(np.max(q, axis=1), 0.0)
    return outside + inside - round_r


def sd_torus(P, c, R, big, small):
    q = (P - c) @ R
    xz = np.sqrt(q[:, 0] ** 2 + q[:, 2] ** 2) - big
    return np.sqrt(xz * xz + q[:, 1] ** 2) - small


def smin(a, b, k):
    if k <= 0:
        return np.minimum(a, b)
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0.0, 1.0)
    return b + (a - b) * h - k * h * (1.0 - h)


def resolve_primitives(prims, joints):
    """Turn joint-relative primitive specs into world-space evaluators for one frame."""
    out = []
    for p in prims:
        kind = p["kind"]
        def world(jname, local):
            pos, R = joints[jname]
            return pos + R @ np.asarray(local, dtype=np.float64), R
        if kind == "seg":  # round cone between two joints (+ optional local offsets / partial span)
            a, _ = world(p["a"], p.get("a_off", (0, 0, 0)))
            b, _ = world(p["b"], p.get("b_off", (0, 0, 0)))
            t0, t1 = p.get("span", (0.0, 1.0))
            a, b = a + (b - a) * t0, a + (b - a) * t1
            g = dict(p, A=a, B=b)
        elif kind in ("cone", "ccone"):  # (capped) cone in one joint's frame: local `a` -> local `b`
            a, R = world(p["joint"], p["a"])
            b, _ = world(p["joint"], p["b"])
            g = dict(p, A=a, B=b)
        elif kind in ("sphere", "ellipsoid", "box", "torus"):
            c, R = world(p["joint"], p.get("at", (0, 0, 0)))
            if "rot" in p:
                R = R @ euler(*p["rot"])
            g = dict(p, C=c, R=R)
        else:
            raise ValueError(kind)
        out.append(g)
    return out


def eval_prim(g, P):
    k = g["kind"]
    if k == "ccone":
        return sd_capped_cone(P, g["A"], g["B"], g["r1"], g.get("r2", g["r1"]), g.get("round", 0.0))
    if k in ("seg", "cone"):
        return sd_round_cone(P, g["A"], g["B"], g["r1"], g.get("r2", g["r1"]))
    if k == "sphere":
        return sd_sphere(P, g["C"], g["r"])
    if k == "ellipsoid":
        return sd_ellipsoid(P, g["C"], g["R"], np.asarray(g["radii"], dtype=np.float64))
    if k == "box":
        return sd_box(P, g["C"], g["R"], g["half"], g.get("round", 0.0))
    if k == "torus":
        return sd_torus(P, g["C"], g["R"], g["big"], g["small"])
    raise ValueError(k)


class Scene:
    def __init__(self, resolved, group_k):
        self.groups = {}
        for i, g in enumerate(resolved):
            self.groups.setdefault(g.get("group", "g%d" % i), []).append(g)
        self.group_k = group_k

    def distance(self, P, want_material=False):
        best = np.full(P.shape[0], 1e9)
        mat = np.full(P.shape[0], -1, dtype=np.int64) if want_material else None
        for gname, members in self.groups.items():
            k = self.group_k.get(gname, 0.0)
            d = None
            raw_best = None
            raw_mat = None
            cuts = []
            for m in members:
                if m.get("cut"):
                    cuts.append(m)
                    continue
                dm = eval_prim(m, P)
                if d is None:
                    d = dm
                    if want_material:
                        raw_best, raw_mat = dm.copy(), np.full(P.shape[0], m["mat_id"])
                else:
                    d = smin(d, dm, k)
                    if want_material:
                        closer = dm < raw_best
                        raw_best = np.where(closer, dm, raw_best)
                        raw_mat = np.where(closer, m["mat_id"], raw_mat)
            if d is None:
                continue
            for c in cuts:
                d = np.maximum(d, -eval_prim(c, P))
            closer = d < best
            best = np.where(closer, d, best)
            if want_material:
                mat = np.where(closer, raw_mat, mat)
        return (best, mat) if want_material else best


# ----------------------------------------------------------------------------- camera & render

class Camera:
    def __init__(self, width, height, origin_px, elevation=35.0):
        self.w, self.h = width, height
        self.ox, self.oy = origin_px
        e = math.radians(elevation)
        self.fwd = np.array([0.0, -math.sin(e), -math.cos(e)])
        self.right = np.array([1.0, 0.0, 0.0])
        self.up = np.cross(self.right, self.fwd)
        self.up /= np.linalg.norm(self.up)

    def rays(self):
        ii, jj = np.meshgrid(np.arange(self.w), np.arange(self.h))
        sx = (ii + 0.5 - self.ox).ravel()
        sy = (self.oy - (jj + 0.5)).ravel()
        P0 = np.outer(sx, self.right) + np.outer(sy, self.up)
        O = P0 - self.fwd * 300.0
        return O

    def project(self, p):
        """World point -> pixel coordinates (float)."""
        return self.ox + float(p @ self.right), self.oy - float(p @ self.up)


LIGHT = np.array([-0.5, 0.78, 0.55]); LIGHT /= np.linalg.norm(LIGHT)


def render(scene, cam, materials, steps=110, outline="#16121d"):
    """Returns (rgba uint8 HxWx4, depth HxW, matid HxW)."""
    O = cam.rays()
    n = O.shape[0]
    D = np.broadcast_to(cam.fwd, O.shape)
    t = np.full(n, 200.0)            # start near the model (ortho, so any t works)
    hit = np.zeros(n, dtype=bool)
    alive = np.ones(n, dtype=bool)
    for _ in range(steps):
        idx = np.nonzero(alive)[0]
        if idx.size == 0:
            break
        P = O[idx] + D[idx] * t[idx, None]
        d = scene.distance(P)
        t[idx] += d * 0.92
        done = d < 0.03
        hit[idx[done]] = True
        far = t[idx] > 420.0
        alive[idx[done | far]] = False
    hidx = np.nonzero(hit)[0]
    rgba = np.zeros((n, 4), dtype=np.uint8)
    depth = np.full(n, np.inf)
    matid = np.full(n, -1, dtype=np.int64)
    if hidx.size:
        P = O[hidx] + D[hidx] * t[hidx, None]
        _, m = scene.distance(P, want_material=True)
        e = 0.04
        nx = scene.distance(P + [e, 0, 0]) - scene.distance(P - [e, 0, 0])
        ny = scene.distance(P + [0, e, 0]) - scene.distance(P - [0, e, 0])
        nz = scene.distance(P + [0, 0, e]) - scene.distance(P - [0, 0, e])
        N = np.stack([nx, ny, nz], axis=1)
        N /= np.maximum(_len(N), 1e-6)[:, None]
        lam = N @ LIGHT
        # toon bands
        tone = np.where(lam > 0.62, 3, np.where(lam > 0.22, 2, np.where(lam > -0.18, 1, 0)))
        for mi, mdef in enumerate(materials):
            sel = m == mi
            if not np.any(sel):
                continue
            ramp = np.array([hex_rgb(c) for c in mdef["ramp"]], dtype=np.uint8)
            tt = tone[sel]
            if mdef.get("flat"):
                tt = np.full_like(tt, mdef.get("flat_tone", 1))
            if mdef.get("gloss") and len(ramp) > 4:
                spec = (N[sel] @ (LIGHT + np.array([0, 0, 1.0])) / np.linalg.norm(LIGHT + [0, 0, 1.0])) > 0.94
                tt = np.where(spec, 4, tt)
            rgba[hidx[sel], :3] = ramp[np.clip(tt, 0, len(ramp) - 1)]
            rgba[hidx[sel], 3] = 255
        depth[hidx] = t[hidx]
        matid[hidx] = m
    rgba = rgba.reshape(cam.h, cam.w, 4)
    depth = depth.reshape(cam.h, cam.w)
    matid = matid.reshape(cam.h, cam.w)
    return postprocess(rgba, depth, matid, materials, outline)


def postprocess(rgba, depth, matid, materials, outline):
    h, w = depth.shape
    filled = rgba[:, :, 3] > 0
    out = rgba.copy()
    oc = np.array(hex_rgb(outline), dtype=np.uint8)
    # inner contour: pixel noticeably behind a 4-neighbour -> darkest tone of its material
    pad = np.pad(depth, 1, constant_values=np.inf)
    neigh_min = np.minimum.reduce([pad[:-2, 1:-1], pad[2:, 1:-1], pad[1:-1, :-2], pad[1:-1, 2:]])
    with np.errstate(invalid="ignore"):
        contour = filled & (depth - neigh_min > 2.6)
    for mi, mdef in enumerate(materials):
        sel = contour & (matid == mi)
        if np.any(sel):
            dark = np.array(hex_rgb(mdef["ramp"][0]), dtype=np.float64) * 0.72
            out[sel, :3] = dark.astype(np.uint8)
    # outer outline: empty pixel touching the figure
    fpad = np.pad(filled, 1)
    touch = fpad[:-2, 1:-1] | fpad[2:, 1:-1] | fpad[1:-1, :-2] | fpad[1:-1, 2:]
    ring = (~filled) & touch
    out[ring, :3] = oc
    out[ring, 3] = 255
    return out, depth, matid
