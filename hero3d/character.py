"""
hero3d.character - compose base + skin, render 8 directions x animations.
"""
import math
import numpy as np
from . import engine, base

# Direction index -> GameMaker direction (degrees, 0 = right, 90 = up on screen).
# 0 = facing the camera (down), then counter-clockwise on screen: down-right, right, ...
DIRS8 = [270, 315, 0, 45, 90, 135, 180, 225]


def yaw_for_direction(d):
    """Model yaw so that its forward (+z) points to screen direction d on the ground."""
    r = math.radians(d)
    return math.degrees(math.atan2(math.cos(r), -math.sin(r)))


class Character:
    def __init__(self, skin=None, elevation=35.0, width=96, height=112, origin=(48, 98)):
        skin = skin or {}
        # skins may add their own joints (cape chain, weapon grip...) after the base ones
        self.skel = engine.Skeleton(base.JOINTS + list(skin.get("joints", [])))
        mats = dict(base.BASE_MATERIALS)
        mats.update(skin.get("materials", {}))
        prims = [p for p in base.body_primitives() if p.get("group") not in set(skin.get("hide_groups", []))]
        prims += skin.get("parts", [])
        names = list(mats.keys())
        self.mat_index = {n: i for i, n in enumerate(names)}
        self.materials = [mats[n] for n in names]
        for p in prims:
            p["mat_id"] = self.mat_index[p["mat"]]
        self.prims = prims
        self.group_k = dict(base.GROUP_K)
        self.group_k.update(skin.get("group_k", {}))
        self.cam = engine.Camera(width, height, origin, elevation)
        self.outline = skin.get("outline", "#16121d")
        self.anim_override = skin.get("anim", {})

    def joints(self, anim, u, direction):
        fn, _ = base.ANIMS[anim]
        rots, root = fn(u)
        extra = self.anim_override.get(anim)
        if extra:
            for k, v in extra(u).items():
                a = rots.get(k, (0, 0, 0))
                rots[k] = (a[0] + v[0], a[1] + v[1], a[2] + v[2])
        yaw = yaw_for_direction(direction)
        r_root = rots.get("root", (0, 0, 0))
        rots["root"] = (r_root[0], r_root[1] + yaw, r_root[2])
        return self.skel.pose(rots, root)

    def render_frame(self, anim, u, direction):
        J = self.joints(anim, u, direction)
        scene = engine.Scene(engine.resolve_primitives(self.prims, J), self.group_k)
        img, depth, mat = engine.render(scene, self.cam, self.materials, outline=self.outline)
        return img

    def render_anim(self, anim, frames=None, dirs=DIRS8):
        n = frames or base.ANIMS[anim][1]
        return [[self.render_frame(anim, f / n, d) for f in range(n)] for d in dirs]
