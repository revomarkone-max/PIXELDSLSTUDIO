# PixelDSL Studio (`8×8` – `128×128`)

[![License: MIT](https://img.shields.io/badge/Code_License-MIT-blue.svg)](./LICENSE)
[![Assets: CC0-1.0](https://img.shields.io/badge/Generated_Assets-CC0_1.0_Public_Domain-brightgreen.svg)](https://creativecommons.org/publicdomain/zero/1.0/)

**PixelDSL Studio** is a hybrid **AI-friendly + Human-friendly 2D Pixel-Art Asset Generator and Editor**. It bridges Large Language Models (LLMs) and pixel-art creation by translating natural-language prompts (e.g., *"32x32 pixel art turtle sprite, top-down view"*) into deterministic **PixelDSL JSON** code and compiling it into crisp, game-ready `.png` sprites and animated sprite sheets.

---

## ✨ Key Features

- **Dual Encoding Modes (`8×8` to `128×128`)**:
  - **Symbolic Matrix (`grid`)**: Direct character-per-pixel encoding (ideal for `8×8`, `16×16`, `24×24`, `32×32`) with optional RLE compression (`rle: true`) and auto row-padding.
  - **Procedural & SDF Pixel Layers (`layers` + `stamp`)**: Integer-rasterized Bresenham primitives (`ellipse` with rotation & dithering, `rect`, `polygon`, `line`, `curve`, `stamp`, `pixels`) with symmetry mirroring (`mirror: "x" | "y" | "quad"`), ideal for `32×32` up to `128×128`.
- **Signed Distance Field (SDF) Metaballs & 3D Volume Shading**:
  - **Smooth Union (`smoothBlend`)**: Smoothly fuse adjacent shape layers sharing the same fill via polynomial SDF `smin` (metaballs) with a single unified `1px` pixel-art outline.
  - **3D Heightmap Normal Shading (`sdf: true` / `postProcess.sdfShading: true`)**: Automatically computes a 3D spherical dome heightmap from the 2D SDF, evaluates surface normals, and applies quantized 5-tone pixel-art lighting with Bayer `2×2` ordered dithering.
- **Smart Color Ramps & Retro Palettes**:
  - Define a single base HEX color in `"ramps"` and automatically generate warm-shifted highlights, cool-shifted shadows, and deep tinted outlines.
  - Built-in palettes: **Endesga 32**, **PICO-8**, and **GameBoy**.
- **Multi-Frame Animation & Sprite Sheets (`frames`)**:
  - Assign `"id"` tags to layers and animate them across frames using compact delta overrides (`dx`, `dy`, `dAngle`, `drx`, `dry`, `hidden`).
  - Export horizontal **Sprite Sheets** (`_sheet.png`) in 1 click or via CLI.
- **Interactive Web Studio (`index.html`)**:
  - Works out of the box by opening `index.html` in any browser (zero build step, zero server required).
  - **`📄 + New Sprite`** button to start a clean blank sprite canvas at any resolution in one click.
  - Collapsible Code Drawer + Visual Frame Timeline Strip (with **Onion Skinning**) + Interactive **Layers Stack Inspector** (including per-layer `sBlend` and `3D SDF` controls).
  - Two-way sync between Canvas and ASCII Grid when drawing manually.
- **Zero-Dependency Python CLI (`pixeldsl.py`)**:
  - Uses only Python 3 standard library (`json`, `zlib`, `struct`, `math`).
  - Prints **AI Self-Diagnostics** (fill %, bounding box, center offset, edge clipping warnings) + **TrueColor ANSI terminal preview** (`▀`).
  - Automatically exports `1:1` PNGs, `_sheet.png`, `_preview.png` into `game_ready/` and syncs new sprites into `presets.js` for the Web Studio.

---

## ⌨️ Web Studio Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| **`D`** | **Pencil / Draw** tool |
| **`E`** | **Eraser** tool (sets transparent `.`) |
| **`S`** | **Eyedropper** tool (pick symbol/color from canvas) |
| **`G`** | **Bucket Fill** tool |
| **`Alt + Z`** (or `Ctrl + Z`) | **Undo** last drawing stroke / layer / palette action |
| **`Alt + Y`** (or `Alt + Shift + Z`) | **Redo** action |

---

## 🚀 Quick Start

### 1. Web Studio
Open [`index.html`](./index.html) directly in your browser.
- Click **`📄 + New Sprite`** in the top bar to start a clean blank sprite, or pick an existing sprite from the dropdown (including **👑 SDF Slime King 48×48**).
- Toggle the left code editor with **`⟨⟩ Code`**.
- Inspect, hide/show (`👁`), reorder (`↑`/`↓`), or tweak individual layers (including `sBlend` and `3D SDF`) in the **Layers Stack** panel.
- Scrub or play animation frames in the bottom **Timeline Bar**.

### 2. Headless CLI Generation (for Any LLM CLI)
```bash
# Compile a JSON sprite file into PNGs + ANSI terminal preview + Web Studio sync
python pixeldsl.py sprites/turtle_topdown_32x32.json

# Pipe JSON directly from stdin
cat sprites/turtle_topdown_32x32_grid.json | python pixeldsl.py -
```

### 3. AI Agent Skill (`SKILL.md`)
The repository includes [`.agents/skills/pixel-sprite-generator/SKILL.md`](./.agents/skills/pixel-sprite-generator/SKILL.md) and root [`SKILL.md`](./SKILL.md) so AI coding agents automatically know the PixelDSL v2.5 schema and CLI workflow.

---

## 📄 License

- **Source Code & Engine (`renderer.js`, `app.js`, `pixeldsl.py`, `SKILL.md`)**: Licensed under the **[MIT License](./LICENSE)**.
- **Generated Sprites & Bundled Presets (`sprites/`, `game_ready/`, `presets.js`)**: Dedicated to the public domain under **[CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)**. Any sprites you create or export with PixelDSL Studio belong 100% to you and may be used freely in commercial or non-commercial games without attribution requirements.
