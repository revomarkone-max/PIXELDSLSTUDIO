// PixelDSL Studio v3.0 — Curated Procedural & Mathematical Asset Presets
// Zero-dependency mathematical 2.5D SDFs, Skeletal Capsule Rigs, and GLSL Shaders.

window.PIXEL_PRESETS = {};

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
