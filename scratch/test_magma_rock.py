import sys
import os
import math

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)) + "/..")
from pixeldsl import (
    value_noise2d, hash2d, worley_f1_f2, rgb_to_oklab, oklab_to_rgb,
    write_png, js_round, BAYER_4X4_NORM
)

def eval_magma_sample(u, v, time_val):
    # Normalized coords [-1, 1], centered
    px = u * 2.0 - 1.0
    py = v * 2.0 - 1.0
    r_dist = math.hypot(px, py)
    ang = math.atan2(py, px)

    # 1. Chunky, weighty volcanic boulder silhouette
    # Asymmetric natural stone contours with chiseled fractures
    facet = (
        0.08 * math.sin(ang * 3.0 + 0.8) +
        0.05 * math.cos(ang * 5.0 - 1.1) +
        0.03 * math.sin(ang * 7.0 + 2.2)
    )
    # Slight flattened bottom so it sits like a solid boulder
    base_flatten = 0.06 * max(0.0, py - 0.2)
    # Subtle organic noise along the stone perimeter
    noise_disp = 0.04 * (value_noise2d(px * 5.0 + 15.0, py * 5.0 + 15.0, seed=51) - 0.5)
    rock_radius = 0.73 + facet - base_flatten + noise_disp

    # Transparent outside the rock
    rock_edge_dist = r_dist - rock_radius
    if rock_edge_dist > 0.015:
        return 0.0, 0.0, 0.0, 0.0

    # 2. Organic Tectonic Fissure Network (Major Arteries + Branching Veins)
    # Domain warping to make the cracks jagged and rocky
    warp_x = px + 0.22 * (value_noise2d(px * 3.5, py * 3.5, seed=24) - 0.5)
    warp_y = py + 0.22 * (value_noise2d(px * 3.5 + 40.0, py * 3.5 + 40.0, seed=38) - 0.5)

    # Major tectonic fissures (larger plates, fewer but deeper veins)
    f1, f2 = worley_f1_f2(warp_x * 2.2, warp_y * 2.2, scale=1.0, seed=83)
    crack_dist_1 = f2 - f1

    # Secondary branching fissures
    f1_sub, f2_sub = worley_f1_f2(warp_x * 4.6, warp_y * 4.6, scale=1.0, seed=127)
    crack_dist_2 = f2_sub - f1_sub

    # Major crack threshold & secondary crack threshold
    is_main_crack = crack_dist_1 < 0.26
    is_branch_crack = crack_dist_2 < 0.12 and r_dist < (rock_radius - 0.10)

    in_crack = False
    crack_factor = 0.0

    if is_main_crack:
        in_crack = True
        crack_factor = max(crack_factor, 1.0 - (crack_dist_1 / 0.26))
    if is_branch_crack:
        in_crack = True
        b_val = (1.0 - (crack_dist_2 / 0.12)) * 0.78
        crack_factor = max(crack_factor, b_val)

    # 3. Molten Shimmering & Surging Lava Flow (Преливающаяся лава)
    if in_crack:
        # Flow vectors along the fissures
        # Seamless loop across time_val [0..1]
        t_rad = time_val * 6.2831853
        
        # Multiple travelling waves through the fissure channels
        wave1 = math.sin((px * 3.5 - py * 2.8) * 1.5 - t_rad)
        wave2 = math.cos((px * 2.0 + py * 4.0) * 1.2 + t_rad)
        heat_surge = 0.5 + 0.35 * wave1 + 0.15 * wave2

        # Swirling convective bubbling hotspots (circular path in noise space)
        bubble_x = px * 5.0 + math.cos(t_rad) * 0.9
        bubble_y = py * 5.0 + math.sin(t_rad) * 0.9
        bubble_noise = value_noise2d(bubble_x, bubble_y, seed=219)

        # Hot magma pools at vein junctions (where f1 is close to 0)
        junction_pool = math.exp(-f1 * 4.0) * 0.45

        # Thermal intensity calculation
        thermal = (
            crack_factor * 0.72 +
            heat_surge * 0.35 +
            (bubble_noise - 0.5) * 0.30 +
            junction_pool
        )
        thermal = max(0.0, min(1.0, thermal))

        # Magma Incandescent Thermal Gradient:
        # white-hot core -> luminous golden yellow -> blazing fiery orange -> deep magma red -> crusty ember
        if thermal > 0.82:
            # White-hot molten core
            t = (thermal - 0.82) / 0.18
            cr = 1.0
            cg = 0.90 + 0.10 * t
            cb = 0.60 + 0.40 * t
        elif thermal > 0.55:
            # Searing luminous gold-yellow
            t = (thermal - 0.55) / 0.27
            cr = 1.0
            cg = 0.55 + 0.35 * t
            cb = 0.05 + 0.30 * t
        elif thermal > 0.28:
            # Radiant fiery orange
            t = (thermal - 0.28) / 0.27
            cr = 0.90 + 0.10 * t
            cg = 0.18 + 0.37 * t
            cb = 0.0
        else:
            # Deep glowing crimson magma
            t = thermal / 0.28
            cr = 0.45 + 0.45 * t
            cg = 0.04 + 0.14 * t
            cb = 0.0

        return cr, cg, cb, 1.0

    # 4. Solid Black Obsidian / Basalt Stone Surface
    # 3D faceted directional lighting (light from upper-left)
    lx = -0.55
    ly = -0.68
    lz = 0.48
    
    # Surface normal perturbation from rock facets & chiseled noise
    facet_noise = value_noise2d(px * 6.5, py * 6.5, seed=143)
    macro_facet = (
        0.12 * math.sin(px * 8.0 + py * 4.0) +
        0.08 * math.cos(px * 5.0 - py * 7.0)
    )
    
    # Spherical dome for depth
    dome_z = math.sqrt(max(0.05, 1.0 - (r_dist / rock_radius) ** 2))
    
    # Combined diffuse lighting on the stone
    stone_light = max(0.0, (-px * lx - py * ly) * 0.5 + 0.5) * dome_z + macro_facet * 0.15 + (facet_noise - 0.5) * 0.08
    stone_light = max(0.04, min(0.95, stone_light))

    # Base basalt stone color: very dark obsidian (#090a10 -> #181c28 -> #2c3348)
    cr = stone_light * 0.15
    cg = stone_light * 0.18
    cb = stone_light * 0.28

    # Subsurface thermal glow bleeding into stone adjacent to fissures
    dist_to_vein = min(crack_dist_1, crack_dist_2)
    glow_radius = 0.38
    if dist_to_vein < glow_radius:
        glow_intensity = ((1.0 - dist_to_vein / glow_radius) ** 2.2) * 0.42
        # Pulsing ambient heat from the churning magma
        pulse_amb = 0.85 + 0.15 * math.sin(time_val * 6.28318)
        glow_intensity *= pulse_amb
        cr += glow_intensity * 0.90
        cg += glow_intensity * 0.22
        cb += glow_intensity * 0.02

    # Sharp specular glint on polished obsidian ridges
    if facet_noise > 0.74 and stone_light > 0.48:
        glint = (facet_noise - 0.74) / 0.26 * 0.32
        cr += glint * 0.75
        cg += glint * 0.85
        cb += glint * 1.05

    # Dark silhouette outline rim
    if rock_edge_dist > -0.07:
        rim = max(0.0, (rock_edge_dist + 0.07) / 0.07)
        fade = 1.0 - rim * 0.65
        cr *= fade
        cg *= fade
        cb *= fade

    return min(1.0, cr), min(1.0, cg), min(1.0, cb), 1.0

print("Magma function defined.")

def render_test_rock(width=48, height=48, frames_count=10, out_prefix="scratch/test_magma"):
    # Curated volcanic palette (black obsidian rock + searing magma tones)
    palette = [
        [0, 0, 0, 0],       # 0: transparent
        [10, 11, 16, 255],  # 1: obsidian deep shadow #0a0b10
        [22, 25, 36, 255],  # 2: basalt dark midtone #161924
        [38, 44, 62, 255],  # 3: chiseled rock highlight #262c3e
        [68, 80, 110, 255], # 4: obsidian crest specular #44506e
        [65, 10, 6, 255],   # 5: cooled slag / ember rim #410a06
        [135, 18, 4, 255],  # 6: deep crimson magma #871204
        [205, 52, 0, 255],  # 7: burning orange lava #cd3400
        [255, 138, 0, 255], # 8: bright molten orange #ff8a00
        [255, 218, 36, 255],# 9: searing yellow-gold #ffda24
        [255, 255, 220, 255]# 10: white-hot core #ffffdc
    ]
    pal_oklab = [rgb_to_oklab(c[0], c[1], c[2]) for c in palette[1:]]

    all_frames = []
    normal_frames = []

    for f_idx in range(frames_count):
        t_val = f_idx / float(frames_count)
        buf = bytearray(width * height * 4)
        norm_buf = bytearray(width * height * 4)
        intensity_map = [0.0] * (width * height)

        for y in range(height):
            v = 1.0 - (y + 0.5) / float(height)
            for x in range(width):
                u = (x + 0.5) / float(width)
                r, g, b, a = eval_magma_sample(u, v, t_val)
                idx = y * width + x
                intensity_map[idx] = (r + g + b) / 3.0 * a

                if a <= 0.05:
                    buf[idx * 4:idx * 4 + 4] = bytes([0, 0, 0, 0])
                    norm_buf[idx * 4:idx * 4 + 4] = bytes([128, 128, 255, 0])
                    continue

                # Bayer 4x4 dithering
                dither_offset = BAYER_4X4_NORM[y % 4][x % 4] * 0.14
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

                chosen_col = palette[best_idx + 1]
                buf[idx * 4:idx * 4 + 4] = bytes(chosen_col)

        # Normals
        for y in range(height):
            for x in range(width):
                idx = y * width + x
                if buf[idx * 4 + 3] == 0:
                    norm_buf[idx * 4:idx * 4 + 4] = bytes([128, 128, 255, 0])
                    continue
                left_i = intensity_map[y * width + max(0, x - 1)]
                right_i = intensity_map[y * width + min(width - 1, x + 1)]
                up_i = intensity_map[max(0, y - 1) * width + x]
                down_i = intensity_map[min(height - 1, y + 1) * width + x]
                gx = (right_i - left_i) * 2.2
                gy = (down_i - up_i) * 2.2
                gl = math.hypot(gx, gy)
                nx = (gx / gl) * 0.72 if gl > 1e-5 else 0.0
                ny = (gy / gl) * 0.72 if gl > 1e-5 else 0.0
                nz = math.sqrt(max(0.1, 1.0 - nx * nx - ny * ny))
                norm_buf[idx * 4] = max(0, min(255, js_round((nx * 0.5 + 0.5) * 255.0)))
                norm_buf[idx * 4 + 1] = max(0, min(255, js_round((-ny * 0.5 + 0.5) * 255.0)))
                norm_buf[idx * 4 + 2] = max(0, min(255, js_round((nz * 0.5 + 0.5) * 255.0)))
                norm_buf[idx * 4 + 3] = 255

        all_frames.append(buf)
        normal_frames.append(norm_buf)

    # Save single frame 0 preview
    write_png(f"{out_prefix}_preview.png", width, height, all_frames[0])
    
    # Save sprite sheet (horizontal strip)
    sheet_w = width * frames_count
    sheet_h = height
    sheet_buf = bytearray(sheet_w * sheet_h * 4)
    norm_sheet_buf = bytearray(sheet_w * sheet_h * 4)
    for fi, (f_buf, n_buf) in enumerate(zip(all_frames, normal_frames)):
        for y in range(height):
            for x in range(width):
                s_idx = (y * sheet_w + (fi * width + x)) * 4
                f_idx_pix = (y * width + x) * 4
                sheet_buf[s_idx:s_idx + 4] = f_buf[f_idx_pix:f_idx_pix + 4]
                norm_sheet_buf[s_idx:s_idx + 4] = normal_frames[fi][f_idx_pix:f_idx_pix + 4]

    write_png(f"{out_prefix}_sheet.png", sheet_w, sheet_h, sheet_buf)
    write_png(f"{out_prefix}_normal.png", sheet_w, sheet_h, norm_sheet_buf)
    print(f"Rendered {frames_count} frames of size {width}x{height} to {out_prefix}_sheet.png")

if __name__ == "__main__":
    render_test_rock(width=48, height=48, frames_count=10)

