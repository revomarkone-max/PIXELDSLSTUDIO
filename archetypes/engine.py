import sys
import os
import math
import json
import argparse

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)) + "/..")
from pixeldsl import render_sprite, write_png

ARCHETYPES_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CATEGORIES = ["creatures", "nature", "items", "vfx", "tilesets"]

# Built-in Default Palettes for Archetype Instant Theming
DEFAULT_PALETTES = {
    # Creatures
    "humanoid": {
        ".": "transparent",
        "O": "#191c26",
        "skin": "#ffccaa",
        "skin_dark": "#cc9977",
        "clothes": "#2563eb",
        "clothes_dark": "#1d4ed8",
        "pants": "#374151",
        "pants_dark": "#1f2937",
        "shoes": "#78350f",
        "shoes_dark": "#451a03",
        "hair": "#451a03"
    },
    "quadruped_feline": {
        ".": "transparent",
        "O": "#1c140a",
        "fur": "#ea580c",
        "fur_dark": "#9a3412",
        "white": "#fed7aa",
        "white_dark": "#fdba74"
    },
    "quadruped_canine": {
        ".": "transparent",
        "O": "#15181e",
        "fur": "#64748b",
        "fur_dark": "#334155",
        "fur_light": "#cbd5e1",
        "dark": "#0f172a"
    },
    "avian_bird": {
        ".": "transparent",
        "O": "#1a1612",
        "feathers": "#593318",
        "feathers_dark": "#382010",
        "feathers_light": "#804c27",
        "gold": "#eab308"
    },
    # Nature
    "tree_deciduous": {
        ".": "transparent",
        "O": "#142115",
        "wood": "#5c3d24",
        "wood_dark": "#3b2414",
        "foliage": "#2e7d32",
        "foliage_dark": "#1b4d20",
        "foliage_light": "#4caf50",
        "shadow": "#14182e38"
    },
    "building_structure": {
        ".": "transparent",
        "O": "#1a1c24",
        "stone": "#64748b",
        "stone_dark": "#334155",
        "plaster": "#e2e8f0",
        "wood": "#78350f",
        "wood_dark": "#451a03",
        "tiles": "#991b1b",
        "light_warm": "#fef08a",
        "shadow": "#14182e38"
    },
    # Items
    "weapon_sword": {
        ".": "transparent",
        "O": "#141724",
        "steel": "#e2e8f0",
        "steel_dark": "#64748b",
        "gold": "#eab308",
        "leather": "#78350f",
        "ruby": "#dc2626",
        "white": "#ffffff"
    },
    "potion_bottle": {
        ".": "transparent",
        "O": "#111827",
        "cork": "#a16207",
        "glass_tint": "#38bdf844",
        "elixir": "#e11d48",
        "elixir_light": "#fb7185",
        "elixir_white": "#ffe4e6",
        "white_specular": "#ffffffaa",
        "shadow": "#14182e38"
    },
    # VFX
    "projectile_orb": {
        ".": "transparent",
        "O": "#1c0a0a",
        "flame_dark": "#7f1d1d",
        "flame_trans": "#ef444444",
        "flame_mid": "#ea580c",
        "flame_bright": "#f97316",
        "flame_yellow": "#fde047",
        "white": "#ffffff"
    },
    # Tilesets
    "autotile_terrain": {
        ".": "transparent",
        "O": "#14181f",
        "grass": "#388e3c",
        "grass_light": "#66bb6a",
        "dirt": "#5d4037",
        "stone": "#78909c",
        "stone_dark": "#37474f"
    }
}

def load_archetype(name_or_path):
    if os.path.isfile(name_or_path):
        with open(name_or_path, "r", encoding="utf-8") as f:
            return json.load(f)
    for cat in CATEGORIES:
        cand = os.path.join(ARCHETYPES_BASE_DIR, cat, f"{name_or_path}.json")
        if os.path.isfile(cand):
            with open(cand, "r", encoding="utf-8") as f:
                return json.load(f)
    raise FileNotFoundError(f"Archetype '{name_or_path}' not found in any categories under {ARCHETYPES_BASE_DIR}")

def list_all_archetypes():
    res = {}
    for cat in CATEGORIES:
        cat_dir = os.path.join(ARCHETYPES_BASE_DIR, cat)
        if os.path.isdir(cat_dir):
            res[cat] = [f[:-5] for f in os.listdir(cat_dir) if f.endswith(".json")]
    return res

def compile_archetype(
    archetype_id="humanoid",
    width=48,
    height=48,
    action="walk",
    frames=8,
    head_scale=1.0,
    build_scale=1.0,
    palette=None,
    outline_mode="none"
):
    arch = load_archetype(archetype_id)
    scale_factor = min(width, height)
    arch_type = arch.get("id")

    # 1. Check if archetype is Rig-based (Bones) or SDF Layer-based (Layers)
    is_rig = "bones" in arch

    # 2. Resolve Palette
    resolved_palette = palette
    if not resolved_palette:
        resolved_palette = DEFAULT_PALETTES.get(arch_type, DEFAULT_PALETTES.get("humanoid"))

    spec = {
        "name": f"{archetype_id}_{action}_{width}x{height}",
        "label": f"{arch.get('name')} ({width}×{height}) [{frames}f]",
        "author": "PixelDSL Archetype Engine",
        "description": arch.get("description"),
        "width": width,
        "height": height,
        "fps": 8,
        "palette": resolved_palette
    }

    if is_rig:
        spec["type"] = "rig"
        scaled_bones = []
        for b in arch.get("bones", []):
            nb = {}
            nb["id"] = b["id"]
            if "parent" in b:
                nb["parent"] = b["parent"]
            if "u" in b and "v" in b:
                nb["x"] = round(b["u"] * (width - 1), 1)
                nb["y"] = round(b["v"] * (height - 1), 1)
            if "offset_u" in b:
                nb["offset"] = [
                    round(b["offset_u"][0] * scale_factor, 1),
                    round(b["offset_u"][1] * scale_factor, 1)
                ]
            if "length_u" in b:
                nb["length"] = round(b["length_u"] * scale_factor, 1)
            if "angle" in b:
                nb["angle"] = b["angle"]
            if "shape" in b:
                nb["shape"] = b["shape"]

            r_scale = build_scale
            if "head" in b["id"]:
                r_scale *= head_scale

            if "r1_u" in b:
                nb["r1"] = max(0.6, round(b["r1_u"] * scale_factor * r_scale, 1))
            if "r2_u" in b:
                nb["r2"] = max(0.6, round(b["r2_u"] * scale_factor * r_scale, 1))
            if "z" in b:
                nb["z"] = b["z"]
            if "fill" in b:
                nb["fill"] = b["fill"]
            if "features" in b:
                scaled_feats = {}
                for fk, fv in b["features"].items():
                    sf = dict(fv)
                    if "dx_u" in sf:
                        sf["dx"] = round(sf.pop("dx_u") * scale_factor * head_scale, 1)
                    if "dy_u" in sf:
                        sf["dy"] = round(sf.pop("dy_u") * scale_factor * head_scale, 1)
                    if "w_u" in sf:
                        sf["w"] = max(1.0, round(sf.pop("w_u") * scale_factor * head_scale, 1))
                    if "h_u" in sf:
                        sf["h"] = max(1.0, round(sf.pop("h_u") * scale_factor * head_scale, 1))
                    scaled_feats[fk] = sf
                nb["features"] = scaled_feats

            scaled_bones.append(nb)

        spec["rig"] = {
            "outline": outline_mode,
            "outlineWidth": 1 if outline_mode != "none" else 0,
            "bones": scaled_bones
        }

        # Multi-frame Locomotion Kinematics
        loco = arch.get("locomotion", {}).get(action)
        num_frames = frames or (loco.get("default_frames", 8) if loco else 1)
        spec["label"] = f"{arch.get('name')} ({width}×{height}) [{num_frames}f]"
        frames_list = []

        if loco and num_frames > 1:
            for fi in range(num_frames):
                t = fi / float(num_frames)
                t_rad = t * 2.0 * math.pi
                pose_deltas = {}

                if arch_type == "humanoid":
                    hip_sw = loco.get("hip_swing_deg", 26.0)
                    knee_b = loco.get("knee_bend_deg", 35.0)
                    arm_sw = loco.get("arm_swing_deg", 24.0)
                    elb_b = loco.get("elbow_bend_deg", 16.0)
                    bob_amp = loco.get("pelvis_bob_amplitude", 0.025) * height

                    bob_dy = round(-bob_amp * abs(math.sin(t_rad)), 1)
                    pose_deltas["pelvis"] = { "dy": bob_dy }

                    thigh_near = round(hip_sw * math.sin(t_rad), 1)
                    shin_near = round(knee_b * max(0.0, -math.sin(t_rad - 0.2)), 1)
                    pose_deltas["leg_near_thigh"] = { "dAngle": thigh_near }
                    pose_deltas["leg_near_shin"] = { "dAngle": shin_near }

                    thigh_far = round(hip_sw * math.sin(t_rad + math.pi), 1)
                    shin_far = round(knee_b * max(0.0, -math.sin(t_rad + math.pi - 0.2)), 1)
                    pose_deltas["leg_far_thigh"] = { "dAngle": thigh_far }
                    pose_deltas["leg_far_shin"] = { "dAngle": shin_far }

                    arm_near = round(-arm_sw * math.sin(t_rad), 1)
                    elb_near = round(elb_b * max(0.0, math.sin(t_rad)), 1)
                    pose_deltas["arm_near_upper"] = { "dAngle": arm_near }
                    pose_deltas["arm_near_lower"] = { "dAngle": elb_near }

                    arm_far = round(-arm_sw * math.sin(t_rad + math.pi), 1)
                    elb_far = round(elb_b * max(0.0, math.sin(t_rad + math.pi)), 1)
                    pose_deltas["arm_far_upper"] = { "dAngle": arm_far }
                    pose_deltas["arm_far_lower"] = { "dAngle": elb_far }

                elif arch_type == "quadruped_feline":
                    thigh_sw = loco.get("thigh_swing_deg", 22.0)
                    hock_fl = loco.get("hock_flex_deg", 28.0)
                    fore_sw = loco.get("forearm_swing_deg", 24.0)

                    p_hf = loco.get("phase_hind_far", 0.0) * 2.0 * math.pi
                    p_fn = loco.get("phase_fore_near", 0.25) * 2.0 * math.pi
                    p_hn = loco.get("phase_hind_near", 0.50) * 2.0 * math.pi
                    p_ff = loco.get("phase_fore_far", 0.75) * 2.0 * math.pi

                    pose_deltas["hind_thigh_far"] = { "dAngle": round(thigh_sw * math.sin(t_rad + p_hf), 1) }
                    pose_deltas["hind_shin_far"] = { "dAngle": round(hock_fl * max(0.0, -math.sin(t_rad + p_hf)), 1) }
                    pose_deltas["fore_arm_far"] = { "dAngle": round(fore_sw * math.sin(t_rad + p_ff), 1) }

                    pose_deltas["hind_thigh_near"] = { "dAngle": round(thigh_sw * math.sin(t_rad + p_hn), 1) }
                    pose_deltas["hind_shin_near"] = { "dAngle": round(hock_fl * max(0.0, -math.sin(t_rad + p_hn)), 1) }
                    pose_deltas["fore_arm_near"] = { "dAngle": round(fore_sw * math.sin(t_rad + p_fn), 1) }

                    spine_w = round(loco.get("spine_wave_amplitude_deg", 4.5) * math.sin(t_rad * 2.0), 1)
                    pose_deltas["lumbar"] = { "dAngle": spine_w }
                    pose_deltas["chest"] = { "dAngle": -round(spine_w * 0.7, 1) }
                    tail_sw = round(loco.get("tail_sway_amplitude_deg", 8.0) * math.sin(t_rad), 1)
                    pose_deltas["tail_mid"] = { "dAngle": tail_sw }

                elif arch_type == "quadruped_canine":
                    thigh_sw = loco.get("thigh_swing_deg", 28.0)
                    hock_fl = loco.get("hock_flex_deg", 35.0)
                    fore_sw = loco.get("forearm_swing_deg", 32.0)
                    bob_amp = loco.get("pelvis_bob_amplitude", 0.03) * height

                    bob_dy = round(-bob_amp * abs(math.sin(t_rad * 2.0)), 1)
                    pose_deltas["pelvis"] = { "dy": bob_dy }

                    pose_deltas["hind_thigh_far"] = { "dAngle": round(thigh_sw * math.sin(t_rad), 1) }
                    pose_deltas["hind_shin_far"] = { "dAngle": round(hock_fl * max(0.0, -math.sin(t_rad)), 1) }
                    pose_deltas["fore_arm_near"] = { "dAngle": round(fore_sw * math.sin(t_rad), 1) }

                    pose_deltas["hind_thigh_near"] = { "dAngle": round(thigh_sw * math.sin(t_rad + math.pi), 1) }
                    pose_deltas["hind_shin_near"] = { "dAngle": round(hock_fl * max(0.0, -math.sin(t_rad + math.pi)), 1) }
                    pose_deltas["fore_arm_far"] = { "dAngle": round(fore_sw * math.sin(t_rad + math.pi), 1) }

                elif arch_type == "avian_bird":
                    flap_amp = loco.get("wing_flap_amplitude_deg", 48.0)
                    fold_amp = loco.get("wing_fold_amplitude_deg", 28.0)
                    bob_amp = loco.get("torso_bob_amplitude", 0.035) * height

                    wing_flap = round(flap_amp * math.sin(t_rad), 1)
                    wing_fold = round(fold_amp * max(0.0, math.sin(t_rad + 0.5)), 1)
                    pose_deltas["torso"] = { "dy": round(-bob_amp * math.sin(t_rad), 1) }

                    pose_deltas["wing_arm_near"] = { "dAngle": wing_flap }
                    pose_deltas["wing_fore_near"] = { "dAngle": wing_fold }
                    pose_deltas["wing_tip_near"] = { "dAngle": round(wing_fold * 0.7, 1) }

                    pose_deltas["wing_arm_far"] = { "dAngle": wing_flap }
                    pose_deltas["wing_fore_far"] = { "dAngle": wing_fold }
                    pose_deltas["wing_tip_far"] = { "dAngle": round(wing_fold * 0.7, 1) }

                frames_list.append({ "pose": pose_deltas })

        spec["frames"] = frames_list

    else:
        # SDF Layer-based Archetype (Nature, Items, VFX, Tilesets)
        spec["type"] = "layers"
        scaled_layers = []
        for lay in arch.get("layers", []):
            nl = dict(lay)
            # Project normalized coords to pixel space
            if "cx_u" in nl:
                nl["cx"] = round(nl.pop("cx_u") * (width - 1), 1)
            if "cy_u" in nl:
                nl["cy"] = round(nl.pop("cy_u") * (height - 1), 1)
            if "rx_u" in nl:
                nl["rx"] = round(nl.pop("rx_u") * scale_factor, 1)
            if "ry_u" in nl:
                nl["ry"] = round(nl.pop("ry_u") * scale_factor, 1)
            if "r_u" in nl:
                nl["r"] = round(nl.pop("r_u") * scale_factor, 1)
            if "r2_u" in nl:
                nl["r2"] = round(nl.pop("r2_u") * scale_factor, 1)
            if "d_u" in nl:
                nl["d"] = round(nl.pop("d_u") * scale_factor, 1)
            if "x_u" in nl:
                nl["x"] = round(nl.pop("x_u") * (width - 1), 1)
            if "y_u" in nl:
                nl["y"] = round(nl.pop("y_u") * (height - 1), 1)
            if "w_u" in nl:
                nl["w"] = round(nl.pop("w_u") * width, 1)
            if "h_u" in nl:
                nl["h"] = round(nl.pop("h_u") * height, 1)
            if "rx_u" in nl:
                nl["rx"] = round(nl.pop("rx_u") * scale_factor, 1)
            if "x1_u" in nl:
                nl["x1"] = round(nl.pop("x1_u") * (width - 1), 1)
            if "y1_u" in nl:
                nl["y1"] = round(nl.pop("y1_u") * (height - 1), 1)
            if "x2_u" in nl:
                nl["x2"] = round(nl.pop("x2_u") * (width - 1), 1)
            if "y2_u" in nl:
                nl["y2"] = round(nl.pop("y2_u") * (height - 1), 1)
            if "r1_u" in nl:
                nl["r1"] = round(nl.pop("r1_u") * scale_factor, 1)
            if "r2_u" in nl:
                nl["r2"] = round(nl.pop("r2_u") * scale_factor, 1)
            if "points_u" in nl:
                nl["points"] = [
                    [round(p[0] * (width - 1), 1), round(p[1] * (height - 1), 1)]
                    for p in nl.pop("points_u")
                ]

            scaled_layers.append(nl)

        spec["layers"] = scaled_layers
        spec["postProcess"] = {
            "autoOutline": False,
            "outlineColor": "#141824",
            "autoShading": False,
            "sdfShading": True,
            "selOut": False
        }

        # Multi-frame motion for layers if defined
        num_frames = frames or (arch.get("motion", {}).get(action, {}).get("default_frames", 1))
        spec["label"] = f"{arch.get('name')} ({width}×{height}) [{num_frames}f]"
        frames_list = []

        if num_frames > 1 and "motion" in arch:
            mot = arch["motion"].get(action, list(arch["motion"].values())[0])
            for fi in range(num_frames):
                t = fi / float(num_frames)
                t_rad = t * 2.0 * math.pi
                flayers = {}

                # Wind sway for trees/plants
                if "sway_amplitude_u" in mot:
                    sway_px = round(mot["sway_amplitude_u"] * width * math.sin(t_rad), 1)
                    for lay in scaled_layers:
                        if "canopy" in lay["id"] or "top" in lay["id"]:
                            flayers[lay["id"]] = { "dx": sway_px }

                # Vortex spin for orbs / VFX
                if "rotate_corona_deg" in mot:
                    rot_deg = round(mot["rotate_corona_deg"] * math.sin(t_rad), 1)
                    for lay in scaled_layers:
                        if "corona" in lay["id"] or "flare" in lay["id"]:
                            flayers[lay["id"]] = { "dAngle": rot_deg }

                frames_list.append({ "layers": flayers })

        spec["frames"] = frames_list

    return spec

def main():
    parser = argparse.ArgumentParser(description="PixelDSL Universal Archetype Compiler Engine")
    parser.add_argument("--archetype", default="humanoid", help="Archetype ID (e.g. humanoid, tree_deciduous, weapon_sword, potion_bottle, projectile_orb)")
    parser.add_argument("--size", default="48x48", help="Target size WxH (e.g. 32x32, 48x48, 64x64)")
    parser.add_argument("--action", default="walk", help="Action (walk, run, trot, flight, wind_sway, vortex_spin, idle)")
    parser.add_argument("--frames", type=int, default=1, help="Number of animation frames")
    parser.add_argument("--head-scale", type=float, default=1.0, help="Head proportion multiplier")
    parser.add_argument("--build-scale", type=float, default=1.0, help="Body build thickness multiplier")
    parser.add_argument("--list", action="store_true", help="List all available archetypes by category")
    parser.add_argument("--out-dir", default="scratch", help="Output directory")

    args = parser.parse_args()

    if args.list:
        archs = list_all_archetypes()
        print("Available PixelDSL Archetypes:")
        for cat, items in archs.items():
            print(f"  [{cat.upper()}]: {', '.join(items)}")
        return

    parts = [int(p) for p in args.size.lower().split("x")]
    w, h = parts[0], parts[1]

    spec = compile_archetype(
        archetype_id=args.archetype,
        width=w,
        height=h,
        action=args.action,
        frames=args.frames,
        head_scale=args.head_scale,
        build_scale=args.build_scale
    )

    out_base = os.path.join(args.out_dir, spec["name"])
    json_path = f"{out_base}.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(spec, f, indent=2)
    print(f"Generated Archetype Spec: {json_path}")

    # Render frame 0 preview
    res0 = render_sprite(spec, frame_index=0)
    write_png(f"{out_base}_preview.png", w, h, res0["buffer"])
    write_png(f"{out_base}_normal.png", w, h, res0["normal_buffer"])
    print(f"Rendered Preview: {out_base}_preview.png ({w}x{h})")

    # Render sprite sheet if multi-frame
    if args.frames > 1:
        sheet_w = w * args.frames
        sheet_h = h
        sheet_buf = bytearray(sheet_w * sheet_h * 4)
        for fi in range(args.frames):
            res_fi = render_sprite(spec, frame_index=fi)
            f_buf = res_fi["buffer"]
            for y in range(h):
                for x in range(w):
                    s_idx = (y * sheet_w + (fi * w + x)) * 4
                    f_idx_pix = (y * w + x) * 4
                    sheet_buf[s_idx:s_idx + 4] = f_buf[f_idx_pix:f_idx_pix + 4]
        write_png(f"{out_base}_sheet.png", sheet_w, sheet_h, sheet_buf)
        print(f"Rendered {args.frames}-frame sheet: {out_base}_sheet.png ({sheet_w}x{sheet_h})")

if __name__ == "__main__":
    main()
