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
- **Modular RPG Character Customization (Paper Doll & Equipment Matrix)**: Dynamically equip helmets, armor, gauntlets, pants, boots, main-hand weapons, and shields onto animated skeletal mannequins (Humanoid, Chibi, Skeleton, Orc) with forward-kinematic bone attachment, 4-way directional adaptation, and automatic Z-depth layering.
- **4-Way Top-Down Action RPGs**: Generate complete 4-direction sprite sheets (`down`, `left`, `right`, `up`) with synchronized ground-contact analytical IK.
- **Game Engine Ready Exports (Godot 4 & Unity 2D)**: One-click export of Godot 4 `SpriteFrames` (`.tres`) and Unity 2D `SpriteAtlas` JSON slicing metadata with 3D normal map support.
- **Dynamic 2D Lighting Engines (Godot 4, Unity 2D, Defold)**: Instant analytical tangent-space normal maps (`_normal.png`) generated from 3D spherical SDF dome models with Bayer dithering.
- **Indie Game Developers & Game Jams** (Ludum Dare, GMTK, Global Game Jam): Generate hundreds of unique weapons, potions, monsters, trees, and autotiles offline in seconds.
- **Autonomous AI Coding Agents**: Standardized JSON DSL and pure Python compiler (`pixeldsl.py` & `paperdoll.py`) designed for AI agents to craft pixel-perfect game assets without hallucinating colors or misaligning sprite sheet frames.

---

## ✨ Key Features (v3.2)

- **Analytical 2-Bone Inverse Kinematics (IK) with Ground Contact (`--ik`)**:
  - Closed-form Law of Cosines analytical solver for hip, knee, and ankle joints.
  - **Zero Foot-Sliding**: Clamps the foot to the ground plane ($y_{\text{ankle}} = y_{\text{ground}} = \text{const}$) throughout the stance phase ($u \in [0, 0.5]$), and applies a smoothstep parabolic trajectory during the swing phase ($u \in [0.5, 1.0]$).
- **4-Way Top-Down Spritesheet Engine (`--4way` / `🎮 4-Way Grid`)**:
  - Compiles full 4-direction RPG sprite sheets (`down` [front], `left` [mirrored profile], `right` [profile], `up` [back]) in a single command or Web Studio click.
  - Interactive 2×2 live synchronized animation grid preview in the Paper Doll workspace with both diffuse color and 3D normal map toggles.
- **Universal Game Engine Exporter (Godot 4 & Unity 2D)**:
  - **Godot Engine 4.x (`.tres`)**: Exports native Godot `SpriteFrames` resources with auto-generated frame regions, 8 FPS playback, looping flags, and `CanvasItemMaterial` NormalMap bindings for Light2D point lighting.
  - **Unity 2023 / 6 (`.json`)**: Exports standard TexturePacker/Unity 2D SpriteAtlas metadata with exact pixel coordinates, pivots, and normal map bindings.
  - **Engine Asset Bundle (`.json`)**: Lossless JSON bundle containing complete skeletal bone hierarchies, Z-depth tiers, and frame sequences.
- **Art Zone (128×128 Freehand & Bone Rigging Studio)**:
  - Dedicated creative page featuring a canonical 128px T-pose character rig with proportional head, torso, clavicles, arms, and legs.
  - Integrated pixel art paint tools (pencil, eraser, eyedropper, bucket, rect, circle), brush sizes (1–4px), color palette, and interactive bone move / rotate / add / delete controls.
- **4-Way Directional Compass Turnaround**:
  - Real-time 2.5D perspective turntable demonstrating South (front), North (back view with inverted Z-sorting and cape foregrounding), East/West (profile strides), and 2.5D axonometric Isometric projection ($30^\circ$ shear plane).
- **Zero-Allocation Canvas Scratch Pool**:
  - High-performance singleton scratch canvas buffer pool eliminating heap allocations and garbage collection stutter during 60 FPS animation loops.
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
- Open **`🎨 Art Zone`** for freehand 128px pixel painting and live skeletal rigging.
- Open **`🥋 Paper Doll`** to equip armor, weapons, and helmets onto mannequins, toggle **`Ground Contact IK`**, or preview the synchronized **`🎮 4-Way Grid`**.
- Open **`🧭 4-Way Compass`** to inspect turnaround Z-depth ordering and 2.5D isometric projection.
- Open **`📦 Exporter`** to download ready-to-drop **Godot 4 `.tres`** resources and **Unity 2D `.json`** atlas metadata.
- Click **`🎲 Generate / Mutate`** to evolve procedural sprites without an LLM.

### 2. Autonomous CLI Modes (`pixeldsl.py` & `paperdoll.py`)
```bash
# --- A. 4-Way RPG Spritesheet with Godot 4 & Unity Exporters ---
python paperdoll.py --mannequin humanoid --loadout paladin --action walk --4way --normal --export-godot --export-unity -o game_ready/paladin_walk_4way.png

# --- B. Ground Contact Analytical IK vs Forward Kinematics ---
python paperdoll.py --mannequin humanoid --loadout paladin --action walk --ik -o paladin_ik.png
python paperdoll.py --mannequin humanoid --loadout paladin --action walk --no-ik -o paladin_fk.png

# --- C. Modular Paper Doll Custom Loadouts ---
python paperdoll.py --mannequin skeleton --equip head:horned_helm,torso:bone_carapace,weapon:battle_axe --action attack -o skeleton_attack.png
python paperdoll.py --list-slots
python paperdoll.py --list-loadouts
python paperdoll.py --list-mannequins

# --- D. Procedural Archetype Generators (Zero LLM Calls) ---
python pixeldsl.py --generate sword --seed 42 --size 32x32
python pixeldsl.py --generate slime --seed 777 --size 32x32
python pixeldsl.py --generate crystal_monolith --seed 108 --size 48x48

# --- E. Evolutionary Sprite Mutator ---
python pixeldsl.py --mutate sprites/white_pink_bunny_jump_32x32.json --seed 55

# --- F. Concept Art & Turnaround Strip Importer ---
python pixeldsl.py --import-image heroes/druid_orb/body_strip_raw.png --size 48x48

# --- G. Compile any PixelDSL v3.0 JSON Spec ---
python pixeldsl.py sprites/white_pink_bunny_jump_32x32.json
```

### 3. AI Agent Skill (`SKILL.md`)
The repository includes [`.agents/skills/pixel-sprite-generator/SKILL.md`](./.agents/skills/pixel-sprite-generator/SKILL.md) and root [`SKILL.md`](./SKILL.md) so AI coding agents automatically know the PixelDSL v3.0 schema and CLI workflow.

---

## 📄 License

- **Source Code & Engine (`renderer.js`, `app.js`, `pixeldsl.py`, `SKILL.md`)**: Licensed under the **[MIT License](./LICENSE)**.
- **Generated Sprites & Bundled Presets (`sprites/`, `game_ready/`, `presets.js`)**: Dedicated to the public domain under **[CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)**. Any sprites you create or export with PixelDSL Studio belong 100% to you and may be used freely in commercial or non-commercial games without attribution requirements.
