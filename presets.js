// Sprite Presets from 8x8 to 128x128 (supporting auto color ramps, named layers, and multi-frame animations)

window.PIXEL_PRESETS = {
  turtle_grid_32x32: {
    label: "🐢 Top-Down Turtle 32×32 (Symbolic Grid)",
    prompt: "32x32 pixel art turtle sprite, top-down view",
    data: {
      name: "turtle_topdown_32x32_grid",
      width: 32,
      height: 32,
      symmetry: "none",
      rle: false,
      ramps: {
        "S": { "base": "#3e8948", "light": "L", "dark": "B", "outline": "O" }
      },
      palette: {
        ".": "transparent",
        "O": "#14182e",
        "k": "#3b7d4f",
        "h": "#63c74d",
        "e": "#0f1016",
        "w": "#ffffff",
        "B": "#265c42",
        "S": "#3e8948",
        "L": "#73d95c",
        "Y": "#e5b045"
      },
      postProcess: {
        autoOutline: false,
        outlineColor: "#14182e",
        autoShading: false,
        shadingStrength: 0.16
      },
      layers: [],
      grid: [
        "................................",
        ".............OOOOOO.............",
        "............OhhhhhhO............",
        "...........OewhhhhweO...........",
        "...........OehhhhhheO...........",
        "............OhkkkkhO............",
        ".............OkkkkO.............",
        "...OOOO....OOOOOOOOOO....OOOO...",
        "..OhhhhO.OOBYYYYYYYYBOO.OhhhhO..",
        ".OhhhhkkOOYBBBBBBBBBBYOOkkhhhhO.",
        ".OkkkOOOYBBSSSSBBSSSSBBYOOOkkkO.",
        "..OOO..OYBSSSSSBBSSSSSBYO..OOO..",
        "......OYBBLLLLSBBSSSSSBBYO......",
        "......OYBBBBBBBBBBBBBBBBYO......",
        ".....OOYBSLLLLBBBBSSSSSBYOO.....",
        ".....OYBBLLLLSBBBBSSSSSBBYO.....",
        ".....OYBBLLLLSBBBBSSSSSBBYO.....",
        ".....OYBBBBBBBBBBBBBBBBBBYO.....",
        ".....OYBBSSSSSBBBBSSSSSBBYO.....",
        ".....OOYBSSSSSBBBBSSSSSBYOO.....",
        "......OYBBBBBBBBBBBBBBBBYO......",
        "......OYBBSSSSBSSBSSSSBBYO......",
        "..OOO..OYBSSSSBSSBSSSSBYO..OOO..",
        ".OhhhOOOYBBSSSBSSBSSSBBYOOOhhhO.",
        ".OhhhhkkOOYBBBBBBBBBBYOOkkhhhhO.",
        "..OkkkkO.OOBYYYYYYYYBOO.OkkkkO..",
        "...OOOO....OOOOOOOOOO....OOOO...",
        "..............OkkO..............",
        "..............OkkO..............",
        "...............OO...............",
        "................................",
        "................................"
      ]
    }
  },

  turtle_hybrid_32x32: {
    label: "🐢 Sea Turtle 32×32 (Hybrid Layers + 4-Frame Swim)",
    prompt: "32x32 sea turtle sprite, top-down view, 4-frame swimming animation",
    data: {
      name: "sea_turtle_topdown_32x32_anim",
      width: 32,
      height: 32,
      symmetry: "none",
      rle: false,
      ramps: {
        "S": { "base": "#3a8754", "light": "l", "dark": "B", "outline": "O" }
      },
      palette: {
        ".": "transparent",
        "O": "#14182e",
        "s": "#2f6b55",
        "h": "#58b878",
        "l": "#8ce08a",
        "B": "#1f473e",
        "S": "#3a8754",
        "Y": "#d9a05b",
        "e": "#0e101c",
        "w": "#ffffff",
        "a": "#14182e44"
      },
      postProcess: {
        autoOutline: false,
        outlineColor: "#14182e",
        autoShading: true,
        shadingStrength: 0.14
      },
      layers: [
        { "id": "shadow", "op": "ellipse", "cx": 16, "cy": 18, "rx": 12, "ry": 12, "fill": "a" },
        { "id": "tail", "op": "polygon", "points": [[14, 26], [18, 26], [16, 31]], "fill": "s", "outline": "O" },
        { "id": "flipper_front", "op": "ellipse", "cx": 6, "cy": 11, "rx": 6, "ry": 3, "angle": -32, "fill": "h", "outline": "O", "mirror": "x" },
        { "id": "flipper_back", "op": "ellipse", "cx": 8, "cy": 24, "rx": 5, "ry": 2, "angle": 35, "fill": "s", "outline": "O", "mirror": "x" },
        { "id": "head", "op": "ellipse", "cx": 16, "cy": 5, "rx": 4, "ry": 4, "fill": "h", "outline": "O" },
        { "id": "shell_rim", "op": "ellipse", "cx": 16, "cy": 17, "rx": 9, "ry": 11, "fill": "Y", "outline": "O" },
        { "id": "shell_main", "op": "ellipse", "cx": 16, "cy": 17, "rx": 8, "ry": 10, "fill": "S", "outline": "B", "dither": "scales", "ditherColor": "B" },
        { "id": "shell_hi", "op": "ellipse", "cx": 14, "cy": 14, "rx": 4, "ry": 5, "fill": "l", "dither": "sparse", "ditherColor": "S" },
        { "id": "ridge_v", "op": "line", "x1": 16, "y1": 7, "x2": 16, "y2": 26, "thickness": 1, "color": "B" },
        { "id": "ridge_h1", "op": "line", "x1": 9, "y1": 13, "x2": 23, "y2": 13, "thickness": 1, "color": "B" },
        { "id": "ridge_h2", "op": "line", "x1": 8, "y1": 19, "x2": 24, "y2": 19, "thickness": 1, "color": "B" },
        {
          "id": "eyes",
          "op": "stamp",
          "x": 12,
          "y": 3,
          "grid": [
            "ew....we",
            "e......e"
          ]
        }
      ],
      frames: [
        {
          "layers": {
            "flipper_front": { "dAngle": 18, "dy": -1 },
            "flipper_back": { "dAngle": -14, "dy": 1 },
            "head": { "dy": -1 },
            "eyes": { "dy": -1 },
            "tail": { "dx": -1 }
          }
        },
        {
          "layers": {
            "flipper_front": { "dAngle": 0, "dy": 0 },
            "flipper_back": { "dAngle": 0, "dy": 0 }
          }
        },
        {
          "layers": {
            "flipper_front": { "dAngle": -18, "dy": 2 },
            "flipper_back": { "dAngle": 14, "dy": -1 },
            "tail": { "dx": 1 }
          }
        }
      ],
      grid: []
    }
  },

  sword_8x8: {
    label: "⚔️ Knight Sword 8×8 (Micro Grid)",
    prompt: "8x8 diagonal knight sword pixel sprite",
    data: {
      name: "knight_sword_8x8",
      width: 8,
      height: 8,
      symmetry: "none",
      rle: false,
      palette: {
        ".": "transparent",
        "O": "#181425",
        "b": "#8b9bb4",
        "w": "#ffffff",
        "g": "#feae34",
        "h": "#733e39"
      },
      postProcess: {
        autoOutline: false,
        outlineColor: "#181425",
        autoShading: false,
        shadingStrength: 0.15
      },
      layers: [],
      grid: [
        ".....OO.",
        "....OwbO",
        "...OwbO.",
        ".gOwbO..",
        "..ggO...",
        ".hgg....",
        "gh..g...",
        "........"
      ]
    }
  },

  potion_16x16: {
    label: "🧪 Mana Potion 16×16 (Grid + Alpha Glass)",
    prompt: "16x16 blue mana potion flask sprite",
    data: {
      name: "mana_potion_16x16",
      width: 16,
      height: 16,
      symmetry: "none",
      rle: false,
      palette: {
        ".": "transparent",
        "O": "#181425",
        "c": "#b86f50",
        "C": "#743f39",
        "g": "#aaddff55",
        "w": "#ffffff",
        "b": "#2ce8f5",
        "B": "#0099db",
        "D": "#124e89"
      },
      postProcess: {
        autoOutline: false,
        outlineColor: "#181425",
        autoShading: false,
        shadingStrength: 0.15
      },
      layers: [],
      grid: [
        ".....OOOOOO.....",
        ".....OccccO.....",
        "......OCCO......",
        ".....OOOOOO.....",
        ".....OggggO.....",
        "....OgwggggO....",
        "...OgwggggggO...",
        "..OgwbbbbbbbbO..",
        "..OwbwbbbbBBBO..",
        "..OwbBBBBBBBDO..",
        "..OwbBBBBDDDDO..",
        "..OgBBBBDDDDDO..",
        "...OBBBDDDDDO...",
        "....ODDDDDDO....",
        ".....OOOOOO.....",
        "................"
      ]
    }
  },

  scarab_64x64: {
    label: "🪲 Golden Scarab 64×64 (Layers + Walk Cycle)",
    prompt: "64x64 golden scarab beetle sprite, top-down view",
    data: {
      name: "golden_scarab_64x64",
      width: 64,
      height: 64,
      symmetry: "none",
      rle: false,
      ramps: {
        "y": { "base": "#f2b63d", "light": "w", "dark": "g", "outline": "O" }
      },
      palette: {
        ".": "transparent",
        "O": "#121324",
        "d": "#1f243d",
        "b": "#394778",
        "g": "#b56c2b",
        "y": "#f2b63d",
        "w": "#fff3a1",
        "c": "#1fb5b8",
        "C": "#6cf0e1",
        "s": "#12132455"
      },
      postProcess: {
        autoOutline: false,
        outlineColor: "#121324",
        autoShading: true,
        shadingStrength: 0.18
      },
      layers: [
        { "id": "shadow", "op": "ellipse", "cx": 32, "cy": 35, "rx": 22, "ry": 22, "fill": "s" },
        { "id": "mandibles", "op": "curve", "points": [[27, 13], [22, 5], [28, 3]], "thickness": 2, "color": "O", "mirror": "x" },
        { "id": "leg_front", "op": "curve", "points": [[21, 22], [10, 16], [5, 9]], "thickness": 2, "color": "O", "mirror": "x" },
        { "id": "leg_mid", "op": "curve", "points": [[18, 32], [7, 32], [3, 28]], "thickness": 2, "color": "O", "mirror": "x" },
        { "id": "leg_back", "op": "curve", "points": [[20, 44], [9, 50], [5, 58]], "thickness": 2, "color": "O", "mirror": "x" },
        { "id": "head", "op": "ellipse", "cx": 32, "cy": 14, "rx": 8, "ry": 6, "fill": "d", "outline": "O" },
        { "id": "thorax", "op": "ellipse", "cx": 32, "cy": 22, "rx": 13, "ry": 7, "fill": "g", "outline": "O" },
        { "id": "thorax_hi", "op": "ellipse", "cx": 32, "cy": 21, "rx": 10, "ry": 4, "fill": "y" },
        { "id": "abdomen", "op": "ellipse", "cx": 32, "cy": 39, "rx": 16, "ry": 19, "fill": "g", "outline": "O" },
        { "id": "elytra", "op": "ellipse", "cx": 32, "cy": 38, "rx": 14, "ry": 16, "fill": "y", "dither": "scales", "ditherColor": "g" },
        { "id": "spec", "op": "ellipse", "cx": 26, "cy": 34, "rx": 4, "ry": 8, "angle": -12, "fill": "w", "dither": "sparse", "ditherColor": "y" },
        { "id": "seam", "op": "line", "x1": 32, "y1": 20, "x2": 32, "y2": 57, "thickness": 2, "color": "O" },
        { "id": "gem", "op": "ellipse", "cx": 32, "cy": 22, "rx": 4, "ry": 4, "fill": "c", "outline": "O" },
        { "id": "gem_hi", "op": "ellipse", "cx": 31, "cy": 21, "rx": 2, "ry": 2, "fill": "C" },
        { "id": "eyes", "op": "pixels", "color": "C", "points": [[26, 12], [37, 12], [26, 13], [37, 13]] }
      ],
      frames: [
        {
          "layers": {
            "leg_front": { "dy": -2 },
            "leg_mid": { "dy": 2 },
            "leg_back": { "dy": -2 },
            "mandibles": { "dx": -1 }
          }
        },
        {
          "layers": {
            "leg_front": { "dy": 2 },
            "leg_mid": { "dy": -2 },
            "leg_back": { "dy": 2 },
            "mandibles": { "dx": 1 }
          }
        }
      ],
      grid: []
    }
  },

  ice_monolith_128x128: {
    label: "💎 Ice Rune Monolith 128×128 (Max Size)",
    prompt: "128x128 magical ice rune crystal monolith sprite",
    data: {
      name: "ice_rune_monolith_128x128",
      width: 128,
      height: 128,
      symmetry: "none",
      rle: false,
      palette: {
        ".": "transparent",
        "O": "#0d1326",
        "a": "#249fde33",
        "A": "#5ce1e655",
        "d": "#172b54",
        "m": "#22558c",
        "c": "#3898d4",
        "l": "#7be3f5",
        "w": "#e8ffff",
        "r": "#2df7ff",
        "s": "#090c1a88"
      },
      postProcess: {
        autoOutline: false,
        outlineColor: "#0d1326",
        autoShading: true,
        shadingStrength: 0.16
      },
      layers: [
        { "id": "shadow", "op": "ellipse", "cx": 64, "cy": 110, "rx": 42, "ry": 11, "fill": "s" },
        { "id": "aura_outer", "op": "ellipse", "cx": 64, "cy": 60, "rx": 44, "ry": 50, "fill": "a" },
        { "id": "aura_inner", "op": "ellipse", "cx": 64, "cy": 60, "rx": 32, "ry": 38, "fill": "A" },
        { "id": "pedestal", "op": "polygon", "points": [[26, 108], [102, 108], [92, 92], [36, 92]], "fill": "d", "outline": "O" },
        { "id": "side_shards", "op": "polygon", "points": [[34, 96], [52, 96], [42, 62], [22, 74]], "fill": "m", "outline": "O", "mirror": "x" },
        { "id": "crystal_body", "op": "polygon", "points": [[64, 10], [88, 36], [80, 102], [48, 102], [40, 36]], "fill": "c", "outline": "O", "dither": "checker", "ditherColor": "m" },
        { "id": "crystal_left", "op": "polygon", "points": [[64, 10], [64, 102], [48, 102], [40, 36]], "fill": "l", "outline": "O", "dither": "sparse", "ditherColor": "c" },
        { "id": "crystal_tip", "op": "polygon", "points": [[64, 12], [64, 42], [42, 36]], "fill": "w" },
        { "id": "ridge_v", "op": "line", "x1": 64, "y1": 10, "x2": 64, "y2": 101, "thickness": 2, "color": "w" },
        { "id": "ridge_h", "op": "line", "x1": 40, "y1": 36, "x2": 88, "y2": 36, "thickness": 1, "color": "l" },
        { "id": "core_diamond", "op": "polygon", "points": [[64, 46], [74, 60], [64, 74], [54, 60]], "fill": "r", "outline": "w" },
        { "id": "core_glow", "op": "ellipse", "cx": 64, "cy": 60, "rx": 4, "ry": 6, "fill": "w" },
        { "id": "float_1", "op": "rect", "x": 20, "y": 42, "w": 5, "h": 5, "fill": "r", "outline": "w", "mirror": "x" },
        { "id": "float_2", "op": "rect", "x": 28, "y": 24, "w": 4, "h": 4, "fill": "w", "mirror": "x" }
      ],
      frames: [
        {
          "layers": {
            "float_1": { "dy": -3 },
            "float_2": { "dy": 2 },
            "core_glow": { "drx": 1, "dry": 1 }
          }
        }
      ],
      grid: []
    }
  },

  sdf_slime_king_48x48: {
    label: "👑 SDF Slime King 48×48 (Metaballs + 3D Volume)",
    prompt: "48x48 slime king boss sprite with smooth SDF metaball body and 3D volume shading",
    data: {
      name: "sdf_slime_king_48x48",
      width: 48,
      height: 48,
      symmetry: "none",
      rle: false,
      ramps: {
        "G": { "base": "#37b24d", "light": "L", "dark": "D", "outline": "O" },
        "Y": { "base": "#f59f00", "light": "W", "dark": "B", "outline": "O" }
      },
      palette: {
        ".": "transparent",
        "O": "#14182e",
        "G": "#37b24d",
        "L": "#74e368",
        "D": "#1f6e3c",
        "Y": "#f59f00",
        "W": "#fff3bf",
        "B": "#b45309",
        "R": "#f03e3e",
        "e": "#101224",
        "w": "#ffffff",
        "s": "#10122455"
      },
      postProcess: {
        autoOutline: false,
        outlineColor: "#14182e",
        autoShading: false,
        shadingStrength: 0.16,
        sdfShading: true
      },
      layers: [
        { "id": "shadow", "op": "ellipse", "cx": 24, "cy": 41, "rx": 18, "ry": 5, "fill": "s" },
        { "id": "crown_base", "op": "rect", "x": 16, "y": 8, "w": 16, "h": 6, "rx": 1, "fill": "Y", "outline": "O", "sdf": true },
        { "id": "crown_spikes", "op": "polygon", "points": [[16, 9], [19, 3], [24, 8], [29, 3], [32, 9]], "fill": "Y", "outline": "O", "sdf": true },
        { "id": "crown_gem", "op": "ellipse", "cx": 24, "cy": 9, "rx": 2, "ry": 2, "fill": "R", "outline": "O" },
        { "id": "slime_core", "op": "ellipse", "cx": 24, "cy": 27, "rx": 14, "ry": 12, "fill": "G", "outline": "O", "sdf": true, "smoothBlend": 2.2 },
        { "id": "slime_lobes", "op": "ellipse", "cx": 12, "cy": 33, "rx": 7, "ry": 6, "fill": "G", "outline": "O", "mirror": "x", "sdf": true, "smoothBlend": 2.2 },
        { "id": "slime_top", "op": "ellipse", "cx": 24, "cy": 18, "rx": 9, "ry": 6, "fill": "G", "outline": "O", "sdf": true, "smoothBlend": 2.0 },
        {
          "id": "face",
          "op": "stamp",
          "x": 17,
          "y": 24,
          "grid": [
            ".ee........ee.",
            "ewwe......ewwe",
            "eeee......eeee",
            ".....OOOO.....",
            "....OwwwwO...."
          ]
        }
      ],
      frames: [
        {
          "layers": {
            "slime_core": { "drx": 2, "dry": -1, "dy": 1 },
            "slime_lobes": { "dx": -1, "dy": 1 },
            "slime_top": { "dy": 2 },
            "crown_base": { "dy": 2 },
            "crown_spikes": { "dy": 2 },
            "crown_gem": { "dy": 2 },
            "face": { "dy": 1 }
          }
        },
        {
          "layers": {
            "slime_core": { "drx": -1, "dry": 2, "dy": -2 },
            "slime_lobes": { "dx": 1, "dy": -1 },
            "slime_top": { "dy": -2 },
            "crown_base": { "dy": -3 },
            "crown_spikes": { "dy": -3 },
            "crown_gem": { "dy": -3 },
            "face": { "dy": -2 }
          }
        }
      ],
      grid: []
    }
  }
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["white_pink_bunny_jump_32x32"] = {
  label: "🐰 White-Pink Bunny 32×32 (6-Frame Jump)",
  prompt: "Generated via CLI: white_pink_bunny_jump_32x32",
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
      "z": 1
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


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_sword_s42_32x32"] = {
  label: "✨ proc_sword_s42_32x32 (32×32) [4f]",
  prompt: "Procedural sword (seed=42, 32x32) — 100% LLM-Free PixelDSL v3.0",
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


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_crystal_monolith_s108_48x48"] = {
  label: "✨ proc_crystal_monolith_s108_48x48 (48×48) [4f]",
  prompt: "Procedural crystal_monolith (seed=108, 48x48) — 100% LLM-Free PixelDSL v3.0",
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


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["imported_body_strip_raw_48x48"] = {
  label: "✨ imported_body_strip_raw_48x48 (48×48) [4f]",
  prompt: "Imported & Oklab-quantized from body_strip_raw.png (4 frame(s))",
  data: {
  "name": "imported_body_strip_raw_48x48",
  "prompt": "Imported & Oklab-quantized from body_strip_raw.png (4 frame(s))",
  "width": 48,
  "height": 48,
  "symmetry": "none",
  "rle": false,
  "palette": {
    ".": "transparent",
    "A": "#121117",
    "B": "#1c261b",
    "C": "#20361f",
    "D": "#020202",
    "E": "#3d553d",
    "F": "#040a00",
    "G": "#304524",
    "H": "#2e2e35",
    "I": "#2c4144",
    "J": "#69605b",
    "K": "#4f443e",
    "L": "#54745d",
    "M": "#737377",
    "N": "#3f6431",
    "O": "#948187",
    "P": "#acada8"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#14182e",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": false
  },
  "layers": [],
  "frames": [
    {
      "grid": [
        "................................................",
        "................................................",
        "................................................",
        "................................................",
        "................................................",
        "..............M.................................",
        "...............M................................",
        "...............KO.............MO................",
        "................K..............M................",
        "................JO.............J................",
        "...............JMMOM.ENNNEEN..JMO...............",
        "..................HKMGGEGEENNNJMO...............",
        "..................GHJKGGEEEGEEEM................",
        ".................KKKIKGGEGICBFBI................",
        ".................CCBBCGGCGCFDDFCK...............",
        ".................CBCBBGGEBAHKBDAC...............",
        ".................ICCBCCGCAKPOIAFB...............",
        ".................ICBGCCCBBBJMKHAB...............",
        ".................ICCGGGAAABHHJHHA...............",
        "................ICBCCGCAAAAABHHHFB..............",
        "................ECCBCGAAAAAAAABHFB..............",
        "................GCBBBCDAAAAAAAHAFB..............",
        "................CBBBBIAAAAAAAAHAAB..............",
        ".................BAABIIFFAABABBBBC..............",
        "...............LEIBAFBCCBAAAABCGGEO.............",
        ".............HEGNECCAAFBCGCFFCGGELM.............",
        ".............AFBAENNEGCBCGCCBCGNEKO.............",
        "..............IHHBHKEJNNELIBBILLLJ..............",
        "..............KIIKKKKHELELJIIIELLJM.............",
        ".............EKIKKJJIABAHEKOJIIJEHJ.............",
        ".............JJKKKIBAABHHHMPPKHKOIHK............",
        "............KKKHIBDDAABBAHKPPKHHL...............",
        ".............HIFDBAFAAAABBBKJIIBIO..............",
        ".............JIDDABBAAAAAAHBBHIBIJ..............",
        ".............IBFFAAAAAAAABAAAHBBII..............",
        ".............BAFDAAAAAAAAAAABHBBH...............",
        ".............BBFFABAAAAAAAABBAAHH...............",
        ".............CBFFFBAAAAAABBBAAABB...............",
        ".............GCAFFABAAAAAABBAAABH...............",
        ".............CBAFAABBAAAAAAAABBHK...............",
        ".............ACBBAAHHBAAAAAABBHC................",
        ".............BCBBBBBHHBAAABBHHBB................",
        "..............CBBBBBABIHHHHHB.A.................",
        "..............CBBBBBBBBCC.......................",
        "..............HBB.BCB...........................",
        "...................C............................",
        "................................................",
        "................................................"
      ]
    },
    {
      "grid": [
        "................................................",
        "................................................",
        "................................................",
        "................................................",
        "................................................",
        ".........................OJ.....................",
        "..........................J.....................",
        "..................J.......HK....................",
        "...................K.......K....................",
        "...................H....E..HK...................",
        "....................EEGEGNLBH...................",
        "...................NEGGGIGECBN..................",
        "..................INECBCCCBABJLL................",
        ".................GGCGCBBBBBBABGL................",
        ".................CBCBBCCCCGBBBGNL...............",
        ".................BBFACCCCCGCGGGEE...............",
        "..................HABCCGGCGGGEEGK...............",
        "..................EBBCCCCICGKGENN...............",
        "..................BBCCCCCIGEKENEN...............",
        ".................CCBCCCCCCGCEGEEEK..............",
        ".................GBBBBCCCBCCCGGGEK..............",
        ".................BBBBBABBBCCBCGCGK..............",
        ".................BAABAAAFFBBBCBGCG..............",
        ".................MBAFAAABAGNEEECC...............",
        "................PLHBBBIGEEGEGCBEG...............",
        "................MECIHHEEENEBAAAAB...............",
        "................MCIIGHHBBBBHKKJJB...............",
        "................JIIHCIICIHHHJMMMO...............",
        "................EIICECCGGBKJJJMMO...............",
        "...............IIIECCCHBGBHIJJJOO...............",
        "...............MJIIBHCIGEIBAHIMMO...............",
        "...............EIEIIICGEGGIBBHIKJ...............",
        "..............JBEECICCHGEBGHBKKHH...............",
        "...............IEAACCGICGEIEIHHBB...............",
        "..............EEIBCIIBGBEEEIBBHBH...............",
        "..............EEHICECCBCBEEEAABBH...............",
        "..............BBAIBIBGIGBBGEHAABA...............",
        "...............HIBBHBIGGBGCEEAAB................",
        "...............IIAHCBBGBGEGEEBB.................",
        "...............KBBIBACBBCEEEEB..................",
        "...............CBIKABCBBBGEGE...................",
        "...............BCIBBBCBBBBGG....................",
        "...............GICBBCCBCBBGE....................",
        "................ICBCC..CC.GK....................",
        "................HC.CH..C........................",
        "................................................",
        "................................................",
        "................................................"
      ]
    },
    {
      "grid": [
        "................................................",
        "................................................",
        "................................................",
        "................................................",
        "................................................",
        "............J...................................",
        "............HK..................JK..............",
        ".............K..................IK..............",
        ".............K..................B...............",
        ".............IK......LLLNN...B..HI..............",
        ".............BBKK..NEEEELNEE.ABBHH..............",
        "...............BBHCGGGGGNNNNEBB.................",
        "................BCCHCCEEEEEELAB.................",
        ".................CGBBBCKEEGGNG..................",
        ".................CCBAABGECGGNE..................",
        "................CCBBAAABBGGEEN..................",
        "................GBBBBAABCGGGEEK.................",
        "...............EGCBCBBBCGGGGGEE.................",
        "...............GBBCCCCCCGGIGEEEE................",
        "...............CBBCCCCCCCCIGGEKE................",
        "...............CBABCCCCCGCIBGGIG................",
        "...............BBAABBBCBCBCCBCCK................",
        "..............MCBAAAAAAABCBBCGEEP...............",
        "...........ELEIIIICBCCBFCCBENLLEEMJJ............",
        ".............EEGIEEEGEECGLNCBELGLL..............",
        ".............HACCECBGEIEEELECBCIBJ..............",
        "............KHHIGBGICGBEEBEEJGLLKJM.............",
        "............EIHGCCGEEJICEELJJECLJJM.............",
        "...........JHHAHGGGEGJECEIECLLEKGBJJ............",
        "..........H..AHIGBCIBEEKBGEEEBLLLE..J...........",
        ".............CICCGEGEBGECBJLLIALLL..............",
        "............IEGBGBEECBEEEIGLLLJEELM.............",
        "............IBCCGCGCCBENEHAGEELLNEE.............",
        "............ICIIECACGBCNECCIILELELM.............",
        "............ICCCBCCGGGBCGGCJEELIEBE.............",
        "............HBICIGBCGGCEGEAGJCCLLEJ.............",
        "............CHIICCBCGBCEGGBBCCBELLL.............",
        "............IIGCBCCCIHBEEGICCJEACEJ.............",
        "............ICBACGBHIGCIBGEEBEJCABL.............",
        "............ABBBBCBBIGICCIEEGCGGCIK.............",
        ".............CBBBGCBCCGEGCGGEGEEEE..............",
        "..............BBBGGGBBGECKBGEEENEK..............",
        "...............B.GGGCCGGGGBGEE.E................",
        "..................G.CBGEGJ..E...................",
        "......................ENE.......................",
        ".......................G........................",
        "................................................",
        "................................................"
      ]
    }
  ],
  "grid": [
    "................................................",
    "................................................",
    "................................................",
    "................................................",
    "................................................",
    "................................................",
    "............MO...................MM.............",
    "............JO...................JM.............",
    ".............M...................M..............",
    ".............J......EENNLLL......MO.............",
    "............KIKJM..ENNNENLLL..JMMJJ.............",
    "...............KJ.EEEEGGEENLL.JJ................",
    "...............HIGGGCBCBBCEENEKK................",
    "...............BBGGCBADDDAGEENHH................",
    "................GCGCAFFAADFBGLL.................",
    "................CCBBAAHBHIAFCNL.................",
    "................GCAFAAAABKMAAGLJ................",
    "...............EGBDAAAABBHIBDCNL................",
    "...............GCFFAAABAABBHAAGN................",
    "..............HCBDAAAAAAAABHADBEL...............",
    "..............GCBDFAAAAAAAHAADAGN...............",
    "..............HBFDFAAAAABHBAFDFCE...............",
    "..............HBBDFAAAAABBAADDACE...............",
    "..............KBCCBDFAAAAAAFFBBCJ...............",
    "...........LLEBBBBBBBFAADFBBCCBEGLMOM...........",
    "............EIEBBABBBCCDBCCBBBENLLLL............",
    "............ICBCCCCBGCBBBCCCENLECEL.............",
    "............IBHGGEEENIAAAGNNLNEEKKJM............",
    "...........JIHHBBGCEEHBAHIGLEEBKJMMM............",
    "...........KHIHFDHBCBHHIIJOLIBBAHKJMM...........",
    ".........JIKBADFABBBAHHHIMPPJHHADFHKJM..........",
    ".........I..AFAAHHAAAAABHKOOJHHBBFB..K..........",
    "............FDHBIHAAAAAABHHKKKHIHFA.............",
    "............ADHHBHBAAAAAABBBHIHHHFAB............",
    "............AFHBAAAAAAAAAAABHHHIIAFA............",
    "............BFBBBAAAAAAAAABBBBHIAFC.............",
    "............BFABBAAAAAAAAHAAABHHBACK............",
    "............ABAHBAAAAABBBAAABAHHAAA.............",
    "............ABAAHBAAAAAAAAAAABHBABAB............",
    "...........AAABAAHBBAAAAABAABHHAAABA............",
    "...........BBBBBBAHBAAAAAAABHHAAABCH............",
    "............BBBBBBBHHBAAABBHBABBBBB.............",
    "............BBBBBBBBBHHBHHBBBABBBBB.............",
    "...............B.BBBABBBBBBABA.BB.H.............",
    "..................B...BBB...A...................",
    "......................AB........................",
    "................................................",
    "................................................"
  ]
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_sword_s123_32x32"] = {
  label: "✨ proc_sword_s123_32x32 (32×32) [4f]",
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
window.PIXEL_PRESETS["proc_slime_s777_32x32"] = {
  label: "✨ proc_slime_s777_32x32 (32×32) [4f]",
  prompt: "Procedural slime (seed=777, 32x32) — 100% LLM-Free PixelDSL v3.0",
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


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["proc_bunny_s999_32x32"] = {
  label: "✨ proc_bunny_s999_32x32 (32×32) [4f]",
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
window.PIXEL_PRESETS["human_base_mannequin_48x48"] = {
  label: "🧍 Human Base Mannequin 48×48 (Modular Skeleton Rig)",
  prompt: "Generated via CLI: human_base_mannequin_48x48",
  data: {
  "name": "human_base_mannequin_48x48",
  "label": "🧍 Human Base Mannequin 48×48 (Modular Skeleton Rig)",
  "width": 48,
  "height": 48,
  "symmetry": "none",
  "rle": false,
  "palette": {
    ".": "transparent",
    "O": "#261521",
    "S": "#d9a58b",
    "H": "#f7d2be",
    "D": "#b57962",
    "J": "#8c4f3e",
    "e": "#1c0d18",
    "w": "#ffffff",
    "a": "#26152140"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#261521",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": true,
    "selOut": true
  },
  "layers": [
    {
      "id": "shadow",
      "op": "ellipse",
      "cx": 24,
      "cy": 45,
      "rx": 14,
      "ry": 3,
      "fill": "a",
      "z": 0
    },
    {
      "id": "arm_back_upper",
      "op": "uneven_capsule",
      "x1": 20,
      "y1": 17,
      "x2": 17,
      "y2": 24,
      "r1": 2.5,
      "r2": 2.0,
      "fill": "D",
      "outline": "O",
      "z": 1,
      "parent": "torso",
      "pivot": [
        20,
        17
      ],
      "crease": true
    },
    {
      "id": "arm_back_lower",
      "op": "uneven_capsule",
      "x1": 17,
      "y1": 24,
      "x2": 15,
      "y2": 30,
      "r1": 2.0,
      "r2": 1.6,
      "fill": "D",
      "outline": "O",
      "z": 1,
      "parent": "arm_back_upper",
      "pivot": [
        17,
        24
      ],
      "crease": true
    },
    {
      "id": "hand_back",
      "op": "ellipse",
      "cx": 14,
      "cy": 32,
      "rx": 2.0,
      "ry": 2.0,
      "fill": "D",
      "outline": "O",
      "z": 1,
      "parent": "arm_back_lower",
      "pivot": [
        15,
        30
      ]
    },
    {
      "id": "leg_back_upper",
      "op": "uneven_capsule",
      "x1": 22,
      "y1": 27,
      "x2": 20,
      "y2": 35,
      "r1": 3.0,
      "r2": 2.2,
      "fill": "D",
      "outline": "O",
      "z": 2,
      "parent": "pelvis",
      "pivot": [
        22,
        27
      ],
      "crease": true
    },
    {
      "id": "leg_back_lower",
      "op": "uneven_capsule",
      "x1": 20,
      "y1": 35,
      "x2": 19,
      "y2": 42,
      "r1": 2.2,
      "r2": 1.8,
      "fill": "D",
      "outline": "O",
      "z": 2,
      "parent": "leg_back_upper",
      "pivot": [
        20,
        35
      ],
      "crease": true
    },
    {
      "id": "foot_back",
      "op": "rect",
      "x": 16,
      "y": 42,
      "w": 5,
      "h": 3,
      "rx": 1,
      "fill": "D",
      "outline": "O",
      "z": 2,
      "parent": "leg_back_lower",
      "pivot": [
        19,
        42
      ]
    },
    {
      "id": "pelvis",
      "op": "ellipse",
      "cx": 24,
      "cy": 26,
      "rx": 4.5,
      "ry": 3.0,
      "fill": "S",
      "outline": "O",
      "z": 3,
      "parent": "torso",
      "pivot": [
        24,
        26
      ],
      "crease": true
    },
    {
      "id": "torso",
      "op": "ellipse",
      "cx": 24,
      "cy": 20,
      "rx": 5.5,
      "ry": 6.0,
      "fill": "S",
      "outline": "O",
      "z": 3,
      "pivot": [
        24,
        24
      ]
    },
    {
      "id": "chest_contour",
      "op": "line",
      "x1": 22,
      "y1": 19,
      "x2": 26,
      "y2": 19,
      "thickness": 1,
      "color": "D",
      "z": 3,
      "parent": "torso"
    },
    {
      "id": "neck",
      "op": "rect",
      "x": 22,
      "y": 13,
      "w": 4,
      "h": 3,
      "rx": 1,
      "fill": "S",
      "outline": "O",
      "z": 4,
      "parent": "torso",
      "pivot": [
        24,
        15
      ]
    },
    {
      "id": "head",
      "op": "ellipse",
      "cx": 24,
      "cy": 9,
      "rx": 5.0,
      "ry": 5.5,
      "fill": "S",
      "outline": "O",
      "z": 5,
      "parent": "neck",
      "pivot": [
        24,
        13
      ]
    },
    {
      "id": "face_guide",
      "op": "pixels",
      "color": "e",
      "points": [
        [
          22,
          9
        ],
        [
          26,
          9
        ]
      ],
      "z": 5,
      "parent": "head"
    },
    {
      "id": "ear_front",
      "op": "ellipse",
      "cx": 29,
      "cy": 9,
      "rx": 1.2,
      "ry": 2.0,
      "fill": "S",
      "outline": "O",
      "z": 5,
      "parent": "head"
    },
    {
      "id": "leg_front_upper",
      "op": "uneven_capsule",
      "x1": 26,
      "y1": 27,
      "x2": 27,
      "y2": 35,
      "r1": 3.0,
      "r2": 2.2,
      "fill": "S",
      "outline": "O",
      "z": 6,
      "parent": "pelvis",
      "pivot": [
        26,
        27
      ],
      "crease": true
    },
    {
      "id": "leg_front_lower",
      "op": "uneven_capsule",
      "x1": 27,
      "y1": 35,
      "x2": 28,
      "y2": 42,
      "r1": 2.2,
      "r2": 1.8,
      "fill": "S",
      "outline": "O",
      "z": 6,
      "parent": "leg_front_upper",
      "pivot": [
        27,
        35
      ],
      "crease": true
    },
    {
      "id": "foot_front",
      "op": "rect",
      "x": 26,
      "y": 42,
      "w": 6,
      "h": 3,
      "rx": 1,
      "fill": "S",
      "outline": "O",
      "z": 6,
      "parent": "leg_front_lower",
      "pivot": [
        28,
        42
      ]
    },
    {
      "id": "arm_front_upper",
      "op": "uneven_capsule",
      "x1": 28,
      "y1": 17,
      "x2": 31,
      "y2": 24,
      "r1": 2.5,
      "r2": 2.0,
      "fill": "S",
      "outline": "O",
      "z": 7,
      "parent": "torso",
      "pivot": [
        28,
        17
      ],
      "crease": true
    },
    {
      "id": "arm_front_lower",
      "op": "uneven_capsule",
      "x1": 31,
      "y1": 24,
      "x2": 33,
      "y2": 30,
      "r1": 2.0,
      "r2": 1.6,
      "fill": "S",
      "outline": "O",
      "z": 7,
      "parent": "arm_front_upper",
      "pivot": [
        31,
        24
      ],
      "crease": true
    },
    {
      "id": "hand_front",
      "op": "ellipse",
      "cx": 34,
      "cy": 32,
      "rx": 2.0,
      "ry": 2.0,
      "fill": "S",
      "outline": "O",
      "z": 7,
      "parent": "arm_front_lower",
      "pivot": [
        33,
        30
      ]
    }
  ],
  "frames": [
    {
      "layers": {
        "torso": {
          "dy": 1
        },
        "head": {
          "dy": 1
        },
        "neck": {
          "dy": 1
        },
        "arm_front_upper": {
          "dAngle": 4
        },
        "arm_back_upper": {
          "dAngle": -4
        }
      }
    },
    {
      "layers": {
        "torso": {
          "dy": 0
        },
        "head": {
          "dy": 0
        },
        "neck": {
          "dy": 0
        },
        "arm_front_upper": {
          "dAngle": 0
        },
        "arm_back_upper": {
          "dAngle": 0
        }
      }
    },
    {
      "layers": {
        "torso": {
          "dy": -1
        },
        "head": {
          "dy": -1
        },
        "neck": {
          "dy": -1
        },
        "arm_front_upper": {
          "dAngle": -4
        },
        "arm_back_upper": {
          "dAngle": 4
        }
      }
    }
  ],
  "grid": []
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["human_knight_equipped_48x48"] = {
  label: "🛡️ Human Knight Equipped 48×48 (Modular Armor on Skeleton)",
  prompt: "Generated via CLI: human_knight_equipped_48x48",
  data: {
  "name": "human_knight_equipped_48x48",
  "label": "🛡️ Human Knight Equipped 48×48 (Modular Armor on Skeleton)",
  "width": 48,
  "height": 48,
  "symmetry": "none",
  "rle": false,
  "palette": {
    ".": "transparent",
    "O": "#1c1424",
    "S": "#d9a58b",
    "D": "#b57962",
    "e": "#100c17",
    "b": "#637894",
    "B": "#8fa8c7",
    "m": "#415069",
    "g": "#e5aa3c",
    "G": "#fed466",
    "r": "#c93c3c",
    "d": "#422822",
    "w": "#f0f4fc",
    "a": "#1c142440"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#1c1424",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": true,
    "selOut": true
  },
  "layers": [
    {
      "id": "shadow",
      "op": "ellipse",
      "cx": 24,
      "cy": 45,
      "rx": 14,
      "ry": 3,
      "fill": "a",
      "z": 0
    },
    {
      "id": "arm_back_upper",
      "op": "uneven_capsule",
      "x1": 20,
      "y1": 17,
      "x2": 17,
      "y2": 24,
      "r1": 2.5,
      "r2": 2,
      "fill": "m",
      "outline": "O",
      "z": 1,
      "parent": "torso",
      "pivot": [
        20,
        17
      ]
    },
    {
      "id": "arm_back_lower",
      "op": "uneven_capsule",
      "x1": 17,
      "y1": 24,
      "x2": 15,
      "y2": 30,
      "r1": 2,
      "r2": 1.6,
      "fill": "b",
      "outline": "O",
      "z": 1,
      "parent": "arm_back_upper",
      "pivot": [
        17,
        24
      ]
    },
    {
      "id": "hand_back",
      "op": "ellipse",
      "cx": 14,
      "cy": 32,
      "rx": 2,
      "ry": 2,
      "fill": "d",
      "outline": "O",
      "z": 1,
      "parent": "arm_back_lower",
      "pivot": [
        15,
        30
      ]
    },
    {
      "id": "leg_back_upper",
      "op": "uneven_capsule",
      "x1": 22,
      "y1": 27,
      "x2": 20,
      "y2": 35,
      "r1": 3,
      "r2": 2.2,
      "fill": "m",
      "outline": "O",
      "z": 2,
      "parent": "pelvis",
      "pivot": [
        22,
        27
      ]
    },
    {
      "id": "leg_back_lower",
      "op": "uneven_capsule",
      "x1": 20,
      "y1": 35,
      "x2": 19,
      "y2": 42,
      "r1": 2.2,
      "r2": 1.8,
      "fill": "b",
      "outline": "O",
      "z": 2,
      "parent": "leg_back_upper",
      "pivot": [
        20,
        35
      ]
    },
    {
      "id": "boot_back",
      "op": "rect",
      "x": 16,
      "y": 40,
      "w": 6,
      "h": 5,
      "rx": 1,
      "fill": "d",
      "outline": "O",
      "z": 2,
      "parent": "leg_back_lower",
      "pivot": [
        19,
        42
      ]
    },
    {
      "id": "pelvis",
      "op": "ellipse",
      "cx": 24,
      "cy": 26,
      "rx": 5,
      "ry": 3.2,
      "fill": "m",
      "outline": "O",
      "z": 3,
      "parent": "torso",
      "pivot": [
        24,
        26
      ]
    },
    {
      "id": "belt",
      "op": "rect",
      "x": 19,
      "y": 24,
      "w": 10,
      "h": 2,
      "fill": "g",
      "outline": "O",
      "z": 4,
      "parent": "torso"
    },
    {
      "id": "torso",
      "op": "ellipse",
      "cx": 24,
      "cy": 20,
      "rx": 6,
      "ry": 6.5,
      "fill": "b",
      "outline": "O",
      "z": 3,
      "pivot": [
        24,
        24
      ]
    },
    {
      "id": "breastplate_trim",
      "op": "line",
      "x1": 24,
      "y1": 15,
      "x2": 24,
      "y2": 24,
      "thickness": 1,
      "color": "g",
      "z": 4,
      "parent": "torso"
    },
    {
      "id": "neck",
      "op": "rect",
      "x": 22,
      "y": 13,
      "w": 4,
      "h": 3,
      "rx": 1,
      "fill": "m",
      "outline": "O",
      "z": 4,
      "parent": "torso",
      "pivot": [
        24,
        15
      ]
    },
    {
      "id": "head",
      "op": "ellipse",
      "cx": 24,
      "cy": 9,
      "rx": 5.5,
      "ry": 6,
      "fill": "b",
      "outline": "O",
      "z": 5,
      "parent": "neck",
      "pivot": [
        24,
        13
      ]
    },
    {
      "id": "helmet_visor",
      "op": "rect",
      "x": 21,
      "y": 8,
      "w": 8,
      "h": 3,
      "fill": "e",
      "outline": "O",
      "z": 6,
      "parent": "head"
    },
    {
      "id": "helmet_plume",
      "op": "vesica",
      "cx": 24,
      "cy": 4.5,
      "r": 3.8,
      "d": 2,
      "angle": 15,
      "fill": "r",
      "outline": "O",
      "z": 7,
      "parent": "head"
    },
    {
      "id": "leg_front_upper",
      "op": "uneven_capsule",
      "x1": 26,
      "y1": 27,
      "x2": 27,
      "y2": 35,
      "r1": 3,
      "r2": 2.2,
      "fill": "b",
      "outline": "O",
      "z": 6,
      "parent": "pelvis",
      "pivot": [
        26,
        27
      ]
    },
    {
      "id": "leg_front_lower",
      "op": "uneven_capsule",
      "x1": 27,
      "y1": 35,
      "x2": 28,
      "y2": 42,
      "r1": 2.2,
      "r2": 1.8,
      "fill": "b",
      "outline": "O",
      "z": 6,
      "parent": "leg_front_upper",
      "pivot": [
        27,
        35
      ]
    },
    {
      "id": "boot_front",
      "op": "rect",
      "x": 25,
      "y": 40,
      "w": 7,
      "h": 5,
      "rx": 1,
      "fill": "d",
      "outline": "O",
      "z": 7,
      "parent": "leg_front_lower",
      "pivot": [
        28,
        42
      ]
    },
    {
      "id": "pauldron_front",
      "op": "ellipse",
      "cx": 28,
      "cy": 16,
      "rx": 3.8,
      "ry": 3.2,
      "fill": "g",
      "outline": "O",
      "z": 8,
      "parent": "torso",
      "pivot": [
        28,
        17
      ]
    },
    {
      "id": "arm_front_upper",
      "op": "uneven_capsule",
      "x1": 28,
      "y1": 17,
      "x2": 31,
      "y2": 24,
      "r1": 2.5,
      "r2": 2,
      "fill": "b",
      "outline": "O",
      "z": 7,
      "parent": "torso",
      "pivot": [
        28,
        17
      ]
    },
    {
      "id": "arm_front_lower",
      "op": "uneven_capsule",
      "x1": 31,
      "y1": 24,
      "x2": 33,
      "y2": 30,
      "r1": 2,
      "r2": 1.6,
      "fill": "b",
      "outline": "O",
      "z": 7,
      "parent": "arm_front_upper",
      "pivot": [
        31,
        24
      ]
    },
    {
      "id": "hand_front",
      "op": "ellipse",
      "cx": 34,
      "cy": 32,
      "rx": 2.2,
      "ry": 2.2,
      "fill": "d",
      "outline": "O",
      "z": 8,
      "parent": "arm_front_lower",
      "pivot": [
        33,
        30
      ]
    },
    {
      "id": "sword_blade",
      "op": "uneven_capsule",
      "x1": 34,
      "y1": 30,
      "x2": 39,
      "y2": 10,
      "r1": 1.8,
      "r2": 1,
      "fill": "w",
      "outline": "O",
      "z": 9,
      "parent": "hand_front"
    },
    {
      "id": "sword_guard",
      "op": "rect",
      "x": 31,
      "y": 28,
      "w": 6,
      "h": 2,
      "rx": 1,
      "fill": "g",
      "outline": "O",
      "z": 10,
      "parent": "hand_front"
    }
  ],
  "frames": [
    {
      "layers": {
        "torso": {
          "dy": 1
        },
        "head": {
          "dy": 1
        },
        "neck": {
          "dy": 1
        },
        "arm_front_upper": {
          "dAngle": 4
        },
        "arm_back_upper": {
          "dAngle": -4
        }
      }
    },
    {
      "layers": {
        "torso": {
          "dy": 0
        },
        "head": {
          "dy": 0
        },
        "neck": {
          "dy": 0
        },
        "arm_front_upper": {
          "dAngle": 0
        },
        "arm_back_upper": {
          "dAngle": 0
        }
      }
    },
    {
      "layers": {
        "torso": {
          "dy": -1
        },
        "head": {
          "dy": -1
        },
        "neck": {
          "dy": -1
        },
        "arm_front_upper": {
          "dAngle": -4
        },
        "arm_back_upper": {
          "dAngle": 4
        }
      }
    }
  ],
  "grid": []
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["human_walk_mannequin_48x48"] = {
  label: "🚶 Human Walk Mannequin 48×48 (6-Frame Walk Right)",
  prompt: "Generated via CLI: human_walk_mannequin_48x48",
  data: {
  "name": "human_walk_mannequin_48x48",
  "label": "🚶 Human Walk Mannequin 48×48 (6-Frame Walk Right)",
  "width": 48,
  "height": 48,
  "symmetry": "none",
  "rle": false,
  "palette": {
    ".": "transparent",
    "O": "#261521",
    "S": "#d9a58b",
    "H": "#f7d2be",
    "D": "#b57962",
    "J": "#8c4f3e",
    "e": "#1c0d18",
    "w": "#ffffff",
    "a": "#26152140"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#261521",
    "autoShading": false,
    "shadingStrength": 0.16,
    "sdfShading": true,
    "selOut": true
  },
  "layers": [
    {
      "id": "shadow",
      "op": "ellipse",
      "cx": 24,
      "cy": 45,
      "rx": 13,
      "ry": 2.5,
      "fill": "a",
      "z": 0
    },
    {
      "id": "arm_back_upper",
      "op": "uneven_capsule",
      "x1": 20,
      "y1": 17,
      "x2": 17,
      "y2": 24,
      "r1": 2.5,
      "r2": 2.0,
      "angle": -18,
      "fill": "D",
      "outline": "O",
      "z": 1,
      "parent": "torso",
      "pivot": [
        20,
        17
      ],
      "crease": true
    },
    {
      "id": "arm_back_lower",
      "op": "uneven_capsule",
      "x1": 17,
      "y1": 24,
      "x2": 15,
      "y2": 30,
      "r1": 2.0,
      "r2": 1.6,
      "angle": -14,
      "fill": "D",
      "outline": "O",
      "z": 1,
      "parent": "arm_back_upper",
      "pivot": [
        17,
        24
      ],
      "crease": true
    },
    {
      "id": "hand_back",
      "op": "ellipse",
      "cx": 14,
      "cy": 32,
      "rx": 2.0,
      "ry": 2.0,
      "fill": "D",
      "outline": "O",
      "z": 1,
      "parent": "arm_back_lower",
      "pivot": [
        15,
        30
      ]
    },
    {
      "id": "leg_back_upper",
      "op": "uneven_capsule",
      "x1": 22,
      "y1": 27,
      "x2": 20,
      "y2": 35,
      "r1": 3.0,
      "r2": 2.2,
      "angle": 16,
      "fill": "D",
      "outline": "O",
      "z": 2,
      "parent": "pelvis",
      "pivot": [
        22,
        27
      ],
      "crease": true
    },
    {
      "id": "leg_back_lower",
      "op": "uneven_capsule",
      "x1": 20,
      "y1": 35,
      "x2": 19,
      "y2": 42,
      "r1": 2.2,
      "r2": 1.8,
      "angle": 18,
      "fill": "D",
      "outline": "O",
      "z": 2,
      "parent": "leg_back_upper",
      "pivot": [
        20,
        35
      ],
      "crease": true
    },
    {
      "id": "foot_back",
      "op": "rect",
      "x": 16,
      "y": 42,
      "w": 5,
      "h": 3,
      "rx": 1,
      "angle": 14,
      "fill": "D",
      "outline": "O",
      "z": 2,
      "parent": "leg_back_lower",
      "pivot": [
        19,
        42
      ]
    },
    {
      "id": "pelvis",
      "op": "ellipse",
      "cx": 24,
      "cy": 26,
      "rx": 4.5,
      "ry": 3.0,
      "fill": "S",
      "outline": "O",
      "z": 3,
      "parent": "torso",
      "pivot": [
        24,
        26
      ],
      "crease": true
    },
    {
      "id": "torso",
      "op": "ellipse",
      "cx": 24,
      "cy": 20,
      "rx": 5.5,
      "ry": 6.0,
      "angle": -2,
      "fill": "S",
      "outline": "O",
      "z": 3,
      "pivot": [
        24,
        24
      ]
    },
    {
      "id": "neck",
      "op": "rect",
      "x": 22,
      "y": 13,
      "w": 4,
      "h": 3,
      "rx": 1,
      "fill": "S",
      "outline": "O",
      "z": 4,
      "parent": "torso",
      "pivot": [
        24,
        15
      ]
    },
    {
      "id": "head",
      "op": "ellipse",
      "cx": 24,
      "cy": 9,
      "rx": 5.0,
      "ry": 5.5,
      "fill": "S",
      "outline": "O",
      "z": 5,
      "parent": "neck",
      "pivot": [
        24,
        13
      ]
    },
    {
      "id": "face_guide",
      "op": "pixels",
      "color": "e",
      "points": [
        [
          23,
          9
        ],
        [
          27,
          9
        ]
      ],
      "z": 5,
      "parent": "head"
    },
    {
      "id": "leg_front_upper",
      "op": "uneven_capsule",
      "x1": 26,
      "y1": 27,
      "x2": 27,
      "y2": 35,
      "r1": 3.0,
      "r2": 2.2,
      "angle": -18,
      "fill": "S",
      "outline": "O",
      "z": 6,
      "parent": "pelvis",
      "pivot": [
        26,
        27
      ],
      "crease": true
    },
    {
      "id": "leg_front_lower",
      "op": "uneven_capsule",
      "x1": 27,
      "y1": 35,
      "x2": 28,
      "y2": 42,
      "r1": 2.2,
      "r2": 1.8,
      "angle": 6,
      "fill": "S",
      "outline": "O",
      "z": 6,
      "parent": "leg_front_upper",
      "pivot": [
        27,
        35
      ],
      "crease": true
    },
    {
      "id": "foot_front",
      "op": "rect",
      "x": 26,
      "y": 42,
      "w": 6,
      "h": 3,
      "rx": 1,
      "angle": -8,
      "fill": "S",
      "outline": "O",
      "z": 6,
      "parent": "leg_front_lower",
      "pivot": [
        28,
        42
      ]
    },
    {
      "id": "arm_front_upper",
      "op": "uneven_capsule",
      "x1": 28,
      "y1": 17,
      "x2": 31,
      "y2": 24,
      "r1": 2.5,
      "r2": 2.0,
      "angle": 16,
      "fill": "S",
      "outline": "O",
      "z": 7,
      "parent": "torso",
      "pivot": [
        28,
        17
      ],
      "crease": true
    },
    {
      "id": "arm_front_lower",
      "op": "uneven_capsule",
      "x1": 31,
      "y1": 24,
      "x2": 33,
      "y2": 30,
      "r1": 2.0,
      "r2": 1.6,
      "angle": 8,
      "fill": "S",
      "outline": "O",
      "z": 7,
      "parent": "arm_front_upper",
      "pivot": [
        31,
        24
      ],
      "crease": true
    },
    {
      "id": "hand_front",
      "op": "ellipse",
      "cx": 34,
      "cy": 32,
      "rx": 2.0,
      "ry": 2.0,
      "fill": "S",
      "outline": "O",
      "z": 7,
      "parent": "arm_front_lower",
      "pivot": [
        33,
        30
      ]
    }
  ],
  "frames": [
    {
      "layers": {
        "torso": {
          "dy": 1,
          "dAngle": -1
        },
        "head": {
          "dy": 1
        },
        "leg_front_upper": {
          "dAngle": 10
        },
        "leg_front_lower": {
          "dAngle": 6
        },
        "foot_front": {
          "dAngle": 8
        },
        "leg_back_upper": {
          "dAngle": -6
        },
        "leg_back_lower": {
          "dAngle": 10
        },
        "foot_back": {
          "dAngle": 4
        },
        "arm_front_upper": {
          "dAngle": -8
        },
        "arm_front_lower": {
          "dAngle": -4
        },
        "arm_back_upper": {
          "dAngle": 10
        },
        "arm_back_lower": {
          "dAngle": 8
        },
        "shadow": {
          "drx": 0
        }
      }
    },
    {
      "layers": {
        "torso": {
          "dy": -1
        },
        "head": {
          "dy": -1
        },
        "leg_front_upper": {
          "dAngle": 20
        },
        "leg_front_lower": {
          "dAngle": -6
        },
        "foot_front": {
          "dAngle": 8
        },
        "leg_back_upper": {
          "dAngle": -28
        },
        "leg_back_lower": {
          "dAngle": 6
        },
        "foot_back": {
          "dAngle": -8
        },
        "arm_front_upper": {
          "dAngle": -24
        },
        "arm_front_lower": {
          "dAngle": -12
        },
        "arm_back_upper": {
          "dAngle": 26
        },
        "arm_back_lower": {
          "dAngle": 18
        },
        "shadow": {
          "drx": -1
        }
      }
    },
    {
      "layers": {
        "torso": {
          "dy": 0
        },
        "head": {
          "dy": 0
        },
        "leg_front_upper": {
          "dAngle": 34
        },
        "leg_front_lower": {
          "dAngle": 12
        },
        "foot_front": {
          "dAngle": 22
        },
        "leg_back_upper": {
          "dAngle": -34
        },
        "leg_back_lower": {
          "dAngle": -12
        },
        "foot_back": {
          "dAngle": -22
        },
        "arm_front_upper": {
          "dAngle": -34
        },
        "arm_front_lower": {
          "dAngle": -22
        },
        "arm_back_upper": {
          "dAngle": 34
        },
        "arm_back_lower": {
          "dAngle": 22
        },
        "shadow": {
          "drx": 1
        }
      }
    },
    {
      "layers": {
        "torso": {
          "dy": 1,
          "dAngle": -1
        },
        "head": {
          "dy": 1
        },
        "leg_front_upper": {
          "dAngle": 28
        },
        "leg_front_lower": {
          "dAngle": 22
        },
        "foot_front": {
          "dAngle": 26
        },
        "leg_back_upper": {
          "dAngle": -24
        },
        "leg_back_lower": {
          "dAngle": -6
        },
        "foot_back": {
          "dAngle": -14
        },
        "arm_front_upper": {
          "dAngle": -24
        },
        "arm_front_lower": {
          "dAngle": -14
        },
        "arm_back_upper": {
          "dAngle": 26
        },
        "arm_back_lower": {
          "dAngle": 14
        },
        "shadow": {
          "drx": 0
        }
      }
    },
    {
      "layers": {
        "torso": {
          "dy": -1
        },
        "head": {
          "dy": -1
        },
        "leg_front_upper": {
          "dAngle": 6
        },
        "leg_front_lower": {
          "dAngle": 18
        },
        "foot_front": {
          "dAngle": 14
        },
        "leg_back_upper": {
          "dAngle": -14
        },
        "leg_back_lower": {
          "dAngle": -18
        },
        "foot_back": {
          "dAngle": -14
        },
        "arm_front_upper": {
          "dAngle": -8
        },
        "arm_front_lower": {
          "dAngle": -4
        },
        "arm_back_upper": {
          "dAngle": 8
        },
        "arm_back_lower": {
          "dAngle": 4
        },
        "shadow": {
          "drx": -1
        }
      }
    }
  ],
  "grid": []
}
};


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["chibi_walk_right_32x36"] = {
  label: "🚶 Chibi Walk Right Mannequin (32×36) [4f]",
  prompt: "Generated via CLI: chibi_walk_right_32x36",
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


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["chibi_base_mannequin_32x36"] = {
  label: "🧍 Chibi Base Mannequin Front (32×36) [8f]",
  prompt: "Generated via CLI: chibi_base_mannequin_32x36",
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


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["chibi_clothed_example_32x36"] = {
  label: "⚔️ Chibi Adventurer Clothed Example (32×36) [8f]",
  prompt: "Generated via CLI: chibi_clothed_example_32x36",
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
window.PIXEL_PRESETS["chibi_hero_rig_32x36"] = {
  label: "🦴 Chibi Adventurer Rig (32×36) [5f]",
  prompt: "Generated via CLI: chibi_hero_rig_32x36",
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


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["quadruped_wolf_rig_32x32"] = {
  label: "🐺 Galloping Wolf Rig (32×32) [5f]",
  prompt: "Generated via CLI: quadruped_wolf_rig_32x32",
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


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["magic_portal_orb_32x32"] = {
  label: "🌀 Magic Portal Orb GLSL Shader (32×32) [8f]",
  prompt: "Generated via CLI: magic_portal_orb_32x32",
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


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["fire_elemental_32x32"] = {
  label: "🔥 Fire Elemental GLSL Shader (32×32) [8f]",
  prompt: "Generated via CLI: fire_elemental_32x32",
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


// Auto-synced by pixeldsl.py CLI
window.PIXEL_PRESETS["ginger_cat_walk_120x80"] = {
  label: "🐱 Ginger Cat Walk Cycle (120×80) [12f]",
  prompt: "Generated via CLI: ginger_cat_walk_120x80",
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
          0.0,
          0.0
        ],
        "length": 6.0,
        "angle": 32.0,
        "r1": 10.5,
        "r2": 11.5,
        "shape": "head_oval",
        "fill": "O",
        "z": 6.0,
        "features": {
          "eyes": {
            "dx": 3.2,
            "dy": -1.5,
            "w": 3.2,
            "h": 4.2,
            "color": "#25b854"
          }
        }
      },
      {
        "id": "muzzle",
        "parent": "head",
        "offset": [
          2.5,
          3.2
        ],
        "length": 0.0,
        "angle": 0.0,
        "r1": 4.5,
        "r2": 4.5,
        "shape": "head_oval",
        "fill": "W",
        "z": 6.5
      },
      {
        "id": "nose",
        "parent": "muzzle",
        "offset": [
          2.8,
          -1.0
        ],
        "length": 0.0,
        "angle": 0.0,
        "r1": 1.5,
        "r2": 1.3,
        "shape": "head_oval",
        "fill": "P",
        "z": 7.0
      },
      {
        "id": "ear_front",
        "parent": "head",
        "offset": [
          0.0,
          -7.5
        ],
        "length": 9.0,
        "angle": -68.0,
        "r1": 4.8,
        "r2": 1.0,
        "fill": "O",
        "z": 7.0
      },
      {
        "id": "ear_front_inner",
        "parent": "head",
        "offset": [
          0.8,
          -6.5
        ],
        "length": 6.5,
        "angle": -68.0,
        "r1": 2.5,
        "r2": 0.8,
        "fill": "P",
        "z": 7.5
      },
      {
        "id": "ear_back",
        "parent": "head",
        "offset": [
          -4.0,
          -7.0
        ],
        "length": 8.5,
        "angle": -76.0,
        "r1": 4.0,
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
