# PixelDSL Studio v3.0 (`8×8` – `128×128`)

[![License: MIT](https://img.shields.io/badge/Code_License-MIT-blue.svg)](./LICENSE)
[![Assets: CC0-1.0](https://img.shields.io/badge/Generated_Assets-CC0_1.0_Public_Domain-brightgreen.svg)](https://creativecommons.org/publicdomain/zero/1.0/)
[![Pixel Art](https://img.shields.io/badge/pixel--art-generator-orange.svg)](https://github.com/topics/pixel-art)
[![Procedural Generation](https://img.shields.io/badge/PCG-procedural--generation-purple.svg)](https://github.com/topics/procedural-generation)
[![Godot Ready](https://img.shields.io/badge/Godot_4-2D_Lighting_Normals-478cbf.svg?logo=godotengine&logoColor=white)](https://godotengine.org/)
[![Unity 2D](https://img.shields.io/badge/Unity_2D-SpriteRenderer_Compatible-black.svg?logo=unity&logoColor=white)](https://unity.com/)
[![Skeletal Rig](https://img.shields.io/badge/rigging-2--bone--IK-red.svg)](https://github.com/topics/skeletal-animation)
[![Paper Doll](https://img.shields.io/badge/paperdoll-modular--equipment-teal.svg)](https://github.com/topics/paperdoll)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0_(Pure_Python_%2B_JS)-success.svg)](https://github.com/)

**PixelDSL Studio** is an autonomous **2D Pixel-Art Mathematical Engine, Asset Generator, Modular Paper Doll & Web Studio**. It bridges procedural generation (PCG), mathematical computer graphics, and AI workflows by compiling declarative specs or seeded algorithmic archetypes into crisp, game-ready `.png` sprites, tangent-space normal maps (`_normal.png`), and animated sprite sheets.

---

## 🏷️ GitHub Topics & SEO Discoverability

To maximize discoverability for developers searching for 2D game asset tools, roguelike generators, and procedural pixel art on GitHub and search engines (Google, Bing, DuckDuckGo):

### 📌 Recommended GitHub Repository Topics:
Add these topics in your GitHub repository settings (**About** ⚙️ → **Topics**):
```
pixel-art, pixelart, procedural-generation, gamedev, indie-game, godot, godot4, unity, unity2d, sprite-generator, spritesheet, skeletal-animation, paperdoll, normal-maps, roguelike, rpg, character-generator, 2d-animation, oklab, signed-distance-field, pcg, inverse-kinematics
```

### 🔍 Search Hashtags & Keywords:
`#pixelart` `#pixelartgenerator` `#gamedev` `#indiedev` `#proceduralgeneration` `#pcg` `#godotengine` `#godot4` `#unity2d` `#spritesheet` `#gamedevelopment` `#skeletalanimation` `#paperdoll` `#modulararmor` `#normalmaps` `#2dlighting` `#roguelikedev` `#rpgmaker` `#pixelartist` `#indiegame`

### 🎯 Target Use Cases:
- **Modular RPG Character Customization (Paper Doll & Equipment Matrix)**: Dynamically equip helmets, armor, gauntlets, pants, boots, main-hand weapons, and shields onto animated skeletal mannequins (Humanoid, Chibi, Skeleton, Orc) with forward-kinematic bone attachment and automatic Z-depth layering.
- **Indie Game Developers & Game Jams** (Ludum Dare, GMTK, Global Game Jam): Generate hundreds of unique weapons, potions, monsters, trees, and autotiles offline in seconds.
- **Dynamic 2D Lighting Engines (Godot 4, Unity 2D, Defold)**: Instant analytical tangent-space normal maps (`_normal.png`) generated from 3D spherical SDF dome models with Bayer dithering.
- **Autonomous AI Coding Agents**: Standardized JSON DSL and pure Python compiler (`pixeldsl.py` & `paperdoll.py`) designed for AI agents to craft pixel-perfect game assets without hallucinating colors or misaligning sprite sheet frames.

---

## ✨ Key Features (v3.0)

- **Modular Paper Doll & Equipment Matrix (`paperdoll.js` & `paperdoll.py`)**:
  - Live procedural bone-attached modular armor, helmets, gauntlets, boots, and weapons that automatically snap and sync with skeletal rig kinematics frame-by-frame (`walk`, `attack`, `idle`, `hurt`, `run`).
  - Swappable mannequins (`humanoid`, `chibi`, `skeleton`, `orc`) and pre-configured archetype loadouts (Paladin, Archmage, Assassin, Death Knight, Sovereign).
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
- Open the **`🥋 Paper Doll`** workspace to equip helmets, armor, boots, shields, and weapons onto animated mannequins (`humanoid`, `chibi`, `skeleton`, `orc`).
- Click **`⚡ Open in Canvas Studio`** from either Archetype Forge or Paper Doll to edit pixels or fine-tune poses.
- Download native **`💾 PNG (1:1)`**, dynamic lighting **`💡 Normal Map`**, or animated **`🎞️ Sprite Sheet`**.

### 2. Autonomous CLI Modes (`pixeldsl.py` & `paperdoll.py`)
```bash
# --- A. Modular Paper Doll & Equipment Matrix ---
# 1. Assemble and animate modular loadouts offline
python paperdoll.py --mannequin humanoid --loadout paladin --action walk --frames 8 -o paladin_walk.png
python paperdoll.py --mannequin skeleton --equip head:horned_helm,torso:bone_carapace,weapon:battle_axe --action attack -o skeleton_attack.png
python paperdoll.py --list-slots
python paperdoll.py --list-loadouts

# --- B. Procedural Archetype Generators (Zero LLM Calls) ---
python pixeldsl.py --generate sword --seed 42 --size 32x32
python pixeldsl.py --generate slime --seed 777 --size 32x32
python pixeldsl.py --generate crystal_monolith --seed 108 --size 48x48

# --- C. Evolutionary Sprite Mutator ---
python pixeldsl.py --mutate sprites/white_pink_bunny_jump_32x32.json --seed 55

# --- D. Concept Art & Turnaround Strip Importer ---
python pixeldsl.py --import-image heroes/druid_orb/body_strip_raw.png --size 48x48

# --- E. Compile any PixelDSL v3.0 JSON Spec ---
python pixeldsl.py sprites/white_pink_bunny_jump_32x32.json

# --- F. Pipe JSON Directly from STDIN ---
cat sprites/turtle_topdown_32x32_grid.json | python pixeldsl.py -
```

### 3. AI Agent Skill (`SKILL.md`)
The repository includes [`.agents/skills/pixel-sprite-generator/SKILL.md`](./.agents/skills/pixel-sprite-generator/SKILL.md) and root [`SKILL.md`](./SKILL.md) so AI coding agents automatically know the PixelDSL v3.0 schema and CLI workflow.

---

## 📄 License

- **Source Code & Engine (`renderer.js`, `app.js`, `pixeldsl.py`, `SKILL.md`)**: Licensed under the **[MIT License](./LICENSE)**.
- **Generated Sprites & Bundled Presets (`sprites/`, `game_ready/`, `presets.js`)**: Dedicated to the public domain under **[CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)**. Any sprites you create or export with PixelDSL Studio belong 100% to you and may be used freely in commercial or non-commercial games without attribution requirements.
