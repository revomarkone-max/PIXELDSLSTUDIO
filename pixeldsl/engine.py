"""
pixeldsl.engine - SDF modelling + pixel-art renderer.

A model is a skeleton (joints with rest positions, posed per frame) plus SDF
primitives attached to joints. Each frame is ray-marched with an orthographic
camera (top-down 2.5D, side, isometric...), toon-shaded with per-material colour
ramps and outlined. Everything is deterministic: same model + view + frame gives
the same pixels.

World units: at scale 1, one unit = one output pixel. y is up, models face +z at
rest, ground is y = 0. The model is rotated (not the camera), so the light stays
fixed on screen across directions.
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
        elif kind == "skirt":
            # Capped cone hanging from the pelvis whose hem follows the legs: the hem centre
            # moves toward the feet and the hem widens with the stride, so legs stay inside.
            ppos, pR = joints[p.get("joint", "pelvis")]
            local = lambda j: pR.T @ (joints[j][0] - ppos)
            aR, aL = local(p.get("ankle_R", "ankle_R")), local(p.get("ankle_L", "ankle_L"))
            kR, kL = local(p.get("knee_R", "knee_R")), local(p.get("knee_L", "knee_L"))
            length, follow = p["length"], p.get("follow", 0.75)
            mid = (aR + aL) * 0.5
            spread = np.hypot(aR[0] - aL[0], aR[2] - aL[2]) * 0.5
            hem_r = max(p["hem_r"], spread * p.get("widen", 0.7) + p.get("clearance", 2.4))
            top = np.asarray(p.get("top", (0, 5.0, 0)), dtype=np.float64)
            y0, y1 = p.get("band", (None, None))
            hem = np.array([mid[0] * follow, -length, top[2] + (mid[2] - top[2]) * follow + p.get("hem_z", 0.8)])
            if y0 is not None:   # a band around the hem (trim)
                a_l = top + (hem - top) * y0
                b_l = top + (hem - top) * y1
                r1 = p["top_r"] + (hem_r - p["top_r"]) * y0 + p.get("band_add", 0.4)
                r2 = p["top_r"] + (hem_r - p["top_r"]) * y1 + p.get("band_add", 0.4)
            else:
                a_l, b_l, r1, r2 = top, hem, p["top_r"], hem_r
            g = dict(p, kind="ccone", A=ppos + pR @ a_l, B=ppos + pR @ b_l, r1=r1, r2=r2)
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
    """Union of smooth-blended groups. Far from a primitive its exact SDF is replaced by the
    distance to its bounding sphere (a valid lower bound), which keeps sphere tracing safe
    and skips most of the work."""

    NEAR = 2.5

    def __init__(self, resolved, group_k):
        self.groups = {}
        for i, g in enumerate(resolved):
            c, r = prim_bounds(g)
            g["_bc"], g["_br"] = np.asarray(c, dtype=np.float64), float(r)
            self.groups.setdefault(g.get("group", "g%d" % i), []).append(g)
        self.group_k = group_k

    def _prim(self, m, P, k):
        b = _len(P - m["_bc"]) - m["_br"]
        near = b < self.NEAR + 2.0 * k
        if near.all():
            return eval_prim(m, P)
        if near.any():
            b[near] = eval_prim(m, P[near])
        return b

    def distance(self, P, want_material=False):
        best = np.full(P.shape[0], 1e9)
        mat = np.full(P.shape[0], -1, dtype=np.int64) if want_material else None
        for gname, members in self.groups.items():
            k = self.group_k.get(gname, 0.0)
            d = raw_best = raw_mat = None
            cuts = []
            for m in members:
                if m.get("cut"):
                    cuts.append(m)
                    continue
                dm = self._prim(m, P, k)
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


# ----------------------------------------------------------------------------- bounds

def prim_bounds(g):
    """Bounding sphere (centre, radius) of a resolved primitive."""
    k = g["kind"]
    if k in ("seg", "cone", "ccone"):
        c = (g["A"] + g["B"]) * 0.5
        return c, float(np.linalg.norm(g["B"] - g["A"])) * 0.5 + max(g["r1"], g.get("r2", g["r1"]))
    if k == "sphere":
        return g["C"], g["r"]
    if k == "ellipsoid":
        return g["C"], float(max(g["radii"]))
    if k == "box":
        return g["C"], float(np.linalg.norm(g["half"]))
    if k == "torus":
        return g["C"], g["big"] + g["small"]
    raise ValueError(k)


# ----------------------------------------------------------------------------- camera

class Camera:
    """Orthographic camera. elevation: 0 = side view, 35 = top-down 2.5D, 90 = straight down.
    scale = output pixels per world unit (0.5 gives half-size sprites from the same model)."""

    def __init__(self, width, height, origin_px, elevation=35.0, scale=1.0):
        self.w, self.h = int(width), int(height)
        self.ox, self.oy = origin_px
        self.scale = float(scale)
        e = math.radians(elevation)
        self.fwd = np.array([0.0, -math.sin(e), -math.cos(e)])
        self.right = np.array([1.0, 0.0, 0.0])
        self.up = np.cross(self.right, self.fwd)
        self.up /= np.linalg.norm(self.up)

    def pixel_rays(self, rect=None):
        x0, y0, x1, y1 = rect if rect else (0, 0, self.w, self.h)
        ii, jj = np.meshgrid(np.arange(x0, x1), np.arange(y0, y1))
        sx = ((ii + 0.5 - self.ox) / self.scale).ravel()
        sy = ((self.oy - (jj + 0.5)) / self.scale).ravel()
        P0 = np.outer(sx, self.right) + np.outer(sy, self.up)
        return P0 - self.fwd * 400.0, (jj.ravel(), ii.ravel())

    def project(self, p):
        """World point -> pixel coordinates (float)."""
        p = np.asarray(p, dtype=np.float64)
        return self.ox + float(p @ self.right) * self.scale, self.oy - float(p @ self.up) * self.scale


LIGHT = np.array([-0.5, 0.78, 0.55]); LIGHT /= np.linalg.norm(LIGHT)
HALF = (LIGHT + np.array([0.0, 0.0, 1.0])); HALF /= np.linalg.norm(HALF)


def _screen_rect(cam, resolved, pad=3):
    """Pixel rectangle that can contain the model (rays outside it are skipped)."""
    xs, ys = [], []
    for g in resolved:
        if g.get("cut"):
            continue
        c, r = prim_bounds(g)
        px, py = cam.project(c)
        rr = r * cam.scale
        xs += [px - rr, px + rr]; ys += [py - rr, py + rr]
    if not xs:
        return None
    x0 = max(0, int(math.floor(min(xs))) - pad); x1 = min(cam.w, int(math.ceil(max(xs))) + pad)
    y0 = max(0, int(math.floor(min(ys))) - pad); y1 = min(cam.h, int(math.ceil(max(ys))) + pad)
    if x0 >= x1 or y0 >= y1:
        return None
    return x0, y0, x1, y1


def render(scene, resolved, cam, materials, outline="#16121d", steps=120, normals=False):
    """Returns dict(rgba HxWx4 uint8, normal HxWx4 uint8 or None, depth HxW, mat HxW)."""
    H, W = cam.h, cam.w
    rgba = np.zeros((H, W, 4), dtype=np.uint8)
    nrm = np.zeros((H, W, 4), dtype=np.uint8) if normals else None
    depth = np.full((H, W), np.inf)
    matid = np.full((H, W), -1, dtype=np.int64)
    rect = _screen_rect(cam, resolved)
    if rect is None:
        return dict(rgba=rgba, normal=nrm, depth=depth, mat=matid, glow=rgba.copy(), team=rgba.copy())
    O, (pj, pi) = cam.pixel_rays(rect)
    D = cam.fwd
    # cull rays that miss every bounding sphere and start the others at the first one
    t_start = np.full(O.shape[0], np.inf)
    for g in resolved:
        if g.get("cut"):
            continue
        c, r = g["_bc"], g["_br"]
        tc = (c - O) @ D
        perp = _len(O + np.outer(tc, D) - c)
        inside = perp < r
        t_start = np.where(inside, np.minimum(t_start, tc - r), t_start)
    keep = np.isfinite(t_start)
    O, pj, pi = O[keep], pj[keep], pi[keep]
    n = O.shape[0]
    t = np.maximum(t_start[keep], 0.0)
    t_end = t.copy() + 600.0
    hit = np.zeros(n, dtype=bool)
    alive = np.ones(n, dtype=bool)
    eps = 0.03 / max(cam.scale, 0.25)
    for _ in range(steps):
        idx = np.nonzero(alive)[0]
        if idx.size == 0:
            break
        P = O[idx] + D * t[idx, None]
        d = scene.distance(P)
        t[idx] += d * 0.92
        done = d < eps
        hit[idx[done]] = True
        alive[idx[done | (t[idx] > t_end[idx]) | (d > 60.0)]] = False
    h = np.nonzero(hit)[0]
    if h.size:
        P = O[h] + D * t[h, None]
        _, m = scene.distance(P, want_material=True)
        e = 0.04
        N = np.stack([scene.distance(P + v) - scene.distance(P - v)
                      for v in (np.array([e, 0, 0]), np.array([0, e, 0]), np.array([0, 0, e]))], axis=1)
        N /= np.maximum(_len(N), 1e-6)[:, None]
        lam = N @ LIGHT
        tone = np.where(lam > 0.62, 3, np.where(lam > 0.22, 2, np.where(lam > -0.18, 1, 0)))
        spec = (N @ HALF) > 0.94
        jj, ii = pj[h], pi[h]
        for mi, mdef in enumerate(materials):
            sel = m == mi
            if not np.any(sel):
                continue
            ramp = np.array([hex_rgb(c) for c in mdef["ramp"]], dtype=np.uint8)
            tt = tone[sel]
            if mdef.get("team"):
                # team-coloured light: dark in the body layer, the game adds the tinted team layer
                tt = np.zeros_like(tt)
            elif mdef.get("flat") or mdef.get("glow"):
                tt = np.full_like(tt, mdef.get("flat_tone", 2 if mdef.get("glow") else 1))
            if mdef.get("gloss") and len(ramp) > 4:
                tt = np.where(spec[sel], 4, tt)
            rgba[jj[sel], ii[sel], :3] = ramp[np.clip(tt, 0, len(ramp) - 1)]
            rgba[jj[sel], ii[sel], 3] = 255
        depth[jj, ii] = t[h]
        matid[jj, ii] = m
        if normals:
            # tangent-space normal map in screen space (x right, y up, z toward viewer)
            sx = N @ cam.right
            sy = N @ cam.up
            sz = -(N @ cam.fwd)
            nrm[jj, ii, 0] = np.clip((sx * 0.5 + 0.5) * 255, 0, 255).astype(np.uint8)
            nrm[jj, ii, 1] = np.clip((sy * 0.5 + 0.5) * 255, 0, 255).astype(np.uint8)
            nrm[jj, ii, 2] = np.clip((sz * 0.5 + 0.5) * 255, 0, 255).astype(np.uint8)
            nrm[jj, ii, 3] = 255
    rgba = _postprocess(rgba, depth, matid, materials, outline, cam.scale)
    # emissive layers: "glow" materials keep their colour, "team" materials are written in
    # their brightest ramp colour (white) so the game can tint them with the team colour
    glow = np.zeros_like(rgba)
    team = np.zeros_like(rgba)
    for mi, mdef in enumerate(materials):
        sel = (matid == mi) & (rgba[:, :, 3] > 0)
        if not sel.any():
            continue
        if mdef.get("glow"):
            glow[sel] = rgba[sel]
        if mdef.get("team"):
            team[sel, :3] = np.array(hex_rgb(mdef["ramp"][-1]), dtype=np.uint8)
            team[sel, 3] = 255
    if normals:
        ring = (rgba[:, :, 3] > 0) & (nrm[:, :, 3] == 0)
        nrm[ring] = (128, 128, 255, 255)
    return dict(rgba=rgba, normal=nrm, depth=depth, mat=matid, glow=glow, team=team)


DEPTH_UNITS = 128.0  # depth map steps per pixel


def depth_map(depth, rgba, scale):
    """Per-pixel depth behind the origin plane (the plane through the model origin facing the camera), in output
    pixels, positive away from the camera: 16 bits in R (high) and G (low) as 32768 + round(d * DEPTH_UNITS),
    A = 255 where the sprite is opaque. Outline pixels (no hit) take the nearest depth of their 4-neighbours."""
    d = np.where(np.isfinite(depth), (depth - 400.0) * scale, np.inf)
    filled = rgba[:, :, 3] > 0
    for _ in range(2):
        hole = filled & ~np.isfinite(d)
        if not hole.any():
            break
        pad = np.pad(d, 1, constant_values=np.inf)
        neigh = np.minimum.reduce([pad[:-2, 1:-1], pad[2:, 1:-1], pad[1:-1, :-2], pad[1:-1, 2:]])
        d = np.where(hole, neigh, d)
    ok = filled & np.isfinite(d)
    v = np.clip(np.round(np.where(ok, d, 0.0) * DEPTH_UNITS) + 32768, 0, 65535).astype(np.uint16)
    out = np.zeros(rgba.shape[:2] + (4,), dtype=np.uint8)
    out[:, :, 0] = np.where(ok, v >> 8, 0)
    out[:, :, 1] = np.where(ok, v & 255, 0)
    out[:, :, 3] = np.where(ok, 255, 0)
    return out


def decode_depth(img):
    """Inverse of depth_map: float pixels (NaN where empty)."""
    v = img[:, :, 0].astype(np.float64) * 256 + img[:, :, 1]
    return np.where(img[:, :, 3] > 0, (v - 32768) / DEPTH_UNITS, np.nan)


def _postprocess(rgba, depth, matid, materials, outline, scale=1.0):
    filled = rgba[:, :, 3] > 0
    out = rgba.copy()
    # inner contour: a pixel clearly behind a 4-neighbour takes its material's darkest tone
    pad = np.pad(depth, 1, constant_values=np.inf)
    neigh = np.minimum.reduce([pad[:-2, 1:-1], pad[2:, 1:-1], pad[1:-1, :-2], pad[1:-1, 2:]])
    with np.errstate(invalid="ignore"):
        contour = filled & (depth - neigh > 2.6 / max(scale, 0.25))
    for mi, mdef in enumerate(materials):
        sel = contour & (matid == mi)
        if np.any(sel):
            out[sel, :3] = (np.array(hex_rgb(mdef["ramp"][0]), dtype=np.float64) * 0.72).astype(np.uint8)
    if outline:
        fpad = np.pad(filled, 1)
        touch = fpad[:-2, 1:-1] | fpad[2:, 1:-1] | fpad[1:-1, :-2] | fpad[1:-1, 2:]
        ring = (~filled) & touch
        out[ring, :3] = np.array(hex_rgb(outline), dtype=np.uint8)
        out[ring, 3] = 255
    return out
