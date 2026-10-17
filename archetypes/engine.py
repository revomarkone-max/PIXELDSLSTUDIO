import sys
import os
import math
import json
import argparse

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)) + "/..")
from pixeldsl import render_sprite, write_png

ARCHETYPES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "creatures")

# Built-in Default Palettes for Archetype Instant Theming
DEFAULT_PALETTES = {
    "humanoid_adventurer": {
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
    "tiger_feline": {
        ".": "transparent",
        "O": "#1c140a",
        "fur": "#ea580c",
        "fur_dark": "#9a3412",
        "white": "#fed7aa",
        "white_dark": "#fdba74"
    },
    "wolf_canine": {
        ".": "transparent",
        "O": "#15181e",
        "fur": "#64748b",
        "fur_dark": "#334155",
        "fur_light": "#cbd5e1",
        "dark": "#0f172a"
    },
    "eagle_avian": {
        ".": "transparent",
        "O": "#1a1612",
        "feathers": "#593318",
        "feathers_dark": "#382010",
        "feathers_light": "#804c27",
        "gold": "#eab308"
    }
}

def load_archetype(name_or_path):
    if os.path.isfile(name_or_path):
        with open(name_or_path, "r", encoding="utf-8") as f:
            return json.load(f)
    candidate = os.path.join(ARCHETYPES_DIR, f"{name_or_path}.json")
    if os.path.isfile(candidate):
        with open(candidate, "r", encoding="utf-8") as f:
            return json.load(f)
    raise FileNotFoundError(f"Archetype '{name_or_path}' not found in {ARCHETYPES_DIR}")

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

    # 1. Project Normalized Bones to Pixel Space
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

        # Parametric width scaling
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

    # 2. Procedural Locomotion Kinematics
    loco = arch.get("locomotion", {}).get(action)
    num_frames = frames or (loco.get("default_frames", 8) if loco else 1)
    frames_list = []

    if loco and num_frames > 1:
        arch_type = arch.get("id")

        for fi in range(num_frames):
            t = fi / float(num_frames)
            t_rad = t * 2.0 * math.pi
            pose_deltas = {}

            if arch_type == "humanoid":
                # Dual-pendulum human gait
                hip_sw = loco.get("hip_swing_deg", 26.0)
                knee_b = loco.get("knee_bend_deg", 35.0)
                arm_sw = loco.get("arm_swing_deg", 24.0)
                elb_b = loco.get("elbow_bend_deg", 16.0)
                bob_amp = loco.get("pelvis_bob_amplitude", 0.025) * height

                # Contact bounce
                bob_dy = round(-bob_amp * abs(math.sin(t_rad)), 1)
                pose_deltas["pelvis"] = { "dy": bob_dy }

                # Near leg (phase 0)
                thigh_near = round(hip_sw * math.sin(t_rad), 1)
                shin_near = round(knee_b * max(0.0, -math.sin(t_rad - 0.2)), 1)
                pose_deltas["leg_near_thigh"] = { "dAngle": thigh_near }
                pose_deltas["leg_near_shin"] = { "dAngle": shin_near }

                # Far leg (phase pi)
                thigh_far = round(hip_sw * math.sin(t_rad + math.pi), 1)
                shin_far = round(knee_b * max(0.0, -math.sin(t_rad + math.pi - 0.2)), 1)
                pose_deltas["leg_far_thigh"] = { "dAngle": thigh_far }
                pose_deltas["leg_far_shin"] = { "dAngle": shin_far }

                # Arms counter-swing (phase opposite to legs)
                arm_near = round(-arm_sw * math.sin(t_rad), 1)
                elb_near = round(elb_b * max(0.0, math.sin(t_rad)), 1)
                pose_deltas["arm_near_upper"] = { "dAngle": arm_near }
                pose_deltas["arm_near_lower"] = { "dAngle": elb_near }

                arm_far = round(-arm_sw * math.sin(t_rad + math.pi), 1)
                elb_far = round(elb_b * max(0.0, math.sin(t_rad + math.pi)), 1)
                pose_deltas["arm_far_upper"] = { "dAngle": arm_far }
                pose_deltas["arm_far_lower"] = { "dAngle": elb_far }

            elif arch_type == "quadruped_feline":
                # Hildebrand lateral walk / stalking gait
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

                # Flexible spine undulation
                spine_w = round(loco.get("spine_wave_amplitude_deg", 4.5) * math.sin(t_rad * 2.0), 1)
                pose_deltas["lumbar"] = { "dAngle": spine_w }
                pose_deltas["chest"] = { "dAngle": -round(spine_w * 0.7, 1) }
                tail_sw = round(loco.get("tail_sway_amplitude_deg", 8.0) * math.sin(t_rad), 1)
                pose_deltas["tail_mid"] = { "dAngle": tail_sw }

            elif arch_type == "quadruped_canine":
                # Diagonal trot gait
                thigh_sw = loco.get("thigh_swing_deg", 28.0)
                hock_fl = loco.get("hock_flex_deg", 35.0)
                fore_sw = loco.get("forearm_swing_deg", 32.0)
                bob_amp = loco.get("pelvis_bob_amplitude", 0.03) * height

                bob_dy = round(-bob_amp * abs(math.sin(t_rad * 2.0)), 1)
                pose_deltas["pelvis"] = { "dy": bob_dy }

                # Diagonal Pair 1: Hind Far + Fore Near (phase 0)
                pose_deltas["hind_thigh_far"] = { "dAngle": round(thigh_sw * math.sin(t_rad), 1) }
                pose_deltas["hind_shin_far"] = { "dAngle": round(hock_fl * max(0.0, -math.sin(t_rad)), 1) }
                pose_deltas["fore_arm_near"] = { "dAngle": round(fore_sw * math.sin(t_rad), 1) }

                # Diagonal Pair 2: Hind Near + Fore Far (phase pi)
                pose_deltas["hind_thigh_near"] = { "dAngle": round(thigh_sw * math.sin(t_rad + math.pi), 1) }
                pose_deltas["hind_shin_near"] = { "dAngle": round(hock_fl * max(0.0, -math.sin(t_rad + math.pi)), 1) }
                pose_deltas["fore_arm_far"] = { "dAngle": round(fore_sw * math.sin(t_rad + math.pi), 1) }

            elif arch_type == "avian_bird":
                # Flapping flight cycle
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

    # 3. Resolve Theme Palette
    resolved_palette = palette
    if not resolved_palette:
        if archetype_id == "humanoid":
            resolved_palette = DEFAULT_PALETTES["humanoid_adventurer"]
        elif archetype_id == "quadruped_feline":
            resolved_palette = DEFAULT_PALETTES["tiger_feline"]
        elif archetype_id == "quadruped_canine":
            resolved_palette = DEFAULT_PALETTES["wolf_canine"]
        elif archetype_id == "avian_bird":
            resolved_palette = DEFAULT_PALETTES["eagle_avian"]
        else:
            resolved_palette = DEFAULT_PALETTES["humanoid_adventurer"]

    # 4. Construct Final PixelDSL Rig Spec
    spec = {
        "type": "rig",
        "name": f"{archetype_id}_{action}_{width}x{height}",
        "label": f"{arch.get('name')} ({width}×{height}) [{num_frames}f]",
        "author": "PixelDSL Archetype Engine",
        "description": arch.get("description"),
        "width": width,
        "height": height,
        "fps": 8,
        "palette": resolved_palette,
        "rig": {
            "outline": outline_mode,
            "outlineWidth": 1 if outline_mode != "none" else 0,
            "bones": scaled_bones
        },
        "frames": frames_list
    }

    return spec

def main():
    parser = argparse.ArgumentParser(description="PixelDSL Archetype Compiler Engine")
    parser.add_argument("--archetype", default="humanoid", choices=["humanoid", "quadruped_feline", "quadruped_canine", "avian_bird"], help="Archetype ID")
    parser.add_argument("--size", default="48x48", help="Target size WxH (e.g. 32x32, 48x48, 64x64)")
    parser.add_argument("--action", default="walk", help="Action (walk, run, trot, flight, idle)")
    parser.add_argument("--frames", type=int, default=8, help="Number of animation frames")
    parser.add_argument("--head-scale", type=float, default=1.0, help="Head proportion multiplier (0.75=realistic, 1.0=standard/heroic, 1.4=retro, 2.0=chibi)")
    parser.add_argument("--build-scale", type=float, default=1.0, help="Body build thickness multiplier")
    parser.add_argument("--out-dir", default="scratch", help="Output directory")

    args = parser.parse_args()
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
