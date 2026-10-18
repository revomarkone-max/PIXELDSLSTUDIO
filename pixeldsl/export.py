"""
pixeldsl.export - render a model into engine-ready assets.

For each view, every requested animation is rendered for every direction, all
frames are cropped to one shared box (so frame size and origin are identical
across a model's animations), then written as:

  generic   <out>/<name>_<view>_<anim>.png      rows = directions, columns = frames
            <out>/<name>_<view>.json            frame size, origin (feet), dirs, fps, loop and
                                                per-frame anchor points (weapon_tip, hand_R, hand_L,
                                                head + model "anchors"): [x, y, in_front]
            <out>/<name>_<view>_<anim>_n.png    normal maps (--normals)
  gamemaker sprites in a GameMaker project, frames direction-major (dir * n + f)
  godot     <out>/<name>_<view>.tres            SpriteFrames, animations "<anim>_<dir>"
"""
import json
import os
import uuid
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import numpy as np
from PIL import Image

from .model import VIEWS, DIR_NAMES, Model

_CACHE = {}


def _job(args):
    """Worker: rebuild the model from its JSON (models hold lambdas, so they are not pickled)."""
    data_json, view, anim, u, d, scale, normals = args
    m = _CACHE.get(data_json)
    if m is None:
        m = _CACHE[data_json] = Model(json.loads(data_json))
    r = m.render_frame(view, anim, u, d, scale=scale, normals=normals)
    return r["rgba"], r["normal"], r["origin"], r["anchors"]


def _src_hash():
    import hashlib
    h = hashlib.sha1()
    for p in sorted(Path(__file__).resolve().parent.glob("*.py")):
        if p.name not in ("cli.py", "preview.py", "export.py"):
            h.update(p.read_bytes())
    return h.hexdigest()[:12]


SRC_HASH = _src_hash()


def cache_dir():
    env = os.environ.get("PIXELDSL_CACHE")
    if env == "off":
        return None
    d = Path(env) if env else Path(__file__).resolve().parent.parent / "out" / ".cache"
    d.mkdir(parents=True, exist_ok=True)
    return d


def _cache_path(data_json, view, anim, dirs, scale, normals):
    import hashlib
    d = cache_dir()
    if d is None:
        return None
    key = hashlib.sha1(("%s|%s|%s|%s|%s|%s|%s" % (SRC_HASH, data_json, view, anim, dirs, scale, normals)).encode()).hexdigest()
    return d / (key + ".npz")


def workers():
    env = os.environ.get("PIXELDSL_WORKERS")
    return int(env) if env else max(1, (os.cpu_count() or 1))

NS = uuid.UUID("6f1c2b0e-7a51-4c55-9a3e-5d1b2c9e0f42")


def uid(*parts):
    return str(uuid.uuid5(NS, "/".join(map(str, parts))))


def directions(model, view):
    custom = (model.data.get("dirs") or {}).get(view)
    if custom:
        return list(custom)
    if model.kind == "prop" and view in ("topdown", "iso"):
        return [270]
    return list(VIEWS[view]["dirs"])


def render_view(model, view, anims, scale=1.0, normals=False, progress=None):
    """-> dict(anim -> {"frames": [[rgba per frame] per dir], "normals": ...}), crop box, origin."""
    dirs = directions(model, view)
    data_json = json.dumps(model.data, sort_keys=True)
    raw, origin, todo = {}, None, []
    for anim in anims:
        cp = _cache_path(data_json, view, anim, dirs, scale, normals)
        if cp is not None and cp.exists():
            z = np.load(cp)
            raw[anim] = {"frames": [list(r) for r in z["frames"]],
                         "normals": [list(r) for r in z["normals"]] if normals else None,
                         "points": json.loads(str(z["points"]))}
            origin = tuple(z["origin"])
        else:
            todo.append((anim, cp))
    jobs, keys = [], []
    for anim, _ in todo:
        n = model.frames(anim)
        for di, d in enumerate(dirs):
            for f in range(n):
                u = f / n if model.loops(anim) else (f / (n - 1) if n > 1 else 0.0)
                jobs.append((data_json, view, anim, u, d, scale, normals))
                keys.append((anim, di, f))
    if jobs:
        nw = min(workers(), len(jobs))
        if nw > 1:
            with ProcessPoolExecutor(max_workers=nw) as ex:
                results = list(ex.map(_job, jobs, chunksize=4))
        else:
            results = [_job(j) for j in jobs]
        for anim, _ in todo:
            raw[anim] = {"frames": [[None] * model.frames(anim) for _ in dirs],
                         "normals": [[None] * model.frames(anim) for _ in dirs] if normals else None,
                         "points": {}}
        origin = results[0][2]
        for (anim, di, f), (rgba, nrm, _, pts) in zip(keys, results):
            raw[anim]["frames"][di][f] = rgba
            if normals:
                raw[anim]["normals"][di][f] = nrm
            for name, p in pts.items():
                per_dir = raw[anim]["points"].setdefault(name, [[None] * model.frames(anim) for _ in dirs])
                per_dir[di][f] = list(p)
        for anim, cp in todo:
            if cp is not None:
                np.savez_compressed(cp, frames=np.array(raw[anim]["frames"]), origin=np.array(origin),
                                    normals=np.array(raw[anim]["normals"]) if normals else np.zeros(1),
                                    points=np.array(json.dumps(raw[anim]["points"])))
    raw = {a: raw[a] for a in anims}
    # one crop box for the whole view
    mask = None
    for a in raw.values():
        for row in a["frames"]:
            for img in row:
                m = img[:, :, 3] > 0
                mask = m if mask is None else (mask | m)
    ys, xs = np.nonzero(mask)
    if ys.size == 0:
        raise RuntimeError("%s/%s: nothing rendered" % (model.name, view))
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    # keep the feet/origin column centred so mirrored or turning frames stay stable
    ox = int(round(origin[0])); oy = int(round(origin[1]))
    half = max(ox - x0, x1 - ox)
    x0, x1 = ox - half, ox + half
    box = (int(x0), int(y0), int(x1), int(max(y1, oy + 1)))
    for a in raw.values():
        for key in ("frames", "normals"):
            if a[key] is None:
                continue
            a[key] = [[img[box[1]:box[3], box[0]:box[2]] for img in row] for row in a[key]]
        # anchor points -> frame pixel coordinates [x, y, in_front]
        a["points"] = {n: [[[round(p[0] - box[0], 1), round(p[1] - box[1], 1), p[2]] for p in row] for row in v]
                       for n, v in a.get("points", {}).items()}
    return raw, dirs, (ox - box[0], oy - box[1]), (box[2] - box[0], box[3] - box[1])


def sheet(rows):
    h, w = rows[0][0].shape[:2]
    out = np.zeros((h * len(rows), w * len(rows[0]), 4), dtype=np.uint8)
    for r, row in enumerate(rows):
        for c, img in enumerate(row):
            out[r * h:(r + 1) * h, c * w:(c + 1) * w] = img
    return out


def write_generic(model, view, raw, dirs, origin, size, out_dir, scale):
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    meta = {
        "name": model.name, "view": view, "scale": scale,
        "frame": {"w": size[0], "h": size[1]}, "origin": {"x": origin[0], "y": origin[1]},
        "dirs": [{"deg": d, "name": DIR_NAMES.get(d, str(d))} for d in dirs],
        "layout": "rows = dirs (in order), columns = frames",
        "anims": {},
    }
    for anim, a in raw.items():
        fn = "%s_%s_%s.png" % (model.name, view, anim)
        Image.fromarray(sheet(a["frames"]), "RGBA").save(out_dir / fn)
        entry = {"file": fn, "frames": len(a["frames"][0]), "fps": model.fps(anim), "loop": model.loops(anim),
                 "points": a["points"]}
        if a["normals"] is not None:
            nfn = "%s_%s_%s_n.png" % (model.name, view, anim)
            Image.fromarray(sheet(a["normals"]), "RGBA").save(out_dir / nfn)
            entry["normal"] = nfn
        meta["anims"][anim] = entry
    (out_dir / ("%s_%s.json" % (model.name, view))).write_text(json.dumps(meta, indent=2), encoding="utf-8")
    return meta


# ----------------------------------------------------------------------------- GameMaker

def _gm_sprite_yy(name, frame_ids, layer_id, w, h, ox, oy, folder, fps):
    fr = "".join(
        '    {"$GMSpriteFrame":"v1","%%Name":"%s","name":"%s","resourceType":"GMSpriteFrame","resourceVersion":"2.0",},\n' % (f, f)
        for f in frame_ids)
    keys = "".join(
        '            {"$Keyframe<SpriteFrameKeyframe>":"","Channels":{\n'
        '                "0":{"$SpriteFrameKeyframe":"","Id":{"name":"%s","path":"sprites/%s/%s.yy",},"resourceType":"SpriteFrameKeyframe","resourceVersion":"2.0",},\n'
        '              },"Disabled":false,"id":"%s","IsCreationKey":false,"Key":%d.0,"Length":1.0,"resourceType":"Keyframe<SpriteFrameKeyframe>","resourceVersion":"2.0","Stretch":false,},\n'
        % (f, name, name, uid(name, "key", i), i) for i, f in enumerate(frame_ids))
    lines = [
        '{', '  "$GMSprite":"v2",', '  "%%Name":"%s",' % name, '  "bboxMode":0,',
        '  "bbox_bottom":%d,' % (h - 1), '  "bbox_left":0,', '  "bbox_right":%d,' % (w - 1), '  "bbox_top":0,',
        '  "collisionKind":1,', '  "collisionTolerance":0,', '  "DynamicTexturePage":false,',
        '  "edgeFiltering":false,', '  "For3D":false,', '  "frames":[', fr + '  ],',
        '  "gridX":0,', '  "gridY":0,', '  "height":%d,' % h, '  "HTile":false,', '  "layers":[',
        '    {"$GMImageLayer":"","%%Name":"%s","blendMode":0,"displayName":"default","isLocked":false,"name":"%s","opacity":100.0,"resourceType":"GMImageLayer","resourceVersion":"2.0","visible":true,},' % (layer_id, layer_id),
        '  ],', '  "name":"%s",' % name, '  "nineSlice":null,', '  "origin":9,', '  "parent":{',
        '    "name":"%s",' % folder, '    "path":"folders/%s.yy",' % folder, '  },',
        '  "preMultiplyAlpha":false,', '  "resourceType":"GMSprite",', '  "resourceVersion":"2.0",',
        '  "sequence":{', '    "$GMSequence":"v1",', '    "%%Name":"%s",' % name, '    "autoRecord":true,',
        '    "backdropHeight":768,', '    "backdropImageOpacity":0.5,', '    "backdropImagePath":"",',
        '    "backdropWidth":1366,', '    "backdropXOffset":0.0,', '    "backdropYOffset":0.0,',
        '    "events":{"$KeyframeStore<MessageEventKeyframe>":"","Keyframes":[],"resourceType":"KeyframeStore<MessageEventKeyframe>","resourceVersion":"2.0",},',
        '    "eventStubScript":null,', '    "eventToFunction":{},', '    "length":%d.0,' % len(frame_ids),
        '    "lockOrigin":false,',
        '    "moments":{"$KeyframeStore<MomentsEventKeyframe>":"","Keyframes":[],"resourceType":"KeyframeStore<MomentsEventKeyframe>","resourceVersion":"2.0",},',
        '    "name":"%s",' % name, '    "playback":1,', '    "playbackSpeed":%.1f,' % fps, '    "playbackSpeedType":0,',
        '    "resourceType":"GMSequence",', '    "resourceVersion":"2.0",', '    "showBackdrop":true,',
        '    "showBackdropImage":false,', '    "timeUnits":1,', '    "tracks":[',
        '      {"$GMSpriteFramesTrack":"","builtinName":0,"events":[],"inheritsTrackColour":true,"interpolation":1,"isCreationTrack":false,"keyframes":{"$KeyframeStore<SpriteFrameKeyframe>":"","Keyframes":[',
        keys + '          ],"resourceType":"KeyframeStore<SpriteFrameKeyframe>","resourceVersion":"2.0",},"modifiers":[],"name":"frames","resourceType":"GMSpriteFramesTrack","resourceVersion":"2.0","spriteId":null,"trackColour":0,"tracks":[],"traits":0,},',
        '    ],', '    "visibleRange":null,', '    "volume":1.0,', '    "xorigin":%d,' % ox, '    "yorigin":%d,' % oy, '  },',
        '  "swatchColours":null,', '  "swfPrecision":0.5,', '  "textureGroupId":{', '    "name":"Default",',
        '    "path":"texturegroups/Default",', '  },', '  "type":0,', '  "VTile":false,', '  "width":%d,' % w, '}',
    ]
    return "\n".join(lines)


def write_gamemaker(model, view, raw, origin, size, project, name_pattern="spr_{name}_{view}_{anim}", folder="ART"):
    project = Path(project)
    yyp = next(project.glob("*.yyp"))
    names = []
    for anim, a in raw.items():
        name = name_pattern.format(name=model.name, view=view, anim=anim)
        sdir = project / "sprites" / name
        layer = uid(name, "layer")
        ids = []
        for d, row in enumerate(a["frames"]):
            for f, img in enumerate(row):
                fid = uid(name, d, f)
                ids.append(fid)
                im = Image.fromarray(img, "RGBA")
                (sdir / "layers" / fid).mkdir(parents=True, exist_ok=True)
                im.save(sdir / ("%s.png" % fid))
                im.save(sdir / "layers" / fid / ("%s.png" % layer))
        (sdir / ("%s.yy" % name)).write_text(
            _gm_sprite_yy(name, ids, layer, size[0], size[1], origin[0], origin[1], folder, model.fps(anim)), encoding="utf-8")
        names.append(name)
    text = yyp.read_text(encoding="utf-8")
    anchor = '  "resources":[\n'
    if anchor not in text:
        raise RuntimeError("unexpected .yyp layout (no resources list): %s" % yyp)
    add = "".join('    {"id":{"name":"%s","path":"sprites/%s/%s.yy",},},\n' % (n, n, n) for n in names
                  if '"name":"%s","path":"sprites/' % n not in text)
    if add:
        yyp.write_text(text.replace(anchor, anchor + add, 1), encoding="utf-8")
    return names


# ----------------------------------------------------------------------------- Godot

def write_godot(model, view, meta, dirs, out_dir, res_path):
    """SpriteFrames referencing the generic sheets (res_path = where they live in the Godot project)."""
    res_path = res_path.rstrip("/")
    w, h = meta["frame"]["w"], meta["frame"]["h"]
    ext, subs, anims = [], [], []
    for ai, (anim, entry) in enumerate(meta["anims"].items()):
        ext_id = "%d_%s" % (ai + 1, anim)
        ext.append('[ext_resource type="Texture2D" path="%s/%s" id="%s"]' % (res_path, entry["file"], ext_id))
        for di, d in enumerate(dirs):
            refs = []
            for f in range(entry["frames"]):
                sid = "AtlasTexture_%s_%d_%d" % (anim, di, f)
                subs.append('[sub_resource type="AtlasTexture" id="%s"]\natlas = ExtResource("%s")\nregion = Rect2(%d, %d, %d, %d)\n'
                            % (sid, ext_id, f * w, di * h, w, h))
                refs.append('{\n"duration": 1.0,\n"texture": SubResource("%s")\n}' % sid)
            anims.append('{\n"frames": [%s],\n"loop": %s,\n"name": &"%s_%s",\n"speed": %.1f\n}'
                         % (", ".join(refs), "true" if entry["loop"] else "false", anim, DIR_NAMES.get(d, str(d)), entry["fps"]))
    steps = len(ext) + len(subs) + 1
    text = ('[gd_resource type="SpriteFrames" load_steps=%d format=3]\n\n' % steps + "\n".join(ext) + "\n\n"
            + "\n".join(subs) + "\n[resource]\nanimations = [" + ", ".join(anims) + "]\n")
    path = Path(out_dir) / ("%s_%s.tres" % (model.name, view))
    path.write_text(text, encoding="utf-8")
    return path


def export_model(model, views=None, anims=None, out_dir="out", scale=1.0, normals=False,
                 gamemaker=None, gm_name="spr_{name}_{view}_{anim}", godot_res=None, log=print):
    views = views or model.default_views
    anims = anims or model.default_anims
    results = {}
    for view in views:
        use = [a for a in anims if a in model.anims]
        raw, dirs, origin, size = render_view(model, view, use, scale, normals)
        meta = write_generic(model, view, raw, dirs, origin, size, out_dir, scale)
        res = {"meta": meta}
        if gamemaker:
            res["gamemaker"] = write_gamemaker(model, view, raw, origin, size, gamemaker, gm_name)
        if godot_res:
            res["godot"] = str(write_godot(model, view, meta, dirs, out_dir, godot_res))
        results[view] = res
        if log:
            log("  %s/%s: %d anims x %d dirs, frame %dx%d" % (model.name, view, len(use), len(dirs), size[0], size[1]))
    return results
