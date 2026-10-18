"""
hero3d.gm_export - render a skin (8 directions x idle/walk/attack) and write it as
GameMaker sprites into a project, plus preview sheets into game_ready/heroes/.

    python -m hero3d.gm_export --project "C:/.../Quality MOBA graybox" mage priest ...

GameMaker sprite per hero per animation: spr_h_<hero>_<anim>, frames ordered
direction-major: frame = dir * frames_per_dir + f, dir 0 = facing the camera then
counter-clockwise on screen (see character.DIRS8). Origin = feet.
Frame file names are deterministic (uuid5), so re-exporting overwrites in place.
"""
import argparse
import json
import os
import sys
import time
import uuid
from pathlib import Path

import numpy as np
from PIL import Image

from . import base, character, skins

NS = uuid.UUID("6f1c2b0e-7a51-4c55-9a3e-5d1b2c9e0f42")
REPO = Path(__file__).resolve().parent.parent


def uid(*parts):
    return str(uuid.uuid5(NS, "/".join(map(str, parts))))


def sprite_yy(name, frame_ids, layer_id, w, h, ox, oy, folder="ART", fps=10.0):
    fr = "".join(
        '    {"$GMSpriteFrame":"v1","%%Name":"%s","name":"%s","resourceType":"GMSpriteFrame","resourceVersion":"2.0",},\n' % (f, f)
        for f in frame_ids)
    keys = "".join(
        '            {"$Keyframe<SpriteFrameKeyframe>":"","Channels":{\n'
        '                "0":{"$SpriteFrameKeyframe":"","Id":{"name":"%s","path":"sprites/%s/%s.yy",},"resourceType":"SpriteFrameKeyframe","resourceVersion":"2.0",},\n'
        '              },"Disabled":false,"id":"%s","IsCreationKey":false,"Key":%d.0,"Length":1.0,"resourceType":"Keyframe<SpriteFrameKeyframe>","resourceVersion":"2.0","Stretch":false,},\n'
        % (f, name, name, uid(name, "key", i), i) for i, f in enumerate(frame_ids))
    return """{
  "$GMSprite":"v2",
  "%%Name":"%(name)s",
  "bboxMode":0,
  "bbox_bottom":%(bb)d,
  "bbox_left":0,
  "bbox_right":%(br)d,
  "bbox_top":0,
  "collisionKind":1,
  "collisionTolerance":0,
  "DynamicTexturePage":false,
  "edgeFiltering":false,
  "For3D":false,
  "frames":[
%(frames)s  ],
  "gridX":0,
  "gridY":0,
  "height":%(h)d,
  "HTile":false,
  "layers":[
    {"$GMImageLayer":"","%%Name":"%(layer)s","blendMode":0,"displayName":"default","isLocked":false,"name":"%(layer)s","opacity":100.0,"resourceType":"GMImageLayer","resourceVersion":"2.0","visible":true,},
  ],
  "name":"%(name)s",
  "nineSlice":null,
  "origin":9,
  "parent":{
    "name":"%(folder)s",
    "path":"folders/%(folder)s.yy",
  },
  "preMultiplyAlpha":false,
  "resourceType":"GMSprite",
  "resourceVersion":"2.0",
  "sequence":{
    "$GMSequence":"v1",
    "%%Name":"%(name)s",
    "autoRecord":true,
    "backdropHeight":768,
    "backdropImageOpacity":0.5,
    "backdropImagePath":"",
    "backdropWidth":1366,
    "backdropXOffset":0.0,
    "backdropYOffset":0.0,
    "events":{
      "$KeyframeStore<MessageEventKeyframe>":"",
      "Keyframes":[],
      "resourceType":"KeyframeStore<MessageEventKeyframe>",
      "resourceVersion":"2.0",
    },
    "eventStubScript":null,
    "eventToFunction":{},
    "length":%(n)d.0,
    "lockOrigin":false,
    "moments":{
      "$KeyframeStore<MomentsEventKeyframe>":"",
      "Keyframes":[],
      "resourceType":"KeyframeStore<MomentsEventKeyframe>",
      "resourceVersion":"2.0",
    },
    "name":"%(name)s",
    "playback":1,
    "playbackSpeed":%(fps).1f,
    "playbackSpeedType":0,
    "resourceType":"GMSequence",
    "resourceVersion":"2.0",
    "showBackdrop":true,
    "showBackdropImage":false,
    "timeUnits":1,
    "tracks":[
      {"$GMSpriteFramesTrack":"","builtinName":0,"events":[],"inheritsTrackColour":true,"interpolation":1,"isCreationTrack":false,"keyframes":{"$KeyframeStore<SpriteFrameKeyframe>":"","Keyframes":[
%(keys)s          ],"resourceType":"KeyframeStore<SpriteFrameKeyframe>","resourceVersion":"2.0",},"modifiers":[],"name":"frames","resourceType":"GMSpriteFramesTrack","resourceVersion":"2.0","spriteId":null,"trackColour":0,"tracks":[],"traits":0,},
    ],
    "visibleRange":null,
    "volume":1.0,
    "xorigin":%(ox)d,
    "yorigin":%(oy)d,
  },
  "swatchColours":null,
  "swfPrecision":0.5,
  "textureGroupId":{
    "name":"Default",
    "path":"texturegroups/Default",
  },
  "type":0,
  "VTile":false,
  "width":%(w)d,
}""" % dict(name=name, frames=fr, keys=keys, layer=layer_id, w=w, h=h, bb=h - 1, br=w - 1,
            ox=ox, oy=oy, n=len(frame_ids), folder=folder, fps=fps)


def register_in_yyp(yyp_path, names):
    text = yyp_path.read_text(encoding="utf-8")
    anchor = '  "resources":[\n'
    if anchor not in text:
        raise RuntimeError("unexpected .yyp layout: no resources list")
    add = ""
    for n in names:
        entry = '{"id":{"name":"%s","path":"sprites/%s/%s.yy",},},' % (n, n, n)
        if entry not in text:
            add += "    " + entry + "\n"
    if add:
        text = text.replace(anchor, anchor + add, 1)
        yyp_path.write_text(text, encoding="utf-8")
    return add.count("\n")


def export_hero(hero, project=None, scale_preview=4):
    skin = skins.SKINS[hero]
    ch = character.Character(skin)
    W, H = ch.cam.w, ch.cam.h
    ox, oy = ch.cam.ox, ch.cam.oy
    out_dir = REPO / "game_ready" / "heroes"
    out_dir.mkdir(parents=True, exist_ok=True)
    made = []
    for anim, (fn, nf) in base.ANIMS.items():
        t0 = time.time()
        frames = ch.render_anim(anim)          # [dir][frame] -> HxWx4
        clipped = any(np.any(img[0, :, 3]) or np.any(img[:, 0, 3]) or np.any(img[:, -1, 3])
                      for row in frames for img in row)
        sheet = Image.new("RGBA", (W * nf, H * 8))
        for d, row in enumerate(frames):
            for f, img in enumerate(row):
                sheet.paste(Image.fromarray(img, "RGBA"), (f * W, d * H))
        sheet.save(out_dir / f"{hero}_{anim}_sheet.png")
        print(f"  {hero}/{anim}: {8 * nf} frames in {time.time() - t0:.0f}s" + ("  [WARNING: touches canvas edge]" if clipped else ""))
        if project:
            name = f"spr_h_{hero}_{anim}"
            sdir = Path(project) / "sprites" / name
            layer = uid(name, "layer")
            ids = []
            for d, row in enumerate(frames):
                for f, img in enumerate(row):
                    fid = uid(name, d, f)
                    ids.append(fid)
                    im = Image.fromarray(img, "RGBA")
                    (sdir / "layers" / fid).mkdir(parents=True, exist_ok=True)
                    im.save(sdir / f"{fid}.png")
                    im.save(sdir / "layers" / fid / f"{layer}.png")
            (sdir / f"{name}.yy").write_text(sprite_yy(name, ids, layer, W, H, ox, oy), encoding="utf-8")
            made.append(name)
    meta = {"hero": hero, "width": W, "height": H, "origin": [ox, oy],
            "dirs": character.DIRS8, "anims": {a: n for a, (f, n) in base.ANIMS.items()}}
    (out_dir / f"{hero}_meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    return made


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("heroes", nargs="*", default=list(skins.SKINS))
    ap.add_argument("--project", help="GameMaker project folder (contains the .yyp)")
    args = ap.parse_args()
    names = []
    for h in args.heroes:
        print(f"[{h}]")
        names += export_hero(h, args.project)
    if args.project:
        yyp = next(Path(args.project).glob("*.yyp"))
        n = register_in_yyp(yyp, names)
        print(f"registered {n} new sprite(s) in {yyp.name}")


if __name__ == "__main__":
    main()
