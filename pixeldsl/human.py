"""
pixeldsl.human - shared humanoid bases: skeleton, body primitives, animations.

Two bodies share one skeleton topology, so every animation, clothing builder and
view works on both:
  adult - ~78 px tall, ~6.3 heads
  chibi - ~64 px tall, head ~40% of the height, short body, big hands and boots
Body sizes live in DIMS; builders read them, so an outfit fits either body.

Character right = -x (the model faces +z, toward the camera, at rest).
Rotation signs: legs/arms hang along -y; rx < 0 swings a limb forward,
rx > 0 at the knee bends the shin back, rx < 0 at the elbow bends the forearm forward.
"""
import math

ADULT_JOINTS = [
    ("root",       None,         (0.0, 0.0, 0.0)),
    ("pelvis",     "root",       (0.0, 37.0, 0.0)),
    ("spine",      "pelvis",     (0.0, 43.0, 0.2)),
    ("chest",      "spine",      (0.0, 51.5, 0.0)),
    ("neck",       "chest",      (0.0, 59.0, -0.2)),
    ("head",       "neck",       (0.0, 66.6, 0.6)),
    ("shoulder_R", "chest",      (-8.6, 57.0, -0.2)),
    ("elbow_R",    "shoulder_R", (-10.4, 46.0, -0.8)),
    ("wrist_R",    "elbow_R",    (-11.0, 36.0, 0.8)),
    ("hand_R",     "wrist_R",    (-11.2, 33.2, 1.2)),
    ("shoulder_L", "chest",      (8.6, 57.0, -0.2)),
    ("elbow_L",    "shoulder_L", (10.4, 46.0, -0.8)),
    ("wrist_L",    "elbow_L",    (11.0, 36.0, 0.8)),
    ("hand_L",     "wrist_L",    (11.2, 33.2, 1.2)),
    ("hip_R",      "pelvis",     (-4.3, 36.0, 0.0)),
    ("knee_R",     "hip_R",      (-4.5, 19.5, 1.0)),
    ("ankle_R",    "knee_R",     (-4.5, 3.6, -0.4)),
    ("toe_R",      "ankle_R",    (-4.6, 1.3, 4.2)),
    ("hip_L",      "pelvis",     (4.3, 36.0, 0.0)),
    ("knee_L",     "hip_L",      (4.5, 19.5, 1.0)),
    ("ankle_L",    "knee_L",     (4.5, 3.6, -0.4)),
    ("toe_L",      "ankle_L",    (4.6, 1.3, 4.2)),
]

CHIBI_JOINTS = [
    ("root",       None,         (0.0, 0.0, 0.0)),
    ("pelvis",     "root",       (0.0, 18.5, 0.0)),
    ("spine",      "pelvis",     (0.0, 22.5, 0.2)),
    ("chest",      "spine",      (0.0, 27.5, 0.0)),
    ("neck",       "chest",      (0.0, 32.0, -0.2)),
    ("head",       "neck",       (0.0, 42.5, 0.8)),
    ("shoulder_R", "chest",      (-6.6, 30.4, -0.2)),
    ("elbow_R",    "shoulder_R", (-8.0, 24.6, -0.4)),
    ("wrist_R",    "elbow_R",    (-8.6, 19.4, 0.6)),
    ("hand_R",     "wrist_R",    (-8.8, 16.8, 1.0)),
    ("shoulder_L", "chest",      (6.6, 30.4, -0.2)),
    ("elbow_L",    "shoulder_L", (8.0, 24.6, -0.4)),
    ("wrist_L",    "elbow_L",    (8.6, 19.4, 0.6)),
    ("hand_L",     "wrist_L",    (8.8, 16.8, 1.0)),
    ("hip_R",      "pelvis",     (-3.4, 18.0, 0.0)),
    ("knee_R",     "hip_R",      (-3.6, 10.6, 0.6)),
    ("ankle_R",    "knee_R",     (-3.6, 3.4, -0.2)),
    ("toe_R",      "ankle_R",    (-3.7, 1.6, 4.0)),
    ("hip_L",      "pelvis",     (3.4, 18.0, 0.0)),
    ("knee_L",     "hip_L",      (3.6, 10.6, 0.6)),
    ("ankle_L",    "knee_L",     (3.6, 3.4, -0.2)),
    ("toe_L",      "ankle_L",    (3.7, 1.6, 4.0)),
]

# Body sizes (radii in art pixels). Builders use these, so clothing fits each body.
ADULT = {
    "chest_at": (0, 0.5, -0.3), "chest_r": (8.0, 7.2, 5.0),
    "spine_r": (6.4, 6.2, 4.4), "pelvis_at": (0, -0.8, 0), "pelvis_r": (7.0, 4.8, 4.8),
    "neck": (2.5, 2.2), "neck_b": (0, -3.0, -0.6), "shoulder_r": 2.7,
    "uarm": (2.6, 2.1), "farm": (2.1, 1.6), "hand_at": (0, -0.4, 0.2), "hand_r": (1.7, 2.4, 1.9),
    "thigh": (3.9, 2.8), "shin": (2.8, 1.9), "foot": (2.0, 1.5),
    "head_at": (0, 0.4, -0.2), "head_r": (6.0, 6.8, 6.4),
    "robe_len": 35.5, "robe_top_r": 7.6, "belt_y": 4.2,
    "anim": 1.0, "jump": 18.0, "death_lift": 4.8,
}
CHIBI = {
    "chest_at": (0, 0.4, -0.2), "chest_r": (6.6, 5.4, 4.6),
    "spine_r": (5.6, 4.6, 4.1), "pelvis_at": (0, -0.6, 0), "pelvis_r": (6.0, 3.8, 4.3),
    "neck": (2.4, 2.4), "neck_b": (0, -6.0, -0.4), "shoulder_r": 2.3,
    "uarm": (2.2, 1.9), "farm": (1.9, 1.7), "hand_at": (0, -0.6, 0.3), "hand_r": (2.6, 3.0, 2.6),
    "thigh": (3.2, 2.6), "shin": (2.6, 2.3), "foot": (2.6, 2.2),
    "head_at": (0, 0, 0), "head_r": (10.5, 11.0, 10.5),
    "robe_len": 17.4, "robe_top_r": 6.4, "belt_y": 3.0,
    "anim": 0.6, "jump": 12.0, "death_lift": 9.5,
}

BODIES = {"adult": (ADULT_JOINTS, ADULT), "chibi": (CHIBI_JOINTS, CHIBI)}
JOINTS = ADULT_JOINTS  # backwards compatibility

BASE_MATERIALS = {
    "skin":  {"ramp": ["#7a4a3a", "#b47a5e", "#dca784", "#f2cfae"]},
    "hair":  {"ramp": ["#2a1a14", "#4a2e22", "#6b4430", "#8a5c40"]},
    "eye":   {"ramp": ["#1a1418", "#1a1418", "#1a1418", "#1a1418"], "flat": True},
    "under": {"ramp": ["#2a2c38", "#3c4050", "#555a6c", "#6e7488"]},
}

# smooth-blend radius per group (0 = hard union)
GROUP_K = {"torso": 1.6, "pelvis": 1.0, "head": 1.0, "arm_R": 0.8, "arm_L": 0.8, "leg_R": 1.0, "leg_L": 1.0}


def _side(s):
    return [("R", -1.0), ("L", 1.0)] if s is None else [s]


def _mul(v, k):
    return tuple(x * k for x in v)


def body_primitives(D=ADULT):
    hx, hy, hz = D["head_r"]
    hs = hx / 6.0
    P = [
        {"kind": "ellipsoid", "joint": "chest", "at": D["chest_at"], "radii": D["chest_r"], "mat": "skin", "group": "torso"},
        {"kind": "ellipsoid", "joint": "spine", "at": (0, 0, 0.2), "radii": D["spine_r"], "mat": "skin", "group": "torso"},
        {"kind": "ellipsoid", "joint": "pelvis", "at": D["pelvis_at"], "radii": D["pelvis_r"], "mat": "under", "group": "pelvis"},
        {"kind": "seg", "a": "neck", "b": "head", "a_off": (0, -1.5, 0), "b_off": D["neck_b"], "r1": D["neck"][0], "r2": D["neck"][1], "mat": "skin", "group": "torso"},
    ]
    for s, sx in _side(None):
        P.append({"kind": "sphere", "joint": "shoulder_" + s, "at": (-0.2 * sx, -0.6, 0), "r": D["shoulder_r"], "mat": "skin", "group": "torso"})
    hc = D["head_at"]
    P += [
        {"kind": "ellipsoid", "joint": "head", "at": hc, "radii": D["head_r"], "mat": "skin", "group": "head"},
        {"kind": "ellipsoid", "joint": "head", "at": (0, hc[1] - 0.48 * hy, hc[2] + 0.2 * hz), "radii": (0.77 * hx, 0.62 * hy, 0.75 * hz), "mat": "skin", "group": "head"},
        {"kind": "sphere", "joint": "head", "at": (0, hc[1] - 0.2 * hy, hc[2] + 0.98 * hz), "r": 1.0 * hs, "mat": "skin", "group": "head"},
        {"kind": "sphere", "joint": "head", "at": (-0.98 * hx, hc[1] - 0.1 * hy, hc[2]), "r": 1.3 * hs, "mat": "skin", "group": "head"},
        {"kind": "sphere", "joint": "head", "at": (0.98 * hx, hc[1] - 0.1 * hy, hc[2]), "r": 1.3 * hs, "mat": "skin", "group": "head"},
        {"kind": "sphere", "joint": "head", "at": (-0.38 * hx, hc[1] + 0.03 * hy, hc[2] + 0.88 * hz), "r": 1.0 * hs, "mat": "eye", "group": "eyes"},
        {"kind": "sphere", "joint": "head", "at": (0.38 * hx, hc[1] + 0.03 * hy, hc[2] + 0.88 * hz), "r": 1.0 * hs, "mat": "eye", "group": "eyes"},
        {"kind": "ellipsoid", "joint": "head", "at": (0, hc[1] + 0.27 * hy, hc[2] - 0.13 * hz), "radii": (1.08 * hx, 0.91 * hy, 1.03 * hz), "mat": "hair", "group": "hair"},
        {"kind": "sphere", "joint": "head", "at": (0, hc[1] - 0.45 * hy, hc[2] + 0.9 * hz), "r": 1.0 * hx, "mat": "hair", "group": "hair", "cut": True},
    ]
    for s, sx in _side(None):
        P += [
            {"kind": "seg", "a": "shoulder_" + s, "b": "elbow_" + s, "r1": D["uarm"][0], "r2": D["uarm"][1], "mat": "skin", "group": "arm_" + s},
            {"kind": "seg", "a": "elbow_" + s, "b": "wrist_" + s, "r1": D["farm"][0], "r2": D["farm"][1], "mat": "skin", "group": "arm_" + s},
            {"kind": "ellipsoid", "joint": "hand_" + s, "at": D["hand_at"], "radii": D["hand_r"], "mat": "skin", "group": "arm_" + s},
            {"kind": "seg", "a": "hip_" + s, "b": "knee_" + s, "a_off": (0, 1.0, 0), "span": (0.0, 0.42), "r1": D["thigh"][0] + 0.1, "r2": D["thigh"][0] - 0.3, "mat": "under", "group": "leg_" + s},
            {"kind": "seg", "a": "hip_" + s, "b": "knee_" + s, "span": (0.2, 1.0), "r1": D["thigh"][0] - 0.3, "r2": D["thigh"][1], "mat": "skin", "group": "leg_" + s},
            {"kind": "seg", "a": "knee_" + s, "b": "ankle_" + s, "r1": D["shin"][0], "r2": D["shin"][1], "mat": "skin", "group": "leg_" + s},
            {"kind": "seg", "a": "ankle_" + s, "b": "toe_" + s, "a_off": (0, -0.8, -0.8), "r1": D["foot"][0], "r2": D["foot"][1], "mat": "skin", "group": "leg_" + s},
        ]
    return P


# ----------------------------------------------------------------------------- animations
# Each returns (rotations, root_offset) for phase u in [0, 1).

def anim_idle(u, D=ADULT):
    b = math.sin(u * 2 * math.pi)
    return ({
        "spine": (0.8 * b, 0, 0), "chest": (-1.0 * b, 0, 0), "head": (0.8 * b, 0, 0),
        "shoulder_R": (2, 0, -3 - 1.5 * b), "shoulder_L": (2, 0, 3 + 1.5 * b),
        "elbow_R": (-10, 0, 0), "elbow_L": (-10, 0, 0),
        "hip_R": (-2, 0, -1.5), "hip_L": (2, 0, 1.5), "knee_R": (4, 0, 0), "knee_L": (3, 0, 0),
        "ankle_R": (-2, 0, 0), "ankle_L": (-1, 0, 0),
    }, (0, (-0.35 + 0.35 * b) * D["anim"], 0))


def anim_walk(u, D=ADULT):
    th = u * 2 * math.pi
    s, c = math.sin(th), math.cos(th)
    knee_r = 6 + 42 * max(0.0, c)
    knee_l = 6 + 42 * max(0.0, -c)
    return ({
        "pelvis": (0, 7 * s, 0), "spine": (3, -3 * s, 0), "chest": (2, -6 * s, 0), "head": (-3, 2 * s, 0),
        "hip_R": (-26 * s, 0, -1), "hip_L": (26 * s, 0, 1),
        "knee_R": (knee_r, 0, 0), "knee_L": (knee_l, 0, 0),
        "ankle_R": (-0.45 * knee_r + 8 * s, 0, 0), "ankle_L": (-0.45 * knee_l - 8 * s, 0, 0),
        "shoulder_R": (22 * s, 0, -4), "shoulder_L": (-22 * s, 0, 4),
        "elbow_R": (-16 - 10 * max(0.0, -s), 0, 0), "elbow_L": (-16 - 10 * max(0.0, s), 0, 0),
    }, (0, (-1.6 * abs(s) + 0.4) * D["anim"], 0))


def _ease(x):
    return x * x * (3 - 2 * x)


def anim_attack(u, D=ADULT):
    """Overhead strike with the right hand: wind-up, fast strike, recover."""
    if u < 0.4:
        k = _ease(u / 0.4); sh, el, tw = -150 * k, -30 * k, 18 * k
    elif u < 0.6:
        k = _ease((u - 0.4) / 0.2); sh, el, tw = -150 + 110 * k, -30 + 15 * k, 18 - 40 * k
    else:
        k = _ease((u - 0.6) / 0.4); sh, el, tw = -40 + 40 * k, -15 + 5 * k, -22 + 22 * k
    lean = -tw * 0.25
    return ({
        "pelvis": (0, tw * 0.3, 0), "spine": (lean * 0.4, tw * 0.3, 0), "chest": (lean * 0.6, tw * 0.5, 0),
        "shoulder_R": (sh, 0, -8), "elbow_R": (el, 0, 0),
        "shoulder_L": (12, 0, 10), "elbow_L": (-25, 0, 0),
        "hip_R": (8, 0, -3), "hip_L": (-14, 0, 3), "knee_R": (10, 0, 0), "knee_L": (12, 0, 0),
        "ankle_R": (-6, 0, 0), "ankle_L": (-4, 0, 0),
    }, (0, -0.6 * math.sin(min(1.0, u / 0.6) * math.pi) * D["anim"], 0))


def anim_run(u, D=ADULT):
    th = u * 2 * math.pi
    s, c = math.sin(th), math.cos(th)
    knee_r = 14 + 70 * max(0.0, c)
    knee_l = 14 + 70 * max(0.0, -c)
    return ({
        "pelvis": (0, 9 * s, 0), "spine": (9, -4 * s, 0), "chest": (5, -8 * s, 0), "head": (-9, 3 * s, 0),
        "hip_R": (-40 * s - 8, 0, -1), "hip_L": (40 * s - 8, 0, 1),
        "knee_R": (knee_r, 0, 0), "knee_L": (knee_l, 0, 0),
        "ankle_R": (-0.35 * knee_r + 10 * s, 0, 0), "ankle_L": (-0.35 * knee_l - 10 * s, 0, 0),
        "shoulder_R": (34 * s, 0, -6), "shoulder_L": (-34 * s, 0, 6),
        "elbow_R": (-75, 0, 0), "elbow_L": (-75, 0, 0),
    }, (0, (-2.6 * abs(c) + 1.2) * D["anim"], 0))


def anim_cast(u, D=ADULT):
    """Both hands raised forward, hold, release."""
    k = math.sin(min(1.0, u / 0.7) * math.pi * 0.5) if u < 0.7 else 1.0 - _ease((u - 0.7) / 0.3)
    return ({
        "spine": (-4 * k, 0, 0), "chest": (-6 * k, 0, 0), "head": (-4 * k, 0, 0),
        "shoulder_R": (-85 * k, 0, -6 - 14 * k), "shoulder_L": (-85 * k, 0, 6 + 14 * k),
        "elbow_R": (-10 - 25 * k, 0, 0), "elbow_L": (-10 - 25 * k, 0, 0),
        "hip_R": (6 * k, 0, -3), "hip_L": (-10 * k, 0, 3), "knee_R": (6 * k, 0, 0), "knee_L": (10 * k, 0, 0),
    }, (0, 0.6 * k * D["anim"], 0))


def anim_jump(u, D=ADULT):
    """Crouch -> take off -> airborne tuck -> land (root height is part of the clip)."""
    if u < 0.2:
        k = _ease(u / 0.2); crouch, air = k, 0.0
    elif u < 0.8:
        k = (u - 0.2) / 0.6; crouch, air = 0.0, math.sin(k * math.pi)
    else:
        k = _ease((u - 0.8) / 0.2); crouch, air = 1.0 - k, 0.0
    tuck = air
    return ({
        "spine": (8 * crouch + 4 * tuck, 0, 0),
        "hip_R": (-30 * crouch - 45 * tuck, 0, -2), "hip_L": (-30 * crouch - 25 * tuck, 0, 2),
        "knee_R": (55 * crouch + 70 * tuck, 0, 0), "knee_L": (55 * crouch + 40 * tuck, 0, 0),
        "ankle_R": (-25 * crouch, 0, 0), "ankle_L": (-25 * crouch, 0, 0),
        "shoulder_R": (20 * crouch - 60 * tuck, 0, -10 * tuck), "shoulder_L": (20 * crouch - 60 * tuck, 0, 10 * tuck),
        "elbow_R": (-20 - 30 * tuck, 0, 0), "elbow_L": (-20 - 30 * tuck, 0, 0),
    }, (0, -6.5 * crouch * D["anim"] + D["jump"] * air, 0))


def anim_hurt(u, D=ADULT):
    k = math.sin(u * math.pi)
    return ({
        "spine": (-10 * k, 0, 0), "chest": (-8 * k, 0, 0), "head": (-14 * k, 0, 0),
        "shoulder_R": (25 * k, 0, -25 * k), "shoulder_L": (25 * k, 0, 25 * k),
        "elbow_R": (-30 * k, 0, 0), "elbow_L": (-30 * k, 0, 0),
        "hip_R": (8 * k, 0, 0), "knee_R": (14 * k, 0, 0), "knee_L": (10 * k, 0, 0),
    }, (0, -0.8 * k * D["anim"], -1.5 * k * D["anim"]))


def anim_death(u, D=ADULT):
    """Stagger, knees give, fall on the back (pivot at the feet); holds the last pose."""
    k = _ease(min(1.0, u / 0.85))
    fall = _ease(max(0.0, (k - 0.25) / 0.75))
    return ({
        "root": (-86 * fall, 0, 0),
        "spine": (-10 * k, 0, 0), "head": (-18 * k + 10 * fall, 0, 0),
        "shoulder_R": (-40 * fall, 0, -30 * fall), "shoulder_L": (-30 * fall, 0, 35 * fall),
        "elbow_R": (-30 * fall, 0, 0), "elbow_L": (-20 * fall, 0, 0),
        "hip_R": (-20 * k + 10 * fall, 0, -4), "hip_L": (-10 * k, 0, 4),
        "knee_R": (35 * k - 25 * fall, 0, 0), "knee_L": (30 * k - 20 * fall, 0, 0),
    }, (0, D["death_lift"] * fall, 0))


# name -> (pose function, frames, fps, loops)
ANIMS = {
    "idle":   (anim_idle, 6, 6, True),
    "walk":   (anim_walk, 8, 11, True),
    "run":    (anim_run, 8, 14, True),
    "attack": (anim_attack, 6, 14, False),
    "cast":   (anim_cast, 6, 10, False),
    "jump":   (anim_jump, 8, 12, False),
    "hurt":   (anim_hurt, 4, 12, False),
    "death":  (anim_death, 8, 10, False),
}
