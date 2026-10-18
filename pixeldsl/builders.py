"""
pixeldsl.builders - reusable parts for models.

Every builder returns a list of primitives attached to joints. Models (JSON) call
builders by name: {"robe": {"mat": "robe", "hem_r": 12}} or give raw primitives:
{"cone": {"joint": "head", "a": [0, 5, 0], "b": [0, 14, -2], "r1": 6, "r2": 3,
"mat": "hat", "group": "hat"}}.

Clothing builders wrap the human base's segments with a little extra radius, so an
outfit automatically follows the same skeleton, animations and view directions.
Rigs ("cape", "grip") add joints plus per-animation rotations for them.
"""
import math

BUILDERS = {}


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


# ----------------------------------------------------------------------------- clothing builders

@builder
def shirt(mat, sleeves="long", add=0.8, group="shirt"):
    P = [
        ellipsoid("chest", (0, 0.6, -0.3), (8.0 + add, 7.3 + add, 5.0 + add), mat, group),
        ellipsoid("spine", (0, 0, 0.2), (6.4 + add, 6.3 + add, 4.4 + add), mat, group),
    ]
    for s, sx in SIDES:
        P.append(sphere("shoulder_" + s, (-0.2 * sx, -0.6, 0), 2.7 + add, mat, group))
        if sleeves in ("short", "long"):
            P.append(seg("shoulder_" + s, "elbow_" + s, 2.6 + add, 2.1 + add, mat, group + "_" + s,
                         span=(0.0, 1.0 if sleeves == "long" else 0.55)))
        if sleeves == "long":
            P.append(seg("elbow_" + s, "wrist_" + s, 2.1 + add, 1.7 + add, mat, group + "_" + s))
    return P


@builder
def flared_sleeves(mat, flare=1.6, add=0.8, group="sleeve"):
    P = []
    for s, sx in SIDES:
        P.append(seg("shoulder_" + s, "elbow_" + s, 2.6 + add, 2.4 + add, mat, group + "_" + s))
        P.append(seg("elbow_" + s, "wrist_" + s, 2.4 + add, 1.7 + add + flare, mat, group + "_" + s, span=(0.0, 0.92)))
    return P


@builder
def pants(mat, add=0.6, group="pants"):
    P = [ellipsoid("pelvis", (0, -0.6, 0), (7.0 + add, 5.0 + add, 4.8 + add), mat, group)]
    for s, sx in SIDES:
        P.append(seg("hip_" + s, "knee_" + s, 3.9 + add, 2.9 + add, mat, group + "_" + s, a_off=(0, 1.0, 0)))
        P.append(seg("knee_" + s, "ankle_" + s, 2.9 + add, 2.0 + add, mat, group + "_" + s))
    return P


@builder
def boots(mat, cuff=None, top=0.45, add=0.8, group="boots"):
    P = []
    for s, sx in SIDES:
        g = group + "_" + s
        P.append(seg("knee_" + s, "ankle_" + s, 2.8 + add, 2.0 + add, mat, g, span=(top, 1.0)))
        P.append(seg("ankle_" + s, "toe_" + s, 2.0 + add, 1.6 + add, mat, g, a_off=(0, -0.8, -0.9)))
        if cuff:
            P.append(seg("knee_" + s, "ankle_" + s, 3.0 + add + 0.6, 2.9 + add + 0.6, cuff, g, span=(top, top + 0.12)))
    return P


@builder
def gloves(mat, cuff=None, add=0.6, group="gloves"):
    P = []
    for s, sx in SIDES:
        g = group + "_" + s
        P.append(ellipsoid("hand_" + s, (0, -0.4, 0.2), (1.7 + add, 2.4 + add, 1.9 + add), mat, g))
        P.append(seg("elbow_" + s, "wrist_" + s, 2.1 + add, 1.6 + add, mat, g, span=(0.55, 1.0)))
        if cuff:
            P.append(seg("elbow_" + s, "wrist_" + s, 2.5 + add, 2.2 + add, cuff, g, span=(0.52, 0.66)))
    return P


@builder
def robe(mat, hem_r=11.5, length=35.5, top_r=7.6, group="robe", hem=None):
    """Flat-bottomed skirt from the waist; `length` measured down from the pelvis joint."""
    # dynamic skirt: the hem follows the feet and widens with the stride (see engine "skirt")
    # the skirt replaces the legs: hide the base legs/hips (boots stay visible at the hem)
    P = [dict(kind="hide", groups=["leg_R", "leg_L", "pelvis"]),
         dict(kind="skirt", joint="pelvis", top=(0, 5.0, 0), length=length, top_r=top_r, hem_r=hem_r,
              round=0.8, mat=mat, group=group)]
    if hem:
        P.append(dict(kind="skirt", joint="pelvis", top=(0, 5.0, 0), length=length + 0.2, top_r=top_r, hem_r=hem_r,
                      band=(0.955, 1.0), round=0.5, mat=hem, group=group + "_hem"))
    return P


@builder
def belt(mat, buckle=None, group="belt"):
    P = [ellipsoid("pelvis", (0, 4.2, 0.1), (8.2, 1.4, 5.8), mat, group)]
    if buckle:
        P.append(box("pelvis", (0, 4.2, 5.6), (1.4, 1.3, 0.6), buckle, group + "_b", rnd=0.3))
    return P


@builder
def hood(mat, inner=None, depth=1.2, group="hood"):
    """Hood around the head with the face opening cut out; `inner` darkens the inside rim."""
    P = [
        ellipsoid("head", (0, 1.4, -1.2), (7.6, 8.2, 7.8), mat, group),
        cone("head", (0, 2.0, -5.0), (0, -1.0, -10.5), 4.2, 2.6, mat, group),   # hood tail down the back
        sphere("head", (0, -0.7, 7.0 + depth), 6.6, mat, group, cut=True),
    ]
    if inner:
        P.append(ellipsoid("head", (0, 0.6, -1.4), (7.0, 7.6, 7.2), inner, group + "_in"))
        P.append(sphere("head", (0, -0.7, 7.0 + depth), 6.2, inner, group + "_in", cut=True))
    return P


CAPE_JOINTS = [
    ("cape_top", "chest", (0.0, 57.5, -5.2)),
    ("cape_mid", "cape_top", (0.0, 43.0, -6.6)),
    ("cape_low", "cape_mid", (0.0, 26.0, -7.6)),
]


@builder
def cape(mat, lining=None, width=8.5, group="cape"):
    """Three flattened, smooth-blended ellipsoids on the cape chain: a soft drape that widens."""
    P = [
        ellipsoid("cape_top", (0, -7.6, -0.2), (width, 11.0, 1.4), mat, group),
        ellipsoid("cape_mid", (0, -8.6, 0), (width + 0.9, 12.6, 1.3), mat, group),
        ellipsoid("cape_low", (0, -6.0, 0), (width + 1.6, 9.4, 1.2), mat, group),
    ]
    if lining:
        P += [ellipsoid("cape_mid", (0, -8.6, 0.7), (width + 0.5, 12.2, 0.9), lining, group + "_l"),
              ellipsoid("cape_low", (0, -6.0, 0.7), (width + 1.2, 9.0, 0.9), lining, group + "_l")]
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


# weapon grip: a joint in the right hand. The attack counter-rotates it so the weapon
# is raised behind the head on wind-up and comes down in front on the strike.
GRIP_JOINTS = [("grip_R", "hand_R", (-11.2, 32.6, 1.6))]


def grip_attack(u):
    if u < 0.4:
        k = (u / 0.4); k = k * k * (3 - 2 * k); g = 115 * k
    elif u < 0.6:
        k = (u - 0.4) / 0.2; k = k * k * (3 - 2 * k); g = 115 - 100 * k
    else:
        k = (u - 0.6) / 0.4; k = k * k * (3 - 2 * k); g = 15 - 15 * k
    return {"grip_R": (g, 0, 0)}


def merge_anims(*dicts):
    out = {}
    for d in dicts:
        for name, fn in d.items():
            prev = out.get(name)
            if prev is None:
                out[name] = fn
            else:
                out[name] = (lambda a, b: (lambda u: {**a(u), **b(u)}))(prev, fn)
    return out


@builder
def staff(wood, head_parts, length=40.0, below=11.0, group="weapon"):
    P = [cone("grip_R", (0, -below, 0.4), (0, length - below, 0.4), 0.95, 1.05, wood, group)]
    return P + head_parts




# ----------------------------------------------------------------------------- rigs

def _cape_anims():
    base = cape_anim()

    def run(u):
        sn = math.sin(u * 2 * math.pi)
        return {"cape_top": (22 + 3 * sn, 0, 0), "cape_mid": (14 + 6 * sn, 0, 0), "cape_low": (16 + 9 * math.sin(u * 2 * math.pi - 1.0), 0, 0)}

    def jump(u):
        k = math.sin(u * math.pi)
        return {"cape_top": (6 + 10 * k, 0, 0), "cape_mid": (4 + 8 * k, 0, 0), "cape_low": (4 + 10 * k, 0, 0)}

    def cast(u):
        k = math.sin(min(1.0, u / 0.7) * math.pi * 0.5)
        return {"cape_top": (4 + 8 * k, 0, 0), "cape_mid": (2 + 6 * k, 0, 0), "cape_low": (2 + 8 * k, 0, 0)}
    base.update(run=run, jump=jump, cast=cast)
    return base


def _grip_anims():
    def cast(u):
        k = math.sin(min(1.0, u / 0.7) * math.pi * 0.5) if u < 0.7 else 1.0 - (u - 0.7) / 0.3
        return {"grip_R": (70 * k, 0, 0)}   # keep the staff upright while the arm points forward

    def run(u):
        return {"grip_R": (60, 0, 0)}       # elbow is bent 75 degrees: tilt the weapon back up
    return {"attack": grip_attack, "cast": cast, "run": run}


RIGS = {
    # the cape chain is driven by pixeldsl.cloth (simulation); _cape_anims() stays as a fallback
    "cape": {"joints": CAPE_JOINTS, "anims": {}, "group_k": CAPE_K, "sim": "cape"},
    "grip": {"joints": GRIP_JOINTS, "anims": _grip_anims(), "group_k": {}},
}
