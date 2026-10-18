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
    "obsidian": {
        "id": "obsidian",
        "name": "Volcanic Obsidian & Flame",
        "gear_base": "#18181b",
        "gear_hi": "#3f3f46",
        "gear_shadow": "#09090b",
        "gear_dark": "#000000",
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
            {"id": "eq_sw_blade", "parent": "arm_near_lower", "offset": [0, 0], "length": 17.0, "angle": -85, "r1": 2.0, "r2": 0.6, "z": 3.1, "fill": "gear_hi"},
            {"id": "eq_sw_fuller", "parent": "arm_near_lower", "offset": [0.2, 0], "length": 12.0, "angle": -85, "r1": 0.8, "r2": 0.4, "z": 3.15, "fill": "trim_hi"},
            {"id": "eq_sw_guard", "parent": "arm_near_lower", "offset": [0, 0], "length": 6.0, "angle": 5, "r1": 1.5, "r2": 1.5, "z": 3.12, "fill": "trim"},
            {"id": "eq_sw_pommel", "parent": "arm_near_lower", "offset": [0, 0], "length": 3.0, "angle": 95, "r1": 1.2, "r2": 1.6, "z": 3.1, "fill": "gear_dark"}
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
            {"id": "eq_shd_body", "parent": "arm_far_upper", "offset": [0.5, 2.0], "length": 11.0, "angle": 85, "r1": 5.0, "r2": 3.0, "z": 0.08, "fill": "gear_base"},
            {"id": "eq_shd_boss", "parent": "arm_far_upper", "offset": [0.8, 5.0], "length": 0, "shape": "head_oval", "r1": 2.6, "r2": 2.6, "z": 0.09, "fill": "trim"},
            {"id": "eq_shd_cross", "parent": "arm_far_upper", "offset": [0.8, 5.0], "length": 7.0, "angle": 85, "r1": 1.2, "r2": 1.0, "z": 0.095, "fill": "trim_hi"}
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

    # Back / Cape
    "red_cape": {
        "id": "red_cape", "slot": "back", "name": "Flowing Crimson Knight Cape",
        "bones": [
            {"id": "eq_cape_root", "parent": "chest", "offset": [-1.5, 0], "length": 6.0, "angle": 145, "r1": 3.5, "r2": 4.8, "z": -0.4, "fill": "gear_shadow"},
            {"id": "eq_cape_mid", "parent": "eq_cape_root", "offset": [0, 0], "length": 9.0, "angle": -10, "r1": 4.8, "r2": 6.2, "z": -0.42, "fill": "gear_base"},
            {"id": "eq_cape_tail", "parent": "eq_cape_mid", "offset": [0, 0], "length": 7.0, "angle": 15, "r1": 6.2, "r2": 7.5, "z": -0.44, "fill": "gear_dark"}
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
# 6. ACTIONS & FORWARD KINEMATICS
# ==============================================================================
def compute_pose(action_id, frame_index, total_frames):
    t = frame_index / float(total_frames)
    phase = t * 2.0 * math.pi

    if action_id == "walk":
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
def assemble_spec(mannequin_id="humanoid", equipped_slots=None, action_id="walk", theme_id="steel", num_frames=None):
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
        "trim_hi": theme_def["trim_hi"]
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
        for eq_bone in item_def["bones"]:
            b_copy = json.loads(json.dumps(eq_bone))
            if b_copy.get("parent") and b_copy["parent"] not in base_ids and not any(cb["id"] == b_copy["parent"] for cb in composite_bones):
                b_copy["parent"] = "chest"
            composite_bones.append(b_copy)

    default_frames = {"walk": 8, "attack": 6, "idle": 6, "hurt": 4, "run": 6}.get(action_id, 8)
    frames_count = num_frames if (num_frames and num_frames > 0) else default_frames

    frames_list = []
    for fi in range(frames_count):
        pose = compute_pose(action_id, fi, frames_count)
        frames_list.append({"pose": pose})

    return {
        "type": "rig",
        "name": f"paperdoll_{mannequin_id}_{action_id}",
        "label": f"Paper Doll: {man_def['name']} ({action_id})",
        "width": width,
        "height": height,
        "palette": palette,
        "rig": {
            "outline": "o",
            "outlineWidth": 1,
            "crease": True,
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


# ==============================================================================
# 8. MAIN CLI DISPATCH
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
    parser.add_argument("--frames", type=int, help="Override animation frame count")
    parser.add_argument("-o", "--out", type=str, help="Output PNG path (defaults to game_ready/<name>.png)")
    parser.add_argument("--normal", action="store_true", help="Also generate 3D normal map PNG")
    parser.add_argument("--sheet", action="store_true", help="Also generate horizontal sprite sheet PNG")
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

    # Build spec
    spec = assemble_spec(
        mannequin_id=mannequin,
        equipped_slots=equipped,
        action_id=args.action,
        theme_id=theme,
        num_frames=args.frames
    )

    if args.spec:
        print(json.dumps(spec, indent=2))
        return

    # If pixeldsl module is available, render!
    if pixeldsl is None:
        print("[!] pixeldsl compiler not found in PYTHONPATH. Outputting JSON spec only.")
        print(json.dumps(spec, indent=2))
        return

    out_name = args.out or f"paperdoll_{mannequin}_{args.action}.png"
    os.makedirs(os.path.dirname(out_name) if os.path.dirname(out_name) else ".", exist_ok=True)

    print(f"\n[+] Assembling Paper Doll: {mannequin} ({args.action}) with theme '{theme}'...")
    num_frames = len(spec.get("frames", []))
    print(f"    Active Bones: {len(spec['rig']['bones'])} | Frames: {num_frames} | Dimensions: {spec['width']}x{spec['height']}")

    # Render frame 1 (or loop for all frames)
    res_f1 = pixeldsl.render_rig(spec, 1)

    pixeldsl.write_png(out_name, res_f1["width"], res_f1["height"], res_f1["buffer"])
    print(f"    Saved Native 1:1 Sprite: {out_name}")

    if args.normal:
        norm_name = out_name.rsplit(".", 1)[0] + "_normal.png"
        norm_buf = res_f1.get("normal_buffer") or res_f1.get("normalBuffer")
        if norm_buf:
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
            for y in range(fh):
                for x in range(fw):
                    src_idx = (y * fw + x) * 4
                    dst_x = (fi - 1) * fw + x
                    dst_idx = (y * sheet_w + dst_x) * 4
                    sheet_buf[dst_idx:dst_idx+4] = f_buf[src_idx:src_idx+4]

        pixeldsl.write_png(sheet_name, sheet_w, sheet_h, sheet_buf)
        print(f"    Saved Sprite Sheet:      {sheet_name} ({sheet_w}x{sheet_h})")

    try:
        ansi_str = pixeldsl.render_ansi_preview(res_f1["width"], res_f1["height"], res_f1["buffer"])
        sys.stdout.buffer.write((ansi_str + "\n").encode("utf-8", errors="replace"))
        sys.stdout.buffer.flush()
    except Exception:
        pass


if __name__ == "__main__":
    main()
