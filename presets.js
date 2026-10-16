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
        { "id": "slime_core", "op": "ellipse", "cx": 24, "cy": 27, "rx": 14, "ry": 12, "fill": "G", "outline": "O", "sdf": true, "smoothBlend": 3.5 },
        { "id": "slime_lobes", "op": "ellipse", "cx": 12, "cy": 33, "rx": 7, "ry": 6, "fill": "G", "outline": "O", "mirror": "x", "sdf": true, "smoothBlend": 3.5 },
        { "id": "slime_top", "op": "ellipse", "cx": 24, "cy": 18, "rx": 9, "ry": 6, "fill": "G", "outline": "O", "sdf": true, "smoothBlend": 3.0 },
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

window.SKILL_PROMPT_TEMPLATE = function(userRequest, width, height, mode) {
  const isGridPreferred = (mode === "grid") || (mode === "auto" && width <= 32 && height <= 32);
  const modeInstructions = isGridPreferred
    ? `MODE: Symbolic Pixel Matrix ("grid").
- The "grid" array must contain exactly ${height} strings.
- Each string must contain exactly ${width} single-character keys from "palette" (where "." is transparent).
- Count characters in every row carefully (strictly ${width} chars per row).`
    : `MODE: Hybrid Procedural & SDF Pixel Layers ("layers" + "stamp" + optional "frames").
- Canvas size: ${width}x${height} pixels.
- Build the silhouette in "layers" using integer primitives with an "id" field:
  * { "id": "body", "op": "ellipse", "cx": X, "cy": Y, "rx": RX, "ry": RY, "angle": 0, "fill": "S", "outline": "O", "sdf": true, "smoothBlend": 2.5, "dither": "none|checker|sparse|scales", "ditherColor": "B", "mirror": "none|x|y|quad" }
  * { "id": "box", "op": "rect", "x": X, "y": Y, "w": W, "h": H, "rx": 1, "fill": "S", "outline": "O", "sdf": true, "smoothBlend": 0, "mirror": "none|x" }
  * { "id": "tail", "op": "polygon", "points": [[x1,y1],[x2,y2],[x3,y3]], "fill": "S", "outline": "O", "sdf": true, "mirror": "none|x" }
  * { "id": "seam", "op": "line", "x1": X1, "y1": Y1, "x2": X2, "y2": Y2, "thickness": 1, "color": "O", "mirror": "none|x" }
  * { "id": "leg", "op": "curve", "points": [[x1,y1],[cx,cy],[x2,y2]], "thickness": 1, "color": "O", "mirror": "none|x" }
  * { "id": "eyes", "op": "stamp", "x": X, "y": Y, "grid": ["..ee..", ".ewwe."] }
  * { "id": "glint", "op": "pixels", "color": "w", "points": [[x,y]] }
- SDF METABALLS & 3D VOLUME SHADING:
  * Set "smoothBlend": 2.0..5.0 on consecutive shape layers sharing the same "fill" to smoothly fuse them via polynomial SDF smooth-min (metaballs) with a single unified pixel outline!
  * Set "sdf": true on a layer (or "postProcess": { "sdfShading": true } globally) to automatically compute 3D spherical heightmap normals, quantized 5-band pixel-art tones, and Bayer 2x2 ordered dithering.
- Use "mirror": "x" for symmetrical limbs/wings/details.
- For animations, add "frames": [{ "layers": { "leg": { "dx": 0, "dy": -1, "dAngle": 15 } } }].`;

  return `You are a 2D pixel-art asset generator following the PixelDSL v2.5 specification (SKILL.md).
Convert the user request into a valid JSON sprite definition without any surrounding explanation (JSON only).

USER REQUEST: "${userRequest}"
TARGET CANVAS SIZE: ${width}x${height} pixels (coordinate range X: 0..${width - 1}, Y: 0..${height - 1}).

${modeInstructions}

PALETTE, AUTO-RAMPS ("ramps"), AND COMPOSITION RULES:
1. "." is always "transparent".
2. You may specify "palettePreset": "endesga32" | "pico8" | "gameboy" OR define auto tonal ramps in "ramps":
   "ramps": { "S": { "base": "#3e8948", "light": "L", "dark": "B", "outline": "O" } } — the engine will automatically generate highlight "L", shadow "B", and outline "O".
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
    "sdfShading": false
  },
  "layers": [],
  "frames": [],
  "grid": []
}`;
};
