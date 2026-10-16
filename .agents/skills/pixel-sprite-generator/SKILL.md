---
name: pixel-sprite-generator
description: >-
  Generates 2D pixel art sprites and animated sprite sheets (from 8x8 to 128x128 pixels)
  using the PixelDSL v2 JSON specification and compiles them via pixeldsl.py into PNGs
  and the Web Studio (index.html). Activate this skill whenever the user asks to generate,
  design, animate, or edit a 2D pixel sprite, icon, tile, or asset.
---

# Pixel Sprite Generator v2 (`PixelDSL` + `pixeldsl.py` CLI)

This skill translates natural-language sprite requests (e.g., *"32x32 top-down turtle sprite"*) into deterministic **PixelDSL v2 JSON** code and compiles it via [pixeldsl.py](file:///c:/DEEEEV/Generated%20Asset/pixeldsl.py) into ready-to-use `.png` assets and `.json` files synced with the Web Studio ([index.html](file:///c:/DEEEEV/Generated%20Asset/index.html)).

---

## 1. Quick Start for Blind Generation from Any LLM CLI

After generating the sprite JSON, run [pixeldsl.py](file:///c:/DEEEEV/Generated%20Asset/pixeldsl.py):

```bash
# Option 1: Pass a JSON file path
python pixeldsl.py sprites/my_sprite.json

# Option 2: Pipe JSON directly via stdin
python pixeldsl.py - << 'EOF'
{ ... }
EOF
```

### What `pixeldsl.py` Does Automatically:
1. Saves the canonical JSON source to `sprites/<name>.json`.
2. Renders `game_ready/<name>.png` (exact `1:1` resolution from `8x8` to `128x128`), `game_ready/<name>_preview.png` (upscaled crisp preview), and `game_ready/<name>_sheet.png` (horizontal Sprite Sheet when `frames` are defined).
3. Registers the sprite in [presets.js](file:///c:/DEEEEV/Generated%20Asset/presets.js) so opening [index.html](file:///c:/DEEEEV/Generated%20Asset/index.html) immediately displays it in the Web Studio.
4. Prints a **Self-Diagnostics Report** (`Canvas Fill %`, `Bounding Box`, `Center Offset`, `Edge Clipping Check`) plus a **TrueColor ANSI terminal preview** using `▀` half-blocks.
   - **Self-Correction Rule for AI Agents:** If the CLI report warns `[!] WARNING: Silhouette touches canvas edges` or fill is `< 10%`, adjust coordinates/radii and re-run the script.

---

## 2. Selecting the Generation Mode by Canvas Size (`8x8` – `128x128`)

| Canvas Size | Recommended Mode | Rationale |
| :--- | :--- | :--- |
| **8×8, 16×16, 24×24** | **Mode A: Symbolic Matrix (`grid`)** | Every pixel is encoded as a single ASCII character per row. Easy to keep exact proportions. |
| **32×32** | **Mode A (`grid`)** or **Mode B (`layers` + `stamp`)** | Use `grid` for static icons/creatures, or `layers` + `frames` for animated multi-frame sprites. |
| **48×48, 64×64, 96×96, 128×128** | **Mode B: Hybrid (`layers` + `stamp` + `frames`)** | Never write raw 64×64 or 128×128 character grids row-by-row. Build the silhouette with integer primitives (`ellipse`, `polygon`, `rect`, `line`, `curve`) and add fine details via `stamp` and `pixels`. |

---

## 3. PixelDSL v2 JSON Schema

```json
{
  "name": "turtle_topdown_32x32",
  "width": 32,
  "height": 32,
  "symmetry": "none",
  "rle": false,
  "palettePreset": "",
  "ramps": {
    "S": { "base": "#3a8754", "light": "l", "dark": "B", "outline": "O" }
  },
  "palette": {
    ".": "transparent",
    "O": "#14182e",
    "h": "#58b878",
    "Y": "#d9a05b",
    "e": "#0e101c",
    "w": "#ffffff",
    "a": "#14182e44"
  },
  "postProcess": {
    "autoOutline": false,
    "outlineColor": "#14182e",
    "autoShading": true,
    "shadingStrength": 0.15
  },
  "layers": [],
  "frames": [],
  "grid": []
}
```

### Color & Palette Rules (`palette`, `ramps`, `palettePreset`)
- `.` is always fully transparent (`transparent`).
- **Auto Color Ramps (`ramps`):** Provide a single base HEX color for a material:
  `"ramps": { "S": { "base": "#3a8754", "light": "l", "dark": "B", "outline": "O" } }`
  The engine automatically generates a warm-shifted highlight (`l`), a cool-shifted shadow (`B`), and a deep tinted outline (`O`).
- **Built-in Retro Palettes (`palettePreset`):** `"endesga32"`, `"pico8"`, `"gameboy"`.
- Semi-transparent colors use 8-digit HEX (`#RRGGBBAA`, e.g., `#14182e44` for soft drop shadows, glass, or glowing auras).

---

## 4. Named Layers (`layers`) and Multi-Frame Animation (`frames`)

Assign a descriptive `"id"` to each layer (`"head"`, `"flipper_front"`, `"shell"`, `"tail"`):

- `ellipse`: `{ "id": "flipper_front", "op": "ellipse", "cx": 6, "cy": 11, "rx": 6, "ry": 3, "angle": -32, "fill": "h", "outline": "O", "dither": "none|checker|sparse|scales|grid", "ditherColor": "B", "mirror": "none|x|y|quad" }`
- `rect`: `{ "id": "box", "op": "rect", "x": 10, "y": 8, "w": 12, "h": 16, "rx": 2, "fill": "S", "outline": "O", "mirror": "none|x" }`
- `polygon`: `{ "id": "tail", "op": "polygon", "points": [[14,26],[18,26],[16,31]], "fill": "S", "outline": "O", "mirror": "none|x" }`
- `line`: `{ "id": "ridge", "op": "line", "x1": 16, "y1": 7, "x2": 16, "y2": 26, "thickness": 1, "color": "B", "mirror": "none|x" }`
- `curve`: `{ "id": "leg", "op": "curve", "points": [[21,22],[10,16],[5,9]], "thickness": 2, "color": "O", "mirror": "x" }`
- `stamp`: `{ "id": "eyes", "op": "stamp", "x": 12, "y": 3, "grid": ["ew....we", "e......e"] }`
- `pixels`: `{ "id": "glint", "op": "pixels", "color": "w", "points": [[13,3],[18,3]] }`

### Frame Deltas (`frames`) for Sprite Sheets
To animate a sprite (e.g., swimming flippers or walking legs), define per-layer delta overrides (`dx`, `dy`, `dAngle`, `drx`, `dry`, `hidden`) in `"frames"`:

```json
"frames": [
  {
    "layers": {
      "flipper_front": { "dAngle": 18, "dy": -1 },
      "flipper_back": { "dAngle": -14, "dy": 1 },
      "tail": { "dx": -1 }
    }
  },
  {
    "layers": {
      "flipper_front": { "dAngle": -18, "dy": 2 },
      "flipper_back": { "dAngle": 14, "dy": -1 },
      "tail": { "dx": 1 }
    }
  }
]
```
