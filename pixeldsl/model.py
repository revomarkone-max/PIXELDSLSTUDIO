"""
pixeldsl.model - load JSON models and render frames in any view.

Model JSON (see models/ for complete examples):

    {
      "name": "mage",
      "type": "character",            # "character" = human base, "prop" = static object
      "hide": ["hair"],               # base body groups to hide
      "rigs": ["cape", "grip"],       # extra joints + their animation (builders.RIGS)
      "materials": {"robe": ["#141a3a", "#212c5e", "#2f3f86", "#4258b0"],
                    "silver": {"ramp": [...5 colours...], "gloss": true}},
      "parts": [
        {"robe": {"mat": "robe", "hem_r": 12}},                       # builder call
        {"cone": {"joint": "head", "a": [0,5,0], "b": [0,14,-2],      # raw primitive
                  "r1": 6, "r2": 3, "mat": "robe", "group": "hat"}},
        {"ellipsoid": {...}, "mirror": true}                          # also adds the mirrored copy
      ]
    }

Materials are 4-colour ramps dark -> light (5th colour = specular for "gloss").
"""
import copy
import json
import math
from pathlib import Path

import numpy as np

from . import builders, engine, human

# View presets: camera elevation and the directions rendered (GameMaker/screen degrees:
# 0 = right, 90 = up, 270 = toward the camera).
VIEWS = {
    "topdown": {"elevation": 35.0, "dirs": [270, 315, 0, 45, 90, 135, 180, 225]},
    "side":    {"elevation": 0.0,  "dirs": [0, 180]},
    "iso":     {"elevation": 30.0, "dirs": [315, 45, 135, 225]},
    "front":   {"elevation": 12.0, "dirs": [270]},
}

DIR_NAMES = {270: "down", 315: "down_right", 0: "right", 45: "up_right",
             90: "up", 135: "up_left", 180: "left", 225: "down_left"}

PROP_ANIMS = {
    "idle": (lambda u: ({}, (0, 0, 0)), 1, 1, True),
    "spin": (lambda u: ({"root": (0, 360.0 * u, 0)}, (0, 0, 0)), 8, 10, True),
    "bob":  (lambda u: ({"root": (0, 0, 0)}, (0, 2.0 * math.sin(u * 2 * math.pi), 0)), 6, 8, True),
}

CANVAS = 200          # render canvas at scale 1 (cropped on export)
ORIGIN = (100, 170)   # feet / ground point inside the canvas


def yaw_for_direction(d):
    """Model yaw so that its forward (+z) points to screen direction d on the ground."""
    r = math.radians(d)
    return math.degrees(math.atan2(math.cos(r), -math.sin(r)))


def _mirror_vec(v):
    v = list(v)
    return [-v[0]] + v[1:]


def _swap_side(name):
    if name.endswith("_R"):
        return name[:-2] + "_L"
    if name.endswith("_L"):
        return name[:-2] + "_R"
    return name


def mirror_prims(prims):
    out = []
    for p in prims:
        q = copy.deepcopy(p)
        for k in ("at", "a", "b", "a_off", "b_off"):
            if k in q and not (k in ("a", "b") and q["kind"] == "seg"):
                q[k] = _mirror_vec(q[k])
        for k in ("joint", "a", "b"):
            if isinstance(q.get(k), str):
                q[k] = _swap_side(q[k])
        if "rot" in q:
            rx, ry, rz = q["rot"]
            q["rot"] = (rx, -ry, -rz)
        q["group"] = _swap_side(q.get("group", "g")) + ("" if q.get("group", "").endswith(("_R", "_L")) else "_m")
        out.append(q)
    return out


def expand_parts(parts):
    prims = []
    for entry in parts:
        entry = dict(entry)
        mirror = entry.pop("mirror", False)
        if len(entry) != 1:
            raise ValueError("each part needs exactly one builder key: %r" % list(entry))
        (name, args), = entry.items()
        fn = builders.BUILDERS.get(name)
        if fn is None:
            raise ValueError("unknown builder %r (known: %s)" % (name, ", ".join(sorted(builders.BUILDERS))))
        args = dict(args)
        if "joint" in args:
            args["j"] = args.pop("joint")
        made = fn(**args)
        prims += made
        if mirror:
            prims += mirror_prims(made)
    return prims


def _material(v):
    return {"ramp": list(v)} if isinstance(v, (list, tuple)) else dict(v)


class Model:
    def __init__(self, data, source=None):
        self.data = data
        self.source = source
        self.name = data.get("name") or (Path(source).stem if source else "model")
        self.kind = data.get("type", "character")
        rigs = [builders.RIGS[r] for r in data.get("rigs", [])]
        if self.kind == "character":
            joints = list(human.JOINTS)
            mats = {k: dict(v) for k, v in human.BASE_MATERIALS.items()}
            hide = set(data.get("hide", []))
            prims = [p for p in human.body_primitives() if p.get("group") not in hide]
            self.anims = dict(human.ANIMS)
            group_k = dict(human.GROUP_K)
        else:
            joints = [("root", None, (0.0, 0.0, 0.0))]
            mats, prims, group_k = {}, [], {}
            self.anims = dict(PROP_ANIMS)
        for r in rigs:
            joints += r["joints"]
            group_k.update(r["group_k"])
        mats.update({k: _material(v) for k, v in data.get("materials", {}).items()})
        prims += expand_parts(data.get("parts", []))
        group_k.update(data.get("group_k", {}))
        self.skel = engine.Skeleton(joints)
        names = list(mats)
        index = {n: i for i, n in enumerate(names)}
        self.materials = [mats[n] for n in names]
        for p in prims:
            if p["mat"] not in index:
                raise ValueError("%s: unknown material %r" % (self.name, p["mat"]))
            p["mat_id"] = index[p["mat"]]
        self.prims = prims
        self.group_k = group_k
        self.rig_anims = [r["anims"] for r in rigs]
        self.outline = data.get("outline", "#16121d")
        self.default_anims = data.get("anims") or (["idle", "walk", "run", "attack", "cast", "jump", "hurt", "death"]
                                                   if self.kind == "character" else ["idle"])
        self.default_views = data.get("views") or (["topdown", "side"] if self.kind == "character" else ["topdown"])

    @classmethod
    def load(cls, path):
        path = Path(path)
        return cls(json.loads(path.read_text(encoding="utf-8")), source=str(path))

    def pose(self, anim, u, direction):
        fn = self.anims[anim][0]
        rots, root = fn(u)
        rots = dict(rots)
        for ra in self.rig_anims:
            extra = ra.get(anim) or ra.get("idle")
            if extra:
                for k, v in extra(u).items():
                    a = rots.get(k, (0, 0, 0))
                    rots[k] = (a[0] + v[0], a[1] + v[1], a[2] + v[2])
        r = rots.get("root", (0, 0, 0))
        rots["root"] = (r[0], r[1] + yaw_for_direction(direction), r[2])
        return self.skel.pose(rots, root)

    def frames(self, anim):
        return self.anims[anim][1]

    def fps(self, anim):
        return self.anims[anim][2]

    def loops(self, anim):
        return self.anims[anim][3]

    def render_frame(self, view, anim, u, direction, scale=1.0, normals=False):
        v = VIEWS[view] if isinstance(view, str) else view
        size = int(math.ceil(CANVAS * scale))
        cam = engine.Camera(size, size, (ORIGIN[0] * scale, ORIGIN[1] * scale), v["elevation"], scale)
        J = self.pose(anim, u, direction)
        resolved = engine.resolve_primitives(self.prims, J)
        scene = engine.Scene(resolved, self.group_k)
        out = engine.render(scene, resolved, cam, self.materials, outline=self.outline, normals=normals)
        out["origin"] = cam.ox, cam.oy
        return out
