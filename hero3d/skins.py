"""
hero3d.skins - outfits for the shared human base.

A skin = materials + parts (primitives attached to base joints) + optional
extra joints (cape chain, weapon grip) + per-animation rotation offsets for
those joints. Clothing builders below wrap body segments with a little extra
radius, so any outfit automatically follows the same skeleton and animations.
"""
import math
from .base import anim_attack  # noqa: F401  (kept for reference of timing)

SIDES = (("R", -1.0), ("L", 1.0))


# ----------------------------------------------------------------------------- primitive shorthands

def seg(a, b, r1, r2, mat, group, **kw):
    return dict(kind="seg", a=a, b=b, r1=r1, r2=r2, mat=mat, group=group, **kw)


def ell(j, at, radii, mat, group, **kw):
    return dict(kind="ellipsoid", joint=j, at=at, radii=radii, mat=mat, group=group, **kw)


def sph(j, at, r, mat, group, **kw):
    return dict(kind="sphere", joint=j, at=at, r=r, mat=mat, group=group, **kw)


def cone(j, a, b, r1, r2, mat, group, **kw):
    return dict(kind="cone", joint=j, a=a, b=b, r1=r1, r2=r2, mat=mat, group=group, **kw)


def ccone(j, a, b, r1, r2, mat, group, rnd=0.5, **kw):
    return dict(kind="ccone", joint=j, a=a, b=b, r1=r1, r2=r2, round=rnd, mat=mat, group=group, **kw)


def box(j, at, half, mat, group, rnd=0.4, **kw):
    return dict(kind="box", joint=j, at=at, half=half, round=rnd, mat=mat, group=group, **kw)


def torus(j, at, big, small, mat, group, **kw):
    return dict(kind="torus", joint=j, at=at, big=big, small=small, mat=mat, group=group, **kw)


# ----------------------------------------------------------------------------- clothing builders

def shirt(mat, sleeves="long", add=0.8, group="shirt"):
    P = [
        ell("chest", (0, 0.6, -0.3), (8.0 + add, 7.3 + add, 5.0 + add), mat, group),
        ell("spine", (0, 0, 0.2), (6.4 + add, 6.3 + add, 4.4 + add), mat, group),
    ]
    for s, sx in SIDES:
        P.append(sph("shoulder_" + s, (-0.2 * sx, -0.6, 0), 2.7 + add, mat, group))
        if sleeves in ("short", "long"):
            P.append(seg("shoulder_" + s, "elbow_" + s, 2.6 + add, 2.1 + add, mat, group + "_" + s,
                         span=(0.0, 1.0 if sleeves == "long" else 0.55)))
        if sleeves == "long":
            P.append(seg("elbow_" + s, "wrist_" + s, 2.1 + add, 1.7 + add, mat, group + "_" + s))
    return P


def flared_sleeves(mat, flare=1.6, add=0.8, group="sleeve"):
    P = []
    for s, sx in SIDES:
        P.append(seg("shoulder_" + s, "elbow_" + s, 2.6 + add, 2.4 + add, mat, group + "_" + s))
        P.append(seg("elbow_" + s, "wrist_" + s, 2.4 + add, 1.7 + add + flare, mat, group + "_" + s, span=(0.0, 0.92)))
    return P


def pants(mat, add=0.6, group="pants"):
    P = [ell("pelvis", (0, -0.6, 0), (7.0 + add, 5.0 + add, 4.8 + add), mat, group)]
    for s, sx in SIDES:
        P.append(seg("hip_" + s, "knee_" + s, 3.9 + add, 2.9 + add, mat, group + "_" + s, a_off=(0, 1.0, 0)))
        P.append(seg("knee_" + s, "ankle_" + s, 2.9 + add, 2.0 + add, mat, group + "_" + s))
    return P


def boots(mat, cuff=None, top=0.45, add=0.8, group="boots"):
    P = []
    for s, sx in SIDES:
        g = group + "_" + s
        P.append(seg("knee_" + s, "ankle_" + s, 2.8 + add, 2.0 + add, mat, g, span=(top, 1.0)))
        P.append(seg("ankle_" + s, "toe_" + s, 2.0 + add, 1.6 + add, mat, g, a_off=(0, -0.8, -0.9)))
        if cuff:
            P.append(seg("knee_" + s, "ankle_" + s, 3.0 + add + 0.6, 2.9 + add + 0.6, cuff, g, span=(top, top + 0.12)))
    return P


def gloves(mat, cuff=None, add=0.6, group="gloves"):
    P = []
    for s, sx in SIDES:
        g = group + "_" + s
        P.append(ell("hand_" + s, (0, -0.4, 0.2), (1.7 + add, 2.4 + add, 1.9 + add), mat, g))
        P.append(seg("elbow_" + s, "wrist_" + s, 2.1 + add, 1.6 + add, mat, g, span=(0.55, 1.0)))
        if cuff:
            P.append(seg("elbow_" + s, "wrist_" + s, 2.5 + add, 2.2 + add, cuff, g, span=(0.52, 0.66)))
    return P


def robe(mat, hem_r=11.5, length=35.5, top_r=7.6, group="robe", hem=None):
    """Flat-bottomed skirt from the waist; `length` measured down from the pelvis joint."""
    P = [ccone("pelvis", (0, 5.0, 0), (0, -length, 0.8), top_r, hem_r, mat, group, rnd=0.8)]
    if hem:
        P.append(ccone("pelvis", (0, -length + 1.8, 0.8), (0, -length - 0.2, 0.8), hem_r + 0.3, hem_r + 0.5, hem, group + "_hem", rnd=0.5))
    return P


def belt(mat, buckle=None, group="belt"):
    P = [ell("pelvis", (0, 4.2, 0.1), (8.2, 1.4, 5.8), mat, group)]
    if buckle:
        P.append(box("pelvis", (0, 4.2, 5.6), (1.4, 1.3, 0.6), buckle, group + "_b", rnd=0.3))
    return P


def hood(mat, inner=None, depth=1.2, group="hood"):
    """Hood around the head with the face opening cut out; `inner` darkens the inside rim."""
    P = [
        ell("head", (0, 1.4, -1.2), (7.6, 8.2, 7.8), mat, group),
        cone("head", (0, 2.0, -5.0), (0, -1.0, -10.5), 4.2, 2.6, mat, group),   # hood tail down the back
        sph("head", (0, -0.7, 7.0 + depth), 6.6, mat, group, cut=True),
    ]
    if inner:
        P.append(ell("head", (0, 0.6, -1.4), (7.0, 7.6, 7.2), inner, group + "_in"))
        P.append(sph("head", (0, -0.7, 7.0 + depth), 6.2, inner, group + "_in", cut=True))
    return P


CAPE_JOINTS = [
    ("cape_top", "chest", (0.0, 57.5, -5.2)),
    ("cape_mid", "cape_top", (0.0, 43.0, -6.6)),
    ("cape_low", "cape_mid", (0.0, 26.0, -7.6)),
]


def cape(mat, lining=None, width=8.5, group="cape"):
    """Three flattened, smooth-blended ellipsoids on the cape chain: a soft drape that widens."""
    P = [
        ell("cape_top", (0, -7.6, -0.2), (width, 11.0, 1.4), mat, group),
        ell("cape_mid", (0, -8.6, 0), (width + 0.9, 12.6, 1.3), mat, group),
        ell("cape_low", (0, -6.0, 0), (width + 1.6, 9.4, 1.2), mat, group),
    ]
    if lining:
        P += [ell("cape_mid", (0, -8.6, 0.7), (width + 0.5, 12.2, 0.9), lining, group + "_l"),
              ell("cape_low", (0, -6.0, 0.7), (width + 1.2, 9.0, 0.9), lining, group + "_l")]
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


def staff(wood, head_parts, length=40.0, below=11.0, group="weapon"):
    P = [cone("grip_R", (0, -below, 0.4), (0, length - below, 0.4), 0.95, 1.05, wood, group)]
    return P + head_parts


# ----------------------------------------------------------------------------- heroes

MAGE = {
    "name": "mage",
    "materials": {
        "robe":   {"ramp": ["#141a3a", "#212c5e", "#2f3f86", "#4258b0"]},
        "robe_d": {"ramp": ["#0e1230", "#171f46", "#222c62", "#2f3d80"]},
        "silver": {"ramp": ["#4c5670", "#8a94ac", "#c4ccdc", "#f0f4fa", "#ffffff"], "gloss": True},
        "wood":   {"ramp": ["#2e1c14", "#4c2f20", "#6e4630", "#8c5e40"]},
        "frost":  {"ramp": ["#2a6c9c", "#4aa8d8", "#8ad8f4", "#d4f6ff", "#ffffff"], "gloss": True},
        "hair":   {"ramp": ["#6c6c78", "#9a9aa8", "#c6c6d0", "#e6e6ee"]},
        "skin":   {"ramp": ["#7a4a3a", "#b47a5e", "#dca784", "#f2cfae"]},
    },
    "hide_groups": ["hair"],
    "joints": CAPE_JOINTS + GRIP_JOINTS,
    "parts": (
        shirt("robe", sleeves=None) + flared_sleeves("robe", flare=1.8)
        + robe("robe", hem_r=12.0, hem="silver") + belt("silver")
        + gloves("robe_d")
        + boots("robe_d", top=0.6)
        + cape("robe_d", lining="robe", width=8.0)
        + [  # high collar
            cone("chest", (0, 6.0, -1.0), (0, 10.5, -1.6), 6.8, 8.0, "robe_d", "collar"),
            sph("chest", (0, 9.0, 4.0), 5.4, "robe_d", "collar", cut=True),
            sph("neck", (0, 7.0, 3.6), 6.6, "robe_d", "collar", cut=True),
        ]
        + [  # beard (old wizard), wide-brim pointed hat with a silver band
            ell("head", (0, -4.4, 3.0), (4.0, 4.6, 3.4), "hair", "beard"),
            cone("head", (0, -7.0, 3.2), (0, -11.5, 2.4), 2.6, 0.8, "hair", "beard"),
            ell("head", (0, 5.0, -0.6), (9.8, 1.1, 9.8), "robe", "hat", rot=(-16, 0, 0)),
            cone("head", (0, 5.0, -0.4), (0, 14.0, -2.0), 6.4, 3.0, "robe", "hat"),
            cone("head", (0, 14.0, -2.0), (0, 18.5, -7.0), 3.0, 0.7, "robe", "hat"),
            cone("head", (0, 6.0, -0.4), (0, 7.6, -0.6), 6.6, 6.1, "silver", "hat_band"),
        ]
        + staff("wood", [
            cone("grip_R", (0, 27.5, 0.4), (0, 30.0, 0.4), 1.6, 2.2, "silver", "weapon_h"),
            cone("grip_R", (0, 30.5, 0.4), (0, 37.5, 0.4), 2.4, 0.6, "frost", "weapon_g"),
        ], length=30.0)
    ),
    "anim": merge_anims(cape_anim(), {"attack": grip_attack}),
    "group_k": CAPE_K,
}

PRIEST = {
    "name": "priest",
    "materials": {
        "robe":  {"ramp": ["#8a7a64", "#c4b498", "#e8dcc4", "#fbf4e6"]},
        "robe_d": {"ramp": ["#6a5c4a", "#9a8a72", "#c2b296", "#dccdb0"]},
        "gold":  {"ramp": ["#7a4e14", "#b8821e", "#e8b83a", "#ffe07a", "#fff6c8"], "gloss": True},
        "halo":  {"ramp": ["#ffd860", "#ffe47c", "#fff0a8", "#fffbe0"], "flat": True, "flat_tone": 2},
        "hood_in": {"ramp": ["#2a2018", "#3e3024", "#54422f", "#6a543c"]},
        "sun":   {"ramp": ["#e88a14", "#ffb428", "#ffd85a", "#fff3b0", "#ffffff"], "gloss": True},
        "hair":  {"ramp": ["#6e4a1e", "#9a6c2c", "#c4923e", "#e2b660"]},
    },
    "hide_groups": ["hair"],
    "joints": GRIP_JOINTS,
    "parts": (
        shirt("robe", sleeves=None) + flared_sleeves("robe", flare=1.4)
        + robe("robe", hem_r=11.0, hem="gold") + belt("gold", buckle="gold")
        + [box("chest", (0, -10.0, 5.6), (1.6, 14.0, 0.6), "gold", "stole", rnd=0.4)]   # front stole
        + hood("robe_d", inner="hood_in", depth=0.6)
        + [torus("head", (0, -0.4, 5.9), 5.6, 0.7, "gold", "hood_rim", rot=(80, 0, 0))]
        + gloves("robe", cuff="gold") + boots("robe_d", top=0.7)
        + [torus("head", (0, 12.5, -2.0), 6.0, 0.75, "halo", "halo", rot=(-18, 0, 0))]
        + staff("gold", [
            torus("grip_R", (0, 31.0, 0.4), 3.6, 0.8, "gold", "weapon_r", rot=(90, 0, 0)),
            sph("grip_R", (0, 31.0, 0.4), 2.6, "sun", "weapon_s"),
        ], length=28.0, below=8.0)
    ),
    "anim": {"attack": grip_attack},
}

PALADIN = {
    "name": "paladin",
    "materials": {
        "steel":  {"ramp": ["#3a4250", "#66728a", "#9eaac0", "#d6deea", "#ffffff"], "gloss": True},
        "steel_d": {"ramp": ["#262c38", "#424c5e", "#66728a", "#8e9ab0"]},
        "gold":   {"ramp": ["#7a4e14", "#b8821e", "#e8b83a", "#ffe07a", "#fff6c8"], "gloss": True},
        "tabard": {"ramp": ["#1a2c5c", "#284890", "#3a64c0", "#5a88e0"]},
        "cape":   {"ramp": ["#4e1420", "#7a1e2e", "#a83040", "#cc4a58"]},
        "leather": {"ramp": ["#2e1e16", "#4a3022", "#664430", "#80583e"]},
    },
    "hide_groups": ["hair"],
    "joints": CAPE_JOINTS + GRIP_JOINTS,
    "parts": (
        shirt("steel_d", sleeves="long", add=0.9) + pants("steel_d", add=0.8)
        + [  # breastplate, pauldrons, faulds, tabard
            ell("chest", (0, 0.8, 0.4), (9.4, 8.4, 6.2), "steel", "plate"),
            ell("spine", (0, 0.4, 0.4), (7.6, 6.4, 5.4), "steel", "plate"),
            box("pelvis", (0, -4.0, 5.6), (3.4, 6.6, 0.6), "tabard", "tabard", rnd=0.5),
            box("pelvis", (0, -4.2, -5.4), (3.4, 6.4, 0.6), "tabard", "tabard_b", rnd=0.5),
            box("chest", (0, 1.0, 6.4), (2.6, 0.6, 0.5), "gold", "cross"),
            box("chest", (0, 0.4, 6.4), (0.6, 2.8, 0.5), "gold", "cross"),
        ]
        + [p for s, sx in SIDES for p in (
            ell("shoulder_" + s, (0.6 * sx, 1.2, 0), (5.2, 3.8, 5.0), "steel", "pauldron_" + s),
            ell("shoulder_" + s, (0.6 * sx, 0.0, 0), (5.4, 1.0, 5.2), "gold", "pauldron_t_" + s),
        )]
        + belt("leather", buckle="gold")
        + gloves("steel", cuff="gold", add=0.9) + boots("steel", cuff="gold", top=0.3, add=1.0)
        + cape("cape", width=8.8)
        + [  # great helm with visor slit and a gold crest
            ell("head", (0, 0.8, -0.2), (7.0, 7.8, 7.2), "steel", "helm"),
            ell("head", (0, -2.8, 1.4), (5.8, 4.8, 6.0), "steel", "helm"),
            box("head", (0, 0.2, 6.4), (4.2, 0.55, 1.6), "steel_d", "visor", rnd=0.3),
            box("head", (0, 7.6, -0.4), (0.7, 1.4, 5.6), "gold", "crest", rnd=0.6),
        ]
        + [  # war hammer
            cone("grip_R", (0, -7.0, 0.4), (0, 24.0, 0.4), 1.0, 1.1, "leather", "weapon"),
            box("grip_R", (0, 26.5, 0.4), (6.2, 3.6, 3.6), "steel", "weapon_h", rnd=1.0),
            box("grip_R", (0, 26.5, 0.4), (6.5, 0.9, 3.9), "gold", "weapon_b", rnd=0.4),
        ]
    ),
    "anim": merge_anims(cape_anim(), {"attack": grip_attack}),
    "group_k": CAPE_K,
}

SHAMAN = {
    "name": "shaman",
    "materials": {
        "fur":    {"ramp": ["#3a3e48", "#626876", "#8e94a2", "#b8bec8"]},
        "fur_d":  {"ramp": ["#262a32", "#3e424c", "#5a5f6c", "#767c8a"]},
        "leather": {"ramp": ["#3a2418", "#5e3a24", "#845434", "#a4704a"]},
        "bone":   {"ramp": ["#8a7e66", "#bcae90", "#e0d4b6", "#f6eeda"]},
        "spirit": {"ramp": ["#1a6ca8", "#2a9ad8", "#6ad0f8", "#c6f2ff", "#ffffff"], "gloss": True},
        "paint":  {"ramp": ["#1a4e8a", "#2a6cb0", "#3c8ad0", "#5aa6e6"]},
        "skin":   {"ramp": ["#5a3426", "#8a5640", "#b47a5a", "#d49c78"]},
        "hair":   {"ramp": ["#141012", "#241c1c", "#342a28", "#463a36"]},
        "eye":    {"ramp": ["#6ad0f8", "#6ad0f8", "#6ad0f8", "#6ad0f8"], "flat": True},
    },
    "hide_groups": ["hair"],
    "joints": GRIP_JOINTS,
    "parts": (
        pants("leather", add=0.7) + boots("fur_d", top=0.5, add=1.0) + belt("leather", buckle="bone")
        + [box("pelvis", (0, -5.0, 5.2), (3.2, 5.6, 0.6), "fur_d", "loin", rnd=0.6)]
        + gloves("leather", cuff="fur", add=0.5)
        + [box("chest", (-1.0, 0.4, 0.4), (9.2, 1.1, 5.9), "leather", "strap", rot=(0, 0, 38), rnd=0.5)]
        + [ell("chest", (2.0, -1.5, 5.4), (1.4, 1.6, 0.6), "paint", "paint")]
        + [  # fur mantle over the shoulders
            ell("chest", (0, 5.0, -0.8), (11.4, 4.6, 7.6), "fur", "mantle"),
            ell("chest", (-7.4, 3.0, 0.0), (4.6, 4.8, 5.6), "fur", "mantle"),
            ell("chest", (7.4, 3.0, 0.0), (4.6, 4.8, 5.6), "fur", "mantle"),
            ell("chest", (0, 1.0, -5.6), (8.6, 7.4, 2.4), "fur_d", "mantle_b"),
        ]
        + [  # wolf-head hood: skull, snout, ears, fangs
            ell("head", (0, 2.6, -1.4), (7.4, 6.8, 8.0), "fur", "wolf"),
            cone("head", (0, 4.4, 3.6), (0, 3.6, 10.2), 3.6, 2.2, "fur", "wolf"),
            sph("head", (0, 3.6, 10.6), 1.2, "fur_d", "wolf_n"),
            cone("head", (-4.6, 7.2, -1.0), (-5.6, 12.4, -2.0), 2.2, 0.4, "fur", "wolf"),
            cone("head", (4.6, 7.2, -1.0), (5.6, 12.4, -2.0), 2.2, 0.4, "fur", "wolf"),
            cone("head", (-2.4, 1.8, 7.6), (-2.2, -0.4, 7.4), 0.7, 0.2, "bone", "fang"),
            cone("head", (2.4, 1.8, 7.6), (2.2, -0.4, 7.4), 0.7, 0.2, "bone", "fang"),
            sph("head", (0, -2.4, 6.6), 5.6, "fur", "wolf", cut=True),
            ell("head", (0, -4.6, 2.6), (4.2, 3.6, 3.4), "hair", "beard"),
        ]
        + [  # totem staff: carved shaft, bone ring, spirit stone
            cone("grip_R", (0, -10.0, 0.4), (0, 26.0, 0.4), 1.0, 1.3, "leather", "weapon"),
            torus("grip_R", (0, 22.0, 0.4), 1.7, 0.7, "bone", "weapon_r"),
            ell("grip_R", (0, 28.4, 0.4), (2.8, 3.4, 2.8), "fur_d", "weapon_h"),
            sph("grip_R", (0, 28.6, 2.6), 1.9, "spirit", "weapon_g"),
            cone("grip_R", (-2.4, 27.0, 0.4), (-3.6, 19.0, 0.8), 0.8, 0.5, "bone", "weapon_f"),
        ]
    ),
    "anim": {"attack": grip_attack},
}

DRUID = {
    "name": "druid",
    "materials": {
        "moss":   {"ramp": ["#1c3218", "#2e4e22", "#46702e", "#66923e"]},
        "leaf":   {"ramp": ["#1e3a1a", "#2e5a26", "#4a8236", "#78ac4a"]},
        "bark":   {"ramp": ["#2a1c14", "#463020", "#62462e", "#7c5c40"]},
        "antler": {"ramp": ["#5a4a3e", "#8a7664", "#b4a08a", "#d6c6ae"]},
        "cloth":  {"ramp": ["#2e2618", "#4a3e28", "#6a5a3a", "#8a7850"]},
        "orb":    {"ramp": ["#2e8a3a", "#4ec05a", "#8ae882", "#d6ffc8", "#ffffff"], "gloss": True},
        "hood_in": {"ramp": ["#0e140c", "#182014", "#22301c", "#2e4026"]},
        "hair":   {"ramp": ["#3a2414", "#5a3820", "#7a5030", "#946640"]},
    },
    "hide_groups": ["hair"],
    "joints": CAPE_JOINTS + GRIP_JOINTS,
    "parts": (
        shirt("cloth", sleeves="long") + robe("cloth", hem_r=10.0, length=31.0)
        + belt("bark") + gloves("bark", add=0.4) + boots("bark", top=0.55)
        + hood("moss", inner="hood_in", depth=0.4)
        + cape("moss", lining="leaf", width=8.0)
        + [  # leaf mantle: overlapping leaves around the shoulders
            ell("chest", (sx * 6.4, 4.2, z), (3.6, 1.6, 4.4), "leaf", "leaves", rot=(0, ry, sx * 24))
            for sx in (-1.0, 1.0) for z, ry in ((2.6, 20), (-1.6, -10))
        ]
        + [ell("chest", (0, 6.2, 3.4), (5.0, 1.6, 2.6), "leaf", "leaves", rot=(-16, 0, 0))]
        + [  # antlers through the hood
            cone("head", (sx * 3.6, 6.8, -1.0), (sx * 6.4, 13.0, -2.0), 1.1, 0.7, "antler", "antler")
            for sx in (-1.0, 1.0)
        ] + [
            cone("head", (sx * 6.4, 13.0, -2.0), (sx * 9.8, 16.4, -2.6), 0.7, 0.35, "antler", "antler")
            for sx in (-1.0, 1.0)
        ] + [
            cone("head", (sx * 5.4, 10.8, -1.6), (sx * 4.6, 15.6, -1.0), 0.6, 0.3, "antler", "antler")
            for sx in (-1.0, 1.0)
        ]
        + [  # gnarled staff with a curled top holding a green orb
            cone("grip_R", (0, -11.0, 0.4), (0.8, 18.0, 0.4), 1.0, 1.2, "bark", "weapon"),
            cone("grip_R", (0.8, 18.0, 0.4), (-0.6, 26.0, 0.4), 1.2, 1.0, "bark", "weapon"),
            cone("grip_R", (-0.6, 26.0, 0.4), (2.8, 30.0, 0.4), 1.0, 0.8, "bark", "weapon"),
            cone("grip_R", (2.8, 30.0, 0.4), (5.0, 27.0, 0.4), 0.8, 0.5, "bark", "weapon"),
            sph("grip_R", (1.6, 27.0, 0.4), 1.9, "orb", "weapon_g"),
        ]
    ),
    "anim": merge_anims(cape_anim(), {"attack": grip_attack}),
    "group_k": CAPE_K,
}

SKINS = {"mage": MAGE, "priest": PRIEST, "paladin": PALADIN, "shaman": SHAMAN, "druid": DRUID}
