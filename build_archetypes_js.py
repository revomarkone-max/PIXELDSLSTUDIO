import json

with open('scratch_archs.json', 'r', encoding='utf-8') as f:
    archs = json.load(f)

js_code = '''// PixelDSL Studio v3.0 — Archetypes Engine & Mathematical Blueprint Registry
// Zero-dependency client-side procedural generator for all 10 normalized archetypes.

if (typeof window === "undefined") { global.window = global; }

window.ARCHETYPE_REGISTRY = ''' + json.dumps(archs, indent=2) + ''';

window.DEFAULT_ARCHETYPE_PALETTES = {
  humanoid: {
    ".": "transparent",
    "O": "#191c26",
    "skin": "#ffccaa",
    "skin_dark": "#cc9977",
    "clothes": "#2563eb",
    "clothes_dark": "#1d4ed8",
    "pants": "#374151",
    "pants_dark": "#1f2937",
    "shoes": "#78350f",
    "shoes_dark": "#451a03",
    "hair": "#451a03"
  },
  quadruped_feline: {
    ".": "transparent",
    "O": "#1c140a",
    "fur": "#ea580c",
    "fur_dark": "#9a3412",
    "white": "#fed7aa",
    "white_dark": "#fdba74"
  },
  quadruped_canine: {
    ".": "transparent",
    "O": "#15181e",
    "fur": "#64748b",
    "fur_dark": "#334155",
    "fur_light": "#cbd5e1",
    "dark": "#0f172a"
  },
  avian_bird: {
    ".": "transparent",
    "O": "#1a1612",
    "feathers": "#593318",
    "feathers_dark": "#382010",
    "feathers_light": "#804c27",
    "gold": "#eab308"
  },
  tree_deciduous: {
    ".": "transparent",
    "O": "#142115",
    "wood": "#5c3d24",
    "wood_dark": "#3b2414",
    "foliage": "#2e7d32",
    "foliage_dark": "#1b4d20",
    "foliage_light": "#4caf50",
    "shadow": "#14182e38"
  },
  building_structure: {
    ".": "transparent",
    "O": "#1a1c24",
    "stone": "#64748b",
    "stone_dark": "#334155",
    "plaster": "#e2e8f0",
    "wood": "#78350f",
    "wood_dark": "#451a03",
    "tiles": "#991b1b",
    "light_warm": "#fef08a",
    "shadow": "#14182e38"
  },
  weapon_sword: {
    ".": "transparent",
    "O": "#141724",
    "steel": "#e2e8f0",
    "steel_dark": "#64748b",
    "gold": "#eab308",
    "leather": "#78350f",
    "ruby": "#dc2626",
    "white": "#ffffff"
  },
  potion_bottle: {
    ".": "transparent",
    "O": "#111827",
    "cork": "#a16207",
    "glass_tint": "#38bdf844",
    "elixir": "#e11d48",
    "elixir_light": "#fb7185",
    "elixir_white": "#ffe4e6",
    "white_specular": "#ffffffaa",
    "shadow": "#14182e38"
  },
  projectile_orb: {
    ".": "transparent",
    "O": "#1c0a0a",
    "flame_dark": "#7f1d1d",
    "flame_trans": "#ef444444",
    "flame_mid": "#ea580c",
    "flame_bright": "#f97316",
    "flame_yellow": "#fde047",
    "white": "#ffffff"
  },
  autotile_terrain: {
    ".": "transparent",
    "O": "#14181f",
    "grass": "#388e3c",
    "grass_light": "#66bb6a",
    "dirt": "#5d4037",
    "stone": "#78909c",
    "stone_dark": "#37474f"
  }
};

window.ARCHETYPE_THEMES = {
  classic: "Authentic / Original",
  magma: "Volcanic Magma and Obsidian",
  forest: "Deep Moss and Ancient Oak",
  cyberpunk: "Neon Cyan and Hot Pink",
  royal: "Imperial Purple and Gold",
  gameboy: "Retro GameBoy (4 Greens)",
  pastel: "Ethereal Pastel Dream"
};

window.ARCHETYPE_THEME_PALETTES = {
  magma: {
    ".": "transparent",
    "O": "#140808",
    "skin": "#f97316",
    "skin_dark": "#9a3412",
    "clothes": "#262626",
    "clothes_dark": "#171717",
    "pants": "#404040",
    "pants_dark": "#262626",
    "shoes": "#0a0a0a",
    "shoes_dark": "#000000",
    "hair": "#ea580c",
    "fur": "#f97316",
    "fur_dark": "#9a3412",
    "white": "#ffedd5",
    "white_dark": "#fed7aa",
    "wood": "#262626",
    "wood_dark": "#171717",
    "foliage": "#ea580c",
    "foliage_dark": "#9a3412",
    "foliage_light": "#fdba74",
    "stone": "#262626",
    "stone_dark": "#171717",
    "plaster": "#404040",
    "tiles": "#dc2626",
    "steel": "#737373",
    "steel_dark": "#404040",
    "gold": "#f97316",
    "leather": "#262626",
    "ruby": "#ef4444",
    "cork": "#78350f",
    "glass_tint": "#f9731633",
    "elixir": "#ea580c",
    "elixir_light": "#fb923c",
    "elixir_white": "#ffedd5",
    "white_specular": "#ffffffbb",
    "flame_dark": "#7f1d1d",
    "flame_trans": "#ef444444",
    "flame_mid": "#ea580c",
    "flame_bright": "#f97316",
    "flame_yellow": "#fde047",
    "white": "#ffffff",
    "grass": "#ea580c",
    "grass_light": "#fb923c",
    "dirt": "#262626",
    "shadow": "#0a050544"
  },
  forest: {
    ".": "transparent",
    "O": "#0f1710",
    "skin": "#fef08a",
    "skin_dark": "#eab308",
    "clothes": "#166534",
    "clothes_dark": "#14532d",
    "pants": "#3f2c1d",
    "pants_dark": "#291c13",
    "shoes": "#1c1917",
    "shoes_dark": "#0c0a09",
    "hair": "#3f2c1d",
    "fur": "#15803d",
    "fur_dark": "#166534",
    "white": "#bbf7d0",
    "white_dark": "#86efac",
    "wood": "#573a24",
    "wood_dark": "#382415",
    "foliage": "#16a34a",
    "foliage_dark": "#15803d",
    "foliage_light": "#4ade80",
    "stone": "#52525b",
    "stone_dark": "#3f3f46",
    "plaster": "#d4d4d8",
    "tiles": "#15803d",
    "steel": "#a1a1aa",
    "steel_dark": "#52525b",
    "gold": "#eab308",
    "leather": "#573a24",
    "ruby": "#22c55e",
    "cork": "#573a24",
    "glass_tint": "#22c55e33",
    "elixir": "#16a34a",
    "elixir_light": "#4ade80",
    "elixir_white": "#dcfce7",
    "white_specular": "#ffffffbb",
    "flame_dark": "#14532d",
    "flame_trans": "#22c55e44",
    "flame_mid": "#16a34a",
    "flame_bright": "#4ade80",
    "flame_yellow": "#bef264",
    "white": "#ffffff",
    "grass": "#16a34a",
    "grass_light": "#4ade80",
    "dirt": "#573a24",
    "shadow": "#0c150c44"
  },
  cyberpunk: {
    ".": "transparent",
    "O": "#0a0e17",
    "skin": "#fbcfe8",
    "skin_dark": "#f472b6",
    "clothes": "#06b6d4",
    "clothes_dark": "#0891b2",
    "pants": "#1e1b4b",
    "pants_dark": "#0f172a",
    "shoes": "#d946ef",
    "shoes_dark": "#a21caf",
    "hair": "#06b6d4",
    "fur": "#d946ef",
    "fur_dark": "#a21caf",
    "white": "#cffafe",
    "white_dark": "#a5f3fc",
    "wood": "#312e81",
    "wood_dark": "#1e1b4b",
    "foliage": "#06b6d4",
    "foliage_dark": "#0891b2",
    "foliage_light": "#67e8f9",
    "stone": "#1e293b",
    "stone_dark": "#0f172a",
    "plaster": "#334155",
    "tiles": "#ec4899",
    "steel": "#67e8f9",
    "steel_dark": "#0891b2",
    "gold": "#facc15",
    "leather": "#d946ef",
    "ruby": "#06b6d4",
    "cork": "#4338ca",
    "glass_tint": "#06b6d444",
    "elixir": "#ec4899",
    "elixir_light": "#f472b6",
    "elixir_white": "#fce7f3",
    "white_specular": "#ffffffdd",
    "flame_dark": "#831843",
    "flame_trans": "#06b6d444",
    "flame_mid": "#db2777",
    "flame_bright": "#06b6d4",
    "flame_yellow": "#a5f3fc",
    "white": "#ffffff",
    "grass": "#06b6d4",
    "grass_light": "#67e8f9",
    "dirt": "#1e1b4b",
    "shadow": "#0a0e1755"
  },
  royal: {
    ".": "transparent",
    "O": "#160c24",
    "skin": "#fed7aa",
    "skin_dark": "#ea580c",
    "clothes": "#6b21a8",
    "clothes_dark": "#4c1d95",
    "pants": "#1e1b4b",
    "pants_dark": "#0f172a",
    "shoes": "#b45309",
    "shoes_dark": "#78350f",
    "hair": "#eab308",
    "fur": "#7c3aed",
    "fur_dark": "#5b21b6",
    "white": "#fef08a",
    "white_dark": "#fde047",
    "wood": "#4c1d95",
    "wood_dark": "#2e1065",
    "foliage": "#6b21a8",
    "foliage_dark": "#4c1d95",
    "foliage_light": "#a855f7",
    "stone": "#334155",
    "stone_dark": "#1e293b",
    "plaster": "#cbd5e1",
    "tiles": "#9333ea",
    "steel": "#e2e8f0",
    "steel_dark": "#64748b",
    "gold": "#fbbf24",
    "leather": "#4c1d95",
    "ruby": "#dc2626",
    "cork": "#b45309",
    "glass_tint": "#a855f733",
    "elixir": "#7c3aed",
    "elixir_light": "#a855f7",
    "elixir_white": "#f3e8ff",
    "white_specular": "#ffffffcc",
    "flame_dark": "#4c1d95",
    "flame_trans": "#7c3aed44",
    "flame_mid": "#9333ea",
    "flame_bright": "#fbbf24",
    "flame_yellow": "#fef08a",
    "white": "#ffffff",
    "grass": "#7c3aed",
    "grass_light": "#a855f7",
    "dirt": "#1e1b4b",
    "shadow": "#14082444"
  },
  gameboy: {
    ".": "transparent",
    "O": "#0f380f",
    "skin": "#8bac0f",
    "skin_dark": "#306230",
    "clothes": "#306230",
    "clothes_dark": "#0f380f",
    "pants": "#0f380f",
    "pants_dark": "#0f380f",
    "shoes": "#0f380f",
    "shoes_dark": "#0f380f",
    "hair": "#306230",
    "fur": "#8bac0f",
    "fur_dark": "#306230",
    "white": "#9bbc0f",
    "white_dark": "#8bac0f",
    "wood": "#306230",
    "wood_dark": "#0f380f",
    "foliage": "#8bac0f",
    "foliage_dark": "#306230",
    "foliage_light": "#9bbc0f",
    "stone": "#306230",
    "stone_dark": "#0f380f",
    "plaster": "#8bac0f",
    "tiles": "#306230",
    "steel": "#9bbc0f",
    "steel_dark": "#8bac0f",
    "gold": "#9bbc0f",
    "leather": "#306230",
    "ruby": "#306230",
    "cork": "#306230",
    "glass_tint": "#8bac0f44",
    "elixir": "#306230",
    "elixir_light": "#8bac0f",
    "elixir_white": "#9bbc0f",
    "white_specular": "#9bbc0fcc",
    "flame_dark": "#0f380f",
    "flame_trans": "#30623044",
    "flame_mid": "#306230",
    "flame_bright": "#8bac0f",
    "flame_yellow": "#9bbc0f",
    "white": "#9bbc0f",
    "grass": "#8bac0f",
    "grass_light": "#9bbc0f",
    "dirt": "#306230",
    "shadow": "#0f380f33"
  },
  pastel: {
    ".": "transparent",
    "O": "#334155",
    "skin": "#ffedd5",
    "skin_dark": "#fed7aa",
    "clothes": "#93c5fd",
    "clothes_dark": "#60a5fa",
    "pants": "#c4b5fd",
    "pants_dark": "#a78bfa",
    "shoes": "#fbcfe8",
    "shoes_dark": "#f472b6",
    "hair": "#fbcfe8",
    "fur": "#fed7aa",
    "fur_dark": "#fdba74",
    "white": "#f8fafc",
    "white_dark": "#f1f5f9",
    "wood": "#d6d3d1",
    "wood_dark": "#a8a29e",
    "foliage": "#86efac",
    "foliage_dark": "#4ade80",
    "foliage_light": "#bbf7d0",
    "stone": "#cbd5e1",
    "stone_dark": "#94a3b8",
    "plaster": "#f8fafc",
    "tiles": "#fca5a5",
    "steel": "#f1f5f9",
    "steel_dark": "#cbd5e1",
    "gold": "#fef08a",
    "leather": "#fdba74",
    "ruby": "#f87171",
    "cork": "#fed7aa",
    "glass_tint": "#93c5fd44",
    "elixir": "#f472b6",
    "elixir_light": "#fbcfe8",
    "elixir_white": "#fff1f2",
    "white_specular": "#ffffffcc",
    "flame_dark": "#f87171",
    "flame_trans": "#fda4af44",
    "flame_mid": "#fb923c",
    "flame_bright": "#fde047",
    "flame_yellow": "#fef08a",
    "white": "#ffffff",
    "grass": "#86efac",
    "grass_light": "#bbf7d0",
    "dirt": "#e7e5e4",
    "shadow": "#33415522"
  }
};

window.ArchetypeCompiler = class ArchetypeCompiler {
  static getArchetype(id) {
    return window.ARCHETYPE_REGISTRY[id] || null;
  }

  static getCategories() {
    const cats = {
      creatures: { label: "🐾 Creatures", archetypes: [] },
      nature: { label: "🌳 Nature & Environment", archetypes: [] },
      items: { label: "⚔️ Items & Gear", archetypes: [] },
      vfx: { label: "💥 Spells & VFX", archetypes: [] },
      tilesets: { label: "🗺️ Tilesets & Terrain", archetypes: [] }
    };
    for (const [id, arch] of Object.entries(window.ARCHETYPE_REGISTRY)) {
      const cat = arch.category || "creatures";
      if (cats[cat]) {
        cats[cat].archetypes.push({
          id,
          name: arch.name,
          description: arch.description,
          type: arch.type || ("bones" in arch ? "rig" : "layers"),
          recommendedSizes: arch.recommended_sizes || ["32x32", "48x48"]
        });
      }
    }
    return cats;
  }

  static compile(options = {}) {
    const archId = options.archetypeId || "humanoid";
    const arch = this.getArchetype(archId);
    if (!arch) throw new Error("Archetype not found: " + archId);

    const width = Math.max(8, Math.min(128, parseInt(options.width || 48, 10)));
    const height = Math.max(8, Math.min(128, parseInt(options.height || 48, 10)));
    const action = options.action || (arch.locomotion ? Object.keys(arch.locomotion)[0] : (arch.motion ? Object.keys(arch.motion)[0] : "walk"));
    const headScale = parseFloat(options.headScale || 1.0);
    const buildScale = parseFloat(options.buildScale || 1.0);
    const theme = options.paletteTheme || "classic";
    const outlineMode = options.outlineMode || "none";

    const scaleFactor = Math.min(width, height);
    const isRig = "bones" in arch;

    // Resolve Palette
    const basePalette = window.DEFAULT_ARCHETYPE_PALETTES[archId] || window.DEFAULT_ARCHETYPE_PALETTES["humanoid"] || {};
    let resolvedPalette = JSON.parse(JSON.stringify(basePalette));
    if (theme !== "classic" && window.ARCHETYPE_THEME_PALETTES[theme]) {
      const themePalette = window.ARCHETYPE_THEME_PALETTES[theme];
      for (const [k, v] of Object.entries(themePalette)) {
        if (resolvedPalette[k] !== undefined || ["O", ".", "shadow"].includes(k)) {
          resolvedPalette[k] = v;
        }
      }
    }

    const spec = {
      name: `${archId}_${action}_${width}x${height}`,
      label: `${arch.name} (${width}×${height})`,
      author: "PixelDSL Archetype Engine",
      description: arch.description,
      width: width,
      height: height,
      fps: 8,
      palette: resolvedPalette
    };

    if (isRig) {
      spec.type = "rig";
      const scaledBones = [];
      for (const b of (arch.bones || [])) {
        const nb = { id: b.id };
        if (b.parent) nb.parent = b.parent;
        if (b.u !== undefined && b.v !== undefined) {
          nb.x = Math.round(b.u * (width - 1) * 10) / 10;
          nb.y = Math.round(b.v * (height - 1) * 10) / 10;
        }
        if (b.offset_u) {
          nb.offset = [
            Math.round(b.offset_u[0] * scaleFactor * 10) / 10,
            Math.round(b.offset_u[1] * scaleFactor * 10) / 10
          ];
        }
        if (b.length_u !== undefined) {
          nb.length = Math.round(b.length_u * scaleFactor * 10) / 10;
        }
        if (b.angle !== undefined) nb.angle = b.angle;
        if (b.shape) nb.shape = b.shape;

        let rScale = buildScale;
        if (b.id.includes("head") || b.id.includes("ear")) {
          rScale *= headScale;
        }

        if (b.r1_u !== undefined) {
          nb.r1 = Math.max(0.6, Math.round(b.r1_u * scaleFactor * rScale * 10) / 10);
        }
        if (b.r2_u !== undefined) {
          nb.r2 = Math.max(0.6, Math.round(b.r2_u * scaleFactor * rScale * 10) / 10);
        }
        if (b.z !== undefined) nb.z = b.z;
        if (b.fill) nb.fill = b.fill;

        if (b.features) {
          const scaledFeats = {};
          for (const [fk, fv] of Object.entries(b.features)) {
            const sf = Object.assign({}, fv);
            if (sf.dx_u !== undefined) {
              sf.dx = Math.round(sf.dx_u * scaleFactor * headScale * 10) / 10;
              delete sf.dx_u;
            }
            if (sf.dy_u !== undefined) {
              sf.dy = Math.round(sf.dy_u * scaleFactor * headScale * 10) / 10;
              delete sf.dy_u;
            }
            if (sf.w_u !== undefined) {
              sf.w = Math.max(1.0, Math.round(sf.w_u * scaleFactor * headScale * 10) / 10);
              delete sf.w_u;
            }
            if (sf.h_u !== undefined) {
              sf.h = Math.max(1.0, Math.round(sf.h_u * scaleFactor * headScale * 10) / 10);
              delete sf.h_u;
            }
            scaledFeats[fk] = sf;
          }
          nb.features = scaledFeats;
        }

        scaledBones.push(nb);
      }

      spec.rig = {
        outline: outlineMode,
        outlineWidth: outlineMode !== "none" ? 1 : 0,
        bones: scaledBones
      };

      const loco = (arch.locomotion && arch.locomotion[action]) || null;
      const numFrames = parseInt(options.frames, 10) || (loco ? loco.default_frames || 8 : 1);
      spec.label = `${arch.name} (${width}×${height}) [${numFrames}f]`;
      const framesList = [];

      if (loco && numFrames > 1) {
        for (let fi = 0; fi < numFrames; fi++) {
          const t = fi / numFrames;
          const tRad = t * 2.0 * Math.PI;
          const poseDeltas = {};

          if (archId === "humanoid") {
            const hipSw = loco.hip_swing_deg || 26.0;
            const kneeB = loco.knee_bend_deg || 35.0;
            const armSw = loco.arm_swing_deg || 24.0;
            const elbB = loco.elbow_bend_deg || 16.0;
            const bobAmp = (loco.pelvis_bob_amplitude || 0.025) * height;

            poseDeltas["pelvis"] = { dy: Math.round(-bobAmp * Math.abs(Math.sin(tRad)) * 10) / 10 };
            poseDeltas["leg_near_thigh"] = { dAngle: Math.round(hipSw * Math.sin(tRad) * 10) / 10 };
            poseDeltas["leg_near_shin"] = { dAngle: Math.round(kneeB * Math.max(0, -Math.sin(tRad - 0.2)) * 10) / 10 };
            poseDeltas["leg_far_thigh"] = { dAngle: Math.round(hipSw * Math.sin(tRad + Math.PI) * 10) / 10 };
            poseDeltas["leg_far_shin"] = { dAngle: Math.round(kneeB * Math.max(0, -Math.sin(tRad + Math.PI - 0.2)) * 10) / 10 };
            poseDeltas["arm_near_upper"] = { dAngle: Math.round(-armSw * Math.sin(tRad) * 10) / 10 };
            poseDeltas["arm_near_lower"] = { dAngle: Math.round(elbB * Math.max(0, Math.sin(tRad)) * 10) / 10 };
            poseDeltas["arm_far_upper"] = { dAngle: Math.round(-armSw * Math.sin(tRad + Math.PI) * 10) / 10 };
            poseDeltas["arm_far_lower"] = { dAngle: Math.round(elbB * Math.max(0, Math.sin(tRad + Math.PI)) * 10) / 10 };
          } else if (archId === "quadruped_feline") {
            const thighSw = loco.thigh_swing_deg || 22.0;
            const hockFl = loco.hock_flex_deg || 28.0;
            const foreSw = loco.forearm_swing_deg || 24.0;
            const pHf = (loco.phase_hind_far || 0.0) * 2.0 * Math.PI;
            const pFn = (loco.phase_fore_near || 0.25) * 2.0 * Math.PI;
            const pHn = (loco.phase_hind_near || 0.50) * 2.0 * Math.PI;
            const pFf = (loco.phase_fore_far || 0.75) * 2.0 * Math.PI;

            poseDeltas["hind_thigh_far"] = { dAngle: Math.round(thighSw * Math.sin(tRad + pHf) * 10) / 10 };
            poseDeltas["hind_shin_far"] = { dAngle: Math.round(hockFl * Math.max(0, -Math.sin(tRad + pHf)) * 10) / 10 };
            poseDeltas["fore_arm_far"] = { dAngle: Math.round(foreSw * Math.sin(tRad + pFf) * 10) / 10 };
            poseDeltas["hind_thigh_near"] = { dAngle: Math.round(thighSw * Math.sin(tRad + pHn) * 10) / 10 };
            poseDeltas["hind_shin_near"] = { dAngle: Math.round(hockFl * Math.max(0, -Math.sin(tRad + pHn)) * 10) / 10 };
            poseDeltas["fore_arm_near"] = { dAngle: Math.round(foreSw * Math.sin(tRad + pFn) * 10) / 10 };

            const spineW = Math.round((loco.spine_wave_amplitude_deg || 4.5) * Math.sin(tRad * 2.0) * 10) / 10;
            poseDeltas["lumbar"] = { dAngle: spineW };
            poseDeltas["chest"] = { dAngle: -Math.round(spineW * 0.7 * 10) / 10 };
            poseDeltas["tail_mid"] = { dAngle: Math.round((loco.tail_sway_amplitude_deg || 8.0) * Math.sin(tRad) * 10) / 10 };
          } else if (archId === "quadruped_canine") {
            const thighSw = loco.thigh_swing_deg || 28.0;
            const hockFl = loco.hock_flex_deg || 35.0;
            const foreSw = loco.forearm_swing_deg || 32.0;
            const bobAmp = (loco.pelvis_bob_amplitude || 0.03) * height;

            poseDeltas["pelvis"] = { dy: Math.round(-bobAmp * Math.abs(Math.sin(tRad * 2.0)) * 10) / 10 };
            poseDeltas["hind_thigh_far"] = { dAngle: Math.round(thighSw * Math.sin(tRad) * 10) / 10 };
            poseDeltas["hind_shin_far"] = { dAngle: Math.round(hockFl * Math.max(0, -Math.sin(tRad)) * 10) / 10 };
            poseDeltas["fore_arm_near"] = { dAngle: Math.round(foreSw * Math.sin(tRad) * 10) / 10 };
            poseDeltas["hind_thigh_near"] = { dAngle: Math.round(thighSw * Math.sin(tRad + Math.PI) * 10) / 10 };
            poseDeltas["hind_shin_near"] = { dAngle: Math.round(hockFl * Math.max(0, -Math.sin(tRad + Math.PI)) * 10) / 10 };
            poseDeltas["fore_arm_far"] = { dAngle: Math.round(foreSw * Math.sin(tRad + Math.PI) * 10) / 10 };
          } else if (archId === "avian_bird") {
            const flapAmp = loco.wing_flap_amplitude_deg || 48.0;
            const foldAmp = loco.wing_fold_amplitude_deg || 28.0;
            const bobAmp = (loco.torso_bob_amplitude || 0.035) * height;

            const wingFlap = Math.round(flapAmp * Math.sin(tRad) * 10) / 10;
            const wingFold = Math.round(foldAmp * Math.max(0, Math.sin(tRad + 0.5)) * 10) / 10;
            poseDeltas["torso"] = { dy: Math.round(-bobAmp * Math.sin(tRad) * 10) / 10 };
            poseDeltas["wing_arm_near"] = { dAngle: wingFlap };
            poseDeltas["wing_fore_near"] = { dAngle: wingFold };
            poseDeltas["wing_tip_near"] = { dAngle: Math.round(wingFold * 0.7 * 10) / 10 };
            poseDeltas["wing_arm_far"] = { dAngle: wingFlap };
            poseDeltas["wing_fore_far"] = { dAngle: wingFold };
            poseDeltas["wing_tip_far"] = { dAngle: Math.round(wingFold * 0.7 * 10) / 10 };
          }

          framesList.push({ pose: poseDeltas });
        }
      }
      spec.frames = framesList;

    } else {
      // SDF Layer-based Archetype
      spec.type = "layers";
      const scaledLayers = [];
      for (const lay of (arch.layers || [])) {
        const nl = Object.assign({}, lay);
        if (nl.cx_u !== undefined) nl.cx = Math.round(nl.cx_u * (width - 1) * 10) / 10;
        if (nl.cy_u !== undefined) nl.cy = Math.round(nl.cy_u * (height - 1) * 10) / 10;
        if (nl.rx_u !== undefined) nl.rx = Math.round(nl.rx_u * scaleFactor * buildScale * 10) / 10;
        if (nl.ry_u !== undefined) nl.ry = Math.round(nl.ry_u * scaleFactor * buildScale * 10) / 10;
        if (nl.r_u !== undefined) nl.r = Math.round(nl.r_u * scaleFactor * buildScale * 10) / 10;
        if (nl.r2_u !== undefined) nl.r2 = Math.round(nl.r2_u * scaleFactor * buildScale * 10) / 10;
        if (nl.d_u !== undefined) nl.d = Math.round(nl.d_u * scaleFactor * buildScale * 10) / 10;
        if (nl.x_u !== undefined) nl.x = Math.round(nl.x_u * (width - 1) * 10) / 10;
        if (nl.y_u !== undefined) nl.y = Math.round(nl.y_u * (height - 1) * 10) / 10;
        if (nl.w_u !== undefined) nl.w = Math.round(nl.w_u * width * buildScale * 10) / 10;
        if (nl.h_u !== undefined) nl.h = Math.round(nl.h_u * height * buildScale * 10) / 10;
        if (nl.x1_u !== undefined) nl.x1 = Math.round(nl.x1_u * (width - 1) * 10) / 10;
        if (nl.y1_u !== undefined) nl.y1 = Math.round(nl.y1_u * (height - 1) * 10) / 10;
        if (nl.x2_u !== undefined) nl.x2 = Math.round(nl.x2_u * (width - 1) * 10) / 10;
        if (nl.y2_u !== undefined) nl.y2 = Math.round(nl.y2_u * (height - 1) * 10) / 10;
        if (nl.r1_u !== undefined) nl.r1 = Math.round(nl.r1_u * scaleFactor * buildScale * 10) / 10;
        if (nl.r2_u !== undefined) nl.r2 = Math.round(nl.r2_u * scaleFactor * buildScale * 10) / 10;

        delete nl.cx_u; delete nl.cy_u; delete nl.rx_u; delete nl.ry_u;
        delete nl.r_u; delete nl.r2_u; delete nl.d_u;
        delete nl.x_u; delete nl.y_u; delete nl.w_u; delete nl.h_u;
        delete nl.x1_u; delete nl.y1_u; delete nl.x2_u; delete nl.y2_u;
        delete nl.r1_u; delete nl.r2_u;

        if (nl.points_u) {
          nl.points = nl.points_u.map(p => [
            Math.round(p[0] * (width - 1) * 10) / 10,
            Math.round(p[1] * (height - 1) * 10) / 10
          ]);
          delete nl.points_u;
        }

        scaledLayers.push(nl);
      }

      spec.layers = scaledLayers;
      spec.postProcess = {
        autoOutline: outlineMode !== "none",
        outlineColor: "#141824",
        autoShading: false,
        sdfShading: true,
        selOut: outlineMode === "sel_out"
      };

      const motionDef = arch.motion ? (arch.motion[action] || Object.values(arch.motion)[0]) : null;
      const numFrames = parseInt(options.frames, 10) || (motionDef ? motionDef.default_frames || 1 : 1);
      spec.label = `${arch.name} (${width}×${height}) [${numFrames}f]`;
      const framesList = [];

      if (numFrames > 1 && motionDef) {
        for (let fi = 0; fi < numFrames; fi++) {
          const t = fi / numFrames;
          const tRad = t * 2.0 * Math.PI;
          const fLayers = {};

          if (motionDef.sway_amplitude_u !== undefined) {
            const swayPx = Math.round(motionDef.sway_amplitude_u * width * Math.sin(tRad) * 10) / 10;
            for (const lay of scaledLayers) {
              if (lay.id.includes("canopy") || lay.id.includes("top")) {
                fLayers[lay.id] = { dx: swayPx };
              }
            }
          }

          if (motionDef.rotate_corona_deg !== undefined) {
            const rotDeg = Math.round(motionDef.rotate_corona_deg * Math.sin(tRad) * 10) / 10;
            for (const lay of scaledLayers) {
              if (lay.id.includes("corona") || lay.id.includes("flare")) {
                fLayers[lay.id] = { dAngle: rotDeg };
              }
            }
          }

          framesList.push({ layers: fLayers });
        }
      }
      spec.frames = framesList;
    }

    return spec;
  }
};
'''

with open('archetypes.js', 'w', encoding='utf-8') as f:
    f.write(js_code)

print('Generated archetypes.js successfully!')
