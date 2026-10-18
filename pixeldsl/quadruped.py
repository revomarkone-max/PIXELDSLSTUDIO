"""
pixeldsl.quadruped - four-legged base (feline): skeleton, body, animations.

Same conventions as the human base: the model faces +z, right = -x, legs hang
along -y and rx < 0 swings a leg forward. Gaits use per-leg phase offsets:
walk is a 4-beat lateral sequence, run is a bound (front pair, then hind pair)
with spine flexion. The tail follows the body with a phase delay.
"""
import math

FELINE_JOINTS = [
    ("root",       None,        (0.0, 0.0, 0.0)),
    ("hips",       "root",      (0.0, 22.0, -12.0)),
    ("spine",      "hips",      (0.0, 23.0, -1.5)),
    ("chest",      "spine",     (0.0, 22.5, 9.0)),
    ("neck",       "chest",     (0.0, 26.0, 14.5)),
    ("head",       "neck",      (0.0, 30.0, 19.5)),
    ("tail1",      "hips",      (0.0, 23.5, -17.0)),
    ("tail2",      "tail1",     (0.0, 21.5, -24.5)),
    ("tail3",      "tail2",     (0.0, 20.0, -32.0)),
    ("tail4",      "tail3",     (0.0, 21.5, -39.0)),
    ("fshoulder_R", "chest",    (-4.2, 21.0, 10.0)),
    ("felbow_R",   "fshoulder_R", (-4.4, 12.0, 8.8)),
    ("fwrist_R",   "felbow_R",  (-4.4, 4.0, 10.4)),
    ("fpaw_R",     "fwrist_R",  (-4.4, 1.5, 12.0)),
    ("fshoulder_L", "chest",    (4.2, 21.0, 10.0)),
    ("felbow_L",   "fshoulder_L", (4.4, 12.0, 8.8)),
    ("fwrist_L",   "felbow_L",  (4.4, 4.0, 10.4)),
    ("fpaw_L",     "fwrist_L",  (4.4, 1.5, 12.0)),
    ("hhip_R",     "hips",      (-4.4, 21.0, -12.5)),
    ("hknee_R",    "hhip_R",    (-4.6, 13.0, -8.0)),
    ("hhock_R",    "hknee_R",   (-4.6, 6.0, -14.0)),
    ("hpaw_R",     "hhock_R",   (-4.6, 1.5, -11.5)),
    ("hhip_L",     "hips",      (4.4, 21.0, -12.5)),
    ("hknee_L",    "hhip_L",    (4.6, 13.0, -8.0)),
    ("hhock_L",    "hknee_L",   (4.6, 6.0, -14.0)),
    ("hpaw_L",     "hhock_L",   (4.6, 1.5, -11.5)),
]

FELINE = {"anim": 1.0, "jump": 12.0, "death_lift": 5.5}

BODIES = {"feline": (FELINE_JOINTS, FELINE)}

BASE_MATERIALS = {
    "fur":   {"ramp": ["#1a1a20", "#26262e", "#34343e", "#46465a"]},
    "fur_d": {"ramp": ["#121216", "#1a1a20", "#24242c", "#30303a"]},
    "nose":  {"ramp": ["#0c0c0e", "#141418", "#1c1c22", "#26262e"]},
    "eyes":  {"ramp": ["#0a0a10", "#0a0a10", "#0a0a10", "#ffffff"], "team": True},
}

GROUP_K = {"body": 3.0, "head": 1.6, "tail": 1.2,
           "fleg_R": 1.0, "fleg_L": 1.0, "hleg_R": 1.0, "hleg_L": 1.0}


def body_primitives(D=FELINE):
    P = [
        {"kind": "ellipsoid", "joint": "chest", "at": (0, -0.5, 0), "radii": (7.2, 8.0, 10.0), "mat": "fur", "group": "body"},
        {"kind": "ellipsoid", "joint": "spine", "at": (0, -1.0, 0), "radii": (6.0, 6.0, 10.0), "mat": "fur", "group": "body"},
        {"kind": "ellipsoid", "joint": "hips", "at": (0, 0, 0), "radii": (6.4, 6.8, 7.6), "mat": "fur", "group": "body"},
        {"kind": "seg", "a": "chest", "b": "head", "a_off": (0, 1.0, 2.5), "b_off": (0, -2.0, -2.0), "r1": 5.0, "r2": 3.8, "mat": "fur", "group": "body"},
        {"kind": "ellipsoid", "joint": "head", "at": (0, 0, 0), "radii": (5.6, 4.8, 5.6), "mat": "fur", "group": "head"},
        {"kind": "ellipsoid", "joint": "head", "at": (0, -1.4, 4.8), "radii": (3.4, 2.6, 3.0), "mat": "fur", "group": "head"},
        {"kind": "sphere", "joint": "head", "at": (0, -0.7, 7.6), "r": 1.05, "mat": "nose", "group": "nose"},
        {"kind": "ellipsoid", "joint": "head", "at": (-2.4, 0.9, 4.6), "radii": (1.15, 0.75, 0.5), "mat": "eyes", "group": "eyes_glow", "rot": (0, 0, -18)},
        {"kind": "ellipsoid", "joint": "head", "at": (2.4, 0.9, 4.6), "radii": (1.15, 0.75, 0.5), "mat": "eyes", "group": "eyes_glow", "rot": (0, 0, 18)},
        {"kind": "cone", "joint": "head", "a": (-2.8, 3.0, -1.0), "b": (-3.8, 6.8, -2.0), "r1": 1.7, "r2": 0.3, "mat": "fur", "group": "head"},
        {"kind": "cone", "joint": "head", "a": (2.8, 3.0, -1.0), "b": (3.8, 6.8, -2.0), "r1": 1.7, "r2": 0.3, "mat": "fur", "group": "head"},
        {"kind": "seg", "a": "hips", "b": "tail1", "a_off": (0, 1.0, -4.0), "r1": 2.0, "r2": 1.7, "mat": "fur", "group": "tail"},
        {"kind": "seg", "a": "tail1", "b": "tail2", "r1": 1.7, "r2": 1.45, "mat": "fur", "group": "tail"},
        {"kind": "seg", "a": "tail2", "b": "tail3", "r1": 1.45, "r2": 1.25, "mat": "fur", "group": "tail"},
        {"kind": "seg", "a": "tail3", "b": "tail4", "r1": 1.25, "r2": 1.1, "mat": "fur_d", "group": "tail"},
    ]
    for s in ("R", "L"):
        P += [
            {"kind": "seg", "a": "fshoulder_" + s, "b": "felbow_" + s, "a_off": (0, 2.0, 0), "r1": 3.7, "r2": 2.7, "mat": "fur", "group": "fleg_" + s},
            {"kind": "seg", "a": "felbow_" + s, "b": "fwrist_" + s, "r1": 2.5, "r2": 2.0, "mat": "fur", "group": "fleg_" + s},
            {"kind": "seg", "a": "fwrist_" + s, "b": "fpaw_" + s, "r1": 2.0, "r2": 2.0, "mat": "fur", "group": "fleg_" + s},
            {"kind": "ellipsoid", "joint": "fpaw_" + s, "at": (0, 0, 0.4), "radii": (2.5, 1.6, 2.9), "mat": "fur_d", "group": "fleg_" + s},
            {"kind": "seg", "a": "hhip_" + s, "b": "hknee_" + s, "a_off": (0, 1.5, -1.0), "r1": 4.6, "r2": 2.9, "mat": "fur", "group": "hleg_" + s},
            {"kind": "seg", "a": "hknee_" + s, "b": "hhock_" + s, "r1": 2.7, "r2": 1.9, "mat": "fur", "group": "hleg_" + s},
            {"kind": "seg", "a": "hhock_" + s, "b": "hpaw_" + s, "r1": 1.9, "r2": 1.8, "mat": "fur", "group": "hleg_" + s},
            {"kind": "ellipsoid", "joint": "hpaw_" + s, "at": (0, 0, 0.6), "radii": (2.4, 1.6, 2.9), "mat": "fur_d", "group": "hleg_" + s},
        ]
    return P


# ----------------------------------------------------------------------------- animations

def _ease(x):
    return x * x * (3 - 2 * x)


def _tail(u, amp=10.0, lift=0.0):
    t = u * 2 * math.pi
    # tail droops from the hips and curls back up at the tip (rx > 0 raises it)
    return {"tail1": (-30 + lift, 8 * math.sin(t) * amp / 10, 0),
            "tail2": (-6 + lift * 0.5, 10 * math.sin(t - 0.8) * amp / 10, 0),
            "tail3": (14, 12 * math.sin(t - 1.6) * amp / 10, 0),
            "tail4": (22, 14 * math.sin(t - 2.4) * amp / 10, 0)}


def _leg(prefix, s, phase, swing, lift):
    """One leg of a gait: swing angle at the top joint, flexion of the middle joint in the air."""
    th = 2 * math.pi * phase
    a = -swing * math.sin(th)                 # forward when sin > 0
    air = max(0.0, math.cos(th))              # leg moving forward = in the air
    if prefix == "f":
        return {"fshoulder_" + s: (a, 0, 0), "felbow_" + s: (lift * air, 0, 0),
                "fwrist_" + s: (-lift * 0.8 * air, 0, 0)}
    return {"hhip_" + s: (a, 0, 0), "hknee_" + s: (-lift * 0.7 * air, 0, 0),
            "hhock_" + s: (lift * air, 0, 0)}


def anim_idle(u, D=FELINE):
    b = math.sin(u * 2 * math.pi)
    r = {"chest": (0.8 * b, 0, 0), "head": (-1.5 * b, 3 * math.sin(u * 2 * math.pi + 1), 0)}
    r.update(_tail(u, amp=6))
    return r, (0, 0.25 * b, 0)


def anim_walk(u, D=FELINE):
    r = {}
    for prefix, s, ph in (("h", "L", 0.0), ("f", "L", 0.25), ("h", "R", 0.5), ("f", "R", 0.75)):
        r.update(_leg(prefix, s, u + ph, 22.0, 34.0))
    t = u * 2 * math.pi
    r.update({"spine": (0, 3 * math.sin(t), 0), "chest": (0, -3 * math.sin(t), 0), "head": (2, 2 * math.sin(t), 0)})
    r.update(_tail(u, amp=9))
    return r, (0, -0.6 * abs(math.sin(2 * t)), 0)


def anim_run(u, D=FELINE):
    """Bound: front pair lands, then the hind pair; the spine flexes and extends."""
    r = {}
    for prefix, s, ph in (("f", "R", 0.0), ("f", "L", 0.08), ("h", "R", 0.5), ("h", "L", 0.58)):
        r.update(_leg(prefix, s, u + ph, 42.0, 55.0))
    t = u * 2 * math.pi
    flex = math.sin(t)
    r.update({"hips": (-8 * flex, 0, 0), "chest": (10 * flex, 0, 0), "head": (-8 * flex, 0, 0)})
    r.update(_tail(u * 2, amp=6, lift=10))
    return r, (0, 2.4 * max(0.0, math.sin(t + 0.8)) - 0.6, 0)


def anim_attack(u, D=FELINE):
    """Rear up and swipe with the right fore paw."""
    if u < 0.4:
        k = _ease(u / 0.4); rear, swipe = k, -0.6 * k
    elif u < 0.6:
        k = _ease((u - 0.4) / 0.2); rear, swipe = 1 - 0.4 * k, -0.6 + 1.6 * k
    else:
        k = _ease((u - 0.6) / 0.4); rear, swipe = 0.6 * (1 - k), 1.0 - k
    r = {"hips": (-14 * rear, 0, 0), "chest": (-10 * rear, 0, 0), "head": (16 * rear, 0, 0),
         "hhip_R": (16 * rear, 0, 0), "hhip_L": (16 * rear, 0, 0), "hknee_R": (-20 * rear, 0, 0), "hknee_L": (-20 * rear, 0, 0),
         "fshoulder_R": (-70 * swipe - 20 * rear, 0, -10), "felbow_R": (30 * max(0.0, -swipe), 0, 0),
         "fshoulder_L": (-25 * rear, 0, 0), "felbow_L": (30 * rear, 0, 0)}
    r.update(_tail(u, amp=12, lift=8 * rear))
    return r, (0, 5.5 * rear, 0)


def anim_cast(u, D=FELINE):
    k = math.sin(min(1.0, u / 0.7) * math.pi * 0.5) if u < 0.7 else 1.0 - _ease((u - 0.7) / 0.3)
    r = {"head": (-18 * k, 0, 0), "neck": (-6 * k, 0, 0), "chest": (-4 * k, 0, 0)}
    r.update(_tail(u, amp=4, lift=12 * k))
    return r, (0, 0, 0)


def anim_jump(u, D=FELINE):
    """Pounce: crouch, leap with legs stretched, land."""
    if u < 0.25:
        k = _ease(u / 0.25); crouch, air = k, 0.0
    elif u < 0.8:
        k = (u - 0.25) / 0.55; crouch, air = 0.0, math.sin(k * math.pi)
    else:
        k = _ease((u - 0.8) / 0.2); crouch, air = 1 - k, 0.0
    r = {"fshoulder_R": (20 * crouch - 55 * air, 0, 0), "fshoulder_L": (20 * crouch - 55 * air, 0, 0),
         "felbow_R": (-30 * crouch, 0, 0), "felbow_L": (-30 * crouch, 0, 0),
         "hhip_R": (-20 * crouch + 50 * air, 0, 0), "hhip_L": (-20 * crouch + 50 * air, 0, 0),
         "hknee_R": (-25 * crouch, 0, 0), "hknee_L": (-25 * crouch, 0, 0),
         "hhock_R": (35 * crouch, 0, 0), "hhock_L": (35 * crouch, 0, 0),
         "chest": (6 * crouch, 0, 0), "head": (-6 * crouch, 0, 0)}
    r.update(_tail(u, amp=4, lift=-10 * air))
    return r, (0, -4.0 * crouch + D["jump"] * air, 0)


def anim_hurt(u, D=FELINE):
    k = math.sin(u * math.pi)
    r = {"chest": (8 * k, 0, 0), "head": (-14 * k, 8 * k, 0), "hips": (-4 * k, 0, 0)}
    r.update(_tail(u, amp=3, lift=-12 * k))
    return r, (0, -1.0 * k, -1.5 * k)


def anim_death(u, D=FELINE):
    """Legs give way and the body rolls onto its side."""
    k = _ease(min(1.0, u / 0.85))
    roll = _ease(max(0.0, (k - 0.2) / 0.8))
    r = {"root": (0, 0, 84 * roll), "head": (10 * k, 0, 10 * roll),
         "fshoulder_R": (-20 * roll, 0, 0), "fshoulder_L": (20 * roll, 0, 0),
         "hhip_R": (20 * roll, 0, 0), "hhip_L": (-15 * roll, 0, 0),
         "felbow_R": (20 * k, 0, 0), "felbow_L": (25 * k, 0, 0)}
    r.update(_tail(0.25, amp=0, lift=-10 * k))
    return r, (0, D["death_lift"] * roll - 3.0 * k * (1 - roll), 0)


ANIMS = {
    "idle":   (anim_idle, 6, 6, True),
    "walk":   (anim_walk, 8, 10, True),
    "run":    (anim_run, 8, 14, True),
    "attack": (anim_attack, 6, 14, False),
    "cast":   (anim_cast, 6, 10, False),
    "jump":   (anim_jump, 8, 12, False),
    "hurt":   (anim_hurt, 4, 12, False),
    "death":  (anim_death, 8, 10, False),
}
