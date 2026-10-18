"""
tools/gallery.py - visual regression gallery for PixelDSL (stdlib only).

Renders every procedural archetype, every seamless tile (shown repeated 3x3)
and every paper-doll loadout in three directions, then writes a single
self-contained HTML page (images embedded as data URIs, upscaled with
`image-rendering: pixelated`). Open it after any change to the generators and
look at it: if something does not read at 1x, it is not done.

    python tools/gallery.py                # -> gallery/index.html
    python tools/gallery.py --seeds 1 42 7 # several seeds per archetype
"""
import argparse
import base64
import html
import os
import struct
import sys
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

import pixeldsl  # noqa: E402
import paperdoll  # noqa: E402
import tilegen  # noqa: E402

SPRITE_ARCHETYPES = [
    "sword", "axe", "shield", "bow", "staff", "potion", "gem",
    "slime", "beetle", "turtle", "bunny", "dragon", "spider", "snake", "golem",
    "flower", "mushroom", "boulder", "crystal_monolith", "spaceship",
    "lightning", "fireball",
]


def png_bytes(width, height, rgba):
    """Encode an RGBA buffer as PNG in memory."""
    raw = bytearray()
    stride = width * 4
    for y in range(height):
        raw.append(0)
        raw.extend(rgba[y * stride:(y + 1) * stride])

    def chunk(tag, data):
        body = tag + data
        return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)

    return (b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
            + chunk(b"IEND", b""))


def data_uri(width, height, rgba):
    return "data:image/png;base64," + base64.b64encode(png_bytes(width, height, rgba)).decode("ascii")


def render_spec(spec, frame=0):
    if spec.get("type") == "rig":
        r = pixeldsl.render_rig(spec, frame)
    else:
        r = pixeldsl.render_sprite(spec, frame)
    return r["width"], r["height"], r["buffer"]


def card(title, uri, w, h, scale, tile=False):
    t = html.escape(title)
    if tile:
        size = w * scale
        img = (f'<div class="tile" style="width:{size * 3}px;height:{h * scale * 3}px;'
               f'background-image:url({uri});background-size:{size}px {h * scale}px"></div>')
    else:
        img = f'<img src="{uri}" width="{w * scale}" height="{h * scale}" alt="{t}">'
    return f'<figure>{img}<figcaption>{t}</figcaption></figure>'


def build(seeds, size, out_path):
    sections = []

    cards = []
    for mat in tilegen.MATERIALS:
        for seed in seeds:
            spec = tilegen.generate_tile_spec(mat, seed, size, size)
            w, h, buf = render_spec(spec)
            cards.append(card(f"{mat} s{seed}", data_uri(w, h, buf), w, h, 3, tile=True))
    sections.append(("Seamless tiles (3x3 repeat)", cards))

    cards = []
    for arch in SPRITE_ARCHETYPES:
        for seed in seeds:
            spec = pixeldsl.generate_archetype(arch, seed, size, size)
            w, h, buf = render_spec(spec)
            cards.append(card(f"{arch} s{seed}", data_uri(w, h, buf), w, h, 4))
    sections.append(("Procedural archetypes", cards))

    cards = []
    for lid, lo in paperdoll.LOADOUTS.items():
        for d in ("down", "right", "up"):
            spec = paperdoll.assemble_spec(lo.get("mannequin", "humanoid"), lo["slots"], "walk",
                                           lo.get("theme", "steel"), 8, d, True)
            w, h, buf = render_spec(spec, 2)
            cards.append(card(f"{lid} {d}", data_uri(w, h, buf), w, h, 3))
    sections.append(("Paper doll loadouts (walk, frame 2)", cards))

    body = "".join(f"<h2>{html.escape(name)}</h2><div class='grid'>{''.join(c)}</div>" for name, c in sections)
    page = f"""<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>PixelDSL Gallery</title><style>
body{{background:#2a2d36;color:#e5e7eb;font:14px system-ui,sans-serif;margin:16px}}
h2{{font-weight:600;margin:28px 0 12px}}
.grid{{display:flex;flex-wrap:wrap;gap:12px}}
figure{{margin:0;padding:8px;background:#353945;border-radius:6px}}
img,.tile{{image-rendering:pixelated;display:block}}
.tile{{background-repeat:repeat}}
figcaption{{font-size:12px;color:#9ca3af;margin-top:6px}}
</style></head><body><h1>PixelDSL Gallery</h1>
<p>seeds: {", ".join(map(str, seeds))} &middot; size: {size}px</p>{body}</body></html>"""
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(page, encoding="utf-8")
    return out_path


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--seeds", type=int, nargs="+", default=[42, 7])
    ap.add_argument("--size", type=int, default=32)
    ap.add_argument("-o", "--out", default=str(ROOT / "gallery" / "index.html"))
    args = ap.parse_args()
    path = build(args.seeds, args.size, Path(args.out))
    print(f"Gallery written: {path}")


if __name__ == "__main__":
    main()
