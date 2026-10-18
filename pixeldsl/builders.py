"""
pixeldsl.builders - reusable parts for models.

Every builder returns a list of primitives attached to joints. Models (JSON) call
builders by name: {"robe": {"mat": "robe", "hem_r": 12}} or give raw primitives:
{"cone": {"joint": "head", "a": [0, 5, 0], "b": [0, 14, -2], "r1": 6, "r2": 3,
"mat": "hat", "group": "hat"}}.

Clothing builders read the current body's sizes (human.ADULT / human.CHIBI) and wrap
its segments with a little extra radius, so the same outfit fits either body and
follows the skeleton, animations and view directions. Rigs ("cape", "grip") add
joints, placed relative to the body, plus per-animation motion.
"""
import math

import numpy as np

from . import human

BUILDERS = {}
D = dict(human.ADULT)          # current body sizes; set by use_body() before building
J = list(human.ADULT_JOINTS)   # current body joints


def use_body(dims, joints):
    D.clear()
    D.update(dims)
    J[:] = joints


def builder(fn):
    """Register a builder; single-primitive builders are wrapped to return a list."""
    def wrapped(*a, **kw):
        r = fn(*a, **kw)
        return r if isinstance(r, list) else [r]
    wrapped.__name__ = fn.__name__
    wrapped.__doc__ = fn.__doc__
    BUILDERS[fn.__name__] = wrapped
    return fn


SIDES = (("R", -1.0), ("L", 1.0))


def _add(v, a):
    return tuple(x + a for x in v)


# ----------------------------------------------------------------------------- primitive shorthands

@builder
def seg(a, b, r1, r2, mat, group, **kw):
    return dict(kind="seg", a=a, b=b, r1=r1, r2=r2, mat=mat, group=group, **kw)


@builder
def ellipsoid(j, at, radii, mat, group, **kw):
    return dict(kind="ellipsoid", joint=j, at=at, radii=radii, mat=mat, group=group, **kw)


@builder
def sphere(j, at, r, mat, group, **kw):
    return dict(kind="sphere", joint=j, at=at, r=r, mat=mat, group=group, **kw)


@builder
def cone(j, a, b, r1, r2, mat, group, **kw):
    return dict(kind="cone", joint=j, a=a, b=b, r1=r1, r2=r2, mat=mat, group=group, **kw)


@builder
def ccone(j, a, b, r1, r2, mat, group, rnd=0.5, **kw):
    return dict(kind="ccone", joint=j, a=a, b=b, r1=r1, r2=r2, round=rnd, mat=mat, group=group, **kw)


@builder
def box(j, at, half, mat, group, rnd=0.4, **kw):
    return dict(kind="box", joint=j, at=at, half=half, round=rnd, mat=mat, group=group, **kw)


@builder
def torus(j, at, big, small, mat, group, **kw):
    return dict(kind="torus", joint=j, at=at, big=big, small=small, mat=mat, group=group, **kw)


@builder
def hide(groups):
    """Hide groups of the base body (e.g. ["head", "hair", "eyes"])."""
    return dict(kind="hide", groups=list(groups))


# ----------------------------------------------------------------------------- clothing

@builder
def shirt(mat, sleeves="long", add=0.8, group="shirt"):
    P = [ellipsoid("chest", D["chest_at"], _add(D["chest_r"], add), mat, group),
         ellipsoid("spine", (0, 0, 0.2), _add(D["spine_r"], add), mat, group)]
    for s, sx in SIDES:
        P.append(sphere("shoulder_" + s, (-0.2 * sx, -0.6, 0), D["shoulder_r"] + add, mat, group))
        if sleeves in ("short", "long"):
            P.append(seg("shoulder_" + s, "elbow_" + s, D["uarm"][0] + add, D["uarm"][1] + add, mat, group + "_" + s,
                         span=(0.0, 1.0 if sleeves == "long" else 0.55)))
        if sleeves == "long":
            P.append(seg("elbow_" + s, "wrist_" + s, D["farm"][0] + add, D["farm"][1] + add, mat, group + "_" + s))
    return P


@builder
def flared_sleeves(mat, flare=1.6, add=0.8, group="sleeve"):
    P = []
    for s, sx in SIDES:
        P.append(seg("shoulder_" + s, "elbow_" + s, D["uarm"][0] + add, D["uarm"][0] + add - 0.2, mat, group + "_" + s))
        P.append(seg("elbow_" + s, "wrist_" + s, D["uarm"][0] + add - 0.2, D["farm"][1] + add + flare, mat, group + "_" + s, span=(0.0, 0.92)))
    return P


@builder
def pants(mat, add=0.6, group="pants"):
    P = [ellipsoid("pelvis", D["pelvis_at"], _add(D["pelvis_r"], add), mat, group)]
    for s, sx in SIDES:
        P.append(seg("hip_" + s, "knee_" + s, D["thigh"][0] + add, D["thigh"][1] + add, mat, group + "_" + s, a_off=(0, 1.0, 0)))
        P.append(seg("knee_" + s, "ankle_" + s, D["thigh"][1] + add, D["shin"][1] + add, mat, group + "_" + s))
    return P


@builder
def boots(mat, cuff=None, top=0.45, add=0.8, group="boots"):
    P = []
    for s, sx in SIDES:
        g = group + "_" + s
        P.append(seg("knee_" + s, "ankle_" + s, D["shin"][0] + add, D["shin"][1] + add, mat, g, span=(top, 1.0)))
        P.append(seg("ankle_" + s, "toe_" + s, D["foot"][0] + add, D["foot"][1] + add, mat, g, a_off=(0, -0.8, -0.9)))
        if cuff:
            P.append(seg("knee_" + s, "ankle_" + s, D["shin"][0] + add + 0.8, D["shin"][0] + add + 0.7, cuff, g, span=(top, top + 0.12)))
    return P


@builder
def gloves(mat, cuff=None, add=0.6, group="gloves"):
    P = []
    for s, sx in SIDES:
        g = group + "_" + s
        P.append(ellipsoid("hand_" + s, D["hand_at"], _add(D["hand_r"], add), mat, g))
        P.append(seg("elbow_" + s, "wrist_" + s, D["farm"][0] + add, D["farm"][1] + add, mat, g, span=(0.55, 1.0)))
        if cuff:
            P.append(seg("elbow_" + s, "wrist_" + s, D["farm"][0] + add + 0.4, D["farm"][1] + add + 0.6, cuff, g, span=(0.52, 0.66)))
    return P


@builder
def robe(mat, hem_r=None, length=None, top_r=None, group="robe", hem=None):
    """Skirt from the waist whose hem follows the feet (engine "skirt"); hides the legs."""
    length = length if length is not None else D["robe_len"]
    top_r = top_r if top_r is not None else D["robe_top_r"]
    hem_r = hem_r if hem_r is not None else top_r * 1.5
    P = [dict(kind="hide", groups=["leg_R", "leg_L", "pelvis"]),
         dict(kind="skirt", joint="pelvis", top=(0, 5.0 * D["anim"] ** 0.5, 0), length=length, top_r=top_r,
              hem_r=hem_r, round=0.8, mat=mat, group=group)]
    if hem:
        P.append(dict(kind="skirt", joint="pelvis", top=(0, 5.0 * D["anim"] ** 0.5, 0), length=length + 0.2,
                      top_r=top_r, hem_r=hem_r, band=(0.955, 1.0), round=0.5, mat=hem, group=group + "_hem"))
    return P


@builder
def belt(mat, buckle=None, group="belt"):
    r = D["pelvis_r"]
    P = [ellipsoid("pelvis", (0, D["belt_y"], 0.1), (r[0] + 1.2, 1.3, r[2] + 1.0), mat, group)]
    if buckle:
        P.append(box("pelvis", (0, D["belt_y"], r[2] + 0.8), (1.4, 1.2, 0.6), buckle, group + "_b", rnd=0.3))
    return P


@builder
def hood(mat, inner=None, depth=1.2, group="hood"):
    """Open hood around the head (face visible); `inner` darkens the inside rim."""
    hx, hy, hz = D["head_r"]
    k = hx / 6.0
    P = [ellipsoid("head", (0, 1.4 * k, -1.2 * k), (7.6 * k, 8.2 * k, 7.8 * k), mat, group),
         cone("head", (0, 2.0 * k, -5.0 * k), (0, -1.0 * k, -10.5 * k), 4.2 * k, 2.6 * k, mat, group),
         sphere("head", (0, -0.7 * k, (7.0 + depth) * k), 6.6 * k, mat, group, cut=True)]
    if inner:
        P.append(ellipsoid("head", (0, 0.6 * k, -1.4 * k), (7.0 * k, 7.6 * k, 7.2 * k), inner, group + "_in"))
        P.append(sphere("head", (0, -0.7 * k, (7.0 + depth) * k), 6.2 * k, inner, group + "_in", cut=True))
    return P


@builder
def spirit_hood(mat, rim=None, void="void", eyes="eyes", tip=1.0, size=1.0, eye_size=1.25, group="hood"):
    """The MOBA hero head: a deep soft hood with a thick rim, a soft point at the back,
    darkness inside instead of a face and two big vertical oval eyes (use a "team" material
    for the eyes so the game can tint them). Hides the base head, hair and eyes."""
    hx, hy, hz = (v * size for v in D["head_r"])
    rim = rim or mat
    return [
        hide(["head", "hair", "eyes"]),
        ellipsoid("head", (0, 0.10 * hy, -0.08 * hz), (1.10 * hx, 1.10 * hy, 1.12 * hz), mat, group),
        cone("head", (0, 0.45 * hy, -0.72 * hz), (0, (0.40 + 0.12 * tip) * hy, -(1.0 + 0.5 * tip) * hz),
             0.44 * hx, 0.10 * hx, mat, group),
        sphere("head", (0, -0.12 * hy, 1.02 * hz), 0.74 * hx, mat, group, cut=True),
        torus("head", (0, -0.10 * hy, 0.80 * hz), 0.70 * hx, 0.17 * hx, rim, group + "_rim", rot=(80, 0, 0)),
        ellipsoid("head", (0, -0.10 * hy, 0.12 * hz), (0.84 * hx, 0.84 * hy, 0.78 * hz), void, "void"),
        ellipsoid("head", (-0.30 * hx, -0.04 * hy, 0.86 * hz), (0.12 * hx * eye_size, 0.21 * hy * eye_size, 0.06 * hz), eyes, "eyes_glow"),
        ellipsoid("head", (0.30 * hx, -0.04 * hy, 0.86 * hz), (0.12 * hx * eye_size, 0.21 * hy * eye_size, 0.06 * hz), eyes, "eyes_glow"),
    ]


@builder
def clasp(mat, size=1.0, group="clasp"):
    """Button/clasp at the front of the neck where a cloak closes."""
    cx, cy, cz = D["chest_r"]
    return [sphere("chest", (0, D["chest_at"][1] + 0.7 * cy, D["chest_at"][2] + cz + 0.6), 1.3 * size * (cx / 8.0) ** 0.3, mat, group)]


def cape_rig_joints(joints):
    """Cape chain joints placed from the body: top at the back of the shoulders."""
    rest = {n: p for n, _, p in joints}
    chest, neck = rest["chest"], rest["neck"]
    back = D["chest_r"][2] + 0.4
    top = (0.0, chest[1] + (neck[1] - chest[1]) * 0.7, chest[2] - back)
    total = top[1] - 2.0
    L1, L2 = total * 0.36, total * 0.42
    mid = (0.0, top[1] - L1, top[2] - 1.4)
    low = (0.0, mid[1] - L2, mid[2] - 1.0)
    return [("cape_top", "chest", top), ("cape_mid", "cape_top", mid), ("cape_low", "cape_mid", low)], total * 0.22


def grip_rig_joints(joints):
    rest = {n: p for n, _, p in joints}
    h = rest["hand_R"]
    return [("grip_R", "hand_R", (h[0], h[1] - 0.6, h[2] + 0.4))], 0.0


def _cape_lengths():
    # mirrors cape_rig_joints for the parts builder (body is known when building)
    joints, end = cape_rig_joints(J)
    p = {n: np.array(v) for n, _, v in joints}
    return (float(np.linalg.norm(p["cape_mid"] - p["cape_top"])),
            float(np.linalg.norm(p["cape_low"] - p["cape_mid"])), end)


@builder
def cape(mat, lining=None, width=None, ragged=False, group="cape"):
    """Cape on the cape chain (smooth-blended flattened ellipsoids); `ragged` cuts teeth into the hem."""
    L1, L2, end = _cape_lengths()
    w = width if width is not None else D["chest_r"][0] + 0.5
    t = 1.4 * (w / 8.5) ** 0.5
    P = [ellipsoid("cape_top", (0, -L1 * 0.5, -0.2), (w, L1 * 0.75, t), mat, group),
         ellipsoid("cape_mid", (0, -L2 * 0.5, 0), (w + 0.9, L2 * 0.74, t * 0.93), mat, group),
         ellipsoid("cape_low", (0, -end * 0.5, 0), (w + 1.6, end * 0.78, t * 0.86), mat, group)]
    if lining:
        P += [ellipsoid("cape_mid", (0, -L2 * 0.5, t * 0.5), (w + 0.5, L2 * 0.71, t * 0.64), lining, group + "_l"),
              ellipsoid("cape_low", (0, -end * 0.5, t * 0.5), (w + 1.2, end * 0.74, t * 0.64), lining, group + "_l")]
    if ragged:
        step = max(2.4, (w + 1.6) * 0.42)
        n = int((2 * (w + 1.6)) // step) + 1
        for i in range(n):
            x = -(w + 1.6) + (i + 0.5) * (2 * (w + 1.6) / n)
            for g in ([group] + ([group + "_l"] if lining else [])):
                P.append(sphere("cape_low", (x, -end * 1.18, 0), step * 0.62, mat, g, cut=True))
    return P


CAPE_K = {"cape": 4.0, "cape_l": 3.5}


def cape_anim():
    def walk(u):
        s = math.sin(u * 2 * math.pi)
        return {"cape_top": (9 + 2 * s, 0, 0), "cape_mid": (6 + 5 * s, 0, 0), "cape_low": (10 + 8 * math.sin(u * 2 * math.pi - 1.0), 0, 0)}

    def idle(u):
        s = math.sin(u * 2 * math.pi)
        return {"cape_top": (4, 0, 0), "cape_mid": (2 + 1.5 * s, 0, 0), "cape_low": (2 + 2.5 * s, 0, 0)}

    def attack(u):
        k = math.sin(min(1.0, u / 0.6) * math.pi)
        return {"cape_top": (6 + 14 * k, 0, 0), "cape_mid": (4 + 8 * k, 0, 0), "cape_low": (4 + 10 * k, 0, 0)}
    return {"walk": walk, "idle": idle, "attack": attack}


def grip_attack(u):
    if u < 0.4:
        k = (u / 0.4); k = k * k * (3 - 2 * k); g = 115 * k
    elif u < 0.6:
        k = (u - 0.4) / 0.2; k = k * k * (3 - 2 * k); g = 115 - 100 * k
    else:
        k = (u - 0.6) / 0.4; k = k * k * (3 - 2 * k); g = 15 - 15 * k
    return {"grip_R": (g, 0, 0)}


def _grip_anims():
    def cast(u):
        k = math.sin(min(1.0, u / 0.7) * math.pi * 0.5) if u < 0.7 else 1.0 - (u - 0.7) / 0.3
        return {"grip_R": (70 * k, 0, 0)}   # keep the staff upright while the arm points forward

    def run(u):
        return {"grip_R": (60, 0, 0)}       # elbow is bent 75 degrees: tilt the weapon back up
    return {"attack": grip_attack, "cast": cast, "run": run}


# the cape chain is driven by pixeldsl.cloth (simulation); cape_anim() is the no-sim fallback
RIGS = {
    "cape": {"joints": cape_rig_joints, "anims": {}, "group_k": CAPE_K, "sim": "cape"},
    "grip": {"joints": grip_rig_joints, "anims": _grip_anims(), "group_k": {}},
}
