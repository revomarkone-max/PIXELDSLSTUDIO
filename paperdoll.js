// PixelDSL Studio v3.0 — Modular Paper Doll & Equipment Matrix Engine
// Zero-dependency bone-attached modular equipment system with Forward Kinematics (FK),
// automatic Z-depth layering, animated action cycles, and live Canvas Studio export.

(function (global) {
  "use strict";

  // ==========================================================================
  // 1. SLOTS SPECIFICATION
  // ==========================================================================
  const SLOTS = [
    { id: "head", name: "Headgear", icon: "🪖", defaultItem: "iron_helm", desc: "Helmets, hoods, crowns, and cowls" },
    { id: "torso", name: "Torso Armor", icon: "🛡️", defaultItem: "steel_cuirass", desc: "Cuirasses, vests, robes, and carapaces" },
    { id: "hands", name: "Gauntlets", icon: "🧤", defaultItem: "steel_gauntlets", desc: "Armored vambraces and gloves" },
    { id: "legs", name: "Leg Armor", icon: "👖", defaultItem: "plate_greaves", desc: "Greaves, chausses, and skirts" },
    { id: "feet", name: "Footwear", icon: "👢", defaultItem: "iron_sabatons", desc: "Sabatons, boots, and sandals" },
    { id: "weapon", name: "Main-Hand", icon: "⚔️", defaultItem: "runed_broadsword", desc: "Swords, axes, staffs, and spears" },
    { id: "shield", name: "Off-Hand", icon: "🔰", defaultItem: "kite_shield", desc: "Shields, bucklers, spellbooks, and daggers" },
    { id: "back", name: "Back / Cape", icon: "🎒", defaultItem: "red_cape", desc: "Capes, cloaks, and wings" }
  ];

  // ==========================================================================
  // 2. MATERIAL THEMES & PALETTES
  // ==========================================================================
  const THEMES = {
    steel: {
      id: "steel",
      name: "Polished Steel & Iron",
      gear_base: "#8a95a5",
      gear_hi: "#d1d5db",
      gear_shadow: "#475569",
      gear_dark: "#1e293b",
      trim: "#d97706",
      trim_hi: "#fef08a"
    },
    gold: {
      id: "gold",
      name: "Imperial Gilded Gold",
      gear_base: "#eab308",
      gear_hi: "#fef08a",
      gear_shadow: "#a16207",
      gear_dark: "#713f12",
      trim: "#dc2626",
      trim_hi: "#fca5a5"
    },
    dark_iron: {
      id: "dark_iron",
      name: "Abyssal Dark Iron",
      gear_base: "#334155",
      gear_hi: "#64748b",
      gear_shadow: "#0f172a",
      gear_dark: "#020617",
      trim: "#9333ea",
      trim_hi: "#c084fc"
    },
    crimson: {
      id: "crimson",
      name: "Blood Knight Crimson",
      gear_base: "#b91c1c",
      gear_hi: "#f87171",
      gear_shadow: "#7f1d1d",
      gear_dark: "#450a0a",
      trim: "#eab308",
      trim_hi: "#fef08a"
    },
    cobalt: {
      id: "cobalt",
      name: "Runic Cobalt Blue",
      gear_base: "#2563eb",
      gear_hi: "#93c5fd",
      gear_shadow: "#1e40af",
      gear_dark: "#0f172a",
      trim: "#06b6d4",
      trim_hi: "#a5f3fc"
    },
    emerald: {
      id: "emerald",
      name: "Verdant Ranger Emerald",
      gear_base: "#15803d",
      gear_hi: "#86efac",
      gear_shadow: "#14532d",
      gear_dark: "#052e16",
      trim: "#ca8a04",
      trim_hi: "#fef08a"
    },
    obsidian: {
      id: "obsidian",
      name: "Volcanic Obsidian & Flame",
      gear_base: "#18181b",
      gear_hi: "#3f3f46",
      gear_shadow: "#09090b",
      gear_dark: "#000000",
      trim: "#ea580c",
      trim_hi: "#fed7aa"
    }
  };

  // ==========================================================================
  // 3. BASE MANNEQUINS
  // ==========================================================================
  const MANNEQUINS = {
    humanoid: {
      id: "humanoid",
      name: "Standard Heroic Humanoid",
      desc: "Balanced 7-head proportion bipedal skeleton with 3-tier Z depth.",
      width: 48,
      height: 48,
      palette: {
        skin: "#f5c29a",
        skin_hi: "#fde3cf",
        skin_dark: "#c98f68",
        skin_shadow: "#8b5536",
        eyes: "#1e293b",
        linen: "#e2e8f0",
        linen_dark: "#94a3b8"
      },
      bones: [
        { id: "pelvis", x: 24, y: 25, length: 3, angle: -90, r1: 3.6, r2: 3.6, z: 1.0, fill: "linen_dark" },
        { id: "torso", parent: "pelvis", offset: [0, 0], length: 5, angle: 0, r1: 3.6, r2: 4.0, z: 1.1, fill: "linen" },
        { id: "chest", parent: "torso", offset: [0, 0], length: 4.5, angle: 0, r1: 4.0, r2: 3.8, z: 1.2, fill: "skin" },
        { id: "neck", parent: "chest", offset: [0, 0], length: 4.2, angle: 0, r1: 2.0, r2: 2.0, z: 1.3, fill: "skin_dark" },
        { id: "head", parent: "neck", offset: [0, 0], length: 0, shape: "head_oval", r1: 4.8, r2: 4.4, z: 1.5, fill: "skin", features: { eyes: { dx: 1.8, dy: -0.5, w: 1.6, h: 2.0, color: "eyes" } } },
        { id: "arm_far_upper", parent: "chest", offset: [-1.2, 0.5], length: 6.5, angle: 175, r1: 2.0, r2: 1.7, z: 0.1, fill: "skin_shadow" },
        { id: "arm_far_lower", parent: "arm_far_upper", offset: [0, 0], length: 5.5, angle: 10, r1: 1.7, r2: 1.5, z: 0.15, fill: "skin_shadow" },
        { id: "leg_far_thigh", parent: "pelvis", offset: [-1.2, 0], length: 7.5, angle: 180, r1: 2.6, r2: 2.1, z: 0.2, fill: "skin_shadow" },
        { id: "leg_far_shin", parent: "leg_far_thigh", offset: [0, 0], length: 7.0, angle: 0, r1: 2.1, r2: 1.8, z: 0.25, fill: "skin_shadow" },
        { id: "foot_far", parent: "leg_far_shin", offset: [0, 0], length: 3.0, angle: -75, r1: 1.8, r2: 1.4, z: 0.3, fill: "linen_dark" },
        { id: "leg_near_thigh", parent: "pelvis", offset: [1.2, 0], length: 7.5, angle: 180, r1: 2.8, r2: 2.3, z: 2.1, fill: "skin" },
        { id: "leg_near_shin", parent: "leg_near_thigh", offset: [0, 0], length: 7.0, angle: 0, r1: 2.3, r2: 1.9, z: 2.2, fill: "skin" },
        { id: "foot_near", parent: "leg_near_shin", offset: [0, 0], length: 3.0, angle: -75, r1: 1.9, r2: 1.5, z: 2.3, fill: "linen_dark" },
        { id: "arm_near_upper", parent: "chest", offset: [1.2, 0.5], length: 6.5, angle: 175, r1: 2.1, r2: 1.8, z: 2.6, fill: "skin" },
        { id: "arm_near_lower", parent: "arm_near_upper", offset: [0, 0], length: 5.5, angle: 10, r1: 1.8, r2: 1.6, z: 2.7, fill: "skin" }
      ]
    },

    chibi: {
      id: "chibi",
      name: "Chibi Adventurer (Mini / Cute)",
      desc: "Stylized chibi proportion with large expressive head and compact torso.",
      width: 48,
      height: 48,
      palette: {
        skin: "#fed7aa",
        skin_hi: "#ffedd5",
        skin_dark: "#fba068",
        skin_shadow: "#a85532",
        eyes: "#0f172a",
        linen: "#f1f5f9",
        linen_dark: "#64748b"
      },
      bones: [
        { id: "pelvis", x: 24, y: 27, length: 2, angle: -90, r1: 3.2, r2: 3.2, z: 1.0, fill: "linen_dark" },
        { id: "torso", parent: "pelvis", offset: [0, 0], length: 3.5, angle: 0, r1: 3.2, r2: 3.5, z: 1.1, fill: "linen" },
        { id: "chest", parent: "torso", offset: [0, 0], length: 3.0, angle: 0, r1: 3.5, r2: 3.2, z: 1.2, fill: "skin" },
        { id: "neck", parent: "chest", offset: [0, 0], length: 3.2, angle: 0, r1: 1.8, r2: 1.8, z: 1.3, fill: "skin_dark" },
        { id: "head", parent: "neck", offset: [0, 0], length: 0, shape: "head_oval", r1: 6.8, r2: 6.4, z: 1.5, fill: "skin", features: { eyes: { dx: 2.5, dy: 0.0, w: 2.2, h: 3.0, color: "eyes" } } },
        { id: "arm_far_upper", parent: "chest", offset: [-1.0, 0.5], length: 4.5, angle: 175, r1: 1.8, r2: 1.6, z: 0.1, fill: "skin_shadow" },
        { id: "arm_far_lower", parent: "arm_far_upper", offset: [0, 0], length: 4.0, angle: 10, r1: 1.6, r2: 1.4, z: 0.15, fill: "skin_shadow" },
        { id: "leg_far_thigh", parent: "pelvis", offset: [-1.0, 0], length: 5.0, angle: 180, r1: 2.2, r2: 1.8, z: 0.2, fill: "skin_shadow" },
        { id: "leg_far_shin", parent: "leg_far_thigh", offset: [0, 0], length: 4.5, angle: 0, r1: 1.8, r2: 1.6, z: 0.25, fill: "skin_shadow" },
        { id: "foot_far", parent: "leg_far_shin", offset: [0, 0], length: 2.5, angle: -75, r1: 1.6, r2: 1.3, z: 0.3, fill: "linen_dark" },
        { id: "leg_near_thigh", parent: "pelvis", offset: [1.0, 0], length: 5.0, angle: 180, r1: 2.4, r2: 2.0, z: 2.1, fill: "skin" },
        { id: "leg_near_shin", parent: "leg_near_thigh", offset: [0, 0], length: 4.5, angle: 0, r1: 2.0, r2: 1.7, z: 2.2, fill: "skin" },
        { id: "foot_near", parent: "leg_near_shin", offset: [0, 0], length: 2.5, angle: -75, r1: 1.7, r2: 1.4, z: 2.3, fill: "linen_dark" },
        { id: "arm_near_upper", parent: "chest", offset: [1.0, 0.5], length: 4.5, angle: 175, r1: 1.9, r2: 1.7, z: 2.6, fill: "skin" },
        { id: "arm_near_lower", parent: "arm_near_upper", offset: [0, 0], length: 4.0, angle: 10, r1: 1.7, r2: 1.5, z: 2.7, fill: "skin" }
      ]
    },

    skeleton: {
      id: "skeleton",
      name: "Undead Skeleton Warrior",
      desc: "Thin ivory bony joints, hollow ribcage, and exposed skull with glowing eye embers.",
      width: 48,
      height: 48,
      palette: {
        skin: "#e5e5e5",
        skin_hi: "#ffffff",
        skin_dark: "#a3a3a3",
        skin_shadow: "#525252",
        eyes: "#ef4444",
        linen: "#404040",
        linen_dark: "#262626"
      },
      bones: [
        { id: "pelvis", x: 24, y: 25, length: 2.8, angle: -90, r1: 2.6, r2: 2.6, z: 1.0, fill: "skin" },
        { id: "torso", parent: "pelvis", offset: [0, 0], length: 5.2, angle: 0, r1: 1.8, r2: 2.4, z: 1.1, fill: "skin_dark" },
        { id: "chest", parent: "torso", offset: [0, 0], length: 4.0, angle: 0, r1: 3.4, r2: 3.2, z: 1.2, fill: "skin" },
        { id: "neck", parent: "chest", offset: [0, 0], length: 4.0, angle: 0, r1: 1.4, r2: 1.4, z: 1.3, fill: "skin_dark" },
        { id: "head", parent: "neck", offset: [0, 0], length: 0, shape: "head_oval", r1: 4.6, r2: 4.0, z: 1.5, fill: "skin", features: { eyes: { dx: 1.8, dy: -0.4, w: 1.4, h: 1.8, color: "eyes" } } },
        { id: "arm_far_upper", parent: "chest", offset: [-1.2, 0.5], length: 6.5, angle: 175, r1: 1.4, r2: 1.2, z: 0.1, fill: "skin_shadow" },
        { id: "arm_far_lower", parent: "arm_far_upper", offset: [0, 0], length: 5.5, angle: 10, r1: 1.2, r2: 1.0, z: 0.15, fill: "skin_shadow" },
        { id: "leg_far_thigh", parent: "pelvis", offset: [-1.2, 0], length: 7.5, angle: 180, r1: 1.8, r2: 1.4, z: 0.2, fill: "skin_shadow" },
        { id: "leg_far_shin", parent: "leg_far_thigh", offset: [0, 0], length: 7.0, angle: 0, r1: 1.4, r2: 1.2, z: 0.25, fill: "skin_shadow" },
        { id: "foot_far", parent: "leg_far_shin", offset: [0, 0], length: 2.8, angle: -75, r1: 1.3, r2: 1.0, z: 0.3, fill: "skin_shadow" },
        { id: "leg_near_thigh", parent: "pelvis", offset: [1.2, 0], length: 7.5, angle: 180, r1: 1.9, r2: 1.5, z: 2.1, fill: "skin" },
        { id: "leg_near_shin", parent: "leg_near_thigh", offset: [0, 0], length: 7.0, angle: 0, r1: 1.5, r2: 1.3, z: 2.2, fill: "skin" },
        { id: "foot_near", parent: "leg_near_shin", offset: [0, 0], length: 2.8, angle: -75, r1: 1.4, r2: 1.1, z: 2.3, fill: "skin" },
        { id: "arm_near_upper", parent: "chest", offset: [1.2, 0.5], length: 6.5, angle: 175, r1: 1.5, r2: 1.3, z: 2.6, fill: "skin" },
        { id: "arm_near_lower", parent: "arm_near_upper", offset: [0, 0], length: 5.5, angle: 10, r1: 1.3, r2: 1.1, z: 2.7, fill: "skin" }
      ]
    },

    orc: {
      id: "orc",
      name: "Orc Berserker (Heavy Bulky)",
      desc: "Massive green-skinned bruiser with broad muscular torso and heavy limb capsules.",
      width: 48,
      height: 48,
      palette: {
        skin: "#4ade80",
        skin_hi: "#86efac",
        skin_dark: "#16a34a",
        skin_shadow: "#14532d",
        eyes: "#facc15",
        linen: "#78350f",
        linen_dark: "#451a03"
      },
      bones: [
        { id: "pelvis", x: 24, y: 25, length: 3.2, angle: -90, r1: 4.8, r2: 4.8, z: 1.0, fill: "linen_dark" },
        { id: "torso", parent: "pelvis", offset: [0, 0], length: 5.0, angle: 0, r1: 4.8, r2: 5.2, z: 1.1, fill: "linen" },
        { id: "chest", parent: "torso", offset: [0, 0], length: 4.5, angle: 0, r1: 5.2, r2: 4.8, z: 1.2, fill: "skin" },
        { id: "neck", parent: "chest", offset: [0, 0], length: 4.2, angle: 0, r1: 2.8, r2: 2.8, z: 1.3, fill: "skin_dark" },
        { id: "head", parent: "neck", offset: [0, 0], length: 0, shape: "head_oval", r1: 5.4, r2: 5.0, z: 1.5, fill: "skin", features: { eyes: { dx: 2.2, dy: -0.6, w: 2.0, h: 2.0, color: "eyes" } } },
        { id: "arm_far_upper", parent: "chest", offset: [-1.8, 0.5], length: 7.0, angle: 175, r1: 3.0, r2: 2.6, z: 0.1, fill: "skin_shadow" },
        { id: "arm_far_lower", parent: "arm_far_upper", offset: [0, 0], length: 6.0, angle: 10, r1: 2.6, r2: 2.4, z: 0.15, fill: "skin_shadow" },
        { id: "leg_far_thigh", parent: "pelvis", offset: [-1.6, 0], length: 8.0, angle: 180, r1: 3.6, r2: 3.0, z: 0.2, fill: "skin_shadow" },
        { id: "leg_far_shin", parent: "leg_far_thigh", offset: [0, 0], length: 7.2, angle: 0, r1: 3.0, r2: 2.6, z: 0.25, fill: "skin_shadow" },
        { id: "foot_far", parent: "leg_far_shin", offset: [0, 0], length: 3.5, angle: -75, r1: 2.6, r2: 2.2, z: 0.3, fill: "linen_dark" },
        { id: "leg_near_thigh", parent: "pelvis", offset: [1.6, 0], length: 8.0, angle: 180, r1: 3.8, r2: 3.2, z: 2.1, fill: "skin" },
        { id: "leg_near_shin", parent: "leg_near_thigh", offset: [0, 0], length: 7.2, angle: 0, r1: 3.2, r2: 2.8, z: 2.2, fill: "skin" },
        { id: "foot_near", parent: "leg_near_shin", offset: [0, 0], length: 3.5, angle: -75, r1: 2.8, r2: 2.4, z: 2.3, fill: "linen_dark" },
        { id: "arm_near_upper", parent: "chest", offset: [1.8, 0.5], length: 7.0, angle: 175, r1: 3.2, r2: 2.8, z: 2.6, fill: "skin" },
        { id: "arm_near_lower", parent: "arm_near_upper", offset: [0, 0], length: 6.0, angle: 10, r1: 2.8, r2: 2.6, z: 2.7, fill: "skin" }
      ]
    }
  };

  // ==========================================================================
  // 4. MODULAR EQUIPMENT CATALOG
  // ==========================================================================
  const ITEMS = {
    // ------------------------------------------------------------------------
    // HEADGEAR (slot: head)
    // ------------------------------------------------------------------------
    none: {
      id: "none",
      slot: "head",
      name: "None (Bare)",
      stats: { def: 0, weight: 0 },
      bones: []
    },

    iron_helm: {
      id: "iron_helm",
      slot: "head",
      name: "Knight Steel Bascinet",
      stats: { def: 8, weight: 3.5 },
      bones: [
        { id: "eq_helm_dome", parent: "head", offset: [0, -1.2], length: 0, shape: "head_oval", r1: 5.6, r2: 5.0, z: 1.8, fill: "gear_base" },
        { id: "eq_helm_brow", parent: "head", offset: [1.2, -0.6], length: 2.5, angle: 10, r1: 1.5, r2: 1.2, z: 1.85, fill: "gear_hi" },
        { id: "eq_helm_crest", parent: "head", offset: [-0.5, -4.5], length: 3.0, angle: -75, r1: 1.2, r2: 0.6, z: 1.9, fill: "trim" }
      ]
    },

    wizard_hood: {
      id: "wizard_hood",
      slot: "head",
      name: "Archmage Arcane Hood",
      stats: { def: 4, weight: 1.0, mana: 25 },
      bones: [
        { id: "eq_hood_dome", parent: "head", offset: [0, -1.0], length: 0, shape: "head_oval", r1: 5.8, r2: 5.2, z: 1.8, fill: "gear_dark" },
        { id: "eq_hood_tip", parent: "head", offset: [-2.0, -3.8], length: 4.5, angle: -145, r1: 2.2, r2: 0.8, z: 1.75, fill: "gear_dark" },
        { id: "eq_hood_cowl", parent: "head", offset: [0, 2.5], length: 2.0, angle: 90, r1: 4.6, r2: 3.8, z: 1.82, fill: "gear_base" }
      ]
    },

    horned_helm: {
      id: "horned_helm",
      slot: "head",
      name: "Barbarian Horned Helm",
      stats: { def: 7, weight: 4.0, atk: 5 },
      bones: [
        { id: "eq_horn_skull", parent: "head", offset: [0, -1.0], length: 0, shape: "head_oval", r1: 5.5, r2: 4.8, z: 1.8, fill: "gear_base" },
        { id: "eq_horn_near", parent: "head", offset: [1.5, -3.0], length: 4.5, angle: -45, r1: 1.8, r2: 0.6, z: 1.9, fill: "trim_hi" },
        { id: "eq_horn_far", parent: "head", offset: [-2.0, -3.2], length: 4.5, angle: -125, r1: 1.6, r2: 0.5, z: 1.45, fill: "trim" }
      ]
    },

    golden_crown: {
      id: "golden_crown",
      slot: "head",
      name: "Imperial Jeweled Crown",
      stats: { def: 5, weight: 1.5, charisma: 20 },
      bones: [
        { id: "eq_crown_band", parent: "head", offset: [0.2, -2.8], length: 3.0, angle: 10, r1: 4.6, r2: 4.6, shape: "head_oval", z: 1.85, fill: "trim" },
        { id: "eq_crown_spire_mid", parent: "head", offset: [0.5, -4.5], length: 2.8, angle: -90, r1: 1.2, r2: 0.4, z: 1.9, fill: "trim_hi" },
        { id: "eq_crown_spire_left", parent: "head", offset: [-2.2, -4.0], length: 2.2, angle: -105, r1: 1.0, r2: 0.4, z: 1.88, fill: "trim_hi" },
        { id: "eq_crown_spire_right", parent: "head", offset: [2.5, -4.0], length: 2.2, angle: -75, r1: 1.0, r2: 0.4, z: 1.88, fill: "trim_hi" }
      ]
    },

    shadow_cowl: {
      id: "shadow_cowl",
      slot: "head",
      name: "Shadow Assassin Cowl",
      stats: { def: 4, weight: 0.8, crit: 10 },
      bones: [
        { id: "eq_cowl_dome", parent: "head", offset: [0, -0.8], length: 0, shape: "head_oval", r1: 5.4, r2: 4.7, z: 1.8, fill: "gear_dark" },
        { id: "eq_cowl_mask", parent: "head", offset: [1.5, 0.8], length: 2.0, angle: 30, r1: 2.4, r2: 1.8, z: 1.85, fill: "gear_shadow" }
      ]
    },

    // ------------------------------------------------------------------------
    // TORSO ARMOR (slot: torso)
    // ------------------------------------------------------------------------
    steel_cuirass: {
      id: "steel_cuirass",
      slot: "torso",
      name: "Steel Plate Cuirass",
      stats: { def: 18, weight: 8.5 },
      bones: [
        { id: "eq_chest_plate", parent: "chest", offset: [0, 0], length: 4.2, angle: 0, r1: 4.8, r2: 5.2, z: 1.35, fill: "gear_base" },
        { id: "eq_chest_rim", parent: "chest", offset: [0.6, -1.0], length: 3.8, angle: 0, r1: 1.6, r2: 1.4, z: 1.4, fill: "gear_hi" },
        { id: "eq_torso_waist", parent: "torso", offset: [0, 0], length: 4.8, angle: 0, r1: 4.2, r2: 4.6, z: 1.32, fill: "gear_shadow" }
      ]
    },

    leather_vest: {
      id: "leather_vest",
      slot: "torso",
      name: "Studded Leather Doublet",
      stats: { def: 10, weight: 3.2, stamina: 10 },
      bones: [
        { id: "eq_vest_chest", parent: "chest", offset: [0, 0], length: 4.0, angle: 0, r1: 4.5, r2: 4.8, z: 1.35, fill: "gear_shadow" },
        { id: "eq_vest_buckle", parent: "chest", offset: [1.2, 0.5], length: 2.0, angle: 90, r1: 1.2, r2: 1.2, z: 1.4, fill: "trim" },
        { id: "eq_vest_waist", parent: "torso", offset: [0, 0], length: 4.5, angle: 0, r1: 3.9, r2: 4.3, z: 1.32, fill: "gear_dark" }
      ]
    },

    mage_robe: {
      id: "mage_robe",
      slot: "torso",
      name: "Arcane Draped Robe",
      stats: { def: 6, weight: 2.0, mana: 40 },
      bones: [
        { id: "eq_robe_chest", parent: "chest", offset: [0, 0], length: 4.5, angle: 0, r1: 4.6, r2: 5.0, z: 1.35, fill: "gear_base" },
        { id: "eq_robe_trim", parent: "chest", offset: [0.8, -0.5], length: 4.2, angle: 0, r1: 1.4, r2: 1.2, z: 1.4, fill: "trim_hi" },
        { id: "eq_robe_mantel", parent: "torso", offset: [0, 0], length: 5.2, angle: 0, r1: 4.5, r2: 5.4, z: 1.34, fill: "gear_dark" }
      ]
    },

    bone_carapace: {
      id: "bone_carapace",
      slot: "torso",
      name: "Undead Bone Carapace",
      stats: { def: 14, weight: 6.0, resist: 15 },
      bones: [
        { id: "eq_bone_ribs", parent: "chest", offset: [0, 0], length: 4.2, angle: 0, r1: 4.6, r2: 5.2, z: 1.35, fill: "gear_hi" },
        { id: "eq_bone_spine", parent: "torso", offset: [-0.8, 0], length: 4.8, angle: 0, r1: 3.8, r2: 4.2, z: 1.32, fill: "gear_base" }
      ]
    },

    royal_tunic: {
      id: "royal_tunic",
      slot: "torso",
      name: "Regal Velvet Tunic",
      stats: { def: 8, weight: 2.5, charisma: 15 },
      bones: [
        { id: "eq_tunic_chest", parent: "chest", offset: [0, 0], length: 4.2, angle: 0, r1: 4.6, r2: 4.9, z: 1.35, fill: "gear_base" },
        { id: "eq_tunic_sash", parent: "chest", offset: [0.5, 0], length: 4.0, angle: 25, r1: 1.5, r2: 1.3, z: 1.42, fill: "trim" },
        { id: "eq_tunic_waist", parent: "torso", offset: [0, 0], length: 4.8, angle: 0, r1: 4.2, r2: 4.6, z: 1.32, fill: "gear_shadow" }
      ]
    },

    // ------------------------------------------------------------------------
    // GAUNTLETS (slot: hands)
    // ------------------------------------------------------------------------
    steel_gauntlets: {
      id: "steel_gauntlets",
      slot: "hands",
      name: "Armored Steel Vambraces",
      stats: { def: 6, weight: 2.5 },
      bones: [
        { id: "eq_gaunt_near_cuff", parent: "arm_near_lower", offset: [0, 0], length: 5.2, angle: 0, r1: 2.3, r2: 2.1, z: 2.8, fill: "gear_base" },
        { id: "eq_gaunt_near_trim", parent: "arm_near_lower", offset: [0.5, 0], length: 4.8, angle: 0, r1: 1.2, r2: 1.0, z: 2.85, fill: "gear_hi" },
        { id: "eq_gaunt_far_cuff", parent: "arm_far_lower", offset: [0, 0], length: 5.0, angle: 0, r1: 2.1, r2: 1.9, z: 0.18, fill: "gear_shadow" }
      ]
    },

    leather_gloves: {
      id: "leather_gloves",
      slot: "hands",
      name: "Supple Archer Bracers",
      stats: { def: 3, weight: 1.0, dex: 8 },
      bones: [
        { id: "eq_glove_near", parent: "arm_near_lower", offset: [0, 0], length: 5.0, angle: 0, r1: 2.1, r2: 1.9, z: 2.8, fill: "gear_shadow" },
        { id: "eq_glove_far", parent: "arm_far_lower", offset: [0, 0], length: 4.8, angle: 0, r1: 1.9, r2: 1.7, z: 0.18, fill: "gear_dark" }
      ]
    },

    golden_bracers: {
      id: "golden_bracers",
      slot: "hands",
      name: "Runic Golden Armbands",
      stats: { def: 5, weight: 1.2, magic_dmg: 12 },
      bones: [
        { id: "eq_bracer_near", parent: "arm_near_lower", offset: [0, 0], length: 4.8, angle: 0, r1: 2.3, r2: 2.1, z: 2.8, fill: "trim" },
        { id: "eq_bracer_near_gem", parent: "arm_near_lower", offset: [0.8, 1.5], length: 1.5, angle: 0, r1: 1.2, r2: 1.0, z: 2.86, fill: "trim_hi" },
        { id: "eq_bracer_far", parent: "arm_far_lower", offset: [0, 0], length: 4.6, angle: 0, r1: 2.1, r2: 1.9, z: 0.18, fill: "gear_shadow" }
      ]
    },

    shadow_wraps: {
      id: "shadow_wraps",
      slot: "hands",
      name: "Shadow Hand Wraps",
      stats: { def: 2, weight: 0.5, speed: 10 },
      bones: [
        { id: "eq_wrap_near", parent: "arm_near_lower", offset: [0, 0], length: 5.0, angle: 0, r1: 2.0, r2: 1.8, z: 2.8, fill: "gear_dark" },
        { id: "eq_wrap_far", parent: "arm_far_lower", offset: [0, 0], length: 4.8, angle: 0, r1: 1.8, r2: 1.6, z: 0.18, fill: "gear_shadow" }
      ]
    },

    // ------------------------------------------------------------------------
    // LEGS (slot: legs)
    // ------------------------------------------------------------------------
    plate_greaves: {
      id: "plate_greaves",
      slot: "legs",
      name: "Steel Plate Greaves",
      stats: { def: 12, weight: 6.0 },
      bones: [
        { id: "eq_greave_near_thigh", parent: "leg_near_thigh", offset: [0, 0], length: 7.2, angle: 0, r1: 3.2, r2: 2.7, z: 2.22, fill: "gear_base" },
        { id: "eq_greave_near_shin", parent: "leg_near_shin", offset: [0, 0], length: 6.8, angle: 0, r1: 2.7, r2: 2.3, z: 2.25, fill: "gear_base" },
        { id: "eq_greave_near_knee", parent: "leg_near_shin", offset: [0.5, -0.5], length: 2.0, angle: 0, r1: 2.0, r2: 1.8, z: 2.28, fill: "gear_hi" },
        { id: "eq_greave_far_thigh", parent: "leg_far_thigh", offset: [0, 0], length: 7.0, angle: 0, r1: 3.0, r2: 2.5, z: 0.22, fill: "gear_shadow" },
        { id: "eq_greave_far_shin", parent: "leg_far_shin", offset: [0, 0], length: 6.6, angle: 0, r1: 2.5, r2: 2.1, z: 0.26, fill: "gear_dark" }
      ]
    },

    chainmail_chausses: {
      id: "chainmail_chausses",
      slot: "legs",
      name: "Chainmail Chausses",
      stats: { def: 9, weight: 4.5 },
      bones: [
        { id: "eq_chain_near_thigh", parent: "leg_near_thigh", offset: [0, 0], length: 7.0, angle: 0, r1: 3.0, r2: 2.5, z: 2.21, fill: "gear_shadow" },
        { id: "eq_chain_near_shin", parent: "leg_near_shin", offset: [0, 0], length: 6.6, angle: 0, r1: 2.5, r2: 2.1, z: 2.23, fill: "gear_shadow" },
        { id: "eq_chain_far_thigh", parent: "leg_far_thigh", offset: [0, 0], length: 6.8, angle: 0, r1: 2.8, r2: 2.3, z: 0.21, fill: "gear_dark" },
        { id: "eq_chain_far_shin", parent: "leg_far_shin", offset: [0, 0], length: 6.4, angle: 0, r1: 2.3, r2: 2.0, z: 0.24, fill: "gear_dark" }
      ]
    },

    arcane_skirt: {
      id: "arcane_skirt",
      slot: "legs",
      name: "Pleated Spellcaster Robe-Skirt",
      stats: { def: 5, weight: 2.0, mana: 20 },
      bones: [
        { id: "eq_skirt_core", parent: "pelvis", offset: [0, 0], length: 11.0, angle: 90, r1: 4.2, r2: 6.0, z: 2.15, fill: "gear_base" },
        { id: "eq_skirt_hem", parent: "pelvis", offset: [0.5, 9.0], length: 2.5, angle: 0, r1: 5.5, r2: 5.5, z: 2.18, fill: "trim" }
      ]
    },

    leather_pants: {
      id: "leather_pants",
      slot: "legs",
      name: "Ranger Leather Breeches",
      stats: { def: 6, weight: 2.8, agility: 8 },
      bones: [
        { id: "eq_pants_near_thigh", parent: "leg_near_thigh", offset: [0, 0], length: 7.0, angle: 0, r1: 2.9, r2: 2.4, z: 2.21, fill: "gear_shadow" },
        { id: "eq_pants_near_shin", parent: "leg_near_shin", offset: [0, 0], length: 6.6, angle: 0, r1: 2.4, r2: 2.0, z: 2.23, fill: "gear_dark" },
        { id: "eq_pants_far_thigh", parent: "leg_far_thigh", offset: [0, 0], length: 6.8, angle: 0, r1: 2.7, r2: 2.2, z: 0.21, fill: "gear_dark" },
        { id: "eq_pants_far_shin", parent: "leg_far_shin", offset: [0, 0], length: 6.4, angle: 0, r1: 2.2, r2: 1.9, z: 0.24, fill: "gear_dark" }
      ]
    },

    // ------------------------------------------------------------------------
    // FOOTWEAR (slot: feet)
    // ------------------------------------------------------------------------
    iron_sabatons: {
      id: "iron_sabatons",
      slot: "feet",
      name: "Plated Steel Sabatons",
      stats: { def: 6, weight: 3.0 },
      bones: [
        { id: "eq_sab_near", parent: "foot_near", offset: [0, 0], length: 3.5, angle: 0, r1: 2.4, r2: 1.8, z: 2.35, fill: "gear_base" },
        { id: "eq_sab_near_toe", parent: "foot_near", offset: [2.5, 0.2], length: 1.8, angle: 0, r1: 1.6, r2: 1.0, z: 2.38, fill: "gear_hi" },
        { id: "eq_sab_far", parent: "foot_far", offset: [0, 0], length: 3.2, angle: 0, r1: 2.2, r2: 1.6, z: 0.32, fill: "gear_shadow" }
      ]
    },

    leather_boots: {
      id: "leather_boots",
      slot: "feet",
      name: "Sturdy Adventurer Boots",
      stats: { def: 4, weight: 1.8, speed: 5 },
      bones: [
        { id: "eq_boot_near", parent: "foot_near", offset: [0, 0], length: 3.2, angle: 0, r1: 2.2, r2: 1.7, z: 2.35, fill: "gear_shadow" },
        { id: "eq_boot_far", parent: "foot_far", offset: [0, 0], length: 3.0, angle: 0, r1: 2.0, r2: 1.5, z: 0.32, fill: "gear_dark" }
      ]
    },

    winged_sandals: {
      id: "winged_sandals",
      slot: "feet",
      name: "Hermes Winged Sandals",
      stats: { def: 3, weight: 0.8, speed: 25 },
      bones: [
        { id: "eq_sandal_near", parent: "foot_near", offset: [0, 0], length: 3.0, angle: 0, r1: 2.0, r2: 1.5, z: 2.35, fill: "trim" },
        { id: "eq_wing_near", parent: "foot_near", offset: [-0.5, -1.8], length: 3.2, angle: -140, r1: 1.4, r2: 0.4, z: 2.4, fill: "gear_hi" },
        { id: "eq_sandal_far", parent: "foot_far", offset: [0, 0], length: 2.8, angle: 0, r1: 1.8, r2: 1.3, z: 0.32, fill: "gear_shadow" }
      ]
    },

    shadow_boots: {
      id: "shadow_boots",
      slot: "feet",
      name: "Silent Shadow Tabi",
      stats: { def: 3, weight: 0.6, stealth: 20 },
      bones: [
        { id: "eq_tabi_near", parent: "foot_near", offset: [0, 0], length: 3.0, angle: 0, r1: 2.0, r2: 1.6, z: 2.35, fill: "gear_dark" },
        { id: "eq_tabi_far", parent: "foot_far", offset: [0, 0], length: 2.8, angle: 0, r1: 1.8, r2: 1.4, z: 0.32, fill: "gear_shadow" }
      ]
    },

    // ------------------------------------------------------------------------
    // MAIN-HAND WEAPON (slot: weapon, attached to arm_near_lower)
    // ------------------------------------------------------------------------
    runed_broadsword: {
      id: "runed_broadsword",
      slot: "weapon",
      name: "Runed Broadsword",
      stats: { atk: 28, weight: 4.5, crit: 12 },
      bones: [
        { id: "eq_sw_blade", parent: "arm_near_lower", offset: [0, 0], length: 17.0, angle: -85, r1: 2.0, r2: 0.6, z: 3.1, fill: "gear_hi" },
        { id: "eq_sw_fuller", parent: "arm_near_lower", offset: [0.2, 0], length: 12.0, angle: -85, r1: 0.8, r2: 0.4, z: 3.15, fill: "trim_hi" },
        { id: "eq_sw_guard", parent: "arm_near_lower", offset: [0, 0], length: 6.0, angle: 5, r1: 1.5, r2: 1.5, z: 3.12, fill: "trim" },
        { id: "eq_sw_pommel", parent: "arm_near_lower", offset: [0, 0], length: 3.0, angle: 95, r1: 1.2, r2: 1.6, z: 3.1, fill: "gear_dark" }
      ]
    },

    battle_axe: {
      id: "battle_axe",
      slot: "weapon",
      name: "Bearded Battle Axe",
      stats: { atk: 35, weight: 7.0, armor_pen: 20 },
      bones: [
        { id: "eq_axe_shaft", parent: "arm_near_lower", offset: [0, 0], length: 18.0, angle: -85, r1: 1.4, r2: 1.4, z: 3.08, fill: "gear_shadow" },
        { id: "eq_axe_blade_front", parent: "arm_near_lower", offset: [0.8, -13.0], length: 5.5, angle: 5, r1: 3.6, r2: 1.2, z: 3.15, fill: "gear_hi" },
        { id: "eq_axe_blade_rear", parent: "arm_near_lower", offset: [-0.8, -13.0], length: 4.0, angle: 185, r1: 2.4, r2: 1.0, z: 3.14, fill: "gear_base" },
        { id: "eq_axe_spike", parent: "arm_near_lower", offset: [0, -14.0], length: 4.5, angle: -85, r1: 1.2, r2: 0.4, z: 3.16, fill: "gear_hi" }
      ]
    },

    arcane_staff: {
      id: "arcane_staff",
      slot: "weapon",
      name: "Sapphire Archmage Staff",
      stats: { atk: 15, magic_dmg: 45, mana: 50 },
      bones: [
        { id: "eq_stf_shaft", parent: "arm_near_lower", offset: [0, 0], length: 22.0, angle: -88, r1: 1.4, r2: 1.4, z: 3.08, fill: "gear_dark" },
        { id: "eq_stf_head", parent: "arm_near_lower", offset: [0, -18.0], length: 5.0, angle: -88, r1: 2.4, r2: 2.8, z: 3.12, fill: "trim" },
        { id: "eq_stf_orb", parent: "arm_near_lower", offset: [0, -22.0], length: 0, shape: "head_oval", r1: 3.2, r2: 3.2, z: 3.2, fill: "trim_hi" }
      ]
    },

    assassin_dagger: {
      id: "assassin_dagger",
      slot: "weapon",
      name: "Venomous Stiletto Dagger",
      stats: { atk: 20, weight: 1.2, crit: 30, poison: 15 },
      bones: [
        { id: "eq_dag_blade", parent: "arm_near_lower", offset: [0, 0], length: 9.0, angle: -80, r1: 1.4, r2: 0.4, z: 3.1, fill: "gear_hi" },
        { id: "eq_dag_guard", parent: "arm_near_lower", offset: [0, 0], length: 3.5, angle: 10, r1: 1.0, r2: 1.0, z: 3.12, fill: "trim" },
        { id: "eq_dag_grip", parent: "arm_near_lower", offset: [0, 0], length: 2.5, angle: 100, r1: 1.0, r2: 1.2, z: 3.1, fill: "gear_dark" }
      ]
    },

    golden_spear: {
      id: "golden_spear",
      slot: "weapon",
      name: "Gleaming Sun Spear",
      stats: { atk: 32, weight: 5.0, reach: 25 },
      bones: [
        { id: "eq_spr_shaft", parent: "arm_near_lower", offset: [0, 0], length: 26.0, angle: -85, r1: 1.3, r2: 1.3, z: 3.08, fill: "gear_shadow" },
        { id: "eq_spr_head", parent: "arm_near_lower", offset: [0, -20.0], length: 7.0, angle: -85, r1: 2.6, r2: 0.5, z: 3.15, fill: "trim_hi" },
        { id: "eq_spr_cuff", parent: "arm_near_lower", offset: [0, -19.0], length: 2.5, angle: 5, r1: 2.0, r2: 2.0, z: 3.16, fill: "trim" }
      ]
    },

    // ------------------------------------------------------------------------
    // OFF-HAND SHIELD (slot: shield, attached to arm_far_lower or arm_far_upper)
    // ------------------------------------------------------------------------
    kite_shield: {
      id: "kite_shield",
      slot: "shield",
      name: "Royal Kite Shield",
      stats: { def: 22, weight: 6.5, block: 35 },
      bones: [
        { id: "eq_shd_body", parent: "arm_far_upper", offset: [0.5, 2.0], length: 11.0, angle: 85, r1: 5.0, r2: 3.0, z: 0.08, fill: "gear_base" },
        { id: "eq_shd_boss", parent: "arm_far_upper", offset: [0.8, 5.0], length: 0, shape: "head_oval", r1: 2.6, r2: 2.6, z: 0.09, fill: "trim" },
        { id: "eq_shd_cross", parent: "arm_far_upper", offset: [0.8, 5.0], length: 7.0, angle: 85, r1: 1.2, r2: 1.0, z: 0.095, fill: "trim_hi" }
      ]
    },

    round_buckler: {
      id: "round_buckler",
      slot: "shield",
      name: "Viking Bronze Buckler",
      stats: { def: 14, weight: 3.0, parry: 25 },
      bones: [
        { id: "eq_bck_round", parent: "arm_far_lower", offset: [0, 0], length: 0, shape: "head_oval", r1: 5.4, r2: 5.4, z: 0.08, fill: "gear_shadow" },
        { id: "eq_bck_boss", parent: "arm_far_lower", offset: [0, 0], length: 0, shape: "head_oval", r1: 2.2, r2: 2.2, z: 0.09, fill: "trim" }
      ]
    },

    spellbook: {
      id: "spellbook",
      slot: "shield",
      name: "Arcane Tome of Wisdom",
      stats: { def: 5, magic_dmg: 20, mana: 35 },
      bones: [
        { id: "eq_tome_cover", parent: "arm_far_lower", offset: [1.0, 1.0], length: 6.5, angle: 85, r1: 4.2, r2: 4.2, z: 0.08, fill: "gear_dark" },
        { id: "eq_tome_pages", parent: "arm_far_lower", offset: [1.2, 1.2], length: 5.5, angle: 85, r1: 3.6, r2: 3.6, z: 0.085, fill: "gear_hi" },
        { id: "eq_tome_sigil", parent: "arm_far_lower", offset: [1.5, 4.0], length: 0, shape: "head_oval", r1: 1.8, r2: 1.8, z: 0.09, fill: "trim_hi" }
      ]
    },

    dual_dagger: {
      id: "dual_dagger",
      slot: "shield",
      name: "Off-Hand Parrying Dagger",
      stats: { atk: 16, weight: 1.0, parry: 20 },
      bones: [
        { id: "eq_dualdag_blade", parent: "arm_far_lower", offset: [0, 0], length: 8.0, angle: -80, r1: 1.3, r2: 0.4, z: 0.08, fill: "gear_hi" },
        { id: "eq_dualdag_guard", parent: "arm_far_lower", offset: [0, 0], length: 3.0, angle: 10, r1: 0.9, r2: 0.9, z: 0.085, fill: "trim" }
      ]
    },

    tower_shield: {
      id: "tower_shield",
      slot: "shield",
      name: "Iron Fortress Tower Shield",
      stats: { def: 35, weight: 12.0, block: 60, speed: -10 },
      bones: [
        { id: "eq_twr_slab", parent: "arm_far_upper", offset: [0.5, 1.0], length: 16.0, angle: 90, r1: 5.8, r2: 5.5, z: 0.08, fill: "gear_dark" },
        { id: "eq_twr_plate", parent: "arm_far_upper", offset: [0.8, 2.0], length: 14.0, angle: 90, r1: 4.8, r2: 4.5, z: 0.085, fill: "gear_base" },
        { id: "eq_twr_slit", parent: "arm_far_upper", offset: [1.0, 3.0], length: 3.0, angle: 0, r1: 1.0, r2: 1.0, z: 0.09, fill: "gear_shadow" }
      ]
    },

    // ------------------------------------------------------------------------
    // BACK / CAPE (slot: back, attached to chest)
    // ------------------------------------------------------------------------
    red_cape: {
      id: "red_cape",
      slot: "back",
      name: "Flowing Crimson Knight Cape",
      stats: { def: 2, weight: 1.0, charisma: 10 },
      bones: [
        { id: "eq_cape_root", parent: "chest", offset: [-1.5, 0], length: 6.0, angle: 145, r1: 3.5, r2: 4.8, z: -0.4, fill: "gear_shadow" },
        { id: "eq_cape_mid", parent: "eq_cape_root", offset: [0, 0], length: 9.0, angle: -10, r1: 4.8, r2: 6.2, z: -0.42, fill: "gear_base" },
        { id: "eq_cape_tail", parent: "eq_cape_mid", offset: [0, 0], length: 7.0, angle: 15, r1: 6.2, r2: 7.5, z: -0.44, fill: "gear_dark" }
      ]
    },

    shadow_cloak: {
      id: "shadow_cloak",
      slot: "back",
      name: "Tattered Stealth Shadow Cloak",
      stats: { def: 3, weight: 0.8, stealth: 25 },
      bones: [
        { id: "eq_cloak_root", parent: "chest", offset: [-1.2, 0], length: 7.0, angle: 140, r1: 3.2, r2: 4.5, z: -0.4, fill: "gear_dark" },
        { id: "eq_cloak_mid", parent: "eq_cloak_root", offset: [0, 0], length: 9.0, angle: -15, r1: 4.5, r2: 6.0, z: -0.42, fill: "gear_shadow" },
        { id: "eq_cloak_tail", parent: "eq_cloak_mid", offset: [0, 0], length: 6.0, angle: 20, r1: 6.0, r2: 7.0, z: -0.44, fill: "gear_dark" }
      ]
    },

    elven_wings: {
      id: "elven_wings",
      slot: "back",
      name: "Celestial Translucent Wings",
      stats: { def: 1, weight: 0.2, flight: true, speed: 20 },
      bones: [
        { id: "eq_wing_far", parent: "chest", offset: [-2.0, -2.0], length: 12.0, angle: -130, r1: 3.0, r2: 1.0, z: -0.45, fill: "trim_hi" },
        { id: "eq_wing_near", parent: "chest", offset: [1.5, -2.0], length: 14.0, angle: -50, r1: 3.5, r2: 1.2, z: 2.9, fill: "trim_hi" }
      ]
    }
  };

  // ==========================================================================
  // 5. PRE-CONFIGURED LOADOUTS (ARCHETYPES)
  // ==========================================================================
  const LOADOUTS = {
    paladin: {
      id: "paladin",
      name: "🛡️ Paladin Knight",
      mannequin: "humanoid",
      theme: "steel",
      slots: {
        head: "iron_helm",
        torso: "steel_cuirass",
        hands: "steel_gauntlets",
        legs: "plate_greaves",
        feet: "iron_sabatons",
        weapon: "runed_broadsword",
        shield: "kite_shield",
        back: "red_cape"
      }
    },
    archmage: {
      id: "archmage",
      name: "🔮 High Archmage",
      mannequin: "humanoid",
      theme: "cobalt",
      slots: {
        head: "wizard_hood",
        torso: "mage_robe",
        hands: "golden_bracers",
        legs: "arcane_skirt",
        feet: "winged_sandals",
        weapon: "arcane_staff",
        shield: "spellbook",
        back: "red_cape"
      }
    },
    assassin: {
      id: "assassin",
      name: "🗡️ Shadow Assassin",
      mannequin: "humanoid",
      theme: "dark_iron",
      slots: {
        head: "shadow_cowl",
        torso: "leather_vest",
        hands: "shadow_wraps",
        legs: "leather_pants",
        feet: "shadow_boots",
        weapon: "assassin_dagger",
        shield: "dual_dagger",
        back: "shadow_cloak"
      }
    },
    death_knight: {
      id: "death_knight",
      name: "💀 Undead Death Knight",
      mannequin: "skeleton",
      theme: "obsidian",
      slots: {
        head: "horned_helm",
        torso: "bone_carapace",
        hands: "steel_gauntlets",
        legs: "chainmail_chausses",
        feet: "iron_sabatons",
        weapon: "battle_axe",
        shield: "tower_shield",
        back: "shadow_cloak"
      }
    },
    sovereign: {
      id: "sovereign",
      name: "👑 Golden Sovereign",
      mannequin: "humanoid",
      theme: "gold",
      slots: {
        head: "golden_crown",
        torso: "royal_tunic",
        hands: "golden_bracers",
        legs: "chainmail_chausses",
        feet: "winged_sandals",
        weapon: "golden_spear",
        shield: "round_buckler",
        back: "red_cape"
      }
    },
    orc_berserker: {
      id: "orc_berserker",
      name: "🧌 Orc Berserker",
      mannequin: "orc",
      theme: "crimson",
      slots: {
        head: "horned_helm",
        torso: "leather_vest",
        hands: "leather_gloves",
        legs: "leather_pants",
        feet: "leather_boots",
        weapon: "battle_axe",
        shield: "round_buckler",
        back: "none"
      }
    },
    chibi_hero: {
      id: "chibi_hero",
      name: "👶 Chibi Hero",
      mannequin: "chibi",
      theme: "steel",
      slots: {
        head: "iron_helm",
        torso: "steel_cuirass",
        hands: "steel_gauntlets",
        legs: "plate_greaves",
        feet: "iron_sabatons",
        weapon: "runed_broadsword",
        shield: "round_buckler",
        back: "red_cape"
      }
    },
    unarmored: {
      id: "unarmored",
      name: "🥋 Bare Mannequin",
      mannequin: "humanoid",
      theme: "steel",
      slots: {
        head: "none",
        torso: "none",
        hands: "none",
        legs: "none",
        feet: "none",
        weapon: "none",
        shield: "none",
        back: "none"
      }
    }
  };

  // ==========================================================================
  // 6. PROCEDURAL KINEMATIC ACTIONS & MOTIONS
  // ==========================================================================
  const ACTIONS = {
    walk: {
      id: "walk",
      name: "Walk Cycle",
      frames: 8,
      fps: 8,
      computePose: function (frameIndex, totalFrames) {
        const t = frameIndex / totalFrames;
        const phase = t * 2.0 * Math.PI;

        const bob = -1.5 * Math.abs(Math.sin(phase));
        const torsoTilt = 2.0 * Math.sin(phase);

        const legStride = 24.0 * Math.sin(phase);
        const nearKneeBend = Math.max(0.0, -32.0 * Math.cos(phase));
        const farKneeBend = Math.max(0.0, 32.0 * Math.cos(phase));

        const armSwing = -22.0 * Math.sin(phase);
        const nearElbowBend = Math.max(0.0, 16.0 * Math.sin(phase));
        const farElbowBend = Math.max(0.0, -16.0 * Math.sin(phase));

        const capeWave = 14.0 * Math.sin(phase - 0.8);

        return {
          pelvis: { dy: bob },
          torso: { dAngle: torsoTilt },
          chest: { dAngle: torsoTilt * 0.5 },
          head: { dAngle: -torsoTilt * 0.5 },
          leg_near_thigh: { dAngle: legStride },
          leg_near_shin: { dAngle: nearKneeBend },
          foot_near: { dAngle: -nearKneeBend * 0.5 },
          leg_far_thigh: { dAngle: -legStride },
          leg_far_shin: { dAngle: farKneeBend },
          foot_far: { dAngle: -farKneeBend * 0.5 },
          arm_near_upper: { dAngle: armSwing },
          arm_near_lower: { dAngle: nearElbowBend },
          arm_far_upper: { dAngle: -armSwing },
          arm_far_lower: { dAngle: farElbowBend },
          eq_cape_mid: { dAngle: capeWave },
          eq_cape_tail: { dAngle: capeWave * 1.5 }
        };
      }
    },

    attack: {
      id: "attack",
      name: "Attack Slash",
      frames: 6,
      fps: 10,
      computePose: function (frameIndex, totalFrames) {
        const keyframes = [
          // Frame 0: Stance ready
          {
            pelvis: { dy: 0, dx: 0 },
            torso: { dAngle: 0 },
            chest: { dAngle: 0 },
            head: { dAngle: 0 },
            arm_near_upper: { dAngle: -10 },
            arm_near_lower: { dAngle: 15 },
            arm_far_upper: { dAngle: 10 },
            arm_far_lower: { dAngle: 20 },
            leg_near_thigh: { dAngle: 5 },
            leg_far_thigh: { dAngle: -5 },
            eq_cape_mid: { dAngle: 0 }
          },
          // Frame 1: Windup back
          {
            pelvis: { dy: 0.5, dx: -1 },
            torso: { dAngle: -8 },
            chest: { dAngle: -10 },
            head: { dAngle: -5 },
            arm_near_upper: { dAngle: -55 },
            arm_near_lower: { dAngle: 40 },
            arm_far_upper: { dAngle: 25 },
            arm_far_lower: { dAngle: 30 },
            leg_near_thigh: { dAngle: -10 },
            leg_far_thigh: { dAngle: 10 },
            eq_cape_mid: { dAngle: -15 }
          },
          // Frame 2: Peak back
          {
            pelvis: { dy: 1.0, dx: -2 },
            torso: { dAngle: -14 },
            chest: { dAngle: -16 },
            head: { dAngle: -8 },
            arm_near_upper: { dAngle: -95 },
            arm_near_lower: { dAngle: 65 },
            arm_far_upper: { dAngle: 35 },
            arm_far_lower: { dAngle: 35 },
            leg_near_thigh: { dAngle: -18 },
            leg_far_thigh: { dAngle: 15 },
            eq_cape_mid: { dAngle: -30 }
          },
          // Frame 3: IMPACT SLASH FORWARD!
          {
            pelvis: { dy: -1.0, dx: 3.5 },
            torso: { dAngle: 18 },
            chest: { dAngle: 22 },
            head: { dAngle: 10 },
            arm_near_upper: { dAngle: 65 },
            arm_near_lower: { dAngle: -15 },
            arm_far_upper: { dAngle: -25 },
            arm_far_lower: { dAngle: 15 },
            leg_near_thigh: { dAngle: 26 },
            leg_near_shin: { dAngle: 18 },
            leg_far_thigh: { dAngle: -22 },
            eq_cape_mid: { dAngle: 40 }
          },
          // Frame 4: Overshoot & follow-through
          {
            pelvis: { dy: -0.5, dx: 2.0 },
            torso: { dAngle: 12 },
            chest: { dAngle: 14 },
            head: { dAngle: 6 },
            arm_near_upper: { dAngle: 45 },
            arm_near_lower: { dAngle: 0 },
            arm_far_upper: { dAngle: -15 },
            arm_far_lower: { dAngle: 10 },
            leg_near_thigh: { dAngle: 16 },
            leg_far_thigh: { dAngle: -14 },
            eq_cape_mid: { dAngle: 25 }
          },
          // Frame 5: Recovery reset
          {
            pelvis: { dy: 0, dx: 1.0 },
            torso: { dAngle: 4 },
            chest: { dAngle: 4 },
            head: { dAngle: 2 },
            arm_near_upper: { dAngle: 15 },
            arm_near_lower: { dAngle: 10 },
            arm_far_upper: { dAngle: 0 },
            arm_far_lower: { dAngle: 15 },
            leg_near_thigh: { dAngle: 8 },
            leg_far_thigh: { dAngle: -8 },
            eq_cape_mid: { dAngle: 10 }
          }
        ];
        return keyframes[frameIndex % keyframes.length];
      }
    },

    idle: {
      id: "idle",
      name: "Idle Breathe",
      frames: 6,
      fps: 6,
      computePose: function (frameIndex, totalFrames) {
        const t = frameIndex / totalFrames;
        const phase = t * 2.0 * Math.PI;

        const breatheY = 0.8 * Math.sin(phase);
        const armSway = 2.5 * Math.sin(phase);
        const headTilt = -1.2 * Math.sin(phase);
        const capeWave = 4.0 * Math.sin(phase);

        return {
          pelvis: { dy: breatheY * 0.4 },
          torso: { dy: breatheY * 0.7 },
          chest: { dy: breatheY },
          head: { dAngle: headTilt },
          arm_near_upper: { dAngle: armSway },
          arm_far_upper: { dAngle: -armSway },
          eq_cape_mid: { dAngle: capeWave },
          eq_cape_tail: { dAngle: capeWave * 1.4 }
        };
      }
    },

    hurt: {
      id: "hurt",
      name: "Hurt / Flinch",
      frames: 4,
      fps: 8,
      computePose: function (frameIndex, totalFrames) {
        const keyframes = [
          // Frame 0: Impact recoil
          {
            pelvis: { dx: -3.0, dy: 1.0 },
            torso: { dAngle: -16 },
            chest: { dAngle: -18 },
            head: { dAngle: -22 },
            arm_near_upper: { dAngle: -45 },
            arm_near_lower: { dAngle: 50 },
            arm_far_upper: { dAngle: -40 },
            arm_far_lower: { dAngle: 45 },
            leg_near_thigh: { dAngle: -14 },
            leg_near_shin: { dAngle: 25 },
            eq_cape_mid: { dAngle: -35 }
          },
          // Frame 1: Peak stagger
          {
            pelvis: { dx: -4.0, dy: 1.5 },
            torso: { dAngle: -18 },
            chest: { dAngle: -20 },
            head: { dAngle: -20 },
            arm_near_upper: { dAngle: -35 },
            arm_near_lower: { dAngle: 40 },
            arm_far_upper: { dAngle: -30 },
            arm_far_lower: { dAngle: 35 },
            leg_near_thigh: { dAngle: -16 },
            leg_near_shin: { dAngle: 20 },
            eq_cape_mid: { dAngle: -25 }
          },
          // Frame 2: Regaining footing
          {
            pelvis: { dx: -2.0, dy: 0.5 },
            torso: { dAngle: -8 },
            chest: { dAngle: -8 },
            head: { dAngle: -8 },
            arm_near_upper: { dAngle: -15 },
            arm_near_lower: { dAngle: 20 },
            leg_near_thigh: { dAngle: -8 },
            eq_cape_mid: { dAngle: -10 }
          },
          // Frame 3: Settling
          {
            pelvis: { dx: -0.5, dy: 0 },
            torso: { dAngle: -2 },
            chest: { dAngle: -2 },
            head: { dAngle: -2 },
            arm_near_upper: { dAngle: 0 },
            eq_cape_mid: { dAngle: 0 }
          }
        ];
        return keyframes[frameIndex % keyframes.length];
      }
    },

    run: {
      id: "run",
      name: "Fast Run",
      frames: 6,
      fps: 12,
      computePose: function (frameIndex, totalFrames) {
        const t = frameIndex / totalFrames;
        const phase = t * 2.0 * Math.PI;

        const bob = -2.2 * Math.abs(Math.sin(phase));
        const torsoTilt = 10.0 + 3.0 * Math.sin(phase);

        const legStride = 42.0 * Math.sin(phase);
        const nearKneeBend = Math.max(0.0, -56.0 * Math.cos(phase));
        const farKneeBend = Math.max(0.0, 56.0 * Math.cos(phase));

        const armSwing = -45.0 * Math.sin(phase);
        const nearElbowBend = Math.max(10.0, 32.0 * Math.sin(phase));
        const farElbowBend = Math.max(10.0, -32.0 * Math.sin(phase));

        const capeWave = 35.0 + 15.0 * Math.sin(phase);

        return {
          pelvis: { dy: bob },
          torso: { dAngle: torsoTilt },
          chest: { dAngle: torsoTilt * 0.8 },
          head: { dAngle: -torsoTilt * 0.6 },
          leg_near_thigh: { dAngle: legStride },
          leg_near_shin: { dAngle: nearKneeBend },
          leg_far_thigh: { dAngle: -legStride },
          leg_far_shin: { dAngle: farKneeBend },
          arm_near_upper: { dAngle: armSwing },
          arm_near_lower: { dAngle: nearElbowBend },
          arm_far_upper: { dAngle: -armSwing },
          arm_far_lower: { dAngle: farElbowBend },
          eq_cape_mid: { dAngle: capeWave },
          eq_cape_tail: { dAngle: capeWave * 1.3 }
        };
      }
    }
  };

  // ==========================================================================
  // 7. COMPOSITE SPEC ASSEMBLER
  // ==========================================================================
  function assembleSpec(mannequinId, equippedSlots, actionId, options) {
    const opts = options || {};
    const manDef = MANNEQUINS[mannequinId] || MANNEQUINS.humanoid;
    const actionDef = ACTIONS[actionId] || ACTIONS.walk;
    const themeKey = opts.theme || "steel";
    const themeDef = THEMES[themeKey] || THEMES.steel;

    const width = manDef.width || 48;
    const height = manDef.height || 48;

    // 1. Build composite palette
    const fullPalette = Object.assign(
      {
        ".": [0, 0, 0, 0],
        " ": [0, 0, 0, 0],
        o: "#10141f"
      },
      manDef.palette,
      {
        gear_base: themeDef.gear_base,
        gear_hi: themeDef.gear_hi,
        gear_shadow: themeDef.gear_shadow,
        gear_dark: themeDef.gear_dark,
        trim: themeDef.trim,
        trim_hi: themeDef.trim_hi
      }
    );

    // 2. Clone base mannequin bones
    const compositeBones = [];
    const baseBonesMap = {};
    for (const b of manDef.bones) {
      const cloned = Object.assign({}, b);
      if (cloned.features) cloned.features = JSON.parse(JSON.stringify(cloned.features));
      compositeBones.push(cloned);
      baseBonesMap[cloned.id] = cloned;
    }

    // 3. Attach equipment bones according to active slots
    const activeSlots = equippedSlots || {};
    for (const slotDef of SLOTS) {
      const itemId = activeSlots[slotDef.id];
      if (!itemId || itemId === "none") continue;

      const itemDef = ITEMS[itemId];
      if (!itemDef || !Array.isArray(itemDef.bones)) continue;

      for (const eqBone of itemDef.bones) {
        const cloned = Object.assign({}, eqBone);
        // Verify parent exists
        if (cloned.parent && !baseBonesMap[cloned.parent] && !compositeBones.some(cb => cb.id === cloned.parent)) {
          // If parent is not found, fallback to chest or root
          cloned.parent = "chest";
        }
        compositeBones.push(cloned);
      }
    }

    // 4. Build animation frames using action kinematics
    const numFrames = parseInt(opts.frames, 10) || actionDef.frames || 8;
    const framesList = [];
    for (let fi = 0; fi < numFrames; fi++) {
      const poseDeltas = actionDef.computePose(fi, numFrames);
      framesList.push({ pose: poseDeltas });
    }

    const loadoutName = opts.loadoutName || `${manDef.name} (${actionDef.name})`;

    // 5. Build final valid PixelDSL v3.0 rig spec
    return {
      type: "rig",
      name: `paperdoll_${manDef.id}_${actionDef.id}`,
      label: `Paper Doll: ${loadoutName}`,
      width: width,
      height: height,
      palette: fullPalette,
      rig: {
        outline: opts.outline !== undefined ? opts.outline : "o",
        outlineWidth: opts.outlineWidth !== undefined ? opts.outlineWidth : 1,
        crease: true,
        bones: compositeBones
      },
      postProcess: {
        autoOutline: true,
        autoShading: false,
        sdfShading: true,
        selOut: Boolean(opts.selOut)
      },
      frames: framesList
    };
  }

  // ==========================================================================
  // 8. STATS & LAYER MATRIX CALCULATOR
  // ==========================================================================
  function calculateLoadoutSummary(mannequinId, equippedSlots, themeKey) {
    const manDef = MANNEQUINS[mannequinId] || MANNEQUINS.humanoid;
    const stats = { atk: 0, def: 0, weight: 0.0, speed: 0, mana: 0, crit: 0 };

    const activeEquip = [];
    for (const slotDef of SLOTS) {
      const itemId = (equippedSlots && equippedSlots[slotDef.id]) || "none";
      const itemDef = ITEMS[itemId] || ITEMS.none;
      if (itemDef.stats) {
        for (const [k, v] of Object.entries(itemDef.stats)) {
          if (typeof v === "number") {
            stats[k] = (stats[k] || 0) + v;
          }
        }
      }
      activeEquip.push({
        slot: slotDef.id,
        slotName: slotDef.name,
        icon: slotDef.icon,
        itemId: itemId,
        itemName: itemDef.name || "None",
        boneCount: (itemDef.bones || []).length
      });
    }

    return {
      mannequin: manDef,
      stats: stats,
      activeEquip: activeEquip,
      theme: THEMES[themeKey] || THEMES.steel
    };
  }

  // ==========================================================================
  // 9. EXPORT MODULE TO GLOBAL (BROWSER & NODE.JS)
  // ==========================================================================
  const PaperDollEngine = {
    SLOTS: SLOTS,
    THEMES: THEMES,
    MANNEQUINS: MANNEQUINS,
    ITEMS: ITEMS,
    LOADOUTS: LOADOUTS,
    ACTIONS: ACTIONS,
    assembleSpec: assembleSpec,
    calculateLoadoutSummary: calculateLoadoutSummary
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = PaperDollEngine;
  }
  global.PaperDollEngine = PaperDollEngine;

})(typeof window !== "undefined" ? window : global);
