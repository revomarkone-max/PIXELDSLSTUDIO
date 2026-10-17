# PixelDSL Studio v3.0 (`8×8` – `128×128`)

[![License: MIT](https://img.shields.io/badge/Code_License-MIT-blue.svg)](./LICENSE)
[![Assets: CC0-1.0](https://img.shields.io/badge/Generated_Assets-CC0_1.0_Public_Domain-brightgreen.svg)](https://creativecommons.org/publicdomain/zero/1.0/)

**PixelDSL Studio** is an autonomous **2D Pixel-Art Mathematical Engine, Asset Generator & Web Studio**. It bridges procedural generation (PCG), mathematical computer graphics, and AI workflows by compiling declarative specs or seeded algorithmic archetypes into crisp, game-ready `.png` sprites, tangent-space normal maps (`_normal.png`), and animated sprite sheets.

---

## ✨ Key Features (v3.0)

- **100% LLM-Free Procedural Archetype Generator (`--generate <archetype> --seed <N>`)**:
  - Deterministic generators for `sword`, `axe`, `shield`, `potion`, `gem`, `slime`, `beetle`, `turtle`, `bunny`, `crystal_monolith`, `spaceship`, and `autotile_blob47` (seamless 47-tile Wang/Blob tilesets) running in `< 5ms` with zero external dependencies.
- **Interactive 3×3 Evolutionary Genome Mutator (`🎲 Generate / Mutate`)**:
  - Web Studio modal rendering a 3×3 grid of live procedural mutations; click any tile to adopt it and breed 9 new variations (Picbreeder-style interactive evolution).
- **2.5D SDF & CSG Boolean Engine (Inigo Quilez Primitives)**:
  - Exact 2D distance fields for `capsule`, `uneven_capsule`, `vesica`, `moon`, `bezier_sdf`, `star`, and gradient-normalized `ellipse`.
  - CSG boolean operations (`subtract`, `intersect`, `onion`) and domain modifiers (`polarRepeat`, `domainWarp`).
  - 2.5D depth tiers (`z`) with automatic 1px **Internal Anatomical Creases** (`crease: true`) preserving limb separation on merged SDF bodies.
- **Tangent-Space Normal Map Export (`_normal.png` / `💡 Normal Map`)**:
  - Evaluates analytical 3D dome normals for dynamic 2D lighting in modern game engines (Godot 4, Unity, Defold).
- **Perceptual `Oklab` / `Oklch` Color Science & Micro-Shaders**:
  - Perceptually uniform lighting ramps, automatic Selective Outlining (`selOut`), and procedural surface shaders (`worley` scales/cracks, `turing` Gray-Scott reaction-diffusion spots, `bayer4x4` dithering).
- **Kinematic Bone Hierarchy & Analytical 2-Bone IK**:
  - Parent-child transforms (`parent: "<id>"`, `pivot: [x, y]`), closed-form Law-of-Cosines 2-bone IK, and declarative motion loops (`idle_breathe`, `walk_cycle`, `jump_arc`) with volume-preserving squash-and-stretch ($r_x r_y = \text{const}$) and phase-lagged follow-through.
- **Raw Image & Sprite Strip Importer (`--import-image`)**:
  - RFC-2083 5-filter PNG reader, `#FF00FF` chroma-key despill, connected-component strip auto-slicer, and SLIC edge-snapping superpixel downsampler.

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
- Click **`🎲 Generate / Mutate`** to generate procedural archetypes or evolve 9 variations of any sprite without an LLM.
- Click **`📄 + New`** to start a blank canvas at any size (`8×8` .. `128×128`).
- Download native **`💾 PNG (1:1)`**, dynamic lighting **`💡 Normal Map`**, or animated **`🎞️ Sprite Sheet`**.

### 2. Autonomous CLI Modes (`pixeldsl.py`)
```bash
# 1. Generate procedural game assets offline (zero LLM calls)
python pixeldsl.py --generate sword --seed 42 --size 32x32
python pixeldsl.py --generate slime --seed 777 --size 32x32
python pixeldsl.py --generate crystal_monolith --seed 108 --size 48x48

# 2. Mutate an existing sprite
python pixeldsl.py --mutate sprites/white_pink_bunny_jump_32x32.json --seed 55

# 3. Import raw turnaround strips or concept art
python pixeldsl.py --import-image heroes/druid_orb/body_strip_raw.png --size 48x48

# 4. Compile any PixelDSL v3.0 JSON spec
python pixeldsl.py sprites/white_pink_bunny_jump_32x32.json

# 5. Pipe JSON directly from stdin
cat sprites/turtle_topdown_32x32_grid.json | python pixeldsl.py -
```

### 3. AI Agent Skill (`SKILL.md`)
The repository includes [`.agents/skills/pixel-sprite-generator/SKILL.md`](./.agents/skills/pixel-sprite-generator/SKILL.md) and root [`SKILL.md`](./SKILL.md) so AI coding agents automatically know the PixelDSL v3.0 schema and CLI workflow.

---

## 📄 License

- **Source Code & Engine (`renderer.js`, `app.js`, `pixeldsl.py`, `SKILL.md`)**: Licensed under the **[MIT License](./LICENSE)**.
- **Generated Sprites & Bundled Presets (`sprites/`, `game_ready/`, `presets.js`)**: Dedicated to the public domain under **[CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)**. Any sprites you create or export with PixelDSL Studio belong 100% to you and may be used freely in commercial or non-commercial games without attribution requirements.
