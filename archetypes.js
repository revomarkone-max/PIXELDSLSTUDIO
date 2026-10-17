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
        "v": 0.48,
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
        "r2_u": 0.09,
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
        "length_u": 0.035,
        "angle": 0,
        "r1_u": 0.04,
        "r2_u": 0.04,
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
        "r1_u": 0.1,
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
