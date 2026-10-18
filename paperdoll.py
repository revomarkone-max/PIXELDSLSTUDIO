#!/usr/bin/env python3
"""
PixelDSL Studio v3.0 — Modular Paper Doll & Equipment Matrix Engine (CLI)
Zero-dependency modular bone-attached equipment system with Forward Kinematics (FK),
automatic Z-depth layering, animated action cycles, and standalone rendering.
"""

import sys
import os
import math
import json
import argparse

# Try importing from local pixeldsl.py compiler
try:
    import pixeldsl
except ImportError:
    pixeldsl = None


# ==============================================================================
# 1. SLOTS SPECIFICATION
# ==============================================================================
SLOTS = [
    {"id": "head", "name": "Headgear", "icon": "🪖", "defaultItem": "iron_helm", "desc": "Helmets, hoods, crowns, and cowls"},
    {"id": "torso", "name": "Torso Armor", "icon": "🛡️", "defaultItem": "steel_cuirass", "desc": "Cuirasses, vests, robes, and carapaces"},
    {"id": "hands", "name": "Gauntlets", "icon": "🧤", "defaultItem": "steel_gauntlets", "desc": "Armored vambraces and gloves"},
    {"id": "legs", "name": "Leg Armor", "icon": "👖", "defaultItem": "plate_greaves", "desc": "Greaves, chausses, and skirts"},
    {"id": "feet", "name": "Footwear", "icon": "👢", "defaultItem": "iron_sabatons", "desc": "Sabatons, boots, and sandals"},
    {"id": "weapon", "name": "Main-Hand", "icon": "⚔️", "defaultItem": "runed_broadsword", "desc": "Swords, axes, staffs, and spears"},
    {"id": "shield", "name": "Off-Hand", "icon": "🔰", "defaultItem": "kite_shield", "desc": "Shields, bucklers, spellbooks, and daggers"},
    {"id": "back", "name": "Back / Cape", "icon": "🎒", "defaultItem": "red_cape", "desc": "Capes, cloaks, and wings"}
]

# ==============================================================================
# 2. MATERIAL THEMES
# ==============================================================================
THEMES = {
    "steel": {
        "id": "steel",
        "name": "Polished Steel & Iron",
        "gear_base": "#8a95a5",
        "gear_hi": "#d1d5db",
        "gear_shadow": "#475569",
        "gear_dark": "#1e293b",
        "trim": "#d97706",
        "trim_hi": "#fef08a"
    },
    "gold": {
        "id": "gold",
        "name": "Imperial Gilded Gold",
        "gear_base": "#eab308",
        "gear_hi": "#fef08a",
        "gear_shadow": "#a16207",
        "gear_dark": "#713f12",
        "trim": "#dc2626",
        "trim_hi": "#fca5a5"
    },
    "dark_iron": {
        "id": "dark_iron",
        "name": "Abyssal Dark Iron",
        "gear_base": "#334155",
        "gear_hi": "#64748b",
        "gear_shadow": "#0f172a",
        "gear_dark": "#020617",
        "trim": "#9333ea",
        "trim_hi": "#c084fc"
    },
    "crimson": {
        "id": "crimson",
        "name": "Blood Knight Crimson",
        "gear_base": "#b91c1c",
        "gear_hi": "#f87171",
        "gear_shadow": "#7f1d1d",
        "gear_dark": "#450a0a",
        "trim": "#eab308",
        "trim_hi": "#fef08a"
    },
    "cobalt": {
        "id": "cobalt",
        "name": "Runic Cobalt Blue",
        "gear_base": "#2563eb",
        "gear_hi": "#93c5fd",
        "gear_shadow": "#1e40af",
        "gear_dark": "#0f172a",
        "trim": "#06b6d4",
        "trim_hi": "#a5f3fc"
    },
    "emerald": {
        "id": "emerald",
        "name": "Verdant Ranger Emerald",
        "gear_base": "#15803d",
        "gear_hi": "#86efac",
        "gear_shadow": "#14532d",
        "gear_dark": "#052e16",
        "trim": "#ca8a04",
        "trim_hi": "#fef08a"
    },
    "amethyst": {
        "id": "amethyst",
        "name": "Wandering Amethyst",
        "gear_base": "#6b3fa0",
        "gear_hi": "#9d72d4",
        "gear_shadow": "#4a2b72",
        "gear_dark": "#2b1a47",
        "trim": "#d6a23f",
        "trim_hi": "#f6dd8c"
    },
    "obsidian": {
        "id": "obsidian",
        "name": "Volcanic Obsidian & Flame",
        "gear_base": "#3b3b46",
        "gear_hi": "#6e6e7c",
        "gear_shadow": "#26262e",
        "gear_dark": "#16161b",
        "trim": "#ea580c",
        "trim_hi": "#fed7aa"
    }
}

# ==============================================================================
# 3. BASE MANNEQUINS
# ==============================================================================
MANNEQUINS = {
    "humanoid": {
        "id": "humanoid",
        "name": "Standard Heroic Humanoid",
        "width": 48,
        "height": 48,
        "palette": {
            "skin": "#f5c29a",
            "skin_hi": "#fde3cf",
            "skin_dark": "#c98f68",
            "skin_shadow": "#8b5536",
            "eyes": "#1e293b",
            "linen": "#e2e8f0",
            "linen_dark": "#94a3b8"
        },
        "bones": [
            {"id": "pelvis", "x": 24, "y": 25, "length": 3, "angle": -90, "r1": 3.6, "r2": 3.6, "z": 1.0, "fill": "linen_dark"},
            {"id": "torso", "parent": "pelvis", "offset": [0, 0], "length": 5, "angle": 0, "r1": 3.6, "r2": 4.0, "z": 1.1, "fill": "linen"},
            {"id": "chest", "parent": "torso", "offset": [0, 0], "length": 4.5, "angle": 0, "r1": 4.0, "r2": 3.8, "z": 1.2, "fill": "skin"},
            {"id": "neck", "parent": "chest", "offset": [0, 0], "length": 4.2, "angle": 0, "r1": 2.0, "r2": 2.0, "z": 1.3, "fill": "skin_dark"},
            {"id": "head", "parent": "neck", "offset": [0, 0], "length": 0, "shape": "head_oval", "r1": 4.8, "r2": 4.4, "z": 1.5, "fill": "skin", "features": {"eyes": {"dx": 1.8, "dy": -0.5, "w": 1.6, "h": 2.0, "color": "eyes"}}},
            {"id": "arm_far_upper", "parent": "chest", "offset": [-1.2, 0.5], "length": 6.5, "angle": 175, "r1": 2.0, "r2": 1.7, "z": 0.1, "fill": "skin_shadow"},
            {"id": "arm_far_lower", "parent": "arm_far_upper", "offset": [0, 0], "length": 5.5, "angle": 10, "r1": 1.7, "r2": 1.5, "z": 0.15, "fill": "skin_shadow"},
            {"id": "leg_far_thigh", "parent": "pelvis", "offset": [-1.2, 0], "length": 7.5, "angle": 180, "r1": 2.6, "r2": 2.1, "z": 0.2, "fill": "skin_shadow"},
            {"id": "leg_far_shin", "parent": "leg_far_thigh", "offset": [0, 0], "length": 7.0, "angle": 0, "r1": 2.1, "r2": 1.8, "z": 0.25, "fill": "skin_shadow"},
            {"id": "foot_far", "parent": "leg_far_shin", "offset": [0, 0], "length": 3.0, "angle": -75, "r1": 1.8, "r2": 1.4, "z": 0.3, "fill": "linen_dark"},
            {"id": "leg_near_thigh", "parent": "pelvis", "offset": [1.2, 0], "length": 7.5, "angle": 180, "r1": 2.8, "r2": 2.3, "z": 2.1, "fill": "skin"},
            {"id": "leg_near_shin", "parent": "leg_near_thigh", "offset": [0, 0], "length": 7.0, "angle": 0, "r1": 2.3, "r2": 1.9, "z": 2.2, "fill": "skin"},
            {"id": "foot_near", "parent": "leg_near_shin", "offset": [0, 0], "length": 3.0, "angle": -75, "r1": 1.9, "r2": 1.5, "z": 2.3, "fill": "linen_dark"},
            {"id": "arm_near_upper", "parent": "chest", "offset": [1.2, 0.5], "length": 6.5, "angle": 175, "r1": 2.1, "r2": 1.8, "z": 2.6, "fill": "skin"},
            {"id": "arm_near_lower", "parent": "arm_near_upper", "offset": [0, 0], "length": 5.5, "angle": 10, "r1": 1.8, "r2": 1.6, "z": 2.7, "fill": "skin"}
        ]
    },

    "chibi": {
        "id": "chibi",
        "name": "Chibi Adventurer (Mini / Cute)",
        "width": 48,
        "height": 48,
        "palette": {
            "skin": "#fed7aa",
            "skin_hi": "#ffedd5",
            "skin_dark": "#fba068",
            "skin_shadow": "#a85532",
            "eyes": "#0f172a",
            "linen": "#f1f5f9",
            "linen_dark": "#64748b"
        },
        "bones": [
            {"id": "pelvis", "x": 24, "y": 27, "length": 2, "angle": -90, "r1": 3.2, "r2": 3.2, "z": 1.0, "fill": "linen_dark"},
            {"id": "torso", "parent": "pelvis", "offset": [0, 0], "length": 3.5, "angle": 0, "r1": 3.2, "r2": 3.5, "z": 1.1, "fill": "linen"},
            {"id": "chest", "parent": "torso", "offset": [0, 0], "length": 3.0, "angle": 0, "r1": 3.5, "r2": 3.2, "z": 1.2, "fill": "skin"},
            {"id": "neck", "parent": "chest", "offset": [0, 0], "length": 3.2, "angle": 0, "r1": 1.8, "r2": 1.8, "z": 1.3, "fill": "skin_dark"},
            {"id": "head", "parent": "neck", "offset": [0, 0], "length": 0, "shape": "head_oval", "r1": 6.8, "r2": 6.4, "z": 1.5, "fill": "skin", "features": {"eyes": {"dx": 2.5, "dy": 0.0, "w": 2.2, "h": 3.0, "color": "eyes"}}},
            {"id": "arm_far_upper", "parent": "chest", "offset": [-1.0, 0.5], "length": 4.5, "angle": 175, "r1": 1.8, "r2": 1.6, "z": 0.1, "fill": "skin_shadow"},
            {"id": "arm_far_lower", "parent": "arm_far_upper", "offset": [0, 0], "length": 4.0, "angle": 10, "r1": 1.6, "r2": 1.4, "z": 0.15, "fill": "skin_shadow"},
            {"id": "leg_far_thigh", "parent": "pelvis", "offset": [-1.0, 0], "length": 5.0, "angle": 180, "r1": 2.2, "r2": 1.8, "z": 0.2, "fill": "skin_shadow"},
            {"id": "leg_far_shin", "parent": "leg_far_thigh", "offset": [0, 0], "length": 4.5, "angle": 0, "r1": 1.8, "r2": 1.6, "z": 0.25, "fill": "skin_shadow"},
            {"id": "foot_far", "parent": "leg_far_shin", "offset": [0, 0], "length": 2.5, "angle": -75, "r1": 1.6, "r2": 1.3, "z": 0.3, "fill": "linen_dark"},
            {"id": "leg_near_thigh", "parent": "pelvis", "offset": [1.0, 0], "length": 5.0, "angle": 180, "r1": 2.4, "r2": 2.0, "z": 2.1, "fill": "skin"},
            {"id": "leg_near_shin", "parent": "leg_near_thigh", "offset": [0, 0], "length": 4.5, "angle": 0, "r1": 2.0, "r2": 1.7, "z": 2.2, "fill": "skin"},
            {"id": "foot_near", "parent": "leg_near_shin", "offset": [0, 0], "length": 2.5, "angle": -75, "r1": 1.7, "r2": 1.4, "z": 2.3, "fill": "linen_dark"},
            {"id": "arm_near_upper", "parent": "chest", "offset": [1.0, 0.5], "length": 4.5, "angle": 175, "r1": 1.9, "r2": 1.7, "z": 2.6, "fill": "skin"},
            {"id": "arm_near_lower", "parent": "arm_near_upper", "offset": [0, 0], "length": 4.0, "angle": 10, "r1": 1.7, "r2": 1.5, "z": 2.7, "fill": "skin"}
        ]
    },

    "skeleton": {
        "id": "skeleton",
        "name": "Undead Skeleton Warrior",
        "width": 48,
        "height": 48,
        "palette": {
            "skin": "#e5e5e5",
            "skin_hi": "#ffffff",
            "skin_dark": "#a3a3a3",
            "skin_shadow": "#525252",
            "eyes": "#ef4444",
            "linen": "#404040",
            "linen_dark": "#262626"
        },
        "bones": [
            {"id": "pelvis", "x": 24, "y": 25, "length": 2.8, "angle": -90, "r1": 2.6, "r2": 2.6, "z": 1.0, "fill": "skin"},
            {"id": "torso", "parent": "pelvis", "offset": [0, 0], "length": 5.2, "angle": 0, "r1": 1.8, "r2": 2.4, "z": 1.1, "fill": "skin_dark"},
            {"id": "chest", "parent": "torso", "offset": [0, 0], "length": 4.0, "angle": 0, "r1": 3.4, "r2": 3.2, "z": 1.2, "fill": "skin"},
            {"id": "neck", "parent": "chest", "offset": [0, 0], "length": 4.0, "angle": 0, "r1": 1.4, "r2": 1.4, "z": 1.3, "fill": "skin_dark"},
            {"id": "head", "parent": "neck", "offset": [0, 0], "length": 0, "shape": "head_oval", "r1": 4.6, "r2": 4.0, "z": 1.5, "fill": "skin", "features": {"eyes": {"dx": 1.8, "dy": -0.4, "w": 1.4, "h": 1.8, "color": "eyes"}}},
            {"id": "arm_far_upper", "parent": "chest", "offset": [-1.2, 0.5], "length": 6.5, "angle": 175, "r1": 1.4, "r2": 1.2, "z": 0.1, "fill": "skin_shadow"},
            {"id": "arm_far_lower", "parent": "arm_far_upper", "offset": [0, 0], "length": 5.5, "angle": 10, "r1": 1.2, "r2": 1.0, "z": 0.15, "fill": "skin_shadow"},
            {"id": "leg_far_thigh", "parent": "pelvis", "offset": [-1.2, 0], "length": 7.5, "angle": 180, "r1": 1.8, "r2": 1.4, "z": 0.2, "fill": "skin_shadow"},
            {"id": "leg_far_shin", "parent": "leg_far_thigh", "offset": [0, 0], "length": 7.0, "angle": 0, "r1": 1.4, "r2": 1.2, "z": 0.25, "fill": "skin_shadow"},
            {"id": "foot_far", "parent": "leg_far_shin", "offset": [0, 0], "length": 2.8, "angle": -75, "r1": 1.3, "r2": 1.0, "z": 0.3, "fill": "skin_shadow"},
            {"id": "leg_near_thigh", "parent": "pelvis", "offset": [1.2, 0], "length": 7.5, "angle": 180, "r1": 1.9, "r2": 1.5, "z": 2.1, "fill": "skin"},
            {"id": "leg_near_shin", "parent": "leg_near_thigh", "offset": [0, 0], "length": 7.0, "angle": 0, "r1": 1.5, "r2": 1.3, "z": 2.2, "fill": "skin"},
            {"id": "foot_near", "parent": "leg_near_shin", "offset": [0, 0], "length": 2.8, "angle": -75, "r1": 1.4, "r2": 1.1, "z": 2.3, "fill": "skin"},
            {"id": "arm_near_upper", "parent": "chest", "offset": [1.2, 0.5], "length": 6.5, "angle": 175, "r1": 1.5, "r2": 1.3, "z": 2.6, "fill": "skin"},
            {"id": "arm_near_lower", "parent": "arm_near_upper", "offset": [0, 0], "length": 5.5, "angle": 10, "r1": 1.3, "r2": 1.1, "z": 2.7, "fill": "skin"}
        ]
    },

    "orc": {
        "id": "orc",
        "name": "Orc Berserker (Heavy Bulky)",
        "width": 48,
        "height": 48,
        "palette": {
            "skin": "#4ade80",
            "skin_hi": "#86efac",
            "skin_dark": "#16a34a",
            "skin_shadow": "#14532d",
            "eyes": "#facc15",
            "linen": "#78350f",
            "linen_dark": "#451a03"
        },
        "bones": [
            {"id": "pelvis", "x": 24, "y": 25, "length": 3.2, "angle": -90, "r1": 4.8, "r2": 4.8, "z": 1.0, "fill": "linen_dark"},
            {"id": "torso", "parent": "pelvis", "offset": [0, 0], "length": 5.0, "angle": 0, "r1": 4.8, "r2": 5.2, "z": 1.1, "fill": "linen"},
            {"id": "chest", "parent": "torso", "offset": [0, 0], "length": 4.5, "angle": 0, "r1": 5.2, "r2": 4.8, "z": 1.2, "fill": "skin"},
            {"id": "neck", "parent": "chest", "offset": [0, 0], "length": 4.2, "angle": 0, "r1": 2.8, "r2": 2.8, "z": 1.3, "fill": "skin_dark"},
            {"id": "head", "parent": "neck", "offset": [0, 0], "length": 0, "shape": "head_oval", "r1": 5.4, "r2": 5.0, "z": 1.5, "fill": "skin", "features": {"eyes": {"dx": 2.2, "dy": -0.6, "w": 2.0, "h": 2.0, "color": "eyes"}}},
            {"id": "arm_far_upper", "parent": "chest", "offset": [-1.8, 0.5], "length": 7.0, "angle": 175, "r1": 3.0, "r2": 2.6, "z": 0.1, "fill": "skin_shadow"},
            {"id": "arm_far_lower", "parent": "arm_far_upper", "offset": [0, 0], "length": 6.0, "angle": 10, "r1": 2.6, "r2": 2.4, "z": 0.15, "fill": "skin_shadow"},
            {"id": "leg_far_thigh", "parent": "pelvis", "offset": [-1.6, 0], "length": 8.0, "angle": 180, "r1": 3.6, "r2": 3.0, "z": 0.2, "fill": "skin_shadow"},
            {"id": "leg_far_shin", "parent": "leg_far_thigh", "offset": [0, 0], "length": 7.2, "angle": 0, "r1": 3.0, "r2": 2.6, "z": 0.25, "fill": "skin_shadow"},
            {"id": "foot_far", "parent": "leg_far_shin", "offset": [0, 0], "length": 3.5, "angle": -75, "r1": 2.6, "r2": 2.2, "z": 0.3, "fill": "linen_dark"},
            {"id": "leg_near_thigh", "parent": "pelvis", "offset": [1.6, 0], "length": 8.0, "angle": 180, "r1": 3.8, "r2": 3.2, "z": 2.1, "fill": "skin"},
            {"id": "leg_near_shin", "parent": "leg_near_thigh", "offset": [0, 0], "length": 7.2, "angle": 0, "r1": 3.2, "r2": 2.8, "z": 2.2, "fill": "skin"},
            {"id": "foot_near", "parent": "leg_near_shin", "offset": [0, 0], "length": 3.5, "angle": -75, "r1": 2.8, "r2": 2.4, "z": 2.3, "fill": "linen_dark"},
            {"id": "arm_near_upper", "parent": "chest", "offset": [1.8, 0.5], "length": 7.0, "angle": 175, "r1": 3.2, "r2": 2.8, "z": 2.6, "fill": "skin"},
            {"id": "arm_near_lower", "parent": "arm_near_upper", "offset": [0, 0], "length": 6.0, "angle": 10, "r1": 2.8, "r2": 2.6, "z": 2.7, "fill": "skin"}
        ]
    }
}

# ==============================================================================
# 4. MODULAR EQUIPMENT CATALOG
# ==============================================================================
ITEMS = {
    "none": {"id": "none", "name": "None", "bones": []},

    # Headgear
    "iron_helm": {
        "id": "iron_helm", "slot": "head", "name": "Knight Steel Bascinet",
        "bones": [
            {"id": "eq_helm_dome", "parent": "head", "offset": [0, -1.2], "length": 0, "shape": "head_oval", "r1": 5.6, "r2": 5.0, "z": 1.8, "fill": "gear_base"},
            {"id": "eq_helm_brow", "parent": "head", "offset": [1.2, -0.6], "length": 2.5, "angle": 10, "r1": 1.5, "r2": 1.2, "z": 1.85, "fill": "gear_hi"},
            {"id": "eq_helm_crest", "parent": "head", "offset": [-0.5, -4.5], "length": 3.0, "angle": -75, "r1": 1.2, "r2": 0.6, "z": 1.9, "fill": "trim"}
        ]
    },
    "wizard_hood": {
        "id": "wizard_hood", "slot": "head", "name": "Archmage Arcane Hood",
        "bones": [
            {"id": "eq_hood_dome", "parent": "head", "offset": [0, -1.0], "length": 0, "shape": "head_oval", "r1": 5.8, "r2": 5.2, "z": 1.8, "fill": "gear_dark"},
            {"id": "eq_hood_tip", "parent": "head", "offset": [-2.0, -3.8], "length": 4.5, "angle": -145, "r1": 2.2, "r2": 0.8, "z": 1.75, "fill": "gear_dark"},
            {"id": "eq_hood_cowl", "parent": "head", "offset": [0, 2.5], "length": 2.0, "angle": 90, "r1": 4.6, "r2": 3.8, "z": 1.82, "fill": "gear_base"}
        ]
    },
    "horned_helm": {
        "id": "horned_helm", "slot": "head", "name": "Barbarian Horned Helm",
        "bones": [
            {"id": "eq_horn_skull", "parent": "head", "offset": [0, -1.0], "length": 0, "shape": "head_oval", "r1": 5.5, "r2": 4.8, "z": 1.8, "fill": "gear_base"},
            {"id": "eq_horn_near", "parent": "head", "offset": [1.5, -3.0], "length": 4.5, "angle": -45, "r1": 1.8, "r2": 0.6, "z": 1.9, "fill": "trim_hi"},
            {"id": "eq_horn_far", "parent": "head", "offset": [-2.0, -3.2], "length": 4.5, "angle": -125, "r1": 1.6, "r2": 0.5, "z": 1.45, "fill": "trim"}
        ]
    },
    "golden_crown": {
        "id": "golden_crown", "slot": "head", "name": "Imperial Jeweled Crown",
        "bones": [
            {"id": "eq_crown_band", "parent": "head", "offset": [0.2, -2.8], "length": 3.0, "angle": 10, "r1": 4.6, "r2": 4.6, "shape": "head_oval", "z": 1.85, "fill": "trim"},
            {"id": "eq_crown_spire_mid", "parent": "head", "offset": [0.5, -4.5], "length": 2.8, "angle": -90, "r1": 1.2, "r2": 0.4, "z": 1.9, "fill": "trim_hi"},
            {"id": "eq_crown_spire_left", "parent": "head", "offset": [-2.2, -4.0], "length": 2.2, "angle": -105, "r1": 1.0, "r2": 0.4, "z": 1.88, "fill": "trim_hi"},
            {"id": "eq_crown_spire_right", "parent": "head", "offset": [2.5, -4.0], "length": 2.2, "angle": -75, "r1": 1.0, "r2": 0.4, "z": 1.88, "fill": "trim_hi"}
        ]
    },
    "shadow_cowl": {
        "id": "shadow_cowl", "slot": "head", "name": "Shadow Assassin Cowl",
        "bones": [
            {"id": "eq_cowl_dome", "parent": "head", "offset": [0, -0.8], "length": 0, "shape": "head_oval", "r1": 5.4, "r2": 4.7, "z": 1.8, "fill": "gear_dark"},
            {"id": "eq_cowl_mask", "parent": "head", "offset": [1.5, 0.8], "length": 2.0, "angle": 30, "r1": 2.4, "r2": 1.8, "z": 1.85, "fill": "gear_shadow"}
        ]
    },

    # Torso Armor
    "steel_cuirass": {
        "id": "steel_cuirass", "slot": "torso", "name": "Steel Plate Cuirass",
        "bones": [
            {"id": "eq_chest_plate", "parent": "chest", "offset": [0, 0], "length": 4.2, "angle": 0, "r1": 4.8, "r2": 5.2, "z": 1.35, "fill": "gear_base"},
            {"id": "eq_chest_rim", "parent": "chest", "offset": [0.6, -1.0], "length": 3.8, "angle": 0, "r1": 1.6, "r2": 1.4, "z": 1.4, "fill": "gear_hi"},
            {"id": "eq_torso_waist", "parent": "torso", "offset": [0, 0], "length": 4.8, "angle": 0, "r1": 4.2, "r2": 4.6, "z": 1.32, "fill": "gear_shadow"}
        ]
    },
    "leather_vest": {
        "id": "leather_vest", "slot": "torso", "name": "Studded Leather Doublet",
        "bones": [
            {"id": "eq_vest_chest", "parent": "chest", "offset": [0, 0], "length": 4.0, "angle": 0, "r1": 4.5, "r2": 4.8, "z": 1.35, "fill": "gear_shadow"},
            {"id": "eq_vest_buckle", "parent": "chest", "offset": [1.2, 0.5], "length": 2.0, "angle": 90, "r1": 1.2, "r2": 1.2, "z": 1.4, "fill": "trim"},
            {"id": "eq_vest_waist", "parent": "torso", "offset": [0, 0], "length": 4.5, "angle": 0, "r1": 3.9, "r2": 4.3, "z": 1.32, "fill": "gear_dark"}
        ]
    },
    "mage_robe": {
        "id": "mage_robe", "slot": "torso", "name": "Arcane Draped Robe",
        "bones": [
            {"id": "eq_robe_chest", "parent": "chest", "offset": [0, 0], "length": 4.5, "angle": 0, "r1": 4.6, "r2": 5.0, "z": 1.35, "fill": "gear_base"},
            {"id": "eq_robe_trim", "parent": "chest", "offset": [0.8, -0.5], "length": 4.2, "angle": 0, "r1": 1.4, "r2": 1.2, "z": 1.4, "fill": "trim_hi"},
            {"id": "eq_robe_mantel", "parent": "torso", "offset": [0, 0], "length": 5.2, "angle": 0, "r1": 4.5, "r2": 5.4, "z": 1.34, "fill": "gear_dark"}
        ]
    },
    "bone_carapace": {
        "id": "bone_carapace", "slot": "torso", "name": "Undead Bone Carapace",
        "bones": [
            {"id": "eq_bone_ribs", "parent": "chest", "offset": [0, 0], "length": 4.2, "angle": 0, "r1": 4.6, "r2": 5.2, "z": 1.35, "fill": "gear_hi"},
            {"id": "eq_bone_spine", "parent": "torso", "offset": [-0.8, 0], "length": 4.8, "angle": 0, "r1": 3.8, "r2": 4.2, "z": 1.32, "fill": "gear_base"}
        ]
    },
    "royal_tunic": {
        "id": "royal_tunic", "slot": "torso", "name": "Regal Velvet Tunic",
        "bones": [
            {"id": "eq_tunic_chest", "parent": "chest", "offset": [0, 0], "length": 4.2, "angle": 0, "r1": 4.6, "r2": 4.9, "z": 1.35, "fill": "gear_base"},
            {"id": "eq_tunic_sash", "parent": "chest", "offset": [0.5, 0], "length": 4.0, "angle": 25, "r1": 1.5, "r2": 1.3, "z": 1.42, "fill": "trim"},
            {"id": "eq_tunic_waist", "parent": "torso", "offset": [0, 0], "length": 4.8, "angle": 0, "r1": 4.2, "r2": 4.6, "z": 1.32, "fill": "gear_shadow"}
        ]
    },

    # Gauntlets
    "steel_gauntlets": {
        "id": "steel_gauntlets", "slot": "hands", "name": "Armored Steel Vambraces",
        "bones": [
            {"id": "eq_gaunt_near_cuff", "parent": "arm_near_lower", "offset": [0, 0], "length": 5.2, "angle": 0, "r1": 2.3, "r2": 2.1, "z": 2.8, "fill": "gear_base"},
            {"id": "eq_gaunt_near_trim", "parent": "arm_near_lower", "offset": [0.5, 0], "length": 4.8, "angle": 0, "r1": 1.2, "r2": 1.0, "z": 2.85, "fill": "gear_hi"},
            {"id": "eq_gaunt_far_cuff", "parent": "arm_far_lower", "offset": [0, 0], "length": 5.0, "angle": 0, "r1": 2.1, "r2": 1.9, "z": 0.18, "fill": "gear_shadow"}
        ]
    },
    "leather_gloves": {
        "id": "leather_gloves", "slot": "hands", "name": "Supple Archer Bracers",
        "bones": [
            {"id": "eq_glove_near", "parent": "arm_near_lower", "offset": [0, 0], "length": 5.0, "angle": 0, "r1": 2.1, "r2": 1.9, "z": 2.8, "fill": "gear_shadow"},
            {"id": "eq_glove_far", "parent": "arm_far_lower", "offset": [0, 0], "length": 4.8, "angle": 0, "r1": 1.9, "r2": 1.7, "z": 0.18, "fill": "gear_dark"}
        ]
    },
    "golden_bracers": {
        "id": "golden_bracers", "slot": "hands", "name": "Runic Golden Armbands",
        "bones": [
            {"id": "eq_bracer_near", "parent": "arm_near_lower", "offset": [0, 0], "length": 4.8, "angle": 0, "r1": 2.3, "r2": 2.1, "z": 2.8, "fill": "trim"},
            {"id": "eq_bracer_near_gem", "parent": "arm_near_lower", "offset": [0.8, 1.5], "length": 1.5, "angle": 0, "r1": 1.2, "r2": 1.0, "z": 2.86, "fill": "trim_hi"},
            {"id": "eq_bracer_far", "parent": "arm_far_lower", "offset": [0, 0], "length": 4.6, "angle": 0, "r1": 2.1, "r2": 1.9, "z": 0.18, "fill": "gear_shadow"}
        ]
    },
    "shadow_wraps": {
        "id": "shadow_wraps", "slot": "hands", "name": "Shadow Hand Wraps",
        "bones": [
            {"id": "eq_wrap_near", "parent": "arm_near_lower", "offset": [0, 0], "length": 5.0, "angle": 0, "r1": 2.0, "r2": 1.8, "z": 2.8, "fill": "gear_dark"},
            {"id": "eq_wrap_far", "parent": "arm_far_lower", "offset": [0, 0], "length": 4.8, "angle": 0, "r1": 1.8, "r2": 1.6, "z": 0.18, "fill": "gear_shadow"}
        ]
    },

    # Leg Armor
    "plate_greaves": {
        "id": "plate_greaves", "slot": "legs", "name": "Steel Plate Greaves",
        "bones": [
            {"id": "eq_greave_near_thigh", "parent": "leg_near_thigh", "offset": [0, 0], "length": 7.2, "angle": 0, "r1": 3.2, "r2": 2.7, "z": 2.22, "fill": "gear_base"},
            {"id": "eq_greave_near_shin", "parent": "leg_near_shin", "offset": [0, 0], "length": 6.8, "angle": 0, "r1": 2.7, "r2": 2.3, "z": 2.25, "fill": "gear_base"},
            {"id": "eq_greave_near_knee", "parent": "leg_near_shin", "offset": [0.5, -0.5], "length": 2.0, "angle": 0, "r1": 2.0, "r2": 1.8, "z": 2.28, "fill": "gear_hi"},
            {"id": "eq_greave_far_thigh", "parent": "leg_far_thigh", "offset": [0, 0], "length": 7.0, "angle": 0, "r1": 3.0, "r2": 2.5, "z": 0.22, "fill": "gear_shadow"},
            {"id": "eq_greave_far_shin", "parent": "leg_far_shin", "offset": [0, 0], "length": 6.6, "angle": 0, "r1": 2.5, "r2": 2.1, "z": 0.26, "fill": "gear_dark"}
        ]
    },
    "chainmail_chausses": {
        "id": "chainmail_chausses", "slot": "legs", "name": "Chainmail Chausses",
        "bones": [
            {"id": "eq_chain_near_thigh", "parent": "leg_near_thigh", "offset": [0, 0], "length": 7.0, "angle": 0, "r1": 3.0, "r2": 2.5, "z": 2.21, "fill": "gear_shadow"},
            {"id": "eq_chain_near_shin", "parent": "leg_near_shin", "offset": [0, 0], "length": 6.6, "angle": 0, "r1": 2.5, "r2": 2.1, "z": 2.23, "fill": "gear_shadow"},
            {"id": "eq_chain_far_thigh", "parent": "leg_far_thigh", "offset": [0, 0], "length": 6.8, "angle": 0, "r1": 2.8, "r2": 2.3, "z": 0.21, "fill": "gear_dark"},
            {"id": "eq_chain_far_shin", "parent": "leg_far_shin", "offset": [0, 0], "length": 6.4, "angle": 0, "r1": 2.3, "r2": 2.0, "z": 0.24, "fill": "gear_dark"}
        ]
    },
    "arcane_skirt": {
        "id": "arcane_skirt", "slot": "legs", "name": "Pleated Spellcaster Robe-Skirt",
        "bones": [
            {"id": "eq_skirt_core", "parent": "pelvis", "offset": [0, 0], "length": 11.0, "angle": 90, "r1": 4.2, "r2": 6.0, "z": 2.15, "fill": "gear_base"},
            {"id": "eq_skirt_hem", "parent": "pelvis", "offset": [0.5, 9.0], "length": 2.5, "angle": 0, "r1": 5.5, "r2": 5.5, "z": 2.18, "fill": "trim"}
        ]
    },
    "leather_pants": {
        "id": "leather_pants", "slot": "legs", "name": "Ranger Leather Breeches",
        "bones": [
            {"id": "eq_pants_near_thigh", "parent": "leg_near_thigh", "offset": [0, 0], "length": 7.0, "angle": 0, "r1": 2.9, "r2": 2.4, "z": 2.21, "fill": "gear_shadow"},
            {"id": "eq_pants_near_shin", "parent": "leg_near_shin", "offset": [0, 0], "length": 6.6, "angle": 0, "r1": 2.4, "r2": 2.0, "z": 2.23, "fill": "gear_dark"},
            {"id": "eq_pants_far_thigh", "parent": "leg_far_thigh", "offset": [0, 0], "length": 6.8, "angle": 0, "r1": 2.7, "r2": 2.2, "z": 0.21, "fill": "gear_dark"},
            {"id": "eq_pants_far_shin", "parent": "leg_far_shin", "offset": [0, 0], "length": 6.4, "angle": 0, "r1": 2.2, "r2": 1.9, "z": 0.24, "fill": "gear_dark"}
        ]
    },

    # Footwear
    "iron_sabatons": {
        "id": "iron_sabatons", "slot": "feet", "name": "Plated Steel Sabatons",
        "bones": [
            {"id": "eq_sab_near", "parent": "foot_near", "offset": [0, 0], "length": 3.5, "angle": 0, "r1": 2.4, "r2": 1.8, "z": 2.35, "fill": "gear_base"},
            {"id": "eq_sab_near_toe", "parent": "foot_near", "offset": [2.5, 0.2], "length": 1.8, "angle": 0, "r1": 1.6, "r2": 1.0, "z": 2.38, "fill": "gear_hi"},
            {"id": "eq_sab_far", "parent": "foot_far", "offset": [0, 0], "length": 3.2, "angle": 0, "r1": 2.2, "r2": 1.6, "z": 0.32, "fill": "gear_shadow"}
        ]
    },
    "leather_boots": {
        "id": "leather_boots", "slot": "feet", "name": "Sturdy Adventurer Boots",
        "bones": [
            {"id": "eq_boot_near", "parent": "foot_near", "offset": [0, 0], "length": 3.2, "angle": 0, "r1": 2.2, "r2": 1.7, "z": 2.35, "fill": "gear_shadow"},
            {"id": "eq_boot_far", "parent": "foot_far", "offset": [0, 0], "length": 3.0, "angle": 0, "r1": 2.0, "r2": 1.5, "z": 0.32, "fill": "gear_dark"}
        ]
    },
    "winged_sandals": {
        "id": "winged_sandals", "slot": "feet", "name": "Hermes Winged Sandals",
        "bones": [
            {"id": "eq_sandal_near", "parent": "foot_near", "offset": [0, 0], "length": 3.0, "angle": 0, "r1": 2.0, "r2": 1.5, "z": 2.35, "fill": "trim"},
            {"id": "eq_wing_near", "parent": "foot_near", "offset": [-0.5, -1.8], "length": 3.2, "angle": -140, "r1": 1.4, "r2": 0.4, "z": 2.4, "fill": "gear_hi"},
            {"id": "eq_sandal_far", "parent": "foot_far", "offset": [0, 0], "length": 2.8, "angle": 0, "r1": 1.8, "r2": 1.3, "z": 0.32, "fill": "gear_shadow"}
        ]
    },
    "shadow_boots": {
        "id": "shadow_boots", "slot": "feet", "name": "Silent Shadow Tabi",
        "bones": [
            {"id": "eq_tabi_near", "parent": "foot_near", "offset": [0, 0], "length": 3.0, "angle": 0, "r1": 2.0, "r2": 1.6, "z": 2.35, "fill": "gear_dark"},
            {"id": "eq_tabi_far", "parent": "foot_far", "offset": [0, 0], "length": 2.8, "angle": 0, "r1": 1.8, "r2": 1.4, "z": 0.32, "fill": "gear_shadow"}
        ]
    },

    # Main-Hand Weapon
    "runed_broadsword": {
        "id": "runed_broadsword", "slot": "weapon", "name": "Runed Broadsword",
        "bones": [
            {"id": "eq_sw_blade", "parent": "arm_near_lower", "offset": [0, 0], "length": 17.0, "angle": -40, "r1": 2.0, "r2": 0.6, "z": 3.1, "fill": "gear_hi"},
            {"id": "eq_sw_fuller", "parent": "arm_near_lower", "offset": [0.2, 0], "length": 12.0, "angle": -40, "r1": 0.8, "r2": 0.4, "z": 3.15, "fill": "trim_hi"},
            {"id": "eq_sw_guard", "parent": "arm_near_lower", "offset": [0, 0], "length": 6.0, "angle": 50, "r1": 1.5, "r2": 1.5, "z": 3.12, "fill": "trim"},
            {"id": "eq_sw_pommel", "parent": "arm_near_lower", "offset": [0, 0], "length": 3.0, "angle": 140, "r1": 1.2, "r2": 1.6, "z": 3.1, "fill": "gear_dark"}
        ]
    },
    "battle_axe": {
        "id": "battle_axe", "slot": "weapon", "name": "Bearded Battle Axe",
        "bones": [
            {"id": "eq_axe_shaft", "parent": "arm_near_lower", "offset": [0, 0], "length": 18.0, "angle": -85, "r1": 1.4, "r2": 1.4, "z": 3.08, "fill": "gear_shadow"},
            {"id": "eq_axe_blade_front", "parent": "arm_near_lower", "offset": [0.8, -13.0], "length": 5.5, "angle": 5, "r1": 3.6, "r2": 1.2, "z": 3.15, "fill": "gear_hi"},
            {"id": "eq_axe_blade_rear", "parent": "arm_near_lower", "offset": [-0.8, -13.0], "length": 4.0, "angle": 185, "r1": 2.4, "r2": 1.0, "z": 3.14, "fill": "gear_base"},
            {"id": "eq_axe_spike", "parent": "arm_near_lower", "offset": [0, -14.0], "length": 4.5, "angle": -85, "r1": 1.2, "r2": 0.4, "z": 3.16, "fill": "gear_hi"}
        ]
    },
    "arcane_staff": {
        "id": "arcane_staff", "slot": "weapon", "name": "Sapphire Archmage Staff",
        "bones": [
            {"id": "eq_stf_shaft", "parent": "arm_near_lower", "offset": [0, 0], "length": 22.0, "angle": -88, "r1": 1.4, "r2": 1.4, "z": 3.08, "fill": "gear_dark"},
            {"id": "eq_stf_head", "parent": "arm_near_lower", "offset": [0, -18.0], "length": 5.0, "angle": -88, "r1": 2.4, "r2": 2.8, "z": 3.12, "fill": "trim"},
            {"id": "eq_stf_orb", "parent": "arm_near_lower", "offset": [0, -22.0], "length": 0, "shape": "head_oval", "r1": 3.2, "r2": 3.2, "z": 3.2, "fill": "trim_hi"}
        ]
    },
    "assassin_dagger": {
        "id": "assassin_dagger", "slot": "weapon", "name": "Venomous Stiletto Dagger",
        "bones": [
            {"id": "eq_dag_blade", "parent": "arm_near_lower", "offset": [0, 0], "length": 9.0, "angle": -80, "r1": 1.4, "r2": 0.4, "z": 3.1, "fill": "gear_hi"},
            {"id": "eq_dag_guard", "parent": "arm_near_lower", "offset": [0, 0], "length": 3.5, "angle": 10, "r1": 1.0, "r2": 1.0, "z": 3.12, "fill": "trim"},
            {"id": "eq_dag_grip", "parent": "arm_near_lower", "offset": [0, 0], "length": 2.5, "angle": 100, "r1": 1.0, "r2": 1.2, "z": 3.1, "fill": "gear_dark"}
        ]
    },
    "golden_spear": {
        "id": "golden_spear", "slot": "weapon", "name": "Gleaming Sun Spear",
        "bones": [
            {"id": "eq_spr_shaft", "parent": "arm_near_lower", "offset": [0, 0], "length": 26.0, "angle": -85, "r1": 1.3, "r2": 1.3, "z": 3.08, "fill": "gear_shadow"},
            {"id": "eq_spr_head", "parent": "arm_near_lower", "offset": [0, -20.0], "length": 7.0, "angle": -85, "r1": 2.6, "r2": 0.5, "z": 3.15, "fill": "trim_hi"},
            {"id": "eq_spr_cuff", "parent": "arm_near_lower", "offset": [0, -19.0], "length": 2.5, "angle": 5, "r1": 2.0, "r2": 2.0, "z": 3.16, "fill": "trim"}
        ]
    },

    # Off-Hand Shield
    "kite_shield": {
        "id": "kite_shield", "slot": "shield", "name": "Royal Kite Shield",
        "bones": [
            {"id": "eq_shd_body", "parent": "arm_far_upper", "offset": [0.5, 2.0], "length": 11.0, "angle": 15, "r1": 5.0, "r2": 3.0, "z": 0.08, "fill": "cape"},
            {"id": "eq_shd_boss", "parent": "arm_far_upper", "offset": [0.8, 5.0], "length": 0, "shape": "head_oval", "r1": 2.6, "r2": 2.6, "z": 0.09, "fill": "trim"},
            {"id": "eq_shd_cross", "parent": "arm_far_upper", "offset": [0.8, 5.0], "length": 7.0, "angle": 15, "r1": 1.2, "r2": 1.0, "z": 0.095, "fill": "trim_hi"}
        ]
    },
    "round_buckler": {
        "id": "round_buckler", "slot": "shield", "name": "Viking Bronze Buckler",
        "bones": [
            {"id": "eq_bck_round", "parent": "arm_far_lower", "offset": [0, 0], "length": 0, "shape": "head_oval", "r1": 5.4, "r2": 5.4, "z": 0.08, "fill": "gear_shadow"},
            {"id": "eq_bck_boss", "parent": "arm_far_lower", "offset": [0, 0], "length": 0, "shape": "head_oval", "r1": 2.2, "r2": 2.2, "z": 0.09, "fill": "trim"}
        ]
    },
    "spellbook": {
        "id": "spellbook", "slot": "shield", "name": "Arcane Tome of Wisdom",
        "bones": [
            {"id": "eq_tome_cover", "parent": "arm_far_lower", "offset": [1.0, 1.0], "length": 6.5, "angle": 85, "r1": 4.2, "r2": 4.2, "z": 0.08, "fill": "gear_dark"},
            {"id": "eq_tome_pages", "parent": "arm_far_lower", "offset": [1.2, 1.2], "length": 5.5, "angle": 85, "r1": 3.6, "r2": 3.6, "z": 0.085, "fill": "gear_hi"},
            {"id": "eq_tome_sigil", "parent": "arm_far_lower", "offset": [1.5, 4.0], "length": 0, "shape": "head_oval", "r1": 1.8, "r2": 1.8, "z": 0.09, "fill": "trim_hi"}
        ]
    },
    "dual_dagger": {
        "id": "dual_dagger", "slot": "shield", "name": "Off-Hand Parrying Dagger",
        "bones": [
            {"id": "eq_dualdag_blade", "parent": "arm_far_lower", "offset": [0, 0], "length": 8.0, "angle": -80, "r1": 1.3, "r2": 0.4, "z": 0.08, "fill": "gear_hi"},
            {"id": "eq_dualdag_guard", "parent": "arm_far_lower", "offset": [0, 0], "length": 3.0, "angle": 10, "r1": 0.9, "r2": 0.9, "z": 0.085, "fill": "trim"}
        ]
    },
    "tower_shield": {
        "id": "tower_shield", "slot": "shield", "name": "Iron Fortress Tower Shield",
        "bones": [
            {"id": "eq_twr_slab", "parent": "arm_far_upper", "offset": [0.5, 1.0], "length": 16.0, "angle": 90, "r1": 5.8, "r2": 5.5, "z": 0.08, "fill": "gear_dark"},
            {"id": "eq_twr_plate", "parent": "arm_far_upper", "offset": [0.8, 2.0], "length": 14.0, "angle": 90, "r1": 4.8, "r2": 4.5, "z": 0.085, "fill": "gear_base"},
            {"id": "eq_twr_slit", "parent": "arm_far_upper", "offset": [1.0, 3.0], "length": 3.0, "angle": 0, "r1": 1.0, "r2": 1.0, "z": 0.09, "fill": "gear_shadow"}
        ]
    },

    # Wanderer set. Silhouette-first wizard set: tall bent hat (needs 8px headroom), A-line robe with sleeves, staff angled outward so it breaks the body outline in every view.
    "pointed_hat": {
        "id": "pointed_hat",
        "slot": "head",
        "name": "Wanderer's Pointed Hat",
        "headroom": 8,
        "palette": {"hair": "#5a3b2a"},
        "bones": [
            {"id": "eq_hat_hair", "parent": "head", "offset": [-0.4, 0], "length": 0, "shape": "head_oval", "r1": 4.2, "r2": 4.1, "z": -5.0, "z_up": 1.6, "fill": "hair"},
            {"id": "eq_hat_cone", "parent": "head", "offset": [2.0, 0], "length": 7.0, "angle": 0, "r1": 4.6, "r2": 1.6, "z": 1.45, "fill": "gear_dark"},
            {"id": "eq_hat_tip", "parent": "eq_hat_cone", "offset": [0, 0], "length": 5.0, "angle": -75, "r1": 1.6, "r2": 0.6, "z": 1.45, "fill": "gear_dark"},
            {"id": "eq_hat_crown", "parent": "head", "offset": [3.6, 0], "length": 0, "shape": "head_oval", "r1": 2.2, "r2": 4.7, "z": 1.89, "fill": "gear_dark"},
            {"id": "eq_hat_band", "parent": "head", "offset": [4.4, -4.2], "length": 8.4, "angle": 90, "r1": 0.7, "r2": 0.7, "z": 1.91, "fill": "trim"},
            {"id": "eq_hat_brim", "parent": "head", "offset": [2.6, -6.8], "length": 13.6, "angle": 90, "r1": 1.1, "r2": 1.1, "z": 1.92, "fill": "gear_dark"}
        ]
    },
    "wanderer_robe": {
        "id": "wanderer_robe",
        "slot": "torso",
        "name": "Wanderer's Robe",
        "bones": [
            {"id": "eq_wrobe_body", "parent": "pelvis", "offset": [0, 0], "length": 8.5, "angle": 0, "r1": 4.3, "r2": 4.3, "z": 1.35, "fill": "gear_base"},
            {"id": "eq_wrobe_skirt", "parent": "pelvis", "offset": [-3.0, 0], "length": 10.5, "angle": 180, "r1": 4.4, "r2": 6.6, "z": 2.4, "z_down": 1.1, "z_up": 1.1, "fill": "gear_base"},
            {"id": "eq_wrobe_hem", "parent": "eq_wrobe_skirt", "offset": [0.5, -7.0], "length": 14.0, "angle": 90, "r1": 1.0, "r2": 1.0, "z": 2.42, "z_down": 1.12, "z_up": 1.12, "fill": "gear_shadow"},
            {"id": "eq_wrobe_sash", "parent": "pelvis", "offset": [-2.6, -4.6], "length": 9.2, "angle": 90, "r1": 1.0, "r2": 1.0, "z": 2.45, "z_down": 1.4, "z_up": 1.4, "fill": "trim"},
            {"id": "eq_wrobe_sleeve_near", "parent": "arm_near_upper", "offset": [-6.5, 0], "length": 6.5, "angle": 0, "r1": 2.3, "r2": 2.6, "z": 2.65, "z_down": 1.5, "z_up": 1.5, "fill": "gear_base"},
            {"id": "eq_wrobe_cuff_near", "parent": "arm_near_lower", "offset": [-5.5, 0], "length": 3.0, "angle": 0, "r1": 2.6, "r2": 2.9, "z": 2.66, "z_down": 1.51, "z_up": 1.51, "fill": "gear_shadow"},
            {"id": "eq_wrobe_sleeve_far", "parent": "arm_far_upper", "offset": [-6.5, 0], "length": 6.5, "angle": 0, "r1": 2.1, "r2": 2.4, "z": 0.12, "z_down": 1.45, "z_up": 1.45, "fill": "gear_shadow"},
            {"id": "eq_wrobe_cuff_far", "parent": "arm_far_lower", "offset": [-5.5, 0], "length": 3.0, "angle": 0, "r1": 2.4, "r2": 2.7, "z": 0.16, "z_down": 1.46, "z_up": 1.46, "fill": "gear_dark"}
        ]
    },
    "gnarled_staff": {
        "id": "gnarled_staff",
        "slot": "weapon",
        "name": "Gnarled Wanderer Staff",
        "palette": {"wood": "#8a5a34", "wood_dark": "#5a3a22", "orb": "#5fe0a0", "orb_hi": "#d4ffe8"},
        "bones": [
            {"id": "eq_rod_low", "parent": "arm_near_lower", "offset": [0, 0], "length": 5.0, "angle": 12, "r1": 1.0, "r2": 0.9, "z": 3.1, "z_down": 2.9, "z_up": 0.9, "fill": "wood_dark", "angle_down": 18, "angle_up": 18},
            {"id": "eq_rod_up", "parent": "arm_near_lower", "offset": [0, 0], "length": 17.0, "angle": 192, "r1": 1.0, "r2": 1.1, "z": 3.1, "z_down": 2.9, "z_up": 0.9, "fill": "wood", "angle_down": 198, "angle_up": 198},
            {"id": "eq_rod_crook", "parent": "eq_rod_up", "offset": [0, 0], "length": 3.2, "angle": -70, "r1": 1.1, "r2": 0.8, "z": 3.1, "z_down": 2.9, "z_up": 0.9, "fill": "wood"},
            {"id": "eq_rod_orb", "parent": "eq_rod_up", "offset": [-1.0, 0.9], "length": 0, "shape": "head_oval", "r1": 1.9, "r2": 1.9, "z": 3.15, "z_down": 2.95, "z_up": 0.95, "fill": "orb"}
        ]
    },
    # Back / Cape
    "red_cape": {
        "id": "red_cape", "slot": "back", "name": "Flowing Crimson Knight Cape",
        "bones": [
            {"id": "eq_cape_root", "parent": "chest", "offset": [-1.5, 0], "length": 6.0, "angle": 145, "r1": 3.5, "r2": 4.8, "z": -0.4, "fill": "cape_shadow"},
            {"id": "eq_cape_mid", "parent": "eq_cape_root", "offset": [0, 0], "length": 9.0, "angle": -10, "r1": 4.8, "r2": 6.2, "z": -0.42, "fill": "cape"},
            {"id": "eq_cape_tail", "parent": "eq_cape_mid", "offset": [0, 0], "length": 7.0, "angle": 15, "r1": 6.2, "r2": 7.5, "z": -0.44, "fill": "cape_dark"}
        ]
    },
    "shadow_cloak": {
        "id": "shadow_cloak", "slot": "back", "name": "Tattered Stealth Shadow Cloak",
        "bones": [
            {"id": "eq_cloak_root", "parent": "chest", "offset": [-1.2, 0], "length": 7.0, "angle": 140, "r1": 3.2, "r2": 4.5, "z": -0.4, "fill": "gear_dark"},
            {"id": "eq_cloak_mid", "parent": "eq_cloak_root", "offset": [0, 0], "length": 9.0, "angle": -15, "r1": 4.5, "r2": 6.0, "z": -0.42, "fill": "gear_shadow"},
            {"id": "eq_cloak_tail", "parent": "eq_cloak_mid", "offset": [0, 0], "length": 6.0, "angle": 20, "r1": 6.0, "r2": 7.0, "z": -0.44, "fill": "gear_dark"}
        ]
    },
    "elven_wings": {
        "id": "elven_wings", "slot": "back", "name": "Celestial Translucent Wings",
        "bones": [
            {"id": "eq_wing_far", "parent": "chest", "offset": [-2.0, -2.0], "length": 12.0, "angle": -130, "r1": 3.0, "r2": 1.0, "z": -0.45, "fill": "trim_hi"},
            {"id": "eq_wing_near", "parent": "chest", "offset": [1.5, -2.0], "length": 14.0, "angle": -50, "r1": 3.5, "r2": 1.2, "z": 2.9, "fill": "trim_hi"}
        ]
    }
}

# ==============================================================================
# 5. PRE-CONFIGURED LOADOUTS
# ==============================================================================
LOADOUTS = {
    "paladin": {
        "id": "paladin",
        "name": "Paladin Knight",
        "mannequin": "humanoid",
        "theme": "steel",
        "slots": {
            "head": "iron_helm",
            "torso": "steel_cuirass",
            "hands": "steel_gauntlets",
            "legs": "plate_greaves",
            "feet": "iron_sabatons",
            "weapon": "runed_broadsword",
            "shield": "kite_shield",
            "back": "red_cape"
        }
    },
    "archmage": {
        "id": "archmage",
        "name": "High Archmage",
        "mannequin": "humanoid",
        "theme": "cobalt",
        "slots": {
            "head": "wizard_hood",
            "torso": "mage_robe",
            "hands": "golden_bracers",
            "legs": "arcane_skirt",
            "feet": "winged_sandals",
            "weapon": "arcane_staff",
            "shield": "spellbook",
            "back": "red_cape"
        }
    },
    "assassin": {
        "id": "assassin",
        "name": "Shadow Assassin",
        "mannequin": "humanoid",
        "theme": "dark_iron",
        "slots": {
            "head": "shadow_cowl",
            "torso": "leather_vest",
            "hands": "shadow_wraps",
            "legs": "leather_pants",
            "feet": "shadow_boots",
            "weapon": "assassin_dagger",
            "shield": "dual_dagger",
            "back": "shadow_cloak"
        }
    },
    "death_knight": {
        "id": "death_knight",
        "name": "Undead Death Knight",
        "mannequin": "skeleton",
        "theme": "obsidian",
        "slots": {
            "head": "horned_helm",
            "torso": "bone_carapace",
            "hands": "steel_gauntlets",
            "legs": "chainmail_chausses",
            "feet": "iron_sabatons",
            "weapon": "battle_axe",
            "shield": "tower_shield",
            "back": "shadow_cloak"
        }
    },
    "sovereign": {
        "id": "sovereign",
        "name": "Golden Sovereign",
        "mannequin": "humanoid",
        "theme": "gold",
        "slots": {
            "head": "golden_crown",
            "torso": "royal_tunic",
            "hands": "golden_bracers",
            "legs": "chainmail_chausses",
            "feet": "winged_sandals",
            "weapon": "golden_spear",
            "shield": "round_buckler",
            "back": "red_cape"
        }
    },
    "orc_berserker": {
        "id": "orc_berserker",
        "name": "Orc Berserker",
        "mannequin": "orc",
        "theme": "crimson",
        "slots": {
            "head": "horned_helm",
            "torso": "leather_vest",
            "hands": "leather_gloves",
            "legs": "leather_pants",
            "feet": "leather_boots",
            "weapon": "battle_axe",
            "shield": "round_buckler",
            "back": "none"
        }
    },
    "chibi_hero": {
        "id": "chibi_hero",
        "name": "Chibi Hero",
        "mannequin": "chibi",
        "theme": "steel",
        "slots": {
            "head": "iron_helm",
            "torso": "steel_cuirass",
            "hands": "steel_gauntlets",
            "legs": "plate_greaves",
            "feet": "iron_sabatons",
            "weapon": "runed_broadsword",
            "shield": "round_buckler",
            "back": "red_cape"
        }
    },
    "wanderer": {
        "id": "wanderer",
        "name": "Wandering Mage",
        "mannequin": "humanoid",
        "theme": "amethyst",
        "slots": {
            "head": "pointed_hat",
            "torso": "wanderer_robe",
            "hands": "none",
            "legs": "none",
            "feet": "leather_boots",
            "weapon": "gnarled_staff",
            "shield": "none",
            "back": "none"
        }
    },
    "unarmored": {
        "id": "unarmored",
        "name": "Bare Mannequin",
        "mannequin": "humanoid",
        "theme": "steel",
        "slots": {
            "head": "none",
            "torso": "none",
            "hands": "none",
            "legs": "none",
            "feet": "none",
            "weapon": "none",
            "shield": "none",
            "back": "none"
        }
    }
}

# ==============================================================================
# 6. ANALYTICAL IK & DIRECTIONAL KINEMATICS
# ==============================================================================
def solve_ik_2bone(root, target, l1, l2, flip=False):
    """Analytical Law-of-Cosines 2-Bone Inverse Kinematics solver."""
    ax, ay = float(root[0]), float(root[1])
    bx, by = float(target[0]), float(target[1])
    l1 = max(0.5, float(l1))
    l2 = max(0.5, float(l2))
    dx = bx - ax
    dy = by - ay
    dist = math.hypot(dx, dy)
    min_d = abs(l1 - l2) + 1e-4
    max_d = (l1 + l2) - 1e-4
    d_clamped = max(min_d, min(max_d, dist))
    cos_a = max(-1.0, min(1.0, (l1 * l1 + d_clamped * d_clamped - l2 * l2) / (2.0 * l1 * d_clamped)))
    alpha = math.acos(cos_a)
    base_ang = math.atan2(dy, dx)
    joint_ang = base_ang - alpha if flip else base_ang + alpha
    jx = ax + l1 * math.cos(joint_ang)
    jy = ay + l1 * math.sin(joint_ang)
    scale = (d_clamped / dist) if dist > 1e-5 else 0.0
    ex = ax + dx * scale
    ey = ay + dy * scale
    return (ax, ay), (jx, jy), (ex, ey)


def get_ik_leg_deltas(hip, ankle, l1, l2, flip=False):
    """Compute local delta angles for thigh and shin from IK target."""
    root, knee, eff = solve_ik_2bone(hip, ankle, l1, l2, flip=flip)
    ang_thigh = math.degrees(math.atan2(knee[1] - root[1], knee[0] - root[0]))
    ang_shin = math.degrees(math.atan2(eff[1] - knee[1], eff[0] - knee[0]))
    d_thigh = (ang_thigh - 90.0 + 180.0) % 360.0 - 180.0
    d_shin = (ang_shin - ang_thigh + 180.0) % 360.0 - 180.0
    return round(d_thigh, 2), round(d_shin, 2)


def adapt_bones_for_direction(bones, direction="right"):
    """
    Transforms bone coordinates, parent offsets, and Z-depth layers
    to match Top-Down 4 directions: 'down' (South), 'left' (West), 'right' (East), 'up' (North).
    """
    adapted = []
    for b in bones:
        nb = json.loads(json.dumps(b))
        bid = nb.get("id", "")

        if direction in ("down", "up"):
            # Symmetrical front / back placement
            if bid == "arm_far_upper":
                nb["offset"] = [-1.0, -4.5]
                nb["angle"] = 180
                nb["z"] = 1.22
            elif bid == "arm_near_upper":
                nb["offset"] = [-1.0, 4.5]
                nb["angle"] = 180
                nb["z"] = 1.24
            elif bid == "arm_far_lower":
                nb["angle"] = 0
                nb["z"] = 1.22
            elif bid == "arm_near_lower":
                nb["angle"] = 0
                nb["z"] = 1.24
            elif bid == "leg_far_thigh":
                nb["offset"] = [0, -2.5]
                nb["angle"] = 180
                nb["z"] = 1.02
            elif bid == "leg_near_thigh":
                nb["offset"] = [0, 2.5]
                nb["angle"] = 180
                nb["z"] = 1.04
            elif bid in ("leg_far_shin", "foot_far"):
                # Keep the whole leg on the thigh's depth tier in front/back views
                # (the profile tiers 0.25 / 2.2 put shins behind the body or over the arms).
                nb["z"] = 1.02
                if bid == "foot_far":
                    nb["angle"] = 0
            elif bid in ("leg_near_shin", "foot_near"):
                nb["z"] = 1.04
                if bid == "foot_near":
                    nb["angle"] = 0
            elif bid == "head":
                if direction == "down":
                    nb["features"] = {"eyes": {"spacing": 4.5, "dy": -0.5, "w": 1.2, "h": 1.8, "color": "eyes"}}
                else:
                    nb["features"] = None

            # Equipment Z-ordering & resting angle in front/back view
            if "cape" in bid or "cloak" in bid:
                nb["z"] = 0.4 if direction == "down" else 2.5
                # Hang straight down behind/over the back instead of the profile's diagonal sweep.
                if bid.endswith("_root"):
                    nb["angle"] = 180
                    nb["offset"] = [0, 0]
                else:
                    nb["angle"] = 0
            if bid.startswith("eq_helm_crest"):
                nb["angle"] = 0
                nb["offset"] = [0, 0]
            if bid.startswith("eq_helm_brow"):
                if direction == "down":
                    # Front view: a dark horizontal visor slit across the helmet.
                    nb["angle"] = 90
                    nb["offset"] = [0.5, -1.6]
                    nb["length"] = 3.2
                    nb["r1"] = 0.7
                    nb["r2"] = 0.7
                    nb["fill"] = "gear_dark"
                else:
                    nb["hidden"] = True
            if "shd" in bid:
                nb["z"] = 1.4 if direction == "down" else 1.1
                if "body" in bid:
                    nb["angle"] = 10
                    nb["offset"] = [0, 0]
                elif "cross" in bid:
                    nb["angle"] = 10
                    nb["offset"] = [0, 2]
                elif "boss" in bid:
                    nb["offset"] = [0, 2]
            if "sw_" in bid or "axe_" in bid or "stf_" in bid or "dgr_" in bid or "spear_" in bid:
                # In front of leg armour when facing the camera, behind the body from the back.
                nb["z"] = 2.9 if direction == "down" else 0.9
                # Carried low and angled outward so the silhouette stays readable.
                if "blade" in bid or "fuller" in bid or "shaft" in bid or "head" in bid or "spear_tip" in bid:
                    nb["angle"] = -25
                elif "guard" in bid:
                    nb["angle"] = 65
                elif "pommel" in bid:
                    nb["angle"] = 155

            # Per-bone overrides for front/back views, e.g. "z_down", "angle_up".
            for key in ("z", "angle", "offset", "length"):
                if (key + "_" + direction) in nb:
                    nb[key] = nb[key + "_" + direction]

        adapted.append(nb)
    return adapted


def flip_buffer_h(width, height, buf, is_normal=False):
    """Horizontally mirror a raw RGBA buffer, flipping X normal component if is_normal=True."""
    out = bytearray(len(buf))
    for y in range(height):
        for x in range(width):
            src_x = width - 1 - x
            src_idx = (y * width + src_x) * 4
            dst_idx = (y * width + x) * 4
            if is_normal:
                r = buf[src_idx]
                out[dst_idx] = 255 - r
                out[dst_idx + 1] = buf[src_idx + 1]
                out[dst_idx + 2] = buf[src_idx + 2]
                out[dst_idx + 3] = buf[src_idx + 3]
            else:
                out[dst_idx:dst_idx + 4] = buf[src_idx:src_idx + 4]
    return out


def compute_pose(action_id, frame_index, total_frames, direction="right", use_ik=True):
    t = frame_index / float(total_frames)
    phase = t * 2.0 * math.pi

    if action_id == "walk":
        if direction in ("right", "left"):
            if not use_ik:
                # Fallback to classical trigonometric FK
                bob = -1.5 * abs(math.sin(phase))
                torso_tilt = 2.0 * math.sin(phase)
                leg_stride = 24.0 * math.sin(phase)
                near_knee = max(0.0, -32.0 * math.cos(phase))
                far_knee = max(0.0, 32.0 * math.cos(phase))
                arm_swing = -22.0 * math.sin(phase)
                near_elbow = max(0.0, 16.0 * math.sin(phase))
                far_elbow = max(0.0, -16.0 * math.sin(phase))
                cape_wave = 14.0 * math.sin(phase - 0.8)

                return {
                    "pelvis": {"dy": bob},
                    "torso": {"dAngle": torso_tilt},
                    "chest": {"dAngle": torso_tilt * 0.5},
                    "head": {"dAngle": -torso_tilt * 0.5},
                    "leg_near_thigh": {"dAngle": leg_stride},
                    "leg_near_shin": {"dAngle": near_knee},
                    "foot_near": {"dAngle": -near_knee * 0.5},
                    "leg_far_thigh": {"dAngle": -leg_stride},
                    "leg_far_shin": {"dAngle": far_knee},
                    "foot_far": {"dAngle": -far_knee * 0.5},
                    "arm_near_upper": {"dAngle": arm_swing},
                    "arm_near_lower": {"dAngle": near_elbow},
                    "arm_far_upper": {"dAngle": -arm_swing},
                    "arm_far_lower": {"dAngle": far_elbow},
                    "eq_cape_mid": {"dAngle": cape_wave},
                    "eq_cape_tail": {"dAngle": cape_wave * 1.5}
                }

            # -------------------------------------------------------------
            # ZERO FOOT-SLIDING GROUND CONTACT ANALYTICAL IK
            # -------------------------------------------------------------
            bob = -1.2 * abs(math.sin(phase))
            hip_x = 24.0
            hip_y = 26.0 + bob
            stride = 10.0
            h_lift = 3.2
            y_ground = 41.5
            l1, l2 = 7.5, 7.0

            # Near leg (phase 0 to 1)
            t_near = t % 1.0
            if t_near < 0.5:
                # Stance Phase: ankle locked on ground, travels linearly backward
                prog = t_near / 0.5
                ankle_near_x = (hip_x + stride * 0.5) - stride * prog
                ankle_near_y = y_ground
                foot_near_dang = 0.0
            else:
                # Swing Phase: smoothstep forward + parabolic foot lift
                u = (t_near - 0.5) / 0.5
                ankle_near_x = (hip_x - stride * 0.5) + stride * (u * u * (3.0 - 2.0 * u))
                ankle_near_y = y_ground - h_lift * math.sin(math.pi * u)
                foot_near_dang = -12.0 * math.sin(math.pi * u)

            dt_near, ds_near = get_ik_leg_deltas((hip_x, hip_y), (ankle_near_x, ankle_near_y), l1, l2)

            # Far leg (phase shifted by 0.5 / 180 degrees)
            t_far = (t + 0.5) % 1.0
            if t_far < 0.5:
                prog = t_far / 0.5
                ankle_far_x = (hip_x + stride * 0.5) - stride * prog
                ankle_far_y = y_ground
                foot_far_dang = 0.0
            else:
                u = (t_far - 0.5) / 0.5
                ankle_far_x = (hip_x - stride * 0.5) + stride * (u * u * (3.0 - 2.0 * u))
                ankle_far_y = y_ground - h_lift * math.sin(math.pi * u)
                foot_far_dang = -12.0 * math.sin(math.pi * u)

            dt_far, ds_far = get_ik_leg_deltas((hip_x, hip_y), (ankle_far_x, ankle_far_y), l1, l2)

            arm_swing = -24.0 * math.sin(phase)
            near_elbow = max(0.0, 18.0 * math.sin(phase))
            far_elbow = max(0.0, -18.0 * math.sin(phase))
            torso_tilt = 2.0 * math.sin(phase)
            cape_wave = 14.0 * math.sin(phase - 0.8)

            return {
                "pelvis": {"dy": bob},
                "torso": {"dAngle": torso_tilt},
                "chest": {"dAngle": torso_tilt * 0.5},
                "head": {"dAngle": -torso_tilt * 0.5},
                "leg_near_thigh": {"dAngle": dt_near},
                "leg_near_shin": {"dAngle": ds_near},
                "foot_near": {"dAngle": foot_near_dang},
                "leg_far_thigh": {"dAngle": dt_far},
                "leg_far_shin": {"dAngle": ds_far},
                "foot_far": {"dAngle": foot_far_dang},
                "arm_near_upper": {"dAngle": arm_swing},
                "arm_near_lower": {"dAngle": near_elbow},
                "arm_far_upper": {"dAngle": -arm_swing},
                "arm_far_lower": {"dAngle": far_elbow},
                "eq_cape_mid": {"dAngle": cape_wave},
                "eq_cape_tail": {"dAngle": cape_wave * 1.5}
            }

        elif direction in ("down", "up"):
            # Top-Down Front/Back walk kinematics with lateral weight shift
            sway_x = 0.8 * math.sin(phase)
            bob_y = -1.2 * abs(math.sin(phase))
            torso_tilt = -1.5 * math.sin(phase)

            t_left = t % 1.0
            t_right = (t + 0.5) % 1.0
            dir_mult = 1.0 if direction == "down" else -1.0

            if t_left < 0.5:
                # Stance leg
                leg_l_thigh_ang = 0.0
                leg_l_shin_ang = 0.0
                leg_l_dz = 0.0
            else:
                # Swing leg stepping forward towards camera (down) or away (up)
                u = (t_left - 0.5) / 0.5
                leg_l_thigh_ang = -14.0 * math.sin(math.pi * u) * dir_mult
                leg_l_shin_ang = 18.0 * math.sin(math.pi * u) * dir_mult
                leg_l_dz = 0.22 * math.sin(math.pi * u) * dir_mult

            if t_right < 0.5:
                # Stance leg
                leg_r_thigh_ang = 0.0
                leg_r_shin_ang = 0.0
                leg_r_dz = 0.0
            else:
                u = (t_right - 0.5) / 0.5
                leg_r_thigh_ang = -14.0 * math.sin(math.pi * u) * dir_mult
                leg_r_shin_ang = 18.0 * math.sin(math.pi * u) * dir_mult
                leg_r_dz = 0.22 * math.sin(math.pi * u) * dir_mult

            arm_swing_l = 15.0 * math.sin(phase)
            arm_swing_r = -15.0 * math.sin(phase)
            arm_l_dz = -0.15 * math.sin(phase)
            arm_r_dz = 0.15 * math.sin(phase)
            cape_sway = 6.0 * math.sin(phase)

            return {
                "pelvis": {"dx": sway_x, "dy": bob_y},
                "torso": {"dAngle": torso_tilt},
                "chest": {"dAngle": torso_tilt * 0.5},
                "head": {"dAngle": -torso_tilt * 0.5},
                "leg_far_thigh": {"dAngle": leg_l_thigh_ang, "dz": leg_l_dz},
                "leg_far_shin": {"dAngle": leg_l_shin_ang, "dz": leg_l_dz},
                "leg_near_thigh": {"dAngle": leg_r_thigh_ang, "dz": leg_r_dz},
                "leg_near_shin": {"dAngle": leg_r_shin_ang, "dz": leg_r_dz},
                "arm_far_upper": {"dAngle": arm_swing_l, "dz": arm_l_dz},
                "arm_near_upper": {"dAngle": arm_swing_r, "dz": arm_r_dz},
                "eq_cape_mid": {"dAngle": cape_sway}
            }

    elif action_id == "attack":
        keyframes = [
            {"pelvis": {"dy": 0}, "arm_near_upper": {"dAngle": -10}, "arm_near_lower": {"dAngle": 15}, "arm_far_upper": {"dAngle": 10}, "leg_near_thigh": {"dAngle": 5}},
            {"pelvis": {"dy": 0.5, "dx": -1}, "torso": {"dAngle": -8}, "arm_near_upper": {"dAngle": -55}, "arm_near_lower": {"dAngle": 40}, "eq_cape_mid": {"dAngle": -15}},
            {"pelvis": {"dy": 1.0, "dx": -2}, "torso": {"dAngle": -14}, "arm_near_upper": {"dAngle": -95}, "arm_near_lower": {"dAngle": 65}, "eq_cape_mid": {"dAngle": -30}},
            {"pelvis": {"dy": -1.0, "dx": 3.5}, "torso": {"dAngle": 18}, "arm_near_upper": {"dAngle": 65}, "arm_near_lower": {"dAngle": -15}, "leg_near_thigh": {"dAngle": 26}, "eq_cape_mid": {"dAngle": 40}},
            {"pelvis": {"dy": -0.5, "dx": 2.0}, "torso": {"dAngle": 12}, "arm_near_upper": {"dAngle": 45}, "arm_near_lower": {"dAngle": 0}, "leg_near_thigh": {"dAngle": 16}, "eq_cape_mid": {"dAngle": 25}},
            {"pelvis": {"dy": 0, "dx": 1.0}, "torso": {"dAngle": 4}, "arm_near_upper": {"dAngle": 15}, "arm_near_lower": {"dAngle": 10}, "leg_near_thigh": {"dAngle": 8}, "eq_cape_mid": {"dAngle": 10}}
        ]
        return keyframes[frame_index % len(keyframes)]

    elif action_id == "idle":
        breathe = 0.8 * math.sin(phase)
        arm_sway = 2.5 * math.sin(phase)
        return {
            "pelvis": {"dy": breathe * 0.4},
            "torso": {"dy": breathe * 0.7},
            "chest": {"dy": breathe},
            "arm_near_upper": {"dAngle": arm_sway},
            "arm_far_upper": {"dAngle": -arm_sway},
            "eq_cape_mid": {"dAngle": 4.0 * math.sin(phase)}
        }

    elif action_id == "hurt":
        keyframes = [
            {"pelvis": {"dx": -3.0, "dy": 1.0}, "torso": {"dAngle": -16}, "head": {"dAngle": -22}, "arm_near_upper": {"dAngle": -45}, "arm_near_lower": {"dAngle": 50}, "leg_near_shin": {"dAngle": 25}, "eq_cape_mid": {"dAngle": -35}},
            {"pelvis": {"dx": -4.0, "dy": 1.5}, "torso": {"dAngle": -18}, "head": {"dAngle": -20}, "arm_near_upper": {"dAngle": -35}, "arm_near_lower": {"dAngle": 40}, "eq_cape_mid": {"dAngle": -25}},
            {"pelvis": {"dx": -2.0, "dy": 0.5}, "torso": {"dAngle": -8}, "head": {"dAngle": -8}, "arm_near_upper": {"dAngle": -15}, "arm_near_lower": {"dAngle": 20}, "eq_cape_mid": {"dAngle": -10}},
            {"pelvis": {"dx": -0.5, "dy": 0}, "torso": {"dAngle": -2}, "head": {"dAngle": -2}, "arm_near_upper": {"dAngle": 0}}
        ]
        return keyframes[frame_index % len(keyframes)]

    elif action_id == "run":
        bob = -2.2 * abs(math.sin(phase))
        torso_tilt = 10.0 + 3.0 * math.sin(phase)
        leg_stride = 42.0 * math.sin(phase)
        near_knee = max(0.0, -56.0 * math.cos(phase))
        far_knee = max(0.0, 56.0 * math.cos(phase))
        arm_swing = -45.0 * math.sin(phase)
        near_elbow = max(10.0, 32.0 * math.sin(phase))
        far_elbow = max(10.0, -32.0 * math.sin(phase))
        return {
            "pelvis": {"dy": bob},
            "torso": {"dAngle": torso_tilt},
            "chest": {"dAngle": torso_tilt * 0.8},
            "head": {"dAngle": -torso_tilt * 0.6},
            "leg_near_thigh": {"dAngle": leg_stride},
            "leg_near_shin": {"dAngle": near_knee},
            "leg_far_thigh": {"dAngle": -leg_stride},
            "leg_far_shin": {"dAngle": far_knee},
            "arm_near_upper": {"dAngle": arm_swing},
            "arm_near_lower": {"dAngle": near_elbow},
            "arm_far_upper": {"dAngle": -arm_swing},
            "arm_far_lower": {"dAngle": far_elbow},
            "eq_cape_mid": {"dAngle": 35.0 + 15.0 * math.sin(phase)}
        }
    return {}


# ==============================================================================
# 7. ASSEMBLE SPEC
# ==============================================================================
def assemble_spec(mannequin_id="humanoid", equipped_slots=None, action_id="walk", theme_id="steel", num_frames=None, direction="down", use_ik=True):
    man_def = MANNEQUINS.get(mannequin_id, MANNEQUINS["humanoid"])
    theme_def = THEMES.get(theme_id, THEMES["steel"])
    equipped = equipped_slots or {}

    width = man_def.get("width", 48)
    height = man_def.get("height", 48)

    palette = {
        ".": [0, 0, 0, 0],
        " ": [0, 0, 0, 0],
        "o": "#10141f"
    }
    palette.update(man_def.get("palette", {}))
    palette.update({
        "gear_base": theme_def["gear_base"],
        "gear_hi": theme_def["gear_hi"],
        "gear_shadow": theme_def["gear_shadow"],
        "gear_dark": theme_def["gear_dark"],
        "trim": theme_def["trim"],
        "trim_hi": theme_def["trim_hi"],
        # Cloth is independent of the metal theme so capes never turn into metal blobs.
        "cape": theme_def.get("cape", "#a8323a"),
        "cape_shadow": theme_def.get("cape_shadow", "#7a2230"),
        "cape_dark": theme_def.get("cape_dark", "#561a28")
    })

    composite_bones = []
    base_ids = set()
    for b in man_def.get("bones", []):
        b_copy = json.loads(json.dumps(b))
        composite_bones.append(b_copy)
        base_ids.add(b_copy["id"])

    for slot_def in SLOTS:
        s_id = slot_def["id"]
        item_id = equipped.get(s_id)
        if not item_id or item_id == "none":
            continue
        item_def = ITEMS.get(item_id)
        if not item_def or "bones" not in item_def:
            continue
        # Items may bring their own colours (wood, gems...) independent of the theme.
        palette.update(item_def.get("palette", {}))
        for eq_bone in item_def["bones"]:
            b_copy = json.loads(json.dumps(eq_bone))
            if b_copy.get("parent") and b_copy["parent"] not in base_ids and not any(cb["id"] == b_copy["parent"] for cb in composite_bones):
                b_copy["parent"] = "chest"
            composite_bones.append(b_copy)

    # Tall headgear (pointed hats, plumes) declares "headroom": the canvas grows by
    # that many pixels at the top and the whole rig shifts down, so nothing is clipped.
    # IK targets are relative to the hip, so a uniform shift keeps the poses intact.
    headroom = 0
    for slot_def in SLOTS:
        item_def = ITEMS.get(equipped.get(slot_def["id"]) or "none") or {}
        headroom = max(headroom, int(item_def.get("headroom", 0) or 0))
    if headroom:
        height += headroom
        for b in composite_bones:
            if not b.get("parent"):
                b["y"] = float(b.get("y", 0.0)) + headroom

    # Adapt bones for Top-Down direction ('down', 'up', 'right', 'left')
    render_dir = "right" if direction == "left" else direction
    composite_bones = adapt_bones_for_direction(composite_bones, render_dir)

    default_frames = {"walk": 8, "attack": 6, "idle": 6, "hurt": 4, "run": 6}.get(action_id, 8)
    frames_count = num_frames if (num_frames and num_frames > 0) else default_frames

    frames_list = []
    for fi in range(frames_count):
        pose = compute_pose(action_id, fi, frames_count, direction=render_dir, use_ik=use_ik)
        frames_list.append({"pose": pose})

    return {
        "type": "rig",
        "name": f"paperdoll_{mannequin_id}_{action_id}_{direction}",
        "label": f"Paper Doll: {man_def['name']} ({action_id} - {direction.upper()})",
        "width": width,
        "height": height,
        "direction": direction,
        "palette": palette,
        "rig": {
            "outline": "o",
            "outlineWidth": 1,
            "crease": True,
            "creaseDelta": 0.45,
            "creaseDarken": 0.6,
            "bones": composite_bones
        },
        "postProcess": {
            "autoOutline": True,
            "autoShading": False,
            "sdfShading": True,
            "selOut": False
        },
        "frames": frames_list
    }


def render_4way_sheet(mannequin_id="humanoid", equipped_slots=None, action_id="walk", theme_id="steel", num_frames=None, use_ik=True):
    """
    Renders a unified 4-direction RPG Spritesheet:
    Row 0: Down (South / Front View)
    Row 1: Left (West)
    Row 2: Right (East)
    Row 3: Up (North / Back View)
    Returns: dict(width, height, sheet_buffer, normal_buffer, frames_count)
    """
    directions = ["down", "left", "right", "up"]
    default_frames = {"walk": 8, "attack": 6, "idle": 6, "hurt": 4, "run": 6}.get(action_id, 8)
    frames_count = num_frames if (num_frames and num_frames > 0) else default_frames

    specs = {}
    for d in ["down", "right", "up"]:
        specs[d] = assemble_spec(
            mannequin_id=mannequin_id,
            equipped_slots=equipped_slots,
            action_id=action_id,
            theme_id=theme_id,
            num_frames=frames_count,
            direction=d,
            use_ik=use_ik
        )

    w = specs["down"]["width"]
    h = specs["down"]["height"]
    sheet_w = w * frames_count
    sheet_h = h * 4
    sheet_buf = bytearray(sheet_w * sheet_h * 4)
    norm_buf = bytearray(sheet_w * sheet_h * 4)

    for row_idx, direction in enumerate(directions):
        spec_to_render = specs["right"] if direction == "left" else specs[direction]

        for fi in range(1, frames_count + 1):
            rf = pixeldsl.render_rig(spec_to_render, fi)
            f_buf = rf["buffer"]
            f_norm = rf.get("normal_buffer") or rf.get("normalBuffer")

            if direction == "left":
                f_buf = flip_buffer_h(w, h, f_buf, is_normal=False)
                if f_norm:
                    f_norm = flip_buffer_h(w, h, f_norm, is_normal=True)

            dst_col = fi - 1
            for y in range(h):
                sheet_y = row_idx * h + y
                for x in range(w):
                    sheet_x = dst_col * w + x
                    src_i = (y * w + x) * 4
                    dst_i = (sheet_y * sheet_w + sheet_x) * 4
                    sheet_buf[dst_i:dst_i + 4] = f_buf[src_i:src_i + 4]
                    if f_norm:
                        norm_buf[dst_i:dst_i + 4] = f_norm[src_i:src_i + 4]

    return {
        "width": sheet_w,
        "height": sheet_h,
        "frame_width": w,
        "frame_height": h,
        "frames_count": frames_count,
        "sheet_buffer": sheet_buf,
        "normal_buffer": norm_buf
    }


# ==============================================================================
# 8. GAME ENGINE ASSET EXPORTERS (GODOT 4 & UNITY 2D)
# ==============================================================================
def generate_godot4_tres(sheet_path: str, mannequin: str, action: str, frame_w: int, frame_h: int, num_frames: int, is_4way: bool, fps: float = 8.0) -> str:
    sheet_filename = os.path.basename(sheet_path)
    if is_4way:
        directions = [
            ("down", 0, f"{action}_down"),
            ("left", 1, f"{action}_left"),
            ("right", 2, f"{action}_right"),
            ("up", 3, f"{action}_up"),
        ]
    else:
        directions = [("main", 0, action)]

    sub_resources = []
    anim_blocks = []

    for d_name, row_idx, anim_name in directions:
        frame_refs = []
        for fi in range(num_frames):
            sub_id = f"AtlasTexture_{d_name}_{fi}"
            sub_resources.append(
                f'[sub_resource type="AtlasTexture" id="{sub_id}"]\n'
                f'atlas = ExtResource("1_sheet")\n'
                f'region = Rect2({fi * frame_w}, {row_idx * frame_h}, {frame_w}, {frame_h})\n'
            )
            frame_refs.append(f'{{\n"duration": 1.0,\n"texture": SubResource("{sub_id}")\n}}')

        anim_blocks.append(
            f'{{\n"frames": [{", ".join(frame_refs)}],\n"loop": true,\n"name": &"{anim_name}",\n"speed": {fps:.1f}\n}}'
        )

    total_steps = 2 + len(directions) * num_frames
    # Backslashes are not allowed inside f-string expressions before Python 3.12.
    sub_text = "\n".join(sub_resources)
    # No uid: Godot assigns one on import; a hand-made uid string is not a valid uid.
    return f"""[gd_resource type="SpriteFrames" load_steps={total_steps} format=3]

[ext_resource type="Texture2D" path="res://{sheet_filename}" id="1_sheet"]

{sub_text}
[resource]
animations = [{", ".join(anim_blocks)}]
"""


def generate_unity_json(sheet_path: str, mannequin: str, action: str, frame_w: int, frame_h: int, num_frames: int, is_4way: bool) -> dict:
    sheet_filename = os.path.basename(sheet_path)
    norm_filename = sheet_filename.rsplit(".", 1)[0] + "_normal.png"
    if is_4way:
        directions = [("down", 0), ("left", 1), ("right", 2), ("up", 3)]
        sheet_h = frame_h * 4
    else:
        directions = [("main", 0)]
        sheet_h = frame_h
    sheet_w = frame_w * num_frames

    frames_dict = {}
    for d_name, row_idx in directions:
        for fi in range(num_frames):
            frame_key = f"{mannequin}_{action}_{d_name}_f{fi + 1}"
            frames_dict[frame_key] = {
                "frame": {"x": fi * frame_w, "y": row_idx * frame_h, "w": frame_w, "h": frame_h},
                "rotated": False,
                "trimmed": False,
                "spriteSourceSize": {"x": 0, "y": 0, "w": frame_w, "h": frame_h},
                "sourceSize": {"w": frame_w, "h": frame_h},
                "pivot": {"x": 0.5, "y": 0.5}
            }

    return {
        "frames": frames_dict,
        "meta": {
            "app": "PixelDSL Studio",
            "version": "3.2",
            "image": sheet_filename,
            "normalMap": norm_filename,
            "format": "RGBA8888",
            "size": {"w": sheet_w, "h": sheet_h},
            "scale": "1",
            "smartupdate": "$TexturePacker:SmartUpdate:pixeldsl_studio$"
        }
    }


# ==============================================================================
# 9. MAIN CLI DISPATCH
# ==============================================================================
def main():
    parser = argparse.ArgumentParser(
        description="PixelDSL Studio v3.0 — Modular Paper Doll & Equipment Matrix Engine (CLI)"
    )
    parser.add_argument("--mannequin", choices=list(MANNEQUINS.keys()), default="humanoid", help="Base character mannequin")
    parser.add_argument("--loadout", choices=list(LOADOUTS.keys()), help="Apply pre-configured archetype loadout")
    parser.add_argument("--theme", choices=list(THEMES.keys()), default="steel", help="Equipment material color theme")
    parser.add_argument("--equip", type=str, help="Comma-separated slot:item pairs, e.g. 'head:iron_helm,weapon:battle_axe'")
    parser.add_argument("--action", choices=["walk", "attack", "idle", "hurt", "run"], default="walk", help="Kinematic animation action")
    parser.add_argument("--direction", choices=["down", "left", "right", "up", "4way"], default="down", help="Directional view angle")
    parser.add_argument("--4way", dest="is_4way", action="store_true", help="Generate full 4-direction RPG Spritesheet (Down, Left, Right, Up rows)")
    parser.add_argument("--ik", dest="use_ik", action="store_true", default=True, help="Enable Ground Contact Analytical IK (default)")
    parser.add_argument("--no-ik", dest="use_ik", action="store_false", help="Disable IK and fallback to trigonometric FK")
    parser.add_argument("--frames", type=int, help="Override animation frame count")
    parser.add_argument("-o", "--out", type=str, help="Output PNG path (defaults to game_ready/<name>.png)")
    parser.add_argument("--normal", action="store_true", help="Also generate 3D normal map PNG")
    parser.add_argument("--sheet", action="store_true", help="Also generate horizontal sprite sheet PNG")
    parser.add_argument("--export-godot", action="store_true", help="Export Godot 4 SpriteFrames .tres resource")
    parser.add_argument("--export-unity", action="store_true", help="Export Unity 2D SpriteAtlas JSON metadata")
    parser.add_argument("--spec", action="store_true", help="Output JSON spec to stdout")
    parser.add_argument("--list-slots", action="store_true", help="List all equipment slots")
    parser.add_argument("--list-items", action="store_true", help="List all items in the catalog")
    parser.add_argument("--list-loadouts", action="store_true", help="List all pre-configured loadouts")
    parser.add_argument("--list-mannequins", action="store_true", help="List all available mannequins")

    args = parser.parse_args()

    if args.list_slots:
        print("\n=== PixelDSL Paper Doll Equipment Slots ===")
        for s in SLOTS:
            print(f"  {s['icon']} {s['id']:<10} : {s['name']:<18} ({s['desc']})")
        return

    if args.list_mannequins:
        print("\n=== PixelDSL Base Mannequins ===")
        for m_id, m in MANNEQUINS.items():
            print(f"  • {m_id:<14} : {m['name']} ({m['width']}x{m['height']})")
        return

    if args.list_loadouts:
        print("\n=== PixelDSL Pre-Configured Loadouts ===")
        for l_id, l in LOADOUTS.items():
            slots_str = ", ".join(f"{k}:{v}" for k, v in l["slots"].items() if v != "none")
            print(f"  • {l_id:<16} : [{l['mannequin']}] {l['name']}")
            print(f"    Equipped: {slots_str}\n")
        return

    if args.list_items:
        print("\n=== PixelDSL Modular Equipment Catalog ===")
        for item_id, item in ITEMS.items():
            if item_id == "none":
                continue
            slot = item.get("slot", "?")
            bones_count = len(item.get("bones", []))
            print(f"  • {item_id:<20} [{slot:<8}] : {item['name']} ({bones_count} bones)")
        return

    # Determine loadout / equipment
    mannequin = args.mannequin
    theme = args.theme
    equipped = {}

    if args.loadout and args.loadout in LOADOUTS:
        ld = LOADOUTS[args.loadout]
        mannequin = ld.get("mannequin", mannequin)
        theme = ld.get("theme", theme)
        equipped = dict(ld.get("slots", {}))

    if args.equip:
        for pair in args.equip.split(","):
            if ":" in pair:
                s, it = pair.strip().split(":", 1)
                equipped[s.strip()] = it.strip()

    is_4way = args.is_4way or (args.direction == "4way")
    direction = "down" if is_4way else args.direction

    if is_4way:
        out_name = args.out or f"paperdoll_{mannequin}_{args.action}_4way.png"
        os.makedirs(os.path.dirname(out_name) if os.path.dirname(out_name) else ".", exist_ok=True)
        print(f"\n[+] Rendering 4-Way RPG Spritesheet: {mannequin} ({args.action}) [IK={args.use_ik}]...")

        res_4way = render_4way_sheet(
            mannequin_id=mannequin,
            equipped_slots=equipped,
            action_id=args.action,
            theme_id=theme,
            num_frames=args.frames,
            use_ik=args.use_ik
        )
        sheet_w = res_4way["width"]
        sheet_h = res_4way["height"]
        pixeldsl.write_png(out_name, sheet_w, sheet_h, res_4way["sheet_buffer"])
        print(f"    Saved 4-Way Spritesheet: {out_name} ({sheet_w}x{sheet_h}) [Down, Left, Right, Up]")

        if args.normal:
            norm_name = out_name.rsplit(".", 1)[0] + "_normal.png"
            pixeldsl.write_png(norm_name, sheet_w, sheet_h, res_4way["normal_buffer"])
            print(f"    Saved 4-Way Normal Map:   {norm_name}")

        if args.export_godot:
            tres_name = out_name.rsplit(".", 1)[0] + ".tres"
            tres_content = generate_godot4_tres(out_name, mannequin, args.action, res_4way["frame_width"], res_4way["frame_height"], res_4way["frames_count"], is_4way=True)
            with open(tres_name, "w", encoding="utf-8") as f:
                f.write(tres_content)
            print(f"    Saved Godot 4 Resource:  {tres_name}")

        if args.export_unity:
            unity_name = out_name.rsplit(".", 1)[0] + "_atlas.json"
            unity_data = generate_unity_json(out_name, mannequin, args.action, res_4way["frame_width"], res_4way["frame_height"], res_4way["frames_count"], is_4way=True)
            with open(unity_name, "w", encoding="utf-8") as f:
                json.dump(unity_data, f, indent=2)
            print(f"    Saved Unity SpriteAtlas: {unity_name}")
        return

    # Single-direction build
    spec = assemble_spec(
        mannequin_id=mannequin,
        equipped_slots=equipped,
        action_id=args.action,
        theme_id=theme,
        num_frames=args.frames,
        direction=direction,
        use_ik=args.use_ik
    )

    if args.spec:
        print(json.dumps(spec, indent=2))
        return

    if pixeldsl is None:
        print("[!] pixeldsl compiler not found in PYTHONPATH. Outputting JSON spec only.")
        print(json.dumps(spec, indent=2))
        return

    out_name = args.out or f"paperdoll_{mannequin}_{args.action}_{direction}.png"
    os.makedirs(os.path.dirname(out_name) if os.path.dirname(out_name) else ".", exist_ok=True)

    print(f"\n[+] Assembling Paper Doll: {mannequin} ({args.action} - {direction.upper()}) with theme '{theme}' [IK={args.use_ik}]...")
    num_frames = len(spec.get("frames", []))
    print(f"    Active Bones: {len(spec['rig']['bones'])} | Frames: {num_frames} | Dimensions: {spec['width']}x{spec['height']}")

    render_dir = "right" if direction == "left" else direction
    res_f1 = pixeldsl.render_rig(spec, 1)
    f1_buf = res_f1["buffer"]
    if direction == "left":
        f1_buf = flip_buffer_h(res_f1["width"], res_f1["height"], f1_buf, is_normal=False)

    pixeldsl.write_png(out_name, res_f1["width"], res_f1["height"], f1_buf)
    print(f"    Saved Native 1:1 Sprite: {out_name}")

    if args.normal:
        norm_name = out_name.rsplit(".", 1)[0] + "_normal.png"
        norm_buf = res_f1.get("normal_buffer") or res_f1.get("normalBuffer")
        if norm_buf:
            if direction == "left":
                norm_buf = flip_buffer_h(res_f1["width"], res_f1["height"], norm_buf, is_normal=True)
            pixeldsl.write_png(norm_name, res_f1["width"], res_f1["height"], norm_buf)
            print(f"    Saved 3D Normal Map:     {norm_name}")

    if args.sheet or num_frames > 1:
        sheet_name = out_name.rsplit(".", 1)[0] + "_sheet.png"
        sheet_w = res_f1["width"] * num_frames
        sheet_h = res_f1["height"]
        sheet_buf = bytearray(sheet_w * sheet_h * 4)

        for fi in range(1, num_frames + 1):
            rf = pixeldsl.render_rig(spec, fi)
            f_buf = rf["buffer"]
            fw = rf["width"]
            fh = rf["height"]
            if direction == "left":
                f_buf = flip_buffer_h(fw, fh, f_buf, is_normal=False)
            for y in range(fh):
                for x in range(fw):
                    src_idx = (y * fw + x) * 4
                    dst_x = (fi - 1) * fw + x
                    dst_idx = (y * sheet_w + dst_x) * 4
                    sheet_buf[dst_idx:dst_idx + 4] = f_buf[src_idx:src_idx + 4]

        pixeldsl.write_png(sheet_name, sheet_w, sheet_h, sheet_buf)
        print(f"    Saved Sprite Sheet:      {sheet_name} ({sheet_w}x{sheet_h})")

        if args.export_godot:
            tres_name = out_name.rsplit(".", 1)[0] + ".tres"
            tres_content = generate_godot4_tres(sheet_name, mannequin, args.action, res_f1["width"], res_f1["height"], num_frames, is_4way=False)
            with open(tres_name, "w", encoding="utf-8") as f:
                f.write(tres_content)
            print(f"    Saved Godot 4 Resource:  {tres_name}")

        if args.export_unity:
            unity_name = out_name.rsplit(".", 1)[0] + "_atlas.json"
            unity_data = generate_unity_json(sheet_name, mannequin, args.action, res_f1["width"], res_f1["height"], num_frames, is_4way=False)
            with open(unity_name, "w", encoding="utf-8") as f:
                json.dump(unity_data, f, indent=2)
            print(f"    Saved Unity SpriteAtlas: {unity_name}")

    try:
        ansi_str = pixeldsl.render_ansi_preview(res_f1["width"], res_f1["height"], f1_buf)
        sys.stdout.buffer.write((ansi_str + "\n").encode("utf-8", errors="replace"))
        sys.stdout.buffer.flush()
    except Exception:
        pass


if __name__ == "__main__":
    main()
