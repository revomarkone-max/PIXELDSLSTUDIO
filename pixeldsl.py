#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PixelDSL CLI v2.5 — Blind 2D Pixel-Art Asset Compiler (8x8 .. 128x128) for any LLM CLI.
Zero external dependencies (uses only Python 3 standard library: json, zlib, struct, math).

Features:
- Accepts JSON from a file path, --json inline string, or standard input (stdin).
- Supports symbolic grids (grid), integer/SDF primitive layers (layers), SDF Smooth Union (smoothBlend),
  3D Heightmap Normal Shading (sdfShading), auto color ramps (ramps), retro palettes, and multi-frame animations.
- Prints an AI self-diagnostics report to stdout (fill %, center balance, edge clipping check)
  along with a TrueColor ANSI terminal preview using half-blocks (▀).
- Automatically saves canonical JSON to sprites/, exports 1:1 PNG and _sheet.png to game_ready/,
  and syncs the sprite library with the Web Studio (presets.js -> index.html).
"""

import argparse
import copy
import json
import math
import re
import struct
import sys
import zlib
from pathlib import Path

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
                return (int(h[0]*2, 16), int(h[1]*2, 16), int(h[2]*2, 16), 255)
            if len(h) == 4:
                return (int(h[0]*2, 16), int(h[1]*2, 16), int(h[2]*2, 16), int(h[3]*2, 16))
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


def generate_color_ramp(base_hex):
    r, g, b, a = parse_color(base_hex)
    light = rgba_to_hex(
        min(255, r + (255 - r) * 0.35 + 12),
        min(255, g + (255 - g) * 0.38 + 14),
        min(255, b + (255 - b) * 0.18),
        a
    )
    dark = rgba_to_hex(
        max(0, r * 0.62 - 6),
        max(0, g * 0.66 - 4),
        max(0, min(255, b * 0.78 + 10)),
        a
    )
    outline = rgba_to_hex(
        max(8, r * 0.22),
        max(10, g * 0.22),
        max(22, min(255, b * 0.34 + 14)),
        255
    )
    return {"base": base_hex, "light": light, "dark": dark, "outline": outline}


def derive_sdf_shading_tones(base_rgba):
    r, g, b, a = base_rgba
    deep_shadow = (
        max(0, int(round(r * 0.56 - 6))),
        max(0, int(round(g * 0.60 - 4))),
        max(0, min(255, int(round(b * 0.74 + 12)))),
        a
    )
    shadow = (
        max(0, int(round(r * 0.76 - 3))),
        max(0, int(round(g * 0.79 - 2))),
        max(0, min(255, int(round(b * 0.88 + 6)))),
        a
    )
    base = (r, g, b, a)
    highlight = (
        min(255, int(round(r + (255 - r) * 0.30 + 10))),
        min(255, int(round(g + (255 - g) * 0.34 + 12))),
        min(255, int(round(b + (255 - b) * 0.16))),
        a
    )
    specular = (
        min(255, int(round(r + (255 - r) * 0.62 + 18))),
        min(255, int(round(g + (255 - g) * 0.65 + 18))),
        min(255, int(round(b + (255 - b) * 0.45 + 8))),
        a
    )
    return {
        "deepShadow": deep_shadow,
        "shadow": shadow,
        "base": base,
        "highlight": highlight,
        "specular": specular
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
                if cfg.get("light"):
                    merged[cfg["light"]] = ramp["light"]
                if cfg.get("dark"):
                    merged[cfg["dark"]] = ramp["dark"]
                if cfg.get("outline"):
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


def check_dither(pattern, x, y):
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
    return False


def smin(a, b, k):
    if not k or k <= 0:
        return min(a, b)
    h = max(k - abs(a - b), 0.0) / float(k)
    return min(a, b) - h * h * k * 0.25


def compute_layer_sdf(layer, width, height):
    op = str(layer.get("op", "")).lower()
    sdf = [1e4] * (width * height)

    if op == "ellipse":
        cx = float(layer.get("cx", width / 2.0))
        cy = float(layer.get("cy", height / 2.0))
        rx = max(0.5, float(layer.get("rx", 4.0)))
        ry = max(0.5, float(layer.get("ry", 4.0)))
        rad = math.radians(float(layer.get("angle", 0.0)))
        cos_a = math.cos(-rad)
        sin_a = math.sin(-rad)
        scale = min(rx, ry)
        for y in range(height):
            for x in range(width):
                dx = x - cx
                dy = y - cy
                lx = dx * cos_a - dy * sin_a
                ly = dx * sin_a + dy * cos_a
                q = math.sqrt((lx * lx) / (rx * rx) + (ly * ly) / (ry * ry))
                sdf[y * width + x] = (q - 1.0) * scale

    elif op == "rect":
        x0 = float(layer.get("x", 0))
        y0 = float(layer.get("y", 0))
        w = max(1.0, float(layer.get("w", 4)))
        h = max(1.0, float(layer.get("h", 4)))
        r = max(0.0, float(layer.get("rx", 0)))
        cx = x0 + (w - 1.0) * 0.5
        cy = y0 + (h - 1.0) * 0.5
        bx = max(0.1, w * 0.5 - r)
        by = max(0.1, h * 0.5 - r)
        for y in range(height):
            for x in range(width):
                qx = abs(x - cx) - bx
                qy = abs(y - cy) - by
                out_dist = math.sqrt(max(qx, 0.0) ** 2 + max(qy, 0.0) ** 2)
                in_dist = min(max(qx, qy), 0.0)
                sdf[y * width + x] = out_dist + in_dist - r

    elif op == "polygon" and isinstance(layer.get("points"), list) and len(layer["points"]) >= 3:
        pts = layer["points"]
        n = len(pts)
        for y in range(height):
            for x in range(width):
                inside = False
                min_dist_sq = 1e9
                j = n - 1
                for i in range(n):
                    xi, yi = float(pts[i][0]), float(pts[i][1])
                    xj, yj = float(pts[j][0]), float(pts[j][1])
                    vx, vy = xj - xi, yj - yi
                    wx, wy = x - xi, y - yi
                    len_sq = vx * vx + vy * vy or 1e-7
                    t = max(0.0, min(1.0, (wx * vx + wy * vy) / len_sq))
                    dx = wx - vx * t
                    dy = wy - vy * t
                    min_dist_sq = min(min_dist_sq, dx * dx + dy * dy)
                    denom = (yj - yi) if (yj - yi) != 0 else 1e-7
                    if ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / denom + xi):
                        inside = not inside
                    j = i
                dist = math.sqrt(min_dist_sq)
                sdf[y * width + x] = -dist if inside else dist

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


def apply_frame_overrides(spec, frame_index=0):
    frames = spec.get("frames")
    if not isinstance(frames, list) or frame_index <= 0 or frame_index > len(frames):
        return spec
    frame_def = frames[frame_index - 1] or {}
    cloned = copy.deepcopy(spec)

    if isinstance(frame_def.get("grid"), list) and len(frame_def["grid"]) > 0:
        cloned["grid"] = frame_def["grid"]

    layer_mods = frame_def.get("layers") or frame_def.get("overrides") or {}
    if isinstance(cloned.get("layers"), list) and isinstance(layer_mods, dict):
        new_layers = []
        for layer in cloned["layers"]:
            lid = layer.get("id")
            if not lid or lid not in layer_mods:
                new_layers.append(layer)
                continue
            mod = layer_mods[lid]
            if mod.get("hidden"):
                continue
            updated = copy.deepcopy(layer)
            updated.update(mod)
            dx = mod.get("dx")
            if isinstance(dx, (int, float)):
                if isinstance(updated.get("cx"), (int, float)):
                    updated["cx"] += dx
                if isinstance(updated.get("x"), (int, float)):
                    updated["x"] += dx
                if isinstance(updated.get("x1"), (int, float)):
                    updated["x1"] += dx
                    updated["x2"] = updated.get("x2", 0) + dx
                if isinstance(updated.get("points"), list):
                    updated["points"] = [[pt[0] + dx, pt[1]] for pt in updated["points"]]
            dy = mod.get("dy")
            if isinstance(dy, (int, float)):
                if isinstance(updated.get("cy"), (int, float)):
                    updated["cy"] += dy
                if isinstance(updated.get("y"), (int, float)):
                    updated["y"] += dy
                if isinstance(updated.get("y1"), (int, float)):
                    updated["y1"] += dy
                    updated["y2"] = updated.get("y2", 0) + dy
                if isinstance(updated.get("points"), list):
                    updated["points"] = [[pt[0], pt[1] + dy] for pt in updated["points"]]
            d_angle = mod.get("dAngle")
            if isinstance(d_angle, (int, float)):
                updated["angle"] = float(updated.get("angle", 0)) + d_angle
            drx = mod.get("drx")
            if isinstance(drx, (int, float)) and isinstance(updated.get("rx"), (int, float)):
                updated["rx"] = max(1, updated["rx"] + drx)
            dry = mod.get("dry")
            if isinstance(dry, (int, float)) and isinstance(updated.get("ry"), (int, float)):
                updated["ry"] = max(1, updated["ry"] + dry)
            new_layers.append(updated)
        cloned["layers"] = new_layers

    return cloned


def render_sprite(spec_input, frame_index=0):
    spec = apply_frame_overrides(spec_input or {}, frame_index)
    size_arr = spec.get("size") if isinstance(spec.get("size"), list) else [None, None]
    width = clamp_size(spec.get("width") or size_arr[0], 32)
    height = clamp_size(spec.get("height") or size_arr[1], 32)
    palette_raw = resolve_full_palette(spec)
    post = spec.get("postProcess") if isinstance(spec.get("postProcess"), dict) else {}
    global_sdf_shading = bool(post.get("sdfShading"))

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
    symbol_buffer = ["."] * (width * height)

    def blend_pixel(x, y, rgba, sym=None):
        ix = int(round(x))
        iy = int(round(y))
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
                buffer[idx] = min(255, int(round((sr * src_a + buffer[idx] * dst_a * (1.0 - src_a)) / out_a)))
                buffer[idx + 1] = min(255, int(round((sg * src_a + buffer[idx + 1] * dst_a * (1.0 - src_a)) / out_a)))
                buffer[idx + 2] = min(255, int(round((sb * src_a + buffer[idx + 2] * dst_a * (1.0 - src_a)) / out_a)))
                buffer[idx + 3] = min(255, int(round(out_a * 255)))
        if sym:
            symbol_buffer[iy * width + ix] = sym

    def rasterize_sdf_field(sdf_field, layer):
        full_mask = bytearray(width * height)
        max_depth = 1.0
        for i in range(width * height):
            if sdf_field[i] <= 0.0:
                full_mask[i] = 1
                if -sdf_field[i] > max_depth:
                    max_depth = -sdf_field[i]

        fill_rgba = resolve_color(layer.get("fill"))
        outline_key = layer.get("outline")
        outline_rgba = resolve_color(outline_key) if outline_key else None
        dither_key = layer.get("ditherColor")
        dither_rgba = resolve_color(dither_key) if dither_key else fill_rgba
        dither_mode = layer.get("dither", "none")
        use_sdf_3d = bool(layer.get("sdf") or global_sdf_shading) and fill_rgba[3] >= 200

        height_field = None
        tones = None
        if use_sdf_3d:
            tones = derive_sdf_shading_tones(fill_rgba)
            height_field = [0.0] * (width * height)
            for i in range(width * height):
                if full_mask[i]:
                    t = max(0.0, min(1.0, -sdf_field[i] / max_depth))
                    height_field[i] = math.sqrt(max(0.0, 1.0 - (1.0 - t) ** 2)) * max_depth

        lx, ly, lz = -0.52, -0.62, 0.58

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
                if outline_rgba and outline_rgba[3] > 0 and is_edge:
                    blend_pixel(x, y, outline_rgba, outline_key)
                elif fill_rgba[3] > 0:
                    if use_sdf_3d and height_field:
                        z_l = height_field[y * width + (x - 1)] if x > 0 else 0.0
                        z_r = height_field[y * width + (x + 1)] if x < width - 1 else 0.0
                        z_u = height_field[(y - 1) * width + x] if y > 0 else 0.0
                        z_d = height_field[(y + 1) * width + x] if y < height - 1 else 0.0

                        nx = -(z_r - z_l) * 0.65
                        ny = -(z_d - z_u) * 0.65
                        nz = 1.0
                        inv_len = 1.0 / math.sqrt(nx * nx + ny * ny + nz * nz)
                        nx *= inv_len
                        ny *= inv_len
                        nz *= inv_len

                        bayer = BAYER_2X2[y & 1][x & 1]
                        intensity = (nx * lx + ny * ly + nz * lz) + bayer

                        chosen_rgba = tones["base"]
                        if intensity > 0.86:
                            chosen_rgba = tones["specular"]
                        elif intensity > 0.66:
                            chosen_rgba = tones["highlight"]
                        elif intensity < 0.25:
                            chosen_rgba = tones["deepShadow"]
                        elif intensity < 0.44:
                            chosen_rgba = tones["shadow"]

                        if dither_mode != "none" and check_dither(dither_mode, x, y):
                            chosen_rgba = dither_rgba
                        blend_pixel(x, y, chosen_rgba, layer.get("fill"))
                    else:
                        use_dither = check_dither(dither_mode, x, y)
                        blend_pixel(
                            x, y,
                            dither_rgba if use_dither else fill_rgba,
                            (dither_key or layer.get("fill")) if use_dither else layer.get("fill")
                        )

    def plot_point_with_mirror(x, y, thickness, rgba, sym, mirror):
        r = max(1, int(round(thickness or 1)))
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
        ix0, iy0 = int(round(x0)), int(round(y0))
        ix1, iy1 = int(round(x1)), int(round(y1))
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

        if op in ("ellipse", "rect", "polygon"):
            combined_sdf = compute_layer_sdf(layer, width, height)
            while (
                i + 1 < len(layers) and
                isinstance(layers[i + 1], dict) and
                not layers[i + 1].get("hidden") and
                str(layers[i + 1].get("op", "")).lower() in ("ellipse", "rect", "polygon") and
                float(layers[i + 1].get("smoothBlend", 0) or 0) > 0 and
                layers[i + 1].get("fill") == layer.get("fill")
            ):
                next_layer = layers[i + 1]
                next_sdf = compute_layer_sdf(next_layer, width, height)
                k = float(next_layer.get("smoothBlend", 0))
                for p in range(width * height):
                    combined_sdf[p] = smin(combined_sdf[p], next_sdf[p], k)
                i += 1
            rasterize_sdf_field(combined_sdf, layer)

        elif op == "line":
            col_key = layer.get("color") or layer.get("fill") or "O"
            rgba = resolve_color(col_key)
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
            ox = int(round(float(layer.get("x", 0))))
            oy = int(round(float(layer.get("y", 0))))
            mirror = layer.get("mirror", "none")
            cmap = layer.get("map") if isinstance(layer.get("map"), dict) else {}
            for sy, row in enumerate(layer["grid"]):
                row_s = str(row or "")
                for sx, ch in enumerate(row_s):
                    if ch in (".", " "):
                        continue
                    c_key = cmap.get(ch, ch)
                    rgba = resolve_color(c_key)
                    plot_point_with_mirror(ox + sx, oy + sy, 1, rgba, ch, mirror)

        elif op == "pixels" and isinstance(layer.get("points"), list):
            col_key = layer.get("color") or layer.get("fill") or "O"
            rgba = resolve_color(col_key)
            mirror = layer.get("mirror", "none")
            for pt in layer["points"]:
                if isinstance(pt, list) and len(pt) >= 2:
                    plot_point_with_mirror(pt[0], pt[1], 1, rgba, col_key, mirror)

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
                    buffer[idx] = min(255, int(round(copy_buf[idx] + (255 - copy_buf[idx]) * strength)))
                    buffer[idx + 1] = min(255, int(round(copy_buf[idx + 1] + (255 - copy_buf[idx + 1]) * (strength * 1.1))))
                    buffer[idx + 2] = min(255, int(round(copy_buf[idx + 2] + (255 - copy_buf[idx + 2]) * (strength * 0.7))))
                elif br_diff and not tl_diff:
                    buffer[idx] = max(0, int(round(copy_buf[idx] * (1.0 - strength * 1.1))))
                    buffer[idx + 1] = max(0, int(round(copy_buf[idx + 1] * (1.0 - strength))))
                    buffer[idx + 2] = max(0, int(round(copy_buf[idx + 2] * (1.0 - strength * 0.8))))

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

    diagnostics = analyze_buffer(width, height, buffer)
    return {
        "width": width,
        "height": height,
        "buffer": buffer,
        "symbol_buffer": symbol_buffer,
        "warnings": warnings,
        "diagnostics": diagnostics
    }


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
        new_content = pattern.sub(assign_code, content)
    elif f'name: "{sprite_key}"' in content or f'"name": "{sprite_key}"' in content:
        return True
    else:
        new_content = content[:idx] + assign_code + content[idx:]

    p_path.write_text(new_content, encoding="utf-8")
    return True


def process_spec(spec, base_dir, no_ansi=False, sync_web=True):
    name = re.sub(r"[^a-zA-Z0-9_-]", "_", str(spec.get("name") or "sprite"))
    spec["name"] = name

    frames_extra = spec.get("frames") if isinstance(spec.get("frames"), list) else []
    total_frames = 1 + len(frames_extra)

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
    print(f"[PixelDSL CLI] Sprite: {name} | Size: {w}x{h} px | Frames: {total_frames}")
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
    if sheet_path:
        print(f"  • PNG (Sprite Sheet): {sheet_path} ({w * total_frames}x{h} px)")
    print(f"  • PNG (Preview x{preview_scale})  : {png_preview_path}")
    print(f"  • Web Studio Sync   : {'OK (registered in presets.js)' if synced else 'Skipped'}")
    print("=" * 64)

    if not no_ansi:
        print(render_ansi_preview(w, h, first["buffer"]))
        print("=" * 64)


def main():
    parser = argparse.ArgumentParser(
        description="PixelDSL CLI v2.5 — 2D Pixel-Art Asset Compiler (8x8..128x128) with SDF & 3D Volume Shading."
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
        "--no-ansi",
        action="store_true",
        help="Disable TrueColor ANSI preview in terminal"
    )
    parser.add_argument(
        "--no-sync",
        action="store_true",
        help="Skip registering sprite in presets.js"
    )
    args = parser.parse_args()

    base_dir = Path(__file__).resolve().parent

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

    process_spec(spec, base_dir, no_ansi=args.no_ansi, sync_web=not args.no_sync)


if __name__ == "__main__":
    main()
