"""
pixeldsl command line.

    python -m pixeldsl list
    python -m pixeldsl render  models/characters/mage.json --view side --anim walk --frame 0.25 -o mage.png
    python -m pixeldsl export  models/characters/*.json --views topdown,side --out out/
    python -m pixeldsl export  models/characters/mage.json --views topdown --anims idle,walk,attack \
                               --gamemaker "C:/.../MyGame" --gm-name "spr_h_{name}_{anim}"
    python -m pixeldsl export  models/props/chest.json --godot-res res://art/props
    python -m pixeldsl preview models/characters/mage.json models/props/*.json -o out/preview.html
    python -m pixeldsl watch   models/characters/mage.json --views side --anims idle,walk
    python -m pixeldsl tiles   grass stone water ground --size 32 --seed 7 --out out/tiles
    python -m pixeldsl gallery -o out/gallery.html
"""
import argparse
import glob
import os
import sys
import time
from pathlib import Path

from PIL import Image

from . import builders, export, human, model as model_mod, preview, tiles

ROOT = Path(__file__).resolve().parent.parent
MODELS = ROOT / "models"


def _paths(items):
    out = []
    for it in items:
        hits = glob.glob(it)
        if not hits and not it.endswith(".json"):
            hits = glob.glob(str(MODELS / "**" / (it + ".json")), recursive=True)
        if not hits:
            sys.exit("no model matches %r" % it)
        out += hits
    return out


def _csv(s):
    return [x for x in s.split(",") if x] if s else None


def cmd_list(a):
    print("models:")
    for p in sorted(MODELS.rglob("*.json")):
        print("  ", p.relative_to(ROOT))
    print("views:   ", ", ".join(model_mod.VIEWS))
    print("anims:   ", ", ".join(human.ANIMS), "| props:", ", ".join(model_mod.PROP_ANIMS))
    print("builders:", ", ".join(sorted(builders.BUILDERS)))
    print("rigs:    ", ", ".join(builders.RIGS))
    print("tiles:   ", ", ".join(tiles.MATERIALS))


def cmd_render(a):
    m = model_mod.Model.load(_paths([a.model])[0])
    d = a.dir if a.dir is not None else export.directions(m, a.view)[0]
    r = m.render_frame(a.view, a.anim, a.frame, d, scale=a.scale)
    img = Image.fromarray(r["rgba"], "RGBA")
    box = img.getbbox()
    if box:
        img = img.crop(box)
    if a.zoom > 1:
        img = img.resize((img.width * a.zoom, img.height * a.zoom), Image.NEAREST)
    img.save(a.out)
    print("wrote", a.out)


def cmd_export(a):
    for p in _paths(a.models):
        m = model_mod.Model.load(p)
        t = time.time()
        export.export_model(m, _csv(a.views), _csv(a.anims), a.out, a.scale, a.normals,
                            a.gamemaker, a.gm_name, a.godot_res)
        print("  %s done in %.0fs" % (m.name, time.time() - t))


def build_preview(paths, views, anims, scale, out, live=False, tile_mats=None):
    entries = []
    for p in paths:
        m = model_mod.Model.load(p)
        for view in (views or m.default_views):
            use = [x for x in (anims or m.default_anims) if x in m.anims]
            raw, dirs, origin, size = export.render_view(m, view, use, scale)
            entries.append(preview.entry_from_render(m, view, raw, dirs, origin, size, export.sheet))
    tl = []
    for mat in (tile_mats or []):
        frames, fps = tiles.render_tile(mat, 42, 32, 32)
        tl.append(preview.tile_entry(mat, 42, frames, fps))
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    preview.write_page(out, entries, tl, live)
    return out


def cmd_preview(a):
    t = time.time()
    out = build_preview(_paths(a.models), _csv(a.views), _csv(a.anims), a.scale, a.out, tile_mats=_csv(a.tiles))
    print("wrote %s in %.0fs" % (out, time.time() - t))


def cmd_watch(a):
    paths = _paths(a.models)
    stamp = None
    print("watching", ", ".join(paths), "-> open", a.out, "(Ctrl+C to stop)")
    while True:
        cur = [os.path.getmtime(p) for p in paths]
        if cur != stamp:
            stamp = cur
            try:
                t = time.time()
                build_preview(paths, _csv(a.views), _csv(a.anims) or ["idle", "walk"], a.scale, a.out, live=True)
                print("  rebuilt in %.1fs" % (time.time() - t))
            except Exception as e:  # keep watching after a typo in the JSON
                print("  error:", e)
        time.sleep(0.7)


def cmd_tiles(a):
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    for mat in (a.materials or tiles.MATERIALS):
        frames, fps = tiles.render_tile(mat, a.seed, a.size, a.size)
        name = "%s_s%d_%d" % (mat, a.seed, a.size)
        Image.fromarray(export.sheet([frames]), "RGBA").save(out / (name + ".png"))
        nm = [tiles.normal_map(f, wrap_y=(mat != "ground")) for f in frames]
        Image.fromarray(export.sheet([nm]), "RGBA").save(out / (name + "_n.png"))
        print("  %s: %d frame(s)" % (name, len(frames)))


def cmd_gallery(a):
    paths = [str(p) for p in sorted(MODELS.rglob("*.json"))]
    t = time.time()
    build_preview(paths, None, ["idle", "walk", "attack"] if not a.all else None, a.scale, a.out, tile_mats=list(tiles.MATERIALS))
    print("wrote %s in %.0fs" % (a.out, time.time() - t))


def main(argv=None):
    ap = argparse.ArgumentParser(prog="pixeldsl", description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("list", help="models, views, animations, builders").set_defaults(fn=cmd_list)

    r = sub.add_parser("render", help="one frame to a PNG (quick look)")
    r.add_argument("model"); r.add_argument("--view", default="topdown", choices=list(model_mod.VIEWS))
    r.add_argument("--anim", default="idle"); r.add_argument("--frame", type=float, default=0.0, help="0..1 through the clip")
    r.add_argument("--dir", type=int, help="screen direction in degrees (270 = toward camera); default: first of the view")
    r.add_argument("--scale", type=float, default=1.0); r.add_argument("--zoom", type=int, default=4)
    r.add_argument("-o", "--out", default="out/render.png"); r.set_defaults(fn=cmd_render)

    for name, fn, hlp in (("export", cmd_export, "sprite sheets + metadata (+ GameMaker / Godot)"),
                          ("preview", cmd_preview, "HTML player for models"),
                          ("watch", cmd_watch, "rebuild the preview whenever the model JSON changes")):
        p = sub.add_parser(name, help=hlp)
        p.add_argument("models", nargs="+")
        p.add_argument("--views", help="comma list: " + ",".join(model_mod.VIEWS))
        p.add_argument("--anims", help="comma list: " + ",".join(human.ANIMS))
        p.add_argument("--scale", type=float, default=1.0, help="pixels per unit (0.5 = half-size sprites)")
        if name == "export":
            p.add_argument("--out", default="out")
            p.add_argument("--normals", action="store_true", help="also write normal-map sheets")
            p.add_argument("--gamemaker", help="GameMaker project folder to write sprites into")
            p.add_argument("--gm-name", default="spr_{name}_{view}_{anim}", help="sprite name pattern")
            p.add_argument("--godot-res", help="res:// folder of the sheets -> also write SpriteFrames .tres")
        else:
            p.add_argument("-o", "--out", default="out/preview.html")
            if name == "preview":
                p.add_argument("--tiles", help="comma list of tile materials to include")
        p.set_defaults(fn=fn)

    t = sub.add_parser("tiles", help="seamless tiles (+ normal maps)")
    t.add_argument("materials", nargs="*"); t.add_argument("--seed", type=int, default=42)
    t.add_argument("--size", type=int, default=32); t.add_argument("--out", default="out/tiles"); t.set_defaults(fn=cmd_tiles)

    g = sub.add_parser("gallery", help="everything in models/ + all tiles in one HTML page")
    g.add_argument("-o", "--out", default="out/gallery.html"); g.add_argument("--scale", type=float, default=1.0)
    g.add_argument("--all", action="store_true", help="all animations (slower)"); g.set_defaults(fn=cmd_gallery)

    a = ap.parse_args(argv)
    a.fn(a)
