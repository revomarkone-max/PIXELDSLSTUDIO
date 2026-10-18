// PixelDSL Studio v3.0 — Archetypes Engine & Mathematical Blueprint Registry
// Zero-dependency client-side procedural generator for all 10 normalized archetypes.

if (typeof window === "undefined") { global.window = global; }

window.ARCHETYPE_REGISTRY = {
  "avian_bird": {
    "id": "avian_bird",
    "name": "Avian Bird (Eagle / Hawk / Raven)",
    "category": "creatures",
    "description": "Parametric avian skeleton with 3-segment articulating wings, aerodynamic core, 3-tier Z-depth, and harmonic flight flap cycle.",
    "default_view": "side",
    "canonical_proportions": {
      "body_length_ratio": 0.36,
      "wingspan_ratio": 0.78,
      "head_size_ratio": 0.14,
      "beak_length_ratio": 0.08,
      "tail_length_ratio": 0.26
    },
    "z_depth_tiers": {
      "0_back": {
        "name": "Far Wing (Shadowed)",
        "z": 0,
        "tone": "shadow",
        "bones": [
          "wing_arm_far",
          "wing_fore_far",
          "wing_tip_far"
        ]
      },
      "1_core": {
        "name": "Mid Core (Torso, Tail, Neck, Head, Beak)",
        "z": 1,
        "tone": "base",
        "bones": [
          "torso",
          "chest",
          "tail",
          "neck",
          "head",
          "beak"
        ]
      },
      "2_front": {
        "name": "Near Wing (Illuminated/Creased)",
        "z": 2,
        "tone": "highlight",
        "crease": true,
        "bones": [
          "wing_arm_near",
          "wing_fore_near",
          "wing_tip_near"
        ]
      }
    },
    "bones": [
      {
        "id": "torso",
        "u": 0.44,
        "v": 0.52,
        "length_u": 0.16,
        "angle": 12,
        "r1_u": 0.085,
        "r2_u": 0.095,
        "z": 1,
        "fill": "feathers"
      },
      {
        "id": "chest",
        "parent": "torso",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.12,
        "angle": -25,
        "r1_u": 0.095,
        "r2_u": 0.08,
        "z": 1,
        "fill": "feathers"
      },
      {
        "id": "tail",
        "parent": "torso",
        "offset_u": [
          -0.07,
          0.02
        ],
        "length_u": 0.16,
        "angle": 160,
        "r1_u": 0.065,
        "r2_u": 0.035,
        "z": 1,
        "fill": "feathers_dark"
      },
      {
        "id": "neck",
        "parent": "chest",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.08,
        "angle": -45,
        "r1_u": 0.065,
        "r2_u": 0.055,
        "z": 1,
        "fill": "feathers"
      },
      {
        "id": "head",
        "parent": "neck",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.0,
        "shape": "head_oval",
        "r1_u": 0.075,
        "r2_u": 0.07,
        "z": 1,
        "fill": "feathers",
        "features": {
          "eyes": {
            "dx_u": 0.03,
            "dy_u": -0.015,
            "w_u": 0.022,
            "h_u": 0.03,
            "color": "#fbbf24"
          }
        }
      },
      {
        "id": "beak",
        "parent": "head",
        "offset_u": [
          0.045,
          0.01
        ],
        "length_u": 0.065,
        "angle": 25,
        "r1_u": 0.035,
        "r2_u": 0.01,
        "z": 1,
        "fill": "gold"
      },
      {
        "id": "wing_arm_far",
        "parent": "chest",
        "offset_u": [
          -0.02,
          -0.04
        ],
        "length_u": 0.16,
        "angle": -120,
        "r1_u": 0.06,
        "r2_u": 0.05,
        "z": 0,
        "fill": "feathers_dark"
      },
      {
        "id": "wing_fore_far",
        "parent": "wing_arm_far",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.2,
        "angle": 45,
        "r1_u": 0.05,
        "r2_u": 0.04,
        "z": 0,
        "fill": "feathers_dark"
      },
      {
        "id": "wing_tip_far",
        "parent": "wing_fore_far",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.18,
        "angle": 30,
        "r1_u": 0.04,
        "r2_u": 0.018,
        "z": 0,
        "fill": "feathers_dark"
      },
      {
        "id": "wing_arm_near",
        "parent": "chest",
        "offset_u": [
          0.02,
          -0.04
        ],
        "length_u": 0.16,
        "angle": -120,
        "r1_u": 0.065,
        "r2_u": 0.052,
        "z": 2,
        "fill": "feathers"
      },
      {
        "id": "wing_fore_near",
        "parent": "wing_arm_near",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.2,
        "angle": 45,
        "r1_u": 0.052,
        "r2_u": 0.042,
        "z": 2,
        "fill": "feathers"
      },
      {
        "id": "wing_tip_near",
        "parent": "wing_fore_near",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.18,
        "angle": 30,
        "r1_u": 0.042,
        "r2_u": 0.02,
        "z": 2,
        "fill": "feathers_light"
      }
    ],
    "locomotion": {
      "flight": {
        "default_frames": 6,
        "cadence_type": "wing_flap",
        "wing_flap_amplitude_deg": 48.0,
        "wing_fold_amplitude_deg": 28.0,
        "torso_bob_amplitude": 0.035
      }
    }
  },
  "humanoid": {
    "id": "humanoid",
    "name": "Universal Humanoid Biped",
    "category": "creatures",
    "description": "Parametric bipedal humanoid skeleton with 3-tier Z-depth (Far/Core/Near), adjustable head-to-body proportion, and dual-pendulum arm/leg locomotion kinematics.",
    "default_view": "side",
    "canonical_proportions": {
      "head_ratio": 0.22,
      "torso_ratio": 0.22,
      "leg_ratio": 0.38,
      "arm_ratio": 0.32,
      "shoulder_half_width": 0.06,
      "hip_half_width": 0.045
    },
    "z_depth_tiers": {
      "0_back": {
        "name": "Far Limbs (Occluded/Shadowed)",
        "z": 0,
        "tone": "shadow",
        "bones": [
          "arm_far_upper",
          "arm_far_lower",
          "leg_far_thigh",
          "leg_far_shin",
          "foot_far"
        ]
      },
      "1_core": {
        "name": "Mid Core (Spine/Head/Torso)",
        "z": 1,
        "tone": "base",
        "bones": [
          "pelvis",
          "torso",
          "chest",
          "neck",
          "head"
        ]
      },
      "2_front": {
        "name": "Near Limbs (Illuminated/Creased)",
        "z": 2,
        "tone": "highlight",
        "crease": true,
        "bones": [
          "arm_near_upper",
          "arm_near_lower",
          "leg_near_thigh",
          "leg_near_shin",
          "foot_near"
        ]
      }
    },
    "bones": [
      {
        "id": "pelvis",
        "u": 0.48,
        "v": 0.52,
        "length_u": 0.05,
        "angle": -90,
        "r1_u": 0.075,
        "r2_u": 0.075,
        "z": 1,
        "fill": "clothes_dark"
      },
      {
        "id": "torso",
        "parent": "pelvis",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.1,
        "angle": 0,
        "r1_u": 0.075,
        "r2_u": 0.085,
        "z": 1,
        "fill": "clothes"
      },
      {
        "id": "chest",
        "parent": "torso",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.08,
        "angle": 0,
        "r1_u": 0.085,
        "r2_u": 0.08,
        "z": 1,
        "fill": "clothes"
      },
      {
        "id": "neck",
        "parent": "chest",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.09,
        "angle": 0,
        "r1_u": 0.045,
        "r2_u": 0.045,
        "z": 1,
        "fill": "skin"
      },
      {
        "id": "head",
        "parent": "neck",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.0,
        "shape": "head_oval",
        "r1_u": 0.095,
        "r2_u": 0.085,
        "z": 1,
        "fill": "skin",
        "features": {
          "eyes": {
            "dx_u": 0.04,
            "dy_u": -0.01,
            "w_u": 0.025,
            "h_u": 0.035,
            "color": "#1b2128"
          }
        }
      },
      {
        "id": "arm_far_upper",
        "parent": "chest",
        "offset_u": [
          -0.02,
          0.01
        ],
        "length_u": 0.13,
        "angle": 175,
        "r1_u": 0.038,
        "r2_u": 0.034,
        "z": 0,
        "fill": "clothes_dark"
      },
      {
        "id": "arm_far_lower",
        "parent": "arm_far_upper",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.11,
        "angle": 10,
        "r1_u": 0.034,
        "r2_u": 0.03,
        "z": 0,
        "fill": "skin_dark"
      },
      {
        "id": "arm_near_upper",
        "parent": "chest",
        "offset_u": [
          0.02,
          0.01
        ],
        "length_u": 0.13,
        "angle": 175,
        "r1_u": 0.04,
        "r2_u": 0.035,
        "z": 2,
        "fill": "clothes"
      },
      {
        "id": "arm_near_lower",
        "parent": "arm_near_upper",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.11,
        "angle": 10,
        "r1_u": 0.035,
        "r2_u": 0.03,
        "z": 2,
        "fill": "skin"
      },
      {
        "id": "leg_far_thigh",
        "parent": "pelvis",
        "offset_u": [
          -0.025,
          0.0
        ],
        "length_u": 0.16,
        "angle": 180,
        "r1_u": 0.052,
        "r2_u": 0.042,
        "z": 0,
        "fill": "pants_dark"
      },
      {
        "id": "leg_far_shin",
        "parent": "leg_far_thigh",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.15,
        "angle": 0,
        "r1_u": 0.042,
        "r2_u": 0.034,
        "z": 0,
        "fill": "pants_dark"
      },
      {
        "id": "foot_far",
        "parent": "leg_far_shin",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.05,
        "angle": -75,
        "r1_u": 0.034,
        "r2_u": 0.028,
        "z": 0,
        "fill": "shoes_dark"
      },
      {
        "id": "leg_near_thigh",
        "parent": "pelvis",
        "offset_u": [
          0.025,
          0.0
        ],
        "length_u": 0.16,
        "angle": 180,
        "r1_u": 0.055,
        "r2_u": 0.045,
        "z": 2,
        "fill": "pants"
      },
      {
        "id": "leg_near_shin",
        "parent": "leg_near_thigh",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.15,
        "angle": 0,
        "r1_u": 0.045,
        "r2_u": 0.036,
        "z": 2,
        "fill": "pants"
      },
      {
        "id": "foot_near",
        "parent": "leg_near_shin",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.05,
        "angle": -75,
        "r1_u": 0.036,
        "r2_u": 0.03,
        "z": 2,
        "fill": "shoes"
      }
    ],
    "locomotion": {
      "walk": {
        "default_frames": 8,
        "pelvis_bob_amplitude": 0.025,
        "hip_swing_deg": 26.0,
        "knee_bend_deg": 35.0,
        "arm_swing_deg": 24.0,
        "elbow_bend_deg": 16.0,
        "phase_near_leg": 0.0,
        "phase_far_leg": 0.5,
        "phase_near_arm": 0.5,
        "phase_far_arm": 0.0
      },
      "run": {
        "default_frames": 8,
        "pelvis_bob_amplitude": 0.045,
        "torso_lean_deg": 10.0,
        "hip_swing_deg": 42.0,
        "knee_bend_deg": 58.0,
        "arm_swing_deg": 45.0,
        "elbow_bend_deg": 32.0,
        "phase_near_leg": 0.0,
        "phase_far_leg": 0.5,
        "phase_near_arm": 0.5,
        "phase_far_arm": 0.0
      },
      "idle": {
        "default_frames": 4,
        "breathe_scale_y": 0.02,
        "arm_sway_deg": 2.5
      }
    }
  },
  "quadruped_canine": {
    "id": "quadruped_canine",
    "name": "Quadruped Canine (Wolf / Dog / Fox)",
    "category": "creatures",
    "description": "Biomechanical quadruped canine skeleton with deep chest, elongated snout, pricked ears, bushy tail, 3-tier Z-depth, and diagonal trot kinematics.",
    "default_view": "side",
    "canonical_proportions": {
      "spine_length_ratio": 0.44,
      "shoulder_height_ratio": 0.46,
      "head_size_ratio": 0.17,
      "snout_length_ratio": 0.08,
      "tail_length_ratio": 0.32
    },
    "z_depth_tiers": {
      "0_back": {
        "name": "Far Limbs & Far Ear (Shadowed)",
        "z": 0,
        "tone": "shadow",
        "bones": [
          "hind_thigh_far",
          "hind_shin_far",
          "hind_paw_far",
          "fore_arm_far",
          "fore_paw_far",
          "ear_far"
        ]
      },
      "1_core": {
        "name": "Mid Core (Pelvis, Spine, Chest, Neck, Head, Snout, Tail)",
        "z": 1,
        "tone": "base",
        "bones": [
          "pelvis",
          "lumbar",
          "chest",
          "neck",
          "head",
          "snout",
          "nose",
          "tail_base",
          "tail_mid",
          "tail_tip"
        ]
      },
      "2_front": {
        "name": "Near Limbs & Near Ear (Illuminated/Creased)",
        "z": 2,
        "tone": "highlight",
        "crease": true,
        "bones": [
          "hind_thigh_near",
          "hind_shin_near",
          "hind_paw_near",
          "fore_arm_near",
          "fore_paw_near",
          "ear_near"
        ]
      }
    },
    "bones": [
      {
        "id": "pelvis",
        "u": 0.38,
        "v": 0.5,
        "length_u": 0.08,
        "angle": 12,
        "r1_u": 0.08,
        "r2_u": 0.075,
        "z": 1,
        "fill": "fur"
      },
      {
        "id": "lumbar",
        "parent": "pelvis",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.13,
        "angle": -10,
        "r1_u": 0.075,
        "r2_u": 0.08,
        "z": 1,
        "fill": "fur"
      },
      {
        "id": "chest",
        "parent": "lumbar",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.15,
        "angle": -16,
        "r1_u": 0.09,
        "r2_u": 0.105,
        "z": 1,
        "fill": "fur"
      },
      {
        "id": "neck",
        "parent": "chest",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.09,
        "angle": -48,
        "r1_u": 0.075,
        "r2_u": 0.07,
        "z": 1,
        "fill": "fur"
      },
      {
        "id": "head",
        "parent": "neck",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.0,
        "shape": "head_oval",
        "r1_u": 0.09,
        "r2_u": 0.085,
        "z": 1,
        "fill": "fur",
        "features": {
          "eyes": {
            "dx_u": 0.035,
            "dy_u": -0.015,
            "w_u": 0.025,
            "h_u": 0.035,
            "color": "#f59e0b"
          }
        }
      },
      {
        "id": "snout",
        "parent": "head",
        "offset_u": [
          0.045,
          0.01
        ],
        "length_u": 0.065,
        "angle": 10,
        "r1_u": 0.045,
        "r2_u": 0.03,
        "z": 1,
        "fill": "fur"
      },
      {
        "id": "nose",
        "parent": "snout",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.02,
        "angle": 0,
        "r1_u": 0.025,
        "r2_u": 0.02,
        "z": 1,
        "fill": "dark"
      },
      {
        "id": "ear_far",
        "parent": "head",
        "offset_u": [
          -0.02,
          -0.075
        ],
        "length_u": 0.065,
        "angle": -80,
        "r1_u": 0.032,
        "r2_u": 0.01,
        "z": 0,
        "fill": "fur_dark"
      },
      {
        "id": "ear_near",
        "parent": "head",
        "offset_u": [
          0.025,
          -0.075
        ],
        "length_u": 0.07,
        "angle": -75,
        "r1_u": 0.035,
        "r2_u": 0.012,
        "z": 2,
        "fill": "fur"
      },
      {
        "id": "tail_base",
        "parent": "pelvis",
        "offset_u": [
          -0.05,
          -0.01
        ],
        "length_u": 0.11,
        "angle": 140,
        "r1_u": 0.05,
        "r2_u": 0.055,
        "z": 1,
        "fill": "fur"
      },
      {
        "id": "tail_mid",
        "parent": "tail_base",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.12,
        "angle": 15,
        "r1_u": 0.055,
        "r2_u": 0.048,
        "z": 1,
        "fill": "fur"
      },
      {
        "id": "tail_tip",
        "parent": "tail_mid",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.08,
        "angle": 10,
        "r1_u": 0.048,
        "r2_u": 0.025,
        "z": 1,
        "fill": "fur_light"
      },
      {
        "id": "hind_thigh_far",
        "parent": "pelvis",
        "offset_u": [
          -0.02,
          0.02
        ],
        "length_u": 0.17,
        "angle": 110,
        "r1_u": 0.07,
        "r2_u": 0.046,
        "z": 0,
        "fill": "fur_dark"
      },
      {
        "id": "hind_shin_far",
        "parent": "hind_thigh_far",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.16,
        "angle": -55,
        "r1_u": 0.044,
        "r2_u": 0.034,
        "z": 0,
        "fill": "fur_dark"
      },
      {
        "id": "hind_paw_far",
        "parent": "hind_shin_far",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.065,
        "angle": 60,
        "r1_u": 0.034,
        "r2_u": 0.032,
        "z": 0,
        "fill": "fur_dark"
      },
      {
        "id": "fore_arm_far",
        "parent": "chest",
        "offset_u": [
          -0.02,
          0.05
        ],
        "length_u": 0.2,
        "angle": 88,
        "r1_u": 0.05,
        "r2_u": 0.036,
        "z": 0,
        "fill": "fur_dark"
      },
      {
        "id": "fore_paw_far",
        "parent": "fore_arm_far",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.07,
        "angle": 12,
        "r1_u": 0.036,
        "r2_u": 0.032,
        "z": 0,
        "fill": "fur_dark"
      },
      {
        "id": "hind_thigh_near",
        "parent": "pelvis",
        "offset_u": [
          0.02,
          0.02
        ],
        "length_u": 0.17,
        "angle": 110,
        "r1_u": 0.075,
        "r2_u": 0.05,
        "z": 2,
        "fill": "fur"
      },
      {
        "id": "hind_shin_near",
        "parent": "hind_thigh_near",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.16,
        "angle": -55,
        "r1_u": 0.046,
        "r2_u": 0.036,
        "z": 2,
        "fill": "fur"
      },
      {
        "id": "hind_paw_near",
        "parent": "hind_shin_near",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.065,
        "angle": 60,
        "r1_u": 0.036,
        "r2_u": 0.034,
        "z": 2,
        "fill": "fur"
      },
      {
        "id": "fore_arm_near",
        "parent": "chest",
        "offset_u": [
          0.02,
          0.05
        ],
        "length_u": 0.2,
        "angle": 88,
        "r1_u": 0.054,
        "r2_u": 0.038,
        "z": 2,
        "fill": "fur"
      },
      {
        "id": "fore_paw_near",
        "parent": "fore_arm_near",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.07,
        "angle": 12,
        "r1_u": 0.038,
        "r2_u": 0.034,
        "z": 2,
        "fill": "fur"
      }
    ],
    "locomotion": {
      "trot": {
        "default_frames": 8,
        "cadence_type": "diagonal_trot",
        "phase_hind_far": 0.0,
        "phase_fore_near": 0.0,
        "phase_hind_near": 0.5,
        "phase_fore_far": 0.5,
        "thigh_swing_deg": 28.0,
        "hock_flex_deg": 35.0,
        "forearm_swing_deg": 32.0,
        "pelvis_bob_amplitude": 0.03
      },
      "run": {
        "default_frames": 8,
        "cadence_type": "rotary_gallop",
        "phase_hind_far": 0.0,
        "phase_hind_near": 0.15,
        "phase_fore_far": 0.5,
        "phase_fore_near": 0.65,
        "thigh_swing_deg": 45.0,
        "hock_flex_deg": 52.0,
        "forearm_swing_deg": 48.0,
        "pelvis_bob_amplitude": 0.06
      }
    }
  },
  "quadruped_feline": {
    "id": "quadruped_feline",
    "name": "Quadruped Feline (Cat / Tiger / Leopard)",
    "category": "creatures",
    "description": "Biomechanical quadruped feline skeleton with flexible spine, digitigrade limbs, 3-tier Z-depth, and Hildebrand lateral walk cadence.",
    "default_view": "side",
    "canonical_proportions": {
      "spine_length_ratio": 0.45,
      "shoulder_height_ratio": 0.42,
      "head_size_ratio": 0.16,
      "tail_length_ratio": 0.38
    },
    "z_depth_tiers": {
      "0_back": {
        "name": "Far Limbs & Far Ear (Shadowed)",
        "z": 0,
        "tone": "shadow",
        "bones": [
          "hind_thigh_far",
          "hind_shin_far",
          "hind_paw_far",
          "fore_arm_far",
          "fore_paw_far",
          "ear_far"
        ]
      },
      "1_core": {
        "name": "Mid Core (Pelvis, Spine, Chest, Neck, Head, Tail)",
        "z": 1,
        "tone": "base",
        "bones": [
          "pelvis",
          "lumbar",
          "chest",
          "neck",
          "head",
          "muzzle",
          "tail_base",
          "tail_mid",
          "tail_tip"
        ]
      },
      "2_front": {
        "name": "Near Limbs & Near Ear (Illuminated/Creased)",
        "z": 2,
        "tone": "highlight",
        "crease": true,
        "bones": [
          "hind_thigh_near",
          "hind_shin_near",
          "hind_paw_near",
          "fore_arm_near",
          "fore_paw_near",
          "ear_near"
        ]
      }
    },
    "bones": [
      {
        "id": "pelvis",
        "u": 0.38,
        "v": 0.52,
        "length_u": 0.08,
        "angle": 10,
        "r1_u": 0.085,
        "r2_u": 0.08,
        "z": 1,
        "fill": "fur"
      },
      {
        "id": "lumbar",
        "parent": "pelvis",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.14,
        "angle": -8,
        "r1_u": 0.08,
        "r2_u": 0.075,
        "z": 1,
        "fill": "fur"
      },
      {
        "id": "chest",
        "parent": "lumbar",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.14,
        "angle": -15,
        "r1_u": 0.085,
        "r2_u": 0.095,
        "z": 1,
        "fill": "fur"
      },
      {
        "id": "neck",
        "parent": "chest",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.09,
        "angle": -45,
        "r1_u": 0.07,
        "r2_u": 0.065,
        "z": 1,
        "fill": "fur"
      },
      {
        "id": "head",
        "parent": "neck",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.0,
        "shape": "head_oval",
        "r1_u": 0.085,
        "r2_u": 0.085,
        "z": 1,
        "fill": "fur",
        "features": {
          "eyes": {
            "dx_u": 0.035,
            "dy_u": -0.015,
            "w_u": 0.025,
            "h_u": 0.035,
            "color": "#22c55e"
          }
        }
      },
      {
        "id": "muzzle",
        "parent": "head",
        "offset_u": [
          0.045,
          0.02
        ],
        "length_u": 0.035,
        "angle": 15,
        "r1_u": 0.04,
        "r2_u": 0.03,
        "z": 1,
        "fill": "white"
      },
      {
        "id": "ear_far",
        "parent": "head",
        "offset_u": [
          -0.02,
          -0.07
        ],
        "length_u": 0.05,
        "angle": -75,
        "r1_u": 0.032,
        "r2_u": 0.012,
        "z": 0,
        "fill": "fur_dark"
      },
      {
        "id": "ear_near",
        "parent": "head",
        "offset_u": [
          0.02,
          -0.07
        ],
        "length_u": 0.055,
        "angle": -70,
        "r1_u": 0.034,
        "r2_u": 0.014,
        "z": 2,
        "fill": "fur"
      },
      {
        "id": "tail_base",
        "parent": "pelvis",
        "offset_u": [
          -0.05,
          -0.02
        ],
        "length_u": 0.12,
        "angle": -135,
        "r1_u": 0.04,
        "r2_u": 0.035,
        "z": 1,
        "fill": "fur"
      },
      {
        "id": "tail_mid",
        "parent": "tail_base",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.14,
        "angle": 45,
        "r1_u": 0.035,
        "r2_u": 0.032,
        "z": 1,
        "fill": "fur"
      },
      {
        "id": "tail_tip",
        "parent": "tail_mid",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.09,
        "angle": 40,
        "r1_u": 0.032,
        "r2_u": 0.022,
        "z": 1,
        "fill": "white"
      },
      {
        "id": "hind_thigh_far",
        "parent": "pelvis",
        "offset_u": [
          -0.02,
          0.02
        ],
        "length_u": 0.15,
        "angle": 110,
        "r1_u": 0.065,
        "r2_u": 0.045,
        "z": 0,
        "fill": "fur_dark"
      },
      {
        "id": "hind_shin_far",
        "parent": "hind_thigh_far",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.14,
        "angle": -60,
        "r1_u": 0.042,
        "r2_u": 0.032,
        "z": 0,
        "fill": "fur_dark"
      },
      {
        "id": "hind_paw_far",
        "parent": "hind_shin_far",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.06,
        "angle": 65,
        "r1_u": 0.032,
        "r2_u": 0.032,
        "z": 0,
        "fill": "white_dark"
      },
      {
        "id": "fore_arm_far",
        "parent": "chest",
        "offset_u": [
          -0.02,
          0.04
        ],
        "length_u": 0.18,
        "angle": 85,
        "r1_u": 0.048,
        "r2_u": 0.035,
        "z": 0,
        "fill": "fur_dark"
      },
      {
        "id": "fore_paw_far",
        "parent": "fore_arm_far",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.07,
        "angle": 15,
        "r1_u": 0.035,
        "r2_u": 0.032,
        "z": 0,
        "fill": "white_dark"
      },
      {
        "id": "hind_thigh_near",
        "parent": "pelvis",
        "offset_u": [
          0.02,
          0.02
        ],
        "length_u": 0.15,
        "angle": 110,
        "r1_u": 0.07,
        "r2_u": 0.048,
        "z": 2,
        "fill": "fur"
      },
      {
        "id": "hind_shin_near",
        "parent": "hind_thigh_near",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.14,
        "angle": -60,
        "r1_u": 0.045,
        "r2_u": 0.034,
        "z": 2,
        "fill": "fur"
      },
      {
        "id": "hind_paw_near",
        "parent": "hind_shin_near",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.06,
        "angle": 65,
        "r1_u": 0.034,
        "r2_u": 0.034,
        "z": 2,
        "fill": "white"
      },
      {
        "id": "fore_arm_near",
        "parent": "chest",
        "offset_u": [
          0.02,
          0.04
        ],
        "length_u": 0.18,
        "angle": 85,
        "r1_u": 0.05,
        "r2_u": 0.036,
        "z": 2,
        "fill": "fur"
      },
      {
        "id": "fore_paw_near",
        "parent": "fore_arm_near",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.07,
        "angle": 15,
        "r1_u": 0.036,
        "r2_u": 0.034,
        "z": 2,
        "fill": "white"
      }
    ],
    "locomotion": {
      "walk": {
        "default_frames": 8,
        "cadence_type": "hildebrand_lateral_walk",
        "phase_hind_far": 0.0,
        "phase_fore_near": 0.25,
        "phase_hind_near": 0.5,
        "phase_fore_far": 0.75,
        "thigh_swing_deg": 22.0,
        "hock_flex_deg": 28.0,
        "forearm_swing_deg": 24.0,
        "spine_wave_amplitude_deg": 4.5,
        "tail_sway_amplitude_deg": 8.0
      },
      "trot": {
        "default_frames": 8,
        "cadence_type": "diagonal_trot",
        "phase_hind_far": 0.0,
        "phase_fore_near": 0.0,
        "phase_hind_near": 0.5,
        "phase_fore_far": 0.5,
        "thigh_swing_deg": 32.0,
        "hock_flex_deg": 40.0,
        "forearm_swing_deg": 36.0,
        "pelvis_bob_amplitude": 0.035
      }
    }
  },
  "building_structure": {
    "id": "building_structure",
    "name": "Medieval Cottage / Watchtower",
    "category": "nature",
    "description": "Parametric architectural structure with stone foundation, half-timbered walls, gabled tiled roof, arched wooden door, warm glowing window, and chimney.",
    "default_view": "front_isometric",
    "canonical_proportions": {
      "foundation_height_ratio": 0.18,
      "wall_height_ratio": 0.42,
      "roof_height_ratio": 0.4
    },
    "z_depth_tiers": {
      "0_back": {
        "name": "Shadow & Chimney",
        "z": 0,
        "tone": "shadow",
        "layers": [
          "ground_shadow",
          "chimney"
        ]
      },
      "1_core": {
        "name": "Main Walls, Foundation & Roof",
        "z": 1,
        "tone": "base",
        "layers": [
          "foundation",
          "wall_main",
          "timber_left",
          "timber_right",
          "roof_main",
          "roof_eaves"
        ]
      },
      "2_front": {
        "name": "Door, Lit Window & Details",
        "z": 2,
        "tone": "highlight",
        "crease": true,
        "layers": [
          "door",
          "window_frame",
          "window_glow"
        ]
      }
    },
    "layers": [
      {
        "id": "ground_shadow",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.94,
        "rx_u": 0.4,
        "ry_u": 0.08,
        "fill": "shadow",
        "z": 0
      },
      {
        "id": "chimney",
        "op": "rect",
        "x_u": 0.68,
        "y_u": 0.16,
        "w_u": 0.1,
        "h_u": 0.28,
        "rx_u": 0.01,
        "fill": "stone_dark",
        "outline": "O",
        "sdf": true,
        "z": 0
      },
      {
        "id": "foundation",
        "op": "rect",
        "x_u": 0.18,
        "y_u": 0.78,
        "w_u": 0.64,
        "h_u": 0.15,
        "rx_u": 0.02,
        "fill": "stone",
        "outline": "O",
        "sdf": true,
        "z": 1
      },
      {
        "id": "wall_main",
        "op": "rect",
        "x_u": 0.22,
        "y_u": 0.45,
        "w_u": 0.56,
        "h_u": 0.35,
        "rx_u": 0.01,
        "fill": "plaster",
        "outline": "O",
        "sdf": true,
        "z": 1
      },
      {
        "id": "timber_left",
        "op": "rect",
        "x_u": 0.22,
        "y_u": 0.45,
        "w_u": 0.05,
        "h_u": 0.35,
        "fill": "wood",
        "outline": "O",
        "sdf": true,
        "z": 1
      },
      {
        "id": "timber_right",
        "op": "rect",
        "x_u": 0.73,
        "y_u": 0.45,
        "w_u": 0.05,
        "h_u": 0.35,
        "fill": "wood",
        "outline": "O",
        "sdf": true,
        "z": 1
      },
      {
        "id": "roof_main",
        "op": "polygon",
        "points_u": [
          [
            0.5,
            0.12
          ],
          [
            0.12,
            0.48
          ],
          [
            0.88,
            0.48
          ]
        ],
        "fill": "tiles",
        "outline": "O",
        "sdf": true,
        "z": 1
      },
      {
        "id": "roof_eaves",
        "op": "rect",
        "x_u": 0.1,
        "y_u": 0.46,
        "w_u": 0.8,
        "h_u": 0.04,
        "rx_u": 0.01,
        "fill": "wood_dark",
        "outline": "O",
        "sdf": true,
        "z": 1
      },
      {
        "id": "door",
        "op": "uneven_capsule",
        "x1_u": 0.35,
        "y1_u": 0.9,
        "x2_u": 0.35,
        "y2_u": 0.65,
        "r1_u": 0.065,
        "r2_u": 0.065,
        "fill": "wood_dark",
        "outline": "O",
        "sdf": true,
        "z": 2
      },
      {
        "id": "window_frame",
        "op": "rect",
        "x_u": 0.55,
        "y_u": 0.56,
        "w_u": 0.16,
        "h_u": 0.18,
        "rx_u": 0.02,
        "fill": "wood_dark",
        "outline": "O",
        "sdf": true,
        "z": 2
      },
      {
        "id": "window_glow",
        "op": "rect",
        "x_u": 0.57,
        "y_u": 0.58,
        "w_u": 0.12,
        "h_u": 0.14,
        "fill": "light_warm",
        "z": 2
      }
    ]
  },
  "tree_deciduous": {
    "id": "tree_deciduous",
    "name": "Deciduous Oak / Apple Tree",
    "category": "nature",
    "description": "Parametric broadleaf deciduous tree with gnarled trunk, root flare, bifurcating branches, multi-tier spherical foliage canopy, and gentle wind sway.",
    "default_view": "front",
    "canonical_proportions": {
      "trunk_height_ratio": 0.45,
      "canopy_width_ratio": 0.76,
      "canopy_height_ratio": 0.62
    },
    "z_depth_tiers": {
      "0_back": {
        "name": "Background Canopy (Deep Shadow)",
        "z": 0,
        "tone": "shadow",
        "layers": [
          "ground_shadow",
          "canopy_back_left",
          "canopy_back_right",
          "canopy_back_top"
        ]
      },
      "1_core": {
        "name": "Trunk & Main Branches",
        "z": 1,
        "tone": "base",
        "layers": [
          "trunk_base",
          "trunk_mid",
          "branch_left",
          "branch_right"
        ]
      },
      "2_front": {
        "name": "Foreground Canopy (Sunlit Lobes)",
        "z": 2,
        "tone": "highlight",
        "crease": true,
        "layers": [
          "canopy_front_left",
          "canopy_front_right",
          "canopy_front_center",
          "canopy_front_top"
        ]
      }
    },
    "layers": [
      {
        "id": "ground_shadow",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.94,
        "rx_u": 0.32,
        "ry_u": 0.06,
        "fill": "shadow",
        "z": 0
      },
      {
        "id": "trunk_base",
        "op": "uneven_capsule",
        "x1_u": 0.5,
        "y1_u": 0.93,
        "x2_u": 0.5,
        "y2_u": 0.68,
        "r1_u": 0.085,
        "r2_u": 0.065,
        "fill": "wood",
        "outline": "O",
        "sdf": true,
        "z": 1
      },
      {
        "id": "trunk_mid",
        "op": "uneven_capsule",
        "x1_u": 0.5,
        "y1_u": 0.7,
        "x2_u": 0.51,
        "y2_u": 0.5,
        "r1_u": 0.065,
        "r2_u": 0.048,
        "fill": "wood",
        "outline": "O",
        "sdf": true,
        "z": 1
      },
      {
        "id": "branch_left",
        "op": "uneven_capsule",
        "x1_u": 0.5,
        "y1_u": 0.58,
        "x2_u": 0.34,
        "y2_u": 0.44,
        "r1_u": 0.045,
        "r2_u": 0.028,
        "fill": "wood",
        "outline": "O",
        "sdf": true,
        "z": 1
      },
      {
        "id": "branch_right",
        "op": "uneven_capsule",
        "x1_u": 0.5,
        "y1_u": 0.54,
        "x2_u": 0.66,
        "y2_u": 0.42,
        "r1_u": 0.045,
        "r2_u": 0.026,
        "fill": "wood",
        "outline": "O",
        "sdf": true,
        "z": 1
      },
      {
        "id": "canopy_back_left",
        "op": "ellipse",
        "cx_u": 0.34,
        "cy_u": 0.38,
        "rx_u": 0.18,
        "ry_u": 0.16,
        "fill": "foliage_dark",
        "outline": "O",
        "sdf": true,
        "smoothBlend": 2.0,
        "z": 0
      },
      {
        "id": "canopy_back_right",
        "op": "ellipse",
        "cx_u": 0.66,
        "cy_u": 0.36,
        "rx_u": 0.17,
        "ry_u": 0.15,
        "fill": "foliage_dark",
        "outline": "O",
        "sdf": true,
        "smoothBlend": 2.0,
        "z": 0
      },
      {
        "id": "canopy_back_top",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.24,
        "rx_u": 0.19,
        "ry_u": 0.15,
        "fill": "foliage_dark",
        "outline": "O",
        "sdf": true,
        "smoothBlend": 2.0,
        "z": 0
      },
      {
        "id": "canopy_front_left",
        "op": "ellipse",
        "cx_u": 0.36,
        "cy_u": 0.36,
        "rx_u": 0.16,
        "ry_u": 0.14,
        "fill": "foliage",
        "outline": "O",
        "sdf": true,
        "smoothBlend": 2.2,
        "z": 2
      },
      {
        "id": "canopy_front_right",
        "op": "ellipse",
        "cx_u": 0.64,
        "cy_u": 0.34,
        "rx_u": 0.16,
        "ry_u": 0.14,
        "fill": "foliage",
        "outline": "O",
        "sdf": true,
        "smoothBlend": 2.2,
        "z": 2
      },
      {
        "id": "canopy_front_center",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.32,
        "rx_u": 0.19,
        "ry_u": 0.17,
        "fill": "foliage",
        "outline": "O",
        "sdf": true,
        "smoothBlend": 2.5,
        "z": 2
      },
      {
        "id": "canopy_front_top",
        "op": "ellipse",
        "cx_u": 0.49,
        "cy_u": 0.2,
        "rx_u": 0.16,
        "ry_u": 0.13,
        "fill": "foliage_light",
        "outline": "O",
        "sdf": true,
        "smoothBlend": 2.0,
        "z": 2
      }
    ],
    "motion": {
      "wind_sway": {
        "default_frames": 6,
        "sway_amplitude_u": 0.02,
        "phase_lag": 0.3
      }
    }
  },
  "potion_bottle": {
    "id": "potion_bottle",
    "name": "Alchemical Healing / Mana Potion",
    "category": "items",
    "description": "Parametric spherical glass flask with wooden cork, glowing luminescent elixir, curved liquid meniscus, effervescent bubbles, and specular glass highlights.",
    "default_view": "front",
    "canonical_proportions": {
      "cork_height_ratio": 0.14,
      "neck_height_ratio": 0.16,
      "flask_diameter_ratio": 0.64
    },
    "z_depth_tiers": {
      "0_back": {
        "name": "Drop Shadow & Back Glass",
        "z": 0,
        "tone": "shadow",
        "layers": [
          "ground_shadow",
          "glass_back"
        ]
      },
      "1_core": {
        "name": "Luminescent Liquid & Flask Body",
        "z": 1,
        "tone": "base",
        "layers": [
          "liquid_bulb",
          "liquid_meniscus",
          "bottle_neck",
          "cork"
        ]
      },
      "2_front": {
        "name": "Bubbles & Glass Glints",
        "z": 2,
        "tone": "highlight",
        "crease": true,
        "layers": [
          "bubble_1",
          "bubble_2",
          "glass_specular_arc",
          "glass_rim_glint"
        ]
      }
    },
    "layers": [
      {
        "id": "ground_shadow",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.92,
        "rx_u": 0.28,
        "ry_u": 0.06,
        "fill": "shadow",
        "z": 0
      },
      {
        "id": "glass_back",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.62,
        "rx_u": 0.32,
        "ry_u": 0.3,
        "fill": "glass_tint",
        "outline": "O",
        "sdf": true,
        "z": 0
      },
      {
        "id": "liquid_bulb",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.65,
        "rx_u": 0.29,
        "ry_u": 0.26,
        "fill": "elixir",
        "sdf": true,
        "z": 1
      },
      {
        "id": "liquid_meniscus",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.47,
        "rx_u": 0.22,
        "ry_u": 0.05,
        "fill": "elixir_light",
        "z": 1
      },
      {
        "id": "bottle_neck",
        "op": "rect",
        "x_u": 0.42,
        "y_u": 0.24,
        "w_u": 0.16,
        "h_u": 0.16,
        "rx_u": 0.02,
        "fill": "glass_tint",
        "outline": "O",
        "sdf": true,
        "z": 1
      },
      {
        "id": "bottle_lip",
        "op": "rect",
        "x_u": 0.38,
        "y_u": 0.22,
        "w_u": 0.24,
        "h_u": 0.05,
        "rx_u": 0.02,
        "fill": "glass_tint",
        "outline": "O",
        "sdf": true,
        "z": 1
      },
      {
        "id": "cork",
        "op": "uneven_capsule",
        "x1_u": 0.5,
        "y1_u": 0.23,
        "x2_u": 0.5,
        "y2_u": 0.11,
        "r1_u": 0.065,
        "r2_u": 0.08,
        "fill": "cork",
        "outline": "O",
        "sdf": true,
        "z": 1
      },
      {
        "id": "bubble_1",
        "op": "ellipse",
        "cx_u": 0.42,
        "cy_u": 0.68,
        "rx_u": 0.035,
        "ry_u": 0.035,
        "fill": "elixir_white",
        "z": 2
      },
      {
        "id": "bubble_2",
        "op": "ellipse",
        "cx_u": 0.58,
        "cy_u": 0.56,
        "rx_u": 0.025,
        "ry_u": 0.025,
        "fill": "elixir_white",
        "z": 2
      },
      {
        "id": "glass_specular_arc",
        "op": "moon",
        "cx_u": 0.36,
        "cy_u": 0.52,
        "r_u": 0.18,
        "r2_u": 0.15,
        "d_u": 0.04,
        "angle": 135,
        "fill": "white_specular",
        "z": 2
      }
    ]
  },
  "weapon_sword": {
    "id": "weapon_sword",
    "name": "Knight's Arming Sword / Longsword",
    "category": "items",
    "description": "Parametric medieval double-edged longsword with octagonal pommel, leather grip, winged crossguard, central gemstone, fuller, and specular cutting edge.",
    "default_view": "front",
    "canonical_proportions": {
      "blade_length_ratio": 0.65,
      "guard_width_ratio": 0.38,
      "grip_length_ratio": 0.16,
      "pommel_size_ratio": 0.08
    },
    "z_depth_tiers": {
      "0_back": {
        "name": "Drop Shadow & Under-grip",
        "z": 0,
        "tone": "shadow",
        "layers": [
          "pommel_base",
          "grip_under"
        ]
      },
      "1_core": {
        "name": "Blade & Guard",
        "z": 1,
        "tone": "base",
        "layers": [
          "blade_body",
          "blade_tip",
          "crossguard",
          "pommel",
          "fuller"
        ]
      },
      "2_front": {
        "name": "Gemstone & Specular Edge",
        "z": 2,
        "tone": "highlight",
        "crease": true,
        "layers": [
          "guard_gem",
          "edge_glint"
        ]
      }
    },
    "layers": [
      {
        "id": "pommel",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.9,
        "rx_u": 0.07,
        "ry_u": 0.07,
        "fill": "gold",
        "outline": "O",
        "sdf": true,
        "z": 1
      },
      {
        "id": "grip",
        "op": "uneven_capsule",
        "x1_u": 0.5,
        "y1_u": 0.88,
        "x2_u": 0.5,
        "y2_u": 0.72,
        "r1_u": 0.045,
        "r2_u": 0.05,
        "fill": "leather",
        "outline": "O",
        "sdf": true,
        "z": 1
      },
      {
        "id": "blade_body",
        "op": "uneven_capsule",
        "x1_u": 0.5,
        "y1_u": 0.7,
        "x2_u": 0.5,
        "y2_u": 0.18,
        "r1_u": 0.09,
        "r2_u": 0.05,
        "fill": "steel",
        "outline": "O",
        "sdf": true,
        "z": 1
      },
      {
        "id": "blade_tip",
        "op": "vesica",
        "cx_u": 0.5,
        "cy_u": 0.16,
        "rx_u": 0.065,
        "ry_u": 0.12,
        "fill": "steel",
        "outline": "O",
        "sdf": true,
        "smoothBlend": 1.2,
        "z": 1
      },
      {
        "id": "fuller",
        "op": "uneven_capsule",
        "x1_u": 0.5,
        "y1_u": 0.68,
        "x2_u": 0.5,
        "y2_u": 0.25,
        "r1_u": 0.022,
        "r2_u": 0.012,
        "fill": "steel_dark",
        "sdf": true,
        "z": 1
      },
      {
        "id": "crossguard",
        "op": "vesica",
        "cx_u": 0.5,
        "cy_u": 0.71,
        "rx_u": 0.18,
        "ry_u": 0.055,
        "angle": 0,
        "fill": "gold",
        "outline": "O",
        "sdf": true,
        "z": 1
      },
      {
        "id": "guard_gem",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.71,
        "rx_u": 0.035,
        "ry_u": 0.035,
        "fill": "ruby",
        "outline": "O",
        "sdf": true,
        "z": 2
      },
      {
        "id": "edge_glint",
        "op": "pixels",
        "color": "white",
        "points_u": [
          [
            0.47,
            0.22
          ],
          [
            0.48,
            0.2
          ]
        ],
        "z": 2
      }
    ]
  },
  "projectile_orb": {
    "id": "projectile_orb",
    "name": "Magic Missile / Fireball / Plasma Orb",
    "category": "vfx",
    "description": "Parametric magical energy projectile with outer plasma aura, rotating corona rays, incandescent white-hot core, trailing embers, and 6-frame energy swirl.",
    "default_view": "side",
    "canonical_proportions": {
      "core_radius_ratio": 0.2,
      "aura_radius_ratio": 0.38,
      "trail_length_ratio": 0.45
    },
    "z_depth_tiers": {
      "0_back": {
        "name": "Trailing Sparks & Outer Plasma Halo",
        "z": 0,
        "tone": "shadow",
        "layers": [
          "spark_tail_1",
          "spark_tail_2",
          "plasma_halo"
        ]
      },
      "1_core": {
        "name": "Corona Flare & Energy Shell",
        "z": 1,
        "tone": "base",
        "layers": [
          "corona_rays",
          "energy_shell",
          "molten_core"
        ]
      },
      "2_front": {
        "name": "Blinding Core & Leading Glints",
        "z": 2,
        "tone": "highlight",
        "crease": true,
        "layers": [
          "inner_white_hot",
          "spark_lead"
        ]
      }
    },
    "layers": [
      {
        "id": "spark_tail_1",
        "op": "vesica",
        "cx_u": 0.22,
        "cy_u": 0.5,
        "rx_u": 0.16,
        "ry_u": 0.05,
        "fill": "flame_dark",
        "z": 0
      },
      {
        "id": "spark_tail_2",
        "op": "ellipse",
        "cx_u": 0.12,
        "cy_u": 0.48,
        "rx_u": 0.06,
        "ry_u": 0.04,
        "fill": "flame_dark",
        "z": 0
      },
      {
        "id": "plasma_halo",
        "op": "ellipse",
        "cx_u": 0.52,
        "cy_u": 0.5,
        "rx_u": 0.38,
        "ry_u": 0.35,
        "fill": "flame_trans",
        "sdf": true,
        "z": 0
      },
      {
        "id": "corona_rays",
        "op": "star",
        "cx_u": 0.52,
        "cy_u": 0.5,
        "r_u": 0.32,
        "n": 6,
        "innerRatio": 0.45,
        "fill": "flame_mid",
        "sdf": true,
        "z": 1
      },
      {
        "id": "energy_shell",
        "op": "ellipse",
        "cx_u": 0.52,
        "cy_u": 0.5,
        "rx_u": 0.24,
        "ry_u": 0.22,
        "fill": "flame_bright",
        "sdf": true,
        "z": 1
      },
      {
        "id": "molten_core",
        "op": "ellipse",
        "cx_u": 0.54,
        "cy_u": 0.5,
        "rx_u": 0.15,
        "ry_u": 0.14,
        "fill": "flame_yellow",
        "sdf": true,
        "z": 1
      },
      {
        "id": "inner_white_hot",
        "op": "ellipse",
        "cx_u": 0.56,
        "cy_u": 0.5,
        "rx_u": 0.08,
        "ry_u": 0.08,
        "fill": "white",
        "z": 2
      }
    ],
    "motion": {
      "vortex_spin": {
        "default_frames": 6,
        "rotate_corona_deg": 60.0,
        "pulse_core_scale": 0.15
      }
    }
  },
  "autotile_terrain": {
    "id": "autotile_terrain",
    "name": "Grassland / Dirt Plateau Terrain Tile",
    "category": "tilesets",
    "description": "Parametric terrain slice with lush overhanging grass turf, rich subsurface loam with pebble noise, and dense bedrock.",
    "default_view": "side",
    "canonical_proportions": {
      "turf_height_ratio": 0.28,
      "soil_height_ratio": 0.44,
      "bedrock_height_ratio": 0.28
    },
    "z_depth_tiers": {
      "0_back": {
        "name": "Bedrock & Deep Strata",
        "z": 0,
        "tone": "shadow",
        "layers": [
          "bedrock_base"
        ]
      },
      "1_core": {
        "name": "Subsurface Loam / Soil",
        "z": 1,
        "tone": "base",
        "layers": [
          "soil_block",
          "soil_pebble_1",
          "soil_pebble_2"
        ]
      },
      "2_front": {
        "name": "Lush Grass Turf & Overhang Drips",
        "z": 2,
        "tone": "highlight",
        "crease": true,
        "layers": [
          "grass_turf",
          "grass_blades",
          "grass_drips"
        ]
      }
    },
    "layers": [
      {
        "id": "bedrock_base",
        "op": "rect",
        "x_u": 0.0,
        "y_u": 0.72,
        "w_u": 1.0,
        "h_u": 0.28,
        "fill": "stone_dark",
        "z": 0
      },
      {
        "id": "soil_block",
        "op": "rect",
        "x_u": 0.0,
        "y_u": 0.24,
        "w_u": 1.0,
        "h_u": 0.5,
        "fill": "dirt",
        "z": 1
      },
      {
        "id": "soil_pebble_1",
        "op": "ellipse",
        "cx_u": 0.35,
        "cy_u": 0.52,
        "rx_u": 0.06,
        "ry_u": 0.04,
        "fill": "stone",
        "z": 1
      },
      {
        "id": "soil_pebble_2",
        "op": "ellipse",
        "cx_u": 0.72,
        "cy_u": 0.6,
        "rx_u": 0.05,
        "ry_u": 0.035,
        "fill": "stone",
        "z": 1
      },
      {
        "id": "grass_turf",
        "op": "rect",
        "x_u": 0.0,
        "y_u": 0.08,
        "w_u": 1.0,
        "h_u": 0.22,
        "fill": "grass",
        "sdf": true,
        "z": 2
      },
      {
        "id": "grass_blades",
        "op": "rect",
        "x_u": 0.0,
        "y_u": 0.04,
        "w_u": 1.0,
        "h_u": 0.08,
        "fill": "grass_light",
        "z": 2
      },
      {
        "id": "grass_drips",
        "op": "polygon",
        "points_u": [
          [
            0.1,
            0.3
          ],
          [
            0.15,
            0.38
          ],
          [
            0.2,
            0.3
          ],
          [
            0.45,
            0.3
          ],
          [
            0.5,
            0.4
          ],
          [
            0.55,
            0.3
          ],
          [
            0.8,
            0.3
          ],
          [
            0.85,
            0.37
          ],
          [
            0.9,
            0.3
          ]
        ],
        "fill": "grass",
        "z": 2
      }
    ]
  }
,
  "mythic_dragon": {
    "id": "mythic_dragon",
    "name": "Mythic Dragon (Wyvern / Drake)",
    "category": "creatures",
    "description": "Articulated draconic beast with horned crest, serpentine neck, massive bat wings, clawed talons, and whip tail.",
    "default_view": "side",
    "subtypes": {
      "western_dragon": "Four-legged horned dragon with massive bat wings",
      "wyvern": "Two-legged draconic flyer with wing-claws and barbed venom tail",
      "serpentine_drake": "Slender wingless drake with spined crest"
    },
    "z_depth_tiers": {
      "0_back": {
        "name": "Far Wing & Back Claws",
        "z": 0,
        "tone": "shadow",
        "bones": [
          "wing_arm_far",
          "wing_finger_far",
          "hind_thigh_far",
          "hind_shin_far"
        ]
      },
      "1_core": {
        "name": "Torso, Neck, Head & Tail",
        "z": 1,
        "tone": "base",
        "bones": [
          "pelvis",
          "chest",
          "neck",
          "head",
          "jaw",
          "tail_base",
          "tail_mid",
          "tail_tip"
        ]
      },
      "2_front": {
        "name": "Near Wing & Fore Claws",
        "z": 2,
        "tone": "highlight",
        "crease": true,
        "bones": [
          "wing_arm_near",
          "wing_finger_near",
          "hind_thigh_near",
          "hind_shin_near"
        ]
      }
    },
    "bones": [
      {
        "id": "pelvis",
        "u": 0.42,
        "v": 0.52,
        "length_u": 0.12,
        "angle": 10,
        "r1_u": 0.08,
        "r2_u": 0.08,
        "z": 1,
        "fill": "scales"
      },
      {
        "id": "chest",
        "parent": "pelvis",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.14,
        "angle": -30,
        "r1_u": 0.095,
        "r2_u": 0.085,
        "z": 1,
        "fill": "scales"
      },
      {
        "id": "neck",
        "parent": "chest",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.13,
        "angle": -55,
        "r1_u": 0.065,
        "r2_u": 0.05,
        "z": 1,
        "fill": "scales"
      },
      {
        "id": "head",
        "parent": "neck",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.12,
        "angle": 45,
        "r1_u": 0.065,
        "r2_u": 0.035,
        "z": 1,
        "fill": "scales",
        "features": {
          "eyes": {
            "dx_u": 0.03,
            "dy_u": -0.015,
            "w_u": 0.02,
            "h_u": 0.03,
            "color": "#fbbf24"
          },
          "horns": {
            "dx_u": -0.02,
            "dy_u": -0.05,
            "w_u": 0.02,
            "h_u": 0.055,
            "color": "#f1f5f9"
          }
        }
      },
      {
        "id": "jaw",
        "parent": "head",
        "offset_u": [
          0.04,
          0.02
        ],
        "length_u": 0.08,
        "angle": 25,
        "r1_u": 0.032,
        "r2_u": 0.015,
        "z": 1,
        "fill": "scales_dark"
      },
      {
        "id": "tail_base",
        "parent": "pelvis",
        "offset_u": [
          -0.06,
          0.02
        ],
        "length_u": 0.14,
        "angle": 160,
        "r1_u": 0.065,
        "r2_u": 0.048,
        "z": 1,
        "fill": "scales"
      },
      {
        "id": "tail_mid",
        "parent": "tail_base",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.14,
        "angle": -15,
        "r1_u": 0.048,
        "r2_u": 0.032,
        "z": 1,
        "fill": "scales"
      },
      {
        "id": "tail_tip",
        "parent": "tail_mid",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.12,
        "angle": -20,
        "r1_u": 0.032,
        "r2_u": 0.014,
        "z": 1,
        "fill": "scales_accent"
      },
      {
        "id": "wing_arm_far",
        "parent": "chest",
        "offset_u": [
          -0.02,
          -0.04
        ],
        "length_u": 0.17,
        "angle": -125,
        "r1_u": 0.055,
        "r2_u": 0.042,
        "z": 0,
        "fill": "membrane_dark"
      },
      {
        "id": "wing_finger_far",
        "parent": "wing_arm_far",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.22,
        "angle": 55,
        "r1_u": 0.042,
        "r2_u": 0.02,
        "z": 0,
        "fill": "membrane_dark"
      },
      {
        "id": "wing_arm_near",
        "parent": "chest",
        "offset_u": [
          0.02,
          -0.04
        ],
        "length_u": 0.18,
        "angle": -125,
        "r1_u": 0.06,
        "r2_u": 0.046,
        "z": 2,
        "fill": "membrane",
        "crease": true
      },
      {
        "id": "wing_finger_near",
        "parent": "wing_arm_near",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.24,
        "angle": 55,
        "r1_u": 0.046,
        "r2_u": 0.022,
        "z": 2,
        "fill": "membrane",
        "crease": true
      },
      {
        "id": "hind_thigh_far",
        "parent": "pelvis",
        "offset_u": [
          -0.02,
          0.04
        ],
        "length_u": 0.12,
        "angle": 75,
        "r1_u": 0.055,
        "r2_u": 0.04,
        "z": 0,
        "fill": "scales_dark"
      },
      {
        "id": "hind_shin_far",
        "parent": "hind_thigh_far",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.12,
        "angle": -45,
        "r1_u": 0.04,
        "r2_u": 0.025,
        "z": 0,
        "fill": "scales_dark"
      },
      {
        "id": "hind_thigh_near",
        "parent": "pelvis",
        "offset_u": [
          0.02,
          0.04
        ],
        "length_u": 0.13,
        "angle": 75,
        "r1_u": 0.06,
        "r2_u": 0.045,
        "z": 2,
        "fill": "scales"
      },
      {
        "id": "hind_shin_near",
        "parent": "hind_thigh_near",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.13,
        "angle": -45,
        "r1_u": 0.045,
        "r2_u": 0.03,
        "z": 2,
        "fill": "scales"
      }
    ],
    "locomotion": {
      "flight": {
        "default_frames": 6,
        "cadence_type": "flight_flap",
        "wing_flap_amplitude_deg": 52.0,
        "wing_fold_amplitude_deg": 30.0,
        "torso_bob_amplitude": 0.04,
        "tail_sway_amplitude_deg": 14.0
      },
      "fire_breath": {
        "default_frames": 4,
        "neck_arch_deg": -18.0,
        "jaw_open_deg": 32.0,
        "wing_spread_deg": 20.0
      }
    }
  },
  "crawler_spider": {
    "id": "crawler_spider",
    "name": "Crawler Spider (Arachnid / Insectoid)",
    "category": "creatures",
    "description": "8-legged arthropod predator with articulating multi-jointed limbs, fanged chelicerae, and bulbous opisthosoma.",
    "default_view": "top",
    "subtypes": {
      "tarantula": "Heavy burrowing spider with thick hairy exoskeleton",
      "widow_spider": "Sleek hourglass spider with venom fangs",
      "cave_crawler": "Pale albino arachnid with elongated spindly legs"
    },
    "z_depth_tiers": {
      "0_back": {
        "name": "Under-Legs (Far)",
        "z": 0,
        "tone": "shadow",
        "bones": [
          "leg_f1_thigh",
          "leg_f1_shin",
          "leg_f2_thigh",
          "leg_f2_shin",
          "leg_f3_thigh",
          "leg_f3_shin",
          "leg_f4_thigh",
          "leg_f4_shin"
        ]
      },
      "1_core": {
        "name": "Abdomen, Cephalothorax & Fangs",
        "z": 1,
        "tone": "base",
        "bones": [
          "abdomen",
          "cephalothorax",
          "chelicerae_l",
          "chelicerae_r"
        ]
      },
      "2_front": {
        "name": "Upper-Legs (Near)",
        "z": 2,
        "tone": "highlight",
        "crease": true,
        "bones": [
          "leg_n1_thigh",
          "leg_n1_shin",
          "leg_n2_thigh",
          "leg_n2_shin",
          "leg_n3_thigh",
          "leg_n3_shin",
          "leg_n4_thigh",
          "leg_n4_shin"
        ]
      }
    },
    "bones": [
      {
        "id": "abdomen",
        "u": 0.38,
        "v": 0.5,
        "length_u": 0.18,
        "angle": 180,
        "r1_u": 0.11,
        "r2_u": 0.13,
        "z": 1,
        "fill": "chitin_body",
        "shape": "head_oval"
      },
      {
        "id": "cephalothorax",
        "u": 0.54,
        "v": 0.5,
        "length_u": 0.12,
        "angle": 0,
        "r1_u": 0.08,
        "r2_u": 0.065,
        "z": 1,
        "fill": "chitin_head",
        "features": {
          "eyes": {
            "dx_u": 0.04,
            "dy_u": -0.015,
            "w_u": 0.035,
            "h_u": 0.02,
            "color": "#ef4444"
          }
        }
      },
      {
        "id": "chelicerae_l",
        "parent": "cephalothorax",
        "offset_u": [
          0.03,
          -0.02
        ],
        "length_u": 0.06,
        "angle": -35,
        "r1_u": 0.025,
        "r2_u": 0.01,
        "z": 1,
        "fill": "chitin_fangs"
      },
      {
        "id": "chelicerae_r",
        "parent": "cephalothorax",
        "offset_u": [
          0.03,
          0.02
        ],
        "length_u": 0.06,
        "angle": 35,
        "r1_u": 0.025,
        "r2_u": 0.01,
        "z": 1,
        "fill": "chitin_fangs"
      },
      {
        "id": "leg_f1_thigh",
        "parent": "cephalothorax",
        "offset_u": [
          0.02,
          -0.04
        ],
        "length_u": 0.16,
        "angle": -135,
        "r1_u": 0.03,
        "r2_u": 0.02,
        "z": 0,
        "fill": "chitin_dark"
      },
      {
        "id": "leg_f1_shin",
        "parent": "leg_f1_thigh",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.16,
        "angle": 90,
        "r1_u": 0.02,
        "r2_u": 0.01,
        "z": 0,
        "fill": "chitin_dark"
      },
      {
        "id": "leg_f2_thigh",
        "parent": "cephalothorax",
        "offset_u": [
          0.0,
          -0.04
        ],
        "length_u": 0.15,
        "angle": -100,
        "r1_u": 0.03,
        "r2_u": 0.02,
        "z": 0,
        "fill": "chitin_dark"
      },
      {
        "id": "leg_f2_shin",
        "parent": "leg_f2_thigh",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.15,
        "angle": 80,
        "r1_u": 0.02,
        "r2_u": 0.01,
        "z": 0,
        "fill": "chitin_dark"
      },
      {
        "id": "leg_f3_thigh",
        "parent": "cephalothorax",
        "offset_u": [
          -0.02,
          -0.04
        ],
        "length_u": 0.16,
        "angle": -70,
        "r1_u": 0.03,
        "r2_u": 0.02,
        "z": 0,
        "fill": "chitin_dark"
      },
      {
        "id": "leg_f3_shin",
        "parent": "leg_f3_thigh",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.16,
        "angle": 75,
        "r1_u": 0.02,
        "r2_u": 0.01,
        "z": 0,
        "fill": "chitin_dark"
      },
      {
        "id": "leg_f4_thigh",
        "parent": "cephalothorax",
        "offset_u": [
          -0.04,
          -0.04
        ],
        "length_u": 0.18,
        "angle": -35,
        "r1_u": 0.03,
        "r2_u": 0.02,
        "z": 0,
        "fill": "chitin_dark"
      },
      {
        "id": "leg_f4_shin",
        "parent": "leg_f4_thigh",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.18,
        "angle": 65,
        "r1_u": 0.02,
        "r2_u": 0.01,
        "z": 0,
        "fill": "chitin_dark"
      },
      {
        "id": "leg_n1_thigh",
        "parent": "cephalothorax",
        "offset_u": [
          0.02,
          0.04
        ],
        "length_u": 0.16,
        "angle": 135,
        "r1_u": 0.035,
        "r2_u": 0.022,
        "z": 2,
        "fill": "chitin",
        "crease": true
      },
      {
        "id": "leg_n1_shin",
        "parent": "leg_n1_thigh",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.16,
        "angle": -90,
        "r1_u": 0.022,
        "r2_u": 0.012,
        "z": 2,
        "fill": "chitin",
        "crease": true
      },
      {
        "id": "leg_n2_thigh",
        "parent": "cephalothorax",
        "offset_u": [
          0.0,
          0.04
        ],
        "length_u": 0.15,
        "angle": 100,
        "r1_u": 0.035,
        "r2_u": 0.022,
        "z": 2,
        "fill": "chitin",
        "crease": true
      },
      {
        "id": "leg_n2_shin",
        "parent": "leg_n2_thigh",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.15,
        "angle": -80,
        "r1_u": 0.022,
        "r2_u": 0.012,
        "z": 2,
        "fill": "chitin",
        "crease": true
      },
      {
        "id": "leg_n3_thigh",
        "parent": "cephalothorax",
        "offset_u": [
          -0.02,
          0.04
        ],
        "length_u": 0.16,
        "angle": 70,
        "r1_u": 0.035,
        "r2_u": 0.022,
        "z": 2,
        "fill": "chitin",
        "crease": true
      },
      {
        "id": "leg_n3_shin",
        "parent": "leg_n3_thigh",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.16,
        "angle": -75,
        "r1_u": 0.022,
        "r2_u": 0.012,
        "z": 2,
        "fill": "chitin",
        "crease": true
      },
      {
        "id": "leg_n4_thigh",
        "parent": "cephalothorax",
        "offset_u": [
          -0.04,
          0.04
        ],
        "length_u": 0.18,
        "angle": 35,
        "r1_u": 0.035,
        "r2_u": 0.022,
        "z": 2,
        "fill": "chitin",
        "crease": true
      },
      {
        "id": "leg_n4_shin",
        "parent": "leg_n4_thigh",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.18,
        "angle": -65,
        "r1_u": 0.022,
        "r2_u": 0.012,
        "z": 2,
        "fill": "chitin",
        "crease": true
      }
    ],
    "locomotion": {
      "crawl": {
        "default_frames": 6,
        "cadence_type": "tetrapod_crawl",
        "leg_swing_amplitude_deg": 26.0,
        "shin_flex_amplitude_deg": 22.0
      }
    }
  },
  "serpent_snake": {
    "id": "serpent_snake",
    "name": "Serpent Snake (Viper / Cobra)",
    "category": "creatures",
    "description": "Continuous vertebral spine chain with flared cobra hood, hypnotic slither wave, and forked tongue.",
    "default_view": "top",
    "subtypes": {
      "viper": "Triangular-headed pit viper with diamond back patterns",
      "cobra": "Broad flared cobra hood with rear eye markings",
      "constrictor": "Heavy-bodied python with thick muscular coils"
    },
    "z_depth_tiers": {
      "0_back": {
        "name": "Underbelly Tail",
        "z": 0,
        "tone": "shadow",
        "bones": [
          "seg5_tail1",
          "seg6_tail2"
        ]
      },
      "1_core": {
        "name": "Mid-Body & Hood",
        "z": 1,
        "tone": "base",
        "bones": [
          "seg2_hood",
          "seg3_body1",
          "seg4_body2"
        ]
      },
      "2_front": {
        "name": "Striking Head",
        "z": 2,
        "tone": "highlight",
        "crease": true,
        "bones": [
          "seg1_head"
        ]
      }
    },
    "bones": [
      {
        "id": "seg1_head",
        "u": 0.22,
        "v": 0.5,
        "length_u": 0.13,
        "angle": 0,
        "r1_u": 0.065,
        "r2_u": 0.045,
        "z": 2,
        "fill": "snake_head",
        "features": {
          "eyes": {
            "dx_u": 0.03,
            "dy_u": -0.015,
            "w_u": 0.02,
            "h_u": 0.02,
            "color": "#facc15"
          },
          "tongue": {
            "dx_u": 0.07,
            "dy_u": 0.0,
            "w_u": 0.04,
            "h_u": 0.015,
            "color": "#ef4444"
          }
        }
      },
      {
        "id": "seg2_hood",
        "parent": "seg1_head",
        "offset_u": [
          -0.02,
          0.0
        ],
        "length_u": 0.13,
        "angle": 180,
        "r1_u": 0.08,
        "r2_u": 0.07,
        "z": 1,
        "fill": "snake_hood"
      },
      {
        "id": "seg3_body1",
        "parent": "seg2_hood",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.14,
        "angle": 0,
        "r1_u": 0.065,
        "r2_u": 0.06,
        "z": 1,
        "fill": "snake_scales"
      },
      {
        "id": "seg4_body2",
        "parent": "seg3_body1",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.14,
        "angle": 0,
        "r1_u": 0.06,
        "r2_u": 0.05,
        "z": 1,
        "fill": "snake_scales"
      },
      {
        "id": "seg5_tail1",
        "parent": "seg4_body2",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.14,
        "angle": 0,
        "r1_u": 0.05,
        "r2_u": 0.035,
        "z": 0,
        "fill": "snake_scales"
      },
      {
        "id": "seg6_tail2",
        "parent": "seg5_tail1",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.15,
        "angle": 0,
        "r1_u": 0.035,
        "r2_u": 0.015,
        "z": 0,
        "fill": "snake_rattle"
      }
    ],
    "locomotion": {
      "slither": {
        "default_frames": 8,
        "cadence_type": "serpentine_wave",
        "wave_amplitude_deg": 25.0,
        "wave_phase_step": 0.85
      }
    }
  },
  "golem_stone": {
    "id": "golem_stone",
    "name": "Golem Stone (Colossus / Elemental)",
    "category": "creatures",
    "description": "Massive monolithic earth automaton with fractured boulder limbs, glowing arcane rune core, and thunderous stomp.",
    "default_view": "front",
    "subtypes": {
      "granite_colossus": "Dense grey stone giant with jagged chiseled edges",
      "magma_golem": "Dark basalt golem with flowing orange volcanic fissure core",
      "moss_automaton": "Ancient overgrown forest golem with lichen and vines"
    },
    "z_depth_tiers": {
      "0_back": {
        "name": "Back Fist & Leg",
        "z": 0,
        "tone": "shadow",
        "bones": [
          "shoulder_far",
          "fist_far",
          "leg_far_thigh",
          "leg_far_foot"
        ]
      },
      "1_core": {
        "name": "Torso, Pelvis & Core",
        "z": 1,
        "tone": "base",
        "bones": [
          "pelvis",
          "torso",
          "head"
        ]
      },
      "2_front": {
        "name": "Front Fist & Stomp Leg",
        "z": 2,
        "tone": "highlight",
        "crease": true,
        "bones": [
          "shoulder_near",
          "fist_near",
          "leg_near_thigh",
          "leg_near_foot"
        ]
      }
    },
    "bones": [
      {
        "id": "pelvis",
        "u": 0.5,
        "v": 0.56,
        "length_u": 0.09,
        "angle": 90,
        "r1_u": 0.09,
        "r2_u": 0.085,
        "z": 1,
        "fill": "stone_body"
      },
      {
        "id": "torso",
        "parent": "pelvis",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.16,
        "angle": -180,
        "r1_u": 0.125,
        "r2_u": 0.13,
        "z": 1,
        "fill": "stone_body",
        "features": {
          "core": {
            "dx_u": 0.0,
            "dy_u": 0.0,
            "w_u": 0.05,
            "h_u": 0.05,
            "color": "#06b6d4"
          }
        }
      },
      {
        "id": "head",
        "parent": "torso",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.08,
        "angle": 0,
        "r1_u": 0.07,
        "r2_u": 0.065,
        "z": 1,
        "fill": "stone_body",
        "features": {
          "eyes": {
            "dx_u": 0.0,
            "dy_u": -0.01,
            "w_u": 0.055,
            "h_u": 0.015,
            "color": "#06b6d4"
          }
        }
      },
      {
        "id": "shoulder_far",
        "parent": "torso",
        "offset_u": [
          -0.08,
          0.0
        ],
        "length_u": 0.14,
        "angle": 115,
        "r1_u": 0.07,
        "r2_u": 0.06,
        "z": 0,
        "fill": "stone_dark"
      },
      {
        "id": "fist_far",
        "parent": "shoulder_far",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.13,
        "angle": 25,
        "r1_u": 0.075,
        "r2_u": 0.08,
        "z": 0,
        "fill": "stone_dark"
      },
      {
        "id": "shoulder_near",
        "parent": "torso",
        "offset_u": [
          0.08,
          0.0
        ],
        "length_u": 0.14,
        "angle": 65,
        "r1_u": 0.075,
        "r2_u": 0.065,
        "z": 2,
        "fill": "stone_body",
        "crease": true
      },
      {
        "id": "fist_near",
        "parent": "shoulder_near",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.13,
        "angle": 25,
        "r1_u": 0.08,
        "r2_u": 0.085,
        "z": 2,
        "fill": "stone_body",
        "crease": true
      },
      {
        "id": "leg_far_thigh",
        "parent": "pelvis",
        "offset_u": [
          -0.05,
          0.0
        ],
        "length_u": 0.13,
        "angle": 80,
        "r1_u": 0.07,
        "r2_u": 0.06,
        "z": 0,
        "fill": "stone_dark"
      },
      {
        "id": "leg_far_foot",
        "parent": "leg_far_thigh",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.1,
        "angle": 10,
        "r1_u": 0.06,
        "r2_u": 0.08,
        "z": 0,
        "fill": "stone_dark"
      },
      {
        "id": "leg_near_thigh",
        "parent": "pelvis",
        "offset_u": [
          0.05,
          0.0
        ],
        "length_u": 0.13,
        "angle": 100,
        "r1_u": 0.075,
        "r2_u": 0.065,
        "z": 2,
        "fill": "stone_body"
      },
      {
        "id": "leg_near_foot",
        "parent": "leg_near_thigh",
        "offset_u": [
          0.0,
          0.0
        ],
        "length_u": 0.1,
        "angle": -10,
        "r1_u": 0.065,
        "r2_u": 0.085,
        "z": 2,
        "fill": "stone_body"
      }
    ],
    "locomotion": {
      "stomp": {
        "default_frames": 6,
        "fist_swing_deg": 24.0,
        "leg_swing_deg": 22.0,
        "stomp_bob_amplitude": 0.035
      }
    }
  },
  "plant_flower": {
    "id": "plant_flower",
    "name": "Plant Flower (Chamomile / Sunflower)",
    "category": "nature",
    "description": "Parametric botanical bloom with central stamen disc, radial petal ring, organic curved stem, and foliage leaves.",
    "default_view": "front",
    "subtypes": {
      "chamomile_daisy": "Classic chamomile with snow-white petals and golden center",
      "sunflower": "Vibrant sunflower with blazing golden petals and chocolate seed disk",
      "rose_bloom": "Lush scarlet rose bloom with multi-tiered petal folds"
    },
    "layers": [
      {
        "id": "shadow",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.94,
        "rx_u": 0.22,
        "ry_u": 0.06,
        "fill": "shadow",
        "z": 0
      },
      {
        "id": "stem",
        "op": "uneven_capsule",
        "x1_u": 0.5,
        "y1_u": 0.92,
        "x2_u": 0.5,
        "y2_u": 0.38,
        "r1_u": 0.04,
        "r2_u": 0.035,
        "fill": "stem",
        "sdf": true,
        "z": 1
      },
      {
        "id": "leaf_left",
        "op": "vesica",
        "cx_u": 0.38,
        "cy_u": 0.65,
        "rx_u": 0.06,
        "ry_u": 0.14,
        "angle": -45,
        "fill": "foliage",
        "sdf": true,
        "z": 1
      },
      {
        "id": "leaf_right",
        "op": "vesica",
        "cx_u": 0.62,
        "cy_u": 0.58,
        "rx_u": 0.06,
        "ry_u": 0.14,
        "angle": 45,
        "fill": "foliage",
        "sdf": true,
        "z": 1
      },
      {
        "id": "petal_ring",
        "op": "star",
        "cx_u": 0.5,
        "cy_u": 0.35,
        "r_u": 0.28,
        "n": 10,
        "innerRatio": 0.65,
        "fill": "petal",
        "sdf": true,
        "z": 2
      },
      {
        "id": "stamen_core",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.35,
        "rx_u": 0.12,
        "ry_u": 0.12,
        "fill": "core",
        "sdf": true,
        "z": 2,
        "dither": "worley",
        "shaderScale": 5.0
      },
      {
        "id": "glint",
        "op": "pixels",
        "color": "white",
        "points_u": [
          [
            0.46,
            0.31
          ]
        ],
        "z": 2
      }
    ],
    "motion": {
      "breeze": {
        "default_frames": 4,
        "sway_amplitude_u": 0.035
      }
    }
  },
  "mushroom_fungus": {
    "id": "mushroom_fungus",
    "name": "Mushroom Fungus (Toadstool / Shroom)",
    "category": "nature",
    "description": "Fleshy forest fungi with domed parasol cap, spore spots, undercap gills, stem collar, and baby sprouts.",
    "default_view": "front",
    "subtypes": {
      "toadstool_flyagaric": "Iconic red fairy toadstool with stark white polka dots",
      "chanterelle": "Golden-orange wavy forest funnel mushroom",
      "bioluminescent": "Nocturnal glowing blue cave fungus with eerie spores"
    },
    "layers": [
      {
        "id": "shadow",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.94,
        "rx_u": 0.28,
        "ry_u": 0.07,
        "fill": "shadow",
        "z": 0
      },
      {
        "id": "stem",
        "op": "uneven_capsule",
        "x1_u": 0.5,
        "y1_u": 0.9,
        "x2_u": 0.5,
        "y2_u": 0.45,
        "r1_u": 0.09,
        "r2_u": 0.07,
        "fill": "stem",
        "sdf": true,
        "z": 1
      },
      {
        "id": "veil_collar",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.65,
        "rx_u": 0.095,
        "ry_u": 0.03,
        "fill": "veil",
        "sdf": true,
        "z": 1
      },
      {
        "id": "cap_gills",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.46,
        "rx_u": 0.32,
        "ry_u": 0.12,
        "fill": "gills",
        "sdf": true,
        "z": 1
      },
      {
        "id": "cap_dome",
        "op": "moon",
        "cx_u": 0.5,
        "cy_u": 0.38,
        "r_u": 0.36,
        "r2_u": 0.34,
        "d_u": 0.16,
        "angle": 0,
        "fill": "cap",
        "sdf": true,
        "z": 2
      },
      {
        "id": "spot_1",
        "op": "ellipse",
        "cx_u": 0.42,
        "cy_u": 0.28,
        "rx_u": 0.05,
        "ry_u": 0.04,
        "fill": "spots",
        "z": 2
      },
      {
        "id": "spot_2",
        "op": "ellipse",
        "cx_u": 0.58,
        "cy_u": 0.26,
        "rx_u": 0.045,
        "ry_u": 0.035,
        "fill": "spots",
        "z": 2
      },
      {
        "id": "spot_3",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.2,
        "rx_u": 0.04,
        "ry_u": 0.03,
        "fill": "spots",
        "z": 2
      },
      {
        "id": "sprout_cap",
        "op": "ellipse",
        "cx_u": 0.26,
        "cy_u": 0.82,
        "rx_u": 0.1,
        "ry_u": 0.08,
        "fill": "cap",
        "sdf": true,
        "z": 2
      }
    ],
    "motion": {
      "pulse": {
        "default_frames": 4,
        "sway_amplitude_u": 0.02
      }
    }
  },
  "rock_boulder": {
    "id": "rock_boulder",
    "name": "Rock Boulder (Crag / Ore Vein)",
    "category": "nature",
    "description": "Faceted mineral monolith with jagged chisel planes, lichen moss cap, and embedded gemstone ore nodes.",
    "default_view": "front",
    "subtypes": {
      "granite_boulder": "Solid weathered grey granite rock with micro-cracks",
      "mossy_crag": "Lush emerald moss-covered forest outcrop",
      "ore_deposit": "Rich gold and ruby gemstone vein protruding from rock"
    },
    "layers": [
      {
        "id": "shadow",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.92,
        "rx_u": 0.38,
        "ry_u": 0.08,
        "fill": "shadow",
        "z": 0
      },
      {
        "id": "boulder_body",
        "op": "polygon",
        "points_u": [
          [
            0.18,
            0.88
          ],
          [
            0.12,
            0.52
          ],
          [
            0.28,
            0.22
          ],
          [
            0.65,
            0.18
          ],
          [
            0.88,
            0.48
          ],
          [
            0.84,
            0.88
          ]
        ],
        "fill": "stone",
        "sdf": true,
        "z": 1,
        "dither": "worley",
        "shaderScale": 5.0
      },
      {
        "id": "facet_ridge",
        "op": "polygon",
        "points_u": [
          [
            0.28,
            0.22
          ],
          [
            0.55,
            0.48
          ],
          [
            0.48,
            0.88
          ],
          [
            0.18,
            0.88
          ],
          [
            0.12,
            0.52
          ]
        ],
        "fill": "stone_dark",
        "z": 1
      },
      {
        "id": "moss_cap",
        "op": "polygon",
        "points_u": [
          [
            0.24,
            0.24
          ],
          [
            0.66,
            0.2
          ],
          [
            0.78,
            0.36
          ],
          [
            0.55,
            0.4
          ],
          [
            0.35,
            0.38
          ]
        ],
        "fill": "moss",
        "sdf": true,
        "z": 2
      },
      {
        "id": "gem_node",
        "op": "star",
        "cx_u": 0.68,
        "cy_u": 0.58,
        "r_u": 0.08,
        "n": 4,
        "innerRatio": 0.45,
        "fill": "gem",
        "sdf": true,
        "z": 2
      }
    ],
    "motion": {
      "glimmer": {
        "default_frames": 4,
        "sway_amplitude_u": 0.0
      }
    }
  },
  "weapon_bow": {
    "id": "weapon_bow",
    "name": "Weapon Bow (Recurve / Longbow)",
    "category": "items",
    "description": "Flexible arched stave limbs with wrapped leather riser grip, silk string, and nocked steel-tipped arrow.",
    "default_view": "side",
    "subtypes": {
      "hunting_shortbow": "Compact lightweight wooden hunter bow",
      "elven_recurve": "Graceful recurve bow with carved golden tips",
      "composite_longbow": "Heavy composite warbow reinforced with horn"
    },
    "layers": [
      {
        "id": "shadow",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.95,
        "rx_u": 0.18,
        "ry_u": 0.05,
        "fill": "shadow",
        "z": 0
      },
      {
        "id": "bow_limbs",
        "op": "moon",
        "cx_u": 0.42,
        "cy_u": 0.5,
        "r_u": 0.44,
        "r2_u": 0.42,
        "d_u": 0.12,
        "angle": 0,
        "fill": "wood",
        "sdf": true,
        "z": 1
      },
      {
        "id": "riser_grip",
        "op": "uneven_capsule",
        "x1_u": 0.32,
        "y1_u": 0.42,
        "x2_u": 0.32,
        "y2_u": 0.58,
        "r1_u": 0.038,
        "r2_u": 0.038,
        "fill": "leather",
        "sdf": true,
        "z": 1
      },
      {
        "id": "bowstring",
        "op": "line",
        "x1_u": 0.44,
        "y1_u": 0.12,
        "x2_u": 0.44,
        "y2_u": 0.88,
        "thickness": 1,
        "color": "string",
        "z": 2
      },
      {
        "id": "arrow_shaft",
        "op": "line",
        "x1_u": 0.2,
        "y1_u": 0.5,
        "x2_u": 0.78,
        "y2_u": 0.5,
        "thickness": 1,
        "color": "arrow_wood",
        "z": 2
      },
      {
        "id": "arrow_head",
        "op": "polygon",
        "points_u": [
          [
            0.76,
            0.46
          ],
          [
            0.88,
            0.5
          ],
          [
            0.76,
            0.54
          ]
        ],
        "fill": "steel",
        "z": 2
      },
      {
        "id": "arrow_fletching",
        "op": "polygon",
        "points_u": [
          [
            0.22,
            0.45
          ],
          [
            0.26,
            0.5
          ],
          [
            0.22,
            0.55
          ],
          [
            0.18,
            0.5
          ]
        ],
        "fill": "fletch",
        "z": 2
      }
    ],
    "motion": {
      "draw": {
        "default_frames": 4,
        "sway_amplitude_u": 0.02
      }
    }
  },
  "weapon_staff": {
    "id": "weapon_staff",
    "name": "Weapon Staff (Arcane / Druid)",
    "category": "items",
    "description": "Carved mystic stave with twisted spiral shaft, metal bracket claws, and levitating arcane focus orb.",
    "default_view": "front",
    "subtypes": {
      "wizard_staff": "Gilded arcane staff with glowing sapphire sphere",
      "druid_oak_staff": "Twisted ancient oak branch entwined with ivy leaves",
      "necromancer_staff": "Dark bone stave topped with a glowing soul gem"
    },
    "layers": [
      {
        "id": "shadow",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.95,
        "rx_u": 0.16,
        "ry_u": 0.05,
        "fill": "shadow",
        "z": 0
      },
      {
        "id": "shaft",
        "op": "uneven_capsule",
        "x1_u": 0.5,
        "y1_u": 0.92,
        "x2_u": 0.5,
        "y2_u": 0.26,
        "r1_u": 0.035,
        "r2_u": 0.04,
        "fill": "wood",
        "sdf": true,
        "z": 1
      },
      {
        "id": "grip_wrap",
        "op": "uneven_capsule",
        "x1_u": 0.5,
        "y1_u": 0.55,
        "x2_u": 0.5,
        "y2_u": 0.65,
        "r1_u": 0.045,
        "r2_u": 0.045,
        "fill": "leather",
        "sdf": true,
        "z": 1
      },
      {
        "id": "prong_left",
        "op": "vesica",
        "cx_u": 0.42,
        "cy_u": 0.22,
        "rx_u": 0.035,
        "ry_u": 0.08,
        "angle": -25,
        "fill": "gold",
        "sdf": true,
        "z": 1
      },
      {
        "id": "prong_right",
        "op": "vesica",
        "cx_u": 0.58,
        "cy_u": 0.22,
        "rx_u": 0.035,
        "ry_u": 0.08,
        "angle": 25,
        "fill": "gold",
        "sdf": true,
        "z": 1
      },
      {
        "id": "mana_orb",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.16,
        "rx_u": 0.09,
        "ry_u": 0.09,
        "fill": "gem",
        "sdf": true,
        "z": 2
      },
      {
        "id": "orb_glint",
        "op": "star",
        "cx_u": 0.48,
        "cy_u": 0.14,
        "r_u": 0.04,
        "n": 4,
        "innerRatio": 0.4,
        "fill": "white",
        "z": 2
      }
    ],
    "motion": {
      "levitate": {
        "default_frames": 4,
        "sway_amplitude_u": 0.02
      }
    }
  },
  "armor_shield": {
    "id": "armor_shield",
    "name": "Armor Shield (Knight Kite / Buckler)",
    "category": "items",
    "description": "Hardened knight shield with riveted steel rim, curved heraldic faceplate, and central gold emblem boss.",
    "default_view": "front",
    "subtypes": {
      "heater_shield": "Classic medieval heater shield with triangular base",
      "round_buckler": "Light agile dueling buckler with heavy steel boss",
      "tower_pavise": "Massive rectangular pavise shield with sight slit"
    },
    "layers": [
      {
        "id": "shadow",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.94,
        "rx_u": 0.32,
        "ry_u": 0.07,
        "fill": "shadow",
        "z": 0
      },
      {
        "id": "shield_rim",
        "op": "vesica",
        "cx_u": 0.5,
        "cy_u": 0.48,
        "rx_u": 0.34,
        "ry_u": 0.4,
        "fill": "steel",
        "sdf": true,
        "z": 1
      },
      {
        "id": "shield_face",
        "op": "vesica",
        "cx_u": 0.5,
        "cy_u": 0.48,
        "rx_u": 0.27,
        "ry_u": 0.33,
        "fill": "faceplate",
        "sdf": true,
        "z": 2,
        "dither": "worley",
        "shaderScale": 5.0
      },
      {
        "id": "heraldic_cross",
        "op": "star",
        "cx_u": 0.5,
        "cy_u": 0.48,
        "r_u": 0.16,
        "n": 4,
        "innerRatio": 0.45,
        "fill": "gold",
        "sdf": true,
        "z": 2
      },
      {
        "id": "boss_center",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.48,
        "rx_u": 0.05,
        "ry_u": 0.05,
        "fill": "ruby",
        "sdf": true,
        "z": 2
      }
    ],
    "motion": {
      "guard": {
        "default_frames": 4,
        "sway_amplitude_u": 0.015
      }
    }
  },
  "spell_lightning": {
    "id": "spell_lightning",
    "name": "Spell Lightning (Chain / Storm Arc)",
    "category": "vfx",
    "description": "Jagged high-energy electric plasma discharge with fractal fork branches, ionized glow corona, and impact spark burst.",
    "default_view": "front",
    "subtypes": {
      "chain_lightning": "High-voltage branching arc connecting multiple targets",
      "thunder_strike": "Vertical devastating lightning pillar from storm clouds",
      "plasma_arc": "Crackling erratic blue-white sphere discharge"
    },
    "layers": [
      {
        "id": "ground_glow",
        "op": "ellipse",
        "cx_u": 0.5,
        "cy_u": 0.9,
        "rx_u": 0.25,
        "ry_u": 0.08,
        "fill": "plasma_glow",
        "z": 0
      },
      {
        "id": "trunk_arc",
        "op": "polygon",
        "points_u": [
          [
            0.5,
            0.05
          ],
          [
            0.44,
            0.25
          ],
          [
            0.56,
            0.35
          ],
          [
            0.38,
            0.55
          ],
          [
            0.52,
            0.65
          ],
          [
            0.42,
            0.85
          ],
          [
            0.5,
            0.92
          ],
          [
            0.54,
            0.85
          ],
          [
            0.46,
            0.65
          ],
          [
            0.6,
            0.55
          ],
          [
            0.48,
            0.35
          ],
          [
            0.58,
            0.25
          ]
        ],
        "fill": "plasma_core",
        "sdf": true,
        "z": 1
      },
      {
        "id": "branch_left",
        "op": "polygon",
        "points_u": [
          [
            0.44,
            0.25
          ],
          [
            0.28,
            0.38
          ],
          [
            0.32,
            0.42
          ],
          [
            0.48,
            0.35
          ]
        ],
        "fill": "plasma_mid",
        "z": 1
      },
      {
        "id": "branch_right",
        "op": "polygon",
        "points_u": [
          [
            0.52,
            0.65
          ],
          [
            0.72,
            0.72
          ],
          [
            0.68,
            0.76
          ],
          [
            0.46,
            0.68
          ]
        ],
        "fill": "plasma_mid",
        "z": 1
      },
      {
        "id": "spark_burst",
        "op": "star",
        "cx_u": 0.5,
        "cy_u": 0.92,
        "r_u": 0.12,
        "n": 6,
        "innerRatio": 0.35,
        "fill": "plasma_bright",
        "z": 2
      }
    ],
    "motion": {
      "discharge": {
        "default_frames": 4,
        "sway_amplitude_u": 0.03
      }
    }
  },
  "spell_fireball": {
    "id": "spell_fireball",
    "name": "Spell Fireball (Meteor / Hellfire)",
    "category": "vfx",
    "description": "Roaring pyrotechnic projectile with swirling incandescent core, turbulent flame mantle, trailing smoke, and flying embers.",
    "default_view": "side",
    "subtypes": {
      "meteor": "Dense burning cosmic rock shrouded in atmospheric plasma",
      "hellfire": "Dark crimson infernal fire with black smoke tendrils",
      "phoenix_flame": "Blazing solar flame bird bursting with golden sparks"
    },
    "layers": [
      {
        "id": "smoke_trail",
        "op": "ellipse",
        "cx_u": 0.22,
        "cy_u": 0.5,
        "rx_u": 0.22,
        "ry_u": 0.18,
        "fill": "smoke",
        "z": 0
      },
      {
        "id": "outer_flame",
        "op": "vesica",
        "cx_u": 0.45,
        "cy_u": 0.5,
        "rx_u": 0.36,
        "ry_u": 0.24,
        "angle": 0,
        "fill": "flame_dark",
        "sdf": true,
        "z": 1
      },
      {
        "id": "mid_flame",
        "op": "vesica",
        "cx_u": 0.52,
        "cy_u": 0.5,
        "rx_u": 0.26,
        "ry_u": 0.17,
        "angle": 0,
        "fill": "flame_mid",
        "sdf": true,
        "z": 2
      },
      {
        "id": "core_white",
        "op": "ellipse",
        "cx_u": 0.62,
        "cy_u": 0.5,
        "rx_u": 0.14,
        "ry_u": 0.11,
        "fill": "white",
        "sdf": true,
        "z": 2
      },
      {
        "id": "ember_1",
        "op": "pixels",
        "color": "flame_mid",
        "points_u": [
          [
            0.15,
            0.4
          ],
          [
            0.12,
            0.58
          ],
          [
            0.26,
            0.32
          ]
        ],
        "z": 2
      }
    ],
    "motion": {
      "blaze": {
        "default_frames": 4,
        "sway_amplitude_u": 0.04
      }
    }
  },
  "tile_grass": {
    "id": "tile_grass",
    "name": "Tile Grass Meadow (\u0422\u0440\u0430\u0432\u0430 - Seamless)",
    "category": "tilesets",
    "description": "Seamlessly wrap-tiling lush meadow tile with multi-tone turf, blade tuft clusters, and wildflower flecks.",
    "default_view": "top",
    "subtypes": {
      "lush_meadow": "Vibrant emerald grass with yellow buttercups and white daisies",
      "autumn_turf": "Dry golden-brown late autumn pasture grass",
      "mossy_swamp": "Dark saturated marsh grass with moisture puddles"
    },
    "layers": [
      {
        "id": "grass_base",
        "op": "rect",
        "x_u": 0.0,
        "y_u": 0.0,
        "w_u": 1.0,
        "h_u": 1.0,
        "fill": "grass_base",
        "sdf": true,
        "z": 0,
        "dither": "worley",
        "shaderScale": 5.0
      },
      {
        "id": "tuft_1",
        "op": "vesica",
        "cx_u": 0.25,
        "cy_u": 0.3,
        "rx_u": 0.05,
        "ry_u": 0.12,
        "angle": -15,
        "fill": "grass_light",
        "sdf": true,
        "z": 1
      },
      {
        "id": "tuft_2",
        "op": "vesica",
        "cx_u": 0.28,
        "cy_u": 0.3,
        "rx_u": 0.045,
        "ry_u": 0.13,
        "angle": 15,
        "fill": "grass_light",
        "sdf": true,
        "z": 1
      },
      {
        "id": "tuft_3",
        "op": "vesica",
        "cx_u": 0.72,
        "cy_u": 0.22,
        "rx_u": 0.05,
        "ry_u": 0.12,
        "angle": -10,
        "fill": "grass_light",
        "sdf": true,
        "z": 1
      },
      {
        "id": "tuft_4",
        "op": "vesica",
        "cx_u": 0.45,
        "cy_u": 0.7,
        "rx_u": 0.05,
        "ry_u": 0.12,
        "angle": 20,
        "fill": "grass_light",
        "sdf": true,
        "z": 1
      },
      {
        "id": "tuft_5",
        "op": "vesica",
        "cx_u": 0.85,
        "cy_u": 0.8,
        "rx_u": 0.045,
        "ry_u": 0.11,
        "angle": -15,
        "fill": "grass_light",
        "sdf": true,
        "z": 1
      },
      {
        "id": "flower_buttercup",
        "op": "ellipse",
        "cx_u": 0.38,
        "cy_u": 0.45,
        "rx_u": 0.035,
        "ry_u": 0.035,
        "fill": "flower_yellow",
        "z": 2
      },
      {
        "id": "flower_daisy",
        "op": "ellipse",
        "cx_u": 0.65,
        "cy_u": 0.62,
        "rx_u": 0.035,
        "ry_u": 0.035,
        "fill": "flower_white",
        "z": 2
      }
    ]
  },
  "tile_dirt": {
    "id": "tile_dirt",
    "name": "Tile Dirt & Earth (\u0417\u0435\u043c\u043b\u044f - Seamless)",
    "category": "tilesets",
    "description": "Seamlessly wrap-tiling rich soil tile with organic humus texture, loam fissures, pebbles, and clay clods.",
    "default_view": "top",
    "subtypes": {
      "rich_humus": "Dark moist fertile forest loam soil",
      "arid_clay": "Dry red-orange cracked savanna earth",
      "gravel_path": "Soil packed with small rounded river pebbles"
    },
    "layers": [
      {
        "id": "dirt_base",
        "op": "rect",
        "x_u": 0.0,
        "y_u": 0.0,
        "w_u": 1.0,
        "h_u": 1.0,
        "fill": "dirt_base",
        "sdf": true,
        "z": 0,
        "dither": "worley",
        "shaderScale": 4.5
      },
      {
        "id": "fissure_crack",
        "op": "bezier_sdf",
        "points_u": [
          [
            0.15,
            0.2
          ],
          [
            0.45,
            0.35
          ],
          [
            0.65,
            0.55
          ]
        ],
        "r1_u": 0.025,
        "r2_u": 0.015,
        "fill": "dirt_dark",
        "z": 1
      },
      {
        "id": "fissure_crack_2",
        "op": "bezier_sdf",
        "points_u": [
          [
            0.7,
            0.65
          ],
          [
            0.85,
            0.75
          ],
          [
            0.92,
            0.9
          ]
        ],
        "r1_u": 0.022,
        "r2_u": 0.012,
        "fill": "dirt_dark",
        "z": 1
      },
      {
        "id": "pebble_1",
        "op": "ellipse",
        "cx_u": 0.35,
        "cy_u": 0.65,
        "rx_u": 0.05,
        "ry_u": 0.035,
        "fill": "pebble",
        "sdf": true,
        "z": 2
      },
      {
        "id": "pebble_2",
        "op": "ellipse",
        "cx_u": 0.78,
        "cy_u": 0.3,
        "rx_u": 0.04,
        "ry_u": 0.03,
        "fill": "pebble",
        "sdf": true,
        "z": 2
      },
      {
        "id": "clay_clod",
        "op": "ellipse",
        "cx_u": 0.52,
        "cy_u": 0.82,
        "rx_u": 0.065,
        "ry_u": 0.045,
        "fill": "dirt_warm",
        "sdf": true,
        "z": 1
      }
    ]
  },
  "tile_sand": {
    "id": "tile_sand",
    "name": "Tile Sand Dunes (\u041f\u0435\u0441\u043e\u043a - Seamless)",
    "category": "tilesets",
    "description": "Seamlessly wrap-tiling warm golden desert sand with gentle wind ripple lines and silica glints.",
    "default_view": "top",
    "subtypes": {
      "desert_dunes": "Deep golden Sahara desert sand with warm rippled ridges",
      "tropical_beach": "Pale soft coastal beach sand with shell flecks",
      "red_canyon_sand": "Crimson Martian / canyon sandstone grain"
    },
    "layers": [
      {
        "id": "sand_base",
        "op": "rect",
        "x_u": 0.0,
        "y_u": 0.0,
        "w_u": 1.0,
        "h_u": 1.0,
        "fill": "sand_base",
        "sdf": true,
        "z": 0,
        "dither": "worley",
        "shaderScale": 6.5
      },
      {
        "id": "dune_ripple_1",
        "op": "bezier_sdf",
        "points_u": [
          [
            0.05,
            0.25
          ],
          [
            0.5,
            0.2
          ],
          [
            0.95,
            0.28
          ]
        ],
        "r1_u": 0.035,
        "r2_u": 0.025,
        "fill": "sand_light",
        "z": 1
      },
      {
        "id": "dune_ripple_2",
        "op": "bezier_sdf",
        "points_u": [
          [
            0.05,
            0.55
          ],
          [
            0.45,
            0.6
          ],
          [
            0.95,
            0.52
          ]
        ],
        "r1_u": 0.035,
        "r2_u": 0.025,
        "fill": "sand_light",
        "z": 1
      },
      {
        "id": "dune_ripple_3",
        "op": "bezier_sdf",
        "points_u": [
          [
            0.05,
            0.85
          ],
          [
            0.55,
            0.8
          ],
          [
            0.95,
            0.88
          ]
        ],
        "r1_u": 0.035,
        "r2_u": 0.025,
        "fill": "sand_light",
        "z": 1
      },
      {
        "id": "silica_glints",
        "op": "pixels",
        "color": "white",
        "points_u": [
          [
            0.22,
            0.18
          ],
          [
            0.72,
            0.48
          ],
          [
            0.38,
            0.78
          ],
          [
            0.82,
            0.85
          ]
        ],
        "z": 2
      }
    ]
  },
  "tile_stone": {
    "id": "tile_stone",
    "name": "Tile Stone Flagstones (\u041a\u0430\u043c\u0435\u043d\u044c - Seamless)",
    "category": "tilesets",
    "description": "Seamlessly wrap-tiling dungeon / castle flagstone floor with dark mortar grout joints and chisel bevels.",
    "default_view": "top",
    "subtypes": {
      "dungeon_flagstones": "Chiseled slate grey slabs with damp mortar lines",
      "ancient_ruins": "Cracked weathered stones with moss growing in crevices",
      "cobblestone_road": "Rounded river cobbles paved for town streets"
    },
    "layers": [
      {
        "id": "mortar_bed",
        "op": "rect",
        "x_u": 0.0,
        "y_u": 0.0,
        "w_u": 1.0,
        "h_u": 1.0,
        "fill": "mortar",
        "z": 0
      },
      {
        "id": "slab_nw",
        "op": "rect",
        "x_u": 0.04,
        "y_u": 0.04,
        "w_u": 0.42,
        "h_u": 0.42,
        "fill": "stone_base",
        "sdf": true,
        "z": 1,
        "dither": "worley",
        "shaderScale": 4.0
      },
      {
        "id": "slab_ne",
        "op": "rect",
        "x_u": 0.54,
        "y_u": 0.04,
        "w_u": 0.42,
        "h_u": 0.42,
        "fill": "stone_base",
        "sdf": true,
        "z": 1,
        "dither": "worley",
        "shaderScale": 4.0
      },
      {
        "id": "slab_sw",
        "op": "rect",
        "x_u": 0.04,
        "y_u": 0.54,
        "w_u": 0.42,
        "h_u": 0.42,
        "fill": "stone_base",
        "sdf": true,
        "z": 1,
        "dither": "worley",
        "shaderScale": 4.0
      },
      {
        "id": "slab_se",
        "op": "rect",
        "x_u": 0.54,
        "y_u": 0.54,
        "w_u": 0.42,
        "h_u": 0.42,
        "fill": "stone_base",
        "sdf": true,
        "z": 1,
        "dither": "worley",
        "shaderScale": 4.0
      },
      {
        "id": "moss_fleck",
        "op": "ellipse",
        "cx_u": 0.48,
        "cy_u": 0.48,
        "rx_u": 0.06,
        "ry_u": 0.06,
        "fill": "moss",
        "z": 2
      }
    ]
  },
  "tile_water": {
    "id": "tile_water",
    "name": "Tile Water Caustics (\u0412\u043e\u0434\u0430 - Seamless)",
    "category": "tilesets",
    "description": "Seamlessly wrap-tiling fluid water tile with animated caustic refraction loops and foam crests.",
    "default_view": "top",
    "subtypes": {
      "ocean_azure": "Deep crystal azure sea with sunbeam caustic ripples",
      "swamp_murk": "Dark olive-green murky bayou water with lilypad flecks",
      "crystal_spring": "Bright cyan alpine spring with high-specular glints"
    },
    "layers": [
      {
        "id": "water_depth",
        "op": "rect",
        "x_u": 0.0,
        "y_u": 0.0,
        "w_u": 1.0,
        "h_u": 1.0,
        "fill": "water_deep",
        "z": 0
      },
      {
        "id": "caustic_ring_1",
        "op": "ellipse",
        "cx_u": 0.35,
        "cy_u": 0.35,
        "rx_u": 0.22,
        "ry_u": 0.16,
        "fill": "water_caustic",
        "sdf": true,
        "z": 1
      },
      {
        "id": "caustic_ring_2",
        "op": "ellipse",
        "cx_u": 0.72,
        "cy_u": 0.68,
        "rx_u": 0.24,
        "ry_u": 0.18,
        "fill": "water_caustic",
        "sdf": true,
        "z": 1
      },
      {
        "id": "foam_crest",
        "op": "bezier_sdf",
        "points_u": [
          [
            0.15,
            0.65
          ],
          [
            0.45,
            0.55
          ],
          [
            0.85,
            0.75
          ]
        ],
        "r1_u": 0.03,
        "r2_u": 0.015,
        "fill": "foam",
        "z": 2
      },
      {
        "id": "glints",
        "op": "pixels",
        "color": "white",
        "points_u": [
          [
            0.35,
            0.32
          ],
          [
            0.72,
            0.65
          ]
        ],
        "z": 2
      }
    ],
    "motion": {
      "flow": {
        "default_frames": 4,
        "sway_amplitude_u": 0.02
      }
    }
  }
};

window.DEFAULT_ARCHETYPE_PALETTES = {
  humanoid: {
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
  quadruped_feline: {
    ".": "transparent",
    "O": "#1c140a",
    "fur": "#ea580c",
    "fur_dark": "#9a3412",
    "white": "#fed7aa",
    "white_dark": "#fdba74"
  },
  quadruped_canine: {
    ".": "transparent",
    "O": "#15181e",
    "fur": "#64748b",
    "fur_dark": "#334155",
    "fur_light": "#cbd5e1",
    "dark": "#0f172a"
  },
  avian_bird: {
    ".": "transparent",
    "O": "#1a1612",
    "feathers": "#593318",
    "feathers_dark": "#382010",
    "feathers_light": "#804c27",
    "gold": "#eab308"
  },
  tree_deciduous: {
    ".": "transparent",
    "O": "#142115",
    "wood": "#5c3d24",
    "wood_dark": "#3b2414",
    "foliage": "#2e7d32",
    "foliage_dark": "#1b4d20",
    "foliage_light": "#4caf50",
    "shadow": "#14182e38"
  },
  building_structure: {
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
  weapon_sword: {
    ".": "transparent",
    "O": "#141724",
    "steel": "#e2e8f0",
    "steel_dark": "#64748b",
    "gold": "#eab308",
    "leather": "#78350f",
    "ruby": "#dc2626",
    "white": "#ffffff"
  },
  potion_bottle: {
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
  projectile_orb: {
    ".": "transparent",
    "O": "#1c0a0a",
    "flame_dark": "#7f1d1d",
    "flame_trans": "#ef444444",
    "flame_mid": "#ea580c",
    "flame_bright": "#f97316",
    "flame_yellow": "#fde047",
    "white": "#ffffff"
  },
  autotile_terrain: {
    ".": "transparent",
    "O": "#14181f",
    "grass": "#388e3c",
    "grass_light": "#66bb6a",
    "dirt": "#5d4037",
    "stone": "#78909c",
    "stone_dark": "#37474f"
  }
,
  "mythic_dragon": {
    ".": "transparent",
    "O": "#160a0a",
    "scales": "#dc2626",
    "scales_dark": "#991b1b",
    "scales_accent": "#ea580c",
    "membrane": "#f97316",
    "membrane_dark": "#c2410c",
    "white": "#ffffff"
  },
  "crawler_spider": {
    ".": "transparent",
    "O": "#0f0f14",
    "chitin": "#334155",
    "chitin_dark": "#1e293b",
    "chitin_body": "#0f172a",
    "chitin_head": "#1e293b",
    "chitin_fangs": "#dc2626",
    "white": "#ffffff"
  },
  "serpent_snake": {
    ".": "transparent",
    "O": "#0c170d",
    "snake_head": "#16a34a",
    "snake_hood": "#15803d",
    "snake_scales": "#22c55e",
    "snake_rattle": "#eab308",
    "white": "#ffffff"
  },
  "golem_stone": {
    ".": "transparent",
    "O": "#111827",
    "stone_body": "#64748b",
    "stone_dark": "#334155",
    "core": "#06b6d4",
    "white": "#ffffff"
  },
  "plant_flower": {
    ".": "transparent",
    "O": "#141c14",
    "stem": "#16a34a",
    "foliage": "#22c55e",
    "petal": "#f8fafc",
    "core": "#eab308",
    "white": "#ffffff",
    "shadow": "#14182e38"
  },
  "mushroom_fungus": {
    ".": "transparent",
    "O": "#1c1414",
    "stem": "#f1f5f9",
    "veil": "#e2e8f0",
    "cap": "#dc2626",
    "gills": "#7f1d1d",
    "spots": "#ffffff",
    "shadow": "#14182e38"
  },
  "rock_boulder": {
    ".": "transparent",
    "O": "#181e24",
    "stone": "#64748b",
    "stone_dark": "#334155",
    "moss": "#16a34a",
    "gem": "#a855f7",
    "white": "#ffffff",
    "shadow": "#14182e38"
  },
  "weapon_bow": {
    ".": "transparent",
    "O": "#1c1612",
    "wood": "#78350f",
    "leather": "#451a03",
    "string": "#e2e8f0",
    "arrow_wood": "#a16207",
    "steel": "#94a3b8",
    "fletch": "#dc2626",
    "shadow": "#14182e38"
  },
  "weapon_staff": {
    ".": "transparent",
    "O": "#1a1614",
    "wood": "#78350f",
    "leather": "#451a03",
    "gold": "#eab308",
    "gem": "#38bdf8",
    "white": "#ffffff",
    "shadow": "#14182e38"
  },
  "armor_shield": {
    ".": "transparent",
    "O": "#141724",
    "steel": "#e2e8f0",
    "faceplate": "#2563eb",
    "gold": "#eab308",
    "ruby": "#dc2626",
    "shadow": "#14182e38"
  },
  "spell_lightning": {
    ".": "transparent",
    "O": "#0c1a2e",
    "plasma_core": "#ffffff",
    "plasma_bright": "#a5f3fc",
    "plasma_mid": "#38bdf8",
    "plasma_glow": "#0284c744"
  },
  "spell_fireball": {
    ".": "transparent",
    "O": "#1c0a0a",
    "smoke": "#404040",
    "flame_dark": "#7f1d1d",
    "flame_mid": "#ea580c",
    "white": "#ffffff"
  },
  "tile_grass": {
    ".": "transparent",
    "grass_base": "#15803d",
    "grass_light": "#4ade80",
    "flower_yellow": "#fde047",
    "flower_white": "#f8fafc"
  },
  "tile_dirt": {
    ".": "transparent",
    "dirt_base": "#5c3d24",
    "dirt_dark": "#3b2414",
    "dirt_warm": "#784b2c",
    "pebble": "#94a3b8"
  },
  "tile_sand": {
    ".": "transparent",
    "sand_base": "#d97706",
    "sand_light": "#fbbf24",
    "white": "#fffbeb"
  },
  "tile_stone": {
    ".": "transparent",
    "mortar": "#1e293b",
    "stone_base": "#64748b",
    "moss": "#16a34a"
  },
  "tile_water": {
    ".": "transparent",
    "water_deep": "#0369a1",
    "water_caustic": "#38bdf8",
    "foam": "#e0f2fe",
    "white": "#ffffff"
  }
};

window.ARCHETYPE_THEMES = {
  classic: "Authentic / Original",
  magma: "Volcanic Magma and Obsidian",
  forest: "Deep Moss and Ancient Oak",
  cyberpunk: "Neon Cyan and Hot Pink",
  royal: "Imperial Purple and Gold",
  gameboy: "Retro GameBoy (4 Greens)",
  pastel: "Ethereal Pastel Dream"
};

window.ARCHETYPE_THEME_PALETTES = {
  magma: {
    ".": "transparent",
    "O": "#140808",
    "skin": "#f97316",
    "skin_dark": "#9a3412",
    "clothes": "#262626",
    "clothes_dark": "#171717",
    "pants": "#404040",
    "pants_dark": "#262626",
    "shoes": "#0a0a0a",
    "shoes_dark": "#000000",
    "hair": "#ea580c",
    "fur": "#f97316",
    "fur_dark": "#9a3412",
    "white": "#ffedd5",
    "white_dark": "#fed7aa",
    "wood": "#262626",
    "wood_dark": "#171717",
    "foliage": "#ea580c",
    "foliage_dark": "#9a3412",
    "foliage_light": "#fdba74",
    "stone": "#262626",
    "stone_dark": "#171717",
    "plaster": "#404040",
    "tiles": "#dc2626",
    "steel": "#737373",
    "steel_dark": "#404040",
    "gold": "#f97316",
    "leather": "#262626",
    "ruby": "#ef4444",
    "cork": "#78350f",
    "glass_tint": "#f9731633",
    "elixir": "#ea580c",
    "elixir_light": "#fb923c",
    "elixir_white": "#ffedd5",
    "white_specular": "#ffffffbb",
    "flame_dark": "#7f1d1d",
    "flame_trans": "#ef444444",
    "flame_mid": "#ea580c",
    "flame_bright": "#f97316",
    "flame_yellow": "#fde047",
    "white": "#ffffff",
    "grass": "#ea580c",
    "grass_light": "#fb923c",
    "dirt": "#262626",
    "shadow": "#0a050544"
  },
  forest: {
    ".": "transparent",
    "O": "#0f1710",
    "skin": "#fef08a",
    "skin_dark": "#eab308",
    "clothes": "#166534",
    "clothes_dark": "#14532d",
    "pants": "#3f2c1d",
    "pants_dark": "#291c13",
    "shoes": "#1c1917",
    "shoes_dark": "#0c0a09",
    "hair": "#3f2c1d",
    "fur": "#15803d",
    "fur_dark": "#166534",
    "white": "#bbf7d0",
    "white_dark": "#86efac",
    "wood": "#573a24",
    "wood_dark": "#382415",
    "foliage": "#16a34a",
    "foliage_dark": "#15803d",
    "foliage_light": "#4ade80",
    "stone": "#52525b",
    "stone_dark": "#3f3f46",
    "plaster": "#d4d4d8",
    "tiles": "#15803d",
    "steel": "#a1a1aa",
    "steel_dark": "#52525b",
    "gold": "#eab308",
    "leather": "#573a24",
    "ruby": "#22c55e",
    "cork": "#573a24",
    "glass_tint": "#22c55e33",
    "elixir": "#16a34a",
    "elixir_light": "#4ade80",
    "elixir_white": "#dcfce7",
    "white_specular": "#ffffffbb",
    "flame_dark": "#14532d",
    "flame_trans": "#22c55e44",
    "flame_mid": "#16a34a",
    "flame_bright": "#4ade80",
    "flame_yellow": "#bef264",
    "white": "#ffffff",
    "grass": "#16a34a",
    "grass_light": "#4ade80",
    "dirt": "#573a24",
    "shadow": "#0c150c44"
  },
  cyberpunk: {
    ".": "transparent",
    "O": "#0a0e17",
    "skin": "#fbcfe8",
    "skin_dark": "#f472b6",
    "clothes": "#06b6d4",
    "clothes_dark": "#0891b2",
    "pants": "#1e1b4b",
    "pants_dark": "#0f172a",
    "shoes": "#d946ef",
    "shoes_dark": "#a21caf",
    "hair": "#06b6d4",
    "fur": "#d946ef",
    "fur_dark": "#a21caf",
    "white": "#cffafe",
    "white_dark": "#a5f3fc",
    "wood": "#312e81",
    "wood_dark": "#1e1b4b",
    "foliage": "#06b6d4",
    "foliage_dark": "#0891b2",
    "foliage_light": "#67e8f9",
    "stone": "#1e293b",
    "stone_dark": "#0f172a",
    "plaster": "#334155",
    "tiles": "#ec4899",
    "steel": "#67e8f9",
    "steel_dark": "#0891b2",
    "gold": "#facc15",
    "leather": "#d946ef",
    "ruby": "#06b6d4",
    "cork": "#4338ca",
    "glass_tint": "#06b6d444",
    "elixir": "#ec4899",
    "elixir_light": "#f472b6",
    "elixir_white": "#fce7f3",
    "white_specular": "#ffffffdd",
    "flame_dark": "#831843",
    "flame_trans": "#06b6d444",
    "flame_mid": "#db2777",
    "flame_bright": "#06b6d4",
    "flame_yellow": "#a5f3fc",
    "white": "#ffffff",
    "grass": "#06b6d4",
    "grass_light": "#67e8f9",
    "dirt": "#1e1b4b",
    "shadow": "#0a0e1755"
  },
  royal: {
    ".": "transparent",
    "O": "#160c24",
    "skin": "#fed7aa",
    "skin_dark": "#ea580c",
    "clothes": "#6b21a8",
    "clothes_dark": "#4c1d95",
    "pants": "#1e1b4b",
    "pants_dark": "#0f172a",
    "shoes": "#b45309",
    "shoes_dark": "#78350f",
    "hair": "#eab308",
    "fur": "#7c3aed",
    "fur_dark": "#5b21b6",
    "white": "#fef08a",
    "white_dark": "#fde047",
    "wood": "#4c1d95",
    "wood_dark": "#2e1065",
    "foliage": "#6b21a8",
    "foliage_dark": "#4c1d95",
    "foliage_light": "#a855f7",
    "stone": "#334155",
    "stone_dark": "#1e293b",
    "plaster": "#cbd5e1",
    "tiles": "#9333ea",
    "steel": "#e2e8f0",
    "steel_dark": "#64748b",
    "gold": "#fbbf24",
    "leather": "#4c1d95",
    "ruby": "#dc2626",
    "cork": "#b45309",
    "glass_tint": "#a855f733",
    "elixir": "#7c3aed",
    "elixir_light": "#a855f7",
    "elixir_white": "#f3e8ff",
    "white_specular": "#ffffffcc",
    "flame_dark": "#4c1d95",
    "flame_trans": "#7c3aed44",
    "flame_mid": "#9333ea",
    "flame_bright": "#fbbf24",
    "flame_yellow": "#fef08a",
    "white": "#ffffff",
    "grass": "#7c3aed",
    "grass_light": "#a855f7",
    "dirt": "#1e1b4b",
    "shadow": "#14082444"
  },
  gameboy: {
    ".": "transparent",
    "O": "#0f380f",
    "skin": "#8bac0f",
    "skin_dark": "#306230",
    "clothes": "#306230",
    "clothes_dark": "#0f380f",
    "pants": "#0f380f",
    "pants_dark": "#0f380f",
    "shoes": "#0f380f",
    "shoes_dark": "#0f380f",
    "hair": "#306230",
    "fur": "#8bac0f",
    "fur_dark": "#306230",
    "white": "#9bbc0f",
    "white_dark": "#8bac0f",
    "wood": "#306230",
    "wood_dark": "#0f380f",
    "foliage": "#8bac0f",
    "foliage_dark": "#306230",
    "foliage_light": "#9bbc0f",
    "stone": "#306230",
    "stone_dark": "#0f380f",
    "plaster": "#8bac0f",
    "tiles": "#306230",
    "steel": "#9bbc0f",
    "steel_dark": "#8bac0f",
    "gold": "#9bbc0f",
    "leather": "#306230",
    "ruby": "#306230",
    "cork": "#306230",
    "glass_tint": "#8bac0f44",
    "elixir": "#306230",
    "elixir_light": "#8bac0f",
    "elixir_white": "#9bbc0f",
    "white_specular": "#9bbc0fcc",
    "flame_dark": "#0f380f",
    "flame_trans": "#30623044",
    "flame_mid": "#306230",
    "flame_bright": "#8bac0f",
    "flame_yellow": "#9bbc0f",
    "white": "#9bbc0f",
    "grass": "#8bac0f",
    "grass_light": "#9bbc0f",
    "dirt": "#306230",
    "shadow": "#0f380f33"
  },
  pastel: {
    ".": "transparent",
    "O": "#334155",
    "skin": "#ffedd5",
    "skin_dark": "#fed7aa",
    "clothes": "#93c5fd",
    "clothes_dark": "#60a5fa",
    "pants": "#c4b5fd",
    "pants_dark": "#a78bfa",
    "shoes": "#fbcfe8",
    "shoes_dark": "#f472b6",
    "hair": "#fbcfe8",
    "fur": "#fed7aa",
    "fur_dark": "#fdba74",
    "white": "#f8fafc",
    "white_dark": "#f1f5f9",
    "wood": "#d6d3d1",
    "wood_dark": "#a8a29e",
    "foliage": "#86efac",
    "foliage_dark": "#4ade80",
    "foliage_light": "#bbf7d0",
    "stone": "#cbd5e1",
    "stone_dark": "#94a3b8",
    "plaster": "#f8fafc",
    "tiles": "#fca5a5",
    "steel": "#f1f5f9",
    "steel_dark": "#cbd5e1",
    "gold": "#fef08a",
    "leather": "#fdba74",
    "ruby": "#f87171",
    "cork": "#fed7aa",
    "glass_tint": "#93c5fd44",
    "elixir": "#f472b6",
    "elixir_light": "#fbcfe8",
    "elixir_white": "#fff1f2",
    "white_specular": "#ffffffcc",
    "flame_dark": "#f87171",
    "flame_trans": "#fda4af44",
    "flame_mid": "#fb923c",
    "flame_bright": "#fde047",
    "flame_yellow": "#fef08a",
    "white": "#ffffff",
    "grass": "#86efac",
    "grass_light": "#bbf7d0",
    "dirt": "#e7e5e4",
    "shadow": "#33415522"
  }
};

window.ArchetypeCompiler = class ArchetypeCompiler {
  static getArchetype(id) {
    return window.ARCHETYPE_REGISTRY[id] || null;
  }

  static getCategories() {
    const cats = {
      creatures: { label: "🐾 Creatures", archetypes: [] },
      nature: { label: "🌳 Nature & Environment", archetypes: [] },
      items: { label: "⚔️ Items & Gear", archetypes: [] },
      vfx: { label: "💥 Spells & VFX", archetypes: [] },
      tilesets: { label: "🗺️ Tilesets & Terrain", archetypes: [] }
    };
    for (const [id, arch] of Object.entries(window.ARCHETYPE_REGISTRY)) {
      const cat = arch.category || "creatures";
      if (cats[cat]) {
        cats[cat].archetypes.push({
          id,
          name: arch.name,
          description: arch.description,
          type: arch.type || ("bones" in arch ? "rig" : "layers"),
          recommendedSizes: arch.recommended_sizes || ["32x32", "48x48"]
        });
      }
    }
    return cats;
  }

  static compile(options = {}) {
    const archId = options.archetypeId || "humanoid";

    // Terrain tiles come from the seamless toroidal generator (tilegen.js).
    if (window.TileGen && window.TileGen.resolve(archId)) {
      const tw = Math.max(8, Math.min(128, parseInt(options.width || 32, 10)));
      const th = Math.max(8, Math.min(128, parseInt(options.height || 32, 10)));
      const tileSpec = window.TileGen.generateTileSpec(archId, parseInt(options.seed || 42, 10), tw, th);
      tileSpec.label = `${archId} (${tw}×${th}, seamless)`;
      return tileSpec;
    }
    const arch = this.getArchetype(archId);
    if (!arch) throw new Error("Archetype not found: " + archId);

    const width = Math.max(8, Math.min(128, parseInt(options.width || 48, 10)));
    const height = Math.max(8, Math.min(128, parseInt(options.height || 48, 10)));
    const action = options.action || (arch.locomotion ? Object.keys(arch.locomotion)[0] : (arch.motion ? Object.keys(arch.motion)[0] : "walk"));
    const headScale = parseFloat(options.headScale || 1.0);
    const buildScale = parseFloat(options.buildScale || 1.0);
    const theme = options.paletteTheme || "classic";
    const outlineMode = options.outlineMode || "none";

    const scaleFactor = Math.min(width, height);
    const isRig = "bones" in arch;

    // Resolve Palette
    const basePalette = window.DEFAULT_ARCHETYPE_PALETTES[archId] || window.DEFAULT_ARCHETYPE_PALETTES["humanoid"] || {};
    let resolvedPalette = JSON.parse(JSON.stringify(basePalette));
    if (theme !== "classic" && window.ARCHETYPE_THEME_PALETTES[theme]) {
      const themePalette = window.ARCHETYPE_THEME_PALETTES[theme];
      for (const [k, v] of Object.entries(themePalette)) {
        if (resolvedPalette[k] !== undefined || ["O", ".", "shadow"].includes(k)) {
          resolvedPalette[k] = v;
        }
      }
    }

    const spec = {
      name: `${archId}_${action}_${width}x${height}`,
      label: `${arch.name} (${width}×${height})`,
      author: "PixelDSL Archetype Engine",
      description: arch.description,
      width: width,
      height: height,
      fps: 8,
      palette: resolvedPalette
    };

    if (isRig) {
      spec.type = "rig";
      const scaledBones = [];
      for (const b of (arch.bones || [])) {
        const nb = { id: b.id };
        if (b.parent) nb.parent = b.parent;
        if (b.u !== undefined && b.v !== undefined) {
          nb.x = Math.round(b.u * (width - 1) * 10) / 10;
          nb.y = Math.round(b.v * (height - 1) * 10) / 10;
        }
        if (b.offset_u) {
          nb.offset = [
            Math.round(b.offset_u[0] * scaleFactor * 10) / 10,
            Math.round(b.offset_u[1] * scaleFactor * 10) / 10
          ];
        }
        if (b.length_u !== undefined) {
          nb.length = Math.round(b.length_u * scaleFactor * 10) / 10;
        }
        if (b.angle !== undefined) nb.angle = b.angle;
        if (b.shape) nb.shape = b.shape;

        let rScale = buildScale;
        if (b.id.includes("head") || b.id.includes("ear")) {
          rScale *= headScale;
        }

        if (b.r1_u !== undefined) {
          nb.r1 = Math.max(0.6, Math.round(b.r1_u * scaleFactor * rScale * 10) / 10);
        }
        if (b.r2_u !== undefined) {
          nb.r2 = Math.max(0.6, Math.round(b.r2_u * scaleFactor * rScale * 10) / 10);
        }
        if (b.z !== undefined) nb.z = b.z;
        if (b.fill) nb.fill = b.fill;

        if (b.features) {
          const scaledFeats = {};
          for (const [fk, fv] of Object.entries(b.features)) {
            const sf = Object.assign({}, fv);
            if (sf.dx_u !== undefined) {
              sf.dx = Math.round(sf.dx_u * scaleFactor * headScale * 10) / 10;
              delete sf.dx_u;
            }
            if (sf.dy_u !== undefined) {
              sf.dy = Math.round(sf.dy_u * scaleFactor * headScale * 10) / 10;
              delete sf.dy_u;
            }
            if (sf.w_u !== undefined) {
              sf.w = Math.max(1.0, Math.round(sf.w_u * scaleFactor * headScale * 10) / 10);
              delete sf.w_u;
            }
            if (sf.h_u !== undefined) {
              sf.h = Math.max(1.0, Math.round(sf.h_u * scaleFactor * headScale * 10) / 10);
              delete sf.h_u;
            }
            scaledFeats[fk] = sf;
          }
          nb.features = scaledFeats;
        }

        scaledBones.push(nb);
      }

      spec.rig = {
        outline: outlineMode,
        outlineWidth: outlineMode !== "none" ? 1 : 0,
        bones: scaledBones
      };

      const loco = (arch.locomotion && arch.locomotion[action]) || null;
      const numFrames = parseInt(options.frames, 10) || (loco ? loco.default_frames || 8 : 1);
      spec.label = `${arch.name} (${width}×${height}) [${numFrames}f]`;
      const framesList = [];

      if (loco && numFrames > 1) {
        for (let fi = 0; fi < numFrames; fi++) {
          const t = fi / numFrames;
          const tRad = t * 2.0 * Math.PI;
          const poseDeltas = {};

          if (archId === "humanoid") {
            const hipSw = loco.hip_swing_deg || 26.0;
            const kneeB = loco.knee_bend_deg || 35.0;
            const armSw = loco.arm_swing_deg || 24.0;
            const elbB = loco.elbow_bend_deg || 16.0;
            const bobAmp = (loco.pelvis_bob_amplitude || 0.025) * height;

            poseDeltas["pelvis"] = { dy: Math.round(-bobAmp * Math.abs(Math.sin(tRad)) * 10) / 10 };
            poseDeltas["leg_near_thigh"] = { dAngle: Math.round(hipSw * Math.sin(tRad) * 10) / 10 };
            poseDeltas["leg_near_shin"] = { dAngle: Math.round(kneeB * Math.max(0, -Math.sin(tRad - 0.2)) * 10) / 10 };
            poseDeltas["leg_far_thigh"] = { dAngle: Math.round(hipSw * Math.sin(tRad + Math.PI) * 10) / 10 };
            poseDeltas["leg_far_shin"] = { dAngle: Math.round(kneeB * Math.max(0, -Math.sin(tRad + Math.PI - 0.2)) * 10) / 10 };
            poseDeltas["arm_near_upper"] = { dAngle: Math.round(-armSw * Math.sin(tRad) * 10) / 10 };
            poseDeltas["arm_near_lower"] = { dAngle: Math.round(elbB * Math.max(0, Math.sin(tRad)) * 10) / 10 };
            poseDeltas["arm_far_upper"] = { dAngle: Math.round(-armSw * Math.sin(tRad + Math.PI) * 10) / 10 };
            poseDeltas["arm_far_lower"] = { dAngle: Math.round(elbB * Math.max(0, Math.sin(tRad + Math.PI)) * 10) / 10 };
          } else if (archId === "quadruped_feline") {
            const thighSw = loco.thigh_swing_deg || 22.0;
            const hockFl = loco.hock_flex_deg || 28.0;
            const foreSw = loco.forearm_swing_deg || 24.0;
            const pHf = (loco.phase_hind_far || 0.0) * 2.0 * Math.PI;
            const pFn = (loco.phase_fore_near || 0.25) * 2.0 * Math.PI;
            const pHn = (loco.phase_hind_near || 0.50) * 2.0 * Math.PI;
            const pFf = (loco.phase_fore_far || 0.75) * 2.0 * Math.PI;

            poseDeltas["hind_thigh_far"] = { dAngle: Math.round(thighSw * Math.sin(tRad + pHf) * 10) / 10 };
            poseDeltas["hind_shin_far"] = { dAngle: Math.round(hockFl * Math.max(0, -Math.sin(tRad + pHf)) * 10) / 10 };
            poseDeltas["fore_arm_far"] = { dAngle: Math.round(foreSw * Math.sin(tRad + pFf) * 10) / 10 };
            poseDeltas["hind_thigh_near"] = { dAngle: Math.round(thighSw * Math.sin(tRad + pHn) * 10) / 10 };
            poseDeltas["hind_shin_near"] = { dAngle: Math.round(hockFl * Math.max(0, -Math.sin(tRad + pHn)) * 10) / 10 };
            poseDeltas["fore_arm_near"] = { dAngle: Math.round(foreSw * Math.sin(tRad + pFn) * 10) / 10 };

            const spineW = Math.round((loco.spine_wave_amplitude_deg || 4.5) * Math.sin(tRad * 2.0) * 10) / 10;
            poseDeltas["lumbar"] = { dAngle: spineW };
            poseDeltas["chest"] = { dAngle: -Math.round(spineW * 0.7 * 10) / 10 };
            poseDeltas["tail_mid"] = { dAngle: Math.round((loco.tail_sway_amplitude_deg || 8.0) * Math.sin(tRad) * 10) / 10 };
          } else if (archId === "quadruped_canine") {
            const thighSw = loco.thigh_swing_deg || 28.0;
            const hockFl = loco.hock_flex_deg || 35.0;
            const foreSw = loco.forearm_swing_deg || 32.0;
            const bobAmp = (loco.pelvis_bob_amplitude || 0.03) * height;

            poseDeltas["pelvis"] = { dy: Math.round(-bobAmp * Math.abs(Math.sin(tRad * 2.0)) * 10) / 10 };
            poseDeltas["hind_thigh_far"] = { dAngle: Math.round(thighSw * Math.sin(tRad) * 10) / 10 };
            poseDeltas["hind_shin_far"] = { dAngle: Math.round(hockFl * Math.max(0, -Math.sin(tRad)) * 10) / 10 };
            poseDeltas["fore_arm_near"] = { dAngle: Math.round(foreSw * Math.sin(tRad) * 10) / 10 };
            poseDeltas["hind_thigh_near"] = { dAngle: Math.round(thighSw * Math.sin(tRad + Math.PI) * 10) / 10 };
            poseDeltas["hind_shin_near"] = { dAngle: Math.round(hockFl * Math.max(0, -Math.sin(tRad + Math.PI)) * 10) / 10 };
            poseDeltas["fore_arm_far"] = { dAngle: Math.round(foreSw * Math.sin(tRad + Math.PI) * 10) / 10 };
          } else if (archId === "avian_bird") {
            const flapAmp = loco.wing_flap_amplitude_deg || 48.0;
            const foldAmp = loco.wing_fold_amplitude_deg || 28.0;
            const bobAmp = (loco.torso_bob_amplitude || 0.035) * height;

            const wingFlap = Math.round(flapAmp * Math.sin(tRad) * 10) / 10;
            const wingFold = Math.round(foldAmp * Math.max(0, Math.sin(tRad + 0.5)) * 10) / 10;
            poseDeltas["torso"] = { dy: Math.round(-bobAmp * Math.sin(tRad) * 10) / 10 };
            poseDeltas["wing_arm_near"] = { dAngle: wingFlap };
            poseDeltas["wing_fore_near"] = { dAngle: wingFold };
            poseDeltas["wing_tip_near"] = { dAngle: Math.round(wingFold * 0.7 * 10) / 10 };
            poseDeltas["wing_arm_far"] = { dAngle: wingFlap };
            poseDeltas["wing_fore_far"] = { dAngle: wingFold };
            poseDeltas["wing_tip_far"] = { dAngle: Math.round(wingFold * 0.7 * 10) / 10 };
          } else if (archId === "mythic_dragon") {
            const flapAmp = loco.wing_flap_amplitude_deg || 52.0;
            const foldAmp = loco.wing_fold_amplitude_deg || 30.0;
            const bobAmp = (loco.torso_bob_amplitude || 0.04) * height;
            const wingFlap = Math.round(flapAmp * Math.sin(tRad) * 10) / 10;
            const wingFold = Math.round(foldAmp * Math.max(0, Math.sin(tRad + 0.4)) * 10) / 10;
            const tailSway = Math.round((loco.tail_sway_amplitude_deg || 14.0) * Math.sin(tRad - 0.8) * 10) / 10;

            poseDeltas["pelvis"] = { dy: Math.round(-bobAmp * Math.sin(tRad) * 10) / 10 };
            poseDeltas["neck"] = { dAngle: Math.round(-6.0 * Math.sin(tRad) * 10) / 10 };
            poseDeltas["wing_arm_near"] = { dAngle: wingFlap };
            poseDeltas["wing_finger_near"] = { dAngle: wingFold };
            poseDeltas["wing_arm_far"] = { dAngle: wingFlap };
            poseDeltas["wing_finger_far"] = { dAngle: wingFold };
            poseDeltas["tail_base"] = { dAngle: tailSway };
            poseDeltas["tail_mid"] = { dAngle: Math.round(tailSway * 1.2 * 10) / 10 };
            poseDeltas["tail_tip"] = { dAngle: Math.round(tailSway * 1.4 * 10) / 10 };
            poseDeltas["hind_thigh_near"] = { dAngle: Math.round(15.0 * Math.sin(tRad) * 10) / 10 };
            poseDeltas["hind_thigh_far"] = { dAngle: Math.round(15.0 * Math.sin(tRad) * 10) / 10 };
          } else if (archId === "crawler_spider") {
            const legAmp = loco.leg_swing_amplitude_deg || 26.0;
            const shinAmp = loco.shin_flex_amplitude_deg || 22.0;
            const sw1 = Math.round(legAmp * Math.sin(tRad) * 10) / 10;
            const sw2 = Math.round(legAmp * Math.sin(tRad + Math.PI) * 10) / 10;
            const sh1 = Math.round(shinAmp * Math.max(0, Math.sin(tRad)) * 10) / 10;
            const sh2 = Math.round(shinAmp * Math.max(0, Math.sin(tRad + Math.PI)) * 10) / 10;

            poseDeltas["leg_f1_thigh"] = { dAngle: sw1 };
            poseDeltas["leg_f1_shin"] = { dAngle: sh1 };
            poseDeltas["leg_f3_thigh"] = { dAngle: sw1 };
            poseDeltas["leg_f3_shin"] = { dAngle: sh1 };
            poseDeltas["leg_n2_thigh"] = { dAngle: sw1 };
            poseDeltas["leg_n2_shin"] = { dAngle: -sh1 };
            poseDeltas["leg_n4_thigh"] = { dAngle: sw1 };
            poseDeltas["leg_n4_shin"] = { dAngle: -sh1 };

            poseDeltas["leg_f2_thigh"] = { dAngle: sw2 };
            poseDeltas["leg_f2_shin"] = { dAngle: sh2 };
            poseDeltas["leg_f4_thigh"] = { dAngle: sw2 };
            poseDeltas["leg_f4_shin"] = { dAngle: sh2 };
            poseDeltas["leg_n1_thigh"] = { dAngle: sw2 };
            poseDeltas["leg_n1_shin"] = { dAngle: -sh2 };
            poseDeltas["leg_n3_thigh"] = { dAngle: sw2 };
            poseDeltas["leg_n3_shin"] = { dAngle: -sh2 };
          } else if (archId === "serpent_snake") {
            const waveAmp = loco.wave_amplitude_deg || 25.0;
            const step = loco.wave_phase_step || 0.85;
            poseDeltas["seg1_head"] = { dAngle: Math.round(waveAmp * 0.5 * Math.sin(tRad) * 10) / 10 };
            poseDeltas["seg2_hood"] = { dAngle: Math.round(waveAmp * Math.sin(tRad - step) * 10) / 10 };
            poseDeltas["seg3_body1"] = { dAngle: Math.round(waveAmp * Math.sin(tRad - step * 2) * 10) / 10 };
            poseDeltas["seg4_body2"] = { dAngle: Math.round(waveAmp * Math.sin(tRad - step * 3) * 10) / 10 };
            poseDeltas["seg5_tail1"] = { dAngle: Math.round(waveAmp * Math.sin(tRad - step * 4) * 10) / 10 };
            poseDeltas["seg6_tail2"] = { dAngle: Math.round(waveAmp * 1.3 * Math.sin(tRad - step * 5) * 10) / 10 };
          } else if (archId === "golem_stone") {
            const fistSw = loco.fist_swing_deg || 24.0;
            const legSw = loco.leg_swing_deg || 22.0;
            const bobAmp = (loco.stomp_bob_amplitude || 0.035) * height;

            poseDeltas["pelvis"] = { dy: Math.round(-bobAmp * Math.abs(Math.sin(tRad * 2.0)) * 10) / 10 };
            poseDeltas["shoulder_near"] = { dAngle: Math.round(fistSw * Math.sin(tRad) * 10) / 10 };
            poseDeltas["shoulder_far"] = { dAngle: Math.round(-fistSw * Math.sin(tRad) * 10) / 10 };
            poseDeltas["leg_near_thigh"] = { dAngle: Math.round(-legSw * Math.sin(tRad) * 10) / 10 };
            poseDeltas["leg_far_thigh"] = { dAngle: Math.round(legSw * Math.sin(tRad) * 10) / 10 };
          }

          framesList.push({ pose: poseDeltas });
        }
      }
      spec.frames = framesList;

    } else {
      // SDF Layer-based Archetype
      spec.type = "layers";
      const scaledLayers = [];
      for (const lay of (arch.layers || [])) {
        const nl = Object.assign({}, lay);
        if (nl.cx_u !== undefined) nl.cx = Math.round(nl.cx_u * (width - 1) * 10) / 10;
        if (nl.cy_u !== undefined) nl.cy = Math.round(nl.cy_u * (height - 1) * 10) / 10;
        if (nl.rx_u !== undefined) nl.rx = Math.round(nl.rx_u * scaleFactor * buildScale * 10) / 10;
        if (nl.ry_u !== undefined) nl.ry = Math.round(nl.ry_u * scaleFactor * buildScale * 10) / 10;
        if (nl.r_u !== undefined) nl.r = Math.round(nl.r_u * scaleFactor * buildScale * 10) / 10;
        if (nl.r2_u !== undefined) nl.r2 = Math.round(nl.r2_u * scaleFactor * buildScale * 10) / 10;
        if (nl.d_u !== undefined) nl.d = Math.round(nl.d_u * scaleFactor * buildScale * 10) / 10;
        if (nl.x_u !== undefined) nl.x = Math.round(nl.x_u * (width - 1) * 10) / 10;
        if (nl.y_u !== undefined) nl.y = Math.round(nl.y_u * (height - 1) * 10) / 10;
        if (nl.w_u !== undefined) nl.w = Math.round(nl.w_u * width * buildScale * 10) / 10;
        if (nl.h_u !== undefined) nl.h = Math.round(nl.h_u * height * buildScale * 10) / 10;
        if (nl.x1_u !== undefined) nl.x1 = Math.round(nl.x1_u * (width - 1) * 10) / 10;
        if (nl.y1_u !== undefined) nl.y1 = Math.round(nl.y1_u * (height - 1) * 10) / 10;
        if (nl.x2_u !== undefined) nl.x2 = Math.round(nl.x2_u * (width - 1) * 10) / 10;
        if (nl.y2_u !== undefined) nl.y2 = Math.round(nl.y2_u * (height - 1) * 10) / 10;
        if (nl.r1_u !== undefined) nl.r1 = Math.round(nl.r1_u * scaleFactor * buildScale * 10) / 10;
        if (nl.r2_u !== undefined) nl.r2 = Math.round(nl.r2_u * scaleFactor * buildScale * 10) / 10;

        delete nl.cx_u; delete nl.cy_u; delete nl.rx_u; delete nl.ry_u;
        delete nl.r_u; delete nl.r2_u; delete nl.d_u;
        delete nl.x_u; delete nl.y_u; delete nl.w_u; delete nl.h_u;
        delete nl.x1_u; delete nl.y1_u; delete nl.x2_u; delete nl.y2_u;
        delete nl.r1_u; delete nl.r2_u;

        if (nl.points_u) {
          nl.points = nl.points_u.map(p => [
            Math.round(p[0] * (width - 1) * 10) / 10,
            Math.round(p[1] * (height - 1) * 10) / 10
          ]);
          delete nl.points_u;
        }

        scaledLayers.push(nl);
      }

      spec.layers = scaledLayers;
      spec.postProcess = {
        autoOutline: outlineMode !== "none",
        outlineColor: "#141824",
        autoShading: false,
        sdfShading: true,
        selOut: outlineMode === "sel_out"
      };

      const motionDef = arch.motion ? (arch.motion[action] || Object.values(arch.motion)[0]) : null;
      const numFrames = parseInt(options.frames, 10) || (motionDef ? motionDef.default_frames || 1 : 1);
      spec.label = `${arch.name} (${width}×${height}) [${numFrames}f]`;
      const framesList = [];

      if (numFrames > 1 && motionDef) {
        for (let fi = 0; fi < numFrames; fi++) {
          const t = fi / numFrames;
          const tRad = t * 2.0 * Math.PI;
          const fLayers = {};

          if (motionDef.sway_amplitude_u !== undefined) {
            const swayPx = Math.round(motionDef.sway_amplitude_u * width * Math.sin(tRad) * 10) / 10;
            for (const lay of scaledLayers) {
              if (lay.id.includes("canopy") || lay.id.includes("top")) {
                fLayers[lay.id] = { dx: swayPx };
              }
            }
          }

          if (motionDef.rotate_corona_deg !== undefined) {
            const rotDeg = Math.round(motionDef.rotate_corona_deg * Math.sin(tRad) * 10) / 10;
            for (const lay of scaledLayers) {
              if (lay.id.includes("corona") || lay.id.includes("flare")) {
                fLayers[lay.id] = { dAngle: rotDeg };
              }
            }
          }

          framesList.push({ layers: fLayers });
        }
      }
      spec.frames = framesList;
    }

    return spec;
  }
};
