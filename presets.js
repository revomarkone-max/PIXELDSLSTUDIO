// PixelDSL Studio v3.0 — Curated Procedural & Mathematical Asset Presets
// Zero-dependency mathematical 2.5D SDFs, Skeletal Capsule Rigs, and GLSL Shaders.

if (typeof window === "undefined") { global.window = global; }
window.PIXEL_PRESETS = window.PIXEL_PRESETS || {};

window.PIXEL_PRESETS["ginger_cat_walk_120x80"] = {
  label: "🐱 Ginger Cat Walk Cycle (120×80) [12f]",
  prompt: "Procedural 2.5D Skeletal Capsule Rig of a Ginger Cat walking right. Exactly 12-frame natural feline cadence (LH->LF->RH->RF), upright arched tail, white chest bib, paws & tail tip, emerald green eyes, without outer outline.",
  data: {
  "type": "rig",
  "name": "ginger_cat_walk_120x80",
  "label": "🐱 Ginger Cat Walk Cycle (120×80) [12f]",
  "author": "PixelDSL Studio",
  "description": "Procedural 2.5D Skeletal Capsule Rig of a Ginger Cat walking right. Exactly 12-frame natural feline cadence (LH->LF->RH->RF), upright arched tail, white chest bib, paws & tail tip, emerald green eyes, without outer outline.",
  "width": 120,
  "height": 80,
  "fps": 8,
  "rig": {
    "outline": "none",
    "outlineWidth": 0,
    "bones": [
      {
        "id": "pelvis",
        "x": 44.0,
        "y": 42.0,
        "origin": [
          44.0,
          42.0
        ],
        "length": 0.0,
        "angle": 0.0,
        "r1": 11.0,
        "r2": 11.0,
        "fill": "O",
        "z": 3.0
      },
      {
        "id": "spine",
        "parent": "pelvis",
        "offset": [
          0.0,
          0.0
        ],
        "length": 15.0,
        "angle": 1.5,
        "r1": 11.0,
        "r2": 11.5,
        "fill": "O",
        "z": 3.0
      },
      {
        "id": "chest",
        "parent": "spine",
        "offset": [
          0.0,
          0.0
        ],
        "length": 14.0,
        "angle": -0.8,
        "r1": 11.5,
        "r2": 12.0,
        "fill": "O",
        "z": 3.0
      },
      {
        "id": "belly",
        "parent": "spine",
        "offset": [
          -2.0,
          4.0
        ],
        "length": 13.0,
        "angle": 0.0,
        "r1": 6.5,
        "r2": 6.5,
        "fill": "W",
        "z": 2.8
      },
      {
        "id": "chest_bib",
        "parent": "chest",
        "offset": [
          2.5,
          1.0
        ],
        "length": 8.0,
        "angle": 42.0,
        "r1": 6.5,
        "r2": 4.5,
        "fill": "W",
        "z": 3.5
      },
      {
        "id": "neck",
        "parent": "chest",
        "offset": [
          0.0,
          -3.0
        ],
        "length": 8.0,
        "angle": -32.0,
        "r1": 8.5,
        "r2": 7.5,
        "fill": "O",
        "z": 4.0
      },
      {
        "id": "head",
        "parent": "neck",
        "offset": [
          -1.0,
          -1.0
        ],
        "length": 5.0,
        "angle": 30.0,
        "r1": 8.5,
        "r2": 8.5,
        "shape": "head_oval",
        "fill": "O",
        "z": 6.0,
        "features": {
          "eyes": {
            "dx": 0.8,
            "dy": -1.5,
            "w": 3.0,
            "h": 4.0,
            "color": "#25b854"
          }
        }
      },
      {
        "id": "muzzle",
        "parent": "head",
        "offset": [
          4.0,
          2.2
        ],
        "length": 3.5,
        "angle": 5.0,
        "r1": 4.0,
        "r2": 4.8,
        "shape": "head_oval",
        "fill": "W",
        "z": 6.5
      },
      {
        "id": "nose",
        "parent": "muzzle",
        "offset": [
          3.8,
          -1.0
        ],
        "length": 0.0,
        "angle": 0.0,
        "r1": 1.3,
        "r2": 1.4,
        "shape": "head_oval",
        "fill": "P",
        "z": 7.0
      },
      {
        "id": "ear_front",
        "parent": "head",
        "offset": [
          -2.0,
          -6.5
        ],
        "length": 8.5,
        "angle": -68.0,
        "r1": 4.5,
        "r2": 1.0,
        "fill": "O",
        "z": 7.0
      },
      {
        "id": "ear_front_inner",
        "parent": "head",
        "offset": [
          -1.2,
          -5.5
        ],
        "length": 6.0,
        "angle": -68.0,
        "r1": 2.4,
        "r2": 0.8,
        "fill": "P",
        "z": 7.5
      },
      {
        "id": "ear_back",
        "parent": "head",
        "offset": [
          -5.5,
          -6.0
        ],
        "length": 8.0,
        "angle": -75.0,
        "r1": 3.8,
        "r2": 1.0,
        "fill": "D",
        "z": 2.0
      },
      {
        "id": "tail_base",
        "parent": "pelvis",
        "offset": [
          -6.0,
          -2.0
        ],
        "length": 12.0,
        "angle": -140.0,
        "r1": 3.8,
        "r2": 3.2,
        "fill": "O",
        "z": 2.0
      },
      {
        "id": "tail_mid",
        "parent": "tail_base",
        "offset": [
          0.0,
          0.0
        ],
        "length": 12.0,
        "angle": 43.1,
        "r1": 3.2,
        "r2": 2.6,
        "fill": "O",
        "z": 2.0
      },
      {
        "id": "tail_tip",
        "parent": "tail_mid",
        "offset": [
          0.0,
          0.0
        ],
        "length": 11.0,
        "angle": 35.5,
        "r1": 2.6,
        "r2": 1.8,
        "fill": "W",
        "z": 2.0
      },
      {
        "id": "thigh_l",
        "parent": "pelvis",
        "offset": [
          -1.0,
          1.0
        ],
        "length": 14.0,
        "angle": 42.0,
        "r1": 6.8,
        "r2": 4.5,
        "fill": "D",
        "z": 1.0
      },
      {
        "id": "shin_l",
        "parent": "thigh_l",
        "offset": [
          0.0,
          0.0
        ],
        "length": 13.5,
        "angle": 89.3,
        "r1": 3.8,
        "r2": 2.8,
        "fill": "D",
        "z": 1.0
      },
      {
        "id": "paw_l",
        "parent": "shin_l",
        "offset": [
          0.0,
          0.0
        ],
        "length": 4.5,
        "angle": -59.7,
        "r1": 3.0,
        "r2": 2.4,
        "fill": "S",
        "z": 1.0
      },
      {
        "id": "thigh_r",
        "parent": "pelvis",
        "offset": [
          1.5,
          1.0
        ],
        "length": 14.0,
        "angle": 82.7,
        "r1": 7.4,
        "r2": 5.0,
        "fill": "O",
        "z": 5.0,
        "crease": true
      },
      {
        "id": "shin_r",
        "parent": "thigh_r",
        "offset": [
          0.0,
          0.0
        ],
        "length": 13.5,
        "angle": 72.7,
        "r1": 4.2,
        "r2": 3.0,
        "fill": "O",
        "z": 5.0
      },
      {
        "id": "paw_r",
        "parent": "shin_r",
        "offset": [
          0.0,
          0.0
        ],
        "length": 4.5,
        "angle": -83.9,
        "r1": 3.4,
        "r2": 2.6,
        "fill": "W",
        "z": 5.0
      },
      {
        "id": "arm_l",
        "parent": "chest",
        "offset": [
          1.0,
          2.0
        ],
        "length": 13.0,
        "angle": 139.8,
        "r1": 4.8,
        "r2": 3.4,
        "fill": "D",
        "z": 1.0
      },
      {
        "id": "forearm_l",
        "parent": "arm_l",
        "offset": [
          0.0,
          0.0
        ],
        "length": 12.0,
        "angle": -112.0,
        "r1": 3.2,
        "r2": 2.6,
        "fill": "D",
        "z": 1.0
      },
      {
        "id": "paw_front_l",
        "parent": "forearm_l",
        "offset": [
          0.0,
          0.0
        ],
        "length": 4.5,
        "angle": 47.4,
        "r1": 2.9,
        "r2": 2.4,
        "fill": "S",
        "z": 1.0
      },
      {
        "id": "arm_r",
        "parent": "chest",
        "offset": [
          3.0,
          2.0
        ],
        "length": 13.0,
        "angle": 127.2,
        "r1": 5.4,
        "r2": 3.8,
        "fill": "O",
        "z": 5.0,
        "crease": true
      },
      {
        "id": "forearm_r",
        "parent": "arm_r",
        "offset": [
          0.0,
          0.0
        ],
        "length": 12.0,
        "angle": -73.6,
        "r1": 3.5,
        "r2": 2.8,
        "fill": "O",
        "z": 5.0
      },
      {
        "id": "paw_front_r",
        "parent": "forearm_r",
        "offset": [
          0.0,
          0.0
        ],
        "length": 4.5,
        "angle": 21.6,
        "r1": 3.2,
        "r2": 2.6,
        "fill": "W",
        "z": 5.0
      }
    ]
  },
  "palette": {
    ".": null,
    "O": "#e8731d",
    "L": "#fba543",
    "D": "#b24c14",
    "d": "#82320b",
    "T": "#722909",
    "W": "#fef3e4",
    "S": "#d9be9e",
    "P": "#f69fa5",
    "E": "#25b854",
    "w": "#ffffff"
  },
  "postProcess": {
    "autoOutline": false,
    "sdfShading": true
  },
  "frames": [
    {
      "name": "Walk Step 2/12",
      "pose": {
        "pelvis": {
          "dy": 0.6
        },
        "spine": {
          "dAngle": -0.7
        },
        "chest": {
          "dAngle": 0.4
        },
        "neck": {
          "dy": -0.2,
          "dAngle": -0.3
        },
        "head": {
          "dAngle": 0.9
        },
        "tail_base": {
          "dAngle": 2.5
        },
        "tail_mid": {
          "dAngle": 2.9
        },
        "tail_tip": {
          "dAngle": -1.5
        },
        "thigh_l": {
          "dAngle": 4.0
        },
        "shin_l": {
          "dAngle": 3.9
        },
        "paw_l": {
          "dAngle": -7.9
        },
        "thigh_r": {
          "dAngle": -7.5
        },
        "shin_r": {
          "dAngle": 17.7
        },
        "paw_r": {
          "dAngle": -10.1
        },
        "arm_l": {
          "dAngle": -18.5
        },
        "forearm_l": {
          "dAngle": 21.0
        },
        "paw_front_l": {
          "dAngle": -2.1
        },
        "arm_r": {
          "dAngle": 4.6
        },
        "forearm_r": {
          "dAngle": 2.9
        },
        "paw_front_r": {
          "dAngle": -7.1
        }
      }
    },
    {
      "name": "Walk Step 3/12",
      "pose": {
        "pelvis": {
          "dy": 0.6
        },
        "spine": {
          "dAngle": -2.2
        },
        "chest": {
          "dAngle": 1.2
        },
        "neck": {
          "dy": -0.2,
          "dAngle": -0.5
        },
        "head": {
          "dAngle": 1.6
        },
        "tail_base": {
          "dAngle": 4.3
        },
        "tail_mid": {
          "dAngle": 6.9
        },
        "tail_tip": {
          "dAngle": 0.0
        },
        "thigh_l": {
          "dAngle": 10.5
        },
        "shin_l": {
          "dAngle": 3.0
        },
        "paw_l": {
          "dAngle": -13.5
        },
        "thigh_r": {
          "dAngle": -22.7
        },
        "shin_r": {
          "dAngle": 48.3
        },
        "paw_r": {
          "dAngle": -25.5
        },
        "arm_l": {
          "dAngle": -28.2
        },
        "forearm_l": {
          "dAngle": 36.9
        },
        "paw_front_l": {
          "dAngle": -7.5
        },
        "arm_r": {
          "dAngle": 9.3
        },
        "forearm_r": {
          "dAngle": 6.1
        },
        "paw_front_r": {
          "dAngle": -14.3
        }
      }
    },
    {
      "name": "Walk Step 4/12",
      "pose": {
        "pelvis": {
          "dy": 0.0
        },
        "spine": {
          "dAngle": -3.0
        },
        "chest": {
          "dAngle": 1.6
        },
        "neck": {
          "dy": 0.0,
          "dAngle": -0.5
        },
        "head": {
          "dAngle": 1.8
        },
        "tail_base": {
          "dAngle": 5.0
        },
        "tail_mid": {
          "dAngle": 10.9
        },
        "tail_tip": {
          "dAngle": 4.0
        },
        "thigh_l": {
          "dAngle": 18.7
        },
        "shin_l": {
          "dAngle": -2.7
        },
        "paw_l": {
          "dAngle": -16.0
        },
        "thigh_r": {
          "dAngle": -38.2
        },
        "shin_r": {
          "dAngle": 47.0
        },
        "paw_r": {
          "dAngle": -8.7
        },
        "arm_l": {
          "dAngle": -30.1
        },
        "forearm_l": {
          "dAngle": 43.1
        },
        "paw_front_l": {
          "dAngle": -11.4
        },
        "arm_r": {
          "dAngle": 13.5
        },
        "forearm_r": {
          "dAngle": 9.4
        },
        "paw_front_r": {
          "dAngle": -21.4
        }
      }
    },
    {
      "name": "Walk Step 5/12",
      "pose": {
        "pelvis": {
          "dy": -0.6
        },
        "spine": {
          "dAngle": -2.3
        },
        "chest": {
          "dAngle": 1.2
        },
        "neck": {
          "dy": 0.2,
          "dAngle": -0.5
        },
        "head": {
          "dAngle": 1.6
        },
        "tail_base": {
          "dAngle": 4.3
        },
        "tail_mid": {
          "dAngle": 13.8
        },
        "tail_tip": {
          "dAngle": 9.5
        },
        "thigh_l": {
          "dAngle": 27.0
        },
        "shin_l": {
          "dAngle": -9.7
        },
        "paw_l": {
          "dAngle": -17.3
        },
        "thigh_r": {
          "dAngle": -42.9
        },
        "shin_r": {
          "dAngle": 30.4
        },
        "paw_r": {
          "dAngle": 12.6
        },
        "arm_l": {
          "dAngle": -23.0
        },
        "forearm_l": {
          "dAngle": 38.6
        },
        "paw_front_l": {
          "dAngle": -14.4
        },
        "arm_r": {
          "dAngle": 21.0
        },
        "forearm_r": {
          "dAngle": -8.9
        },
        "paw_front_r": {
          "dAngle": -11.0
        }
      }
    },
    {
      "name": "Walk Step 6/12",
      "pose": {
        "pelvis": {
          "dy": -0.6
        },
        "spine": {
          "dAngle": -0.7
        },
        "chest": {
          "dAngle": 0.4
        },
        "neck": {
          "dy": 0.2,
          "dAngle": -0.3
        },
        "head": {
          "dAngle": 0.9
        },
        "tail_base": {
          "dAngle": 2.5
        },
        "tail_mid": {
          "dAngle": 14.9
        },
        "tail_tip": {
          "dAngle": 15.0
        },
        "thigh_l": {
          "dAngle": 34.2
        },
        "shin_l": {
          "dAngle": -14.4
        },
        "paw_l": {
          "dAngle": -19.9
        },
        "thigh_r": {
          "dAngle": -42.0
        },
        "shin_r": {
          "dAngle": 19.0
        },
        "paw_r": {
          "dAngle": 23.0
        },
        "arm_l": {
          "dAngle": -17.4
        },
        "forearm_l": {
          "dAngle": 37.0
        },
        "paw_front_l": {
          "dAngle": -19.3
        },
        "arm_r": {
          "dAngle": 30.2
        },
        "forearm_r": {
          "dAngle": -43.0
        },
        "paw_front_r": {
          "dAngle": 13.2
        }
      }
    },
    {
      "name": "Walk Step 7/12",
      "pose": {
        "pelvis": {
          "dy": -0.0
        },
        "spine": {
          "dAngle": 0.0
        },
        "chest": {
          "dAngle": 0.0
        },
        "neck": {
          "dy": 0.0,
          "dAngle": 0.0
        },
        "head": {
          "dAngle": 0.0
        },
        "tail_base": {
          "dAngle": 0.0
        },
        "tail_mid": {
          "dAngle": 13.8
        },
        "tail_tip": {
          "dAngle": 19.0
        },
        "thigh_l": {
          "dAngle": 40.7
        },
        "shin_l": {
          "dAngle": -16.6
        },
        "paw_l": {
          "dAngle": -24.2
        },
        "thigh_r": {
          "dAngle": -40.7
        },
        "shin_r": {
          "dAngle": 16.6
        },
        "paw_r": {
          "dAngle": 24.2
        },
        "arm_l": {
          "dAngle": -12.6
        },
        "forearm_l": {
          "dAngle": 38.4
        },
        "paw_front_l": {
          "dAngle": -25.8
        },
        "arm_r": {
          "dAngle": 12.6
        },
        "forearm_r": {
          "dAngle": -38.4
        },
        "paw_front_r": {
          "dAngle": 25.8
        }
      }
    },
    {
      "name": "Walk Step 8/12",
      "pose": {
        "pelvis": {
          "dy": 0.6
        },
        "spine": {
          "dAngle": -0.7
        },
        "chest": {
          "dAngle": 0.4
        },
        "neck": {
          "dy": -0.2,
          "dAngle": 0.3
        },
        "head": {
          "dAngle": -0.9
        },
        "tail_base": {
          "dAngle": -2.5
        },
        "tail_mid": {
          "dAngle": 10.9
        },
        "tail_tip": {
          "dAngle": 20.5
        },
        "thigh_l": {
          "dAngle": 33.2
        },
        "shin_l": {
          "dAngle": 1.1
        },
        "paw_l": {
          "dAngle": -34.3
        },
        "thigh_r": {
          "dAngle": -36.7
        },
        "shin_r": {
          "dAngle": 20.5
        },
        "paw_r": {
          "dAngle": 16.3
        },
        "arm_l": {
          "dAngle": -8.0
        },
        "forearm_l": {
          "dAngle": 41.3
        },
        "paw_front_l": {
          "dAngle": -32.9
        },
        "arm_r": {
          "dAngle": -5.9
        },
        "forearm_r": {
          "dAngle": -17.4
        },
        "paw_front_r": {
          "dAngle": 23.7
        }
      }
    },
    {
      "name": "Walk Step 9/12",
      "pose": {
        "pelvis": {
          "dy": 0.6
        },
        "spine": {
          "dAngle": -2.2
        },
        "chest": {
          "dAngle": 1.2
        },
        "neck": {
          "dy": -0.2,
          "dAngle": 0.5
        },
        "head": {
          "dAngle": -1.6
        },
        "tail_base": {
          "dAngle": -4.3
        },
        "tail_mid": {
          "dAngle": 6.9
        },
        "tail_tip": {
          "dAngle": 19.0
        },
        "thigh_l": {
          "dAngle": 18.0
        },
        "shin_l": {
          "dAngle": 31.7
        },
        "paw_l": {
          "dAngle": -49.7
        },
        "thigh_r": {
          "dAngle": -30.2
        },
        "shin_r": {
          "dAngle": 19.6
        },
        "paw_r": {
          "dAngle": 10.7
        },
        "arm_l": {
          "dAngle": -3.3
        },
        "forearm_l": {
          "dAngle": 44.5
        },
        "paw_front_l": {
          "dAngle": -40.1
        },
        "arm_r": {
          "dAngle": -15.6
        },
        "forearm_r": {
          "dAngle": -1.5
        },
        "paw_front_r": {
          "dAngle": 18.3
        }
      }
    },
    {
      "name": "Walk Step 10/12",
      "pose": {
        "pelvis": {
          "dy": 0.0
        },
        "spine": {
          "dAngle": -3.0
        },
        "chest": {
          "dAngle": 1.6
        },
        "neck": {
          "dy": 0.0,
          "dAngle": 0.5
        },
        "head": {
          "dAngle": -1.8
        },
        "tail_base": {
          "dAngle": -5.0
        },
        "tail_mid": {
          "dAngle": 2.9
        },
        "tail_tip": {
          "dAngle": 15.0
        },
        "thigh_l": {
          "dAngle": 2.5
        },
        "shin_l": {
          "dAngle": 30.4
        },
        "paw_l": {
          "dAngle": -32.9
        },
        "thigh_r": {
          "dAngle": -22.0
        },
        "shin_r": {
          "dAngle": 13.9
        },
        "paw_r": {
          "dAngle": 8.2
        },
        "arm_l": {
          "dAngle": 0.9
        },
        "forearm_l": {
          "dAngle": 47.8
        },
        "paw_front_l": {
          "dAngle": -47.2
        },
        "arm_r": {
          "dAngle": -17.5
        },
        "forearm_r": {
          "dAngle": 4.7
        },
        "paw_front_r": {
          "dAngle": 14.4
        }
      }
    },
    {
      "name": "Walk Step 11/12",
      "pose": {
        "pelvis": {
          "dy": -0.6
        },
        "spine": {
          "dAngle": -2.2
        },
        "chest": {
          "dAngle": 1.2
        },
        "neck": {
          "dy": 0.2,
          "dAngle": 0.5
        },
        "head": {
          "dAngle": -1.6
        },
        "tail_base": {
          "dAngle": -4.3
        },
        "tail_mid": {
          "dAngle": 0.0
        },
        "tail_tip": {
          "dAngle": 9.5
        },
        "thigh_l": {
          "dAngle": -2.2
        },
        "shin_l": {
          "dAngle": 13.8
        },
        "paw_l": {
          "dAngle": -11.6
        },
        "thigh_r": {
          "dAngle": -13.7
        },
        "shin_r": {
          "dAngle": 6.9
        },
        "paw_r": {
          "dAngle": 6.9
        },
        "arm_l": {
          "dAngle": 8.4
        },
        "forearm_l": {
          "dAngle": 29.5
        },
        "paw_front_l": {
          "dAngle": -36.8
        },
        "arm_r": {
          "dAngle": -10.4
        },
        "forearm_r": {
          "dAngle": 0.2
        },
        "paw_front_r": {
          "dAngle": 11.4
        }
      }
    },
    {
      "name": "Walk Step 12/12",
      "pose": {
        "pelvis": {
          "dy": -0.6
        },
        "spine": {
          "dAngle": -0.8
        },
        "chest": {
          "dAngle": 0.4
        },
        "neck": {
          "dy": 0.2,
          "dAngle": 0.3
        },
        "head": {
          "dAngle": -0.9
        },
        "tail_base": {
          "dAngle": -2.5
        },
        "tail_mid": {
          "dAngle": -1.1
        },
        "tail_tip": {
          "dAngle": 4.0
        },
        "thigh_l": {
          "dAngle": -1.3
        },
        "shin_l": {
          "dAngle": 2.4
        },
        "paw_l": {
          "dAngle": -1.2
        },
        "thigh_r": {
          "dAngle": -6.5
        },
        "shin_r": {
          "dAngle": 2.2
        },
        "paw_r": {
          "dAngle": 4.3
        },
        "arm_l": {
          "dAngle": 17.6
        },
        "forearm_l": {
          "dAngle": -4.6
        },
        "paw_front_l": {
          "dAngle": -12.6
        },
        "arm_r": {
          "dAngle": -4.8
        },
        "forearm_r": {
          "dAngle": -1.4
        },
        "paw_front_r": {
          "dAngle": 6.5
        }
      }
    }
  ]
}
};

window.PIXEL_PRESETS["magic_portal_orb_32x32"] = {
  label: "🌀 Magic Portal Orb GLSL Shader (32×32) [8f]",
  prompt: "Procedural Swirling Vortex Magic Portal shader. Evaluates continuous math SDFs with Oklab palette quantization and Bayer 4x4 dithering.",
  data: {
  "type": "shader",
  "name": "magic_portal_orb_32x32",
  "label": "🌀 Magic Portal Orb GLSL Shader (32×32) [8f]",
  "author": "PixelDSL Studio",
  "description": "Procedural Swirling Vortex Magic Portal shader. Evaluates continuous math SDFs with Oklab palette quantization and Bayer 4x4 dithering.",
  "width": 32,
  "height": 32,
  "fps": 8,
  "framesCount": 8,
  "shaderType": "portal",
  "dither": "bayer4x4",
  "ditherStrength": 0.16,
  "palette": {
    "1": "#070b19",
    "2": "#142247",
    "3": "#264b87",
    "4": "#3a7bd5",
    "5": "#60a5fa",
    "6": "#93c5fd",
    "7": "#ffffff"
  },
  "glsl": "\nvoid mainImage(out vec4 fragColor, in vec2 uv, in float time) {\n    vec2 p = uv * 2.0 - 1.0;\n    float r = length(p);\n    float a = atan(p.y, p.x);\n    \n    // Swirling vortex SDF\n    float spiral = sin(a * 4.0 - time * 6.28318 + r * 6.0);\n    float orb = r - 0.72 + 0.08 * spiral;\n    \n    if (orb > 0.06) {\n        fragColor = vec4(0.0);\n        return;\n    }\n    \n    float core = max(0.0, 1.0 - r / 0.75);\n    float ring = max(0.0, 1.0 - abs(orb) / 0.12);\n    float intensity = clamp(core * 0.7 + ring * 0.9 + 0.25 * spiral, 0.0, 1.0);\n    \n    vec3 col = vec3(sin(intensity * 3.14159) * 0.6, intensity * 0.9, 0.5 + intensity * 0.5);\n    fragColor = vec4(col, 1.0);\n}\n"
}
};

window.PIXEL_PRESETS["fire_elemental_32x32"] = {
  label: "🔥 Fire Elemental GLSL Shader (32×32) [8f]",
  prompt: "Procedural Rising Flame Elemental shader. Continuous turbulent heat displacement, hot core, and Bayer dithering.",
  data: {
  "type": "shader",
  "name": "fire_elemental_32x32",
  "label": "🔥 Fire Elemental GLSL Shader (32×32) [8f]",
  "author": "PixelDSL Studio",
  "description": "Procedural Rising Flame Elemental shader. Continuous turbulent heat displacement, hot core, and Bayer dithering.",
  "width": 32,
  "height": 32,
  "fps": 8,
  "framesCount": 8,
  "shaderType": "fire",
  "dither": "bayer4x4",
  "ditherStrength": 0.18,
  "palette": {
    "1": "#1a0808",
    "2": "#471008",
    "3": "#8f1e00",
    "4": "#d95000",
    "5": "#ff8c00",
    "6": "#ffd034",
    "7": "#ffffff"
  },
  "glsl": "\nvoid mainImage(out vec4 fragColor, in vec2 uv, in float time) {\n    vec2 p = uv * 2.0 - 1.0;\n    float r = length(p);\n    \n    // Rising heat turbulence\n    float flameShape = r - (0.65 - (p.y + 0.5) * 0.4) + sin(p.x * 6.0 + time * 6.28) * 0.12;\n    if (flameShape > 0.05 || p.y < -0.85) {\n        fragColor = vec4(0.0);\n        return;\n    }\n    \n    float intensity = clamp(1.0 - flameShape * 1.5, 0.0, 1.0);\n    vec3 col = vec3(min(1.0, intensity * 1.4), clamp((intensity - 0.3) * 1.5, 0.0, 1.0), clamp((intensity - 0.8) * 3.0, 0.0, 1.0));\n    fragColor = vec4(col, 1.0);\n}\n"
}
};

window.PIXEL_PRESETS["chibi_hero_rig_32x36"] = {
  label: "🦴 Chibi Adventurer Rig (32×36) [5f]",
  prompt: "Procedural 2.5D Skeletal Capsule Rig of a Chibi Adventurer. No character grid — animated solely via bone angle kinematics!",
  data: {
  "type": "rig",
  "name": "chibi_hero_rig_32x36",
  "label": "🦴 Chibi Adventurer Rig (32×36) [5f]",
  "author": "PixelDSL Studio",
  "description": "Procedural 2.5D Skeletal Capsule Rig of a Chibi Adventurer. No character grid — animated solely via bone angle kinematics!",
  "width": 32,
  "height": 36,
  "fps": 6,
  "palette": {
    ".": null,
    "o": "#8a4f26",
    "b": "#fbd7ba",
    "h": "#fbe7c3",
    "C": "#2b5282",
    "c": "#4299e1",
    "T": "#3d4852",
    "G": "#6b4423",
    "H": "#663300",
    "W": "#ffffff",
    "M": "#a0a5ab",
    "m": "#69717d"
  },
  "rig": {
    "outline": "o",
    "outlineWidth": 1.0,
    "bones": [
      {
        "id": "pelvis",
        "x": 16,
        "y": 21,
        "length": 0,
        "angle": 0,
        "r1": 3.0,
        "r2": 3.0,
        "fill": "T",
        "z": 2
      },
      {
        "id": "torso",
        "parent": "pelvis",
        "offset": [
          0,
          -1
        ],
        "length": 6.5,
        "angle": -90,
        "r1": 4.0,
        "r2": 3.4,
        "fill": "C",
        "z": 3
      },
      {
        "id": "head",
        "parent": "torso",
        "offset": [
          0,
          0
        ],
        "length": 6.5,
        "angle": 0,
        "r1": 6.5,
        "r2": 5.5,
        "shape": "head_oval",
        "fill": "b",
        "features": {
          "eyes": {
            "dx": 2.5,
            "dy": 0.5,
            "w": 2,
            "h": 3,
            "color": "#4e221c"
          }
        },
        "z": 5
      },
      {
        "id": "thigh_back",
        "parent": "pelvis",
        "offset": [
          -1.0,
          1.5
        ],
        "length": 5,
        "angle": 60,
        "r1": 2.0,
        "r2": 1.6,
        "fill": "T",
        "z": 1
      },
      {
        "id": "shin_back",
        "parent": "thigh_back",
        "length": 5,
        "angle": -20,
        "r1": 1.6,
        "r2": 2.0,
        "fill": "G",
        "z": 1
      },
      {
        "id": "thigh_front",
        "parent": "pelvis",
        "offset": [
          1.0,
          1.5
        ],
        "length": 5,
        "angle": 110,
        "r1": 2.0,
        "r2": 1.6,
        "fill": "T",
        "z": 4
      },
      {
        "id": "shin_front",
        "parent": "thigh_front",
        "length": 5,
        "angle": 25,
        "r1": 1.6,
        "r2": 2.0,
        "fill": "G",
        "z": 4
      },
      {
        "id": "arm_back",
        "parent": "torso",
        "offset": [
          -2.0,
          -1.0
        ],
        "length": 5.5,
        "angle": 45,
        "r1": 1.6,
        "r2": 1.4,
        "fill": "b",
        "z": 1
      },
      {
        "id": "arm_front",
        "parent": "torso",
        "offset": [
          2.0,
          -1.0
        ],
        "length": 5.5,
        "angle": 135,
        "r1": 1.6,
        "r2": 1.4,
        "fill": "b",
        "z": 6
      }
    ]
  },
  "frames": [
    {
      "name": "Step 1 (Passing)",
      "pose": {
        "pelvis": {
          "dy": 1
        },
        "thigh_back": {
          "dAngle": -20
        },
        "shin_back": {
          "dAngle": -40
        },
        "thigh_front": {
          "dAngle": -10
        },
        "shin_front": {
          "dAngle": 0
        },
        "arm_back": {
          "dAngle": 15
        },
        "arm_front": {
          "dAngle": -15
        }
      }
    },
    {
      "name": "Step 2 (Stride Extension)",
      "pose": {
        "pelvis": {
          "dy": 0
        },
        "thigh_back": {
          "dAngle": -45
        },
        "shin_back": {
          "dAngle": 10
        },
        "thigh_front": {
          "dAngle": 25
        },
        "shin_front": {
          "dAngle": 10
        },
        "arm_back": {
          "dAngle": 35
        },
        "arm_front": {
          "dAngle": -35
        }
      }
    },
    {
      "name": "Step 3 (Contact)",
      "pose": {
        "pelvis": {
          "dy": 0.5
        },
        "thigh_back": {
          "dAngle": 15
        },
        "shin_back": {
          "dAngle": 0
        },
        "thigh_front": {
          "dAngle": -20
        },
        "shin_front": {
          "dAngle": -35
        },
        "arm_back": {
          "dAngle": -15
        },
        "arm_front": {
          "dAngle": 15
        }
      }
    },
    {
      "name": "Step 4 (Push-Off)",
      "pose": {
        "pelvis": {
          "dy": 0
        },
        "thigh_back": {
          "dAngle": 30
        },
        "shin_back": {
          "dAngle": 15
        },
        "thigh_front": {
          "dAngle": -40
        },
        "shin_front": {
          "dAngle": 10
        },
        "arm_back": {
          "dAngle": -35
        },
        "arm_front": {
          "dAngle": 35
        }
      }
    }
  ]
}
};

window.PIXEL_PRESETS["quadruped_wolf_rig_32x32"] = {
  label: "🐺 Galloping Wolf Rig (32×32) [5f]",
  prompt: "Procedural 4-Legged Beast / Wolf Skeletal Rig. Dynamic spine flex, muzzle, paws, and running gallop animation.",
  data: {
  "type": "rig",
  "name": "quadruped_wolf_rig_32x32",
  "label": "🐺 Galloping Wolf Rig (32×32) [5f]",
  "author": "PixelDSL Studio",
  "description": "Procedural 4-Legged Beast / Wolf Skeletal Rig. Dynamic spine flex, muzzle, paws, and running gallop animation.",
  "width": 32,
  "height": 32,
  "fps": 8,
  "palette": {
    ".": null,
    "o": "#232028",
    "w": "#8a8f9c",
    "W": "#c4c8d4",
    "d": "#515461",
    "e": "#d95763",
    "n": "#1b191f"
  },
  "rig": {
    "outline": "o",
    "outlineWidth": 1.0,
    "bones": [
      {
        "id": "hips",
        "x": 10,
        "y": 15,
        "length": 0,
        "angle": 0,
        "r1": 3.0,
        "r2": 3.0,
        "fill": "w",
        "z": 3
      },
      {
        "id": "spine",
        "parent": "hips",
        "offset": [
          0,
          0
        ],
        "length": 8,
        "angle": 0,
        "r1": 3.2,
        "r2": 3.8,
        "fill": "w",
        "z": 3
      },
      {
        "id": "neck",
        "parent": "spine",
        "offset": [
          0,
          -1
        ],
        "length": 4,
        "angle": -45,
        "r1": 2.5,
        "r2": 3.0,
        "fill": "w",
        "z": 4
      },
      {
        "id": "head",
        "parent": "neck",
        "offset": [
          0,
          0
        ],
        "length": 5,
        "angle": 25,
        "r1": 3.0,
        "r2": 1.8,
        "shape": "tapered_capsule",
        "fill": "W",
        "features": {
          "eyes": {
            "dx": 0.5,
            "dy": -1.0,
            "w": 1.5,
            "h": 1.5,
            "color": "#d95763"
          }
        },
        "z": 5
      },
      {
        "id": "tail",
        "parent": "hips",
        "offset": [
          -2,
          -1
        ],
        "length": 6,
        "angle": -140,
        "r1": 1.8,
        "r2": 1.0,
        "fill": "w",
        "z": 1
      },
      {
        "id": "back_thigh_r",
        "parent": "hips",
        "offset": [
          1,
          2
        ],
        "length": 5,
        "angle": 110,
        "r1": 2.0,
        "r2": 1.4,
        "fill": "w",
        "z": 5
      },
      {
        "id": "back_shin_r",
        "parent": "back_thigh_r",
        "length": 5,
        "angle": -40,
        "r1": 1.4,
        "r2": 1.6,
        "fill": "d",
        "z": 5
      },
      {
        "id": "back_thigh_l",
        "parent": "hips",
        "offset": [
          -1,
          2
        ],
        "length": 5,
        "angle": 70,
        "r1": 1.8,
        "r2": 1.3,
        "fill": "d",
        "z": 1
      },
      {
        "id": "back_shin_l",
        "parent": "back_thigh_l",
        "length": 5,
        "angle": -30,
        "r1": 1.3,
        "r2": 1.5,
        "fill": "d",
        "z": 1
      },
      {
        "id": "front_arm_r",
        "parent": "spine",
        "offset": [
          1,
          2
        ],
        "length": 5.5,
        "angle": 75,
        "r1": 1.8,
        "r2": 1.3,
        "fill": "w",
        "z": 5
      },
      {
        "id": "front_paw_r",
        "parent": "front_arm_r",
        "length": 4.5,
        "angle": 15,
        "r1": 1.3,
        "r2": 1.5,
        "fill": "d",
        "z": 5
      },
      {
        "id": "front_arm_l",
        "parent": "spine",
        "offset": [
          -1,
          2
        ],
        "length": 5.5,
        "angle": 105,
        "r1": 1.6,
        "r2": 1.2,
        "fill": "d",
        "z": 1
      },
      {
        "id": "front_paw_l",
        "parent": "front_arm_l",
        "length": 4.5,
        "angle": -20,
        "r1": 1.2,
        "r2": 1.4,
        "fill": "d",
        "z": 1
      }
    ]
  },
  "frames": [
    {
      "name": "Gallop Stretch",
      "pose": {
        "hips": {
          "dy": -1
        },
        "spine": {
          "dAngle": -5
        },
        "tail": {
          "dAngle": -20
        },
        "back_thigh_r": {
          "dAngle": 35
        },
        "back_shin_r": {
          "dAngle": 15
        },
        "front_arm_r": {
          "dAngle": -35
        },
        "front_paw_r": {
          "dAngle": -20
        }
      }
    },
    {
      "name": "Gallop Passing",
      "pose": {
        "hips": {
          "dy": 1
        },
        "spine": {
          "dAngle": 0
        },
        "tail": {
          "dAngle": 0
        },
        "back_thigh_r": {
          "dAngle": -15
        },
        "back_shin_r": {
          "dAngle": -25
        },
        "front_arm_r": {
          "dAngle": 15
        },
        "front_paw_r": {
          "dAngle": 20
        }
      }
    },
    {
      "name": "Gallop Gather",
      "pose": {
        "hips": {
          "dy": 0
        },
        "spine": {
          "dAngle": 10
        },
        "tail": {
          "dAngle": 25
        },
        "back_thigh_r": {
          "dAngle": -45
        },
        "back_shin_r": {
          "dAngle": -20
        },
        "front_arm_r": {
          "dAngle": 35
        },
        "front_paw_r": {
          "dAngle": 10
        }
      }
    },
    {
      "name": "Gallop Push-off",
      "pose": {
        "hips": {
          "dy": 0
        },
        "spine": {
          "dAngle": 0
        },
        "tail": {
          "dAngle": 10
        },
        "back_thigh_r": {
          "dAngle": 15
        },
        "back_shin_r": {
          "dAngle": 20
        },
        "front_arm_r": {
          "dAngle": -15
        },
        "front_paw_r": {
          "dAngle": -10
        }
      }
    }
  ]
}
};

window.PIXEL_PRESETS["proc_sword_s42_32x32"] = {
  label: "🗡️ Paladin Crystal Sword (32×32) [4f]",
  prompt: "🗡️ Paladin Crystal Sword (32×32) [4f]",
  data: {
  "name": "proc_sword_s42_32x32",
  "prompt": "Procedural sword (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "ramps": {
    "M": {
      "base": "#00bef1",
      "light": "L",
      "dark": "D",
      "outline": "O"
    },
    "A": {
      "base": "#ff6537",
      "light": "W",
      "dark": "B",
      "outline": "O"
    },
    "S": {
      "base": "#c6b59b",
      "light": "w",
      "dark": "d",
      "outline": "O"
    },
    "H": {
      "base": "#8c4a11",
      "light": "h",
      "dark": "b",
      "outline": "O"
    }
  },
  "palette": {
    ".": "transparent",
    "O": "#14182e",
    "e": "#0e101c",
    "w": "#ffffff",
    "a": "#14182e44"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#14182e",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": true,
    "selOut": true
  },
  "layers": [
    {
      "id": "shadow",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 29.0,
      "rx": 6.0,
      "ry": 1.5,
      "fill": "a"
    },
    {
      "id": "pommel",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 27.5,
      "rx": 2.2,
      "ry": 2.2,
      "fill": "A",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "grip",
      "op": "uneven_capsule",
      "x1": 15.5,
      "y1": 26.0,
      "x2": 15.5,
      "y2": 21.0,
      "r1": 1.6,
      "r2": 1.9,
      "fill": "H",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "blade",
      "op": "uneven_capsule",
      "x1": 15.5,
      "y1": 21.0,
      "x2": 15.5,
      "y2": 4.5,
      "r1": 3.2,
      "r2": 1.2,
      "fill": "S",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "blade_tip",
      "op": "vesica",
      "cx": 15.5,
      "cy": 7.5,
      "rx": 3.1,
      "ry": 5.0,
      "fill": "S",
      "outline": "O",
      "sdf": true,
      "smoothBlend": 1.5
    },
    {
      "id": "fuller",
      "op": "uneven_capsule",
      "x1": 15.5,
      "y1": 20.0,
      "x2": 15.5,
      "y2": 9.0,
      "r1": 1.0,
      "r2": 0.6,
      "fill": "M",
      "sdf": true
    },
    {
      "id": "guard",
      "op": "vesica",
      "cx": 15.5,
      "cy": 21.0,
      "rx": 8.1,
      "ry": 2.2,
      "angle": -0.44292711839079857,
      "fill": "A",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "gem",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 21.0,
      "rx": 1.8,
      "ry": 1.8,
      "fill": "M",
      "outline": "O",
      "sdf": true
    }
  ],
  "frames": [],
  "grid": [],
  "motion": {
    "type": "idle_breathe",
    "frames": 4,
    "amplitude": 0.8,
    "squash": 0.04
  }
}
};

window.PIXEL_PRESETS["proc_slime_s777_32x32"] = {
  label: "🧪 Acid Slime King (32×32) [4f]",
  prompt: "🧪 Acid Slime King (32×32) [4f]",
  data: {
  "name": "proc_slime_s777_32x32",
  "prompt": "Procedural slime (seed=777, 32x32) — 100% LLM-Free PixelDSL v3.0",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "ramps": {
    "M": {
      "base": "#268edd",
      "light": "L",
      "dark": "D",
      "outline": "O"
    },
    "A": {
      "base": "#ff779f",
      "light": "W",
      "dark": "B",
      "outline": "O"
    },
    "S": {
      "base": "#baba9c",
      "light": "w",
      "dark": "d",
      "outline": "O"
    },
    "H": {
      "base": "#8c4a11",
      "light": "h",
      "dark": "b",
      "outline": "O"
    }
  },
  "palette": {
    ".": "transparent",
    "O": "#14182e",
    "e": "#0e101c",
    "w": "#ffffff",
    "a": "#14182e44"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#14182e",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": true,
    "selOut": true
  },
  "layers": [
    {
      "id": "shadow",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 28.0,
      "rx": 9.9,
      "ry": 2.2,
      "fill": "a"
    },
    {
      "id": "crown",
      "op": "star",
      "cx": 15.5,
      "cy": 6.1,
      "r": 3.8,
      "n": 5,
      "innerRatio": 0.55,
      "fill": "A",
      "outline": "O",
      "sdf": true,
      "parent": "slime_body"
    },
    {
      "id": "slime_body",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 17.5,
      "rx": 9.4,
      "ry": 8.2,
      "fill": "M",
      "outline": "O",
      "sdf": true,
      "smoothBlend": 3.0
    },
    {
      "id": "slime_lobes",
      "op": "ellipse",
      "cx": 9.1,
      "cy": 20.7,
      "rx": 4.6,
      "ry": 3.6,
      "fill": "M",
      "outline": "O",
      "mirror": "x",
      "sdf": true,
      "smoothBlend": 3.0
    },
    {
      "id": "slime_top",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 12.7,
      "rx": 5.8,
      "ry": 4.2,
      "fill": "M",
      "outline": "O",
      "sdf": true,
      "smoothBlend": 2.5
    },
    {
      "id": "eye_l",
      "op": "ellipse",
      "cx": 12.0,
      "cy": 16.5,
      "rx": 1.5,
      "ry": 2.0,
      "fill": "e",
      "mirror": "x",
      "parent": "slime_body"
    },
    {
      "id": "glint",
      "op": "pixels",
      "color": "w",
      "mirror": "x",
      "points": [
        [
          12,
          16
        ]
      ],
      "parent": "slime_body"
    }
  ],
  "frames": [],
  "grid": [],
  "motion": {
    "type": "idle_breathe",
    "frames": 4,
    "amplitude": 1.0,
    "squash": 0.12
  }
}
};

window.PIXEL_PRESETS["proc_crystal_monolith_s108_48x48"] = {
  label: "💎 Resonant Monolith (48×48) [4f]",
  prompt: "💎 Resonant Monolith (48×48) [4f]",
  data: {
  "name": "proc_crystal_monolith_s108_48x48",
  "prompt": "Procedural crystal_monolith (seed=108, 48x48) — 100% LLM-Free PixelDSL v3.0",
  "width": 48,
  "height": 48,
  "symmetry": "none",
  "rle": false,
  "ramps": {
    "M": {
      "base": "#00c25c",
      "light": "L",
      "dark": "D",
      "outline": "O"
    },
    "A": {
      "base": "#c78eff",
      "light": "W",
      "dark": "B",
      "outline": "O"
    },
    "S": {
      "base": "#d0adb0",
      "light": "w",
      "dark": "d",
      "outline": "O"
    },
    "H": {
      "base": "#8c4a11",
      "light": "h",
      "dark": "b",
      "outline": "O"
    }
  },
  "palette": {
    ".": "transparent",
    "O": "#14182e",
    "e": "#0e101c",
    "w": "#ffffff",
    "a": "#14182e44"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#14182e",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": true,
    "selOut": true
  },
  "layers": [
    {
      "id": "shadow",
      "op": "ellipse",
      "cx": 23.5,
      "cy": 42.8,
      "rx": 14.2,
      "ry": 3.3,
      "fill": "a"
    },
    {
      "id": "pedestal",
      "op": "rect",
      "x": 13.0,
      "y": 36.8,
      "w": 21.0,
      "h": 6.0,
      "rx": 1,
      "fill": "H",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "monolith_body",
      "op": "vesica",
      "cx": 23.5,
      "cy": 21.2,
      "rx": 8.2,
      "ry": 17.2,
      "fill": "M",
      "outline": "O",
      "sdf": true,
      "dither": "worley",
      "shaderScale": 5.5,
      "seed": 108
    },
    {
      "id": "shard_orbit",
      "op": "vesica",
      "cx": 10.8,
      "cy": 23.5,
      "rx": 3.0,
      "ry": 6.8,
      "angle": -18,
      "fill": "A",
      "outline": "O",
      "mirror": "x",
      "sdf": true
    },
    {
      "id": "core_star",
      "op": "star",
      "cx": 23.5,
      "cy": 21.2,
      "r": 5.7,
      "n": 4,
      "innerRatio": 0.45,
      "fill": "w",
      "outline": "O",
      "sdf": true
    }
  ],
  "frames": [],
  "grid": [],
  "motion": {
    "type": "idle_breathe",
    "frames": 4,
    "amplitude": 1.5,
    "squash": 0.04
  }
}
};

window.PIXEL_PRESETS["white_pink_bunny_jump_32x32"] = {
  label: "🐰 White-Pink Bunny (32×32) [6f]",
  prompt: "🐰 White-Pink Bunny (32×32) [6f]",
  data: {
  "name": "white_pink_bunny_jump_32x32",
  "label": "🐰 White-Pink Bunny 32×32 (6-Frame Jump)",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "palette": {
    ".": "transparent",
    "O": "#33182c",
    "W": "#ffffff",
    "p": "#ffe3ec",
    "S": "#f7bfd0",
    "P": "#ff8fab",
    "N": "#e0527b",
    "e": "#210d1e",
    "w": "#ffffff",
    "a": "#33182c40"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#33182c",
    "autoShading": false,
    "shadingStrength": 0.12,
    "sdfShading": false
  },
  "layers": [
    {
      "id": "shadow",
      "op": "ellipse",
      "cx": 16,
      "cy": 28,
      "rx": 9,
      "ry": 1,
      "fill": "a"
    },
    {
      "id": "ear_back",
      "op": "ellipse",
      "cx": 16,
      "cy": 8,
      "rx": 2,
      "ry": 5,
      "angle": -22,
      "fill": "S",
      "outline": "O"
    },
    {
      "id": "tail",
      "op": "ellipse",
      "cx": 6,
      "cy": 21,
      "rx": 3,
      "ry": 3,
      "fill": "p",
      "outline": "O"
    },
    {
      "id": "foot_back",
      "op": "ellipse",
      "cx": 12,
      "cy": 26,
      "rx": 4,
      "ry": 2,
      "angle": 5,
      "fill": "S",
      "outline": "O"
    },
    {
      "id": "thigh",
      "op": "ellipse",
      "cx": 11,
      "cy": 22,
      "rx": 5,
      "ry": 4,
      "angle": -10,
      "fill": "W",
      "outline": "O",
      "smoothBlend": 1.8,
      "z": 2,
      "crease": true
    },
    {
      "id": "body",
      "op": "ellipse",
      "cx": 16,
      "cy": 21,
      "rx": 6,
      "ry": 5,
      "angle": -8,
      "fill": "W",
      "outline": "O",
      "smoothBlend": 2,
      "z": 1
    },
    {
      "id": "head",
      "op": "ellipse",
      "cx": 21,
      "cy": 15,
      "rx": 5,
      "ry": 5,
      "angle": 5,
      "fill": "W",
      "outline": "O",
      "smoothBlend": 1.6,
      "z": 1
    },
    {
      "id": "ear_front",
      "op": "ellipse",
      "cx": 19,
      "cy": 8,
      "rx": 3,
      "ry": 5,
      "angle": -16,
      "fill": "W",
      "outline": "O",
      "smoothBlend": 1.4,
      "z": 2,
      "crease": true
    },
    {
      "id": "belly_pink",
      "op": "ellipse",
      "cx": 15,
      "cy": 23,
      "rx": 5,
      "ry": 2,
      "angle": -5,
      "fill": "p",
      "dither": "checker",
      "ditherColor": "S"
    },
    {
      "id": "thigh_shade",
      "op": "ellipse",
      "cx": 10,
      "cy": 23,
      "rx": 3,
      "ry": 2,
      "fill": "p"
    },
    {
      "id": "ear_pink",
      "op": "ellipse",
      "cx": 19,
      "cy": 8,
      "rx": 1,
      "ry": 3,
      "angle": -16,
      "fill": "P"
    },
    {
      "id": "paw_front",
      "op": "ellipse",
      "cx": 21,
      "cy": 25,
      "rx": 3,
      "ry": 2,
      "angle": 15,
      "fill": "W",
      "outline": "O"
    },
    {
      "id": "cheek",
      "op": "pixels",
      "color": "P",
      "points": [
        [
          21,
          16
        ],
        [
          22,
          16
        ],
        [
          21,
          17
        ],
        [
          22,
          17
        ]
      ]
    },
    {
      "id": "nose",
      "op": "pixels",
      "color": "N",
      "points": [
        [
          26,
          14
        ],
        [
          26,
          15
        ],
        [
          25,
          14
        ]
      ]
    },
    {
      "id": "eye",
      "op": "stamp",
      "x": 22,
      "y": 12,
      "grid": [
        "eP",
        "ee",
        "ee"
      ]
    }
  ],
  "frames": [
    {
      "layers": {
        "shadow": {
          "drx": 1
        },
        "ear_back": {
          "dy": 2,
          "dAngle": -16
        },
        "ear_front": {
          "dy": 2,
          "dAngle": -16
        },
        "ear_pink": {
          "dy": 2,
          "dAngle": -16
        },
        "tail": {
          "dy": 2,
          "dx": -1
        },
        "thigh": {
          "dy": 2,
          "drx": 1,
          "dry": -1
        },
        "body": {
          "dy": 2,
          "drx": 1,
          "dry": -1
        },
        "belly_pink": {
          "dy": 2
        },
        "thigh_shade": {
          "dy": 2
        },
        "head": {
          "dy": 2,
          "dx": 1
        },
        "cheek": {
          "dy": 2,
          "dx": 1
        },
        "nose": {
          "dy": 2,
          "dx": 1
        },
        "eye": {
          "dy": 2,
          "dx": 1
        },
        "paw_front": {
          "dy": 1,
          "dx": 1
        }
      }
    },
    {
      "layers": {
        "shadow": {
          "drx": -2
        },
        "ear_back": {
          "dy": -3,
          "dAngle": -12
        },
        "ear_front": {
          "dy": -3,
          "dAngle": -12
        },
        "ear_pink": {
          "dy": -3,
          "dAngle": -12
        },
        "tail": {
          "dy": -3,
          "dx": -1
        },
        "foot_back": {
          "dy": -2,
          "dx": -2,
          "dAngle": 30
        },
        "thigh": {
          "dy": -3,
          "dAngle": -15
        },
        "body": {
          "dy": -4,
          "dAngle": -18
        },
        "belly_pink": {
          "dy": -4,
          "dAngle": -18
        },
        "thigh_shade": {
          "dy": -3
        },
        "head": {
          "dy": -4,
          "dx": 1
        },
        "cheek": {
          "dy": -4,
          "dx": 1
        },
        "nose": {
          "dy": -4,
          "dx": 1
        },
        "eye": {
          "dy": -4,
          "dx": 1
        },
        "paw_front": {
          "dy": -5,
          "dx": 2,
          "dAngle": -25
        }
      }
    },
    {
      "layers": {
        "shadow": {
          "drx": -4
        },
        "ear_back": {
          "dy": -3,
          "dAngle": 6
        },
        "ear_front": {
          "dy": -3,
          "dAngle": 6
        },
        "ear_pink": {
          "dy": -3,
          "dAngle": 6
        },
        "tail": {
          "dy": -5
        },
        "foot_back": {
          "dy": -5,
          "dx": -1,
          "dAngle": 18
        },
        "thigh": {
          "dy": -5
        },
        "body": {
          "dy": -5
        },
        "belly_pink": {
          "dy": -5
        },
        "thigh_shade": {
          "dy": -5
        },
        "head": {
          "dy": -5
        },
        "cheek": {
          "dy": -5
        },
        "nose": {
          "dy": -5
        },
        "eye": {
          "dy": -5
        },
        "paw_front": {
          "dy": -5,
          "dx": 1,
          "dAngle": -10
        }
      }
    },
    {
      "layers": {
        "shadow": {
          "drx": -2
        },
        "ear_back": {
          "dy": -2,
          "dAngle": 18
        },
        "ear_front": {
          "dy": -2,
          "dAngle": 18
        },
        "ear_pink": {
          "dy": -2,
          "dAngle": 18
        },
        "tail": {
          "dy": -3
        },
        "foot_back": {
          "dy": -4,
          "dAngle": -12
        },
        "thigh": {
          "dy": -3,
          "dAngle": 10
        },
        "body": {
          "dy": -3,
          "dAngle": 12
        },
        "belly_pink": {
          "dy": -3,
          "dAngle": 12
        },
        "thigh_shade": {
          "dy": -3
        },
        "head": {
          "dy": -2
        },
        "cheek": {
          "dy": -2
        },
        "nose": {
          "dy": -2
        },
        "eye": {
          "dy": -2
        },
        "paw_front": {
          "dy": -2,
          "dx": 1,
          "dAngle": 25
        }
      }
    },
    {
      "layers": {
        "shadow": {
          "drx": 1
        },
        "ear_back": {
          "dy": 1,
          "dAngle": 10
        },
        "ear_front": {
          "dy": 1,
          "dAngle": 10
        },
        "ear_pink": {
          "dy": 1,
          "dAngle": 10
        },
        "tail": {
          "dy": 1
        },
        "foot_back": {
          "dy": 0
        },
        "thigh": {
          "dy": 1,
          "dry": -1
        },
        "body": {
          "dy": 1,
          "dry": -1
        },
        "belly_pink": {
          "dy": 1
        },
        "thigh_shade": {
          "dy": 1
        },
        "head": {
          "dy": 1
        },
        "cheek": {
          "dy": 1
        },
        "nose": {
          "dy": 1
        },
        "eye": {
          "dy": 1
        },
        "paw_front": {
          "dy": 0
        }
      }
    }
  ],
  "grid": []
}
};

window.PIXEL_PRESETS["chibi_walk_right_32x36"] = {
  label: "🚶 Chibi Walk Right Mannequin (32×36) [4f]",
  prompt: "Modular chibi human mannequin walking right (4-frame cycle), JRPG/paperdoll aesthetic with separate body parts for clothing overlays",
  data: {
  "name": "chibi_walk_right_32x36",
  "author": "PixelDSL Studio",
  "description": "Modular chibi human mannequin walking right (4-frame cycle), JRPG/paperdoll aesthetic with separate body parts for clothing overlays",
  "width": 32,
  "height": 36,
  "fps": 6,
  "palette": {
    ".": null,
    "o": "#c89e76",
    "b": "#fbd7ba",
    "h": "#fbe7c3",
    "s": "#f8bb8f",
    "m": "#e7bc93",
    "n": "#ddb38a",
    "t": "#d8b095",
    "E": "#4e221c",
    "P": "#371c00",
    "I": "#804000",
    "W": "#ffffff",
    "S": "#d5dadf",
    "C": "#1e3a5f",
    "c": "#2b5282",
    "D": "#14253d",
    "G": "#5a3d28",
    "g": "#7a5336",
    "K": "#332216",
    "P_p": "#4a5568",
    "H": "#663300",
    "h_h": "#884400",
    "h_d": "#442200"
  },
  "hideGrid": true,
  "layers": [
    {
      "id": "leg_back",
      "name": "Back Leg",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "...............omo..............",
        "...............ommo.............",
        "...............ommo.............",
        "...............omo..............",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................"
      ],
      "parent": "body"
    },
    {
      "id": "arm_back",
      "name": "Back Arm",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................"
      ],
      "parent": "body"
    },
    {
      "id": "body",
      "name": "Torso & Pelvis",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "...........oobboooo.............",
        "...........ommbbbo..............",
        "...........omo..................",
        "...........omo..................",
        "...........omo..................",
        "...........omo..................",
        "...........oom..................",
        "...........oom..................",
        "...........oom..................",
        "...........omoooo...............",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................"
      ]
    },
    {
      "id": "leg_front",
      "name": "Front Leg",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "............omb.................",
        "............omb.................",
        "............omb.................",
        "............omb.................",
        "...........oomboo...............",
        "...........oombbo...............",
        "...........oommbbo..............",
        "............oooooo..............",
        "................................",
        "................................"
      ],
      "parent": "body"
    },
    {
      "id": "head",
      "name": "Head Base",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        ".............ooooo..............",
        "...........oobbbbboo............",
        "..........obbbhhbbbbo...........",
        ".........obbhhhhhhhho...........",
        ".........obhhhhhhhhho...........",
        ".........nbbbhhhhhhho...........",
        ".........obbbbbh...ho...........",
        ".........obbbbb....bo...........",
        ".........obbbbb....boo..........",
        ".........obbbbb....bbo..........",
        "..........obbhhhbbbbo...........",
        "...........oobbbhhhoo...........",
        "............ooobbboo............",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................"
      ],
      "parent": "body"
    },
    {
      "id": "eyes",
      "name": "Eyes (Anime Profile)",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................EEE.............",
        "...............ESEE.............",
        "...............ESIE.............",
        "...............ESIE.............",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................"
      ],
      "parent": "head"
    },
    {
      "id": "arm_front",
      "name": "Front Arm",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "..............bobo..............",
        "..............bobo..............",
        "..............bobo..............",
        "..............bobo..............",
        "..............bobo..............",
        "..............mobo..............",
        "..............mobo..............",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................"
      ],
      "parent": "body"
    }
  ],
  "frames": [
    {
      "name": "Walk Right Step 2",
      "layers": {
        "leg_back": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........oombm................",
            ".............obm................",
            ".............oom................",
            "............oobm................",
            "...........oommo................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "arm_back": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........om...................",
            "...........om...................",
            "...........oo...................",
            "...........oo...................",
            "...........oo...................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "body": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "............obboooo.............",
            "...........ombbbbo..............",
            "...........ommbbbo..............",
            ".............ob.................",
            ".............ob.................",
            ".............mb.................",
            ".............mo.................",
            ".............mo.................",
            "...........ombo.................",
            "...........obbo.................",
            "...........ooobbo...............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "leg_front": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................o...............",
            "................o...............",
            "................mo..............",
            "................oo..............",
            "................o...............",
            "...........ommobo...............",
            "...........omoobbo..............",
            "...........ooooooo..............",
            "................................",
            "................................"
          ]
        },
        "head": {
          "grid": [
            "................................",
            "................................",
            ".............ooooo..............",
            "...........oobbbbboo............",
            "..........obbbhhbbbbo...........",
            ".........obbhhhhhhhho...........",
            ".........obhhhhhhhhho...........",
            ".........nbbbhhhhhhho...........",
            ".........obbbbbh...ho...........",
            ".........obbbbb....bo...........",
            ".........obbbbb....boo..........",
            ".........obbbbb....bbo..........",
            "..........obbhhhbbbbo...........",
            "...........oobbbhhhoo...........",
            "............ooobbboo............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "eyes": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................EEE.............",
            "...............ESEE.............",
            "...............ESIE.............",
            "...............ESIE.............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "arm_front": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...............bbo..............",
            "...............obo..............",
            "...............obo..............",
            "...............bbo..............",
            "...............bbo..............",
            "...............bboo.............",
            "...............bboo.............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        }
      }
    },
    {
      "name": "Walk Right Step 3",
      "layers": {
        "leg_back": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "..........ombo..................",
            "..........ombo..................",
            "..........ombb..................",
            ".........ommmm..................",
            ".........ooooo..................",
            "................................",
            "................................"
          ]
        },
        "arm_back": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "body": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "............obboooo.............",
            "...........ombbbbo..............",
            "...........ommbbbo..............",
            "...........omo..................",
            "...........omo..................",
            "...........omo..................",
            "...........omo..................",
            "...........oom..................",
            "...........oom..................",
            "...........oom..................",
            "...........omooooo..............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "leg_front": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........ombooo...............",
            "...........ombomo...............",
            "...........ombomo...............",
            "..............mmo...............",
            "..............mmo...............",
            "..............ommo..............",
            "..............ommmo.............",
            "..............ooooo.............",
            "................................",
            "................................"
          ]
        },
        "head": {
          "grid": [
            "................................",
            "................................",
            ".............ooooo..............",
            "...........oobbbbboo............",
            "..........obbbhhbbbbo...........",
            ".........obbhhhhhhhho...........",
            ".........obhhhhhhhhho...........",
            ".........nbbbhhhhhhho...........",
            ".........obbbbbh...ho...........",
            ".........obbbbb....bo...........",
            ".........obbbbb....boo..........",
            ".........obbbbb....bbo..........",
            "..........obbhhhbbbbo...........",
            "...........oobbbhhhoo...........",
            "............ooobbboo............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "eyes": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................EEE.............",
            "...............ESEE.............",
            "...............ESIE.............",
            "...............ESIE.............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "arm_front": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "..............bobo..............",
            "..............bobo..............",
            "..............bobo..............",
            "..............bobo..............",
            "..............bobo..............",
            "..............mobo..............",
            "..............mobo..............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        }
      }
    },
    {
      "name": "Walk Right Step 4",
      "layers": {
        "leg_back": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........omb..................",
            "............om..................",
            "............om..................",
            "............om..................",
            "...........ommomo...............",
            "..........ommbbomo..............",
            "...........oobbommo.............",
            "............ooooooo.............",
            "................................",
            "................................"
          ]
        },
        "arm_back": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "body": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "............obboooo.............",
            "...........ombbbbo..............",
            "...........ommbbbo..............",
            "...........omo..................",
            "...........omo..................",
            "...........omb..................",
            "...........omb..................",
            "...........omm..................",
            "...........omm..................",
            "...........omm..................",
            "...........ommbooo..............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "leg_front": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "..............oo................",
            "..............boo...............",
            "..............boo...............",
            "..............boo...............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "head": {
          "grid": [
            "................................",
            "................................",
            ".............ooooo..............",
            "...........oobbbbboo............",
            "..........obbbhhbbbbo...........",
            ".........obbhhhhhhhho...........",
            ".........obhhhhhhhhho...........",
            ".........nbbbhhhhhhho...........",
            ".........obbbbbh...ho...........",
            ".........obbbbb....bo...........",
            ".........obbbbb....boo..........",
            ".........obbbbb....bbo..........",
            "..........obbhhhbbbbo...........",
            "...........oobbbhhhoo...........",
            "............ooobbboo............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "eyes": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................EEE.............",
            "...............ESEE.............",
            "...............ESIE.............",
            "...............ESIE.............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "arm_front": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "..............bobo..............",
            "..............bboo..............",
            "..............oboo..............",
            "..............obbo..............",
            "..............bobo..............",
            "..............mobmo.............",
            "..............mobmo.............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        }
      }
    }
  ]
}
};

window.PIXEL_PRESETS["chibi_base_mannequin_32x36"] = {
  label: "🧍 Chibi Base Mannequin Front (32×36) [8f]",
  prompt: "Modular chibi human mannequin front view with 8-frame walk cycle, JRPG/paperdoll aesthetic with separate body parts for clothing overlays",
  data: {
  "name": "chibi_base_mannequin_32x36",
  "author": "PixelDSL Studio",
  "description": "Modular chibi human mannequin front view with 8-frame walk cycle, JRPG/paperdoll aesthetic with separate body parts for clothing overlays",
  "width": 32,
  "height": 36,
  "fps": 8,
  "palette": {
    ".": null,
    "o": "#c89e76",
    "b": "#fbd7ba",
    "h": "#fbe7c3",
    "s": "#f8bb8f",
    "m": "#e7bc93",
    "n": "#ddb38a",
    "t": "#d8b095",
    "E": "#4e221c",
    "P": "#371c00",
    "I": "#804000",
    "W": "#ffffff",
    "S": "#d5dadf",
    "C": "#1e3a5f",
    "c": "#2b5282",
    "D": "#14253d",
    "G": "#5a3d28",
    "g": "#7a5336",
    "K": "#332216",
    "P_p": "#4a5568",
    "H": "#663300",
    "h_h": "#884400",
    "h_d": "#442200"
  },
  "hideGrid": true,
  "layers": [
    {
      "id": "leg_l",
      "name": "Left Leg",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "...........ombn.................",
        "...........onbo.................",
        "...........onbo.................",
        "...........onbo.................",
        "...........obbo.................",
        "...........obbo.................",
        "..........onnno.................",
        "..........ooooo.................",
        "................................"
      ],
      "parent": "body"
    },
    {
      "id": "leg_r",
      "name": "Right Leg",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................nbmo............",
        "................obno............",
        "................obno............",
        "................obno............",
        "................obbo............",
        "................obbo............",
        "................onnno...........",
        "................ooooo...........",
        "................................"
      ],
      "parent": "body"
    },
    {
      "id": "body",
      "name": "Torso & Pelvis",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "...........bmooooomb............",
        "...........ommmmmmmo............",
        "...........oombbbmoo............",
        "...........oonmbmnoo............",
        "...........oonmbmnoo............",
        "...........oonmbmnoo............",
        "...........oommbmmoo............",
        "...........oombbbmoo............",
        "...........oombmbmoo............",
        "...........oombmbmoo............",
        "...........ombmmmbmo............",
        "...............o................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................"
      ]
    },
    {
      "id": "arm_l",
      "name": "Left Arm",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        ".........ob.....................",
        ".........ob.....................",
        ".........ob.....................",
        ".........ob.....................",
        ".........ob.....................",
        ".........om.....................",
        ".........om.....................",
        "........omm.....................",
        "........omb.....................",
        "........omb.....................",
        ".........oo.....................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................"
      ],
      "parent": "body"
    },
    {
      "id": "arm_r",
      "name": "Right Arm",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "....................bo..........",
        "....................bo..........",
        "....................bo..........",
        "....................bo..........",
        "....................bo..........",
        "....................bo..........",
        "....................mmo.........",
        "....................bmo.........",
        "....................bmo.........",
        "....................oo..........",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................"
      ],
      "parent": "body"
    },
    {
      "id": "head",
      "name": "Head Base",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "............ooooooo.............",
        "...........ossssssho............",
        "..........osssshhhhho...........",
        ".........ossshhhhhhhho..........",
        ".........osshhhhhhhhho..........",
        ".........oshhhhhhhhhho..........",
        ".........obbbhhhhhbbbo..........",
        "........onb...bbb...bno.........",
        "........on....bbb....no.........",
        ".........o....bbb....o..........",
        "..........o...bbb...o...........",
        "..........onhhhhhhhhn...........",
        "...........onhttthno............",
        "..........ooonnnnnooo...........",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................"
      ],
      "parent": "body"
    },
    {
      "id": "eyes",
      "name": "Expressive Eyes",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "...........EEP...PEE............",
        "..........ESPP...PPSE...........",
        "..........ESIP...PISE...........",
        "...........SIP...PIS............",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................"
      ],
      "parent": "head"
    }
  ],
  "frames": [
    {
      "name": "Front Walk Frame 2",
      "layers": {
        "leg_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........ombn.................",
            "...........onbo.................",
            "...........onbo.................",
            "...........onbo.................",
            "...........obbo.................",
            "...........obbo.................",
            "..........onnno.................",
            "..........ooooo.................",
            "................................"
          ]
        },
        "leg_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................nbmo............",
            "................obno............",
            "................onno............",
            "................onno............",
            "................onno............",
            ".................oo.............",
            "................oooo............",
            "................................",
            "................................"
          ]
        },
        "body": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........bmooooomb............",
            "...........ommmmmmmo............",
            "...........oombbbmoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oommbmmoo............",
            "...........oombbbmoo............",
            "...........oombmbmoo............",
            "...........oombmbmoo............",
            "...........ombmmmbmo............",
            "...............o................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...............o................",
            "...............o................",
            "................................"
          ]
        },
        "arm_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........om.....................",
            ".........om.....................",
            "........omm.....................",
            "........omb.....................",
            "........omb.....................",
            ".........oo.....................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "arm_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................mmo.........",
            "....................bmo.........",
            "....................bmo.........",
            "....................oo..........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "head": {
          "grid": [
            "................................",
            "................................",
            "............ooooooo.............",
            "...........ossssssho............",
            "..........osssshhhhho...........",
            ".........ossshhhhhhhho..........",
            ".........osshhhhhhhhho..........",
            ".........oshhhhhhhhhho..........",
            ".........obbbhhhhhbbbo..........",
            "........onb...bbb...bno.........",
            "........on....bbb....no.........",
            ".........o....bbb....o..........",
            "..........o...bbb...o...........",
            "..........onhhhhhhhhn...........",
            "...........onhttthno............",
            "..........ooonnnnnooo...........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "eyes": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........EEP...PEE............",
            "..........ESPP...PPSE...........",
            "..........ESIP...PISE...........",
            "...........SIP...PIS............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        }
      }
    },
    {
      "name": "Front Walk Frame 3",
      "layers": {
        "leg_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........ombn.................",
            "...........onbo.................",
            "...........onbo.................",
            "...........onbo.................",
            "...........obbo.................",
            "..........oobbo.................",
            "..........onnno.................",
            "..........ooooo.................",
            "................................"
          ]
        },
        "leg_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................nbmo............",
            "................obno............",
            "................onno............",
            "................oooo............",
            ".................oo.............",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "body": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........bmooooomb............",
            "...........ommmmmmmo............",
            "...........oombbbmoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oommbmmoo............",
            "...........oombbbmoo............",
            "...........oombmbmoo............",
            "...........oombmbmoo............",
            "...........ombmmmbmo............",
            "...............o................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...............o................",
            "...............o................",
            "...............o................",
            "................................"
          ]
        },
        "arm_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........om.....................",
            ".........om.....................",
            "........omm.....................",
            "........omb.....................",
            "........omb.....................",
            ".........oo.....................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "arm_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................mmo.........",
            "....................bmo.........",
            "....................bmo.........",
            "....................oo..........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "head": {
          "grid": [
            "................................",
            "................................",
            "............ooooooo.............",
            "...........ossssssho............",
            "..........osssshhhhho...........",
            ".........ossshhhhhhhho..........",
            ".........osshhhhhhhhho..........",
            ".........oshhhhhhhhhho..........",
            ".........obbbhhhhhbbbo..........",
            "........onb...bbb...bno.........",
            "........on....bbb....no.........",
            ".........o....bbb....o..........",
            "..........o...bbb...o...........",
            "..........onhhhhhhhhn...........",
            "...........onhttthno............",
            "..........ooonnnnnooo...........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "eyes": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........EEP...PEE............",
            "..........ESPP...PPSE...........",
            "..........ESIP...PISE...........",
            "...........SIP...PIS............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        }
      }
    },
    {
      "name": "Front Walk Frame 4",
      "layers": {
        "leg_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........ombn.................",
            "...........onbo.................",
            "...........onbo.................",
            "...........onbo.................",
            "...........obbo.................",
            "...........obbo.................",
            "..........onnno.................",
            "..........ooooo.................",
            "................................"
          ]
        },
        "leg_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................nbmo............",
            "................obno............",
            "................onno............",
            "................onno............",
            "................onno............",
            ".................oo.............",
            "................oooo............",
            "................................",
            "................................"
          ]
        },
        "body": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........bmooooomb............",
            "...........ommmmmmmo............",
            "...........oombbbmoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oommbmmoo............",
            "...........oombbbmoo............",
            "...........oombmbmoo............",
            "...........oombmbmoo............",
            "...........ombmmmbmo............",
            "...............o................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...............o................",
            "...............o................",
            "................................"
          ]
        },
        "arm_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........om.....................",
            ".........om.....................",
            "........omm.....................",
            "........omb.....................",
            "........omb.....................",
            ".........oo.....................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "arm_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................mmo.........",
            "....................bmo.........",
            "....................bmo.........",
            "....................oo..........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "head": {
          "grid": [
            "................................",
            "................................",
            "............ooooooo.............",
            "...........ossssssho............",
            "..........osssshhhhho...........",
            ".........ossshhhhhhhho..........",
            ".........osshhhhhhhhho..........",
            ".........oshhhhhhhhhho..........",
            ".........obbbhhhhhbbbo..........",
            "........onb...bbb...bno.........",
            "........on....bbb....no.........",
            ".........o....bbb....o..........",
            "..........o...bbb...o...........",
            "..........onhhhhhhhhn...........",
            "...........onhttthno............",
            "..........ooonnnnnooo...........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "eyes": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........EEP...PEE............",
            "..........ESPP...PPSE...........",
            "..........ESIP...PISE...........",
            "...........SIP...PIS............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        }
      }
    },
    {
      "name": "Front Walk Frame 5",
      "layers": {
        "leg_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........ombn.................",
            "...........onbo.................",
            "...........onbo.................",
            "...........onbo.................",
            "...........obbo.................",
            "...........obbo.................",
            "..........onnno.................",
            "..........ooooo.................",
            "................................"
          ]
        },
        "leg_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................nbmo............",
            "................obno............",
            "................obno............",
            "................obno............",
            "................obbo............",
            "................obbo............",
            "................onnno...........",
            "................ooooo...........",
            "................................"
          ]
        },
        "body": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........bmooooomb............",
            "...........ommmmmmmo............",
            "...........oombbbmoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oommbmmoo............",
            "...........oombbbmoo............",
            "...........oombmbmoo............",
            "...........oombmbmoo............",
            "...........ombmmmbmo............",
            "...............o................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "arm_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........om.....................",
            ".........om.....................",
            "........omm.....................",
            "........omb.....................",
            "........omb.....................",
            ".........oo.....................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "arm_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................mmo.........",
            "....................bmo.........",
            "....................bmo.........",
            "....................oo..........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "head": {
          "grid": [
            "................................",
            "................................",
            "............ooooooo.............",
            "...........ossssssho............",
            "..........osssshhhhho...........",
            ".........ossshhhhhhhho..........",
            ".........osshhhhhhhhho..........",
            ".........oshhhhhhhhhho..........",
            ".........obbbhhhhhbbbo..........",
            "........onb...bbb...bno.........",
            "........on....bbb....no.........",
            ".........o....bbb....o..........",
            "..........o...bbb...o...........",
            "..........onhhhhhhhhn...........",
            "...........onhttthno............",
            "..........ooonnnnnooo...........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "eyes": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........EEP...PEE............",
            "..........ESPP...PPSE...........",
            "..........ESIP...PISE...........",
            "...........SIP...PIS............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        }
      }
    },
    {
      "name": "Front Walk Frame 6",
      "layers": {
        "leg_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........ombn.................",
            "...........onbo.................",
            "...........onno.................",
            "...........onno.................",
            "...........onno.................",
            "............oo..................",
            "...........oooo.................",
            "................................",
            "................................"
          ]
        },
        "leg_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................nbmo............",
            "................obno............",
            "................obno............",
            "................obno............",
            "................obbo............",
            "................obbo............",
            "................onnno...........",
            "................ooooo...........",
            "................................"
          ]
        },
        "body": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........bmooooomb............",
            "...........ommmmmmmo............",
            "...........oombbbmoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oommbmmoo............",
            "...........oombbbmoo............",
            "...........oombmbmoo............",
            "...........oombmbmoo............",
            "...........ombmmmbmo............",
            "...............o................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...............o................",
            "...............o................",
            "................................"
          ]
        },
        "arm_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........om.....................",
            ".........om.....................",
            "........omm.....................",
            "........omb.....................",
            "........omb.....................",
            ".........oo.....................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "arm_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................mmo.........",
            "....................bmo.........",
            "....................bmo.........",
            "....................oo..........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "head": {
          "grid": [
            "................................",
            "................................",
            "............ooooooo.............",
            "...........ossssssho............",
            "..........osssshhhhho...........",
            ".........ossshhhhhhhho..........",
            ".........osshhhhhhhhho..........",
            ".........oshhhhhhhhhho..........",
            ".........obbbhhhhhbbbo..........",
            "........onb...bbb...bno.........",
            "........on....bbb....no.........",
            ".........o....bbb....o..........",
            "..........o...bbb...o...........",
            "..........onhhhhhhhhn...........",
            "...........onhttthno............",
            "..........ooonnnnnooo...........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "eyes": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........EEP...PEE............",
            "..........ESPP...PPSE...........",
            "..........ESIP...PISE...........",
            "...........SIP...PIS............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        }
      }
    },
    {
      "name": "Front Walk Frame 7",
      "layers": {
        "leg_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........ombn.................",
            "...........onbo.................",
            "...........onno.................",
            "...........oooo.................",
            "............oo..................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "leg_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................nbmo............",
            "................obno............",
            "................obno............",
            "................obno............",
            "................obbo............",
            "................obboo...........",
            "................onnno...........",
            "................ooooo...........",
            "................................"
          ]
        },
        "body": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........bmooooomb............",
            "...........ommmmmmmo............",
            "...........oombbbmoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oommbmmoo............",
            "...........oombbbmoo............",
            "...........oombmbmoo............",
            "...........oombmbmoo............",
            "...........ombmmmbmo............",
            "...............o................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...............o................",
            "...............o................",
            "...............o................",
            "................................"
          ]
        },
        "arm_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........om.....................",
            ".........om.....................",
            "........omm.....................",
            "........omb.....................",
            "........omb.....................",
            ".........oo.....................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "arm_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................mmo.........",
            "....................bmo.........",
            "....................bmo.........",
            "....................oo..........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "head": {
          "grid": [
            "................................",
            "................................",
            "............ooooooo.............",
            "...........ossssssho............",
            "..........osssshhhhho...........",
            ".........ossshhhhhhhho..........",
            ".........osshhhhhhhhho..........",
            ".........oshhhhhhhhhho..........",
            ".........obbbhhhhhbbbo..........",
            "........onb...bbb...bno.........",
            "........on....bbb....no.........",
            ".........o....bbb....o..........",
            "..........o...bbb...o...........",
            "..........onhhhhhhhhn...........",
            "...........onhttthno............",
            "..........ooonnnnnooo...........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "eyes": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........EEP...PEE............",
            "..........ESPP...PPSE...........",
            "..........ESIP...PISE...........",
            "...........SIP...PIS............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        }
      }
    },
    {
      "name": "Front Walk Frame 8",
      "layers": {
        "leg_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........ombn.................",
            "...........onbo.................",
            "...........onno.................",
            "...........onno.................",
            "...........onno.................",
            "............oo..................",
            "...........oooo.................",
            "................................",
            "................................"
          ]
        },
        "leg_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................nbmo............",
            "................obno............",
            "................obno............",
            "................obno............",
            "................obbo............",
            "................obbo............",
            "................onnno...........",
            "................ooooo...........",
            "................................"
          ]
        },
        "body": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........bmooooomb............",
            "...........ommmmmmmo............",
            "...........oombbbmoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oommbmmoo............",
            "...........oombbbmoo............",
            "...........oombmbmoo............",
            "...........oombmbmoo............",
            "...........ombmmmbmo............",
            "...............o................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...............o................",
            "...............o................",
            "................................"
          ]
        },
        "arm_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........om.....................",
            ".........om.....................",
            "........omm.....................",
            "........omb.....................",
            "........omb.....................",
            ".........oo.....................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "arm_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................mmo.........",
            "....................bmo.........",
            "....................bmo.........",
            "....................oo..........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "head": {
          "grid": [
            "................................",
            "................................",
            "............ooooooo.............",
            "...........ossssssho............",
            "..........osssshhhhho...........",
            ".........ossshhhhhhhho..........",
            ".........osshhhhhhhhho..........",
            ".........oshhhhhhhhhho..........",
            ".........obbbhhhhhbbbo..........",
            "........onb...bbb...bno.........",
            "........on....bbb....no.........",
            ".........o....bbb....o..........",
            "..........o...bbb...o...........",
            "..........onhhhhhhhhn...........",
            "...........onhttthno............",
            "..........ooonnnnnooo...........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "eyes": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........EEP...PEE............",
            "..........ESPP...PPSE...........",
            "..........ESIP...PISE...........",
            "...........SIP...PIS............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        }
      }
    }
  ]
}
};

window.PIXEL_PRESETS["chibi_clothed_example_32x36"] = {
  label: "⚔️ Chibi Adventurer Clothed Example (32×36) [8f]",
  prompt: "Modular chibi adventurer character demonstrating clothing layers (hair, tunic, belt, trousers, boots) fitted directly onto the base mannequin",
  data: {
  "name": "chibi_clothed_example_32x36",
  "author": "PixelDSL Studio",
  "description": "Modular chibi adventurer character demonstrating clothing layers (hair, tunic, belt, trousers, boots) fitted directly onto the base mannequin",
  "width": 32,
  "height": 36,
  "fps": 8,
  "palette": {
    ".": null,
    "o": "#c89e76",
    "b": "#fbd7ba",
    "h": "#fbe7c3",
    "s": "#f8bb8f",
    "m": "#e7bc93",
    "n": "#ddb38a",
    "t": "#d8b095",
    "E": "#4e221c",
    "P": "#371c00",
    "I": "#804000",
    "W": "#ffffff",
    "S": "#d5dadf",
    "C": "#1e3a5f",
    "c": "#2b5282",
    "D": "#14253d",
    "G": "#6b4423",
    "g": "#8c5c32",
    "K": "#402611",
    "P_p": "#4a5568",
    "H": "#663300",
    "h_h": "#884400",
    "h_d": "#442200",
    "Y": "#995511",
    "y": "#442200",
    "T": "#3d4852",
    "U": "#242d35",
    "B": "#d4af37"
  },
  "hideGrid": true,
  "layers": [
    {
      "id": "leg_l",
      "name": "Left Leg",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "...........ombn.................",
        "...........onbo.................",
        "...........onbo.................",
        "...........onbo.................",
        "...........obbo.................",
        "...........obbo.................",
        "..........onnno.................",
        "..........ooooo.................",
        "................................"
      ],
      "parent": "body"
    },
    {
      "id": "leg_r",
      "name": "Right Leg",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................nbmo............",
        "................obno............",
        "................obno............",
        "................obno............",
        "................obbo............",
        "................obbo............",
        "................onnno...........",
        "................ooooo...........",
        "................................"
      ],
      "parent": "body"
    },
    {
      "id": "pants",
      "name": "Trousers (Clothing)",
      "parent": "body",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "...........UTTTUUTTTU...........",
        "...........UTTTUUTTTU...........",
        "...........UTTU..UTTU...........",
        "...........UTTU..UTTU...........",
        "...........UTTU..UTTU...........",
        "...........UTTU..UTTU...........",
        "...........UUUU..UUUU...........",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................"
      ]
    },
    {
      "id": "boots",
      "name": "Boots (Clothing)",
      "parent": "body",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "...........KGGK..KGGK...........",
        "..........KgGGK..KGGgK..........",
        "..........KKKKK..KKKKK..........",
        "................................",
        "................................",
        "................................"
      ]
    },
    {
      "id": "body",
      "name": "Torso & Pelvis",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "...........bmooooomb............",
        "...........ommmmmmmo............",
        "...........oombbbmoo............",
        "...........oonmbmnoo............",
        "...........oonmbmnoo............",
        "...........oonmbmnoo............",
        "...........oommbmmoo............",
        "...........oombbbmoo............",
        "...........oombmbmoo............",
        "...........oombmbmoo............",
        "...........ombmmmbmo............",
        "...............o................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................"
      ]
    },
    {
      "id": "tunic",
      "name": "Adventurer Tunic (Clothing)",
      "parent": "body",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "...........DDDDDDDDDD...........",
        "..........DcCCDDCCCcD...........",
        "..........DCcCDDCcCCD...........",
        "..........DCCCCCCCCCD...........",
        "...........DCCCCCCCCD...........",
        "...........DCCCCCCCCD...........",
        "...........KGGGBBGGgK...........",
        "...........KKKKBBKKKK...........",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................"
      ]
    },
    {
      "id": "arm_l",
      "name": "Left Arm",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        ".........ob.....................",
        ".........ob.....................",
        ".........ob.....................",
        ".........ob.....................",
        ".........ob.....................",
        ".........om.....................",
        ".........om.....................",
        "........omm.....................",
        "........omb.....................",
        "........omb.....................",
        ".........oo.....................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................"
      ],
      "parent": "body"
    },
    {
      "id": "arm_r",
      "name": "Right Arm",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "....................bo..........",
        "....................bo..........",
        "....................bo..........",
        "....................bo..........",
        "....................bo..........",
        "....................bo..........",
        "....................mmo.........",
        "....................bmo.........",
        "....................bmo.........",
        "....................oo..........",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................"
      ],
      "parent": "body"
    },
    {
      "id": "head",
      "name": "Head Base",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "............ooooooo.............",
        "...........ossssssho............",
        "..........osssshhhhho...........",
        ".........ossshhhhhhhho..........",
        ".........osshhhhhhhhho..........",
        ".........oshhhhhhhhhho..........",
        ".........obbbhhhhhbbbo..........",
        "........onb...bbb...bno.........",
        "........on....bbb....no.........",
        ".........o....bbb....o..........",
        "..........o...bbb...o...........",
        "..........onhhhhhhhhn...........",
        "...........onhttthno............",
        "..........ooonnnnnooo...........",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................"
      ],
      "parent": "body"
    },
    {
      "id": "eyes",
      "name": "Expressive Eyes",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "...........EEP...PEE............",
        "..........ESPP...PPSE...........",
        "..........ESIP...PISE...........",
        "...........SIP...PIS............",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................"
      ],
      "parent": "head"
    },
    {
      "id": "hair",
      "name": "Anime Hair (Hairstyle)",
      "parent": "head",
      "op": "stamp",
      "x": 0,
      "y": 0,
      "grid": [
        "................................",
        "................................",
        "............yyyyyyy.............",
        "...........yHHYYYHHy............",
        "..........yHYYYYYYHHy...........",
        ".........yHYYYYYYYHHy...........",
        ".........yHHYYHYYHHHy...........",
        "........yHy..yHy..yHy...........",
        "........yHy...y...yHy...........",
        "........yy.........yy...........",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................"
      ]
    }
  ],
  "frames": [
    {
      "name": "Front Walk Frame 2",
      "layers": {
        "leg_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........ombn.................",
            "...........onbo.................",
            "...........onbo.................",
            "...........onbo.................",
            "...........obbo.................",
            "...........obbo.................",
            "..........onnno.................",
            "..........ooooo.................",
            "................................"
          ]
        },
        "leg_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................nbmo............",
            "................obno............",
            "................onno............",
            "................onno............",
            "................onno............",
            ".................oo.............",
            "................oooo............",
            "................................",
            "................................"
          ]
        },
        "body": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........bmooooomb............",
            "...........ommmmmmmo............",
            "...........oombbbmoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oommbmmoo............",
            "...........oombbbmoo............",
            "...........oombmbmoo............",
            "...........oombmbmoo............",
            "...........ombmmmbmo............",
            "...............o................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...............o................",
            "...............o................",
            "................................"
          ]
        },
        "arm_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........om.....................",
            ".........om.....................",
            "........omm.....................",
            "........omb.....................",
            "........omb.....................",
            ".........oo.....................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "arm_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................mmo.........",
            "....................bmo.........",
            "....................bmo.........",
            "....................oo..........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "head": {
          "grid": [
            "................................",
            "................................",
            "............ooooooo.............",
            "...........ossssssho............",
            "..........osssshhhhho...........",
            ".........ossshhhhhhhho..........",
            ".........osshhhhhhhhho..........",
            ".........oshhhhhhhhhho..........",
            ".........obbbhhhhhbbbo..........",
            "........onb...bbb...bno.........",
            "........on....bbb....no.........",
            ".........o....bbb....o..........",
            "..........o...bbb...o...........",
            "..........onhhhhhhhhn...........",
            "...........onhttthno............",
            "..........ooonnnnnooo...........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "eyes": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........EEP...PEE............",
            "..........ESPP...PPSE...........",
            "..........ESIP...PISE...........",
            "...........SIP...PIS............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        }
      }
    },
    {
      "name": "Front Walk Frame 3",
      "layers": {
        "leg_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........ombn.................",
            "...........onbo.................",
            "...........onbo.................",
            "...........onbo.................",
            "...........obbo.................",
            "..........oobbo.................",
            "..........onnno.................",
            "..........ooooo.................",
            "................................"
          ]
        },
        "leg_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................nbmo............",
            "................obno............",
            "................onno............",
            "................oooo............",
            ".................oo.............",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "body": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........bmooooomb............",
            "...........ommmmmmmo............",
            "...........oombbbmoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oommbmmoo............",
            "...........oombbbmoo............",
            "...........oombmbmoo............",
            "...........oombmbmoo............",
            "...........ombmmmbmo............",
            "...............o................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...............o................",
            "...............o................",
            "...............o................",
            "................................"
          ]
        },
        "arm_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........om.....................",
            ".........om.....................",
            "........omm.....................",
            "........omb.....................",
            "........omb.....................",
            ".........oo.....................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "arm_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................mmo.........",
            "....................bmo.........",
            "....................bmo.........",
            "....................oo..........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "head": {
          "grid": [
            "................................",
            "................................",
            "............ooooooo.............",
            "...........ossssssho............",
            "..........osssshhhhho...........",
            ".........ossshhhhhhhho..........",
            ".........osshhhhhhhhho..........",
            ".........oshhhhhhhhhho..........",
            ".........obbbhhhhhbbbo..........",
            "........onb...bbb...bno.........",
            "........on....bbb....no.........",
            ".........o....bbb....o..........",
            "..........o...bbb...o...........",
            "..........onhhhhhhhhn...........",
            "...........onhttthno............",
            "..........ooonnnnnooo...........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "eyes": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........EEP...PEE............",
            "..........ESPP...PPSE...........",
            "..........ESIP...PISE...........",
            "...........SIP...PIS............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        }
      }
    },
    {
      "name": "Front Walk Frame 4",
      "layers": {
        "leg_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........ombn.................",
            "...........onbo.................",
            "...........onbo.................",
            "...........onbo.................",
            "...........obbo.................",
            "...........obbo.................",
            "..........onnno.................",
            "..........ooooo.................",
            "................................"
          ]
        },
        "leg_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................nbmo............",
            "................obno............",
            "................onno............",
            "................onno............",
            "................onno............",
            ".................oo.............",
            "................oooo............",
            "................................",
            "................................"
          ]
        },
        "body": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........bmooooomb............",
            "...........ommmmmmmo............",
            "...........oombbbmoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oommbmmoo............",
            "...........oombbbmoo............",
            "...........oombmbmoo............",
            "...........oombmbmoo............",
            "...........ombmmmbmo............",
            "...............o................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...............o................",
            "...............o................",
            "................................"
          ]
        },
        "arm_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........om.....................",
            ".........om.....................",
            "........omm.....................",
            "........omb.....................",
            "........omb.....................",
            ".........oo.....................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "arm_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................mmo.........",
            "....................bmo.........",
            "....................bmo.........",
            "....................oo..........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "head": {
          "grid": [
            "................................",
            "................................",
            "............ooooooo.............",
            "...........ossssssho............",
            "..........osssshhhhho...........",
            ".........ossshhhhhhhho..........",
            ".........osshhhhhhhhho..........",
            ".........oshhhhhhhhhho..........",
            ".........obbbhhhhhbbbo..........",
            "........onb...bbb...bno.........",
            "........on....bbb....no.........",
            ".........o....bbb....o..........",
            "..........o...bbb...o...........",
            "..........onhhhhhhhhn...........",
            "...........onhttthno............",
            "..........ooonnnnnooo...........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "eyes": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........EEP...PEE............",
            "..........ESPP...PPSE...........",
            "..........ESIP...PISE...........",
            "...........SIP...PIS............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        }
      }
    },
    {
      "name": "Front Walk Frame 5",
      "layers": {
        "leg_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........ombn.................",
            "...........onbo.................",
            "...........onbo.................",
            "...........onbo.................",
            "...........obbo.................",
            "...........obbo.................",
            "..........onnno.................",
            "..........ooooo.................",
            "................................"
          ]
        },
        "leg_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................nbmo............",
            "................obno............",
            "................obno............",
            "................obno............",
            "................obbo............",
            "................obbo............",
            "................onnno...........",
            "................ooooo...........",
            "................................"
          ]
        },
        "body": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........bmooooomb............",
            "...........ommmmmmmo............",
            "...........oombbbmoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oommbmmoo............",
            "...........oombbbmoo............",
            "...........oombmbmoo............",
            "...........oombmbmoo............",
            "...........ombmmmbmo............",
            "...............o................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "arm_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........om.....................",
            ".........om.....................",
            "........omm.....................",
            "........omb.....................",
            "........omb.....................",
            ".........oo.....................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "arm_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................mmo.........",
            "....................bmo.........",
            "....................bmo.........",
            "....................oo..........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "head": {
          "grid": [
            "................................",
            "................................",
            "............ooooooo.............",
            "...........ossssssho............",
            "..........osssshhhhho...........",
            ".........ossshhhhhhhho..........",
            ".........osshhhhhhhhho..........",
            ".........oshhhhhhhhhho..........",
            ".........obbbhhhhhbbbo..........",
            "........onb...bbb...bno.........",
            "........on....bbb....no.........",
            ".........o....bbb....o..........",
            "..........o...bbb...o...........",
            "..........onhhhhhhhhn...........",
            "...........onhttthno............",
            "..........ooonnnnnooo...........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "eyes": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........EEP...PEE............",
            "..........ESPP...PPSE...........",
            "..........ESIP...PISE...........",
            "...........SIP...PIS............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        }
      }
    },
    {
      "name": "Front Walk Frame 6",
      "layers": {
        "leg_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........ombn.................",
            "...........onbo.................",
            "...........onno.................",
            "...........onno.................",
            "...........onno.................",
            "............oo..................",
            "...........oooo.................",
            "................................",
            "................................"
          ]
        },
        "leg_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................nbmo............",
            "................obno............",
            "................obno............",
            "................obno............",
            "................obbo............",
            "................obbo............",
            "................onnno...........",
            "................ooooo...........",
            "................................"
          ]
        },
        "body": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........bmooooomb............",
            "...........ommmmmmmo............",
            "...........oombbbmoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oommbmmoo............",
            "...........oombbbmoo............",
            "...........oombmbmoo............",
            "...........oombmbmoo............",
            "...........ombmmmbmo............",
            "...............o................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...............o................",
            "...............o................",
            "................................"
          ]
        },
        "arm_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........om.....................",
            ".........om.....................",
            "........omm.....................",
            "........omb.....................",
            "........omb.....................",
            ".........oo.....................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "arm_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................mmo.........",
            "....................bmo.........",
            "....................bmo.........",
            "....................oo..........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "head": {
          "grid": [
            "................................",
            "................................",
            "............ooooooo.............",
            "...........ossssssho............",
            "..........osssshhhhho...........",
            ".........ossshhhhhhhho..........",
            ".........osshhhhhhhhho..........",
            ".........oshhhhhhhhhho..........",
            ".........obbbhhhhhbbbo..........",
            "........onb...bbb...bno.........",
            "........on....bbb....no.........",
            ".........o....bbb....o..........",
            "..........o...bbb...o...........",
            "..........onhhhhhhhhn...........",
            "...........onhttthno............",
            "..........ooonnnnnooo...........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "eyes": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........EEP...PEE............",
            "..........ESPP...PPSE...........",
            "..........ESIP...PISE...........",
            "...........SIP...PIS............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        }
      }
    },
    {
      "name": "Front Walk Frame 7",
      "layers": {
        "leg_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........ombn.................",
            "...........onbo.................",
            "...........onno.................",
            "...........oooo.................",
            "............oo..................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "leg_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................nbmo............",
            "................obno............",
            "................obno............",
            "................obno............",
            "................obbo............",
            "................obboo...........",
            "................onnno...........",
            "................ooooo...........",
            "................................"
          ]
        },
        "body": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........bmooooomb............",
            "...........ommmmmmmo............",
            "...........oombbbmoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oommbmmoo............",
            "...........oombbbmoo............",
            "...........oombmbmoo............",
            "...........oombmbmoo............",
            "...........ombmmmbmo............",
            "...............o................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...............o................",
            "...............o................",
            "...............o................",
            "................................"
          ]
        },
        "arm_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........om.....................",
            ".........om.....................",
            "........omm.....................",
            "........omb.....................",
            "........omb.....................",
            ".........oo.....................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "arm_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................mmo.........",
            "....................bmo.........",
            "....................bmo.........",
            "....................oo..........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "head": {
          "grid": [
            "................................",
            "................................",
            "............ooooooo.............",
            "...........ossssssho............",
            "..........osssshhhhho...........",
            ".........ossshhhhhhhho..........",
            ".........osshhhhhhhhho..........",
            ".........oshhhhhhhhhho..........",
            ".........obbbhhhhhbbbo..........",
            "........onb...bbb...bno.........",
            "........on....bbb....no.........",
            ".........o....bbb....o..........",
            "..........o...bbb...o...........",
            "..........onhhhhhhhhn...........",
            "...........onhttthno............",
            "..........ooonnnnnooo...........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "eyes": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........EEP...PEE............",
            "..........ESPP...PPSE...........",
            "..........ESIP...PISE...........",
            "...........SIP...PIS............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        }
      }
    },
    {
      "name": "Front Walk Frame 8",
      "layers": {
        "leg_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........ombn.................",
            "...........onbo.................",
            "...........onno.................",
            "...........onno.................",
            "...........onno.................",
            "............oo..................",
            "...........oooo.................",
            "................................",
            "................................"
          ]
        },
        "leg_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................nbmo............",
            "................obno............",
            "................obno............",
            "................obno............",
            "................obbo............",
            "................obbo............",
            "................onnno...........",
            "................ooooo...........",
            "................................"
          ]
        },
        "body": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........bmooooomb............",
            "...........ommmmmmmo............",
            "...........oombbbmoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oonmbmnoo............",
            "...........oommbmmoo............",
            "...........oombbbmoo............",
            "...........oombmbmoo............",
            "...........oombmbmoo............",
            "...........ombmmmbmo............",
            "...............o................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...............o................",
            "...............o................",
            "................................"
          ]
        },
        "arm_l": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........ob.....................",
            ".........om.....................",
            ".........om.....................",
            "........omm.....................",
            "........omb.....................",
            "........omb.....................",
            ".........oo.....................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "arm_r": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................bo..........",
            "....................mmo.........",
            "....................bmo.........",
            "....................bmo.........",
            "....................oo..........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "head": {
          "grid": [
            "................................",
            "................................",
            "............ooooooo.............",
            "...........ossssssho............",
            "..........osssshhhhho...........",
            ".........ossshhhhhhhho..........",
            ".........osshhhhhhhhho..........",
            ".........oshhhhhhhhhho..........",
            ".........obbbhhhhhbbbo..........",
            "........onb...bbb...bno.........",
            "........on....bbb....no.........",
            ".........o....bbb....o..........",
            "..........o...bbb...o...........",
            "..........onhhhhhhhhn...........",
            "...........onhttthno............",
            "..........ooonnnnnooo...........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        },
        "eyes": {
          "grid": [
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "...........EEP...PEE............",
            "..........ESPP...PPSE...........",
            "..........ESIP...PISE...........",
            "...........SIP...PIS............",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
          ]
        }
      }
    }
  ]
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["magma_rock_48x48"] = {
  label: "🌋 Molten Magma Rock (48×48) [10f]",
  prompt: "Generated via CLI: magma_rock_48x48",
  data: {
  "type": "shader",
  "name": "magma_rock_48x48",
  "label": "🌋 Molten Magma Rock (48×48) [10f]",
  "author": "PixelDSL Studio",
  "description": "Black obsidian volcanic stone with molten lava flowing through deep tectonic fissures and glowing veins. Procedural Worley fissure network, churning thermal convection currents, and 3D normal map lighting.",
  "width": 48,
  "height": 48,
  "fps": 10,
  "framesCount": 10,
  "shaderType": "magma_rock",
  "dither": "bayer4x4",
  "ditherStrength": 0.14,
  "palette": {
    "1": "#0a0b10",
    "2": "#161924",
    "3": "#262c3e",
    "4": "#44506e",
    "5": "#410a06",
    "6": "#871204",
    "7": "#cd3400",
    "8": "#ff8a00",
    "9": "#ffda24",
    "A": "#ffffdc"
  }
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_grass_tile_s42_32x32"] = {
  label: "✨ proc_grass_tile_s42_32x32 (32×32)",
  prompt: "Seamless grass tile (seed=42, 32x32) - tilegen",
  data: {
  "name": "proc_grass_tile_s42_32x32",
  "prompt": "Seamless grass tile (seed=42, 32x32) - tilegen",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "tileable": true,
  "palette": {
    ".": "transparent",
    "0": "#1f4a2c",
    "1": "#2b6233",
    "2": "#3a7a3a",
    "3": "#4f9443",
    "4": "#74b052",
    "y": "#f0d35a",
    "f": "#eef0e2",
    "k": "#18381f"
  },
  "postProcess": {
    "autoOutline": false,
    "autoShading": false,
    "sdfShading": false,
    "selOut": false,
    "tileNormals": true
  },
  "layers": [],
  "frames": [],
  "grid": [
    "11101232422223121022302222242031",
    "41232203222220212422022224232101",
    "31132223224222113112224223142233",
    "31202420232221140111223220223200",
    "01123212131211113112123212120212",
    "01223221102421110111210121212421",
    "12124411411341143411111111111344",
    "22223423141331133111111111112033",
    "12220410144031133111111111121200",
    "22222321341101200141111111412222",
    "22224314331111121312111111321222",
    "22232031032121242022224222014422",
    "2423114f101112322224222322421322",
    "2320430k202122033333322324343022",
    "43123330122224233330332423330012",
    "30220030214233333334333220000332",
    "02242001113223333333330422221042",
    "22322221113233033333323322222332",
    "42322212120223333330222322222032",
    "23024222222232323232222022222202",
    "13224422222222242222221111122224",
    "20223333323232322222212441222423",
    "22220324432323322442f21134413340",
    "32324033343432023331k12103233032",
    "22233323033322242002141103130204",
    "22320033300042332222213140202223",
    "22222423302322204212110133432224",
    "22222332322022232222211403302223",
    "12122323224222101212121130322223",
    "11222022322322222122242101042220",
    "11442222222022124212231222232241",
    "11132242222224212322232222232431"
  ],
  "fps": 8
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_boulder_s42_32x32"] = {
  label: "proc_boulder_s42_32x32",
  prompt: "Procedural boulder (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  data: {
  "name": "proc_boulder_s42_32x32",
  "prompt": "Procedural boulder (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "ramps": {
    "M": {
      "base": "#00bef1",
      "light": "L",
      "dark": "D",
      "outline": "O"
    },
    "A": {
      "base": "#ff6537",
      "light": "W",
      "dark": "B",
      "outline": "O"
    },
    "S": {
      "base": "#c6b59b",
      "light": "w",
      "dark": "d",
      "outline": "O"
    },
    "H": {
      "base": "#8c4a11",
      "light": "h",
      "dark": "b",
      "outline": "O"
    }
  },
  "palette": {
    ".": "transparent",
    "O": "#14182e",
    "e": "#0e101c",
    "w": "#ffffff",
    "a": "#14182e44"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#14182e",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": true,
    "selOut": true
  },
  "layers": [
    {
      "id": "shadow",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 28.5,
      "rx": 11.0,
      "ry": 2.2,
      "fill": "a"
    },
    {
      "id": "rock_body",
      "op": "polygon",
      "points": [
        [
          5.0,
          27.0
        ],
        [
          4.0,
          14.5
        ],
        [
          12.5,
          6.0
        ],
        [
          21.5,
          5.0
        ],
        [
          28.0,
          17.5
        ],
        [
          26.0,
          27.0
        ]
      ],
      "fill": "M",
      "outline": "O",
      "sdf": true,
      "dither": "worley",
      "shaderScale": 5.0,
      "seed": 42
    },
    {
      "id": "chisel_facet",
      "op": "polygon",
      "points": [
        [
          12.5,
          6.0
        ],
        [
          18.5,
          15.5
        ],
        [
          15.5,
          27.0
        ],
        [
          5.0,
          27.0
        ],
        [
          4.0,
          14.5
        ]
      ],
      "fill": "S",
      "sdf": true
    },
    {
      "id": "moss_cap",
      "op": "ellipse",
      "cx": 16.5,
      "cy": 7.0,
      "rx": 8.5,
      "ry": 3.2,
      "fill": "H",
      "outline": "O",
      "sdf": true,
      "domainWarp": {
        "amp": 1.2,
        "freq": 0.3,
        "seed": 42
      }
    },
    {
      "id": "ore_gem",
      "op": "star",
      "cx": 21.5,
      "cy": 18.5,
      "r": 2.8,
      "n": 4,
      "innerRatio": 0.5,
      "fill": "A",
      "outline": "O",
      "sdf": true
    }
  ],
  "frames": [],
  "grid": []
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_bow_s42_32x32"] = {
  label: "proc_bow_s42_32x32",
  prompt: "Procedural bow (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  data: {
  "name": "proc_bow_s42_32x32",
  "prompt": "Procedural bow (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "ramps": {
    "M": {
      "base": "#00bef1",
      "light": "L",
      "dark": "D",
      "outline": "O"
    },
    "A": {
      "base": "#ff6537",
      "light": "W",
      "dark": "B",
      "outline": "O"
    },
    "S": {
      "base": "#c6b59b",
      "light": "w",
      "dark": "d",
      "outline": "O"
    },
    "H": {
      "base": "#8c4a11",
      "light": "h",
      "dark": "b",
      "outline": "O"
    }
  },
  "palette": {
    ".": "transparent",
    "O": "#14182e",
    "e": "#0e101c",
    "w": "#ffffff",
    "a": "#14182e44"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#14182e",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": true,
    "selOut": true
  },
  "layers": [
    {
      "id": "shadow",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 29.0,
      "rx": 6.0,
      "ry": 1.5,
      "fill": "a"
    },
    {
      "id": "stave",
      "op": "moon",
      "cx": 11.5,
      "cy": 15.5,
      "r": 13.0,
      "r2": 12.0,
      "d": 3.5,
      "angle": 0,
      "fill": "H",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "handle",
      "op": "uneven_capsule",
      "x1": 8.5,
      "y1": 12.5,
      "x2": 8.5,
      "y2": 18.5,
      "r1": 1.8,
      "r2": 1.8,
      "fill": "A",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "bowstring",
      "op": "line",
      "x1": 11.5,
      "y1": 4.0,
      "x2": 11.5,
      "y2": 27.0,
      "thickness": 1,
      "color": "w"
    },
    {
      "id": "arrow_shaft",
      "op": "line",
      "x1": 5.5,
      "y1": 15.5,
      "x2": 27.0,
      "y2": 15.5,
      "thickness": 1,
      "color": "H"
    },
    {
      "id": "arrow_head",
      "op": "polygon",
      "points": [
        [
          25.0,
          13.5
        ],
        [
          28.0,
          15.5
        ],
        [
          25.0,
          17.5
        ]
      ],
      "fill": "S",
      "outline": "O"
    }
  ],
  "frames": [],
  "grid": []
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_bunny_s999_32x32"] = {
  label: "proc_bunny_s999_32x32",
  prompt: "Procedural bunny (seed=999, 32x32) — 100% LLM-Free PixelDSL v3.0",
  data: {
  "name": "proc_bunny_s999_32x32",
  "prompt": "Procedural bunny (seed=999, 32x32) — 100% LLM-Free PixelDSL v3.0",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "ramps": {
    "M": {
      "base": "#e04ba0",
      "light": "L",
      "dark": "D",
      "outline": "O"
    },
    "A": {
      "base": "#00cfdd",
      "light": "W",
      "dark": "B",
      "outline": "O"
    },
    "S": {
      "base": "#9bbfc5",
      "light": "w",
      "dark": "d",
      "outline": "O"
    },
    "H": {
      "base": "#8c4a11",
      "light": "h",
      "dark": "b",
      "outline": "O"
    }
  },
  "palette": {
    ".": "transparent",
    "O": "#14182e",
    "e": "#0e101c",
    "w": "#ffffff",
    "a": "#14182e44"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#14182e",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": true,
    "selOut": true
  },
  "layers": [
    {
      "id": "shadow",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 28.5,
      "rx": 8.5,
      "ry": 1.5,
      "fill": "a"
    },
    {
      "id": "ear_back",
      "op": "uneven_capsule",
      "x1": 16.5,
      "y1": 12.5,
      "x2": 13.5,
      "y2": 5.5,
      "r1": 2.1,
      "r2": 1.4,
      "fill": "A",
      "outline": "O",
      "sdf": true,
      "parent": "body"
    },
    {
      "id": "tail",
      "op": "ellipse",
      "cx": 6.5,
      "cy": 20.0,
      "rx": 2.6,
      "ry": 2.6,
      "fill": "S",
      "outline": "O",
      "sdf": true,
      "parent": "body"
    },
    {
      "id": "body",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 20.0,
      "rx": 6.2,
      "ry": 5.0,
      "angle": -8,
      "fill": "S",
      "outline": "O",
      "sdf": true,
      "smoothBlend": 2.0,
      "z": 1
    },
    {
      "id": "thigh",
      "op": "ellipse",
      "cx": 11.0,
      "cy": 21.0,
      "rx": 4.8,
      "ry": 3.8,
      "angle": -10,
      "fill": "S",
      "outline": "O",
      "sdf": true,
      "smoothBlend": 1.8,
      "z": 2,
      "crease": true,
      "parent": "body"
    },
    {
      "id": "head",
      "op": "ellipse",
      "cx": 20.0,
      "cy": 14.5,
      "rx": 4.8,
      "ry": 4.5,
      "fill": "S",
      "outline": "O",
      "sdf": true,
      "smoothBlend": 1.6,
      "z": 1,
      "parent": "body"
    },
    {
      "id": "ear_front",
      "op": "uneven_capsule",
      "x1": 19.0,
      "y1": 12.5,
      "x2": 16.5,
      "y2": 5.5,
      "r1": 2.2,
      "r2": 1.5,
      "fill": "S",
      "outline": "O",
      "sdf": true,
      "smoothBlend": 1.4,
      "z": 2,
      "crease": true,
      "parent": "body"
    },
    {
      "id": "eye",
      "op": "ellipse",
      "cx": 22.0,
      "cy": 13.5,
      "rx": 1.3,
      "ry": 1.6,
      "fill": "e",
      "parent": "body"
    }
  ],
  "frames": [],
  "grid": [],
  "motion": {
    "type": "jump_arc",
    "frames": 4,
    "amplitude": 1.0,
    "squash": 0.1
  }
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_dirt_tile_s101_32x32"] = {
  label: "✨ proc_dirt_tile_s101_32x32 (32×32)",
  prompt: "Seamless dirt tile (seed=101, 32x32) - tilegen",
  data: {
  "name": "proc_dirt_tile_s101_32x32",
  "prompt": "Seamless dirt tile (seed=101, 32x32) - tilegen",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "tileable": true,
  "palette": {
    ".": "transparent",
    "0": "#3a2618",
    "1": "#4f3420",
    "2": "#634229",
    "3": "#785334",
    "p": "#8b847a",
    "q": "#b3ab9c",
    "k": "#24170e"
  },
  "postProcess": {
    "autoOutline": false,
    "autoShading": false,
    "sdfShading": false,
    "selOut": false,
    "tileNormals": true
  },
  "layers": [],
  "frames": [],
  "grid": [
    "01010112121212121223232322221211",
    "111121212k2121212132323232323221",
    "01011212121112121212232222222211",
    "212122212121212121212221qp223221",
    "0112121212110101010k0111kk1k1211",
    "21222121212110111121102110212k21",
    "12121212120101011101010101011212",
    "3221212k21201k102110101010112121",
    "12k211120101010k0100000100010112",
    "2122212121211011101010101010112k",
    "22122212121101011101010111010112",
    "32323222322121212121212121212122",
    "23221212121212120112121212110223",
    "3232323232k221212k21212221212132",
    "232323232322221k1212121212121213",
    "3232333232323231k121323232323222",
    "222323232323222212qp12k323221212",
    "22qp32323k32323221pp223232322222",
    "12pp23122212121222kk1212231212k2",
    "21kk3222322122223232223232212121",
    "01121212121212122322121qp2120111",
    "11212121112121323232212kk1212121",
    "11010101010112132322121212121211",
    "2k10101010102122323k222232212121",
    "1101000000010qp22222121212121112",
    "2110101010101pp2323221223222k121",
    "12010000k1011kk2232212122212k201",
    "21101k10111121223231222232212121",
    "121101010101121322qp121322121212",
    "212111211121213232pp223232322121",
    "12111k111212121222kk231223222211",
    "21212121212122223232333232323221"
  ],
  "fps": 8
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_dragon_s42_48x48"] = {
  label: "proc_dragon_s42_48x48",
  prompt: "Procedural dragon (seed=42, 48x48) — 100% LLM-Free PixelDSL v3.0",
  data: {
  "name": "proc_dragon_s42_48x48",
  "prompt": "Procedural dragon (seed=42, 48x48) — 100% LLM-Free PixelDSL v3.0",
  "width": 48,
  "height": 48,
  "symmetry": "none",
  "rle": false,
  "ramps": {
    "M": {
      "base": "#00bef1",
      "light": "L",
      "dark": "D",
      "outline": "O"
    },
    "A": {
      "base": "#ff6537",
      "light": "W",
      "dark": "B",
      "outline": "O"
    },
    "S": {
      "base": "#c6b59b",
      "light": "w",
      "dark": "d",
      "outline": "O"
    },
    "H": {
      "base": "#8c4a11",
      "light": "h",
      "dark": "b",
      "outline": "O"
    }
  },
  "palette": {
    ".": "transparent",
    "O": "#14182e",
    "e": "#0e101c",
    "w": "#ffffff",
    "a": "#14182e44"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#14182e",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": true,
    "selOut": true
  },
  "layers": [
    {
      "id": "shadow",
      "op": "ellipse",
      "cx": 23.5,
      "cy": 43.5,
      "rx": 16.5,
      "ry": 3.3,
      "fill": "a"
    },
    {
      "id": "wing_far",
      "op": "moon",
      "cx": 13.0,
      "cy": 14.5,
      "r": 15.0,
      "r2": 11.3,
      "d": 5.3,
      "angle": -115,
      "fill": "A",
      "outline": "O",
      "sdf": true,
      "z": 0
    },
    {
      "id": "tail",
      "op": "bezier_sdf",
      "points": [
        [
          13.0,
          26.5
        ],
        [
          5.5,
          29.5
        ],
        [
          4.0,
          20.5
        ]
      ],
      "r1": 4.2,
      "r2": 1.5,
      "fill": "M",
      "outline": "O",
      "sdf": true,
      "z": 1
    },
    {
      "id": "body",
      "op": "ellipse",
      "cx": 23.5,
      "cy": 25.0,
      "rx": 10.2,
      "ry": 8.3,
      "fill": "M",
      "outline": "O",
      "sdf": true,
      "z": 1
    },
    {
      "id": "neck",
      "op": "uneven_capsule",
      "x1": 28.0,
      "y1": 22.0,
      "x2": 35.5,
      "y2": 13.0,
      "r1": 5.3,
      "r2": 4.2,
      "fill": "M",
      "outline": "O",
      "sdf": true,
      "z": 1
    },
    {
      "id": "head",
      "op": "uneven_capsule",
      "x1": 35.5,
      "y1": 13.0,
      "x2": 41.5,
      "y2": 14.5,
      "r1": 4.5,
      "r2": 2.4,
      "fill": "M",
      "outline": "O",
      "sdf": true,
      "z": 1
    },
    {
      "id": "horns",
      "op": "moon",
      "cx": 35.5,
      "cy": 8.5,
      "r": 5.3,
      "r2": 4.2,
      "d": 1.8,
      "angle": -60,
      "fill": "S",
      "outline": "O",
      "sdf": true,
      "z": 1
    },
    {
      "id": "wing_near",
      "op": "moon",
      "cx": 26.5,
      "cy": 13.0,
      "r": 16.5,
      "r2": 12.8,
      "d": 5.7,
      "angle": -115,
      "fill": "M",
      "outline": "O",
      "sdf": true,
      "crease": true,
      "z": 2
    },
    {
      "id": "eye",
      "op": "pixels",
      "color": "w",
      "points": [
        [
          37,
          13
        ]
      ]
    }
  ],
  "frames": [],
  "grid": [],
  "motion": {
    "type": "idle_breathe",
    "frames": 4,
    "amplitude": 1.0,
    "squash": 0.05
  }
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_fireball_s42_32x32"] = {
  label: "proc_fireball_s42_32x32",
  prompt: "Procedural fireball (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  data: {
  "name": "proc_fireball_s42_32x32",
  "prompt": "Procedural fireball (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "ramps": {
    "M": {
      "base": "#00bef1",
      "light": "L",
      "dark": "D",
      "outline": "O"
    },
    "A": {
      "base": "#ff6537",
      "light": "W",
      "dark": "B",
      "outline": "O"
    },
    "S": {
      "base": "#c6b59b",
      "light": "w",
      "dark": "d",
      "outline": "O"
    },
    "H": {
      "base": "#8c4a11",
      "light": "h",
      "dark": "b",
      "outline": "O"
    }
  },
  "palette": {
    ".": "transparent",
    "O": "#14182e",
    "e": "#0e101c",
    "w": "#ffffff",
    "a": "#14182e44"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#14182e",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": true,
    "selOut": true
  },
  "layers": [
    {
      "id": "smoke",
      "op": "ellipse",
      "cx": 8.5,
      "cy": 15.5,
      "rx": 6.5,
      "ry": 5.5,
      "fill": "a"
    },
    {
      "id": "outer_flame",
      "op": "vesica",
      "cx": 14.5,
      "cy": 15.5,
      "rx": 11.0,
      "ry": 7.5,
      "angle": 0,
      "fill": "M",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "mid_flame",
      "op": "vesica",
      "cx": 17.5,
      "cy": 15.5,
      "rx": 8.0,
      "ry": 5.5,
      "angle": 0,
      "fill": "A",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "core",
      "op": "ellipse",
      "cx": 19.5,
      "cy": 15.5,
      "rx": 4.2,
      "ry": 3.5,
      "fill": "w",
      "sdf": true
    },
    {
      "id": "spark",
      "op": "pixels",
      "color": "w",
      "points": [
        [
          8,
          12
        ],
        [
          6,
          19
        ]
      ]
    }
  ],
  "frames": [],
  "grid": [],
  "motion": {
    "type": "idle_breathe",
    "frames": 4,
    "amplitude": 0.8,
    "squash": 0.08
  }
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_flower_s42_32x32"] = {
  label: "proc_flower_s42_32x32",
  prompt: "Procedural flower (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  data: {
  "name": "proc_flower_s42_32x32",
  "prompt": "Procedural flower (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "ramps": {
    "M": {
      "base": "#00bef1",
      "light": "L",
      "dark": "D",
      "outline": "O"
    },
    "A": {
      "base": "#ff6537",
      "light": "W",
      "dark": "B",
      "outline": "O"
    },
    "S": {
      "base": "#c6b59b",
      "light": "w",
      "dark": "d",
      "outline": "O"
    },
    "H": {
      "base": "#8c4a11",
      "light": "h",
      "dark": "b",
      "outline": "O"
    }
  },
  "palette": {
    ".": "transparent",
    "O": "#14182e",
    "e": "#0e101c",
    "w": "#ffffff",
    "a": "#14182e44",
    "y": "#fde047"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#14182e",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": true,
    "selOut": true
  },
  "layers": [
    {
      "id": "shadow",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 29.0,
      "rx": 6.5,
      "ry": 1.5,
      "fill": "a"
    },
    {
      "id": "stem",
      "op": "uneven_capsule",
      "x1": 15.5,
      "y1": 28.0,
      "x2": 15.5,
      "y2": 13.5,
      "r1": 1.6,
      "r2": 1.2,
      "fill": "H",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "leaf_l",
      "op": "vesica",
      "cx": 11.0,
      "cy": 20.5,
      "rx": 2.2,
      "ry": 4.5,
      "angle": -50,
      "fill": "H",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "leaf_r",
      "op": "vesica",
      "cx": 20.0,
      "cy": 18.5,
      "rx": 2.2,
      "ry": 4.5,
      "angle": 50,
      "fill": "H",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "petals",
      "op": "star",
      "cx": 15.5,
      "cy": 12.5,
      "r": 9.0,
      "n": 8,
      "innerRatio": 0.65,
      "fill": "M",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "core",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 12.5,
      "rx": 3.6,
      "ry": 3.6,
      "fill": "y",
      "outline": "O",
      "sdf": true
    }
  ],
  "frames": [],
  "grid": [],
  "motion": {
    "type": "idle_breathe",
    "frames": 4,
    "amplitude": 0.8,
    "squash": 0.04
  }
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_golem_s42_32x32"] = {
  label: "proc_golem_s42_32x32",
  prompt: "Procedural golem (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  data: {
  "name": "proc_golem_s42_32x32",
  "prompt": "Procedural golem (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "ramps": {
    "M": {
      "base": "#00bef1",
      "light": "L",
      "dark": "D",
      "outline": "O"
    },
    "A": {
      "base": "#ff6537",
      "light": "W",
      "dark": "B",
      "outline": "O"
    },
    "S": {
      "base": "#c6b59b",
      "light": "w",
      "dark": "d",
      "outline": "O"
    },
    "H": {
      "base": "#8c4a11",
      "light": "h",
      "dark": "b",
      "outline": "O"
    }
  },
  "palette": {
    ".": "transparent",
    "O": "#14182e",
    "e": "#0e101c",
    "w": "#ffffff",
    "a": "#14182e44"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#14182e",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": true,
    "selOut": true
  },
  "layers": [
    {
      "id": "shadow",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 29.0,
      "rx": 11.0,
      "ry": 2.2,
      "fill": "a"
    },
    {
      "id": "leg_l",
      "op": "uneven_capsule",
      "x1": 10.5,
      "y1": 19.5,
      "x2": 10.5,
      "y2": 28.0,
      "r1": 3.2,
      "r2": 3.8,
      "fill": "H",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "leg_r",
      "op": "uneven_capsule",
      "x1": 20.5,
      "y1": 19.5,
      "x2": 20.5,
      "y2": 28.0,
      "r1": 3.2,
      "r2": 3.8,
      "fill": "H",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "torso",
      "op": "rect",
      "x": 7.5,
      "y": 10.5,
      "w": 16.0,
      "h": 11.0,
      "rx": 2.5,
      "fill": "M",
      "outline": "O",
      "sdf": true,
      "dither": "worley",
      "shaderScale": 4.5,
      "seed": 42
    },
    {
      "id": "head",
      "op": "rect",
      "x": 11.0,
      "y": 4.5,
      "w": 9.0,
      "h": 6.0,
      "rx": 1.5,
      "fill": "H",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "shoulder_l",
      "op": "ellipse",
      "cx": 6.0,
      "cy": 12.5,
      "rx": 3.5,
      "ry": 3.5,
      "fill": "H",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "shoulder_r",
      "op": "ellipse",
      "cx": 25.0,
      "cy": 12.5,
      "rx": 3.5,
      "ry": 3.5,
      "fill": "H",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "fist_l",
      "op": "rect",
      "x": 3.0,
      "y": 17.5,
      "w": 5.0,
      "h": 6.0,
      "rx": 1.5,
      "fill": "M",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "fist_r",
      "op": "rect",
      "x": 23.0,
      "y": 17.5,
      "w": 5.0,
      "h": 6.0,
      "rx": 1.5,
      "fill": "M",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "core_rune",
      "op": "star",
      "cx": 15.5,
      "cy": 15.5,
      "r": 3.2,
      "n": 4,
      "innerRatio": 0.45,
      "fill": "A",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "eye_slit",
      "op": "pixels",
      "color": "A",
      "points": [
        [
          14,
          8
        ],
        [
          18,
          8
        ]
      ]
    }
  ],
  "frames": [],
  "grid": [],
  "motion": {
    "type": "walk_cycle",
    "frames": 4,
    "amplitude": 1.0,
    "squash": 0.04
  }
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_lightning_s42_32x32"] = {
  label: "proc_lightning_s42_32x32",
  prompt: "Procedural lightning (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  data: {
  "name": "proc_lightning_s42_32x32",
  "prompt": "Procedural lightning (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "ramps": {
    "M": {
      "base": "#00bef1",
      "light": "L",
      "dark": "D",
      "outline": "O"
    },
    "A": {
      "base": "#ff6537",
      "light": "W",
      "dark": "B",
      "outline": "O"
    },
    "S": {
      "base": "#c6b59b",
      "light": "w",
      "dark": "d",
      "outline": "O"
    },
    "H": {
      "base": "#8c4a11",
      "light": "h",
      "dark": "b",
      "outline": "O"
    }
  },
  "palette": {
    ".": "transparent",
    "O": "#14182e",
    "e": "#0e101c",
    "w": "#ffffff",
    "a": "#14182e44",
    "b": "#a5f3fc"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#14182e",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": true,
    "selOut": true
  },
  "layers": [
    {
      "id": "glow",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 28.0,
      "rx": 9.0,
      "ry": 2.5,
      "fill": "a"
    },
    {
      "id": "bolt",
      "op": "polygon",
      "points": [
        [
          15.5,
          3.0
        ],
        [
          12.5,
          10.0
        ],
        [
          17.5,
          13.0
        ],
        [
          11.5,
          20.0
        ],
        [
          16.5,
          23.0
        ],
        [
          15.5,
          28.0
        ],
        [
          18.5,
          22.0
        ],
        [
          14.5,
          19.0
        ],
        [
          19.5,
          12.0
        ],
        [
          14.5,
          9.0
        ]
      ],
      "fill": "w",
      "sdf": true
    },
    {
      "id": "fork",
      "op": "polygon",
      "points": [
        [
          12.5,
          10.0
        ],
        [
          7.5,
          16.0
        ],
        [
          9.5,
          17.0
        ],
        [
          14.5,
          12.0
        ]
      ],
      "fill": "b"
    },
    {
      "id": "impact",
      "op": "star",
      "cx": 15.5,
      "cy": 28.0,
      "r": 4.2,
      "n": 6,
      "innerRatio": 0.4,
      "fill": "w"
    }
  ],
  "frames": [],
  "grid": [],
  "motion": {
    "type": "idle_breathe",
    "frames": 4,
    "amplitude": 0.6,
    "squash": 0.08
  }
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_mushroom_s42_32x32"] = {
  label: "proc_mushroom_s42_32x32",
  prompt: "Procedural mushroom (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  data: {
  "name": "proc_mushroom_s42_32x32",
  "prompt": "Procedural mushroom (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "ramps": {
    "M": {
      "base": "#00bef1",
      "light": "L",
      "dark": "D",
      "outline": "O"
    },
    "A": {
      "base": "#ff6537",
      "light": "W",
      "dark": "B",
      "outline": "O"
    },
    "S": {
      "base": "#c6b59b",
      "light": "w",
      "dark": "d",
      "outline": "O"
    },
    "H": {
      "base": "#8c4a11",
      "light": "h",
      "dark": "b",
      "outline": "O"
    }
  },
  "palette": {
    ".": "transparent",
    "O": "#14182e",
    "e": "#0e101c",
    "w": "#ffffff",
    "a": "#14182e44"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#14182e",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": true,
    "selOut": true
  },
  "layers": [
    {
      "id": "shadow",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 28.5,
      "rx": 8.5,
      "ry": 1.8,
      "fill": "a"
    },
    {
      "id": "stem",
      "op": "uneven_capsule",
      "x1": 15.5,
      "y1": 28.0,
      "x2": 15.5,
      "y2": 14.5,
      "r1": 3.5,
      "r2": 2.5,
      "fill": "S",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "veil",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 18.5,
      "rx": 3.8,
      "ry": 1.2,
      "fill": "w",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "gills",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 14.5,
      "rx": 9.5,
      "ry": 3.5,
      "fill": "A",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "cap",
      "op": "moon",
      "cx": 15.5,
      "cy": 11.5,
      "r": 11.5,
      "r2": 10.5,
      "d": 4.8,
      "angle": 0,
      "fill": "M",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "spot_1",
      "op": "ellipse",
      "cx": 12.0,
      "cy": 8.5,
      "rx": 1.5,
      "ry": 1.2,
      "fill": "w"
    },
    {
      "id": "spot_2",
      "op": "ellipse",
      "cx": 19.5,
      "cy": 9.5,
      "rx": 1.4,
      "ry": 1.1,
      "fill": "w"
    },
    {
      "id": "sprout",
      "op": "ellipse",
      "cx": 8.5,
      "cy": 26.0,
      "rx": 2.6,
      "ry": 2.2,
      "fill": "M",
      "outline": "O",
      "sdf": true
    }
  ],
  "frames": [],
  "grid": [],
  "motion": {
    "type": "idle_breathe",
    "frames": 4,
    "amplitude": 0.7,
    "squash": 0.05
  }
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_sand_tile_s77_32x32"] = {
  label: "✨ proc_sand_tile_s77_32x32 (32×32)",
  prompt: "Seamless sand tile (seed=77, 32x32) - tilegen",
  data: {
  "name": "proc_sand_tile_s77_32x32",
  "prompt": "Seamless sand tile (seed=77, 32x32) - tilegen",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "tileable": true,
  "palette": {
    ".": "transparent",
    "0": "#b0844c",
    "1": "#c39857",
    "2": "#d4ab68",
    "3": "#e2bf7f",
    "4": "#f0d7a2"
  },
  "postProcess": {
    "autoOutline": false,
    "autoShading": false,
    "sdfShading": false,
    "selOut": false,
    "tileNormals": true
  },
  "layers": [],
  "frames": [],
  "grid": [
    "33122222222223232322223333333333",
    "21222222222232323232212121212121",
    "12122212222223232322121112111212",
    "22222221222232323232212121212121",
    "12121212121222232222111111111112",
    "22222121212222322221212111212122",
    "22221212121222221212121111111222",
    "22222221222222212222222121212222",
    "22222212122212121212121111121222",
    "22222221212222212122212111222222",
    "22222211121222121212221212122222",
    "22222221212200212200022122223222",
    "12222211111244000044000212222222",
    "22222121212044444444444000002222",
    "12121212103422222222224444400212",
    "22212120034222323232322244444021",
    "11121033322222232322222222224012",
    "00000332222222323232222222222300",
    "33333212121222232322222222222233",
    "22212222222222323332322222222221",
    "12121222122212200000222222222212",
    "22222222222220444444400232222222",
    "22222212120044232323234444222212",
    "22004000034232333332323333440222",
    "33322233122222232323232323222333",
    "22222222222222333232323332322222",
    "12222212122222232323232323222212",
    "21222222222222323232323232222221",
    "11122212121222000000002222221212",
    "21222222222004444444400222222121",
    "12000440044223222322440000111211",
    "00332222223232323232233000000000"
  ],
  "fps": 8
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_snake_s42_32x32"] = {
  label: "proc_snake_s42_32x32",
  prompt: "Procedural snake (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  data: {
  "name": "proc_snake_s42_32x32",
  "prompt": "Procedural snake (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "ramps": {
    "M": {
      "base": "#00bef1",
      "light": "L",
      "dark": "D",
      "outline": "O"
    },
    "A": {
      "base": "#ff6537",
      "light": "W",
      "dark": "B",
      "outline": "O"
    },
    "S": {
      "base": "#c6b59b",
      "light": "w",
      "dark": "d",
      "outline": "O"
    },
    "H": {
      "base": "#8c4a11",
      "light": "h",
      "dark": "b",
      "outline": "O"
    }
  },
  "palette": {
    ".": "transparent",
    "O": "#14182e",
    "e": "#0e101c",
    "w": "#ffffff",
    "a": "#14182e44"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#14182e",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": true,
    "selOut": true
  },
  "layers": [
    {
      "id": "shadow",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 29.0,
      "rx": 10.0,
      "ry": 2.0,
      "fill": "a"
    },
    {
      "id": "coil_1",
      "op": "ellipse",
      "cx": 10.5,
      "cy": 19.5,
      "rx": 5.5,
      "ry": 4.2,
      "fill": "M",
      "outline": "O",
      "sdf": true,
      "smoothBlend": 2.0
    },
    {
      "id": "coil_2",
      "op": "ellipse",
      "cx": 19.5,
      "cy": 20.5,
      "rx": 5.5,
      "ry": 4.2,
      "fill": "M",
      "outline": "O",
      "sdf": true,
      "smoothBlend": 2.0
    },
    {
      "id": "neck_body",
      "op": "uneven_capsule",
      "x1": 12.5,
      "y1": 17.5,
      "x2": 13.5,
      "y2": 11.5,
      "r1": 3.2,
      "r2": 2.5,
      "fill": "M",
      "outline": "O",
      "sdf": true,
      "smoothBlend": 2.0
    },
    {
      "id": "hood",
      "op": "vesica",
      "cx": 16.5,
      "cy": 9.5,
      "rx": 5.5,
      "ry": 3.2,
      "angle": 0,
      "fill": "A",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "head",
      "op": "ellipse",
      "cx": 16.5,
      "cy": 9.5,
      "rx": 3.2,
      "ry": 2.8,
      "fill": "M",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "tongue",
      "op": "polygon",
      "points": [
        [
          19.5,
          9.5
        ],
        [
          22.5,
          8.5
        ],
        [
          24.5,
          7.5
        ],
        [
          22.5,
          9.5
        ],
        [
          24.5,
          10.5
        ]
      ],
      "fill": "S"
    }
  ],
  "frames": [],
  "grid": [],
  "motion": {
    "type": "idle_breathe",
    "frames": 4,
    "amplitude": 0.8,
    "squash": 0.05
  }
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_spider_s42_32x32"] = {
  label: "proc_spider_s42_32x32",
  prompt: "Procedural spider (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  data: {
  "name": "proc_spider_s42_32x32",
  "prompt": "Procedural spider (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "ramps": {
    "M": {
      "base": "#00bef1",
      "light": "L",
      "dark": "D",
      "outline": "O"
    },
    "A": {
      "base": "#ff6537",
      "light": "W",
      "dark": "B",
      "outline": "O"
    },
    "S": {
      "base": "#c6b59b",
      "light": "w",
      "dark": "d",
      "outline": "O"
    },
    "H": {
      "base": "#8c4a11",
      "light": "h",
      "dark": "b",
      "outline": "O"
    }
  },
  "palette": {
    ".": "transparent",
    "O": "#14182e",
    "e": "#0e101c",
    "w": "#ffffff",
    "a": "#14182e44"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#14182e",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": true,
    "selOut": true
  },
  "layers": [
    {
      "id": "shadow",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 29.0,
      "rx": 10.0,
      "ry": 2.2,
      "fill": "a"
    },
    {
      "id": "legs_l",
      "op": "bezier_sdf",
      "points": [
        [
          12.5,
          15.5
        ],
        [
          4.5,
          9.5
        ],
        [
          2.5,
          21.5
        ]
      ],
      "r1": 1.5,
      "r2": 0.8,
      "fill": "H",
      "outline": "O",
      "mirror": "x",
      "sdf": true
    },
    {
      "id": "legs_mid",
      "op": "bezier_sdf",
      "points": [
        [
          12.5,
          17.5
        ],
        [
          3.5,
          17.5
        ],
        [
          1.5,
          25.5
        ]
      ],
      "r1": 1.5,
      "r2": 0.8,
      "fill": "H",
      "outline": "O",
      "mirror": "x",
      "sdf": true
    },
    {
      "id": "abdomen",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 12.5,
      "rx": 7.5,
      "ry": 6.8,
      "fill": "M",
      "outline": "O",
      "sdf": true,
      "dither": "worley",
      "shaderScale": 4.5,
      "seed": 42
    },
    {
      "id": "thorax",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 19.5,
      "rx": 4.8,
      "ry": 3.8,
      "fill": "A",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "fangs",
      "op": "vesica",
      "cx": 13.7,
      "cy": 23.5,
      "rx": 1.2,
      "ry": 2.2,
      "fill": "S",
      "outline": "O",
      "mirror": "x",
      "sdf": true
    },
    {
      "id": "eyes",
      "op": "pixels",
      "color": "w",
      "mirror": "x",
      "points": [
        [
          14,
          20
        ],
        [
          15,
          19
        ]
      ]
    }
  ],
  "frames": [],
  "grid": [],
  "motion": {
    "type": "walk_cycle",
    "frames": 4,
    "amplitude": 1.0,
    "squash": 0.05
  }
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_staff_s42_32x32"] = {
  label: "proc_staff_s42_32x32",
  prompt: "Procedural staff (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  data: {
  "name": "proc_staff_s42_32x32",
  "prompt": "Procedural staff (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "ramps": {
    "M": {
      "base": "#00bef1",
      "light": "L",
      "dark": "D",
      "outline": "O"
    },
    "A": {
      "base": "#ff6537",
      "light": "W",
      "dark": "B",
      "outline": "O"
    },
    "S": {
      "base": "#c6b59b",
      "light": "w",
      "dark": "d",
      "outline": "O"
    },
    "H": {
      "base": "#8c4a11",
      "light": "h",
      "dark": "b",
      "outline": "O"
    }
  },
  "palette": {
    ".": "transparent",
    "O": "#14182e",
    "e": "#0e101c",
    "w": "#ffffff",
    "a": "#14182e44"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#14182e",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": true,
    "selOut": true
  },
  "layers": [
    {
      "id": "shadow",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 29.0,
      "rx": 5.0,
      "ry": 1.5,
      "fill": "a"
    },
    {
      "id": "shaft",
      "op": "uneven_capsule",
      "x1": 15.5,
      "y1": 28.0,
      "x2": 15.5,
      "y2": 9.0,
      "r1": 1.8,
      "r2": 1.5,
      "fill": "H",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "bracket_l",
      "op": "vesica",
      "cx": 12.3,
      "cy": 7.5,
      "rx": 1.5,
      "ry": 3.5,
      "angle": -25,
      "fill": "A",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "bracket_r",
      "op": "vesica",
      "cx": 18.7,
      "cy": 7.5,
      "rx": 1.5,
      "ry": 3.5,
      "angle": 25,
      "fill": "A",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "crystal_orb",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 5.5,
      "rx": 3.2,
      "ry": 3.2,
      "fill": "M",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "orb_spark",
      "op": "star",
      "cx": 15.5,
      "cy": 5.5,
      "r": 1.6,
      "n": 4,
      "innerRatio": 0.4,
      "fill": "w"
    }
  ],
  "frames": [],
  "grid": [],
  "motion": {
    "type": "idle_breathe",
    "frames": 4,
    "amplitude": 0.8,
    "squash": 0.04
  }
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_stone_tile_s88_32x32"] = {
  label: "✨ proc_stone_tile_s88_32x32 (32×32)",
  prompt: "Seamless stone tile (seed=88, 32x32) - tilegen",
  data: {
  "name": "proc_stone_tile_s88_32x32",
  "prompt": "Seamless stone tile (seed=88, 32x32) - tilegen",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "tileable": true,
  "palette": {
    ".": "transparent",
    "m": "#262a35",
    "0": "#4a5160",
    "1": "#5a6273",
    "2": "#6b7486",
    "3": "#7f8899",
    "4": "#99a2b2",
    "v": "#4b6f38",
    "k": "#363b47"
  },
  "postProcess": {
    "autoOutline": false,
    "autoShading": false,
    "sdfShading": false,
    "selOut": false,
    "tileNormals": true
  },
  "layers": [],
  "frames": [],
  "grid": [
    "mmmmmmmmmmvvvvvvvmmmmmmmmmmmvmmm",
    "3332m2222122223232322m4333433333",
    "2221m2110101111112120m3222222212",
    "3231v2111111212121211m3222222222",
    "2221v2111112121212120m3222222223",
    "3231v2211121212221211m4222322232",
    "2322v3111212121222120m3223222323",
    "3231v3212121222222221m4232323232",
    "2222v3121212121212220m3322232323",
    "3231v2212121212222221m4232323232",
    "2321m3121212121222121m3223232323",
    "3331m2212221222222222m4232323232",
    "2321m2121212121212121v3322222223",
    "3231m2222122212121221v4232323233",
    "2321m3121212121112121v3323232323",
    "2121m2101011101010101v3122212221",
    "mmvvvmmmmmmvvvvvvvvvvvmmmmmmmmmm",
    "31m232322232kv222232323333333333",
    "11m3121111110m211111121212121212",
    "21m2212121110m212121212121212121",
    "10m2111111110m211111111211111111",
    "10m2111111110m211121112121111111",
    "00m2110111110m211111111111011101",
    "10m2111111110m211111111111111110",
    "00m2011101110m211101011111010000",
    "10m2111111110m211111111111111010",
    "00m2010111010m211111111101011101",
    "10m1101111110m211111111111111111",
    "00m2000101010m211111111101111111",
    "10m1101010110m211111111111111111",
    "10m2010001010m211111111111111101",
    "00m1000000000v101000101010100000"
  ],
  "fps": 8
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_sword_s123_32x32"] = {
  label: "proc_sword_s123_32x32",
  prompt: "Procedural sword (seed=123, 32x32) — 100% LLM-Free PixelDSL v3.0",
  data: {
  "name": "proc_sword_s123_32x32",
  "prompt": "Procedural sword (seed=123, 32x32) — 100% LLM-Free PixelDSL v3.0",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "ramps": {
    "M": {
      "base": "#8a85f2",
      "light": "L",
      "dark": "D",
      "outline": "O"
    },
    "A": {
      "base": "#ff6800",
      "light": "W",
      "dark": "B",
      "outline": "O"
    },
    "S": {
      "base": "#a9bea7",
      "light": "w",
      "dark": "d",
      "outline": "O"
    },
    "H": {
      "base": "#8c4a11",
      "light": "h",
      "dark": "b",
      "outline": "O"
    }
  },
  "palette": {
    ".": "transparent",
    "O": "#14182e",
    "e": "#0e101c",
    "w": "#ffffff",
    "a": "#14182e44"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#14182e",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": true,
    "selOut": true
  },
  "layers": [
    {
      "id": "shadow",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 29.0,
      "rx": 6.0,
      "ry": 1.5,
      "fill": "a"
    },
    {
      "id": "pommel",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 27.5,
      "rx": 2.2,
      "ry": 2.2,
      "fill": "A",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "grip",
      "op": "uneven_capsule",
      "x1": 15.5,
      "y1": 26.0,
      "x2": 15.5,
      "y2": 21.0,
      "r1": 1.6,
      "r2": 1.9,
      "fill": "H",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "blade",
      "op": "uneven_capsule",
      "x1": 15.5,
      "y1": 21.0,
      "x2": 15.5,
      "y2": 4.5,
      "r1": 4.2,
      "r2": 1.5,
      "fill": "S",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "blade_tip",
      "op": "vesica",
      "cx": 15.5,
      "cy": 7.5,
      "rx": 4.0,
      "ry": 5.0,
      "fill": "S",
      "outline": "O",
      "sdf": true,
      "smoothBlend": 1.5
    },
    {
      "id": "fuller",
      "op": "uneven_capsule",
      "x1": 15.5,
      "y1": 20.0,
      "x2": 15.5,
      "y2": 9.0,
      "r1": 1.0,
      "r2": 0.6,
      "fill": "M",
      "sdf": true
    },
    {
      "id": "guard",
      "op": "vesica",
      "cx": 15.5,
      "cy": 21.0,
      "rx": 7.9,
      "ry": 2.2,
      "angle": -1.4545059241354465,
      "fill": "A",
      "outline": "O",
      "sdf": true
    },
    {
      "id": "gem",
      "op": "ellipse",
      "cx": 15.5,
      "cy": 21.0,
      "rx": 1.8,
      "ry": 1.8,
      "fill": "M",
      "outline": "O",
      "sdf": true
    }
  ],
  "frames": [],
  "grid": [],
  "motion": {
    "type": "idle_breathe",
    "frames": 4,
    "amplitude": 0.8,
    "squash": 0.04
  }
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_water_tile_s99_32x32"] = {
  label: "✨ proc_water_tile_s99_32x32 (32×32) [8f]",
  prompt: "Seamless water tile (seed=99, 32x32) - tilegen",
  data: {
  "name": "proc_water_tile_s99_32x32",
  "prompt": "Seamless water tile (seed=99, 32x32) - tilegen",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "tileable": true,
  "palette": {
    ".": "transparent",
    "0": "#1c3a66",
    "1": "#22487d",
    "2": "#2a5895",
    "3": "#3770ad",
    "4": "#6aa6d6",
    "f": "#d8eef8"
  },
  "postProcess": {
    "autoOutline": false,
    "autoShading": false,
    "sdfShading": false,
    "selOut": false,
    "tileNormals": true
  },
  "layers": [],
  "frames": [
    {
      "grid": [
        "03014112122212142312111100010004",
        "30111122212221223221111110111013",
        "01311112321112121211111111131101",
        "41112222322111112111211433111144",
        "11124214321131111111113111111111",
        "21243322212111111111111111112122",
        "42132332121111141411111111111233",
        "22222231212121111131112121211122",
        "22222242122211111131111212111112",
        "22222241212221311111112121211122",
        "22333412111113111314131111111142",
        "33333221113411114331141111111123",
        "42243214111101111111011111311112",
        "2f212111133110111111131121111111",
        "11131311111101010101111222111111",
        "13111111211110001011412223211111",
        "11010111111411000001314222411111",
        "1311f111211410101011112222211111",
        "11110111111111111111111223111111",
        "11131114341111131141132324212111",
        "11113411011111311111111432111111",
        "11111411111114111113132222211121",
        "31111311110113111111311222111211",
        "31112134441113111111211122222221",
        "31121113313113111112111112421211",
        "31212111131114112121112111222121",
        "41111111111114111111111111111113",
        "43111111111311112113441111311144",
        "11311111111111111114114111111111",
        "11143111212121212113113344111111",
        "01114311121222221211133101111111",
        "30114121222222243221111110111110"
      ]
    },
    {
      "grid": [
        "30011112123332132212111100010003",
        "00131122212221232321111110111010",
        "01111114241112121211111144311301",
        "11112223242111112111213311111133",
        "11143413241111111111111111111111",
        "21232233312111111111111111112122",
        "33422224121111134311111111111422",
        "22222221212121131311112121211132",
        "22222232123341131411111212111112",
        "22222231212221141311112121211132",
        "22222342111111443113411111111132",
        "22222421111341433111131111111122",
        "33332213434101134331031111111114",
        "21212111111110111111111121111111",
        "11113111111401010101411344111111",
        "11111311211310001011313222311111",
        "13010311111341000004113222311111",
        "11411111211310101011314222411111",
        "11140131111311113411111222111111",
        "11114443133111311131112223212111",
        "11111341011114111113111324111111",
        "11111311111143111111312232211121",
        "11111131110141111111111242111211",
        "11112113333141111111211122422221",
        "11121111111411111112111112333311",
        "11212111113113112121112111224121",
        "31111111114141111111111111111111",
        "31111111111111112111331111111133",
        "43111111111111111113113111344111",
        "11431111212121212111331133341111",
        "01143111121233341211111101341111",
        "00113121224333f32321113110111110"
      ]
    },
    {
      "grid": [
        "00031112142213322232113100f10000",
        "00111124333333322221114110144010",
        "01111113231112443211114433111101",
        "11112442232111112111211111111111",
        "11432332231111111111111111111111",
        "33322222232111111111111111114443",
        "22322223121111113111111111111322",
        "22222223214421113111112141211122",
        "22222224122231113111111444111132",
        "22222224214421133111112121211122",
        "22222232111111311111311111111122",
        "22222321111133311113411111111132",
        "22222411313401313114011111111113",
        "41212111111410143341411121111111",
        "11111111111301010101313233411111",
        "11311111211110001014112222211111",
        "11010111111131000003112222211111",
        "11311311211140101014113222311111",
        "11130411111111431331111222411111",
        "11113111111344111113412222212111",
        "11111134444333111111311223111111",
        "11111131111431111111112323211121",
        "11111113410411111111111233411211",
        "11112111111331111111211123334341",
        "11143111111331111112111113221241",
        "11212111111331112121112111433321",
        "11111111113331111111111111111111",
        "11111111111111112111111111111111",
        "31111111111111111111331111133343",
        "11311111212121212111111111133341",
        "01131111121322233211111304134411",
        "00131121243222f22221111110111110"
      ]
    },
    {
      "grid": [
        "00011133432212122214111100f10000",
        "00311132212221222231113110433010",
        "04111132224144321311113311111141",
        "11113332222111113111411111111111",
        "44322212221111111111411111111111",
        "21222222212111111111111111143132",
        "22122222334111111111111111113222",
        "22222221433331111111112333211422",
        "22222223132211111111114333411112",
        "22222223433331111111112443211122",
        "22222214111111111111111111111122",
        "22222221111111111111311111111122",
        "22222311111304111113311111111142",
        "33412111111310431133311121111114",
        "11111111411101010104111222311111",
        "111331f1411130001013112222211111",
        "11410111111111000041112222211111",
        "11141111211130101033112222241111",
        "11114311111133311113313222341111",
        "11111111111131111111313222312111",
        "11111113333111111111113222111111",
        "11111113333311111111112222411121",
        "11111111333311111111111322311431",
        "11144111111111111111211432223231",
        "11131111111111111114411142221231",
        "11233111111111112121112114322121",
        "11111111111111111111111111113111",
        "11111111111111112111111111111111",
        "11111111111111111111111111111131",
        "43111111212433442111111111111134",
        "01311111333222221311111103113331",
        "00111124332222222231111110141110"
      ]
    },
    {
      "grid": [
        "00411112322212122213411400040000",
        "00111122212221222223411333311310",
        "03111312223333121214311111111131",
        "11132222223111132314311111111111",
        "33122212224111113114311111113411",
        "21222222213111111111411111132122",
        "22122222123411111111111433331222",
        "22222221312124111111113121311322",
        "42222222322213111111143212311412",
        "22222221312221111111113331311422",
        "22222212341111111111111114411322",
        "22222231111111111111111111111422",
        "22222211111133111111011111111132",
        "21333111111144311111111334111113",
        "31111111341141043443111222141111",
        "111111f4331110001041112222231111",
        "11333113411113000031142222231111",
        "11113114341113104311112222231111",
        "11113111411111111111111222133111",
        "11111111111111111111112222234111",
        "11111111011111111111111222341111",
        "11111111111111111111114222341431",
        "11111111110111111111111222134311",
        "11133111111111111144411322222221",
        "11321411111111143432134332221211",
        "11312411111111113443344343222131",
        "11133111111111113411111111141311",
        "11111111111111113111111111111111",
        "11111111144141114111111111111111",
        "31111114333321333411111111111113",
        "01111113121222221211111131111114",
        "00311143222222222224111310333410"
      ]
    },
    {
      "grid": [
        "00311412122212122212311340433400",
        "00111322212221222221311110111010",
        "41114112221112121233111111111103",
        "11412222222414312133211111113111",
        "11122212223111131343141111131313",
        "21222222212411111114341134312122",
        "22122222121331111111143311111222",
        "22224221212123111111432121233122",
        "33333222122211111111431212141312",
        "44222221212224111111142121211322",
        "22222212113341111111113333311122",
        "22222221111111111111111111111322",
        "22222211111101111111011111111412",
        "21212311111133111111113123411141",
        "13111113131134430331111222131114",
        "11111113211113004331132222211111",
        "11010131331111004301132222211111",
        "11111113231110333011142242213111",
        "11110111341111111111111232111411",
        "11111111111111111111112222213411",
        "14311111011111113411111222133441",
        "14311111111111133311113222233324",
        "11434111110111144441114222113214",
        "11312411111111133333333122222224",
        "11121311111111131312113112221214",
        "1121231111111113233113313122212f",
        "11311344311111141344113344131111",
        "11144444411111132311111111111111",
        "11111133333333333411111111111111",
        "11111143212121212311111111111111",
        "03111111121222221231111101111113",
        "00111131222222222223411143111340"
      ]
    },
    {
      "grid": [
        "00011312122212124212111133310300",
        "03111122212221222221111110111030",
        "31143112221112121211111111114101",
        "11312222222333112111231111131411",
        "11122212221311411131131134311131",
        "21222222212341144443134313112122",
        "22122222121113411114331111111222",
        "34233221212121111114312121211122",
        "22222422122211111114311212134114",
        "33333221212221111111132121234124",
        "42222212111131111111111111131122",
        "22222224111111111111114333344122",
        "22222241111101111111011334114312",
        "21212141111110111111111121334431",
        "11111111113103310101131222114113",
        "31111131213110433011112222214144",
        "11010111114111043001112434214434",
        "11111111214110101011132432211311",
        "14110114131111111111111222111311",
        "43311111111111111111112242212344",
        "43141111011111131311111222111133",
        "43131111111111411131112222211121",
        "14313111110111313334113222111213",
        "14112311111111311111211122222223",
        "14121111111111311112111112221213",
        "1421213441111141212111211122212f",
        "11111133111111131113431133311141",
        "11433333331114312141111334114111",
        "11113311111111111311111131111111",
        "11111431212121212141111111111111",
        "31111131121222221214111101111111",
        "04111421222222222221311130111130"
      ]
    }
  ],
  "grid": [
    "04011112122212123412131100010030",
    "00113122212221222221131110111014",
    "01131112221112121211131111143101",
    "13112222422111112111211144311311",
    "11122212421143311111114313111111",
    "21224222212133333311113111112122",
    "22123422121111311133111111111222",
    "23322321212121311143112121211123",
    "22222322122211311113111212113113",
    "22222421212221111143312121213123",
    "33444212111114111131141111113123",
    "44222221334111111111113111133122",
    "22222231111101111111013113431112",
    "2f212134341110111111141121113311",
    "11311131111101010101111222113331",
    "14111111211110301011112334213333",
    "31010111113111330001112323213313",
    "3111f131213110101011112323211133",
    "33310113113111111111131324111143",
    "31111111111111143411142232212133",
    "31131111011111411131131222111111",
    "31113111111111311111142222211121",
    "43111411110111111113431222111211",
    "43112141111111111111211122222221",
    "43121134434111111112111112221211",
    "13212113341111312121112111222123",
    "13111111141111311111111111111131",
    "14311111113433112134113113433311",
    "11131111111111111131111314111111",
    "11114311212121212131111111111111",
    "01111411121222221211341101111111",
    "03111321222222222221131110111113"
  ],
  "fps": 6
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["3d_humanoid_32x32"] = {
  label: "✨ 3d_humanoid_32x32 (32×32)",
  prompt: "3D Projected humanoid (perspective, yaw=25.0°, pitch=18.0°)",
  data: {
  "name": "3d_humanoid_32x32",
  "prompt": "3D Projected humanoid (perspective, yaw=25.0°, pitch=18.0°)",
  "width": 32,
  "height": 32,
  "fps": 8,
  "palette": {
    ".": "transparent",
    "0": "#14182e",
    "1": "#112f82",
    "2": "#2665ff",
    "3": "#1c4acd",
    "4": "#d7dce4",
    "5": "#235edf",
    "6": "#888b90",
    "7": "#ffffff",
    "8": "#997a66",
    "9": "#f2c2a2",
    "a": "#ffffdd",
    "b": "#5a2204",
    "c": "#421903"
  },
  "postProcess": {
    "autoOutline": false,
    "autoShading": false
  },
  "grid": [
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "..............00................",
    "..............00.00.............",
    "..............0100..............",
    "..............0120..............",
    "..............0120..............",
    "............000120..............",
    ".............03330..............",
    "............0433330..0..........",
    "............04333330040.........",
    "...........050445465440.........",
    "...........050445465440.........",
    "...........040445465440.........",
    "...........070478444600.........",
    "...........0089988800...........",
    ".............099990.............",
    "............0aaaa90.............",
    "............0bbaa90.............",
    ".............0bbbc0.............",
    ".............00bb0..............",
    "...............00...............",
    "...............00...............",
    "................................",
    "................................",
    "................................"
  ]
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["3d_dragon_32x32"] = {
  label: "✨ 3d_dragon_32x32 (32×32)",
  prompt: "3D Projected dragon (perspective, yaw=25.0°, pitch=18.0°)",
  data: {
  "name": "3d_dragon_32x32",
  "prompt": "3D Projected dragon (perspective, yaw=25.0°, pitch=18.0°)",
  "width": 32,
  "height": 32,
  "fps": 8,
  "palette": {
    ".": "transparent",
    "0": "#14182e",
    "1": "#d12424",
    "2": "#841717",
    "3": "#ff3131",
    "4": "#ed6d15",
    "5": "#ff961d"
  },
  "postProcess": {
    "autoOutline": false,
    "autoShading": false
  },
  "grid": [
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "..............0.................",
    ".............00000..............",
    "............00111200............",
    "............01111110............",
    "....0......0333311120...........",
    "....00000004333331110...........",
    "...000000005333331110...........",
    ".........00033333112000000......",
    "............03333110000000......",
    "............00333110............",
    "..............003110............",
    "...............011110...........",
    "...............011110...........",
    "...............011110...........",
    "...............00030............",
    "...............0..0.............",
    "...............0..0.............",
    "...............0..0.............",
    "................................",
    "................................",
    "................................",
    "................................"
  ]
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["3d_golem_32x32"] = {
  label: "✨ 3d_golem_32x32 (32×32)",
  prompt: "3D Projected golem (perspective, yaw=25.0°, pitch=18.0°)",
  data: {
  "name": "3d_golem_32x32",
  "prompt": "3D Projected golem (perspective, yaw=25.0°, pitch=18.0°)",
  "width": 32,
  "height": 32,
  "fps": 8,
  "palette": {
    ".": "transparent",
    "0": "#14182e",
    "1": "#303e51",
    "2": "#5f6e84",
    "3": "#3c4653",
    "4": "#8297b5",
    "5": "#06adc9",
    "6": "#1f2733",
    "7": "#42546e",
    "8": "#08edff"
  },
  "postProcess": {
    "autoOutline": false,
    "autoShading": false
  },
  "grid": [
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "............00..................",
    "...........0110.................",
    "...........0110..0000...........",
    "........0001110.01110...........",
    ".......02220110.01110...........",
    ".......02223222011110...........",
    ".......02222222200223000........",
    ".......02222222222222220........",
    ".......04442222252222220........",
    ".......06662222255522220........",
    "......011166222255522040........",
    "......077116222288522200........",
    "......0777162222222222110.......",
    "......0777122222222222710.......",
    ".......000000042222222770.......",
    "..........00022222200000........",
    ".............022220.............",
    ".............022220.............",
    ".............000000.............",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................"
  ]
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["3d_spider_32x32"] = {
  label: "✨ 3d_spider_32x32 (32×32)",
  prompt: "3D Projected spider (perspective, yaw=25.0°, pitch=18.0°)",
  data: {
  "name": "3d_spider_32x32",
  "prompt": "3D Projected spider (perspective, yaw=25.0°, pitch=18.0°)",
  "width": 32,
  "height": 32,
  "fps": 8,
  "palette": {
    ".": "transparent",
    "0": "#14182e",
    "1": "#0e1628",
    "2": "#1c1a47",
    "3": "#141e37",
    "4": "#8f2929",
    "5": "#ff5858",
    "6": "#272362",
    "7": "#12102d"
  },
  "postProcess": {
    "autoOutline": false,
    "autoShading": false
  },
  "grid": [
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    ".............0..................",
    "............00..0...............",
    "...........00.00100..0..........",
    "..........020033411000..........",
    "..........020333335060..........",
    "..........020333331060..........",
    "..........072203330200..........",
    ".........06666230000............",
    ".........0666662270.............",
    ".........066666620..............",
    "..........06666620..............",
    "..........0666660...............",
    "...........00000................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................"
  ]
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["3d_chest_32x32"] = {
  label: "✨ 3d_chest_32x32 (32×32)",
  prompt: "3D Projected chest (perspective, yaw=25.0°, pitch=18.0°)",
  data: {
  "name": "3d_chest_32x32",
  "prompt": "3D Projected chest (perspective, yaw=25.0°, pitch=18.0°)",
  "width": 32,
  "height": 32,
  "fps": 8,
  "palette": {
    ".": "transparent",
    "0": "#14182e",
    "1": "#7e490d",
    "2": "#eec214",
    "3": "#967a0d",
    "4": "#ad6412"
  },
  "postProcess": {
    "autoOutline": false,
    "autoShading": false
  },
  "grid": [
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "............000.................",
    "...........01110000.............",
    "...........01111111000..........",
    "..........001111123110..........",
    "..........001111122110..........",
    "..........001111111110..........",
    "..........001111111140..........",
    "..........001111111110..........",
    "..........004444411110..........",
    "..........000000000000..........",
    "..............000000............",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................"
  ]
}
};

window.SKILL_PROMPT_TEMPLATE = function(userRequest, width, height, mode) {
  if (mode === "rig") {
    return `You are a 2D pixel-art skeletal capsule rig generator following the PixelDSL v3.0 Rig Engine specification.
Convert the user request into a valid JSON rig definition without any surrounding explanation (JSON only).

USER REQUEST: "${userRequest}"
TARGET CANVAS SIZE: ${width}x${height} pixels.

PIXELRIG ARCHITECTURE & KINEMATICS:
1. Root Bone: Define a root body/torso bone with "origin": [cx, cy], "length": L, "r1": R1, "r2": R2, "angle": 0, "z": 2.
2. Hierarchical Bones: Define child bones with "parent": "<parent_bone_id>", "offset": [dx, dy] (relative to parent head or tail), "length": L, "r1": R1, "r2": R2, "angle": DEG, "z": Z.
3. Tapered 3D Volume: Each bone is rasterized as a smooth continuous capsule or head oval, producing spherical 3D surface normals, directional cel-shading, and 1px internal anatomical creases where different z-tiers overlap.
4. Animation Poses: Under "poses", define frame deltas without re-specifying the whole body! Each frame only specifies { "<bone_id>": { "dAngle": DEG, "dx": 0, "dy": 0 } }.

OUTPUT FORMAT (strictly valid JSON):
{
  "type": "rig",
  "name": "character_rig_${width}x${height}",
  "width": ${width},
  "height": ${height},
  "fps": 6,
  "palette": {
    ".": "transparent",
    "O": "#14182e",
    "S": "#f2b18d",
    "C": "#3a7bd5",
    "P": "#264b87",
    "H": "#633c24",
    "w": "#ffffff"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#14182e",
    "sdfShading": true
  },
  "bones": [
    { "id": "torso", "origin": [${Math.floor(width / 2)}, ${Math.floor(height * 0.45)}], "length": ${Math.floor(height * 0.28)}, "r1": 4.5, "r2": 4.0, "angle": 90, "fill": "C", "outline": "O", "z": 3, "crease": true },
    { "id": "head", "parent": "torso", "offset": [0, -${Math.floor(height * 0.22)}], "length": ${Math.floor(height * 0.2)}, "r1": 6.5, "r2": 6.0, "angle": 90, "fill": "S", "outline": "O", "z": 5, "crease": true, "oval": true }
  ],
  "poses": [
    {},
    { "torso": { "dy": 1 } }
  ]
}`;
  }

  if (mode === "shader") {
    return `You are a procedural GLSL / math shader pixel-art generator following the PixelDSL v3.0 Shader Engine specification.
Convert the user request into a valid JSON shader definition without any surrounding explanation (JSON only).

USER REQUEST: "${userRequest}"
TARGET CANVAS SIZE: ${width}x${height} pixels.

PIXELSHADER ARCHITECTURE:
1. Continuous Math Field: Evaluates void mainImage(out vec4 fragColor, in vec2 uv, in float time) where uv is normalized [0, 1] (or p = uv * 2.0 - 1.0) and time loops [0.0, 1.0].
2. Palette Quantization: fragColor RGB is quantized to the closest color in "palette" via perceptual Oklab color space with Bayer 4x4 matrix dithering.
3. 3D Normals: Tangent-space normal maps are automatically computed via finite difference intensity gradients.

OUTPUT FORMAT (strictly valid JSON):
{
  "type": "shader",
  "name": "effect_shader_${width}x${height}",
  "width": ${width},
  "height": ${height},
  "fps": 8,
  "framesCount": 8,
  "shaderType": "portal",
  "dither": "bayer4x4",
  "ditherStrength": 0.16,
  "palette": {
    "1": "#070b19",
    "2": "#142247",
    "3": "#264b87",
    "4": "#3a7bd5",
    "5": "#60a5fa",
    "6": "#93c5fd",
    "7": "#ffffff"
  },
  "glsl": "void mainImage(out vec4 fragColor, in vec2 uv, in float time) {\\n    vec2 p = uv * 2.0 - 1.0;\\n    float r = length(p);\\n    float a = atan(p.y, p.x);\\n    float spiral = sin(a * 4.0 - time * 6.28318 + r * 6.0);\\n    float d = r - 0.72 + 0.08 * spiral;\\n    if (d > 0.05) { fragColor = vec4(0.0); return; }\\n    float intensity = clamp(1.0 - d * 2.0, 0.0, 1.0);\\n    fragColor = vec4(vec3(intensity), 1.0);\\n}"
}`;
  }

  const isGridPreferred = (mode === "grid") || (mode === "auto" && width <= 32 && height <= 32);
  const modeInstructions = isGridPreferred
    ? `MODE: Symbolic Pixel Matrix ("grid").
- The "grid" array must contain exactly ${height} strings.
- Each string must contain exactly ${width} single-character keys from "palette" (where "." is transparent).
- Count characters in every row carefully (strictly ${width} chars per row).`
    : `MODE: Hybrid Procedural & 2.5D SDF/CSG Pixel Layers ("layers" + "stamp" + optional "motion" / "frames").
- Canvas size: ${width}x${height} pixels.
- Build the silhouette in "layers" using integer or exact Quilez SDF primitives with an "id" field:
  * { "id": "body", "op": "ellipse", "cx": X, "cy": Y, "rx": RX, "ry": RY, "angle": 0, "fill": "S", "outline": "O", "sdf": true, "smoothBlend": 2.2, "z": 1, "crease": false, "opMode": "union|smooth_union|subtract|smooth_subtract|intersect", "shader": "none|worley|voronoi|turing|bayer4x4|blue_noise", "mirror": "none|x|y|quad" }
  * { "id": "limb", "op": "uneven_capsule", "x1": X1, "y1": Y1, "x2": X2, "y2": Y2, "r1": R1, "r2": R2, "fill": "S", "outline": "O", "sdf": true, "z": 2, "crease": true, "mirror": "none|x" }
  * { "id": "leaf", "op": "vesica", "cx": X, "cy": Y, "rx": RX, "ry": RY, "angle": 0, "fill": "S", "outline": "O", "sdf": true }
  * { "id": "crest", "op": "moon", "cx": X, "cy": Y, "r": R1, "r2": R2, "d": D, "angle": 0, "fill": "S", "outline": "O", "sdf": true }
  * { "id": "tail", "op": "bezier_sdf", "points": [[x1,y1],[cx,cy],[x2,y2]], "r1": R1, "r2": R2, "fill": "S", "outline": "O", "sdf": true }
  * { "id": "gem", "op": "star", "cx": X, "cy": Y, "r": R, "n": 5, "innerRatio": 0.48, "angle": 0, "fill": "S", "outline": "O", "sdf": true }
  * { "id": "hex", "op": "ngon", "cx": X, "cy": Y, "r": R, "n": 6, "angle": 0, "fill": "S", "outline": "O", "sdf": true }
  * { "id": "box", "op": "rect", "x": X, "y": Y, "w": W, "h": H, "rx": 1, "angle": 0, "fill": "S", "outline": "O", "sdf": true, "mirror": "none|x" }
  * { "id": "shard", "op": "polygon", "points": [[x1,y1],[x2,y2],[x3,y3]], "angle": 0, "fill": "S", "outline": "O", "sdf": true, "mirror": "none|x" }
  * { "id": "eyes", "op": "stamp", "x": X, "y": Y, "angle": 0, "grid": ["..ee..", ".ewwe."] }
  * { "id": "glint", "op": "pixels", "color": "w", "points": [[x,y]] }
- 2.5D SDF METABALLS, INTERNAL CREASES & 3D VOLUME SHADING:
  * Set "smoothBlend": 1.6..3.5 on consecutive shape layers sharing the same "fill" to smoothly fuse them via polynomial SDF smooth-min with a single unified 1px outline.
  * Set "z": 2 and "crease": true on foreground overlapping limbs (e.g., thigh over body) to draw an automatic 1px dark anatomical crease inside the merged silhouette.
  * Set "sdf": true on a layer (or "postProcess": { "sdfShading": true } globally) for Oklch hue-shifted 5-band 3D volume shading and tangent-space normal maps.
- PROCEDURAL MOTION & ANIMATION:
  * Either provide a declarative motion block: "motion": { "type": "idle_breathe|walk_cycle|swim_cycle|jump_arc|wave", "frames": 4, "amplitude": 1.0 }
  * Or explicit per-frame layer deltas: "frames": [{ "layers": { "limb": { "dx": 0, "dy": -1, "dAngle": 15 } } }].`;

  return `You are a 2D pixel-art asset generator following the PixelDSL v3.0 specification (SKILL.md).
Convert the user request into a valid JSON sprite definition without any surrounding explanation (JSON only).

USER REQUEST: "${userRequest}"
TARGET CANVAS SIZE: ${width}x${height} pixels (coordinate range X: 0..${width - 1}, Y: 0..${height - 1}).

${modeInstructions}

PALETTE, OKLCH AUTO-RAMPS ("ramps"), AND COMPOSITION RULES:
1. "." is always "transparent".
2. You may specify "palettePreset": "endesga32" | "pico8" | "gameboy" OR define perceptual Oklch auto tonal ramps in "ramps":
   "ramps": { "S": { "base": "#3e8948", "light": "L", "dark": "B", "outline": "O" } } — the engine automatically generates highlight "L", shadow "B", and outline "O".
3. Leave a 1–2 pixel transparent margin around canvas borders so the silhouette is never clipped.

OUTPUT FORMAT (strictly valid JSON):
{
  "name": "sprite_${width}x${height}",
  "width": ${width},
  "height": ${height},
  "symmetry": "none",
  "rle": false,
  "ramps": {
    "S": { "base": "#3e8948", "light": "L", "dark": "B", "outline": "O" }
  },
  "palette": {
    ".": "transparent",
    "O": "#14182e"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#14182e",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": false,
    "selOut": false
  },
  "layers": [],
  "frames": [],
  "grid": []
}`;
};
