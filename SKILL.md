---
name: pixel-sprite-generator
description: >-
  Generates 2D pixel art sprites, modular paper doll character equipment rigs, normal maps, and animated sprite sheets (from 8x8 to 128x128 pixels)
  using the PixelDSL v3.0 mathematical engine and compiles them via pixeldsl.py and paperdoll.py into PNGs
  and the Web Studio (index.html). Supports both 100% LLM-free procedural generation (--generate / --mutate / --import-image / paper doll)
  and declarative JSON specs. Activate this skill whenever the user asks to generate, design, animate, import, or edit a 2D pixel sprite, icon, tile, or asset.
---

# Pixel Sprite Generator v3.0 (`PixelDSL` + `pixeldsl.py` CLI)

This skill provides an autonomous mathematical 2D pixel-art engine (**PixelDSL v3.0**) and compiler ([pixeldsl.py](file:///c:/DEEEEV/Generated%20Asset/pixeldsl.py)) synced 1-to-1 with the interactive Web Studio ([index.html](file:///c:/DEEEEV/Generated%20Asset/index.html) / [renderer.js](file:///c:/DEEEEV/Generated%20Asset/renderer.js)).

---

## 1. CLI Modes (`pixeldsl.py`)

```bash
# Mode 1: 100% LLM-Free Procedural Archetype Generator (seeded PCG + Oklch palettes + motion)
# Archetypes: sword, axe, shield, potion, gem, slime, beetle, turtle, bunny, crystal_monolith, spaceship, autotile_blob47
python pixeldsl.py --generate sword --seed 42 --size 32x32
python pixeldsl.py --generate crystal_monolith --seed 108 --size 48x48

# Mode 2: Evolutionary Genome Mutator (perturb shape radii, positions, Oklch hues, and smoothBlend)
python pixeldsl.py --mutate sprites/sdf_slime_king_48x48.json --seed 77

# Mode 3: Raw Image / Sprite Strip Importer (#FF00FF chroma-key + Oklab despill + auto-slicer + SLIC superpixel downsampler)
python pixeldsl.py --import-image heroes/paladin_orb/body_strip_raw.png --size 48x48

# Mode 4: Compile a PixelDSL v3.0 JSON file or stdin stream
python pixeldsl.py sprites/my_sprite.json

# Mode 5: Modular Paper Doll 4-Way RPG Spritesheet & Game Engine Exporters (Godot 4 & Unity 2D)
python paperdoll.py --mannequin humanoid --loadout paladin --action walk --4way --normal --export-godot --export-unity -o game_ready/paladin_walk_4way.png
```

### What `pixeldsl.py` Outputs Automatically:
1. Saves the canonical JSON source to `sprites/<name>.json`.
2. Renders `game_ready/<name>.png` (`1:1` native resolution), `game_ready/<name>_normal.png` (tangent-space normal map `(Nx, Ny, Nz) -> RGB` for 2D dynamic lighting in Godot/Unity), `game_ready/<name>_preview.png` (upscaled crisp preview), and `game_ready/<name>_sheet.png` (horizontal Sprite Sheet when animated).
3. Syncs the sprite into [presets.js](file:///c:/DEEEEV/Generated%20Asset/presets.js) for instant editing and 3×3 evolutionary breeding in [index.html](file:///c:/DEEEEV/Generated%20Asset/index.html).
4. Prints a **Self-Diagnostics Report** (`Canvas Fill %`, `Bounding Box`, `Center Offset`, `Edge Clipping Check`) plus a **TrueColor ANSI terminal preview** (`▀`).

---

## 2. The 6 Mathematical Pillars of PixelDSL v3.0

1. **2.5D Quilez SDF & CSG Engine + Internal Creases + Normal Maps**:
   - Universal 2D inverse affine rotation (`angle`, `dAngle`) before evaluating any primitive (`ellipse`, `rect`, `polygon`, `capsule`, `uneven_capsule`, `vesica`, `moon`, `bezier_sdf`, `star`, `ngon`).
   - CSG Boolean modes (`opMode`: `"union" | "smooth_union" | "subtract" | "smooth_subtract" | "intersect"`) plus domain modifiers (`onion`, `polarRepeat`, `domainWarp`).
   - 2.5D depth tiers (`z`) with automatic 1px **Internal Anatomical Crease** detection (`crease: true`) so foreground limbs (e.g., a bunny's thigh over its torso) retain a crisp 1px dark contour inside a merged SDF silhouette.
   - Selective Outlining (`postProcess.selOut: true`) that tints outlines by surface normal direction + local material hue.
2. **Felzenszwalb $O(W \times H)$ Euclidean Distance Transform + Discrete Pixel-Art Morphology**:
   - Exact linear-time parabolic-envelope EDT computes bevel normals for symbolic `grid` and `stamp` layers.
   - Automatic discrete morphological cleanup prunes 1px cardinal spurs/pimples on rounded SDF silhouettes (`smoothBlend`) and fills 1px pinholes.
   - `RotSprite`-style EPX 2× scale + inverse rotation for rotated `stamp` layers (`angle != 0`).
3. **Perceptual `Oklab` / `Oklch` Color Engine + Procedural Surface Shaders + Lossless Bake-to-Grid**:
   - Björn Ottosson `Oklab` / `Oklch` color space with warm highlight (`+15°` hue) and cool shadow (`-18°` hue) ramps.
   - Procedural micro-shaders (`shader`: `"worley" | "voronoi" | "turing" | "bayer4x4" | "blue_noise"`).
   - Auto-registration of the 5 SDF volume tones into `resolvedPalette` and `symbolBuffer` so `🔥 Bake Layers → Grid` preserves 100% of 3D SDF shading with zero RGBA byte loss.
4. **Kinematic Bone Hierarchy + Analytical 2-Bone IK + Procedural Motion Generators**:
   - Hierarchical `parent: "<layer_id>"` and `pivot: [px, py]` transform propagation.
   - Analytical Law-of-Cosines 2-Bone IK solver (`ik: { root: [rx, ry], target: [tx, ty], l1: L1, l2: L2, flip: false }`).
   - Declarative `"motion"` block (`type: "idle_breathe" | "walk_cycle" | "swim_cycle" | "jump_arc" | "wave"`, `frames: N`, `amplitude: 1.0`) with volume-preserving squash-and-stretch ($r_x \cdot r_y = \text{const}$) and phase-lagged secondary follow-through.
5. **100% LLM-Free Seeded Archetype Generator + MarkovJunior Cellular Rewrite Rules + 3×3 Mutator**:
   - 12 procedural archetypes + `"rules"` cellular rewrite pass (`top_coat`, `bottom_drip`, `highlight_glint`) + interactive **`🎲 Generate / Mutate (3×3)`** modal in Web Studio.
6. **Chroma-Key Strip Importer & SLIC Superpixel Pixelizer**:
   - Pure-Python RFC-2083 PNG decoder, perimeter BFS flood-fill + `#FF00FF` chroma-key despilling, connected-component strip auto-slicer, and SLIC superpixel downsampler.

---

## 3. PixelDSL v3.0 JSON Schema Reference

```json
{
  "name": "sprite_48x48",
  "width": 48,
  "height": 48,
  "symmetry": "none",
  "rle": false,
  "ramps": {
    "S": { "base": "#3a8754", "light": "L", "dark": "D", "outline": "O" }
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
    "sdfShading": true,
    "selOut": true
  },
  "motion": {
    "type": "idle_breathe",
    "frames": 4,
    "amplitude": 1.0
  },
  "layers": [
    {
      "id": "body",
      "op": "ellipse",
      "cx": 24,
      "cy": 26,
      "rx": 12,
      "ry": 10,
      "angle": 0,
      "fill": "S",
      "outline": "O",
      "sdf": true,
      "smoothBlend": 2.2,
      "z": 1,
      "crease": false,
      "opMode": "smooth_union",
      "shader": "worley",
      "mirror": "none"
    }
  ],
  "rules": [
    { "type": "top_coat", "target": "S", "replace": "L" }
  ],
  "frames": [],
  "grid": []
}
```
