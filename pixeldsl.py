#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PixelDSL CLI v3.0 — Autonomous 2D Pixel-Art Mathematical Engine & Asset Compiler (8x8 .. 128x128).
Zero external dependencies (uses only Python 3 standard library: json, zlib, struct, math, base64, subprocess).

Six Mathematical Pillars of PixelDSL v3.0:
1. 2.5D SDF & CSG Algebra: Exact Inigo Quilez SDFs (gradient-normalized ellipse, uneven_capsule,
   vesica, moon, bezier_sdf, star/ngon), universal 2D inverse affine rotation, CSG Booleans
   (union, smooth_union, subtract, smooth_subtract, intersect, onion), polarRepeat, domainWarp,
   unclamped continuous SDF normals, 2.5D Z-buffers with automatic 1px Internal Anatomical Creases
   (Delta-Z / Delta-N), Selective Outlining, and tangent-space Normal Map export (_normal.png).
2. Felzenszwalb & Huttenlocher O(W*H) 2D Euclidean Distance Transform (EDT) + Discrete Pixel-Art
   Morphology (1px cardinal spur/pimple pruning, pinhole filling, L-corner jaggie cleanup, and
   RotSprite EPX 2x clean stamp rotation).
3. Perceptual Björn Ottosson Oklab / Oklch Color Engine + Procedural Surface Micro-Shaders
   (worley F2-F1 cellular ridges, voronoi F1, turing activator-inhibitor reaction-diffusion,
   bayer4x4, blue_noise) + 5-tone SDF auto-registration into symbol_buffer for lossless Bake-to-Grid.
4. Kinematic Bone Hierarchy (parent / pivot), Analytical Law-of-Cosines 2-Bone IK Solver (ik),
   and Declarative Procedural Motion Generators (idle_breathe, walk_cycle, swim_cycle, jump_arc, wave)
   with volume-preserving Squash & Stretch (rx * ry = const) and phase-lagged secondary follow-through.
5. 100% LLM-Free Parametric Archetype Generator (--generate <archetype> --seed <N>), Evolutionary
   Genome Mutator (--mutate), and MarkovJunior-style local cellular rewrite rules ("rules").
6. Pure-Python RFC-2083 5-Filter PNG Decoder + Chroma-Key (#FF00FF) Oklab Despiller + Connected-Component
   Strip Slicer + SLIC Edge-Snapping Superpixel Downsampler (--import-image).
"""

import argparse
import base64
import copy
import json
import math
import os
import re
import struct
import subprocess
import sys
import zlib
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tilegen  # noqa: E402

BUILTIN_PALETTES = {
    "pico8": {
        ".": "transparent",
        "O": "#000000", "D": "#1d2b53", "P": "#7e2553", "G": "#008751",
        "B": "#ab5236", "g": "#5f574f", "s": "#c2c3c7", "w": "#fff1e8",
        "r": "#ff004d", "o": "#ffa300", "y": "#ffec27", "l": "#00e436",
        "b": "#29adff", "i": "#83769c", "p": "#ff77a8", "f": "#ffccaa"
    },
    "gameboy": {
        ".": "transparent",
        "O": "#0f380f",
        "D": "#306230",
        "s": "#8bac0f",
        "w": "#9bbc0f"
    },
    "endesga32": {
        ".": "transparent",
        "O": "#181425", "r": "#e43b44", "o": "#feae34", "y": "#fee761",
        "g": "#63c74d", "G": "#3e8948", "D": "#265c42", "t": "#193c3e",
        "b": "#0099db", "c": "#2ce8f5", "w": "#ffffff", "s": "#c0cbdc",
        "m": "#8b9bb4", "d": "#5a6988", "n": "#3a4466", "p": "#b55088"
    }
}

BAYER_2X2 = (
    (-0.06, 0.02),
    (0.06, -0.02)
)

BAYER_4X4 = (
    (0.0 / 16.0, 8.0 / 16.0, 2.0 / 16.0, 10.0 / 16.0),
    (12.0 / 16.0, 4.0 / 16.0, 14.0 / 16.0, 6.0 / 16.0),
    (3.0 / 16.0, 11.0 / 16.0, 1.0 / 16.0, 9.0 / 16.0),
    (15.0 / 16.0, 7.0 / 16.0, 13.0 / 16.0, 5.0 / 16.0)
)

SDF_SHAPE_OPS = (
    "ellipse", "rect", "polygon", "capsule", "uneven_capsule",
    "vesica", "moon", "bezier_sdf", "star", "ngon"
)


# ============================================================================
# Deterministic Seeded PRNG (Mulberry32-compatible across Python & JS)
# ============================================================================

class SeededRNG:
    def __init__(self, seed=42):
        self.state = int(seed) & 0xFFFFFFFF
        if self.state == 0:
            self.state = 0x6D2B79F5

    def next_float(self):
        self.state = (self.state + 0x6D2B79F5) & 0xFFFFFFFF
        t = self.state
        t = ((t ^ (t >> 15)) * (t | 1)) & 0xFFFFFFFF
        t = (t ^ (t + (((t ^ (t >> 7)) * (t | 61)) & 0xFFFFFFFF))) & 0xFFFFFFFF
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296.0

    def range(self, low, high):
        return low + (high - low) * self.next_float()

    def randint(self, low, high):
        return int(math.floor(self.range(low, high + 0.999999)))

    def choice(self, seq):
        if not seq:
            return None
        return seq[int(math.floor(self.next_float() * len(seq))) % len(seq)]


def hash2d(ix, iy, seed=0):
    h = (int(ix) * 374761393 + int(iy) * 668265263 + int(seed) * 1442695041) & 0xFFFFFFFF
    h = ((h ^ (h >> 13)) * 1274126177) & 0xFFFFFFFF
    return ((h ^ (h >> 16)) & 0xFFFFFFFF) / 4294967296.0


def value_noise2d(x, y, seed=0):
    ix = math.floor(x)
    iy = math.floor(y)
    fx = x - ix
    fy = y - iy
    ux = fx * fx * (3.0 - 2.0 * fx)
    uy = fy * fy * (3.0 - 2.0 * fy)
    n00 = hash2d(ix, iy, seed)
    n10 = hash2d(ix + 1, iy, seed)
    n01 = hash2d(ix, iy + 1, seed)
    n11 = hash2d(ix + 1, iy + 1, seed)
    nx0 = n00 + (n10 - n00) * ux
    nx1 = n01 + (n11 - n01) * ux
    return nx0 + (nx1 - nx0) * uy


# ============================================================================
# Pillar 3: Perceptual Oklab / Oklch Color Engine
# ============================================================================

def clamp_size(val, fallback=32):
    try:
        n = int(val)
    except (ValueError, TypeError):
        return fallback
    return max(8, min(128, n))


def parse_color(color_str):
    if not color_str or not isinstance(color_str, str):
        return (0, 0, 0, 0)
    s = color_str.strip().lower()
    if s in ("transparent", "none", ""):
        return (0, 0, 0, 0)
    if s.startswith("#"):
        h = s[1:]
        try:
            if len(h) == 3:
                return (int(h[0] * 2, 16), int(h[1] * 2, 16), int(h[2] * 2, 16), 255)
            if len(h) == 4:
                return (int(h[0] * 2, 16), int(h[1] * 2, 16), int(h[2] * 2, 16), int(h[3] * 2, 16))
            if len(h) == 6:
                return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), 255)
            if len(h) == 8:
                return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), int(h[6:8], 16))
        except ValueError:
            return (0, 0, 0, 255)
    return (0, 0, 0, 255)


def rgba_to_hex(r, g, b, a=255):
    def ch(v):
        return f"{max(0, min(255, int(round(v)))):02x}"
    if a <= 0:
        return "transparent"
    if a < 255:
        return f"#{ch(r)}{ch(g)}{ch(b)}{ch(a)}"
    return f"#{ch(r)}{ch(g)}{ch(b)}"


def _srgb_to_linear(c):
    v = max(0.0, min(1.0, c / 255.0))
    return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4


def _linear_to_srgb(v):
    v = max(0.0, min(1.0, v))
    c = 12.92 * v if v <= 0.0031308 else 1.055 * (v ** (1.0 / 2.4)) - 0.055
    return max(0, min(255, int(round(c * 255.0))))


def rgb_to_oklab(r, g, b):
    lr = _srgb_to_linear(r)
    lg = _srgb_to_linear(g)
    lb = _srgb_to_linear(b)
    l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
    m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
    s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb
    l_ = l ** (1.0 / 3.0) if l > 0 else 0.0
    m_ = m ** (1.0 / 3.0) if m > 0 else 0.0
    s_ = s ** (1.0 / 3.0) if s > 0 else 0.0
    L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
    a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
    b_val = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
    return (L, a, b_val)


def oklab_to_rgb(L, a, b_val):
    l_ = L + 0.3963377774 * a + 0.2158037573 * b_val
    m_ = L - 0.1055613458 * a - 0.0638541728 * b_val
    s_ = L - 0.0894841775 * a - 1.2914855480 * b_val
    l = max(0.0, l_) ** 3
    m = max(0.0, m_) ** 3
    s = max(0.0, s_) ** 3
    lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    return (_linear_to_srgb(lr), _linear_to_srgb(lg), _linear_to_srgb(lb))


def rgb_to_oklch(r, g, b):
    L, a, b_val = rgb_to_oklab(r, g, b)
    C = math.sqrt(a * a + b_val * b_val)
    h = math.degrees(math.atan2(b_val, a)) % 360.0
    return (L, C, h)


def oklch_to_rgb(L, C, h_deg):
    rad = math.radians(h_deg)
    return oklab_to_rgb(L, C * math.cos(rad), C * math.sin(rad))


def _shift_hue_toward(h_deg, target_deg, amount):
    diff = ((target_deg - h_deg + 180.0) % 360.0) - 180.0
    return (h_deg + diff * amount) % 360.0


def generate_color_ramp(base_hex):
    """Generates a harmonious 4-tone pixel-art ramp in perceptual Oklch space."""
    r, g, b, a = parse_color(base_hex)
    L, C, h = rgb_to_oklch(r, g, b)
    is_neutral = C < 0.025

    # Warm highlight shift toward golden sunlight (~90 deg in Oklch)
    L_light = min(0.97, L + (1.0 - L) * 0.42 + 0.06)
    C_light = C * 0.85 if not is_neutral else min(0.015, C + 0.005)
    h_light = _shift_hue_toward(h, 90.0, 0.18 if not is_neutral else 0.0)
    lr, lg, lb = oklch_to_rgb(L_light, C_light, h_light)

    # Cool shadow shift toward indigo (~275 deg) or warm berry if pink/red
    shadow_target = 335.0 if (h > 315.0 or h < 25.0) else 275.0
    L_dark = max(0.14, L * 0.74 - 0.04)
    C_dark = min(0.28, C * 1.08 + 0.012) if not is_neutral else min(0.022, C + 0.012)
    h_dark = _shift_hue_toward(h, shadow_target, 0.22)
    dr, dg, db = oklch_to_rgb(L_dark, C_dark, h_dark)

    # Deep tinted outline
    L_out = max(0.16, min(0.26, L * 0.34))
    C_out = min(0.14, C * 0.75 + 0.02) if not is_neutral else 0.025
    h_out = _shift_hue_toward(h, shadow_target, 0.35)
    or_, og, ob = oklch_to_rgb(L_out, C_out, h_out)

    return {
        "base": base_hex,
        "light": rgba_to_hex(lr, lg, lb, a),
        "dark": rgba_to_hex(dr, dg, db, a),
        "outline": rgba_to_hex(or_, og, ob, 255)
    }


def derive_sdf_shading_tones(base_rgba):
    """Derives 5 perceptual Oklch RGBA tones for 3D SDF Volume Shading."""
    r, g, b, a = base_rgba
    L, C, h = rgb_to_oklch(r, g, b)
    is_neutral = C < 0.025
    shadow_target = 335.0 if (h > 315.0 or h < 25.0) else 275.0

    # Deep shadow
    ds_rgb = oklch_to_rgb(
        max(0.12, L * 0.68 - 0.05),
        min(0.28, C * 1.10 + 0.015) if not is_neutral else min(0.025, C + 0.014),
        _shift_hue_toward(h, shadow_target, 0.25)
    )
    # Soft shadow
    sh_rgb = oklch_to_rgb(
        max(0.18, L * 0.84 - 0.02),
        min(0.28, C * 1.04 + 0.008) if not is_neutral else min(0.018, C + 0.008),
        _shift_hue_toward(h, shadow_target, 0.14)
    )
    # Highlight
    hi_rgb = oklch_to_rgb(
        min(0.96, L + (1.0 - L) * 0.36 + 0.04),
        C * 0.88 if not is_neutral else C,
        _shift_hue_toward(h, 90.0, 0.16 if not is_neutral else 0.0)
    )
    # Specular
    sp_rgb = oklch_to_rgb(
        min(0.99, L + (1.0 - L) * 0.68 + 0.07),
        C * 0.55 if not is_neutral else C * 0.5,
        _shift_hue_toward(h, 92.0, 0.25 if not is_neutral else 0.0)
    )

    return {
        "deepShadow": (ds_rgb[0], ds_rgb[1], ds_rgb[2], a),
        "shadow": (sh_rgb[0], sh_rgb[1], sh_rgb[2], a),
        "base": (r, g, b, a),
        "highlight": (hi_rgb[0], hi_rgb[1], hi_rgb[2], a),
        "specular": (sp_rgb[0], sp_rgb[1], sp_rgb[2], a)
    }


def resolve_full_palette(spec):
    merged = {".": "transparent"}
    preset = spec.get("palettePreset")
    if preset and preset in BUILTIN_PALETTES:
        merged.update(BUILTIN_PALETTES[preset])
    if isinstance(spec.get("palette"), dict):
        merged.update(spec["palette"])
    ramps = spec.get("ramps")
    if isinstance(ramps, dict):
        for key, cfg in ramps.items():
            if isinstance(cfg, str):
                ramp = generate_color_ramp(cfg)
                merged[key] = ramp["base"]
                dark_key = key.upper() if key.upper() != key else f"{key}_dark"
                merged[dark_key] = ramp["dark"]
                merged[f"{key}_light"] = ramp["light"]
                if "O" not in merged:
                    merged["O"] = ramp["outline"]
            elif isinstance(cfg, dict) and cfg.get("base"):
                ramp = generate_color_ramp(cfg["base"])
                merged[key] = ramp["base"]
                if cfg.get("light") and cfg["light"] not in merged:
                    merged[cfg["light"]] = ramp["light"]
                elif cfg.get("light") and not (spec.get("palette") or {}).get(cfg["light"]):
                    merged[cfg["light"]] = ramp["light"]
                if cfg.get("dark") and not (spec.get("palette") or {}).get(cfg["dark"]):
                    merged[cfg["dark"]] = ramp["dark"]
                if cfg.get("outline") and not (spec.get("palette") or {}).get(cfg["outline"]):
                    merged[cfg["outline"]] = ramp["outline"]
    return merged


def expand_rle(row_str):
    return re.sub(r"(\d+)(.)", lambda m: m.group(2) * min(256, int(m.group(1))), row_str)


def normalize_grid(grid, width, height, use_rle=False, symmetry="none"):
    warnings = []
    normalized = []
    rows = grid if isinstance(grid, list) else []

    for y in range(height):
        raw = str(rows[y] or "") if y < len(rows) else ""
        if use_rle:
            raw = expand_rle(raw)
        if symmetry == "horizontal" and len(raw) == (width // 2) and len(raw) > 0:
            raw = raw + raw[::-1]
        if y < len(rows) and len(raw) != width:
            warnings.append(f"Row {y + 1}: length {len(raw)} != {width}")
        if len(raw) < width:
            raw = raw.ljust(width, ".")
        elif len(raw) > width:
            raw = raw[:width]
        normalized.append(raw)

    if len(rows) > 0 and len(rows) != height:
        warnings.append(f"Grid row count: {len(rows)} != {height}")

    return normalized, warnings


# ============================================================================
# Pillar 3: Procedural Surface Micro-Shaders (Worley/Voronoi, Turing, Bayer)
# ============================================================================

def worley_f1_f2(x, y, scale=5.0, seed=0):
    sx = x / max(1.0, float(scale))
    sy = y / max(1.0, float(scale))
    ix = math.floor(sx)
    iy = math.floor(sy)
    f1 = 1e9
    f2 = 1e9
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            cx = ix + dx
            cy = iy + dy
            px = cx + 0.15 + 0.70 * hash2d(cx, cy, seed + 17)
            py = cy + 0.15 + 0.70 * hash2d(cx, cy, seed + 53)
            d2 = (sx - px) ** 2 + (sy - py) ** 2
            if d2 < f1:
                f2 = f1
                f1 = d2
            elif d2 < f2:
                f2 = d2
    return math.sqrt(f1), math.sqrt(f2)


def turing_pattern(x, y, scale=1.0, seed=0):
    """Multi-scale activator-inhibitor reaction-diffusion approximation."""
    s = max(0.5, float(scale))
    u = value_noise2d(x / (1.8 * s), y / (1.8 * s), seed + 101)
    v = value_noise2d(x / (3.8 * s), y / (3.8 * s), seed + 307)
    detail = value_noise2d(x / (1.1 * s), y / (1.1 * s), seed + 509)
    return (u - v) + 0.18 * (detail - 0.5)


def check_dither(pattern, x, y, nx=0.0, ny=0.0, scale=5.0, seed=0):
    if not pattern or pattern == "none":
        return False
    if pattern == "checker":
        return (x + y) % 2 == 1
    if pattern == "sparse":
        return (x % 2 == 0) and (y % 2 == 0)
    if pattern == "grid":
        return (x % 3 == 0) or (y % 3 == 0)
    if pattern == "scales":
        row = y // 3
        offset = (row % 2) * 2
        lx = (x + offset) % 4
        ly = y % 3
        return (ly == 2 and lx in (1, 2)) or (ly == 1 and lx == 0)
    if pattern == "bayer4x4":
        return BAYER_4X4[y & 3][x & 3] > 0.5
    if pattern == "blue_noise":
        ign = (52.9829189 * ((0.06711056 * x + 0.00583715 * y) % 1.0)) % 1.0
        return ign > 0.55
    if pattern == "worley":
        # Project onto 3D dome surface normals for curvature-wrapped scutes/facets
        wx = x + nx * 2.2
        wy = y + ny * 2.2
        f1, f2 = worley_f1_f2(wx, wy, scale, seed)
        return (f2 - f1) < 0.22
    if pattern == "voronoi":
        wx = x + nx * 2.0
        wy = y + ny * 2.0
        f1, _ = worley_f1_f2(wx, wy, scale, seed)
        return f1 < 0.36
    if pattern == "turing":
        return turing_pattern(x + nx * 1.5, y + ny * 1.5, scale / 4.0, seed) > 0.045
    return False


# ============================================================================
# Pillar 2: Felzenszwalb & Huttenlocher O(W * H) Euclidean Distance Transform
#           + Discrete Pixel-Art Morphology + RotSprite Stamp Rotation
# ============================================================================

def edt_1d(f, n):
    """Exact 1D parabolic lower-envelope squared Euclidean Distance Transform in O(N)."""
    d = [0.0] * n
    v = [0] * n
    z = [0.0] * (n + 1)
    k = 0
    v[0] = 0
    z[0] = -1e20
    z[1] = 1e20
    for q in range(1, n):
        s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2.0 * (q - v[k]))
        while s <= z[k]:
            k -= 1
            s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2.0 * (q - v[k]))
        k += 1
        v[k] = q
        z[k] = s
        z[k + 1] = 1e20
    k = 0
    for q in range(n):
        while z[k + 1] < q:
            k += 1
        dx = q - v[k]
        d[q] = dx * dx + f[v[k]]
    return d


def edt_2d_sq(feature_mask, width, height):
    """Computes squared distance to nearest pixel where feature_mask[i] != 0 in O(W*H)."""
    inf = 1e12
    grid = [0.0 if feature_mask[i] else inf for i in range(width * height)]
    # Pass 1: columns
    for x in range(width):
        col = [grid[y * width + x] for y in range(height)]
        d_col = edt_1d(col, height)
        for y in range(height):
            grid[y * width + x] = d_col[y]
    # Pass 2: rows
    for y in range(height):
        row_start = y * width
        row = grid[row_start:row_start + width]
        d_row = edt_1d(row, width)
        grid[row_start:row_start + width] = d_row
    return grid


def compute_edt_sdf(mask, width, height):
    """Converts any binary mask (1 inside, 0 outside) into a continuous Signed Distance Field."""
    inv_mask = [0 if mask[i] else 1 for i in range(width * height)]
    d_out_sq = edt_2d_sq(inv_mask, width, height)
    d_in_sq = edt_2d_sq(mask, width, height)
    sdf = [0.0] * (width * height)
    for i in range(width * height):
        if mask[i]:
            sdf[i] = -(math.sqrt(d_out_sq[i]) - 0.5)
        else:
            sdf[i] = math.sqrt(d_in_sq[i]) - 0.5
    return sdf


def js_round(val):
    """Matches JavaScript Math.round(x) = Math.floor(x + 0.5) for 1-to-1 cross-runtime parity."""
    return int(math.floor(float(val) + 0.5))


def clean_sdf_mask(full_mask, sdf_field, width, height, prune_spurs=True):
    """
    Discrete pixel-art morphological filter:
    1. Fills 1px isolated interior pinholes (4 orthogonal neighbors all active).
    2. Prunes 1px cardinal-axis aliasing pimples/spurs (<= 1 orthogonal neighbor) and
       ultra-shallow grazing L-steps (< 0.04px depth) on curved shapes.
    """
    if not prune_spurs:
        return full_mask
    active_total = sum(full_mask)
    if active_total <= 4:
        return full_mask

    # Pass 1: Fill 1px pinholes
    filled = bytearray(full_mask)
    for y in range(1, height - 1):
        for x in range(1, width - 1):
            idx = y * width + x
            if not filled[idx]:
                ortho = (
                    filled[y * width + (x - 1)] +
                    filled[y * width + (x + 1)] +
                    filled[(y - 1) * width + x] +
                    filled[(y + 1) * width + x]
                )
                if ortho == 4:
                    filled[idx] = 1

    # Pass 2: Prune 1px cardinal spurs/pimples and grazing tangent slivers on boundary pixels
    cleaned = bytearray(filled)
    for y in range(height):
        for x in range(width):
            idx = y * width + x
            if not filled[idx]:
                continue
            depth = -sdf_field[idx]
            if depth > 0.65:
                continue
            has_l = 1 if (x > 0 and filled[y * width + (x - 1)]) else 0
            has_r = 1 if (x < width - 1 and filled[y * width + (x + 1)]) else 0
            has_u = 1 if (y > 0 and filled[(y - 1) * width + x]) else 0
            has_d = 1 if (y < height - 1 and filled[(y + 1) * width + x]) else 0
            ortho = has_l + has_r + has_u + has_d
            if ortho <= 1:
                cleaned[idx] = 0
            elif active_total >= 12 and ortho == 2 and (has_l != has_r) and (has_u != has_d) and depth < 0.04:
                cleaned[idx] = 0
    return cleaned


def rotate_stamp_epx(grid_rows, angle_deg):
    """RotSprite-inspired EPX 2x upscaling + inverse rotation for clean pixel stamp rotation."""
    h = len(grid_rows)
    w = max((len(str(r)) for r in grid_rows), default=0)
    if w == 0 or h == 0:
        return []
    mat = [str(r).ljust(w, ".") for r in grid_rows]
    # EPX 2x upscale
    w2, h2 = w * 2, h * 2
    epx = [["."] * w2 for _ in range(h2)]
    for y in range(h):
        for x in range(w):
            p = mat[y][x]
            a = mat[y - 1][x] if y > 0 else "."
            b = mat[y][x + 1] if x < w - 1 else "."
            c = mat[y][x - 1] if x > 0 else "."
            d = mat[y + 1][x] if y < h - 1 else "."
            p1 = a if (c == a and c != d and a != b) else p
            p2 = b if (a == b and a != c and b != d) else p
            p3 = c if (d == c and d != b and c != a) else p
            p4 = d if (b == d and b != a and d != c) else p
            epx[y * 2][x * 2] = p1
            epx[y * 2][x * 2 + 1] = p2
            epx[y * 2 + 1][x * 2] = p3
            epx[y * 2 + 1][x * 2 + 1] = p4

    rad = math.radians(angle_deg)
    cos_a = math.cos(-rad)
    sin_a = math.sin(-rad)
    cx = (w - 1) * 0.5
    cy = (h - 1) * 0.5
    pad = int(math.ceil(math.hypot(w, h) * 0.5)) + 1
    out_pts = []
    for dy in range(-pad, pad + 1):
        for dx in range(-pad, pad + 1):
            lx = dx * cos_a - dy * sin_a + cx
            ly = dx * sin_a + dy * cos_a + cy
            sx2 = js_round(lx * 2.0)
            sy2 = js_round(ly * 2.0)
            if 0 <= sx2 < w2 and 0 <= sy2 < h2:
                ch = epx[sy2][sx2]
                if ch not in (".", " "):
                    out_pts.append((js_round(cx + dx), js_round(cy + dy), ch))
    return out_pts


# ============================================================================
# Pillar 1: 2.5D SDF & CSG Algebra (Quilez Primitives + Domain Ops)
# ============================================================================

def smin(a, b, k):
    if not k or k <= 0:
        return min(a, b)
    h = max(k - abs(a - b), 0.0) / float(k)
    return min(a, b) - h * h * k * 0.25


def csg_combine(d_a, d_b, op_mode="union", k=0.0):
    mode = str(op_mode or "union").lower()
    if mode == "subtract":
        return max(d_a, -d_b)
    if mode == "smooth_subtract":
        return -smin(-d_a, d_b, k if k > 0 else 1.5)
    if mode == "intersect":
        return max(d_a, d_b)
    if mode == "smooth_union" or k > 0:
        return smin(d_a, d_b, k)
    return min(d_a, d_b)


def _sd_uneven_capsule_local(px, py, x1, y1, x2, y2, r1, r2):
    dx = x2 - x1
    dy = y2 - y1
    l_seg = math.hypot(dx, dy)
    if l_seg < 1e-5:
        return math.hypot(px - x1, py - y1) - max(r1, r2)
    ux = dx / l_seg
    uy = dy / l_seg
    qx = (px - x1) * ux + (py - y1) * uy
    qy = abs(-(px - x1) * uy + (py - y1) * ux)
    b = (r1 - r2) / l_seg
    if abs(b) >= 0.9999:
        return min(math.hypot(px - x1, py - y1) - r1, math.hypot(px - x2, py - y2) - r2)
    a = math.sqrt(max(0.0, 1.0 - b * b))
    k = qx * a - qy * b
    if k < 0.0:
        return math.hypot(qx, qy) - r1
    if k > a * l_seg:
        return math.hypot(qx - l_seg, qy) - r2
    return qx * b + qy * a - r1


def _sd_vesica_local(lx, ly, rx, ry):
    # Vesica with horizontal half-width rx and vertical half-height ry
    if rx > ry:
        lx, ly = ly, lx
        rx, ry = ry, rx
    a = max(0.5, float(ry))
    b = max(0.25, min(float(rx), a - 0.05))
    r = (a * a + b * b) / (2.0 * b)
    d = (a * a - b * b) / (2.0 * b)
    px = abs(lx)
    py = abs(ly)
    if (py - a) * d > px * a:
        return math.hypot(px, py - a)
    return math.hypot(px + d, py) - r


def _sd_moon_local(lx, ly, d, ra, rb):
    py = abs(ly)
    a = (ra * ra - rb * rb + d * d) / max(1e-5, 2.0 * d)
    b = math.sqrt(max(0.0, ra * ra - a * a))
    if d * (lx * b - py * a) > d * d * max(b - py, 0.0):
        return math.hypot(lx - a, py - b)
    return max(math.hypot(lx, py) - ra, -(math.hypot(lx - d, py) - rb))


def _sd_star_local(lx, ly, r, n_pts=5, ratio=0.45):
    n = max(3, int(n_pts))
    m = max(0.15, min(1.0, float(ratio)))
    an = math.pi / float(n)
    # Rotate so vertex points straight up (-Y)
    ang = math.atan2(lx, -ly) % (2.0 * an)
    if ang > an:
        ang = 2.0 * an - ang
    dist_p = math.hypot(lx, ly)
    px = dist_p * math.cos(ang)
    py = dist_p * math.sin(ang)
    # Segment from outer vertex (r, 0) to inner vertex (r*m*cos(an), r*m*sin(an))
    ax, ay = r, 0.0
    bx, by = r * m * math.cos(an), r * m * math.sin(an)
    vx, vy = bx - ax, by - ay
    wx, wy = px - ax, py - ay
    t = max(0.0, min(1.0, (wx * vx + wy * vy) / max(1e-7, vx * vx + vy * vy)))
    dx = wx - vx * t
    dy = wy - vy * t
    # At origin (0,0), vx*wy - vy*wx = +r*vy > 0, which is inside (negative SDF)
    s = -1.0 if (vx * wy - vy * wx) > 0.0 else 1.0
    return math.hypot(dx, dy) * s


def _sd_bezier_local(px, py, p0, p1, p2, r1, r2):
    min_d = 1e9
    steps = 16
    x0, y0 = float(p0[0]), float(p0[1])
    x1, y1 = float(p1[0]), float(p1[1])
    x2, y2 = float(p2[0]), float(p2[1])
    prev_x, prev_y = x0, y0
    prev_r = r1
    for s in range(1, steps + 1):
        t = s / float(steps)
        inv = 1.0 - t
        bx = inv * inv * x0 + 2.0 * inv * t * x1 + t * t * x2
        by = inv * inv * y0 + 2.0 * inv * t * y1 + t * t * y2
        cur_r = r1 + (r2 - r1) * t
        d_seg = _sd_uneven_capsule_local(px, py, prev_x, prev_y, bx, by, prev_r, cur_r)
        if d_seg < min_d:
            min_d = d_seg
        prev_x, prev_y = bx, by
        prev_r = cur_r
    return min_d


def compute_layer_sdf(layer, width, height):
    op = str(layer.get("op", "")).lower()
    sdf = [1e4] * (width * height)

    default_cx = (width - 1) * 0.5
    default_cy = (height - 1) * 0.5

    # Determine geometric center of the shape for local coordinate evaluation
    if op == "rect" and "x" in layer:
        w_val = max(1.0, float(layer.get("w", 4)))
        h_val = max(1.0, float(layer.get("h", 4)))
        piv_x = float(layer.get("x", 0)) + (w_val - 1.0) * 0.5
        piv_y = float(layer.get("y", 0)) + (h_val - 1.0) * 0.5
    elif op in ("capsule", "uneven_capsule"):
        if isinstance(layer.get("points"), list) and len(layer["points"]) >= 2:
            pts = layer["points"]
            piv_x = sum(float(p[0]) for p in pts) / float(len(pts))
            piv_y = sum(float(p[1]) for p in pts) / float(len(pts))
        else:
            piv_x = (float(layer.get("x1", default_cx)) + float(layer.get("x2", default_cx))) * 0.5
            piv_y = (float(layer.get("y1", default_cy - 4)) + float(layer.get("y2", default_cy + 4))) * 0.5
    elif op in ("polygon", "bezier_sdf") and isinstance(layer.get("points"), list) and len(layer["points"]) > 0:
        pts = layer["points"]
        piv_x = sum(float(p[0]) for p in pts) / float(len(pts))
        piv_y = sum(float(p[1]) for p in pts) / float(len(pts))
    else:
        piv_x = float(layer.get("cx", default_cx))
        piv_y = float(layer.get("cy", default_cy))

    rad = math.radians(float(layer.get("angle", 0.0) or 0.0))
    cos_a = math.cos(-rad)
    sin_a = math.sin(-rad)
    polar_n = int(layer.get("polarRepeat", 0) or 0)
    polar_cx = float(layer.get("polarCx", default_cx))
    polar_cy = float(layer.get("polarCy", default_cy))

    warp_cfg = layer.get("domainWarp")
    warp_amp = 0.0
    warp_freq = 0.18
    warp_seed = int(layer.get("seed", 0) or 0)
    if isinstance(warp_cfg, (int, float)):
        warp_amp = float(warp_cfg)
    elif isinstance(warp_cfg, dict):
        warp_amp = float(warp_cfg.get("amp", warp_cfg.get("strength", 1.5)))
        warp_freq = float(warp_cfg.get("freq", warp_cfg.get("scale", 0.18)))
        warp_seed = int(warp_cfg.get("seed", warp_seed))

    onion_w = float(layer.get("onion", 0.0) or 0.0)

    def transform_pt(x, y):
        px, py = float(x), float(y)
        if warp_amp != 0.0:
            nx = value_noise2d(px * warp_freq, py * warp_freq, warp_seed + 11) * 2.0 - 1.0
            ny = value_noise2d(px * warp_freq, py * warp_freq, warp_seed + 37) * 2.0 - 1.0
            px += nx * warp_amp
            py += ny * warp_amp
        if polar_n >= 2:
            ddx = px - polar_cx
            ddy = py - polar_cy
            r_pol = math.hypot(ddx, ddy)
            sector = (2.0 * math.pi) / float(polar_n)
            ang = math.atan2(ddx, -ddy) % (2.0 * math.pi)
            ang = ((ang + sector * 0.5) % sector) - sector * 0.5
            px = polar_cx + r_pol * math.sin(ang)
            py = polar_cy - r_pol * math.cos(ang)
        dx = px - piv_x
        dy = py - piv_y
        lx = dx * cos_a - dy * sin_a
        ly = dx * sin_a + dy * cos_a
        return lx, ly

    if op == "ellipse":
        rx = max(0.5, float(layer.get("rx", 4.0)))
        ry = max(0.5, float(layer.get("ry", 4.0)))
        rx2, ry2 = rx * rx, ry * ry
        rx4, ry4 = rx2 * rx2, ry2 * ry2
        min_r = min(rx, ry)
        for y in range(height):
            for x in range(width):
                lx, ly = transform_pt(x, y)
                q = math.sqrt((lx * lx) / rx2 + (ly * ly) / ry2)
                if q < 1e-6:
                    d = -min_r
                else:
                    grad = math.sqrt((lx * lx) / rx4 + (ly * ly) / ry4)
                    d = (q * (q - 1.0)) / max(1e-6, grad)
                sdf[y * width + x] = abs(d) - onion_w if onion_w > 0 else d

    elif op == "rect":
        w = max(1.0, float(layer.get("w", 4)))
        h = max(1.0, float(layer.get("h", 4)))
        r = max(0.0, float(layer.get("rx", 0)))
        bx = max(0.1, w * 0.5 - r)
        by = max(0.1, h * 0.5 - r)
        for y in range(height):
            for x in range(width):
                lx, ly = transform_pt(x, y)
                qx = abs(lx) - bx
                qy = abs(ly) - by
                out_dist = math.hypot(max(qx, 0.0), max(qy, 0.0))
                in_dist = min(max(qx, qy), 0.0)
                d = out_dist + in_dist - r
                sdf[y * width + x] = abs(d) - onion_w if onion_w > 0 else d

    elif op == "polygon" and isinstance(layer.get("points"), list) and len(layer["points"]) >= 3:
        pts = [(float(p[0]) - piv_x, float(p[1]) - piv_y) for p in layer["points"]]
        n = len(pts)
        r_round = max(0.0, float(layer.get("rx", 0.0) or 0.0))
        for y in range(height):
            for x in range(width):
                lx, ly = transform_pt(x, y)
                inside = False
                min_dist_sq = 1e9
                j = n - 1
                for i in range(n):
                    xi, yi = pts[i]
                    xj, yj = pts[j]
                    vx, vy = xj - xi, yj - yi
                    wx, wy = lx - xi, ly - yi
                    len_sq = vx * vx + vy * vy or 1e-7
                    t = max(0.0, min(1.0, (wx * vx + wy * vy) / len_sq))
                    dx = wx - vx * t
                    dy = wy - vy * t
                    min_dist_sq = min(min_dist_sq, dx * dx + dy * dy)
                    denom = (yj - yi) if (yj - yi) != 0 else 1e-7
                    if ((yi > ly) != (yj > ly)) and (lx < (xj - xi) * (ly - yi) / denom + xi):
                        inside = not inside
                    j = i
                dist = math.sqrt(min_dist_sq)
                d = (-dist if inside else dist) - r_round
                sdf[y * width + x] = abs(d) - onion_w if onion_w > 0 else d

    elif op in ("capsule", "uneven_capsule"):
        r1 = max(0.5, float(layer.get("r1", layer.get("r", layer.get("rx", 3.0)))))
        r2 = max(0.5, float(layer.get("r2", r1)))
        if isinstance(layer.get("points"), list) and len(layer["points"]) >= 2:
            pts = [(float(p[0]) - piv_x, float(p[1]) - piv_y) for p in layer["points"]]
            n_seg = len(pts) - 1
            for y in range(height):
                for x in range(width):
                    lx, ly = transform_pt(x, y)
                    min_d = 1e9
                    for s_i in range(n_seg):
                        ra = r1 + (r2 - r1) * (s_i / float(n_seg))
                        rb = r1 + (r2 - r1) * ((s_i + 1) / float(n_seg))
                        d_seg = _sd_uneven_capsule_local(lx, ly, pts[s_i][0], pts[s_i][1], pts[s_i + 1][0], pts[s_i + 1][1], ra, rb)
                        if d_seg < min_d:
                            min_d = d_seg
                    sdf[y * width + x] = abs(min_d) - onion_w if onion_w > 0 else min_d
        else:
            x1 = float(layer.get("x1", piv_x)) - piv_x
            y1 = float(layer.get("y1", piv_y - 4)) - piv_y
            x2 = float(layer.get("x2", piv_x)) - piv_x
            y2 = float(layer.get("y2", piv_y + 4)) - piv_y
            for y in range(height):
                for x in range(width):
                    lx, ly = transform_pt(x, y)
                    d = _sd_uneven_capsule_local(lx, ly, x1, y1, x2, y2, r1, r2)
                    sdf[y * width + x] = abs(d) - onion_w if onion_w > 0 else d

    elif op == "vesica":
        rx = max(0.5, float(layer.get("rx", layer.get("w", 4.0))))
        ry = max(0.5, float(layer.get("ry", layer.get("r", 7.0))))
        for y in range(height):
            for x in range(width):
                lx, ly = transform_pt(x, y)
                d = _sd_vesica_local(lx, ly, rx, ry)
                sdf[y * width + x] = abs(d) - onion_w if onion_w > 0 else d

    elif op == "moon":
        ra = max(1.0, float(layer.get("r1", layer.get("r", layer.get("rx", 6.0)))))
        rb = max(0.5, float(layer.get("r2", layer.get("ry", ra * 0.8))))
        d_off = float(layer.get("d", layer.get("offset", ra * 0.45)))
        for y in range(height):
            for x in range(width):
                lx, ly = transform_pt(x, y)
                d = _sd_moon_local(lx, ly, d_off, ra, rb)
                sdf[y * width + x] = abs(d) - onion_w if onion_w > 0 else d

    elif op == "bezier_sdf" and isinstance(layer.get("points"), list) and len(layer["points"]) >= 3:
        pts = [(float(p[0]) - piv_x, float(p[1]) - piv_y) for p in layer["points"][:3]]
        r1 = max(0.5, float(layer.get("r1", layer.get("r", layer.get("thickness", 2.0)))))
        r2 = max(0.5, float(layer.get("r2", r1)))
        for y in range(height):
            for x in range(width):
                lx, ly = transform_pt(x, y)
                d = _sd_bezier_local(lx, ly, pts[0], pts[1], pts[2], r1, r2)
                sdf[y * width + x] = abs(d) - onion_w if onion_w > 0 else d

    elif op in ("star", "ngon"):
        r = max(1.0, float(layer.get("r", layer.get("rx", 6.0))))
        n_pts = int(layer.get("n", layer.get("pointsCount", 5)))
        default_ratio = math.cos(math.pi / max(3, n_pts)) if op == "ngon" else 0.45
        ratio = float(layer.get("innerRatio", layer.get("m", default_ratio)))
        for y in range(height):
            for x in range(width):
                lx, ly = transform_pt(x, y)
                d = _sd_star_local(lx, ly, r, n_pts, ratio)
                sdf[y * width + x] = abs(d) - onion_w if onion_w > 0 else d

    mirror = layer.get("mirror", "none")
    smooth_k = float(layer.get("smoothBlend", 0.0) or 0.0)
    if mirror != "none":
        mirrored = list(sdf)
        for y in range(height):
            for x in range(width):
                d = sdf[y * width + x]
                if mirror in ("x", "quad"):
                    d = smin(d, sdf[y * width + (width - 1 - x)], smooth_k)
                if mirror in ("y", "quad"):
                    d = smin(d, sdf[(height - 1 - y) * width + x], smooth_k)
                if mirror == "quad":
                    d = smin(d, sdf[(height - 1 - y) * width + (width - 1 - x)], smooth_k)
                mirrored[y * width + x] = d
        return mirrored

    return sdf


# ============================================================================
# Pillar 4: Kinematic Bone Hierarchy + Analytical 2-Bone IK + Motion Generator
# ============================================================================

def solve_ik_2bone(root, target, l1, l2, flip=False):
    """Analytical Law-of-Cosines 2-Bone Inverse Kinematics solver."""
    ax, ay = float(root[0]), float(root[1])
    bx, by = float(target[0]), float(target[1])
    l1 = max(0.5, float(l1))
    l2 = max(0.5, float(l2))
    dx = bx - ax
    dy = by - ay
    dist = math.hypot(dx, dy)
    min_d = abs(l1 - l2) + 1e-4
    max_d = (l1 + l2) - 1e-4
    d_clamped = max(min_d, min(max_d, dist))
    cos_a = max(-1.0, min(1.0, (l1 * l1 + d_clamped * d_clamped - l2 * l2) / (2.0 * l1 * d_clamped)))
    alpha = math.acos(cos_a)
    base_ang = math.atan2(dy, dx)
    joint_ang = base_ang - alpha if flip else base_ang + alpha
    jx = ax + l1 * math.cos(joint_ang)
    jy = ay + l1 * math.sin(joint_ang)
    scale = (d_clamped / dist) if dist > 1e-5 else 0.0
    ex = ax + dx * scale
    ey = ay + dy * scale
    r2 = lambda v: math.floor(float(v) * 100.0 + 0.5) / 100.0
    return [[r2(ax), r2(ay)], [r2(jx), r2(jy)], [r2(ex), r2(ey)]]


solve_two_bone_ik = solve_ik_2bone


def get_layer_center(layer, width=32, height=32):
    if isinstance(layer.get("pivot"), list) and len(layer["pivot"]) >= 2:
        return (float(layer["pivot"][0]), float(layer["pivot"][1]))
    if "cx" in layer and "cy" in layer:
        return (float(layer["cx"]), float(layer["cy"]))
    if "x" in layer and "y" in layer:
        w = float(layer.get("w", 1))
        h = float(layer.get("h", 1))
        return (float(layer["x"]) + (w - 1) * 0.5, float(layer["y"]) + (h - 1) * 0.5)
    if "x1" in layer and "y1" in layer:
        return ((float(layer["x1"]) + float(layer.get("x2", layer["x1"]))) * 0.5,
                (float(layer["y1"]) + float(layer.get("y2", layer["y1"]))) * 0.5)
    if isinstance(layer.get("points"), list) and len(layer["points"]) > 0:
        pts = layer["points"]
        return (sum(float(p[0]) for p in pts) / len(pts), sum(float(p[1]) for p in pts) / len(pts))
    return ((width - 1) * 0.5, (height - 1) * 0.5)


def _translate_and_rotate_layer_inplace(layer, dx, dy, d_angle_deg, pivot_pt):
    px, py = pivot_pt
    rad = math.radians(d_angle_deg)
    cos_a = math.cos(rad)
    sin_a = math.sin(rad)

    def xform(x, y):
        rx = x - px
        ry = y - py
        return (px + rx * cos_a - ry * sin_a + dx, py + rx * sin_a + ry * cos_a + dy)

    has_verts = False
    if isinstance(layer.get("cx"), (int, float)) and isinstance(layer.get("cy"), (int, float)):
        layer["cx"], layer["cy"] = xform(float(layer["cx"]), float(layer["cy"]))
    elif isinstance(layer.get("x"), (int, float)) and isinstance(layer.get("y"), (int, float)):
        w = float(layer.get("w", 1))
        h = float(layer.get("h", 1))
        cx, cy = xform(float(layer["x"]) + (w - 1) * 0.5, float(layer["y"]) + (h - 1) * 0.5)
        layer["x"] = cx - (w - 1) * 0.5
        layer["y"] = cy - (h - 1) * 0.5
    if isinstance(layer.get("x1"), (int, float)) and isinstance(layer.get("y1"), (int, float)):
        layer["x1"], layer["y1"] = xform(float(layer["x1"]), float(layer["y1"]))
        if isinstance(layer.get("x2"), (int, float)) and isinstance(layer.get("y2"), (int, float)):
            layer["x2"], layer["y2"] = xform(float(layer["x2"]), float(layer["y2"]))
        has_verts = True
    if isinstance(layer.get("points"), list):
        layer["points"] = [list(xform(float(pt[0]), float(pt[1]))) for pt in layer["points"]]
        has_verts = True
    if d_angle_deg != 0.0 and not has_verts:
        layer["angle"] = float(layer.get("angle", 0.0) or 0.0) + d_angle_deg


def _compute_procedural_motion_mods(spec, frame_index):
    motion = spec.get("motion")
    if not isinstance(motion, dict) or frame_index <= 0:
        return {}
    n_frames = max(2, int(motion.get("frames", 4)))
    m_type = str(motion.get("type", "idle_breathe")).lower()
    amp = float(motion.get("amplitude", 1.0))
    squash = float(motion.get("squash", 0.10))
    phase = (2.0 * math.pi * (frame_index % n_frames)) / float(n_frames)
    s_val = math.sin(phase)
    c_val = math.cos(phase)

    mods = {}
    layers = spec.get("layers") if isinstance(spec.get("layers"), list) else []
    for idx, layer in enumerate(layers):
        lid = layer.get("id")
        if not lid:
            continue
        lid_l = lid.lower()
        has_parent = bool(layer.get("parent"))
        lag_phase = phase - 0.55 * (1.0 if has_parent else 0.35)
        s_lag = math.sin(lag_phase)

        if m_type == "idle_breathe":
            if any(k in lid_l for k in ("body", "core", "torso", "slime", "shell")):
                scale_x = 1.0 + squash * s_val
                rx0 = float(layer.get("rx", 6))
                ry0 = float(layer.get("ry", 6))
                mods[lid] = {
                    "drx": rx0 * (scale_x - 1.0),
                    "dry": ry0 * (1.0 / scale_x - 1.0),
                    "dy": 0.0 if has_parent else (-s_val * 0.75 * amp)
                }
            elif any(k in lid_l for k in ("ear", "crown", "tail", "wing", "head", "hat")):
                mods[lid] = {
                    "dy": (-s_lag * 0.25 * amp) if has_parent else (-s_lag * 0.75 * amp),
                    "dAngle": s_lag * 5.0
                }
        elif m_type == "swim_cycle":
            if "flipper" in lid_l or "fin" in lid_l:
                sign = -1.0 if "back" in lid_l else 1.0
                mods[lid] = {"dAngle": sign * s_val * 16.0, "dy": -sign * s_val * 0.8 * amp}
            elif "tail" in lid_l:
                mods[lid] = {"dx": s_lag * 1.2 * amp}
        elif m_type == "walk_cycle":
            if "leg" in lid_l or "foot" in lid_l or "paw" in lid_l:
                sign = -1.0 if ("mid" in lid_l or "back" in lid_l) else 1.0
                mods[lid] = {"dy": sign * s_val * 1.5 * amp, "dAngle": sign * c_val * 10.0}
            elif "body" in lid_l or "torso" in lid_l:
                mods[lid] = {"dy": -abs(s_val) * 0.8 * amp}
        elif m_type == "jump_arc":
            if "shadow" in lid_l:
                mods[lid] = {"drx": -max(0.0, s_val) * 2.0 * amp}
            elif any(k in lid_l for k in ("body", "core", "torso")):
                scale_x = 1.0 - squash * s_val
                rx0 = float(layer.get("rx", 6))
                ry0 = float(layer.get("ry", 6))
                mods[lid] = {
                    "dy": 0.0 if has_parent else (-s_val * 1.8 * amp),
                    "drx": rx0 * (scale_x - 1.0),
                    "dry": ry0 * (1.0 / scale_x - 1.0)
                }
            elif "ear" in lid_l or "tail" in lid_l:
                mods[lid] = {
                    "dy": 0.0 if has_parent else (-s_val * 1.8 * amp),
                    "dAngle": -c_val * 10.0
                }
        elif m_type == "wave":
            mods[lid] = {"dy": math.sin(phase - idx * 0.45) * 1.2 * amp}
    return mods


def get_frame_count(spec):
    if not isinstance(spec, dict):
        return 1
    if spec.get("type") in ("shader", "glsl") or "glsl" in spec or "shaderType" in spec:
        if "framesCount" in spec:
            return max(1, int(spec["framesCount"]))
    extra = len(spec.get("frames")) if isinstance(spec.get("frames"), list) else 0
    motion_frames = 0
    if isinstance(spec.get("motion"), dict):
        motion_frames = max(0, int(spec["motion"].get("frames", 0)) - 1)
    return 1 + max(extra, motion_frames)



def apply_frame_overrides(spec, frame_index=0):
    cloned = copy.deepcopy(spec or {})
    width = clamp_size(cloned.get("width") or (cloned.get("size") or [32, 32])[0], 32)
    height = clamp_size(cloned.get("height") or (cloned.get("size") or [32, 32])[1], 32)

    frames = cloned.get("frames") if isinstance(cloned.get("frames"), list) else []
    frame_def = frames[frame_index - 1] if (0 < frame_index <= len(frames)) else {}

    if isinstance(frame_def, dict) and isinstance(frame_def.get("grid"), list) and len(frame_def["grid"]) > 0:
        cloned["grid"] = frame_def["grid"]

    motion_mods = _compute_procedural_motion_mods(cloned, frame_index) if frame_index > 0 else {}
    explicit_mods = (frame_def.get("layers") or frame_def.get("overrides") or {}) if isinstance(frame_def, dict) else {}

    layer_mods = {}
    for k, v in motion_mods.items():
        layer_mods[k] = copy.deepcopy(v)
    if isinstance(explicit_mods, dict):
        for k, v in explicit_mods.items():
            if k in layer_mods and isinstance(v, dict):
                layer_mods[k].update(v)
            else:
                layer_mods[k] = copy.deepcopy(v)

    if isinstance(cloned.get("layers"), list):
        orig_centers = {}
        by_id = {}
        for lyr in cloned["layers"]:
            if isinstance(lyr, dict) and lyr.get("id"):
                orig_centers[lyr["id"]] = get_layer_center(lyr, width, height)
                by_id[lyr["id"]] = lyr

        # Compute cumulative parent transforms (dx, dy, dAngle, pivot)
        resolved_xform = {}

        def get_cum_xform(lid, visited=None):
            if lid in resolved_xform:
                return resolved_xform[lid]
            if visited is None:
                visited = set()
            if lid in visited or lid not in by_id:
                return (0.0, 0.0, 0.0, orig_centers.get(lid, ((width - 1) * 0.5, (height - 1) * 0.5)))
            visited.add(lid)
            lyr = by_id[lid]
            mod = layer_mods.get(lid, {}) if isinstance(layer_mods.get(lid), dict) else {}
            dx = float(mod.get("dx", 0.0) or 0.0)
            dy = float(mod.get("dy", 0.0) or 0.0)
            da = float(mod.get("dAngle", 0.0) or 0.0)
            piv = orig_centers.get(lid, ((width - 1) * 0.5, (height - 1) * 0.5))
            parent_id = lyr.get("parent")
            if parent_id and parent_id in by_id:
                pdx, pdy, pda, ppiv = get_cum_xform(parent_id, visited)
                dx += pdx
                dy += pdy
                da += pda
                piv = ppiv
            resolved_xform[lid] = (dx, dy, da, piv)
            return resolved_xform[lid]

        new_layers = []
        for layer in cloned["layers"]:
            if not isinstance(layer, dict):
                continue
            lid = layer.get("id")
            mod = layer_mods.get(lid, {}) if (lid and isinstance(layer_mods.get(lid), dict)) else {}
            if mod.get("hidden"):
                continue
            updated = copy.deepcopy(layer)
            for mk, mv in mod.items():
                if mk not in ("dx", "dy", "dAngle", "drx", "dry", "ikTarget"):
                    updated[mk] = mv

            dx = float(mod.get("dx", 0.0) or 0.0)
            dy = float(mod.get("dy", 0.0) or 0.0)
            d_angle = float(mod.get("dAngle", 0.0) or 0.0)
            piv = orig_centers.get(lid, get_layer_center(updated, width, height))

            if lid and updated.get("parent") and updated["parent"] in by_id:
                pdx, pdy, pda, ppiv = get_cum_xform(updated["parent"])
                if pdx != 0.0 or pdy != 0.0 or pda != 0.0:
                    _translate_and_rotate_layer_inplace(updated, pdx, pdy, pda, ppiv)
                    if isinstance(updated.get("pivot"), list) and len(updated["pivot"]) >= 2:
                        prad = math.radians(pda)
                        pcos, psin = math.cos(prad), math.sin(prad)
                        rx = float(updated["pivot"][0]) - ppiv[0]
                        ry = float(updated["pivot"][1]) - ppiv[1]
                        updated["pivot"] = [
                            ppiv[0] + rx * pcos - ry * psin + pdx,
                            ppiv[1] + rx * psin + ry * pcos + pdy
                        ]
                piv = get_layer_center(updated, width, height)

            if dx != 0.0 or dy != 0.0 or d_angle != 0.0:
                _translate_and_rotate_layer_inplace(updated, dx, dy, d_angle, piv)

            drx = mod.get("drx")
            if isinstance(drx, (int, float)) and isinstance(updated.get("rx"), (int, float)):
                updated["rx"] = max(0.5, updated["rx"] + drx)
            dry = mod.get("dry")
            if isinstance(dry, (int, float)) and isinstance(updated.get("ry"), (int, float)):
                updated["ry"] = max(0.5, updated["ry"] + dry)

            # Analytical 2-Bone IK resolution
            if isinstance(updated.get("ik"), dict):
                ik_cfg = updated["ik"]
                root_pt = ik_cfg.get("root") or (updated["points"][0] if isinstance(updated.get("points"), list) and len(updated["points"]) > 0 else [width / 2, height / 2])
                target_pt = list(mod.get("ikTarget") or ik_cfg.get("target") or [root_pt[0], root_pt[1] + 6])
                if dx != 0.0 or dy != 0.0:
                    target_pt[0] += dx
                    target_pt[1] += dy
                l1 = float(ik_cfg.get("l1", 5.0))
                l2 = float(ik_cfg.get("l2", 5.0))
                flip = bool(ik_cfg.get("flip", False))
                updated["points"] = solve_ik_2bone(root_pt, target_pt, l1, l2, flip)

            new_layers.append(updated)
        cloned["layers"] = new_layers

    return cloned


# ============================================================================
# Main Rendering Pipeline (v3.0)
# ============================================================================

def _register_sdf_tone_symbols(fill_sym, tones, palette_raw, palette_rgba):
    """
    Auto-registers the 5 3D SDF shading tones into palette_raw & palette_rgba so
    symbol_buffer stores distinct symbols and 'Bake Layers -> Grid' is 100% lossless.
    """
    tone_syms = {"base": fill_sym or "S"}
    pool = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*+=~^?!"
    for tone_name in ("deepShadow", "shadow", "highlight", "specular"):
        rgba = tones[tone_name]
        # Check if an existing palette entry already matches closely
        matched_sym = None
        for k, existing_rgba in palette_rgba.items():
            if k in (".", " "):
                continue
            if (
                abs(existing_rgba[0] - rgba[0]) +
                abs(existing_rgba[1] - rgba[1]) +
                abs(existing_rgba[2] - rgba[2]) <= 10 and
                abs(existing_rgba[3] - rgba[3]) <= 15
            ):
                matched_sym = k
                break
        if matched_sym:
            tone_syms[tone_name] = matched_sym
        else:
            for ch in pool:
                if ch not in palette_raw and ch not in (".", " "):
                    hex_col = rgba_to_hex(rgba[0], rgba[1], rgba[2], rgba[3])
                    palette_raw[ch] = hex_col
                    palette_rgba[ch] = rgba
                    tone_syms[tone_name] = ch
                    break
            else:
                tone_syms[tone_name] = fill_sym or "S"
    return tone_syms


def apply_cellular_rules(rules, width, height, symbol_buffer, buffer, resolve_color_fn):
    """Pillar 5: MarkovJunior-style local cellular rewrite rules pass."""
    if not isinstance(rules, list) or not rules:
        return
    for r_idx, rule in enumerate(rules):
        if not isinstance(rule, dict):
            continue
        r_type = str(rule.get("type", "top_coat")).lower()
        target = str(rule.get("target", "S"))
        replace = str(rule.get("replace", "L"))
        prob = float(rule.get("prob", 0.75))
        seed = int(rule.get("seed", 42 + r_idx * 31))
        rep_rgba = resolve_color_fn(replace)
        if rep_rgba[3] <= 0:
            continue

        snap = list(symbol_buffer)
        if r_type == "top_coat":
            for y in range(1, height):
                for x in range(width):
                    idx = y * width + x
                    if snap[idx] == target and snap[(y - 1) * width + x] in (".", " ", "O"):
                        if hash2d(x, y, seed) <= prob:
                            symbol_buffer[idx] = replace
                            b_idx = idx * 4
                            buffer[b_idx:b_idx + 4] = bytes(rep_rgba)
        elif r_type == "bottom_drip":
            max_len = max(1, int(rule.get("length", 2)))
            for y in range(height - 2, -1, -1):
                for x in range(width):
                    idx = y * width + x
                    if snap[idx] == target and snap[(y + 1) * width + x] == ".":
                        if hash2d(x, y, seed) <= prob:
                            for d_step in range(1, max_len + 1):
                                ny = y + d_step
                                if ny < height and snap[ny * width + x] == ".":
                                    n_idx = ny * width + x
                                    symbol_buffer[n_idx] = replace
                                    b_idx = n_idx * 4
                                    buffer[b_idx:b_idx + 4] = bytes(rep_rgba)
        elif r_type in ("nw_glint", "highlight_glint"):
            for y in range(1, height - 1):
                for x in range(1, width - 1):
                    idx = y * width + x
                    if snap[idx] == target and snap[(y - 1) * width + x] != target and snap[y * width + (x - 1)] != target:
                        if hash2d(x, y, seed) <= prob:
                            symbol_buffer[idx] = replace
                            b_idx = idx * 4
                            buffer[b_idx:b_idx + 4] = bytes(rep_rgba)


BAYER_4X4_NORM = [
    [-0.5, 0.0, -0.375, 0.125],
    [0.25, -0.25, 0.375, -0.125],
    [-0.3125, 0.1875, -0.4375, 0.0625],
    [0.4375, -0.0625, 0.3125, -0.1875]
]

SAFE_SHADER_GLOBALS = {
    "__builtins__": {},
    "math": math,
    "sin": math.sin,
    "cos": math.cos,
    "tan": math.tan,
    "asin": math.asin,
    "acos": math.acos,
    "atan2": math.atan2,
    "sqrt": math.sqrt,
    "hypot": math.hypot,
    "pow": math.pow,
    "exp": math.exp,
    "log": math.log,
    "floor": math.floor,
    "ceil": math.ceil,
    "abs": abs,
    "min": min,
    "max": max,
    "pi": math.pi,
    "clamp": lambda v, mn, mx: max(mn, min(mx, v)),
    "smoothstep": lambda e0, e1, x: 0.0 if x <= e0 else (1.0 if x >= e1 else ((x - e0)/(e1 - e0))**2 * (3.0 - 2.0 * ((x - e0)/(e1 - e0)))),
    "length": lambda x, y: math.hypot(x, y),
    "smin": lambda a, b, k: smin(a, b, k),
    "worley": lambda x, y: worley_f1_f2(x, y)[0],
    "noise": lambda x, y: value_noise2d(x, y)
}


def solve_fk_rig(bones_def, pose=None):
    """
    Forward Kinematics solver for skeletal rigs.
    Computes world-space start and end positions and angles for each bone.
    """
    pose = pose or {}
    bones_by_id = {b["id"]: b for b in bones_def if isinstance(b, dict) and b.get("id")}
    resolved = {}

    def get_bone_xform(bid, visited=None):
        if bid in resolved:
            return resolved[bid]
        if visited is None:
            visited = set()
        if bid in visited or bid not in bones_by_id:
            return ((0.0, 0.0), (0.0, 0.0), 0.0)
        visited.add(bid)

        b = bones_by_id[bid]
        mod = pose.get(bid, {}) if isinstance(pose.get(bid), dict) else {}
        d_angle = float(mod.get("dAngle", 0.0) or 0.0)
        dx = float(mod.get("dx", 0.0) or 0.0)
        dy = float(mod.get("dy", 0.0) or 0.0)

        parent_id = b.get("parent")
        if parent_id and parent_id in bones_by_id:
            p_start, p_end, p_angle = get_bone_xform(parent_id, visited)
            offset = b.get("offset", [0.0, 0.0])
            prad = math.radians(p_angle)
            pcos, psin = math.cos(prad), math.sin(prad)
            rx = float(offset[0]) * pcos - float(offset[1]) * psin
            ry = float(offset[0]) * psin + float(offset[1]) * pcos
            start_x = p_end[0] + rx + dx
            start_y = p_end[1] + ry + dy
            world_angle = p_angle + float(b.get("angle", 0.0) or 0.0) + d_angle
        else:
            start_x = float(b.get("x", 0.0)) + dx
            start_y = float(b.get("y", 0.0)) + dy
            world_angle = float(b.get("angle", 0.0) or 0.0) + d_angle

        length = float(b.get("length", 0.0) or 0.0)
        wrad = math.radians(world_angle)
        end_x = start_x + length * math.cos(wrad)
        end_y = start_y + length * math.sin(wrad)

        resolved[bid] = ((start_x, start_y), (end_x, end_y), world_angle)
        return resolved[bid]

    for b in bones_def:
        if isinstance(b, dict) and b.get("id"):
            get_bone_xform(b["id"])
    return resolved


def render_rig(spec, frame_index=0):
    """
    Rasterizes a 2.5D Skeletal Capsule Rig into RGBA pixel buffers and normal maps,
    with 3D volume cel-shading, internal creases, and selective outline.
    """
    size_arr = spec.get("size") if isinstance(spec.get("size"), list) else [None, None]
    width = clamp_size(spec.get("width") or size_arr[0], 32)
    height = clamp_size(spec.get("height") or size_arr[1], 32)

    rig_def = spec.get("rig", {}) if isinstance(spec.get("rig"), dict) else spec
    bones_def = rig_def.get("bones", []) if isinstance(rig_def.get("bones"), list) else []

    frames = spec.get("frames", []) if isinstance(spec.get("frames"), list) else []
    frame_pose = {}
    if 0 < frame_index <= len(frames):
        f_def = frames[frame_index - 1]
        frame_pose = f_def.get("pose") or f_def.get("layers") or {}
    elif frame_index == 0 and frames and isinstance(frames[0], dict) and ("pose" in frames[0] or "layers" in frames[0]) and len(frames) == 1:
        f_def = frames[0]
        frame_pose = f_def.get("pose") or f_def.get("layers") or {}

    fk_results = solve_fk_rig(bones_def, frame_pose)

    palette_raw = resolve_full_palette(spec)
    palette_rgba = {".": (0, 0, 0, 0), " ": (0, 0, 0, 0)}
    for k, v in palette_raw.items():
        palette_rgba[k] = parse_color(v)

    has_outline = True
    if "outline" in rig_def and (rig_def["outline"] in (None, "none", "transparent", "") or rig_def.get("outlineWidth") == 0):
        has_outline = False
    elif rig_def.get("outlineWidth") == 0:
        has_outline = False

    outline_key = rig_def.get("outline") if has_outline else None
    outline_rgba = (palette_rgba.get(outline_key) or parse_color(outline_key)) if (has_outline and outline_key) else (0, 0, 0, 0)
    outline_w = float(rig_def.get("outlineWidth", 1.0) or 1.0) if has_outline else 0.0

    sorted_bones = sorted(bones_def, key=lambda b: float(b.get("z", 0.0) or 0.0))

    color_buf = [None] * (width * height)
    z_buf = [-9999.0] * (width * height)
    bone_id_buf = [None] * (width * height)
    normal_buffer = bytearray(width * height * 4)
    for i in range(width * height):
        normal_buffer[i * 4] = 128
        normal_buffer[i * 4 + 1] = 128
        normal_buffer[i * 4 + 2] = 255
        normal_buffer[i * 4 + 3] = 0

    min_dist_buf = [9999.0] * (width * height)
    min_dist_bone = [None] * (width * height)
    symbol_buffer = ["."] * (width * height)

    light_dir = (-0.52, -0.62, 0.58)
    l_mag = math.hypot(light_dir[0], light_dir[1], light_dir[2])
    lx, ly, lz = light_dir[0] / l_mag, light_dir[1] / l_mag, light_dir[2] / l_mag

    for b in sorted_bones:
        if not isinstance(b, dict) or not b.get("id") or b.get("hidden"):
            continue
        bid = b["id"]
        (ax, ay), (bx, by), w_angle = fk_results.get(bid, ((0.0, 0.0), (0.0, 0.0), 0.0))
        base_r1 = max(0.5, float(b.get("r1", 2.0) or 2.0))
        base_r2 = max(0.5, float(b.get("r2", base_r1) or base_r1))
        z = float(b.get("z", 0.0) or 0.0)

        # Perspective Depth Scaling: limbs in the background (z < 1.0) shrink naturally; foreground limbs (z > 1.0) scale up
        depth_scale_factor = max(0.55, min(2.0, 1.0 + (z - 1.0) * 0.18))
        r1 = max(0.5, base_r1 * depth_scale_factor)
        r2 = max(0.5, base_r2 * depth_scale_factor)

        fill_key = b.get("fill", "b")
        base_fill_rgba = palette_rgba.get(fill_key) or parse_color(fill_key)
        # Subtle ambient depth attenuation for background limbs (z < 0.95)
        depth_brightness = max(0.80, min(1.0, 0.88 + 0.12 * min(1.0, z)))
        fill_rgba = (
            int(round(base_fill_rgba[0] * depth_brightness)),
            int(round(base_fill_rgba[1] * depth_brightness)),
            int(round(base_fill_rgba[2] * depth_brightness)),
            base_fill_rgba[3] if len(base_fill_rgba) > 3 else 255
        )
        shape = str(b.get("shape", "capsule")).lower()

        vax = bx - ax
        vay = by - ay
        v_len_sq = vax * vax + vay * vay

        for y in range(height):
            for x in range(width):
                px = x + 0.5
                py = y + 0.5

                if shape in ("head_oval", "oval"):
                    cx, cy = (bx, by) if float(b.get("length", 0.0) or 0.0) > 0 else (ax, ay)
                    rx, ry = r2, r1
                    p_loc_x = px - cx
                    p_loc_y = py - cy
                    k0 = math.hypot(p_loc_x / rx, p_loc_y / ry)
                    d = (k0 - 1.0) * min(rx, ry)
                    qx, qy = cx, cy
                    eff_r = (rx + ry) * 0.5
                else:
                    if v_len_sq < 1e-6:
                        h_val = 0.0
                        qx, qy = ax, ay
                        eff_r = r1
                    else:
                        h_val = max(0.0, min(1.0, ((px - ax) * vax + (py - ay) * vay) / v_len_sq))
                        qx = ax + h_val * vax
                        qy = ay + h_val * vay
                        eff_r = r1 + h_val * (r2 - r1)
                    dist_to_center = math.hypot(px - qx, py - qy)
                    d = dist_to_center - eff_r

                idx = y * width + x
                if d < min_dist_buf[idx]:
                    min_dist_buf[idx] = d
                    min_dist_bone[idx] = bid

                if d <= 0.0:
                    if z >= z_buf[idx]:
                        z_buf[idx] = z
                        bone_id_buf[idx] = bid

                        vx = (px - qx) / max(0.1, eff_r)
                        vy = (py - qy) / max(0.1, eff_r)
                        vz_sq = max(0.0, 1.0 - vx * vx - vy * vy)
                        vz = math.sqrt(vz_sq)

                        dot = vx * lx + vy * ly + vz * lz
                        if dot > 0.45:
                            col = tuple(min(255, int(c * 1.15)) for c in fill_rgba[:3]) + (255,)
                        elif dot < -0.1:
                            col = tuple(max(0, int(c * 0.82)) for c in fill_rgba[:3]) + (255,)
                        else:
                            col = fill_rgba

                        if isinstance(b.get("features"), dict):
                            feats = b["features"]
                            if "eyes" in feats and isinstance(feats["eyes"], dict):
                                ef = feats["eyes"]
                                edx = float(ef.get("dx", 2.0) or 2.0)
                                edy = float(ef.get("dy", 0.0) or 0.0)
                                ew = float(ef.get("w", 2.0) or 2.0)
                                eh = float(ef.get("h", 3.0) or 3.0)
                                head_len = float(b.get("length", 0.0) or 0.0)
                                cx_eye = bx if head_len > 0 else ax
                                eye_center_y = (by if head_len > 0 else ay) + edy
                                eye_c = ef.get("color", "#4e221c")

                                if "spacing" in ef and ef["spacing"] is not None:
                                    sp = float(ef["spacing"]) * 0.5
                                    if (abs(px - (cx_eye - sp)) <= ew * 0.5 or abs(px - (cx_eye + sp)) <= ew * 0.5) and abs(py - eye_center_y) <= eh * 0.5:
                                        col = palette_rgba.get(eye_c) or parse_color(eye_c)
                                else:
                                    eye_center_x = cx_eye + edx
                                    if abs(px - eye_center_x) <= ew * 0.5 and abs(py - eye_center_y) <= eh * 0.5:
                                        col = palette_rgba.get(eye_c) or parse_color(eye_c)

                        color_buf[idx] = col
                        symbol_buffer[idx] = fill_key if fill_key in palette_raw else "b"
                        normal_buffer[idx * 4] = max(0, min(255, js_round((vx * 0.5 + 0.5) * 255.0)))
                        normal_buffer[idx * 4 + 1] = max(0, min(255, js_round((-vy * 0.5 + 0.5) * 255.0)))
                        normal_buffer[idx * 4 + 2] = max(0, min(255, js_round((vz * 0.5 + 0.5) * 255.0)))
                        normal_buffer[idx * 4 + 3] = 255

    buffer = bytearray(width * height * 4)
    for y in range(height):
        for x in range(width):
            idx = y * width + x
            d_val = min_dist_buf[idx]
            if color_buf[idx] is not None:
                is_internal_crease = False
                cur_z = z_buf[idx]
                for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < height and 0 <= nx < width:
                        n_idx = ny * width + nx
                        if z_buf[n_idx] > -9000.0 and (cur_z - z_buf[n_idx]) >= 1.5:
                            is_internal_crease = True
                            break
                if is_internal_crease:
                    c = color_buf[idx]
                    crease_c = (max(0, int(c[0] * 0.72)), max(0, int(c[1] * 0.72)), max(0, int(c[2] * 0.72)), 255)
                    buffer[idx * 4:idx * 4 + 4] = bytes(crease_c)
                else:
                    buffer[idx * 4:idx * 4 + 4] = bytes(color_buf[idx])
            elif has_outline and 0.0 < d_val <= outline_w and outline_rgba[3] > 0:
                buffer[idx * 4:idx * 4 + 4] = bytes(outline_rgba)
                symbol_buffer[idx] = outline_key if (outline_key and outline_key in palette_raw) else "o"
                normal_buffer[idx * 4:idx * 4 + 4] = bytes([128, 128, 255, 255])

    diagnostics = analyze_buffer(width, height, buffer)
    return {
        "width": width,
        "height": height,
        "buffer": buffer,
        "normal_buffer": normal_buffer,
        "symbol_buffer": symbol_buffer,
        "resolved_palette": palette_raw,
        "warnings": [],
        "diagnostics": diagnostics
    }


def render_shader(spec, frame_index=0):
    """
    Evaluates procedural mathematical SDF shaders and GLSL-like functions,
    applying perceptual Oklab palette quantization and Bayer dithering.
    """
    size_arr = spec.get("size") if isinstance(spec.get("size"), list) else [None, None]
    width = clamp_size(spec.get("width") or size_arr[0], 32)
    height = clamp_size(spec.get("height") or size_arr[1], 32)
    palette_raw = resolve_full_palette(spec)
    palette_list = [parse_color(v)[:3] for k, v in palette_raw.items() if k not in (".", " ")]
    if not palette_list:
        palette_list = [(7, 11, 25), (38, 75, 135), (96, 165, 250), (255, 255, 255)]

    frames_count = max(1, int(spec.get("framesCount") or len(spec.get("frames", [])) or 1))
    t = (frame_index / float(frames_count)) if frames_count > 1 else float(spec.get("time", 0.0) or 0.0)

    dither_mode = str(spec.get("dither", "bayer4x4")).lower()
    dither_str = float(spec.get("ditherStrength", 0.16) or 0.16)
    shader_type = str(spec.get("shaderType") or spec.get("preset") or "custom").lower()

    pal_oklab = [rgb_to_oklab(c[0], c[1], c[2]) for c in palette_list]

    buffer = bytearray(width * height * 4)
    normal_buffer = bytearray(width * height * 4)
    symbol_buffer = ["."] * (width * height)

    pal_keys = [k for k in palette_raw.keys() if k not in (".", " ")]
    if not pal_keys:
        pal_keys = ["b", "c", "h", "w"]

    def eval_pixel_sample(u, v, time_val):
        px = u * 2.0 - 1.0
        py = v * 2.0 - 1.0
        r_dist = math.hypot(px, py)
        ang = math.atan2(py, px)

        if shader_type in ("portal", "vortex", "orb"):
            spiral = math.sin(ang * 4.0 - time_val * 6.28318 + r_dist * 6.0)
            orb = r_dist - 0.72 + 0.08 * spiral
            if orb > 0.06:
                return 0.0, 0.0, 0.0, 0.0
            core = max(0.0, 1.0 - r_dist / 0.75)
            ring = max(0.0, 1.0 - abs(orb) / 0.12)
            intensity = max(0.0, min(1.0, core * 0.7 + ring * 0.9 + 0.25 * spiral))
            cr = math.sin(intensity * math.pi) * 0.6
            cg = intensity * 0.9
            cb = 0.5 + intensity * 0.5
            return cr, cg, cb, 1.0

        elif shader_type in ("fire", "flame"):
            noise_val = value_noise2d((px + 1.0) * 4.0, (py - time_val * 2.0) * 4.0)
            flame_shape = r_dist - (0.65 - (py + 0.5) * 0.4) + noise_val * 0.25
            if flame_shape > 0.05 or py < -0.85:
                return 0.0, 0.0, 0.0, 0.0
            intensity = max(0.0, min(1.0, 1.0 - flame_shape * 1.5))
            cr = min(1.0, intensity * 1.4)
            cg = min(1.0, max(0.0, (intensity - 0.3) * 1.5))
            cb = min(1.0, max(0.0, (intensity - 0.8) * 3.0))
            return cr, cg, cb, 1.0

        elif shader_type in ("shield", "forcefield"):
            hex_grid = math.sin(px * 16.0) * math.cos(py * 16.0)
            ring = abs(r_dist - 0.75)
            if ring > 0.15:
                return 0.0, 0.0, 0.0, 0.0
            intensity = max(0.0, min(1.0, (1.0 - ring / 0.15) * 0.8 + 0.2 * math.sin(time_val * 6.28 + hex_grid * 4.0)))
            return 0.2 * intensity, 0.8 * intensity, 1.0 * intensity, 1.0

        elif shader_type in ("magma", "magma_rock", "lava_rock", "lava"):
            facet = 0.08 * math.sin(ang * 3.0 + 0.8) + 0.05 * math.cos(ang * 5.0 - 1.1) + 0.03 * math.sin(ang * 7.0 + 2.2)
            base_flatten = 0.06 * max(0.0, py - 0.2)
            noise_disp = 0.04 * (value_noise2d(px * 5.0 + 15.0, py * 5.0 + 15.0, seed=51) - 0.5)
            rock_radius = 0.73 + facet - base_flatten + noise_disp
            rock_edge_dist = r_dist - rock_radius
            if rock_edge_dist > 0.015:
                return 0.0, 0.0, 0.0, 0.0

            warp_x = px + 0.22 * (value_noise2d(px * 3.5, py * 3.5, seed=24) - 0.5)
            warp_y = py + 0.22 * (value_noise2d(px * 3.5 + 40.0, py * 3.5 + 40.0, seed=38) - 0.5)

            f1, f2 = worley_f1_f2(warp_x * 2.2, warp_y * 2.2, scale=1.0, seed=83)
            crack_dist_1 = f2 - f1
            f1_sub, f2_sub = worley_f1_f2(warp_x * 4.6, warp_y * 4.6, scale=1.0, seed=127)
            crack_dist_2 = f2_sub - f1_sub

            is_main_crack = crack_dist_1 < 0.26
            is_branch_crack = crack_dist_2 < 0.12 and r_dist < (rock_radius - 0.10)

            in_crack = False
            crack_factor = 0.0
            if is_main_crack:
                in_crack = True
                crack_factor = max(crack_factor, 1.0 - (crack_dist_1 / 0.26))
            if is_branch_crack:
                in_crack = True
                crack_factor = max(crack_factor, (1.0 - (crack_dist_2 / 0.12)) * 0.78)

            if in_crack:
                t_rad = time_val * 6.2831853
                wave1 = math.sin((px * 3.5 - py * 2.8) * 1.5 - t_rad)
                wave2 = math.cos((px * 2.0 + py * 4.0) * 1.2 + t_rad)
                heat_surge = 0.5 + 0.35 * wave1 + 0.15 * wave2

                bubble_x = px * 5.0 + math.cos(t_rad) * 0.9
                bubble_y = py * 5.0 + math.sin(t_rad) * 0.9
                bubble_noise = value_noise2d(bubble_x, bubble_y, seed=219)
                junction_pool = math.exp(-f1 * 4.0) * 0.45

                thermal = crack_factor * 0.72 + heat_surge * 0.35 + (bubble_noise - 0.5) * 0.30 + junction_pool
                thermal = max(0.0, min(1.0, thermal))

                if thermal > 0.82:
                    t_norm = (thermal - 0.82) / 0.18
                    cr = 1.0
                    cg = 0.90 + 0.10 * t_norm
                    cb = 0.60 + 0.40 * t_norm
                elif thermal > 0.55:
                    t_norm = (thermal - 0.55) / 0.27
                    cr = 1.0
                    cg = 0.55 + 0.35 * t_norm
                    cb = 0.05 + 0.30 * t_norm
                elif thermal > 0.28:
                    t_norm = (thermal - 0.28) / 0.27
                    cr = 0.90 + 0.10 * t_norm
                    cg = 0.18 + 0.37 * t_norm
                    cb = 0.0
                else:
                    t_norm = thermal / 0.28
                    cr = 0.45 + 0.45 * t_norm
                    cg = 0.04 + 0.14 * t_norm
                    cb = 0.0
                return cr, cg, cb, 1.0

            lx = -0.55
            ly = -0.68
            facet_noise = value_noise2d(px * 6.5, py * 6.5, seed=143)
            macro_facet = 0.12 * math.sin(px * 8.0 + py * 4.0) + 0.08 * math.cos(px * 5.0 - py * 7.0)
            dome_z = math.sqrt(max(0.05, 1.0 - (r_dist / rock_radius) ** 2))
            stone_light = max(0.0, (-px * lx - py * ly) * 0.5 + 0.5) * dome_z + macro_facet * 0.15 + (facet_noise - 0.5) * 0.08
            stone_light = max(0.04, min(0.95, stone_light))

            cr = stone_light * 0.15
            cg = stone_light * 0.18
            cb = stone_light * 0.28

            dist_to_vein = min(crack_dist_1, crack_dist_2)
            glow_radius = 0.38
            if dist_to_vein < glow_radius:
                glow_intensity = ((1.0 - dist_to_vein / glow_radius) ** 2.2) * 0.42
                pulse_amb = 0.85 + 0.15 * math.sin(time_val * 6.2831853)
                glow_intensity *= pulse_amb
                cr += glow_intensity * 0.90
                cg += glow_intensity * 0.22
                cb += glow_intensity * 0.02

            if facet_noise > 0.74 and stone_light > 0.48:
                glint = (facet_noise - 0.74) / 0.26 * 0.32
                cr += glint * 0.75
                cg += glint * 0.85
                cb += glint * 1.05

            if rock_edge_dist > -0.07:
                rim = max(0.0, (rock_edge_dist + 0.07) / 0.07)
                fade = 1.0 - rim * 0.65
                cr *= fade
                cg *= fade
                cb *= fade

            return min(1.0, cr), min(1.0, cg), min(1.0, cb), 1.0


        else:
            expr = spec.get("expr") or spec.get("formula")
            if expr:
                try:
                    locs = {"u": u, "v": v, "t": time_val, "r": r_dist, "a": ang, "x": px, "y": py}
                    val = max(0.0, min(1.0, float(eval(expr, SAFE_SHADER_GLOBALS, locs))))
                    return val, val, val, (1.0 if val > 0.02 else 0.0)
                except Exception:
                    pass
            wave = math.sin(r_dist * 8.0 - time_val * 6.28) * 0.5 + 0.5
            if r_dist > 0.85:
                return 0.0, 0.0, 0.0, 0.0
            return wave, wave * 0.8, wave * 1.2, 1.0

    intensity_map = [0.0] * (width * height)
    for y in range(height):
        v = 1.0 - (y + 0.5) / float(height)
        for x in range(width):
            u = (x + 0.5) / float(width)
            r, g, b, alpha = eval_pixel_sample(u, v, t)
            idx = y * width + x
            intensity_map[idx] = (r + g + b) / 3.0 * alpha

            if alpha <= 0.05:
                buffer[idx * 4:idx * 4 + 4] = bytes([0, 0, 0, 0])
                continue

            dither_offset = 0.0
            if dither_mode == "bayer4x4":
                dither_offset = BAYER_4X4_NORM[y % 4][x % 4] * dither_str
            elif dither_mode == "bayer2x2":
                dither_offset = BAYER_2X2[y % 2][x % 2] * dither_str

            rq = max(0.0, min(255.0, (r + dither_offset) * 255.0))
            gq = max(0.0, min(255.0, (g + dither_offset) * 255.0))
            bq = max(0.0, min(255.0, (b + dither_offset) * 255.0))

            pL, pa, pb_ok = rgb_to_oklab(rq, gq, bq)
            best_idx = 0
            best_dist = 1e9
            for pi, (tL, ta, tb) in enumerate(pal_oklab):
                dist = (pL - tL)**2 + (pa - ta)**2 + (pb_ok - tb)**2
                if dist < best_dist:
                    best_dist = dist
                    best_idx = pi

            chosen_col = palette_list[best_idx]
            buffer[idx * 4:idx * 4 + 4] = bytes([int(chosen_col[0]), int(chosen_col[1]), int(chosen_col[2]), 255])
            symbol_buffer[idx] = pal_keys[min(best_idx, len(pal_keys) - 1)]

    for y in range(height):
        for x in range(width):
            idx = y * width + x
            if buffer[idx * 4 + 3] == 0:
                normal_buffer[idx * 4:idx * 4 + 4] = bytes([128, 128, 255, 0])
                continue
            left_i = intensity_map[y * width + max(0, x - 1)]
            right_i = intensity_map[y * width + min(width - 1, x + 1)]
            up_i = intensity_map[max(0, y - 1) * width + x]
            down_i = intensity_map[min(height - 1, y + 1) * width + x]
            gx = (right_i - left_i) * 2.0
            gy = (down_i - up_i) * 2.0
            gl = math.hypot(gx, gy)
            nx = (gx / gl) * 0.7 if gl > 1e-5 else 0.0
            ny = (gy / gl) * 0.7 if gl > 1e-5 else 0.0
            nz = math.sqrt(max(0.1, 1.0 - nx * nx - ny * ny))
            normal_buffer[idx * 4] = max(0, min(255, js_round((nx * 0.5 + 0.5) * 255.0)))
            normal_buffer[idx * 4 + 1] = max(0, min(255, js_round((-ny * 0.5 + 0.5) * 255.0)))
            normal_buffer[idx * 4 + 2] = max(0, min(255, js_round((nz * 0.5 + 0.5) * 255.0)))
            normal_buffer[idx * 4 + 3] = 255

    diagnostics = analyze_buffer(width, height, buffer)
    return {
        "width": width,
        "height": height,
        "buffer": buffer,
        "normal_buffer": normal_buffer,
        "symbol_buffer": symbol_buffer,
        "resolved_palette": palette_raw,
        "warnings": [],
        "diagnostics": diagnostics
    }


def render_sprite(spec_input, frame_index=0):
    spec_raw = spec_input or {}
    spec_type = str(spec_raw.get("type", "")).lower()
    if spec_type == "rig" or ("rig" in spec_raw and isinstance(spec_raw.get("rig"), dict) and "bones" in spec_raw["rig"]):
        return render_rig(spec_raw, frame_index)
    if spec_type in ("shader", "glsl") or "glsl" in spec_raw or ("shaderType" in spec_raw and "bones" not in spec_raw.get("rig", {})):
        return render_shader(spec_raw, frame_index)

    spec = apply_frame_overrides(spec_raw, frame_index)
    size_arr = spec.get("size") if isinstance(spec.get("size"), list) else [None, None]
    width = clamp_size(spec.get("width") or size_arr[0], 32)
    height = clamp_size(spec.get("height") or size_arr[1], 32)

    palette_raw = resolve_full_palette(spec)
    post = spec.get("postProcess") if isinstance(spec.get("postProcess"), dict) else {}
    global_sdf_shading = bool(post.get("sdfShading"))
    use_sel_out = bool(post.get("selOut"))

    palette_rgba = {".": (0, 0, 0, 0), " ": (0, 0, 0, 0)}
    for k, v in palette_raw.items():
        palette_rgba[k] = parse_color(v)

    def resolve_color(key_or_hex):
        if not key_or_hex:
            return (0, 0, 0, 0)
        if key_or_hex in palette_rgba:
            return palette_rgba[key_or_hex]
        return parse_color(key_or_hex)

    buffer = bytearray(width * height * 4)
    normal_buffer = bytearray(width * height * 4)
    for i in range(width * height):
        normal_buffer[i * 4] = 128
        normal_buffer[i * 4 + 1] = 128
        normal_buffer[i * 4 + 2] = 255
        normal_buffer[i * 4 + 3] = 0
    symbol_buffer = ["."] * (width * height)

    def set_normal_pixel(x, y, nx, ny, nz):
        ix = js_round(x)
        iy = js_round(y)
        if ix < 0 or ix >= width or iy < 0 or iy >= height:
            return
        if abs(nx) < 1e-9:
            nx = 0.0
        if abs(ny) < 1e-9:
            ny = 0.0
        idx = (iy * width + ix) * 4
        normal_buffer[idx] = max(0, min(255, js_round((nx * 0.5 + 0.5) * 255.0)))
        normal_buffer[idx + 1] = max(0, min(255, js_round((-ny * 0.5 + 0.5) * 255.0)))
        normal_buffer[idx + 2] = max(0, min(255, js_round((nz * 0.5 + 0.5) * 255.0)))
        normal_buffer[idx + 3] = 255

    def blend_pixel(x, y, rgba, sym=None):
        ix = js_round(x)
        iy = js_round(y)
        if ix < 0 or ix >= width or iy < 0 or iy >= height:
            return
        sr, sg, sb, sa = rgba
        if sa <= 0:
            return
        idx = (iy * width + ix) * 4
        if sa >= 255 or buffer[idx + 3] == 0:
            buffer[idx] = sr
            buffer[idx + 1] = sg
            buffer[idx + 2] = sb
            buffer[idx + 3] = sa
        else:
            src_a = sa / 255.0
            dst_a = buffer[idx + 3] / 255.0
            out_a = src_a + dst_a * (1.0 - src_a)
            if out_a > 0:
                buffer[idx] = min(255, js_round((sr * src_a + buffer[idx] * dst_a * (1.0 - src_a)) / out_a))
                buffer[idx + 1] = min(255, js_round((sg * src_a + buffer[idx + 1] * dst_a * (1.0 - src_a)) / out_a))
                buffer[idx + 2] = min(255, js_round((sb * src_a + buffer[idx + 2] * dst_a * (1.0 - src_a)) / out_a))
                buffer[idx + 3] = min(255, js_round(out_a * 255.0))
        if sym and (sa >= 128 or symbol_buffer[iy * width + ix] == "."):
            symbol_buffer[iy * width + ix] = sym

    def rasterize_sdf_field(sdf_field, layer, sub_sdfs=None):
        raw_mask = bytearray(width * height)
        max_depth = 1.0
        for i in range(width * height):
            if sdf_field[i] <= 0.0:
                raw_mask[i] = 1
                if -sdf_field[i] > max_depth:
                    max_depth = -sdf_field[i]

        op_name = str(layer.get("op", "")).lower()
        prune_spurs = op_name not in ("polygon", "star", "ngon", "rect") or float(layer.get("smoothBlend", 0) or 0) > 0
        full_mask = clean_sdf_mask(raw_mask, sdf_field, width, height, prune_spurs=prune_spurs)

        fill_sym = layer.get("fill")
        fill_rgba = resolve_color(fill_sym)
        outline_key = layer.get("outline")
        outline_rgba = resolve_color(outline_key) if outline_key else None
        dither_key = layer.get("ditherColor")
        dither_rgba = resolve_color(dither_key) if dither_key else fill_rgba
        dither_mode = layer.get("dither") or layer.get("shader") or "none"
        shader_scale = float(layer.get("shaderScale", 5.0) or 5.0)
        shader_seed = int(layer.get("seed", 0) or 0)
        use_sdf_3d = bool(layer.get("sdf") or global_sdf_shading) and fill_rgba[3] >= 200

        tones = derive_sdf_shading_tones(fill_rgba)
        tone_syms = _register_sdf_tone_symbols(fill_sym, tones, palette_raw, palette_rgba) if use_sdf_3d else None

        # Determine soft crease color for internal 2.5D anatomical overlap creases
        crease_sym = layer.get("creaseColor")
        crease_rgba = None
        if crease_sym:
            crease_rgba = resolve_color(crease_sym)
        else:
            if "S" in palette_rgba and fill_sym == "W":
                crease_sym = "S"
                crease_rgba = palette_rgba["S"]
            else:
                crease_rgba = tones["shadow"]
                crease_sym = tone_syms["shadow"] if tone_syms else fill_sym

        # Detect 1px internal anatomical creases between overlapping sub-shapes when crease=True and front_z > back_z
        crease_mask = bytearray(width * height)
        base_z = sub_sdfs[0][1] if (sub_sdfs and len(sub_sdfs) > 0) else 0.0
        if sub_sdfs and len(sub_sdfs) >= 2 and fill_rgba[3] >= 200:
            for k_idx in range(len(sub_sdfs)):
                front_sdf, front_z, front_crease = sub_sdfs[k_idx]
                if not front_crease:
                    continue
                for prev_idx in range(len(sub_sdfs)):
                    if prev_idx == k_idx:
                        continue
                    back_sdf, back_z, _ = sub_sdfs[prev_idx]
                    if front_z <= back_z:
                        continue
                    for y in range(1, height - 1):
                        for x in range(1, width - 1):
                            idx = y * width + x
                            if not full_mask[idx]:
                                continue
                            df = front_sdf[idx]
                            db = back_sdf[idx]
                            # 1px interior rim of front part overlapping inside back part
                            if -0.95 <= df <= 0.15 and db <= -0.45:
                                crease_mask[idx] = 1

        lx_light, ly_light, lz_light = -0.52, -0.62, 0.58

        for y in range(height):
            for x in range(width):
                idx = y * width + x
                if not full_mask[idx]:
                    continue
                is_edge = (
                    x == 0 or x == width - 1 or y == 0 or y == height - 1 or
                    not full_mask[y * width + (x - 1)] or
                    not full_mask[y * width + (x + 1)] or
                    not full_mask[(y - 1) * width + x] or
                    not full_mask[(y + 1) * width + x]
                )

                # Continuous unclamped SDF gradient multiplied by analytical spherical dome derivative dz/dt
                d_l = sdf_field[y * width + max(0, x - 1)]
                d_r = sdf_field[y * width + min(width - 1, x + 1)]
                d_u = sdf_field[max(0, y - 1) * width + x]
                d_d = sdf_field[min(height - 1, y + 1) * width + x]
                gx = (d_r - d_l) * 0.5
                gy = (d_d - d_u) * 0.5

                # Blend foreground sub-shape normal differential (dZ / dN) when elevated sub-shape overlaps
                if sub_sdfs and len(sub_sdfs) >= 2:
                    top_z = base_z
                    top_sdf = None
                    for s_sdf, s_z, _ in sub_sdfs:
                        if s_z > top_z and s_sdf[idx] <= 0.0:
                            top_z = s_z
                            top_sdf = s_sdf
                    if top_sdf is not None:
                        fg_gx = (top_sdf[y * width + min(width - 1, x + 1)] - top_sdf[y * width + max(0, x - 1)]) * 0.5
                        fg_gy = (top_sdf[min(height - 1, y + 1) * width + x] - top_sdf[max(0, y - 1) * width + x]) * 0.5
                        gx = gx * 0.45 + fg_gx * 0.55
                        gy = gy * 0.45 + fg_gy * 0.55

                t_depth = max(0.0, min(1.0, -sdf_field[idx] / max(1.5, max_depth)))
                dz_dt = 0.65 * (1.0 - t_depth) / math.sqrt(max(0.16, t_depth * (2.0 - t_depth)))
                nx = gx * dz_dt
                ny = gy * dz_dt
                nz = 1.0
                inv_len = 1.0 / math.sqrt(nx * nx + ny * ny + nz * nz)
                nx *= inv_len
                ny *= inv_len
                nz *= inv_len
                if fill_rgba[3] >= 180 or (outline_rgba and outline_rgba[3] >= 180 and is_edge):
                    set_normal_pixel(x, y, nx, ny, nz)

                if outline_rgba and outline_rgba[3] > 0 and is_edge:
                    if (use_sel_out or layer.get("selOut")) and (nx * lx_light + ny * ly_light + nz * lz_light) > 0.25:
                        sel_rgba = (
                            int((outline_rgba[0] + tones["deepShadow"][0]) * 0.5),
                            int((outline_rgba[1] + tones["deepShadow"][1]) * 0.5),
                            int((outline_rgba[2] + tones["deepShadow"][2]) * 0.5),
                            outline_rgba[3]
                        )
                        blend_pixel(x, y, sel_rgba, outline_key)
                    else:
                        blend_pixel(x, y, outline_rgba, outline_key)
                elif crease_mask[idx] and crease_rgba:
                    blend_pixel(x, y, crease_rgba, crease_sym)
                elif fill_rgba[3] > 0:
                    if use_sdf_3d and tone_syms:
                        bayer = BAYER_2X2[y & 1][x & 1]
                        intensity = (nx * lx_light + ny * ly_light + nz * lz_light) + bayer

                        chosen_name = "base"
                        if intensity > 0.86:
                            chosen_name = "specular"
                        elif intensity > 0.66:
                            chosen_name = "highlight"
                        elif intensity < 0.25:
                            chosen_name = "deepShadow"
                        elif intensity < 0.44:
                            chosen_name = "shadow"

                        chosen_rgba = tones[chosen_name]
                        chosen_sym = tone_syms[chosen_name]

                        if dither_mode != "none" and check_dither(dither_mode, x, y, nx, ny, shader_scale, shader_seed):
                            chosen_rgba = dither_rgba if dither_key else tones["deepShadow"]
                            chosen_sym = dither_key if dither_key else tone_syms["deepShadow"]
                        blend_pixel(x, y, chosen_rgba, chosen_sym)
                    else:
                        use_dither = check_dither(dither_mode, x, y, nx, ny, shader_scale, shader_seed)
                        blend_pixel(
                            x, y,
                            dither_rgba if use_dither else fill_rgba,
                            (dither_key or fill_sym) if use_dither else fill_sym
                        )

    def plot_point_with_mirror(x, y, thickness, rgba, sym, mirror):
        r = max(1, js_round(thickness or 1))
        half = (r - 1) // 2

        def put(px, py):
            for dy in range(-half, r - half):
                for dx in range(-half, r - half):
                    blend_pixel(px + dx, py + dy, rgba, sym)

        put(x, y)
        if mirror in ("x", "quad"):
            put(width - 1 - x, y)
        if mirror in ("y", "quad"):
            put(x, height - 1 - y)
        if mirror == "quad":
            put(width - 1 - x, height - 1 - y)

    def draw_bresenham_line(x0, y0, x1, y1, thickness, rgba, sym, mirror):
        ix0, iy0 = js_round(x0), js_round(y0)
        ix1, iy1 = js_round(x1), js_round(y1)
        dx = abs(ix1 - ix0)
        sx = 1 if ix0 < ix1 else -1
        dy = -abs(iy1 - iy0)
        sy = 1 if iy0 < iy1 else -1
        err = dx + dy
        while True:
            plot_point_with_mirror(ix0, iy0, thickness, rgba, sym, mirror)
            if ix0 == ix1 and iy0 == iy1:
                break
            e2 = 2 * err
            if e2 >= dy:
                err += dy
                ix0 += sx
            if e2 <= dx:
                err += dx
                iy0 += sy

    layers = spec.get("layers") if isinstance(spec.get("layers"), list) else []
    i = 0
    while i < len(layers):
        layer = layers[i]
        if not isinstance(layer, dict) or not layer.get("op") or layer.get("hidden"):
            i += 1
            continue
        op = str(layer["op"]).lower()

        if op in SDF_SHAPE_OPS:
            combined_sdf = compute_layer_sdf(layer, width, height)
            has_explicit_z = ("z" in layer) or bool(layer.get("crease"))
            sub_sdfs = [(list(combined_sdf), float(layer.get("z", 0)), has_explicit_z)]
            while (
                i + 1 < len(layers) and
                isinstance(layers[i + 1], dict) and
                not layers[i + 1].get("hidden") and
                str(layers[i + 1].get("op", "")).lower() in SDF_SHAPE_OPS and
                (
                    (float(layers[i + 1].get("smoothBlend", 0) or 0) > 0 and layers[i + 1].get("fill") == layer.get("fill")) or
                    str(layers[i + 1].get("opMode", "")).lower() in ("subtract", "smooth_subtract", "intersect", "union", "smooth_union")
                )
            ):
                next_layer = layers[i + 1]
                next_sdf = compute_layer_sdf(next_layer, width, height)
                k = float(next_layer.get("smoothBlend", 0) or 0)
                op_mode = next_layer.get("opMode") or ("smooth_union" if k > 0 else "union")
                for p in range(width * height):
                    combined_sdf[p] = csg_combine(combined_sdf[p], next_sdf[p], op_mode, k)
                if str(op_mode).lower() in ("union", "smooth_union"):
                    next_has_z = ("z" in next_layer) or bool(next_layer.get("crease"))
                    sub_sdfs.append((next_sdf, float(next_layer.get("z", 0)), next_has_z))
                i += 1
            rasterize_sdf_field(combined_sdf, layer, sub_sdfs)

        elif op == "line":
            col_key = layer.get("color") or layer.get("fill") or "O"
            rgba = resolve_color(col_key)
            if isinstance(layer.get("points"), list) and len(layer["points"]) >= 2:
                pts = layer["points"]
                for s_i in range(len(pts) - 1):
                    draw_bresenham_line(
                        pts[s_i][0], pts[s_i][1], pts[s_i + 1][0], pts[s_i + 1][1],
                        layer.get("thickness", 1), rgba, col_key, layer.get("mirror", "none")
                    )
            else:
                draw_bresenham_line(
                    layer.get("x1", 0), layer.get("y1", 0),
                    layer.get("x2", 0), layer.get("y2", 0),
                    layer.get("thickness", 1), rgba, col_key, layer.get("mirror", "none")
                )

        elif op == "curve" and isinstance(layer.get("points"), list) and len(layer["points"]) >= 3:
            col_key = layer.get("color") or layer.get("fill") or "O"
            rgba = resolve_color(col_key)
            p0, p1, p2 = layer["points"][:3]
            steps = 24
            prev_x, prev_y = float(p0[0]), float(p0[1])
            for s in range(1, steps + 1):
                t = s / float(steps)
                inv = 1.0 - t
                nx = inv * inv * p0[0] + 2 * inv * t * p1[0] + t * t * p2[0]
                ny = inv * inv * p0[1] + 2 * inv * t * p1[1] + t * t * p2[1]
                draw_bresenham_line(
                    prev_x, prev_y, nx, ny,
                    layer.get("thickness", 1), rgba, col_key, layer.get("mirror", "none")
                )
                prev_x, prev_y = nx, ny

        elif op in ("stamp", "stamp_grid") and isinstance(layer.get("grid"), list):
            ox = js_round(float(layer.get("x", 0)))
            oy = js_round(float(layer.get("y", 0)))
            mirror = layer.get("mirror", "none")
            cmap = layer.get("map") if isinstance(layer.get("map"), dict) else {}
            st_angle = float(layer.get("angle", 0.0) or 0.0)
            if abs(st_angle) > 0.5:
                rot_pts = rotate_stamp_epx(layer["grid"], st_angle)
                for sx, sy, ch in rot_pts:
                    c_key = cmap.get(ch, ch)
                    rgba = resolve_color(c_key)
                    plot_point_with_mirror(ox + sx, oy + sy, 1, rgba, c_key, mirror)
            else:
                for sy, row in enumerate(layer["grid"]):
                    row_s = str(row or "")
                    for sx, ch in enumerate(row_s):
                        if ch in (".", " "):
                            continue
                        c_key = cmap.get(ch, ch)
                        rgba = resolve_color(c_key)
                        plot_point_with_mirror(ox + sx, oy + sy, 1, rgba, c_key, mirror)

        elif op == "pixels" and isinstance(layer.get("points"), list):
            col_key = layer.get("color") or layer.get("fill") or "O"
            rgba = resolve_color(col_key)
            mirror = layer.get("mirror", "none")
            for pt in layer["points"]:
                if isinstance(pt, list) and len(pt) >= 2:
                    plot_point_with_mirror(pt[0], pt[1], 1, rgba, col_key, mirror)

        elif op == "rig" and isinstance(layer.get("bones"), list):
            sub_res = render_rig(layer, frame_index)
            sub_buf = sub_res["buffer"]
            for sy in range(min(height, sub_res["height"])):
                for sx in range(min(width, sub_res["width"])):
                    s_idx = (sy * sub_res["width"] + sx) * 4
                    if sub_buf[s_idx + 3] > 0:
                        blend_pixel(sx, sy, tuple(sub_buf[s_idx:s_idx + 4]))

        elif op in ("shader", "glsl"):
            sub_res = render_shader(layer, frame_index)
            sub_buf = sub_res["buffer"]
            for sy in range(min(height, sub_res["height"])):
                for sx in range(min(width, sub_res["width"])):
                    s_idx = (sy * sub_res["width"] + sx) * 4
                    if sub_buf[s_idx + 3] > 0:
                        blend_pixel(sx, sy, tuple(sub_buf[s_idx:s_idx + 4]))

        i += 1


    warnings = []
    if not spec.get("hideGrid") and isinstance(spec.get("grid"), list) and len(spec["grid"]) > 0:
        norm_rows, warnings = normalize_grid(
            spec["grid"], width, height, bool(spec.get("rle")), spec.get("symmetry", "none")
        )
        for y in range(height):
            row_s = norm_rows[y]
            for x in range(width):
                ch = row_s[x]
                if ch in (".", " "):
                    continue
                blend_pixel(x, y, resolve_color(ch), ch)

    # Apply MarkovJunior-style cellular rewrite rules if defined
    if isinstance(spec.get("rules"), list):
        apply_cellular_rules(spec["rules"], width, height, symbol_buffer, buffer, resolve_color)

    sym_mode = spec.get("symmetry", "none")
    if sym_mode in ("horizontal", "quad"):
        half_w = width // 2
        for y in range(height):
            for x in range(half_w):
                src_idx = (y * width + x) * 4
                dst_x = width - 1 - x
                dst_idx = (y * width + dst_x) * 4
                if buffer[src_idx + 3] > 0:
                    buffer[dst_idx:dst_idx + 4] = buffer[src_idx:src_idx + 4]
                    symbol_buffer[y * width + dst_x] = symbol_buffer[y * width + x]
    if sym_mode in ("vertical", "quad"):
        half_h = height // 2
        for y in range(half_h):
            for x in range(width):
                src_idx = (y * width + x) * 4
                dst_y = height - 1 - y
                dst_idx = (dst_y * width + x) * 4
                if buffer[src_idx + 3] > 0:
                    buffer[dst_idx:dst_idx + 4] = buffer[src_idx:src_idx + 4]
                    symbol_buffer[dst_y * width + x] = symbol_buffer[y * width + x]

    if post.get("autoShading"):
        strength = float(post.get("shadingStrength", 0.16))
        copy_buf = bytearray(buffer)

        def is_dark_outline(idx_val):
            if copy_buf[idx_val + 3] < 200:
                return True
            return (copy_buf[idx_val] + copy_buf[idx_val + 1] + copy_buf[idx_val + 2]) < 110

        def same_col(i1, i2):
            return copy_buf[i1:i1 + 4] == copy_buf[i2:i2 + 4]

        for y in range(1, height - 1):
            for x in range(1, width - 1):
                idx = (y * width + x) * 4
                if copy_buf[idx + 3] < 200 or is_dark_outline(idx):
                    continue
                up_idx = ((y - 1) * width + x) * 4
                left_idx = (y * width + (x - 1)) * 4
                down_idx = ((y + 1) * width + x) * 4
                right_idx = (y * width + (x + 1)) * 4

                tl_diff = not same_col(idx, up_idx) and not same_col(idx, left_idx)
                br_diff = not same_col(idx, down_idx) and not same_col(idx, right_idx)

                if tl_diff and not br_diff:
                    buffer[idx] = min(255, js_round(copy_buf[idx] + (255 - copy_buf[idx]) * strength))
                    buffer[idx + 1] = min(255, js_round(copy_buf[idx + 1] + (255 - copy_buf[idx + 1]) * (strength * 1.1)))
                    buffer[idx + 2] = min(255, js_round(copy_buf[idx + 2] + (255 - copy_buf[idx + 2]) * (strength * 0.7)))
                elif br_diff and not tl_diff:
                    buffer[idx] = max(0, js_round(copy_buf[idx] * (1.0 - strength * 1.1)))
                    buffer[idx + 1] = max(0, js_round(copy_buf[idx + 1] * (1.0 - strength)))
                    buffer[idx + 2] = max(0, js_round(copy_buf[idx + 2] * (1.0 - strength * 0.8)))

    if post.get("autoOutline"):
        out_rgba = parse_color(post.get("outlineColor") or palette_raw.get("O") or "#14182e")
        copy_buf = bytearray(buffer)
        for y in range(height):
            for x in range(width):
                idx = (y * width + x) * 4
                if copy_buf[idx + 3] > 0:
                    continue
                has_neighbor = (
                    (x > 0 and copy_buf[(y * width + (x - 1)) * 4 + 3] > 180) or
                    (x < width - 1 and copy_buf[(y * width + (x + 1)) * 4 + 3] > 180) or
                    (y > 0 and copy_buf[((y - 1) * width + x) * 4 + 3] > 180) or
                    (y < height - 1 and copy_buf[((y + 1) * width + x) * 4 + 3] > 180)
                )
                if has_neighbor:
                    buffer[idx:idx + 4] = bytes(out_rgba)
                    symbol_buffer[y * width + x] = "O"

    # Tileable surfaces: derive normals from luminance as a height field, sampled
    # with wrap-around so the normal map is as seamless as the colour map.
    if (spec.get("postProcess") or {}).get("tileNormals"):
        lum = [(buffer[i * 4] * 0.299 + buffer[i * 4 + 1] * 0.587 + buffer[i * 4 + 2] * 0.114) / 255.0
               for i in range(width * height)]
        for y in range(height):
            for x in range(width):
                gx = lum[y * width + (x + 1) % width] - lum[y * width + (x - 1) % width]
                gy = lum[((y + 1) % height) * width + x] - lum[((y - 1) % height) * width + x]
                nx, ny, nz = -gx * 2.0, -gy * 2.0, 1.0
                ln = math.sqrt(nx * nx + ny * ny + nz * nz)
                set_normal_pixel(x, y, nx / ln, ny / ln, nz / ln)

    # Pillar 2: Compute Felzenszwalb EDT normals (and optional 3D bevel shading) for non-SDF active pixels
    alpha_mask = [1 if buffer[i * 4 + 3] >= 180 else 0 for i in range(width * height)]
    if any(alpha_mask):
        edt_sdf = compute_edt_sdf(alpha_mask, width, height)
        max_edt = max([1.0] + [-edt_sdf[i] for i in range(width * height) if alpha_mask[i]])
        lx_light, ly_light, lz_light = -0.52, -0.62, 0.58
        for y in range(height):
            for x in range(width):
                idx = y * width + x
                if not alpha_mask[idx]:
                    continue
                if normal_buffer[idx * 4 + 3] == 0:
                    dl = edt_sdf[y * width + max(0, x - 1)]
                    dr = edt_sdf[y * width + min(width - 1, x + 1)]
                    du = edt_sdf[max(0, y - 1) * width + x]
                    dd = edt_sdf[min(height - 1, y + 1) * width + x]
                    gx = (dr - dl) * 0.5
                    gy = (dd - du) * 0.5
                    gl = math.hypot(gx, gy)
                    t_d = max(0.0, min(1.0, -edt_sdf[idx] / max_edt))
                    slope = (1.0 - t_d) ** 0.85 * 0.78
                    nx = (gx / gl) * slope if gl > 1e-5 else 0.0
                    ny = (gy / gl) * slope if gl > 1e-5 else 0.0
                    nz = math.sqrt(max(0.05, 1.0 - nx * nx - ny * ny))
                    set_normal_pixel(x, y, nx, ny, nz)
                    if global_sdf_shading and -edt_sdf[idx] > 0.6:
                        b_idx = idx * 4
                        r0, g0, b0, a0 = buffer[b_idx], buffer[b_idx + 1], buffer[b_idx + 2], buffer[b_idx + 3]
                        if (r0 + g0 + b0) >= 110 and symbol_buffer[idx] != "O":
                            tones = derive_sdf_shading_tones((r0, g0, b0, a0))
                            tone_syms = _register_sdf_tone_symbols(symbol_buffer[idx], tones, palette_raw, palette_rgba)
                            bayer = BAYER_2X2[y & 1][x & 1]
                            intensity = (nx * lx_light + ny * ly_light + nz * lz_light) + bayer
                            chosen_name = "base"
                            if intensity > 0.86:
                                chosen_name = "specular"
                            elif intensity > 0.66:
                                chosen_name = "highlight"
                            elif intensity < 0.25:
                                chosen_name = "deepShadow"
                            elif intensity < 0.44:
                                chosen_name = "shadow"
                            c_rgba = tones[chosen_name]
                            buffer[b_idx] = c_rgba[0]
                            buffer[b_idx + 1] = c_rgba[1]
                            buffer[b_idx + 2] = c_rgba[2]
                            symbol_buffer[idx] = tone_syms[chosen_name]

    diagnostics = analyze_buffer(width, height, buffer)
    return {
        "width": width,
        "height": height,
        "buffer": buffer,
        "normal_buffer": normal_buffer,
        "symbol_buffer": symbol_buffer,
        "resolved_palette": palette_raw,
        "warnings": warnings,
        "diagnostics": diagnostics
    }


def bake_to_grid(render_result, palette=None):
    width = render_result["width"]
    height = render_result["height"]
    buffer = render_result["buffer"]
    symbol_buffer = render_result["symbol_buffer"]
    resolved = palette if palette is not None else render_result.get("resolved_palette", {})
    if "." not in resolved:
        resolved["."] = "transparent"

    pool = (
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        "!@#$%^&*()-_=+[]{}|;:,.<>?/~`"
        "αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ"
    )
    rgba_to_sym = {}
    for k, v in list(resolved.items()):
        if k != ".":
            rgba_to_sym[parse_color(v)] = k

    rows = []
    for y in range(height):
        row_chars = []
        for x in range(width):
            idx = (y * width + x) * 4
            r, g, b, a = buffer[idx], buffer[idx + 1], buffer[idx + 2], buffer[idx + 3]
            if a == 0:
                row_chars.append(".")
                continue
            sym = symbol_buffer[y * width + x] or "."
            rgba = (r, g, b, a)
            if sym != "." and sym in resolved and parse_color(resolved[sym]) == rgba:
                row_chars.append(sym)
            elif rgba in rgba_to_sym:
                row_chars.append(rgba_to_sym[rgba])
            else:
                new_sym = next((ch for ch in pool if ch not in resolved and ch != "."), "O")
                resolved[new_sym] = rgba_to_hex(r, g, b, a)
                rgba_to_sym[rgba] = new_sym
                row_chars.append(new_sym)
        rows.append("".join(row_chars))
    return rows


# ============================================================================
# Pillar 5: 100% LLM-Free Parametric Archetype Generator & Genome Mutator
# ============================================================================

ARCHETYPE_LIST = (
    "sword", "axe", "shield", "potion", "gem", "slime",
    "beetle", "turtle", "bunny", "crystal_monolith", "spaceship", "autotile_blob47"
)


def generate_archetype(archetype="sword", seed=42, width=32, height=32):
    """Generates a complete, game-ready PixelDSL v3.0 sprite specification purely from mathematics."""
    # Terrain tiles: seamless toroidal generator shared with the web studio.
    tile_spec = tilegen.generate_tile_spec(archetype, seed, clamp_size(width, 32), clamp_size(height, 32))
    if tile_spec is not None:
        return tile_spec

    rng = SeededRNG(seed)
    arch = str(archetype or "sword").lower().strip()
    w = clamp_size(width, 32)
    h = clamp_size(height, 32)
    cx = (w - 1) * 0.5
    cy = (h - 1) * 0.5
    sc = min(w, h) / 32.0

    r1 = lambda v: math.floor(float(v) * 10.0 + 0.5) / 10.0
    r2 = lambda v: math.floor(float(v) * 100.0 + 0.5) / 100.0

    hue_main = rng.range(0, 360)
    hue_acc = (hue_main + rng.choice([120, 150, 180, 210, 60])) % 360.0
    col_main = rgba_to_hex(*oklch_to_rgb(rng.range(0.60, 0.74), rng.range(0.14, 0.22), hue_main))
    col_acc = rgba_to_hex(*oklch_to_rgb(rng.range(0.68, 0.82), rng.range(0.16, 0.24), hue_acc))
    col_steel = rgba_to_hex(*oklch_to_rgb(0.78, 0.04, (hue_main + 220) % 360))
    col_wood = rgba_to_hex(*oklch_to_rgb(0.48, 0.11, 55.0))

    spec = {
        "name": f"proc_{arch}_s{seed}_{w}x{h}",
        "prompt": f"Procedural {arch} (seed={seed}, {w}x{h}) — 100% LLM-Free PixelDSL v3.0",
        "width": w,
        "height": h,
        "symmetry": "none",
        "rle": False,
        "ramps": {
            "M": {"base": col_main, "light": "L", "dark": "D", "outline": "O"},
            "A": {"base": col_acc, "light": "W", "dark": "B", "outline": "O"},
            "S": {"base": col_steel, "light": "w", "dark": "d", "outline": "O"},
            "H": {"base": col_wood, "light": "h", "dark": "b", "outline": "O"}
        },
        "palette": {
            ".": "transparent",
            "O": "#14182e",
            "e": "#0e101c",
            "w": "#ffffff",
            "a": "#14182e44"
        },
        "postProcess": {
            "autoOutline": False,
            "outlineColor": "#14182e",
            "autoShading": False,
            "shadingStrength": 0.16,
            "sdfShading": True,
            "selOut": True
        },
        "layers": [],
        "frames": [],
        "grid": []
    }

    if arch == "sword":
        blade_w = rng.range(2.8, 4.4) * sc
        tip_w = rng.range(0.8, 1.5) * sc
        guard_w = rng.range(5.5, 8.5) * sc
        spec["layers"] = [
            {"id": "shadow", "op": "ellipse", "cx": cx, "cy": r1(h - 3 * sc), "rx": r1(6 * sc), "ry": r1(1.5 * sc), "fill": "a"},
            {"id": "pommel", "op": "ellipse", "cx": cx, "cy": r1(h - 4.5 * sc), "rx": r1(2.2 * sc), "ry": r1(2.2 * sc), "fill": "A", "outline": "O", "sdf": True},
            {"id": "grip", "op": "uneven_capsule", "x1": cx, "y1": r1(h - 6 * sc), "x2": cx, "y2": r1(h - 11 * sc), "r1": r1(1.6 * sc), "r2": r1(1.9 * sc), "fill": "H", "outline": "O", "sdf": True},
            {"id": "blade", "op": "uneven_capsule", "x1": cx, "y1": r1(h - 11 * sc), "x2": cx, "y2": r1(4.5 * sc), "r1": r1(blade_w), "r2": r1(tip_w), "fill": "S", "outline": "O", "sdf": True},
            {"id": "blade_tip", "op": "vesica", "cx": cx, "cy": r1(7.5 * sc), "rx": r1(blade_w * 0.95), "ry": r1(5.0 * sc), "fill": "S", "outline": "O", "sdf": True, "smoothBlend": 1.5},
            {"id": "fuller", "op": "uneven_capsule", "x1": cx, "y1": r1(h - 12 * sc), "x2": cx, "y2": r1(9 * sc), "r1": r1(1.0 * sc), "r2": r1(0.6 * sc), "fill": "M", "sdf": True},
            {"id": "guard", "op": "vesica", "cx": cx, "cy": r1(h - 11 * sc), "rx": r1(guard_w), "ry": r1(2.2 * sc), "angle": rng.range(-8, 8), "fill": "A", "outline": "O", "sdf": True},
            {"id": "gem", "op": "ellipse", "cx": cx, "cy": r1(h - 11 * sc), "rx": r1(1.8 * sc), "ry": r1(1.8 * sc), "fill": "M", "outline": "O", "sdf": True}
        ]
        spec["motion"] = {"type": "idle_breathe", "frames": 4, "amplitude": 0.8, "squash": 0.04}

    elif arch == "axe":
        head_y = r1(11 * sc)
        reach = r1(rng.range(7.5, 10.5) * sc)
        spec["layers"] = [
            {"id": "shadow", "op": "ellipse", "cx": cx, "cy": r1(h - 3 * sc), "rx": r1(7 * sc), "ry": r1(1.5 * sc), "fill": "a"},
            {"id": "haft", "op": "uneven_capsule", "x1": cx, "y1": r1(h - 4 * sc), "x2": cx, "y2": r1(4 * sc), "r1": r1(1.8 * sc), "r2": r1(2.2 * sc), "fill": "H", "outline": "O", "sdf": True},
            {"id": "blade_wing", "op": "moon", "cx": r1(cx - 3.5 * sc), "cy": head_y, "r": reach, "r2": r1(reach * 0.78), "d": r1(reach * 0.42), "angle": 180, "fill": "S", "outline": "O", "mirror": "x", "sdf": True},
            {"id": "socket", "op": "rect", "x": r1(cx - 2.5 * sc), "y": r1(head_y - 3 * sc), "w": r1(5 * sc), "h": r1(6 * sc), "rx": r1(1.5 * sc), "fill": "A", "outline": "O", "sdf": True},
            {"id": "core_gem", "op": "ellipse", "cx": cx, "cy": head_y, "rx": r1(1.8 * sc), "ry": r1(2.2 * sc), "fill": "M", "outline": "O", "sdf": True}
        ]

    elif arch == "shield":
        rx_s = r1(rng.range(9.5, 11.5) * sc)
        ry_s = r1(rng.range(11.0, 12.5) * sc)
        spec["layers"] = [
            {"id": "shadow", "op": "ellipse", "cx": cx, "cy": r1(h - 3 * sc), "rx": r1(8 * sc), "ry": r1(2 * sc), "fill": "a"},
            {"id": "rim", "op": "vesica", "cx": cx, "cy": cy, "rx": rx_s, "ry": ry_s, "fill": "S", "outline": "O", "sdf": True},
            {"id": "field", "op": "vesica", "cx": cx, "cy": cy, "rx": r1(rx_s - 2.2 * sc), "ry": r1(ry_s - 2.2 * sc), "fill": "M", "outline": "O", "sdf": True, "dither": rng.choice(["worley", "checker", "none"]), "shaderScale": 6.0, "seed": seed},
            {"id": "emblem", "op": "star", "cx": cx, "cy": cy, "r": r1(5.5 * sc), "n": rng.choice([4, 5, 6]), "innerRatio": 0.48, "fill": "A", "outline": "O", "sdf": True}
        ]

    elif arch == "potion":
        body_r = r1(rng.range(7.5, 9.5) * sc)
        by = r1(cy + 3.5 * sc)
        spec["layers"] = [
            {"id": "shadow", "op": "ellipse", "cx": cx, "cy": r1(h - 3 * sc), "rx": r1(7 * sc), "ry": r1(1.8 * sc), "fill": "a"},
            {"id": "cork", "op": "rect", "x": r1(cx - 2.2 * sc), "y": r1(3.5 * sc), "w": r1(4.4 * sc), "h": r1(3.5 * sc), "rx": r1(1.0 * sc), "fill": "H", "outline": "O", "sdf": True},
            {"id": "neck", "op": "rect", "x": r1(cx - 3.2 * sc), "y": r1(6.5 * sc), "w": r1(6.4 * sc), "h": r1(4.5 * sc), "rx": r1(1.0 * sc), "fill": "S", "outline": "O", "sdf": True},
            {"id": "flask_outer", "op": "ellipse", "cx": cx, "cy": by, "rx": body_r, "ry": body_r, "fill": "S", "outline": "O", "sdf": True},
            {"id": "liquid", "op": "ellipse", "cx": cx, "cy": r1(by + 1.0 * sc), "rx": r1(body_r - 1.6 * sc), "ry": r1(body_r - 2.0 * sc), "fill": "M", "outline": "O", "sdf": True, "dither": "voronoi", "shaderScale": 4.5, "seed": seed},
            {"id": "glint", "op": "ellipse", "cx": r1(cx - body_r * 0.45), "cy": r1(by - body_r * 0.35), "rx": r1(1.6 * sc), "ry": r1(2.6 * sc), "angle": -25, "fill": "w"}
        ]
        spec["motion"] = {"type": "idle_breathe", "frames": 4, "amplitude": 0.7, "squash": 0.06}

    elif arch == "gem":
        n_sides = rng.choice([5, 6, 8])
        spec["layers"] = [
            {"id": "shadow", "op": "ellipse", "cx": cx, "cy": r1(h - 3.5 * sc), "rx": r1(6.5 * sc), "ry": r1(1.8 * sc), "fill": "a"},
            {"id": "body_gem", "op": "ngon", "cx": cx, "cy": cy, "r": r1(10.5 * sc), "n": n_sides, "fill": "M", "outline": "O", "sdf": True, "dither": "worley", "shaderScale": 5.5, "seed": seed},
            {"id": "inner_core", "op": "star", "cx": cx, "cy": cy, "r": r1(6.5 * sc), "n": n_sides, "innerRatio": 0.62, "fill": "A", "outline": "O", "sdf": True},
            {"id": "spec", "op": "ellipse", "cx": r1(cx - 2.5 * sc), "cy": r1(cy - 3.0 * sc), "rx": r1(1.8 * sc), "ry": r1(1.2 * sc), "angle": -30, "fill": "w"}
        ]
        spec["motion"] = {"type": "idle_breathe", "frames": 4, "amplitude": 1.0, "squash": 0.05}

    elif arch == "slime":
        rx_b = r1(rng.range(9.0, 10.5) * sc)
        ry_b = r1(rng.range(7.2, 8.6) * sc)
        spec["layers"] = [
            {"id": "shadow", "op": "ellipse", "cx": cx, "cy": r1(h - 4 * sc), "rx": r1(rx_b * 1.05), "ry": r1(2.2 * sc), "fill": "a"},
            {"id": "crown", "op": "star", "cx": cx, "cy": r1(cy - ry_b - 1.2 * sc), "r": r1(3.8 * sc), "n": 5, "innerRatio": 0.55, "fill": "A", "outline": "O", "sdf": True, "parent": "slime_body"},
            {"id": "slime_body", "op": "ellipse", "cx": cx, "cy": r1(cy + 2 * sc), "rx": rx_b, "ry": ry_b, "fill": "M", "outline": "O", "sdf": True, "smoothBlend": 3.0},
            {"id": "slime_lobes", "op": "ellipse", "cx": r1(cx - rx_b * 0.68), "cy": r1(cy + 5.2 * sc), "rx": r1(4.6 * sc), "ry": r1(3.6 * sc), "fill": "M", "outline": "O", "mirror": "x", "sdf": True, "smoothBlend": 3.0},
            {"id": "slime_top", "op": "ellipse", "cx": cx, "cy": r1(cy - 2.8 * sc), "rx": r1(rx_b * 0.62), "ry": r1(4.2 * sc), "fill": "M", "outline": "O", "sdf": True, "smoothBlend": 2.5},
            {"id": "eye_l", "op": "ellipse", "cx": r1(cx - 3.5 * sc), "cy": r1(cy + 1.0 * sc), "rx": max(1.0, r1(1.5 * sc)), "ry": max(1.2, r1(2.0 * sc)), "fill": "e", "mirror": "x", "parent": "slime_body"},
            {"id": "glint", "op": "pixels", "color": "w", "mirror": "x", "points": [[js_round(cx - 4 * sc), js_round(cy)]], "parent": "slime_body"}
        ]
        spec["motion"] = {"type": "idle_breathe", "frames": 4, "amplitude": r2(1.0 * sc), "squash": 0.12}

    elif arch == "beetle":
        spec["layers"] = [
            {"id": "shadow", "op": "ellipse", "cx": cx, "cy": r1(cy + 2 * sc), "rx": r1(10 * sc), "ry": r1(10 * sc), "fill": "a"},
            {"id": "mandibles", "op": "moon", "cx": r1(cx - 2.5 * sc), "cy": r1(5.5 * sc), "r": r1(3.0 * sc), "r2": r1(2.2 * sc), "d": r1(1.3 * sc), "angle": -90, "fill": "A", "outline": "O", "mirror": "x", "sdf": True},
            {"id": "leg_front", "op": "bezier_sdf", "points": [[r1(cx - 5 * sc), r1(cy - 4 * sc)], [r1(cx - 10 * sc), r1(cy - 7 * sc)], [r1(cx - 12 * sc), r1(cy - 11 * sc)]], "r1": r1(1.4 * sc), "r2": r1(0.9 * sc), "fill": "H", "outline": "O", "mirror": "x", "sdf": True},
            {"id": "leg_mid", "op": "bezier_sdf", "points": [[r1(cx - 6 * sc), r1(cy)], [r1(cx - 11 * sc), r1(cy)], [r1(cx - 13 * sc), r1(cy - 2 * sc)]], "r1": r1(1.4 * sc), "r2": r1(0.9 * sc), "fill": "H", "outline": "O", "mirror": "x", "sdf": True},
            {"id": "leg_back", "op": "bezier_sdf", "points": [[r1(cx - 5 * sc), r1(cy + 5 * sc)], [r1(cx - 10 * sc), r1(cy + 8 * sc)], [r1(cx - 12 * sc), r1(cy + 12 * sc)]], "r1": r1(1.4 * sc), "r2": r1(0.9 * sc), "fill": "H", "outline": "O", "mirror": "x", "sdf": True},
            {"id": "thorax", "op": "ellipse", "cx": cx, "cy": r1(10.5 * sc), "rx": r1(6.5 * sc), "ry": r1(4.0 * sc), "fill": "A", "outline": "O", "sdf": True},
            {"id": "abdomen", "op": "ellipse", "cx": cx, "cy": r1(cy + 3.5 * sc), "rx": r1(8.0 * sc), "ry": r1(9.5 * sc), "fill": "M", "outline": "O", "sdf": True, "dither": "worley", "shaderScale": 4.8, "seed": seed},
            {"id": "seam", "op": "line", "x1": cx, "y1": js_round(11 * sc), "x2": cx, "y2": js_round(cy + 12 * sc), "thickness": 1, "color": "O"}
        ]
        spec["motion"] = {"type": "walk_cycle", "frames": 4, "amplitude": r2(1.0 * sc), "squash": 0.05}

    elif arch == "turtle":
        spec["layers"] = [
            {"id": "shadow", "op": "ellipse", "cx": cx, "cy": r1(cy + 1.5 * sc), "rx": r1(11 * sc), "ry": r1(11 * sc), "fill": "a"},
            {"id": "flipper_front", "op": "vesica", "cx": r1(cx - 9.5 * sc), "cy": r1(cy - 4.5 * sc), "rx": r1(2.8 * sc), "ry": r1(5.5 * sc), "angle": 55, "fill": "A", "outline": "O", "mirror": "x", "sdf": True},
            {"id": "flipper_back", "op": "vesica", "cx": r1(cx - 7.5 * sc), "cy": r1(cy + 7.5 * sc), "rx": r1(2.2 * sc), "ry": r1(4.2 * sc), "angle": -45, "fill": "A", "outline": "O", "mirror": "x", "sdf": True},
            {"id": "head", "op": "ellipse", "cx": cx, "cy": r1(5.5 * sc), "rx": r1(3.8 * sc), "ry": r1(3.8 * sc), "fill": "A", "outline": "O", "sdf": True},
            {"id": "shell_rim", "op": "ellipse", "cx": cx, "cy": r1(cy + 1.0 * sc), "rx": r1(8.8 * sc), "ry": r1(10.5 * sc), "fill": "H", "outline": "O", "sdf": True},
            {"id": "shell_dome", "op": "ellipse", "cx": cx, "cy": r1(cy + 1.0 * sc), "rx": r1(7.5 * sc), "ry": r1(9.0 * sc), "fill": "M", "outline": "O", "sdf": True, "dither": "worley", "shaderScale": 5.2, "seed": seed},
            {"id": "eyes", "op": "pixels", "color": "e", "mirror": "x", "points": [[js_round(cx - 2.5 * sc), js_round(4.0 * sc)]]}
        ]
        spec["motion"] = {"type": "swim_cycle", "frames": 4, "amplitude": r2(1.0 * sc), "squash": 0.04}

    elif arch == "bunny":
        spec["layers"] = [
            {"id": "shadow", "op": "ellipse", "cx": cx, "cy": r1(h - 3.5 * sc), "rx": r1(8.5 * sc), "ry": r1(1.5 * sc), "fill": "a"},
            {"id": "ear_back", "op": "uneven_capsule", "x1": r1(cx + 1 * sc), "y1": r1(cy - 3 * sc), "x2": r1(cx - 2 * sc), "y2": r1(5.5 * sc), "r1": r1(2.1 * sc), "r2": r1(1.4 * sc), "fill": "A", "outline": "O", "sdf": True, "parent": "body"},
            {"id": "tail", "op": "ellipse", "cx": r1(cx - 9.0 * sc), "cy": r1(cy + 4.5 * sc), "rx": r1(2.6 * sc), "ry": r1(2.6 * sc), "fill": "S", "outline": "O", "sdf": True, "parent": "body"},
            {"id": "body", "op": "ellipse", "cx": cx, "cy": r1(cy + 4.5 * sc), "rx": r1(6.2 * sc), "ry": r1(5.0 * sc), "angle": -8, "fill": "S", "outline": "O", "sdf": True, "smoothBlend": 2.0, "z": 1},
            {"id": "thigh", "op": "ellipse", "cx": r1(cx - 4.5 * sc), "cy": r1(cy + 5.5 * sc), "rx": r1(4.8 * sc), "ry": r1(3.8 * sc), "angle": -10, "fill": "S", "outline": "O", "sdf": True, "smoothBlend": 1.8, "z": 2, "crease": True, "parent": "body"},
            {"id": "head", "op": "ellipse", "cx": r1(cx + 4.5 * sc), "cy": r1(cy - 1.0 * sc), "rx": r1(4.8 * sc), "ry": r1(4.5 * sc), "fill": "S", "outline": "O", "sdf": True, "smoothBlend": 1.6, "z": 1, "parent": "body"},
            {"id": "ear_front", "op": "uneven_capsule", "x1": r1(cx + 3.5 * sc), "y1": r1(cy - 3 * sc), "x2": r1(cx + 1.0 * sc), "y2": r1(5.5 * sc), "r1": r1(2.2 * sc), "r2": r1(1.5 * sc), "fill": "S", "outline": "O", "sdf": True, "smoothBlend": 1.4, "z": 2, "crease": True, "parent": "body"},
            {"id": "eye", "op": "ellipse", "cx": r1(cx + 6.5 * sc), "cy": r1(cy - 2.0 * sc), "rx": max(1.0, r1(1.3 * sc)), "ry": max(1.2, r1(1.6 * sc)), "fill": "e", "parent": "body"}
        ]
        spec["motion"] = {"type": "jump_arc", "frames": 4, "amplitude": r2(1.0 * sc), "squash": 0.10}

    elif arch == "crystal_monolith":
        spec["layers"] = [
            {"id": "shadow", "op": "ellipse", "cx": cx, "cy": r1(h - 3.5 * sc), "rx": r1(9.0 * sc), "ry": r1(2.0 * sc), "fill": "a"},
            {"id": "pedestal", "op": "rect", "x": r1(cx - 6.5 * sc), "y": r1(h - 8.5 * sc), "w": r1(13 * sc), "h": r1(4.0 * sc), "rx": r1(1.0 * sc), "fill": "H", "outline": "O", "sdf": True},
            {"id": "monolith_body", "op": "vesica", "cx": cx, "cy": r1(cy - 1.5 * sc), "rx": r1(5.2 * sc), "ry": r1(10.5 * sc), "fill": "M", "outline": "O", "sdf": True, "dither": "worley", "shaderScale": 5.5, "seed": seed},
            {"id": "shard_orbit", "op": "vesica", "cx": r1(cx - 8.5 * sc), "cy": cy, "rx": r1(2.0 * sc), "ry": r1(4.5 * sc), "angle": -18, "fill": "A", "outline": "O", "mirror": "x", "sdf": True},
            {"id": "core_star", "op": "star", "cx": cx, "cy": r1(cy - 1.5 * sc), "r": r1(3.8 * sc), "n": 4, "innerRatio": 0.45, "fill": "w", "outline": "O", "sdf": True}
        ]
        spec["motion"] = {"type": "idle_breathe", "frames": 4, "amplitude": r2(1.0 * sc), "squash": 0.04}

    elif arch == "spaceship":
        spec["layers"] = [
            {"id": "wings", "op": "polygon", "points": [[cx, r1(6 * sc)], [r1(cx - 12 * sc), r1(cy + 6 * sc)], [r1(cx - 10 * sc), r1(h - 5 * sc)], [cx, r1(cy + 4 * sc)]], "fill": "S", "outline": "O", "mirror": "x", "sdf": True},
            {"id": "thrusters", "op": "rect", "x": r1(cx - 6.5 * sc), "y": r1(h - 7.5 * sc), "w": r1(3.5 * sc), "h": r1(4 * sc), "rx": r1(1.0 * sc), "fill": "A", "outline": "O", "mirror": "x", "sdf": True},
            {"id": "hull", "op": "vesica", "cx": cx, "cy": cy, "rx": r1(5.2 * sc), "ry": r1(11.5 * sc), "fill": "M", "outline": "O", "sdf": True},
            {"id": "cockpit", "op": "vesica", "cx": cx, "cy": r1(cy - 1.5 * sc), "rx": r1(2.6 * sc), "ry": r1(5.0 * sc), "fill": "A", "outline": "O", "sdf": True}
        ]
        spec["motion"] = {"type": "idle_breathe", "frames": 4, "amplitude": r2(0.8 * sc), "squash": 0.03}
    elif arch in ("grass_tile", "tile_grass", "grass"):
        hue_g = rng.range(125, 142)
        c_turf = rgba_to_hex(*oklch_to_rgb(0.55, 0.18, hue_g))
        c_blade = rgba_to_hex(*oklch_to_rgb(0.72, 0.20, hue_g + 8))
        spec["ramps"]["M"] = {"base": c_turf, "light": "L", "dark": "D", "outline": "O"}
        spec["ramps"]["A"] = {"base": c_blade, "light": "W", "dark": "B", "outline": "O"}
        spec["palette"]["y"] = "#fde047"
        spec["palette"]["f"] = "#f8fafc"
        spec["layers"] = [
            {"id": "turf_base", "op": "rect", "x": 0, "y": 0, "w": w, "h": h, "fill": "M", "sdf": True, "dither": "worley", "shaderScale": 5.5, "seed": seed},
            {"id": "tuft_1", "op": "vesica", "cx": r1(cx - 7 * sc), "cy": r1(cy - 6 * sc), "rx": r1(2.0 * sc), "ry": r1(4.5 * sc), "angle": -15, "fill": "A", "sdf": True},
            {"id": "tuft_2", "op": "vesica", "cx": r1(cx + 8 * sc), "cy": r1(cy - 7 * sc), "rx": r1(1.8 * sc), "ry": r1(4.2 * sc), "angle": 12, "fill": "A", "sdf": True},
            {"id": "tuft_3", "op": "vesica", "cx": r1(cx - 2 * sc), "cy": r1(cy + 6 * sc), "rx": r1(2.2 * sc), "ry": r1(4.8 * sc), "angle": -8, "fill": "A", "sdf": True},
            {"id": "tuft_4", "op": "vesica", "cx": r1(cx + 9 * sc), "cy": r1(cy + 8 * sc), "rx": r1(1.9 * sc), "ry": r1(4.0 * sc), "angle": 18, "fill": "A", "sdf": True},
            {"id": "flower_1", "op": "ellipse", "cx": r1(cx - 5 * sc), "cy": r1(cy + 2 * sc), "rx": r1(1.2 * sc), "ry": r1(1.2 * sc), "fill": "y"},
            {"id": "flower_2", "op": "ellipse", "cx": r1(cx + 4 * sc), "cy": r1(cy + 3 * sc), "rx": r1(1.2 * sc), "ry": r1(1.2 * sc), "fill": "f"}
        ]

    elif arch in ("dirt_tile", "tile_dirt", "dirt", "earth"):
        c_soil = rgba_to_hex(*oklch_to_rgb(0.42, 0.12, 52.0))
        c_clay = rgba_to_hex(*oklch_to_rgb(0.52, 0.14, 48.0))
        spec["ramps"]["M"] = {"base": c_soil, "light": "L", "dark": "D", "outline": "O"}
        spec["ramps"]["A"] = {"base": c_clay, "light": "W", "dark": "B", "outline": "O"}
        spec["palette"]["p"] = "#94a3b8"
        spec["palette"]["d"] = "#382014"
        spec["layers"] = [
            {"id": "soil_base", "op": "rect", "x": 0, "y": 0, "w": w, "h": h, "fill": "M", "sdf": True, "dither": "worley", "shaderScale": 4.5, "seed": seed},
            {"id": "crack_1", "op": "bezier_sdf", "points": [[r1(5 * sc), r1(7 * sc)], [r1(cx - 2 * sc), r1(cy - 3 * sc)], [r1(cx + 4 * sc), r1(cy + 6 * sc)]], "r1": r1(1.2 * sc), "r2": r1(0.7 * sc), "fill": "d"},
            {"id": "pebble_1", "op": "ellipse", "cx": r1(cx - 7 * sc), "cy": r1(cy + 6 * sc), "rx": r1(2.0 * sc), "ry": r1(1.4 * sc), "fill": "p", "outline": "O", "sdf": True},
            {"id": "pebble_2", "op": "ellipse", "cx": r1(cx + 8 * sc), "cy": r1(cy - 6 * sc), "rx": r1(1.6 * sc), "ry": r1(1.2 * sc), "fill": "p", "outline": "O", "sdf": True},
            {"id": "clay_patch", "op": "ellipse", "cx": r1(cx + 2 * sc), "cy": r1(cy - 6 * sc), "rx": r1(4.5 * sc), "ry": r1(3.2 * sc), "fill": "A", "sdf": True}
        ]

    elif arch in ("sand_tile", "tile_sand", "sand"):
        c_sand = rgba_to_hex(*oklch_to_rgb(0.74, 0.16, 75.0))
        c_crest = rgba_to_hex(*oklch_to_rgb(0.85, 0.14, 82.0))
        spec["ramps"]["M"] = {"base": c_sand, "light": "L", "dark": "D", "outline": "O"}
        spec["ramps"]["A"] = {"base": c_crest, "light": "W", "dark": "B", "outline": "O"}
        spec["layers"] = [
            {"id": "sand_base", "op": "rect", "x": 0, "y": 0, "w": w, "h": h, "fill": "M", "sdf": True, "dither": "worley", "shaderScale": 6.5, "seed": seed},
            {"id": "dune_1", "op": "bezier_sdf", "points": [[r1(2 * sc), r1(8 * sc)], [r1(cx), r1(6 * sc)], [r1(w - 3 * sc), r1(9 * sc)]], "r1": r1(1.6 * sc), "r2": r1(1.1 * sc), "fill": "A"},
            {"id": "dune_2", "op": "bezier_sdf", "points": [[r1(2 * sc), r1(cy + 2 * sc)], [r1(cx), r1(cy + 4 * sc)], [r1(w - 3 * sc), r1(cy + 1 * sc)]], "r1": r1(1.6 * sc), "r2": r1(1.1 * sc), "fill": "A"},
            {"id": "dune_3", "op": "bezier_sdf", "points": [[r1(2 * sc), r1(h - 7 * sc)], [r1(cx), r1(h - 9 * sc)], [r1(w - 3 * sc), r1(h - 6 * sc)]], "r1": r1(1.6 * sc), "r2": r1(1.1 * sc), "fill": "A"},
            {"id": "glints", "op": "pixels", "color": "w", "points": [[js_round(7 * sc), js_round(6 * sc)], [js_round(cx + 6 * sc), js_round(cy)], [js_round(11 * sc), js_round(h - 8 * sc)]]}
        ]

    elif arch in ("stone_tile", "tile_stone", "stone", "flagstone"):
        c_slab = rgba_to_hex(*oklch_to_rgb(0.60, 0.04, 240.0))
        spec["ramps"]["M"] = {"base": c_slab, "light": "L", "dark": "D", "outline": "O"}
        spec["palette"]["m"] = "#1e293b"
        spec["palette"]["v"] = "#15803d"
        half_w = r1((w - 4 * sc) * 0.5)
        half_h = r1((h - 4 * sc) * 0.5)
        spec["layers"] = [
            {"id": "mortar", "op": "rect", "x": 0, "y": 0, "w": w, "h": h, "fill": "m"},
            {"id": "slab_nw", "op": "rect", "x": r1(1.5 * sc), "y": r1(1.5 * sc), "w": half_w, "h": half_h, "rx": r1(1.2 * sc), "fill": "M", "outline": "O", "sdf": True, "dither": "worley", "shaderScale": 4.5, "seed": seed},
            {"id": "slab_ne", "op": "rect", "x": r1(cx + 1.0 * sc), "y": r1(1.5 * sc), "w": half_w, "h": half_h, "rx": r1(1.2 * sc), "fill": "M", "outline": "O", "sdf": True, "dither": "worley", "shaderScale": 4.5, "seed": seed + 1},
            {"id": "slab_sw", "op": "rect", "x": r1(1.5 * sc), "y": r1(cy + 1.0 * sc), "w": half_w, "h": half_h, "rx": r1(1.2 * sc), "fill": "M", "outline": "O", "sdf": True, "dither": "worley", "shaderScale": 4.5, "seed": seed + 2},
            {"id": "slab_se", "op": "rect", "x": r1(cx + 1.0 * sc), "y": r1(cy + 1.0 * sc), "w": half_w, "h": half_h, "rx": r1(1.2 * sc), "fill": "M", "outline": "O", "sdf": True, "dither": "worley", "shaderScale": 4.5, "seed": seed + 3},
            {"id": "moss", "op": "ellipse", "cx": cx, "cy": cy, "rx": r1(2.5 * sc), "ry": r1(2.5 * sc), "fill": "v"}
        ]

    elif arch in ("water_tile", "tile_water", "water"):
        c_deep = rgba_to_hex(*oklch_to_rgb(0.48, 0.16, 235.0))
        c_cyan = rgba_to_hex(*oklch_to_rgb(0.72, 0.18, 215.0))
        spec["ramps"]["M"] = {"base": c_deep, "light": "L", "dark": "D", "outline": "O"}
        spec["ramps"]["A"] = {"base": c_cyan, "light": "W", "dark": "B", "outline": "O"}
        spec["palette"]["f"] = "#e0f2fe"
        spec["layers"] = [
            {"id": "water_base", "op": "rect", "x": 0, "y": 0, "w": w, "h": h, "fill": "M", "sdf": True, "dither": "voronoi", "shaderScale": 4.5, "seed": seed},
            {"id": "caustic_1", "op": "ellipse", "cx": r1(cx - 5 * sc), "cy": r1(cy - 4 * sc), "rx": r1(6.5 * sc), "ry": r1(4.5 * sc), "fill": "A", "sdf": True},
            {"id": "caustic_2", "op": "ellipse", "cx": r1(cx + 7 * sc), "cy": r1(cy + 5 * sc), "rx": r1(7.0 * sc), "ry": r1(5.0 * sc), "fill": "A", "sdf": True},
            {"id": "foam_crest", "op": "bezier_sdf", "points": [[r1(4 * sc), r1(cy + 5 * sc)], [r1(cx), r1(cy + 2 * sc)], [r1(w - 5 * sc), r1(cy + 6 * sc)]], "r1": r1(1.5 * sc), "r2": r1(0.8 * sc), "fill": "f"}
        ]
        spec["motion"] = {"type": "wave", "frames": 4, "amplitude": 0.8}

    elif arch in ("dragon", "mythic_dragon"):
        spec["layers"] = [
            {"id": "shadow", "op": "ellipse", "cx": cx, "cy": r1(h - 3 * sc), "rx": r1(11 * sc), "ry": r1(2.2 * sc), "fill": "a"},
            {"id": "wing_far", "op": "moon", "cx": r1(cx - 7 * sc), "cy": r1(cy - 6 * sc), "r": r1(10 * sc), "r2": r1(7.5 * sc), "d": r1(3.5 * sc), "angle": -115, "fill": "A", "outline": "O", "sdf": True, "z": 0},
            {"id": "tail", "op": "bezier_sdf", "points": [[r1(cx - 7 * sc), r1(cy + 2 * sc)], [r1(cx - 12 * sc), r1(cy + 4 * sc)], [r1(cx - 13 * sc), r1(cy - 2 * sc)]], "r1": r1(2.8 * sc), "r2": r1(1.0 * sc), "fill": "M", "outline": "O", "sdf": True, "z": 1},
            {"id": "body", "op": "ellipse", "cx": cx, "cy": r1(cy + 1 * sc), "rx": r1(6.8 * sc), "ry": r1(5.5 * sc), "fill": "M", "outline": "O", "sdf": True, "z": 1},
            {"id": "neck", "op": "uneven_capsule", "x1": r1(cx + 3 * sc), "y1": r1(cy - 1 * sc), "x2": r1(cx + 8 * sc), "y2": r1(cy - 7 * sc), "r1": r1(3.5 * sc), "r2": r1(2.8 * sc), "fill": "M", "outline": "O", "sdf": True, "z": 1},
            {"id": "head", "op": "uneven_capsule", "x1": r1(cx + 8 * sc), "y1": r1(cy - 7 * sc), "x2": r1(cx + 12 * sc), "y2": r1(cy - 6 * sc), "r1": r1(3.0 * sc), "r2": r1(1.6 * sc), "fill": "M", "outline": "O", "sdf": True, "z": 1},
            {"id": "horns", "op": "moon", "cx": r1(cx + 8 * sc), "cy": r1(cy - 10 * sc), "r": r1(3.5 * sc), "r2": r1(2.8 * sc), "d": r1(1.2 * sc), "angle": -60, "fill": "S", "outline": "O", "sdf": True, "z": 1},
            {"id": "wing_near", "op": "moon", "cx": r1(cx + 2 * sc), "cy": r1(cy - 7 * sc), "r": r1(11 * sc), "r2": r1(8.5 * sc), "d": r1(3.8 * sc), "angle": -115, "fill": "M", "outline": "O", "sdf": True, "crease": True, "z": 2},
            {"id": "eye", "op": "pixels", "color": "w", "points": [[js_round(cx + 9 * sc), js_round(cy - 7 * sc)]]}
        ]
        spec["motion"] = {"type": "idle_breathe", "frames": 4, "amplitude": 1.0, "squash": 0.05}

    elif arch in ("spider", "crawler_spider"):
        spec["layers"] = [
            {"id": "shadow", "op": "ellipse", "cx": cx, "cy": r1(h - 3 * sc), "rx": r1(10 * sc), "ry": r1(2.2 * sc), "fill": "a"},
            {"id": "legs_l", "op": "bezier_sdf", "points": [[r1(cx - 3 * sc), r1(cy)], [r1(cx - 11 * sc), r1(cy - 6 * sc)], [r1(cx - 13 * sc), r1(cy + 6 * sc)]], "r1": r1(1.5 * sc), "r2": r1(0.8 * sc), "fill": "H", "outline": "O", "mirror": "x", "sdf": True},
            {"id": "legs_mid", "op": "bezier_sdf", "points": [[r1(cx - 3 * sc), r1(cy + 2 * sc)], [r1(cx - 12 * sc), r1(cy + 2 * sc)], [r1(cx - 14 * sc), r1(cy + 10 * sc)]], "r1": r1(1.5 * sc), "r2": r1(0.8 * sc), "fill": "H", "outline": "O", "mirror": "x", "sdf": True},
            {"id": "abdomen", "op": "ellipse", "cx": cx, "cy": r1(cy - 3 * sc), "rx": r1(7.5 * sc), "ry": r1(6.8 * sc), "fill": "M", "outline": "O", "sdf": True, "dither": "worley", "shaderScale": 4.5, "seed": seed},
            {"id": "thorax", "op": "ellipse", "cx": cx, "cy": r1(cy + 4 * sc), "rx": r1(4.8 * sc), "ry": r1(3.8 * sc), "fill": "A", "outline": "O", "sdf": True},
            {"id": "fangs", "op": "vesica", "cx": r1(cx - 1.8 * sc), "cy": r1(cy + 8 * sc), "rx": r1(1.2 * sc), "ry": r1(2.2 * sc), "fill": "S", "outline": "O", "mirror": "x", "sdf": True},
            {"id": "eyes", "op": "pixels", "color": "w", "mirror": "x", "points": [[js_round(cx - 2 * sc), js_round(cy + 4 * sc)], [js_round(cx - 1 * sc), js_round(cy + 3 * sc)]]}
        ]
        spec["motion"] = {"type": "walk_cycle", "frames": 4, "amplitude": 1.0, "squash": 0.05}

    elif arch in ("snake", "serpent_snake", "serpent"):
        spec["layers"] = [
            {"id": "shadow", "op": "ellipse", "cx": cx, "cy": r1(h - 3 * sc), "rx": r1(10 * sc), "ry": r1(2.0 * sc), "fill": "a"},
            {"id": "coil_1", "op": "ellipse", "cx": r1(cx - 5 * sc), "cy": r1(cy + 4 * sc), "rx": r1(5.5 * sc), "ry": r1(4.2 * sc), "fill": "M", "outline": "O", "sdf": True, "smoothBlend": 2.0},
            {"id": "coil_2", "op": "ellipse", "cx": r1(cx + 4 * sc), "cy": r1(cy + 5 * sc), "rx": r1(5.5 * sc), "ry": r1(4.2 * sc), "fill": "M", "outline": "O", "sdf": True, "smoothBlend": 2.0},
            {"id": "neck_body", "op": "uneven_capsule", "x1": r1(cx - 3 * sc), "y1": r1(cy + 2 * sc), "x2": r1(cx - 2 * sc), "y2": r1(cy - 4 * sc), "r1": r1(3.2 * sc), "r2": r1(2.5 * sc), "fill": "M", "outline": "O", "sdf": True, "smoothBlend": 2.0},
            {"id": "hood", "op": "vesica", "cx": r1(cx + 1 * sc), "cy": r1(cy - 6 * sc), "rx": r1(5.5 * sc), "ry": r1(3.2 * sc), "angle": 0, "fill": "A", "outline": "O", "sdf": True},
            {"id": "head", "op": "ellipse", "cx": r1(cx + 1 * sc), "cy": r1(cy - 6 * sc), "rx": r1(3.2 * sc), "ry": r1(2.8 * sc), "fill": "M", "outline": "O", "sdf": True},
            {"id": "tongue", "op": "polygon", "points": [[r1(cx + 4 * sc), r1(cy - 6 * sc)], [r1(cx + 7 * sc), r1(cy - 7 * sc)], [r1(cx + 9 * sc), r1(cy - 8 * sc)], [r1(cx + 7 * sc), r1(cy - 6 * sc)], [r1(cx + 9 * sc), r1(cy - 5 * sc)]], "fill": "S"}
        ]
        spec["motion"] = {"type": "idle_breathe", "frames": 4, "amplitude": 0.8, "squash": 0.05}

    elif arch in ("golem", "golem_stone"):
        spec["layers"] = [
            {"id": "shadow", "op": "ellipse", "cx": cx, "cy": r1(h - 3 * sc), "rx": r1(11 * sc), "ry": r1(2.2 * sc), "fill": "a"},
            {"id": "leg_l", "op": "uneven_capsule", "x1": r1(cx - 5 * sc), "y1": r1(cy + 4 * sc), "x2": r1(cx - 5 * sc), "y2": r1(h - 4 * sc), "r1": r1(3.2 * sc), "r2": r1(3.8 * sc), "fill": "H", "outline": "O", "sdf": True},
            {"id": "leg_r", "op": "uneven_capsule", "x1": r1(cx + 5 * sc), "y1": r1(cy + 4 * sc), "x2": r1(cx + 5 * sc), "y2": r1(h - 4 * sc), "r1": r1(3.2 * sc), "r2": r1(3.8 * sc), "fill": "H", "outline": "O", "sdf": True},
            {"id": "torso", "op": "rect", "x": r1(cx - 8 * sc), "y": r1(cy - 5 * sc), "w": r1(16 * sc), "h": r1(11 * sc), "rx": r1(2.5 * sc), "fill": "M", "outline": "O", "sdf": True, "dither": "worley", "shaderScale": 4.5, "seed": seed},
            {"id": "head", "op": "rect", "x": r1(cx - 4.5 * sc), "y": r1(cy - 11 * sc), "w": r1(9 * sc), "h": r1(6 * sc), "rx": r1(1.5 * sc), "fill": "H", "outline": "O", "sdf": True},
            {"id": "shoulder_l", "op": "ellipse", "cx": r1(cx - 9.5 * sc), "cy": r1(cy - 3 * sc), "rx": r1(3.5 * sc), "ry": r1(3.5 * sc), "fill": "H", "outline": "O", "sdf": True},
            {"id": "shoulder_r", "op": "ellipse", "cx": r1(cx + 9.5 * sc), "cy": r1(cy - 3 * sc), "rx": r1(3.5 * sc), "ry": r1(3.5 * sc), "fill": "H", "outline": "O", "sdf": True},
            {"id": "fist_l", "op": "rect", "x": r1(cx - 12.5 * sc), "y": r1(cy + 2 * sc), "w": r1(5 * sc), "h": r1(6 * sc), "rx": r1(1.5 * sc), "fill": "M", "outline": "O", "sdf": True},
            {"id": "fist_r", "op": "rect", "x": r1(cx + 7.5 * sc), "y": r1(cy + 2 * sc), "w": r1(5 * sc), "h": r1(6 * sc), "rx": r1(1.5 * sc), "fill": "M", "outline": "O", "sdf": True},
            {"id": "core_rune", "op": "star", "cx": cx, "cy": cy, "r": r1(3.2 * sc), "n": 4, "innerRatio": 0.45, "fill": "A", "outline": "O", "sdf": True},
            {"id": "eye_slit", "op": "pixels", "color": "A", "points": [[js_round(cx - 2 * sc), js_round(cy - 8 * sc)], [js_round(cx + 2 * sc), js_round(cy - 8 * sc)]]}
        ]
        spec["motion"] = {"type": "walk_cycle", "frames": 4, "amplitude": 1.0, "squash": 0.04}

    elif arch in ("flower", "plant_flower"):
        spec["palette"]["y"] = "#fde047"
        spec["layers"] = [
            {"id": "shadow", "op": "ellipse", "cx": cx, "cy": r1(h - 3 * sc), "rx": r1(6.5 * sc), "ry": r1(1.5 * sc), "fill": "a"},
            {"id": "stem", "op": "uneven_capsule", "x1": cx, "y1": r1(h - 4 * sc), "x2": cx, "y2": r1(cy - 2 * sc), "r1": r1(1.6 * sc), "r2": r1(1.2 * sc), "fill": "H", "outline": "O", "sdf": True},
            {"id": "leaf_l", "op": "vesica", "cx": r1(cx - 4.5 * sc), "cy": r1(cy + 5 * sc), "rx": r1(2.2 * sc), "ry": r1(4.5 * sc), "angle": -50, "fill": "H", "outline": "O", "sdf": True},
            {"id": "leaf_r", "op": "vesica", "cx": r1(cx + 4.5 * sc), "cy": r1(cy + 3 * sc), "rx": r1(2.2 * sc), "ry": r1(4.5 * sc), "angle": 50, "fill": "H", "outline": "O", "sdf": True},
            {"id": "petals", "op": "star", "cx": cx, "cy": r1(cy - 3 * sc), "r": r1(9.0 * sc), "n": 8, "innerRatio": 0.65, "fill": "M", "outline": "O", "sdf": True},
            {"id": "core", "op": "ellipse", "cx": cx, "cy": r1(cy - 3 * sc), "rx": r1(3.6 * sc), "ry": r1(3.6 * sc), "fill": "y", "outline": "O", "sdf": True}
        ]
        spec["motion"] = {"type": "idle_breathe", "frames": 4, "amplitude": 0.8, "squash": 0.04}

    elif arch in ("mushroom", "mushroom_fungus"):
        spec["layers"] = [
            {"id": "shadow", "op": "ellipse", "cx": cx, "cy": r1(h - 3.5 * sc), "rx": r1(8.5 * sc), "ry": r1(1.8 * sc), "fill": "a"},
            {"id": "stem", "op": "uneven_capsule", "x1": cx, "y1": r1(h - 4 * sc), "x2": cx, "y2": r1(cy - 1 * sc), "r1": r1(3.5 * sc), "r2": r1(2.5 * sc), "fill": "S", "outline": "O", "sdf": True},
            {"id": "veil", "op": "ellipse", "cx": cx, "cy": r1(cy + 3 * sc), "rx": r1(3.8 * sc), "ry": r1(1.2 * sc), "fill": "w", "outline": "O", "sdf": True},
            {"id": "gills", "op": "ellipse", "cx": cx, "cy": r1(cy - 1 * sc), "rx": r1(9.5 * sc), "ry": r1(3.5 * sc), "fill": "A", "outline": "O", "sdf": True},
            {"id": "cap", "op": "moon", "cx": cx, "cy": r1(cy - 4 * sc), "r": r1(11.5 * sc), "r2": r1(10.5 * sc), "d": r1(4.8 * sc), "angle": 0, "fill": "M", "outline": "O", "sdf": True},
            {"id": "spot_1", "op": "ellipse", "cx": r1(cx - 3.5 * sc), "cy": r1(cy - 7 * sc), "rx": r1(1.5 * sc), "ry": r1(1.2 * sc), "fill": "w"},
            {"id": "spot_2", "op": "ellipse", "cx": r1(cx + 4.0 * sc), "cy": r1(cy - 6 * sc), "rx": r1(1.4 * sc), "ry": r1(1.1 * sc), "fill": "w"},
            {"id": "sprout", "op": "ellipse", "cx": r1(cx - 7 * sc), "cy": r1(h - 6 * sc), "rx": r1(2.6 * sc), "ry": r1(2.2 * sc), "fill": "M", "outline": "O", "sdf": True}
        ]
        spec["motion"] = {"type": "idle_breathe", "frames": 4, "amplitude": 0.7, "squash": 0.05}

    elif arch in ("boulder", "rock_boulder"):
        spec["layers"] = [
            {"id": "shadow", "op": "ellipse", "cx": cx, "cy": r1(h - 3.5 * sc), "rx": r1(11 * sc), "ry": r1(2.2 * sc), "fill": "a"},
            {"id": "rock_body", "op": "polygon", "points": [[r1(5 * sc), r1(h - 5 * sc)], [r1(4 * sc), r1(cy - 1 * sc)], [r1(cx - 3 * sc), r1(6 * sc)], [r1(cx + 6 * sc), r1(5 * sc)], [r1(w - 4 * sc), r1(cy + 2 * sc)], [r1(w - 6 * sc), r1(h - 5 * sc)]], "fill": "M", "outline": "O", "sdf": True, "dither": "worley", "shaderScale": 5.0, "seed": seed},
            {"id": "chisel_facet", "op": "polygon", "points": [[r1(cx - 3 * sc), r1(6 * sc)], [r1(cx + 3 * sc), r1(cy)], [r1(cx), r1(h - 5 * sc)], [r1(5 * sc), r1(h - 5 * sc)], [r1(4 * sc), r1(cy - 1 * sc)]], "fill": "S", "sdf": True},
            {"id": "moss_cap", "op": "ellipse", "cx": r1(cx + 1 * sc), "cy": r1(7 * sc), "rx": r1(8.5 * sc), "ry": r1(3.2 * sc), "fill": "H", "outline": "O", "sdf": True, "domainWarp": {"amp": r2(1.2 * sc), "freq": 0.3, "seed": seed}},
            {"id": "ore_gem", "op": "star", "cx": r1(cx + 6 * sc), "cy": r1(cy + 3 * sc), "r": r1(2.8 * sc), "n": 4, "innerRatio": 0.5, "fill": "A", "outline": "O", "sdf": True}
        ]

    elif arch in ("bow", "weapon_bow"):
        spec["layers"] = [
            {"id": "shadow", "op": "ellipse", "cx": cx, "cy": r1(h - 3 * sc), "rx": r1(6 * sc), "ry": r1(1.5 * sc), "fill": "a"},
            {"id": "stave", "op": "moon", "cx": r1(cx - 4 * sc), "cy": cy, "r": r1(13 * sc), "r2": r1(12 * sc), "d": r1(3.5 * sc), "angle": 0, "fill": "H", "outline": "O", "sdf": True},
            {"id": "handle", "op": "uneven_capsule", "x1": r1(cx - 7 * sc), "y1": r1(cy - 3 * sc), "x2": r1(cx - 7 * sc), "y2": r1(cy + 3 * sc), "r1": r1(1.8 * sc), "r2": r1(1.8 * sc), "fill": "A", "outline": "O", "sdf": True},
            {"id": "bowstring", "op": "line", "x1": r1(cx - 4 * sc), "y1": r1(4 * sc), "x2": r1(cx - 4 * sc), "y2": r1(h - 5 * sc), "thickness": 1, "color": "w"},
            {"id": "arrow_shaft", "op": "line", "x1": r1(cx - 10 * sc), "y1": cy, "x2": r1(w - 5 * sc), "y2": cy, "thickness": 1, "color": "H"},
            {"id": "arrow_head", "op": "polygon", "points": [[r1(w - 7 * sc), r1(cy - 2 * sc)], [r1(w - 4 * sc), cy], [r1(w - 7 * sc), r1(cy + 2 * sc)]], "fill": "S", "outline": "O"}
        ]

    elif arch in ("staff", "weapon_staff"):
        spec["layers"] = [
            {"id": "shadow", "op": "ellipse", "cx": cx, "cy": r1(h - 3 * sc), "rx": r1(5 * sc), "ry": r1(1.5 * sc), "fill": "a"},
            {"id": "shaft", "op": "uneven_capsule", "x1": cx, "y1": r1(h - 4 * sc), "x2": cx, "y2": r1(9 * sc), "r1": r1(1.8 * sc), "r2": r1(1.5 * sc), "fill": "H", "outline": "O", "sdf": True},
            {"id": "bracket_l", "op": "vesica", "cx": r1(cx - 3.2 * sc), "cy": r1(7.5 * sc), "rx": r1(1.5 * sc), "ry": r1(3.5 * sc), "angle": -25, "fill": "A", "outline": "O", "sdf": True},
            {"id": "bracket_r", "op": "vesica", "cx": r1(cx + 3.2 * sc), "cy": r1(7.5 * sc), "rx": r1(1.5 * sc), "ry": r1(3.5 * sc), "angle": 25, "fill": "A", "outline": "O", "sdf": True},
            {"id": "crystal_orb", "op": "ellipse", "cx": cx, "cy": r1(5.5 * sc), "rx": r1(3.2 * sc), "ry": r1(3.2 * sc), "fill": "M", "outline": "O", "sdf": True},
            {"id": "orb_spark", "op": "star", "cx": cx, "cy": r1(5.5 * sc), "r": r1(1.6 * sc), "n": 4, "innerRatio": 0.4, "fill": "w"}
        ]
        spec["motion"] = {"type": "idle_breathe", "frames": 4, "amplitude": 0.8, "squash": 0.04}

    elif arch in ("lightning", "spell_lightning"):
        spec["palette"]["b"] = "#a5f3fc"
        spec["layers"] = [
            {"id": "glow", "op": "ellipse", "cx": cx, "cy": r1(h - 4 * sc), "rx": r1(9 * sc), "ry": r1(2.5 * sc), "fill": "a"},
            {"id": "bolt", "op": "polygon", "points": [
                [cx, r1(3 * sc)], [r1(cx - 3 * sc), r1(10 * sc)], [r1(cx + 2 * sc), r1(13 * sc)],
                [r1(cx - 4 * sc), r1(20 * sc)], [r1(cx + 1 * sc), r1(23 * sc)], [cx, r1(h - 4 * sc)],
                [r1(cx + 3 * sc), r1(22 * sc)], [r1(cx - 1 * sc), r1(19 * sc)], [r1(cx + 4 * sc), r1(12 * sc)],
                [r1(cx - 1 * sc), r1(9 * sc)]
            ], "fill": "w", "sdf": True},
            {"id": "fork", "op": "polygon", "points": [[r1(cx - 3 * sc), r1(10 * sc)], [r1(cx - 8 * sc), r1(16 * sc)], [r1(cx - 6 * sc), r1(17 * sc)], [r1(cx - 1 * sc), r1(12 * sc)]], "fill": "b"},
            {"id": "impact", "op": "star", "cx": cx, "cy": r1(h - 4 * sc), "r": r1(4.2 * sc), "n": 6, "innerRatio": 0.4, "fill": "w"}
        ]
        spec["motion"] = {"type": "idle_breathe", "frames": 4, "amplitude": 0.6, "squash": 0.08}

    elif arch in ("fireball", "spell_fireball"):
        spec["layers"] = [
            {"id": "smoke", "op": "ellipse", "cx": r1(cx - 7 * sc), "cy": cy, "rx": r1(6.5 * sc), "ry": r1(5.5 * sc), "fill": "a"},
            {"id": "outer_flame", "op": "vesica", "cx": r1(cx - 1 * sc), "cy": cy, "rx": r1(11 * sc), "ry": r1(7.5 * sc), "angle": 0, "fill": "M", "outline": "O", "sdf": True},
            {"id": "mid_flame", "op": "vesica", "cx": r1(cx + 2 * sc), "cy": cy, "rx": r1(8 * sc), "ry": r1(5.5 * sc), "angle": 0, "fill": "A", "outline": "O", "sdf": True},
            {"id": "core", "op": "ellipse", "cx": r1(cx + 4 * sc), "cy": cy, "rx": r1(4.2 * sc), "ry": r1(3.5 * sc), "fill": "w", "sdf": True},
            {"id": "spark", "op": "pixels", "color": "w", "points": [[js_round(cx - 8 * sc), js_round(cy - 4 * sc)], [js_round(cx - 10 * sc), js_round(cy + 3 * sc)]]}
        ]
        spec["motion"] = {"type": "idle_breathe", "frames": 4, "amplitude": 0.8, "squash": 0.08}


    else:  # autotile_blob47 / procedural stone-moss terrain block
        pad_b = max(1.5, r1(2.5 * sc))
        spec["layers"] = [
            {"id": "block_base", "op": "rect", "x": pad_b, "y": pad_b, "w": r1(w - 2 * pad_b), "h": r1(h - 2 * pad_b), "rx": r1(2.5 * sc), "fill": "M", "outline": "O", "sdf": True, "dither": "worley", "shaderScale": 6.0, "seed": seed},
            {"id": "moss_cap", "op": "ellipse", "cx": cx, "cy": max(2.5, r1(6.5 * sc)), "rx": r1(9.5 * sc), "ry": r1(3.5 * sc), "fill": "A", "outline": "O", "sdf": True, "domainWarp": {"amp": r2(1.4 * sc), "freq": 0.25, "seed": seed}}
        ]
        spec["rules"] = [
            {"type": "bottom_drip", "target": "A", "replace": "A", "length": max(1, js_round(2 * sc)), "prob": 0.45, "seed": seed}
        ]

    return spec


def mutate_spec(spec_input, seed=101, rate=0.25):
    """Pillar 5: Evolutionary Genome Mutator (creates a valid mutated offspring from any PixelDSL spec)."""
    rng = SeededRNG(seed)
    child = copy.deepcopy(spec_input or {})
    w = clamp_size(child.get("width"), 32)
    h = clamp_size(child.get("height"), 32)
    r1 = lambda v: math.floor(float(v) * 10.0 + 0.5) / 10.0
    child["name"] = re.sub(r"_mut\d+$", "", str(child.get("name", "sprite"))) + f"_mut{seed}"

    def jitter_hex(hex_str):
        rgba = parse_color(hex_str)
        if rgba[3] == 0:
            return hex_str
        L, C, hue = rgb_to_oklch(rgba[0], rgba[1], rgba[2])
        if C < 0.02 and L > 0.9:
            return hex_str
        L_new = max(0.15, min(0.95, L + rng.range(-0.08, 0.08) * rate))
        C_new = max(0.0, min(0.28, C + rng.range(-0.05, 0.06) * rate))
        h_new = (hue + rng.range(-55.0, 55.0) * rate) % 360.0
        nr, ng, nb = oklch_to_rgb(L_new, C_new, h_new)
        return rgba_to_hex(nr, ng, nb, rgba[3])

    if isinstance(child.get("ramps"), dict):
        for k, cfg in child["ramps"].items():
            if isinstance(cfg, str):
                child["ramps"][k] = jitter_hex(cfg)
            elif isinstance(cfg, dict) and cfg.get("base"):
                cfg["base"] = jitter_hex(cfg["base"])

    if isinstance(child.get("palette"), dict):
        for k, col in list(child["palette"].items()):
            if k not in (".", " ", "O", "w", "e") and isinstance(col, str) and col.startswith("#"):
                child["palette"][k] = jitter_hex(col)

    shaders = ["none", "worley", "voronoi", "turing", "scales", "bayer4x4", "checker"]
    if isinstance(child.get("layers"), list):
        for lyr in child["layers"]:
            if not isinstance(lyr, dict):
                continue
            for prop in ("rx", "ry", "r", "r1", "r2", "w", "h"):
                if isinstance(lyr.get(prop), (int, float)) and lyr[prop] >= 2:
                    delta = lyr[prop] * rng.range(-0.22, 0.22) * rate
                    lyr[prop] = r1(max(1.0, min(max(w, h) * 0.44, float(lyr[prop]) + delta)))
            if isinstance(lyr.get("smoothBlend"), (int, float)) and lyr["smoothBlend"] > 0:
                lyr["smoothBlend"] = r1(max(0.5, lyr["smoothBlend"] + rng.range(-1.2, 1.2) * rate))
            if lyr.get("dither") and rng.next_float() < rate * 0.65:
                lyr["dither"] = rng.choice(shaders)
                lyr["seed"] = seed

    return child


# ============================================================================
# Pillar 6: Pure-Python RFC-2083 5-Filter PNG Decoder + Chroma-Key Strip
#           Importer & SLIC Edge-Snapping Superpixel Pixelizer
# ============================================================================

def _paeth_predictor(a, b, c):
    p = a + b - c
    pa = abs(p - a)
    pb = abs(p - b)
    pc = abs(p - c)
    if pa <= pb and pa <= pc:
        return a
    if pb <= pc:
        return b
    return c


def decode_png_bytes(png_bytes):
    """Pure-Python RFC-2083 5-Filter PNG Decoder (supports RGB, RGBA, Palette, Grayscale)."""
    if png_bytes[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("Not a valid PNG signature")
    pos = 8
    width = height = bit_depth = color_type = 0
    plte = []
    trns = b""
    idat_parts = []

    while pos + 8 <= len(png_bytes):
        length = struct.unpack(">I", png_bytes[pos:pos + 4])[0]
        chunk_type = png_bytes[pos + 4:pos + 8]
        chunk_data = png_bytes[pos + 8:pos + 8 + length]
        pos += 12 + length
        if chunk_type == b"IHDR":
            width, height, bit_depth, color_type, _, _, _ = struct.unpack(">IIBBBBB", chunk_data[:13])
        elif chunk_type == b"PLTE":
            plte = [(chunk_data[i], chunk_data[i + 1], chunk_data[i + 2]) for i in range(0, len(chunk_data), 3)]
        elif chunk_type == b"tRNS":
            trns = chunk_data
        elif chunk_type == b"IDAT":
            idat_parts.append(chunk_data)
        elif chunk_type == b"IEND":
            break

    raw = zlib.decompress(b"".join(idat_parts))
    channels = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}.get(color_type, 4)
    bpp = max(1, (channels * bit_depth) // 8)
    stride = width * bpp

    recon = bytearray(width * height * bpp)
    src_pos = 0
    for y in range(height):
        f_type = raw[src_pos]
        src_pos += 1
        row_out = y * stride
        prev_out = (y - 1) * stride
        for x in range(stride):
            val = raw[src_pos + x]
            a = recon[row_out + x - bpp] if x >= bpp else 0
            b = recon[prev_out + x] if y > 0 else 0
            c = recon[prev_out + x - bpp] if (y > 0 and x >= bpp) else 0
            if f_type == 1:
                val = (val + a) & 0xFF
            elif f_type == 2:
                val = (val + b) & 0xFF
            elif f_type == 3:
                val = (val + ((a + b) >> 1)) & 0xFF
            elif f_type == 4:
                val = (val + _paeth_predictor(a, b, c)) & 0xFF
            recon[row_out + x] = val
        src_pos += stride

    rgba = bytearray(width * height * 4)
    for i in range(width * height):
        if color_type == 6:
            rgba[i * 4:i * 4 + 4] = recon[i * 4:i * 4 + 4]
        elif color_type == 2:
            rgba[i * 4:i * 4 + 3] = recon[i * 3:i * 3 + 3]
            rgba[i * 4 + 3] = 255
        elif color_type == 3:
            idx = recon[i]
            r, g, b = plte[idx] if idx < len(plte) else (0, 0, 0)
            a = trns[idx] if idx < len(trns) else 255
            rgba[i * 4:i * 4 + 4] = bytes((r, g, b, a))
        elif color_type == 0:
            v = recon[i]
            rgba[i * 4:i * 4 + 4] = bytes((v, v, v, 255))
        elif color_type == 4:
            v = recon[i * 2]
            a = recon[i * 2 + 1]
            rgba[i * 4:i * 4 + 4] = bytes((v, v, v, a))
    return width, height, rgba


def read_image_rgba(filepath):
    """
    Reads an image into (width, height, rgba_bytearray).
    Uses pure-Python RFC-2083 decoder for PNGs, and automatically converts JPEG-disguised
    files (such as heroes/*/*.png with JFIF headers) in-memory when needed.
    """
    path = Path(filepath).resolve()
    raw_bytes = path.read_bytes()
    if raw_bytes[:8] == b"\x89PNG\r\n\x1a\n":
        return decode_png_bytes(raw_bytes)
    # Fallback for JPEG/BMP files saved with .png extension on Windows
    ps_script = (
        f'Add-Type -AssemblyName System.Drawing; '
        f'$b=[System.Drawing.Bitmap]::FromFile("{str(path)}"); '
        f'$ms=New-Object System.IO.MemoryStream; '
        f'$b.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png); '
        f'$b.Dispose(); '
        f'[Console]::OpenStandardOutput().Write($ms.ToArray(), 0, $ms.Length)'
    )
    enc = base64.b64encode(ps_script.encode("utf-16le")).decode("ascii")
    png_data = subprocess.check_output(["powershell", "-NoProfile", "-EncodedCommand", enc], stderr=subprocess.DEVNULL)
    return decode_png_bytes(png_data)


def chroma_key_and_despill(width, height, rgba):
    """Removes #FF00FF chroma-key and flood-fills exterior background from borders + Oklab magenta despill."""
    out = bytearray(rgba)
    corners = [(0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)]
    c_samples = [out[(cy * width + cx) * 4:(cy * width + cx) * 4 + 4] for cx, cy in corners]
    bg_r, bg_g, bg_b, bg_a = c_samples[0]
    has_bg_key = bg_a > 200 and (
        sum(1 for s in c_samples if abs(s[0] - bg_r) + abs(s[1] - bg_g) + abs(s[2] - bg_b) < 48) >= 3
    )

    # Flood-fill exterior background from perimeter so interior highlights of the same color are preserved
    bg_mask = bytearray(width * height)
    if has_bg_key:
        from collections import deque
        q = deque()
        for x in range(width):
            for y in (0, height - 1):
                q.append((x, y))
        for y in range(1, height - 1):
            for x in (0, width - 1):
                q.append((x, y))
        while q:
            cx, cy = q.popleft()
            p_idx = cy * width + cx
            if bg_mask[p_idx]:
                continue
            idx4 = p_idx * 4
            r, g, b, a = out[idx4], out[idx4 + 1], out[idx4 + 2], out[idx4 + 3]
            is_mag_halo = (r > 115 and b > 115 and g < min(r, b) - 28 and (r + b - 2 * g) > 75)
            if a < 25 or (abs(r - bg_r) + abs(g - bg_g) + abs(b - bg_b) < 68) or is_mag_halo:
                bg_mask[p_idx] = 1
                if cx > 0 and not bg_mask[p_idx - 1]:
                    q.append((cx - 1, cy))
                if cx < width - 1 and not bg_mask[p_idx + 1]:
                    q.append((cx + 1, cy))
                if cy > 0 and not bg_mask[p_idx - width]:
                    q.append((cx, cy - 1))
                if cy < height - 1 and not bg_mask[p_idx + width]:
                    q.append((cx, cy + 1))

    for i in range(width * height):
        idx = i * 4
        r, g, b, a = out[idx], out[idx + 1], out[idx + 2], out[idx + 3]
        if a < 25 or bg_mask[i]:
            bg_mask[i] = 1
            out[idx:idx + 4] = b"\x00\x00\x00\x00"
            continue
        # Explicit #FF00FF magenta chroma-key anywhere (handles interior holes / JPEG ringing)
        if r > 120 and b > 120 and g < min(r, b) - 32 and (r + b - 2 * g) > 80:
            bg_mask[i] = 1
            out[idx:idx + 4] = b"\x00\x00\x00\x00"

    # Erode 1px anti-aliased purple/magenta boundary fringe adjacent to bg_mask
    erode_mask = bytearray(bg_mask)
    for y in range(height):
        for x in range(width):
            i = y * width + x
            if bg_mask[i]:
                continue
            near_bg = (
                (x > 0 and bg_mask[i - 1]) or
                (x < width - 1 and bg_mask[i + 1]) or
                (y > 0 and bg_mask[i - width]) or
                (y < height - 1 and bg_mask[i + width])
            )
            if near_bg:
                idx = i * 4
                r, g, b = out[idx], out[idx + 1], out[idx + 2]
                if r > g + 6 and b > g + 10 and (r + b - 2 * g) > 28:
                    erode_mask[i] = 1
                    out[idx:idx + 4] = b"\x00\x00\x00\x00"
    bg_mask = erode_mask

    # Oklab / RGB chrominance despill on remaining boundary / magenta-tinted pixels
    for y in range(height):
        for x in range(width):
            i = y * width + x
            if bg_mask[i]:
                continue
            idx = i * 4
            r, g, b, a = out[idx], out[idx + 1], out[idx + 2], out[idx + 3]
            if r > g + 4 and b > g + 6:
                # Neutralize purple/magenta bleed by clamping red excess to green and tempering blue
                excess_r = r - g
                excess_b = max(0, b - max(r, g))
                new_r = g
                new_b = max(g, b - int(excess_r * 0.85 + excess_b * 0.5))
                out[idx] = max(0, min(255, new_r))
                out[idx + 2] = max(0, min(255, new_b))
    return out


def slice_strip_segments(width, height, rgba):
    """Connected-Component / vertical projection auto-slicer for horizontal sprite strips."""
    col_counts = [0] * width
    for x in range(width):
        cnt = 0
        for y in range(height):
            if rgba[(y * width + x) * 4 + 3] > 64:
                cnt += 1
        col_counts[x] = cnt

    segments = []
    in_seg = False
    x_start = 0
    min_width = max(4, width // 40)
    for x in range(width):
        if col_counts[x] > 2 and not in_seg:
            in_seg = True
            x_start = x
        elif col_counts[x] <= 2 and in_seg:
            in_seg = False
            if x - x_start >= min_width:
                segments.append((x_start, x - 1))
    if in_seg and (width - x_start) >= min_width:
        segments.append((x_start, width - 1))

    if not segments:
        return [(0, 0, width - 1, height - 1)]

    bboxes = []
    for x0, x1 in segments:
        y0, y1 = height - 1, 0
        for y in range(height):
            row_cnt = 0
            for x in range(x0, x1 + 1):
                if rgba[(y * width + x) * 4 + 3] > 128:
                    row_cnt += 1
            if row_cnt >= 2:
                y0 = min(y0, y)
                y1 = max(y1, y)
        if y1 >= y0:
            bboxes.append((x0, y0, x1, y1))
    return bboxes if bboxes else [(0, 0, width - 1, height - 1)]


def downsample_superpixel(src_w, src_h, rgba, bbox, target_w, target_h):
    """
    SLIC 5D (L, a, b, x, y) superpixel medoid downsampler: preserves sharp silhouette boundaries
    and selects the perceptual Oklab medoid of each superpixel cell without box-averaging blur.
    """
    x0, y0, x1, y1 = bbox
    bw = max(1, x1 - x0 + 1)
    bh = max(1, y1 - y0 + 1)
    margin = 2
    avail_w = max(4, target_w - 2 * margin)
    avail_h = max(4, target_h - 2 * margin)
    scale = min(avail_w / float(bw), avail_h / float(bh))
    draw_w = max(1, int(round(bw * scale)))
    draw_h = max(1, int(round(bh * scale)))
    off_x = (target_w - draw_w) // 2
    off_y = (target_h - draw_h) // 2
    cell_radius = max(1.0, 1.0 / scale)

    out = bytearray(target_w * target_h * 4)
    for ty in range(draw_h):
        sy_center = y0 + (ty + 0.5) / scale
        sy0 = max(y0, int(math.floor(y0 + ty / scale)))
        sy1 = min(y1, int(math.ceil(y0 + (ty + 1.0) / scale)))
        for tx in range(draw_w):
            sx_center = x0 + (tx + 0.5) / scale
            sx0 = max(x0, int(math.floor(x0 + tx / scale)))
            sx1 = min(x1, int(math.ceil(x0 + (tx + 1.0) / scale)))

            opaque_samples = []
            step_y = max(1, (sy1 - sy0 + 1) // 3)
            step_x = max(1, (sx1 - sx0 + 1) // 3)
            total_s = 0
            sum_L = sum_a = sum_b = 0.0
            for sy in range(sy0, sy1 + 1, step_y):
                for sx in range(sx0, sx1 + 1, step_x):
                    total_s += 1
                    idx = (sy * src_w + sx) * 4
                    if rgba[idx + 3] > 180:
                        r, g, b = rgba[idx], rgba[idx + 1], rgba[idx + 2]
                        L, a_lab, b_lab = rgb_to_oklab(r, g, b)
                        d_spatial = math.hypot(sx - sx_center, sy - sy_center) / cell_radius
                        sum_L += L
                        sum_a += a_lab
                        sum_b += b_lab
                        opaque_samples.append((d_spatial, L, a_lab, b_lab, r, g, b))

            if len(opaque_samples) * 2 < total_s:
                continue

            n_op = float(len(opaque_samples))
            mean_L, mean_a, mean_b = sum_L / n_op, sum_a / n_op, sum_b / n_op
            # Select 5D SLIC medoid (closest sample to cluster Oklab centroid + spatial center)
            best_sample = min(
                opaque_samples,
                key=lambda s: ((s[1] - mean_L) ** 2 + (s[2] - mean_a) ** 2 + (s[3] - mean_b) ** 2) + 0.015 * (s[0] ** 2)
            )
            _, _, _, _, r_best, g_best, b_best = best_sample
            dst_idx = ((off_y + ty) * target_w + (off_x + tx)) * 4
            out[dst_idx:dst_idx + 4] = bytes((r_best, g_best, b_best, 255))

    # Prune isolated 1px JPEG dust specks
    snap = bytearray(out)
    for y in range(target_h):
        for x in range(target_w):
            idx = (y * target_w + x) * 4
            if snap[idx + 3] == 0:
                continue
            n_cnt = 0
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    if dx == 0 and dy == 0:
                        continue
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < target_w and 0 <= ny < target_h:
                        if snap[(ny * target_w + nx) * 4 + 3] > 0:
                            n_cnt += 1
            if n_cnt == 0:
                out[idx:idx + 4] = b"\x00\x00\x00\x00"

    return out


def import_image_to_spec(filepath, target_size=48, max_colors=16):
    """Pillar 6: End-to-end raw sprite / strip importer into a clean multi-frame PixelDSL spec."""
    src_w, src_h, raw_rgba = read_image_rgba(filepath)
    clean_rgba = chroma_key_and_despill(src_w, src_h, raw_rgba)
    bboxes = slice_strip_segments(src_w, src_h, clean_rgba)
    # Limit to at most 8 frames
    bboxes = bboxes[:8]

    tw = clamp_size(target_size, 48)
    th = clamp_size(target_size, 48)
    frame_buffers = [downsample_superpixel(src_w, src_h, clean_rgba, bb, tw, th) for bb in bboxes]

    # Oklab palette quantization across all frames
    unique_cols = {}
    for fbuf in frame_buffers:
        for i in range(tw * th):
            if fbuf[i * 4 + 3] > 128:
                key = (fbuf[i * 4] >> 3, fbuf[i * 4 + 1] >> 3, fbuf[i * 4 + 2] >> 3)
                if key not in unique_cols:
                    unique_cols[key] = [0, fbuf[i * 4], fbuf[i * 4 + 1], fbuf[i * 4 + 2]]
                unique_cols[key][0] += 1

    sorted_cols = sorted(unique_cols.values(), key=lambda item: -item[0])
    chosen_lab = []
    chosen_rgb = []
    for cnt, r, g, b in sorted_cols:
        lab = rgb_to_oklab(r, g, b)
        if all(math.sqrt((lab[0] - c[0]) ** 2 + (lab[1] - c[1]) ** 2 + (lab[2] - c[2]) ** 2) > 0.055 for c in chosen_lab):
            chosen_lab.append(lab)
            chosen_rgb.append((r, g, b))
            if len(chosen_rgb) >= max_colors:
                break
    if not chosen_rgb:
        chosen_lab.append(rgb_to_oklab(255, 255, 255))
        chosen_rgb.append((255, 255, 255))

    syms = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
    palette = {".": "transparent"}
    for idx, (r, g, b) in enumerate(chosen_rgb):
        palette[syms[idx]] = rgba_to_hex(r, g, b, 255)

    frames_grids = []
    for fbuf in frame_buffers:
        rows = []
        for y in range(th):
            row_chars = []
            for x in range(tw):
                idx = (y * tw + x) * 4
                if fbuf[idx + 3] <= 128:
                    row_chars.append(".")
                else:
                    lab = rgb_to_oklab(fbuf[idx], fbuf[idx + 1], fbuf[idx + 2])
                    best_i = min(
                        range(len(chosen_lab)),
                        key=lambda ci: (lab[0] - chosen_lab[ci][0]) ** 2 + (lab[1] - chosen_lab[ci][1]) ** 2 + (lab[2] - chosen_lab[ci][2]) ** 2
                    )
                    row_chars.append(syms[best_i])
            rows.append("".join(row_chars))
        frames_grids.append(rows)

    stem = re.sub(r"[^a-zA-Z0-9_-]", "_", Path(filepath).stem)
    spec = {
        "name": f"imported_{stem}_{tw}x{th}",
        "prompt": f"Imported & Oklab-quantized from {Path(filepath).name} ({len(frames_grids)} frame(s))",
        "width": tw,
        "height": th,
        "symmetry": "none",
        "rle": False,
        "palette": palette,
        "postProcess": {
            "autoOutline": False,
            "outlineColor": "#14182e",
            "autoShading": False,
            "shadingStrength": 0.16,
            "sdfShading": False
        },
        "layers": [],
        "frames": [{"grid": g} for g in frames_grids[1:]],
        "grid": frames_grids[0]
    }
    return spec


# ============================================================================
# Diagnostics, PNG Export, Terminal Preview & Studio Sync
# ============================================================================

def analyze_buffer(width, height, buffer):
    active_count = 0
    sum_x, sum_y = 0, 0
    min_x, max_x = width, -1
    min_y, max_y = height, -1
    clip_top = clip_bottom = clip_left = clip_right = 0

    for y in range(height):
        for x in range(width):
            a = buffer[(y * width + x) * 4 + 3]
            if a > 32:
                active_count += 1
                sum_x += x
                sum_y += y
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)
                if a > 160:
                    if y == 0:
                        clip_top += 1
                    if y == height - 1:
                        clip_bottom += 1
                    if x == 0:
                        clip_left += 1
                    if x == width - 1:
                        clip_right += 1

    total = width * height
    fill_pct = round((active_count / float(total)) * 100.0, 1)
    cx_off = round((sum_x / active_count) - (width - 1) / 2.0, 1) if active_count > 0 else 0.0
    cy_off = round((sum_y / active_count) - (height - 1) / 2.0, 1) if active_count > 0 else 0.0

    clipped_edges = []
    if clip_top > 2:
        clipped_edges.append("TOP")
    if clip_bottom > 2:
        clipped_edges.append("BOTTOM")
    if clip_left > 2:
        clipped_edges.append("LEFT")
    if clip_right > 2:
        clipped_edges.append("RIGHT")

    return {
        "active_pixels": active_count,
        "fill_pct": fill_pct,
        "bbox": [min_x, min_y, max_x, max_y] if active_count > 0 else [0, 0, 0, 0],
        "center_offset": [cx_off, cy_off],
        "clipped_edges": clipped_edges
    }


def write_png(filepath, width, height, rgba_bytes):
    """Writes a standard 32-bit RGBA PNG using only Python stdlib (zlib and struct)."""
    raw_scanlines = bytearray()
    stride = width * 4
    for y in range(height):
        raw_scanlines.append(0)
        row_start = y * stride
        raw_scanlines.extend(rgba_bytes[row_start:row_start + stride])

    def make_chunk(chunk_type, data):
        chunk = struct.pack(">I", len(data)) + chunk_type + data
        crc = zlib.crc32(chunk_type + data) & 0xFFFFFFFF
        return chunk + struct.pack(">I", crc)

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    compressed = zlib.compress(bytes(raw_scanlines), level=9)

    png_bytes = (
        b"\x89PNG\r\n\x1a\n" +
        make_chunk(b"IHDR", ihdr) +
        make_chunk(b"IDAT", compressed) +
        make_chunk(b"IEND", b"")
    )
    Path(filepath).parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, "wb") as f:
        f.write(png_bytes)


def upscale_buffer(width, height, rgba_bytes, scale):
    if scale <= 1:
        return width, height, rgba_bytes
    out_w = width * scale
    out_h = height * scale
    out = bytearray(out_w * out_h * 4)
    for y in range(out_h):
        sy = y // scale
        for x in range(out_w):
            sx = x // scale
            src_i = (sy * width + sx) * 4
            dst_i = (y * out_w + x) * 4
            out[dst_i:dst_i + 4] = rgba_bytes[src_i:src_i + 4]
    return out_w, out_h, out


def stitch_horizontal(frames_buffers, width, height):
    count = len(frames_buffers)
    sheet_w = width * count
    out = bytearray(sheet_w * height * 4)
    for f_idx, buf in enumerate(frames_buffers):
        for y in range(height):
            src_start = y * width * 4
            dst_start = (y * sheet_w + f_idx * width) * 4
            out[dst_start:dst_start + width * 4] = buf[src_start:src_start + width * 4]
    return sheet_w, height, out


def render_ansi_preview(width, height, buffer, max_term_width=48):
    """Renders a TrueColor ANSI terminal preview using Unicode half-blocks (▀)."""
    step = max(1, math.ceil(width / float(max_term_width)))
    lines = []
    for y in range(0, height, 2 * step):
        row_chars = []
        for x in range(0, width, step):
            i_top = (y * width + x) * 4
            r1, g1, b1, a1 = buffer[i_top:i_top + 4]
            y_bot = y + step
            if y_bot < height:
                i_bot = (y_bot * width + x) * 4
                r2, g2, b2, a2 = buffer[i_bot:i_bot + 4]
            else:
                r2, g2, b2, a2 = (0, 0, 0, 0)

            top_vis = a1 > 64
            bot_vis = a2 > 64
            if not top_vis and not bot_vis:
                row_chars.append("\x1b[0m·")
            elif top_vis and bot_vis:
                row_chars.append(f"\x1b[38;2;{r1};{g1};{b1}m\x1b[48;2;{r2};{g2};{b2}m▀\x1b[0m")
            elif top_vis and not bot_vis:
                row_chars.append(f"\x1b[38;2;{r1};{g1};{b1}m▀\x1b[0m")
            else:
                row_chars.append(f"\x1b[38;2;{r2};{g2};{b2}m▄\x1b[0m")
        lines.append("".join(row_chars))
    return "\n".join(lines)


def sync_sprite_to_presets_js(presets_js_path, sprite_key, label, prompt_text, spec_data):
    """Automatically adds or updates the sprite in presets.js so it appears in index.html."""
    p_path = Path(presets_js_path)
    if not p_path.exists():
        return False

    content = p_path.read_text(encoding="utf-8")
    marker = "window.SKILL_PROMPT_TEMPLATE"
    idx = content.find(marker)
    if idx == -1:
        return False

    assign_code = (
        f"\n// Auto-synced by pixeldsl.py CLI\n"
        f"window.PIXEL_PRESETS[{json.dumps(sprite_key)}] = {{\n"
        f"  label: {json.dumps(label, ensure_ascii=False)},\n"
        f"  prompt: {json.dumps(prompt_text, ensure_ascii=False)},\n"
        f"  data: {json.dumps(spec_data, ensure_ascii=False, indent=2)}\n"
        f"}};\n\n"
    )

    pattern = re.compile(
        r"\n// Auto-synced by pixeldsl\.py CLI\nwindow\.PIXEL_PRESETS\[" +
        re.escape(json.dumps(sprite_key)) +
        r"\] = \{.*?\};\n\n",
        re.DOTALL
    )
    if pattern.search(content):
        new_content = pattern.sub(lambda _: assign_code, content)
    elif f'name: "{sprite_key}"' in content or f'"name": "{sprite_key}"' in content:
        return True
    else:
        new_content = content[:idx] + assign_code + content[idx:]

    p_path.write_text(new_content, encoding="utf-8")
    return True


def process_spec(spec, base_dir, show_ansi=False, sync_web=True, export_normals=True):
    name = re.sub(r"[^a-zA-Z0-9_-]", "_", str(spec.get("name") or "sprite"))
    spec["name"] = name

    total_frames = get_frame_count(spec)

    frame_results = []
    for f_idx in range(total_frames):
        frame_results.append(render_sprite(spec, f_idx))

    first = frame_results[0]
    w, h = first["width"], first["height"]
    diag = first["diagnostics"]

    sprites_dir = base_dir / "sprites"
    game_ready_dir = base_dir / "game_ready"
    sprites_dir.mkdir(parents=True, exist_ok=True)
    game_ready_dir.mkdir(parents=True, exist_ok=True)

    json_path = sprites_dir / f"{name}.json"
    json_path.write_text(json.dumps(spec, ensure_ascii=False, indent=2), encoding="utf-8")

    png_1x_path = game_ready_dir / f"{name}.png"
    write_png(png_1x_path, w, h, first["buffer"])

    normal_path = game_ready_dir / f"{name}_normal.png"
    if export_normals:
        write_png(normal_path, w, h, first["normal_buffer"])

    preview_scale = 16 if w <= 16 else (8 if w <= 32 else (4 if w <= 64 else 2))
    pw, ph, pbuf = upscale_buffer(w, h, first["buffer"], preview_scale)
    png_preview_path = game_ready_dir / f"{name}_preview.png"
    write_png(png_preview_path, pw, ph, pbuf)

    sheet_path = None
    if total_frames > 1:
        sw, sh, sbuf = stitch_horizontal([r["buffer"] for r in frame_results], w, h)
        sheet_path = game_ready_dir / f"{name}_sheet.png"
        write_png(sheet_path, sw, sh, sbuf)

    synced = False
    if sync_web:
        if spec.get("label"):
            label = spec["label"]
        elif spec.get("type") == "rig":
            label = f"🦴 {name} ({w}×{h})" + (f" [{total_frames}f]" if total_frames > 1 else "")
        elif spec.get("type") == "shader":
            label = f"🌀 {name} ({w}×{h})" + (f" [{total_frames}f]" if total_frames > 1 else "")
        else:
            label = f"✨ {name} ({w}×{h})" + (f" [{total_frames}f]" if total_frames > 1 else "")
        synced = sync_sprite_to_presets_js(
            base_dir / "presets.js",
            name,
            label,
            spec.get("prompt", f"Generated via CLI: {name}"),
            spec
        )

    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

    print("=" * 64)
    print(f"[PixelDSL CLI v3.0] Sprite: {name} | Size: {w}x{h} px | Frames: {total_frames}")
    print(f"  • Canvas Fill       : {diag['fill_pct']}% ({diag['active_pixels']} px)")
    print(f"  • Bounding Box      : x={diag['bbox'][0]}..{diag['bbox'][2]}, y={diag['bbox'][1]}..{diag['bbox'][3]}")
    print(f"  • Center Offset     : dx={diag['center_offset'][0]}, dy={diag['center_offset'][1]}")
    if diag["clipped_edges"]:
        print(f"  • [!] WARNING       : Silhouette touches canvas edges: {', '.join(diag['clipped_edges'])}")
    else:
        print("  • Silhouette Edges  : OK (clean margins, no clipping)")

    if first["warnings"]:
        print(f"  • Auto-Normalized   : {'; '.join(first['warnings'][:3])}")

    print(f"  • Source JSON       : {json_path}")
    print(f"  • PNG (1:1 Native)  : {png_1x_path}")
    if export_normals:
        print(f"  • PNG (Normal Map)  : {normal_path}")
    if sheet_path:
        print(f"  • PNG (Sprite Sheet): {sheet_path} ({w * total_frames}x{h} px)")
    print(f"  • PNG (Preview x{preview_scale})  : {png_preview_path}")
    print(f"  • Web Studio Sync   : {'OK (registered in presets.js)' if synced else 'Skipped'}")
    print("=" * 64)

    if show_ansi:
        print(render_ansi_preview(w, h, first["buffer"]))
        print("=" * 64)


# ============================================================================
# 3D Primitive Ray-Caster & Perspective Rasterizer Engine
# ============================================================================

class Primitive3D:
    def intersect(self, ro, rd):
        raise NotImplementedError


class Sphere3D(Primitive3D):
    def __init__(self, cx, cy, cz, radius, color):
        self.cx, self.cy, self.cz = cx, cy, cz
        self.radius = radius
        self.color = color

    def intersect(self, ro, rd):
        ocx = ro[0] - self.cx
        ocy = ro[1] - self.cy
        ocz = ro[2] - self.cz
        b = ocx * rd[0] + ocy * rd[1] + ocz * rd[2]
        c = (ocx * ocx + ocy * ocy + ocz * ocz) - self.radius * self.radius
        disc = b * b - c
        if disc < 0:
            return None
        sq = math.sqrt(disc)
        t = -b - sq
        if t <= 0.001:
            t = -b + sq
        if t <= 0.001:
            return None
        hx = ro[0] + t * rd[0]
        hy = ro[1] + t * rd[1]
        hz = ro[2] + t * rd[2]
        nx = (hx - self.cx) / self.radius
        ny = (hy - self.cy) / self.radius
        nz = (hz - self.cz) / self.radius
        return (t, hx, hy, hz, nx, ny, nz, self.color)


class Box3D(Primitive3D):
    def __init__(self, cx, cy, cz, hx, hy, hz, color):
        self.cx, self.cy, self.cz = cx, cy, cz
        self.hx, self.hy, self.hz = hx * 0.5, hy * 0.5, hz * 0.5
        self.color = color

    def intersect(self, ro, rd):
        ox = ro[0] - self.cx
        oy = ro[1] - self.cy
        oz = ro[2] - self.cz

        # X slab
        if abs(rd[0]) < 1e-6:
            if abs(ox) > self.hx:
                return None
            tmin_x = -1e9
            tmax_x = 1e9
        else:
            t1 = (-self.hx - ox) / rd[0]
            t2 = (self.hx - ox) / rd[0]
            tmin_x = min(t1, t2)
            tmax_x = max(t1, t2)

        # Y slab
        if abs(rd[1]) < 1e-6:
            if abs(oy) > self.hy:
                return None
            tmin_y = -1e9
            tmax_y = 1e9
        else:
            t1 = (-self.hy - oy) / rd[1]
            t2 = (self.hy - oy) / rd[1]
            tmin_y = min(t1, t2)
            tmax_y = max(t1, t2)

        # Z slab
        if abs(rd[2]) < 1e-6:
            if abs(oz) > self.hz:
                return None
            tmin_z = -1e9
            tmax_z = 1e9
        else:
            t1 = (-self.hz - oz) / rd[2]
            t2 = (self.hz - oz) / rd[2]
            tmin_z = min(t1, t2)
            tmax_z = max(t1, t2)

        t_enter = max(tmin_x, tmin_y, tmin_z)
        t_exit = min(tmax_x, tmax_y, tmax_z)

        if t_enter > t_exit or t_exit <= 0.001:
            return None

        t = t_enter if t_enter > 0.001 else t_exit
        hx = ro[0] + t * rd[0]
        hy = ro[1] + t * rd[1]
        hz = ro[2] + t * rd[2]

        px = hx - self.cx
        py = hy - self.cy
        pz = hz - self.cz
        if abs(px) >= self.hx * 0.96:
            nx = 1.0 if px > 0 else -1.0
            ny = 0.0
            nz = 0.0
        elif abs(py) >= self.hy * 0.96:
            nx = 0.0
            ny = 1.0 if py > 0 else -1.0
            nz = 0.0
        else:
            nx = 0.0
            ny = 0.0
            nz = 1.0 if pz > 0 else -1.0

        return (t, hx, hy, hz, nx, ny, nz, self.color)


class Cylinder3D(Primitive3D):
    def __init__(self, cx, cy, cz, radius, height, color):
        self.cx, self.cy, self.cz = cx, cy, cz
        self.radius = radius
        self.hh = height * 0.5
        self.color = color

    def intersect(self, ro, rd):
        ox = ro[0] - self.cx
        oy = ro[1] - self.cy
        oz = ro[2] - self.cz

        a = rd[0] * rd[0] + rd[2] * rd[2]
        if a < 1e-6:
            return None
        b = ox * rd[0] + oz * rd[2]
        c = (ox * ox + oz * oz) - self.radius * self.radius
        disc = b * b - a * c
        if disc < 0:
            return None
        sq = math.sqrt(disc)
        t = (-b - sq) / a
        if t > 0.001:
            hy = oy + t * rd[1]
            if -self.hh <= hy <= self.hh:
                hx = ro[0] + t * rd[0]
                hz = ro[2] + t * rd[2]
                nx = (hx - self.cx) / self.radius
                nz = (hz - self.cz) / self.radius
                return (t, hx, ro[1] + t * rd[1], hz, nx, 0.0, nz, self.color)
        return None


def get_3d_primitives(model="humanoid"):
    model = str(model).lower().strip()
    prims = []

    if model in ("humanoid", "chibi"):
        is_chibi = (model == "chibi")
        hs = 1.4 if is_chibi else 1.0
        bs = 0.8 if is_chibi else 1.0
        # Pelvis & Torso
        prims.append(Box3D(0, 1.25 * bs, 0, 0.7 * bs, 0.45 * bs, 0.5 * bs, (29, 78, 216)))
        prims.append(Cylinder3D(0, 1.7 * bs, 0, 0.28 * bs, 0.65 * bs, (37, 99, 235)))
        # Chest Armor
        prims.append(Box3D(0, 1.7 * bs, 0.16 * bs, 0.55 * bs, 0.5 * bs, 0.22 * bs, (226, 232, 240)))
        # Head & Hair
        prims.append(Sphere3D(0, 2.3 * hs, 0, 0.46 * hs, (255, 204, 170)))
        prims.append(Sphere3D(0, 2.38 * hs, -0.06 * hs, 0.48 * hs, (69, 26, 3)))
        # Helmet Crest
        if not is_chibi:
            prims.append(Box3D(0, 2.85 * hs, 0, 0.08, 0.35, 0.6, (250, 204, 21)))
        # Arms
        prims.append(Sphere3D(-0.55 * bs, 1.9 * bs, 0, 0.22 * bs, (226, 232, 240)))
        prims.append(Cylinder3D(-0.55 * bs, 1.45 * bs, 0, 0.14 * bs, 0.65 * bs, (37, 99, 235)))
        prims.append(Sphere3D(0.55 * bs, 1.9 * bs, 0, 0.22 * bs, (226, 232, 240)))
        prims.append(Cylinder3D(0.55 * bs, 1.45 * bs, 0, 0.14 * bs, 0.65 * bs, (37, 99, 235)))
        # Sword
        prims.append(Box3D(0.55 * bs, 1.6 * bs, 0.5 * bs, 0.12, 1.1, 0.04, (226, 232, 240)))
        prims.append(Box3D(0.55 * bs, 1.1 * bs, 0.5 * bs, 0.38, 0.08, 0.1, (250, 204, 21)))
        # Shield
        prims.append(Box3D(-0.75 * bs, 1.5 * bs, 0.2 * bs, 0.12, 0.85, 0.6, (226, 232, 240)))
        # Legs
        prims.append(Cylinder3D(-0.22 * bs, 0.7 * bs, 0, 0.16 * bs, 0.75 * bs, (29, 78, 216)))
        prims.append(Box3D(-0.22 * bs, 0.2 * bs, 0.08 * bs, 0.2 * bs, 0.2 * bs, 0.4 * bs, (120, 53, 15)))
        prims.append(Cylinder3D(0.22 * bs, 0.7 * bs, 0, 0.16 * bs, 0.75 * bs, (29, 78, 216)))
        prims.append(Box3D(0.22 * bs, 0.2 * bs, 0.08 * bs, 0.2 * bs, 0.2 * bs, 0.4 * bs, (120, 53, 15)))

    elif model == "dragon":
        # Dragon Torso & Wings
        prims.append(Sphere3D(0, 1.2, 0, 0.75, (220, 38, 38)))
        prims.append(Cylinder3D(0, 1.8, 0.4, 0.32, 0.9, (220, 38, 38)))
        prims.append(Box3D(0, 2.3, 0.6, 0.55, 0.42, 0.75, (220, 38, 38)))
        # Horns
        prims.append(Box3D(-0.22, 2.65, 0.4, 0.12, 0.45, 0.12, (241, 245, 249)))
        prims.append(Box3D(0.22, 2.65, 0.4, 0.12, 0.45, 0.12, (241, 245, 249)))
        # Wings
        prims.append(Box3D(-1.1, 1.4, 0, 1.3, 0.06, 0.9, (249, 115, 22)))
        prims.append(Box3D(1.1, 1.4, 0, 1.3, 0.06, 0.9, (249, 115, 22)))
        # Tail
        prims.append(Cylinder3D(0, 0.7, -0.6, 0.25, 1.1, (153, 27, 27)))

    elif model == "golem":
        # Torso & Rune
        prims.append(Box3D(0, 1.5, 0, 1.5, 1.3, 0.9, (100, 116, 139)))
        prims.append(Box3D(0, 1.5, 0.48, 0.42, 0.42, 0.1, (6, 182, 212)))
        # Head
        prims.append(Box3D(0, 2.35, 0, 0.65, 0.5, 0.6, (100, 116, 139)))
        # Arms & Fists
        prims.append(Sphere3D(-1.05, 1.75, 0, 0.42, (51, 65, 85)))
        prims.append(Box3D(-1.05, 0.95, 0, 0.5, 0.7, 0.5, (100, 116, 139)))
        prims.append(Sphere3D(1.05, 1.75, 0, 0.42, (51, 65, 85)))
        prims.append(Box3D(1.05, 0.95, 0, 0.5, 0.7, 0.5, (100, 116, 139)))
        # Legs
        prims.append(Box3D(-0.45, 0.5, 0, 0.5, 0.95, 0.5, (51, 65, 85)))
        prims.append(Box3D(0.45, 0.5, 0, 0.5, 0.95, 0.5, (51, 65, 85)))

    elif model == "spider":
        # Cephalothorax & Abdomen
        prims.append(Sphere3D(0, 0.6, 0.2, 0.5, (15, 23, 42)))
        prims.append(Sphere3D(0, 0.85, -0.9, 0.78, (30, 27, 75)))
        # Eyes
        for ex in (-0.2, -0.07, 0.07, 0.2):
            prims.append(Sphere3D(ex, 0.68, 0.65, 0.06, (239, 68, 68)))
        # Legs
        for side in (-1, 1):
            for l_idx in range(4):
                lz = (l_idx - 1.5) * 0.35
                prims.append(Cylinder3D(side * 0.7, 0.5, lz, 0.07, 0.8, (30, 27, 75)))

    elif model == "chest":
        # Box Base & Lid
        prims.append(Box3D(0, 0.55, 0, 1.5, 0.75, 1.1, (133, 77, 14)))
        prims.append(Box3D(0, 0.55, 0, 1.54, 0.78, 0.16, (51, 65, 85)))
        prims.append(Box3D(0, 0.68, 0.58, 0.24, 0.26, 0.1, (250, 204, 21)))
        prims.append(Box3D(0, 1.1, 0, 1.5, 0.42, 1.1, (133, 77, 14)))

    elif model == "staff":
        # Shaft & Crown
        prims.append(Cylinder3D(0, 1.2, 0, 0.08, 2.3, (120, 53, 15)))
        for ry in (0.4, 0.8, 1.2, 1.6, 2.0):
            prims.append(Sphere3D(0, ry, 0, 0.12, (250, 204, 21)))
        prims.append(Sphere3D(0, 2.45, 0, 0.28, (6, 182, 212)))

    else:  # arms / sword_shield
        # Shield
        prims.append(Box3D(-0.65, 1.2, 0, 0.14, 1.3, 0.85, (37, 99, 235)))
        prims.append(Box3D(-0.65, 1.2, 0.45, 0.16, 1.25, 0.1, (250, 204, 21)))
        # Sword
        prims.append(Box3D(0.65, 1.5, 0, 0.18, 1.6, 0.06, (226, 232, 240)))
        prims.append(Box3D(0.65, 0.7, 0, 0.65, 0.1, 0.14, (250, 204, 21)))
        prims.append(Cylinder3D(0.65, 0.4, 0, 0.07, 0.45, (120, 53, 15)))

    return prims


def render_3d_model_to_spec(model="humanoid", width=32, height=32, yaw=25.0, pitch=18.0, camera_mode="perspective"):
    prims = get_3d_primitives(model)

    yaw_rad = math.radians(yaw)
    pitch_rad = math.radians(pitch)

    dist = 6.2
    target_y = 1.2

    cx = dist * math.cos(pitch_rad) * math.sin(yaw_rad)
    cy = dist * math.sin(pitch_rad) + target_y
    cz = dist * math.cos(pitch_rad) * math.cos(yaw_rad)
    cam_pos = (cx, cy, cz)

    # Camera forward
    fx = -cx
    fy = target_y - cy
    fz = -cz
    f_len = math.sqrt(fx * fx + fy * fy + fz * fz) or 1.0
    fx /= f_len
    fy /= f_len
    fz /= f_len

    # Camera right (cross forward with world up [0,1,0])
    rx = fz
    ry = 0.0
    rz = -fx
    r_len = math.sqrt(rx * rx + rz * rz) or 1.0
    rx /= r_len
    rz /= r_len

    # Camera up (cross right with forward)
    ux = ry * fz - rz * fy
    uy = rz * fx - rx * fz
    uz = rx * fy - ry * fx

    # Lighting setup
    sun_dir = (0.577, 0.707, 0.408)
    rim_dir = (-0.577, 0.577, -0.577)

    pixels = []
    normal_pixels = []
    z_buffer = [[1e9] * width for _ in range(height)]
    hit_grid = [[None] * width for _ in range(height)]

    fov_rad = math.radians(42.0)
    tan_half_fov = math.tan(fov_rad * 0.5)

    for y in range(height):
        row_hits = []
        for x in range(width):
            nx = (x + 0.5 - width * 0.5) / (width * 0.5)
            ny = -(y + 0.5 - height * 0.5) / (height * 0.5)

            if camera_mode == "orthographic":
                ortho_size = 2.4
                ro = (
                    cam_pos[0] + (nx * ortho_size) * rx + (ny * ortho_size) * ux,
                    cam_pos[1] + (nx * ortho_size) * ry + (ny * ortho_size) * uy,
                    cam_pos[2] + (nx * ortho_size) * rz + (ny * ortho_size) * uz,
                )
                rd = (fx, fy, fz)
            else:
                rd = (
                    fx + (nx * tan_half_fov) * rx + (ny * tan_half_fov) * ux,
                    fy + (nx * tan_half_fov) * ry + (ny * tan_half_fov) * uy,
                    fz + (nx * tan_half_fov) * rz + (ny * tan_half_fov) * uz,
                )
                rd_len = math.sqrt(rd[0] * rd[0] + rd[1] * rd[1] + rd[2] * rd[2]) or 1.0
                rd = (rd[0] / rd_len, rd[1] / rd_len, rd[2] / rd_len)
                ro = cam_pos

            closest_hit = None
            min_t = 1e9

            for p in prims:
                hit = p.intersect(ro, rd)
                if hit and hit[0] < min_t:
                    min_t = hit[0]
                    closest_hit = hit

            hit_grid[y][x] = closest_hit
            z_buffer[y][x] = min_t if closest_hit else 1e9

    palette_map = {".": "transparent"}
    color_to_char = {}
    hex_chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    char_idx = 0

    grid_rows = []

    for y in range(height):
        row_str = ""
        for x in range(width):
            hit = hit_grid[y][x]
            if not hit:
                row_str += "."
                continue

            t, hx, hy, hz, nx, ny, nz, base_col = hit

            # Detect silhouette edge / outline
            is_edge = False
            for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                ny_pos, nx_pos = y + dy, x + dx
                if 0 <= ny_pos < height and 0 <= nx_pos < width:
                    neighbor_hit = hit_grid[ny_pos][nx_pos]
                    if not neighbor_hit or (z_buffer[ny_pos][nx_pos] - t) > 0.45:
                        is_edge = True
                        break

            if is_edge:
                out_hex = "#14182e"
                if out_hex not in color_to_char:
                    ch = hex_chars[char_idx % len(hex_chars)]
                    char_idx += 1
                    color_to_char[out_hex] = ch
                    palette_map[ch] = out_hex
                row_str += color_to_char[out_hex]
                continue

            # 3-point cel-shading lighting
            n_dot_sun = max(0.0, nx * sun_dir[0] + ny * sun_dir[1] + nz * sun_dir[2])
            n_dot_rim = max(0.0, nx * rim_dir[0] + ny * rim_dir[1] + nz * rim_dir[2])

            lum = 0.35 + 1.25 * n_dot_sun + 0.5 * n_dot_rim
            # 3 discrete cel-shading bands
            if lum < 0.65:
                lum_factor = 0.60
            elif lum < 1.15:
                lum_factor = 0.95
            else:
                lum_factor = 1.30

            cr = min(255, max(0, int(round(base_col[0] * lum_factor))))
            cg = min(255, max(0, int(round(base_col[1] * lum_factor))))
            cb = min(255, max(0, int(round(base_col[2] * lum_factor))))
            hex_val = f"#{cr:02x}{cg:02x}{cb:02x}"

            if hex_val not in color_to_char:
                ch = hex_chars[char_idx % len(hex_chars)]
                char_idx += 1
                color_to_char[hex_val] = ch
                palette_map[ch] = hex_val

            row_str += color_to_char[hex_val]

        grid_rows.append(row_str)

    return {
        "name": f"3d_{model}_{width}x{height}",
        "prompt": f"3D Projected {model} ({camera_mode}, yaw={yaw}°, pitch={pitch}°)",
        "width": width,
        "height": height,
        "fps": 8,
        "palette": palette_map,
        "postProcess": {
            "autoOutline": False,
            "autoShading": False
        },
        "grid": grid_rows
    }


def main():
    parser = argparse.ArgumentParser(
        description="PixelDSL CLI v3.0 — Autonomous 2D Pixel-Art Mathematical Engine & Asset Compiler (8x8..128x128)."
    )
    parser.add_argument(
        "input",
        nargs="?",
        help="Path to sprite JSON file or '-' to read from stdin"
    )
    parser.add_argument(
        "--json",
        dest="inline_json",
        help="Pass sprite JSON string directly via argument"
    )
    parser.add_argument(
        "--generate",
        dest="generate_arch",
        help=f"Generate a 100%% LLM-free procedural sprite by archetype ({', '.join(ARCHETYPE_LIST)})"
    )
    parser.add_argument(
        "--render-3d",
        dest="render_3d",
        help="Render 3D volumetric primitive rig (humanoid, chibi, dragon, golem, spider, chest, staff, arms)"
    )
    parser.add_argument(
        "--yaw",
        type=float,
        default=25.0,
        help="Turntable yaw angle in degrees for --render-3d (default: 25.0)"
    )
    parser.add_argument(
        "--pitch",
        type=float,
        default=18.0,
        help="Turntable pitch angle in degrees for --render-3d (default: 18.0)"
    )
    parser.add_argument(
        "--cam-mode",
        choices=["perspective", "orthographic"],
        default="perspective",
        help="Camera projection for --render-3d (perspective or orthographic)"
    )
    parser.add_argument(
        "--mutate",
        dest="mutate_path",
        help="Mutate an existing sprite JSON file using evolutionary genome perturbation"
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=42,
        help="Random seed for --generate or --mutate (default: 42)"
    )
    parser.add_argument(
        "--size",
        default="32x32",
        help="Canvas size WxH for --generate, --render-3d, or --import-image (default: 32x32)"
    )
    parser.add_argument(
        "--import-image",
        dest="import_image",
        help="Import raw image / sprite strip (chroma-key #FF00FF despill + SLIC superpixel downsampler)"
    )
    parser.add_argument(
        "--ansi",
        action="store_true",
        help="Print TrueColor ANSI character block preview in terminal"
    )
    parser.add_argument(
        "--no-sync",
        action="store_true",
        help="Skip registering sprite in presets.js"
    )
    args = parser.parse_args()

    base_dir = Path(__file__).resolve().parent

    size_parts = str(args.size).lower().split("x")
    gen_w = clamp_size(size_parts[0], 32)
    gen_h = clamp_size(size_parts[1] if len(size_parts) > 1 else size_parts[0], gen_w)

    if args.render_3d:
        spec = render_3d_model_to_spec(
            args.render_3d,
            width=gen_w,
            height=gen_h,
            yaw=args.yaw,
            pitch=args.pitch,
            camera_mode=args.cam_mode
        )
        process_spec(spec, base_dir, show_ansi=args.ansi, sync_web=not args.no_sync)
        return

    if args.generate_arch:
        spec = generate_archetype(args.generate_arch, seed=args.seed, width=gen_w, height=gen_h)
        process_spec(spec, base_dir, show_ansi=args.ansi, sync_web=not args.no_sync)
        return

    if args.mutate_path:
        m_path = Path(args.mutate_path)
        if not m_path.exists():
            print(f"Error: file not found: {m_path}", file=sys.stderr)
            sys.exit(1)
        parent_spec = json.loads(m_path.read_text(encoding="utf-8"))
        spec = mutate_spec(parent_spec, seed=args.seed, rate=0.28)
        process_spec(spec, base_dir, show_ansi=args.ansi, sync_web=not args.no_sync)
        return

    if args.import_image:
        imp_path = Path(args.import_image)
        if not imp_path.exists():
            print(f"Error: image file not found: {imp_path}", file=sys.stderr)
            sys.exit(1)
        spec = import_image_to_spec(imp_path, target_size=gen_w)
        process_spec(spec, base_dir, show_ansi=args.ansi, sync_web=not args.no_sync)
        return

    raw_json = None
    if args.inline_json:
        raw_json = args.inline_json
    elif args.input == "-":
        raw_json = sys.stdin.read()
    elif args.input:
        in_path = Path(args.input)
        if not in_path.exists():
            print(f"Error: file not found: {in_path}", file=sys.stderr)
            sys.exit(1)
        raw_json = in_path.read_text(encoding="utf-8")
    else:
        parser.print_help()
        sys.exit(0)

    cleaned = raw_json.strip()
    fence_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", cleaned, re.DOTALL)
    if fence_match:
        cleaned = fence_match.group(1)

    try:
        spec = json.loads(cleaned)
    except Exception as exc:
        print(f"JSON Parse Error: {exc}", file=sys.stderr)
        sys.exit(1)

    process_spec(spec, base_dir, show_ansi=args.ansi, sync_web=not args.no_sync)


if __name__ == "__main__":
    main()
