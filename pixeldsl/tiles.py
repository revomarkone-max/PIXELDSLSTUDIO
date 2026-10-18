"""
pixeldsl.tiles - seamless terrain tiles.

Top-down tiles (grass, dirt, sand, stone, water) wrap in both axes; the side-view
`ground` tile wraps horizontally and has a grass edge on top for platformers.
Every random decision and noise lookup wraps around the tile edges, so tiles
repeat with no visible seam. Deterministic: same (material, seed, size) -> same
pixels. Uses only integer hashing for randomness.
"""
import numpy as np

MASK32 = 0xFFFFFFFF

MATERIALS = ("grass", "dirt", "sand", "stone", "water", "ground")

ALIASES = {
    "grass": "grass", "grass_tile": "grass", "tile_grass": "grass",
    "dirt": "dirt", "dirt_tile": "dirt", "tile_dirt": "dirt", "earth": "dirt",
    "sand": "sand", "sand_tile": "sand", "tile_sand": "sand",
    "stone": "stone", "stone_tile": "stone", "tile_stone": "stone", "flagstone": "stone",
    "water": "water", "water_tile": "water", "tile_water": "water",
    "ground": "ground", "ground_side": "ground", "platform": "ground",
}

# Hand-tuned palettes: dark -> light, hue-shifted (cool shadows, warm lights),
# low contrast between neighbouring tones so the tile reads as a calm surface.
PALETTES = {
    "grass": {"0": "#1f4a2c", "1": "#2b6233", "2": "#3a7a3a", "3": "#4f9443", "4": "#74b052",
              "y": "#f0d35a", "f": "#eef0e2", "k": "#18381f"},
    "dirt": {"0": "#3a2618", "1": "#4f3420", "2": "#634229", "3": "#785334",
             "p": "#8b847a", "q": "#b3ab9c", "k": "#24170e"},
    "sand": {"0": "#b0844c", "1": "#c39857", "2": "#d4ab68", "3": "#e2bf7f", "4": "#f0d7a2"},
    "stone": {"m": "#262a35", "0": "#4a5160", "1": "#5a6273", "2": "#6b7486", "3": "#7f8899",
              "4": "#99a2b2", "v": "#4b6f38", "k": "#363b47"},
    "ground": {"0": "#2e1d14", "1": "#3f281b", "2": "#523523", "3": "#66432c",
               "p": "#6c665e", "q": "#938b7e", "k": "#20140e",
               "g": "#2b6233", "G": "#3f8a3f", "H": "#74b052", "d": "#1f4a2c"},
    "water": {"0": "#1c3a66", "1": "#22487d", "2": "#2a5895", "3": "#3770ad", "4": "#6aa6d6",
              "f": "#d8eef8"},
}

BAYER4 = (
    (0, 8, 2, 10),
    (12, 4, 14, 6),
    (3, 11, 1, 9),
    (15, 7, 13, 5),
)


def ihash(x, y, s):
    """32-bit integer hash -> float in [0, 1). Mirrors tilegen.js exactly."""
    h = (x * 374761393 + y * 668265263 + s * 1442695041) & MASK32
    h = ((h ^ (h >> 13)) * 1274126177) & MASK32
    h = (h ^ (h >> 16)) & MASK32
    return h / 4294967296.0


def _smooth(t):
    return t * t * (3.0 - 2.0 * t)


def periodic_noise(x, y, w, h, cells, seed):
    """Value noise with `cells` lattice cells across the tile; wraps at w/h."""
    cx = cells
    cy = max(1, (cells * h + w // 2) // w)
    gx = x * cx / w
    gy = y * cy / h
    ix = int(gx)
    iy = int(gy)
    fx = _smooth(gx - ix)
    fy = _smooth(gy - iy)
    x0 = ix % cx
    x1 = (ix + 1) % cx
    y0 = iy % cy
    y1 = (iy + 1) % cy
    a = ihash(x0, y0, seed)
    b = ihash(x1, y0, seed)
    c = ihash(x0, y1, seed)
    d = ihash(x1, y1, seed)
    top = a + (b - a) * fx
    bot = c + (d - c) * fx
    return top + (bot - top) * fy


def fbm(x, y, w, h, seed, base_cells):
    """3-octave periodic fractal noise in [0, 1)."""
    n1 = periodic_noise(x, y, w, h, base_cells, seed)
    n2 = periodic_noise(x, y, w, h, base_cells * 2, seed + 101)
    n3 = periodic_noise(x, y, w, h, base_cells * 4, seed + 202)
    return (n1 * 0.6 + n2 * 0.28 + n3 * 0.12)


def _frac(v):
    return v - int(v) if v >= 0 else v - int(v) + 1.0


def _tone(v, levels, x, y, spread):
    """Quantise v in [0,1) to `levels` tones with 4x4 ordered dithering."""
    d = (BAYER4[y & 3][x & 3] + 0.5) / 16.0 - 0.5
    t = int((v + d * spread) * levels)
    if t < 0:
        t = 0
    if t > levels - 1:
        t = levels - 1
    return t


def _base_cells(w):
    return max(2, w // 8)


def _gen_grass(w, h, seed, frame):
    g = [["2"] * w for _ in range(h)]
    bc = _base_cells(w)
    for y in range(h):
        for x in range(w):
            v = fbm(x, y, w, h, seed, bc)
            g[y][x] = "123"[_tone(v * 1.1 - 0.05, 3, x, y, 0.2)]
    # grass blades: short vertical strokes, light tip over a darker root
    n_blades = (w * h) // 9
    for i in range(n_blades):
        bx = int(ihash(i, 1, seed) * w)
        by = int(ihash(i, 2, seed) * h)
        tall = 2 if ihash(i, 3, seed) < 0.55 else 3
        lean = 0
        r = ihash(i, 4, seed)
        if r < 0.2:
            lean = -1
        elif r > 0.8:
            lean = 1
        g[(by + 1) % h][bx] = "0"
        for k in range(tall):
            px = (bx + (lean if k == tall - 1 else 0)) % w
            py = (by - k) % h
            g[py][px] = "4" if k == tall - 1 else "3"
    # a few wildflowers (seed decides how many: 0..3)
    n_flowers = int(ihash(7, 7, seed) * 4)
    for i in range(n_flowers):
        fx = int(ihash(i, 11, seed) * w)
        fy = int(ihash(i, 12, seed) * h)
        g[fy][fx] = "y" if ihash(i, 13, seed) < 0.6 else "f"
        g[(fy + 1) % h][fx] = "k"
    return g


def _gen_dirt(w, h, seed, frame):
    g = [["1"] * w for _ in range(h)]
    bc = _base_cells(w)
    for y in range(h):
        for x in range(w):
            v = fbm(x, y, w, h, seed, bc)
            g[y][x] = "0123"[_tone(v * 1.15 - 0.07, 4, x, y, 0.4)]
    # dark specks
    for i in range((w * h) // 40):
        sx = int(ihash(i, 21, seed) * w)
        sy = int(ihash(i, 22, seed) * h)
        g[sy][sx] = "k"
    # pebbles: 2x1 / 2x2 with highlight and drop shadow
    for i in range(max(2, (w * h) // 170)):
        px = int(ihash(i, 31, seed) * w)
        py = int(ihash(i, 32, seed) * h)
        big = ihash(i, 33, seed) < 0.4
        ph = 2 if big else 1
        for dy in range(ph):
            for dx in range(2):
                g[(py + dy) % h][(px + dx) % w] = "p"
        g[py][px] = "q"
        for dx in range(2):
            g[(py + ph) % h][(px + dx) % w] = "k"
    return g


def _gen_sand(w, h, seed, frame):
    g = [["2"] * w for _ in range(h)]
    bc = _base_cells(w)
    ripples = max(2, h // 10)
    for y in range(h):
        for x in range(w):
            v = fbm(x, y, w, h, seed, bc)
            warp = periodic_noise(x, y, w, h, 2, seed + 7)
            r = _frac(y * ripples / h + warp * 2.4 + v * 0.8)
            t = _tone(v * 0.9 + 0.05, 3, x, y, 0.3) + 1  # tones 1..3
            if r < 0.10:
                t = 0
            elif r < 0.22:
                t = 4 if v > 0.45 else 3
            g[y][x] = str(t)
    return g


def _gen_stone(w, h, seed, frame):
    g = [["m"] * w for _ in range(h)]
    rows = max(2, (h + 8) // 16)
    row_h = h / rows
    stone_id = [[-1] * w for _ in range(h)]
    sid = 0
    for r in range(rows):
        y0 = int(r * row_h)
        y1 = int((r + 1) * row_h)
        # split row into stones with random cut points, offset per row
        cols = max(2, w // 14)
        off = int(ihash(r, 41, seed) * w)
        cuts = []
        for c in range(cols):
            jitter = ihash(r * 17 + c, 42, seed) - 0.5
            cuts.append(int((c + 0.5 + jitter * 0.5) * w / cols + off) % w)
        cuts.sort()
        for c in range(cols):
            a = cuts[c]
            b = cuts[(c + 1) % cols]
            span = (b - a) % w
            if span == 0:
                span = w
            for k in range(1, span):  # column `a` stays mortar
                x = (a + k) % w
                for y in range(y0 + 1, y1):  # row y0 stays mortar
                    stone_id[y % h][x] = sid
            sid += 1
    bc = _base_cells(w)
    for y in range(h):
        for x in range(w):
            s = stone_id[y][x]
            if s < 0:
                m = periodic_noise(x, y, w, h, bc * 2, seed + 55)
                g[y][x] = "v" if m > 0.78 else "m"
                continue
            shade = ihash(s, 43, seed) * 0.35
            v = fbm(x, y, w, h, seed + 9, bc) * 0.65 + shade
            t = _tone(v, 4, x, y, 0.25)  # 0..3
            up = stone_id[(y - 1) % h][x] != s
            left = stone_id[y][(x - 1) % w] != s
            down = stone_id[(y + 1) % h][x] != s
            right = stone_id[y][(x + 1) % w] != s
            if up or left:
                t = min(4, t + 1)
            if down or right:
                t = max(0, t - 1)
            g[y][x] = str(t)
    # hairline cracks inside a few stones
    for i in range(max(1, (w * h) // 400)):
        cx = int(ihash(i, 61, seed) * w)
        cy = int(ihash(i, 62, seed) * h)
        if stone_id[cy][cx] < 0:
            continue
        s = stone_id[cy][cx]
        for k in range(3):
            if stone_id[cy][cx] == s:
                g[cy][cx] = "k"
            cx = (cx + 1) % w
            cy = (cy + (1 if ihash(i * 5 + k, 63, seed) < 0.5 else 0)) % h
    return g


def _gen_water(w, h, seed, frame, frames=8):
    frame = frame % frames
    g = [["2"] * w for _ in range(h)]
    bc = _base_cells(w)
    phase = frame / frames
    for y in range(h):
        for x in range(w):
            v = fbm(x, y, w, h, seed, bc)
            t = _tone(v * 1.1 - 0.05, 3, x, y, 0.15)  # 0..2
            band = _frac(v * 4.0 + phase)
            if band < 0.06:
                t = 4
            elif band < 0.18:
                t = 3
            g[y][x] = str(t)
    # sparkles blink on a per-frame basis (loop-safe: frame index mod frames)
    for i in range(max(2, (w * h) // 160)):
        sx = int(ihash(i, 71, seed) * w)
        sy = int(ihash(i, 72, seed) * h)
        on = int(ihash(i, 73, seed) * frames)
        if on == frame or (on + 1) % frames == frame:
            g[sy][sx] = "f"
    return g


def _gen_ground(w, h, seed, frame):
    """Side-view ground: dirt body, wavy grass cap, blades poking up. Wraps in x only."""
    g = [["2"] * w for _ in range(h)]
    bc = _base_cells(w)
    for y in range(h):
        for x in range(w):
            v = fbm(x, y, w, h, seed, bc)
            g[y][x] = "0123"[_tone(v * 1.1 - 0.05, 4, x, y, 0.35)]
    for i in range(max(2, (w * h) // 150)):          # embedded stones
        px = int(ihash(i, 31, seed) * w)
        py = int(h * 0.45 + ihash(i, 32, seed) * h * 0.5) % h
        g[py][px] = "q"
        g[py][(px + 1) % w] = "p"
        g[(py + 1) % h][px] = "k"
    top = max(3, h // 8)
    for x in range(w):
        # grass cap thickness varies smoothly along x (periodic, so it tiles)
        edge = top + int(periodic_noise(x, 0, w, h, max(2, w // 8), seed + 3) * (h // 6 + 1))
        for y in range(edge):
            g[y][x] = "G" if y < edge - 1 else "d"
        if ihash(x, 5, seed) < 0.5:
            g[edge][x] = "d"
        for y in range(2):                            # transparent air above the cap
            g[y][x] = "."
        if ihash(x, 6, seed) < 0.55:                  # blades
            g[1][x] = "H" if ihash(x, 7, seed) < 0.5 else "G"
            if ihash(x, 8, seed) < 0.35:
                g[0][x] = "H"
        g[2][x] = "H"
    return g


GENERATORS = {
    "grass": _gen_grass,
    "dirt": _gen_dirt,
    "sand": _gen_sand,
    "stone": _gen_stone,
    "water": _gen_water,
    "ground": _gen_ground,
}


def resolve(archetype):
    return ALIASES.get(str(archetype or "").lower().strip())


def generate_tile_spec(archetype, seed=42, width=32, height=32):
    """Return a PixelDSL spec for a seamless tile, or None if not a tile archetype."""
    mat = resolve(archetype)
    if mat is None:
        return None
    w = int(width)
    h = int(height)
    seed = int(seed) & 0x7FFFFFFF
    gen = GENERATORS[mat]
    n_frames = 8 if mat == "water" else 1
    grids = ["".join(row) for row in gen(w, h, seed, 0)]
    frames = []
    for f in range(1, n_frames):
        frames.append({"grid": ["".join(row) for row in gen(w, h, seed, f)]})
    palette = {".": "transparent"}
    palette.update(PALETTES[mat])
    return {
        "name": f"proc_{mat}_tile_s{seed}_{w}x{h}",
        "prompt": f"Seamless {mat} tile (seed={seed}, {w}x{h}) - tilegen",
        "width": w,
        "height": h,
        "symmetry": "none",
        "rle": False,
        "tileable": True,
        "palette": palette,
        "postProcess": {
            "autoOutline": False,
            "autoShading": False,
            "sdfShading": False,
            "selOut": False,
            "tileNormals": True,
        },
        "layers": [],
        "frames": frames,
        "grid": grids,
        "fps": 6 if mat == "water" else 8,
    }


# ----------------------------------------------------------------------------- rendering

def _hex(c):
    c = c.lstrip("#")
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))


def grid_to_rgba(grid, palette):
    h, w = len(grid), len(grid[0])
    out = np.zeros((h, w, 4), dtype=np.uint8)
    for y, row in enumerate(grid):
        for x, ch in enumerate(row):
            col = palette.get(ch)
            if col and col != "transparent":
                out[y, x, :3] = _hex(col)
                out[y, x, 3] = 255
    return out


def normal_map(rgba, strength=2.0, wrap_y=True):
    """Height-from-luminance normal map, sampled with wrap-around so it tiles too."""
    lum = (rgba[:, :, :3].astype(np.float64) @ np.array([0.299, 0.587, 0.114])) / 255.0
    gx = np.roll(lum, -1, axis=1) - np.roll(lum, 1, axis=1)
    if wrap_y:
        gy = np.roll(lum, -1, axis=0) - np.roll(lum, 1, axis=0)
    else:
        p = np.pad(lum, ((1, 1), (0, 0)), mode="edge")
        gy = p[2:] - p[:-2]
    n = np.stack([-gx * strength, gy * strength, np.ones_like(lum)], axis=2)
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    out = np.zeros_like(rgba)
    out[:, :, :3] = np.clip((n * 0.5 + 0.5) * 255, 0, 255).astype(np.uint8)
    out[:, :, 3] = rgba[:, :, 3]
    return out


def render_tile(material, seed=42, width=32, height=32):
    """-> (list of RGBA frames, fps). Water animates (8 frames), others are 1 frame."""
    spec = generate_tile_spec(material, seed, width, height)
    if spec is None:
        raise ValueError("unknown tile material %r (known: %s)" % (material, ", ".join(MATERIALS)))
    grids = [spec["grid"]] + [f["grid"] for f in spec["frames"]]
    return [grid_to_rgba(g, spec["palette"]) for g in grids], spec["fps"]
