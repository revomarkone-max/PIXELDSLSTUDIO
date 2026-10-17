// PixelDSL Engine v3.0:
// 1. 2.5D SDF & CSG Algebra (Quilez Primitives: gradient-normalized ellipse, uneven_capsule, vesica,
//    moon, bezier_sdf, star, ngon, capsule, rect, polygon; universal 2D rotation; CSG Booleans;
//    polarRepeat; domainWarp; 2.5D z-tiers & 1px Internal Anatomical Creases; Normal Map generation)
// 2. Felzenszwalb & Huttenlocher O(W*H) 2D Euclidean Distance Transform (EDT) + Discrete Pixel-Art
//    Morphology (1px cardinal spur/pimple pruning, pinhole filling, L-corner cleanup, RotSprite EPX 2x)
// 3. Perceptual Björn Ottosson Oklab / Oklch Color Engine + Procedural Surface Micro-Shaders
//    (worley, voronoi, turing, bayer4x4, blue_noise) + 5-Tone SDF Auto-Registration for lossless Bake-to-Grid
// 4. Kinematic Bone Hierarchy (parent / pivot), Analytical 2-Bone IK Solver, and Procedural Motion
//    Generators (idle_breathe, walk_cycle, swim_cycle, jump_arc, wave)
// 5. 100% LLM-Free Parametric Archetype Generator (generateArchetype), Evolutionary Genome Mutator
//    (mutateSpec), and MarkovJunior-style Cellular Rewrite Rules ("rules")

const BUILTIN_PALETTES = {
  pico8: {
    ".": "transparent",
    "O": "#000000", "D": "#1d2b53", "P": "#7e2553", "G": "#008751",
    "B": "#ab5236", "g": "#5f574f", "s": "#c2c3c7", "w": "#fff1e8",
    "r": "#ff004d", "o": "#ffa300", "y": "#ffec27", "l": "#00e436",
    "b": "#29adff", "i": "#83769c", "p": "#ff77a8", "f": "#ffccaa"
  },
  gameboy: {
    ".": "transparent",
    "O": "#0f380f",
    "D": "#306230",
    "s": "#8bac0f",
    "w": "#9bbc0f"
  },
  endesga32: {
    ".": "transparent",
    "O": "#181425", "r": "#e43b44", "o": "#feae34", "y": "#fee761",
    "g": "#63c74d", "G": "#3e8948", "D": "#265c42", "t": "#193c3e",
    "b": "#0099db", "c": "#2ce8f5", "w": "#ffffff", "s": "#c0cbdc",
    "m": "#8b9bb4", "d": "#5a6988", "n": "#3a4466", "p": "#b55088"
  }
};

const BAYER_2X2 = [
  [-0.06,  0.02],
  [ 0.06, -0.02]
];

const BAYER_4X4 = [
  [ 0.0 / 16.0,  8.0 / 16.0,  2.0 / 16.0, 10.0 / 16.0],
  [12.0 / 16.0,  4.0 / 16.0, 14.0 / 16.0,  6.0 / 16.0],
  [ 3.0 / 16.0, 11.0 / 16.0,  1.0 / 16.0,  9.0 / 16.0],
  [15.0 / 16.0,  7.0 / 16.0, 13.0 / 16.0,  5.0 / 16.0]
];

const SDF_SHAPE_OPS = [
  "ellipse", "rect", "polygon", "capsule", "uneven_capsule",
  "vesica", "moon", "bezier_sdf", "star", "ngon"
];

const ARCHETYPE_LIST = [
  "sword", "axe", "shield", "potion", "gem", "slime",
  "beetle", "turtle", "bunny", "crystal_monolith", "spaceship", "autotile_blob47"
];

class SeededRNG {
  constructor(seed = 42) {
    this.state = (Number(seed) >>> 0) || 0x6D2B79F5;
  }

  nextFloat() {
    this.state = (this.state + 0x6D2B79F5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1) >>> 0;
    t = (t ^ (t + Math.imul(t ^ (t >>> 7), t | 61))) >>> 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296.0;
  }

  range(low, high) {
    return low + (high - low) * this.nextFloat();
  }

  randint(low, high) {
    return Math.floor(this.range(low, high + 0.999999));
  }

  choice(seq) {
    if (!seq || !seq.length) return null;
    return seq[Math.floor(this.nextFloat() * seq.length) % seq.length];
  }
}

class PixelDSLRenderer {
  static get ARCHETYPE_LIST() {
    return ARCHETYPE_LIST;
  }

  static clampSize(val, fallback = 32) {
    const n = parseInt(val, 10);
    if (isNaN(n)) return fallback;
    return Math.max(8, Math.min(128, n));
  }

  static hash2d(ix, iy, seed = 0) {
    let h = (Math.imul(ix | 0, 374761393) + Math.imul(iy | 0, 668265263) + Math.imul(seed | 0, 1442695041)) >>> 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296.0;
  }

  static valueNoise2d(x, y, seed = 0) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const ux = fx * fx * (3.0 - 2.0 * fx);
    const uy = fy * fy * (3.0 - 2.0 * fy);
    const n00 = this.hash2d(ix, iy, seed);
    const n10 = this.hash2d(ix + 1, iy, seed);
    const n01 = this.hash2d(ix, iy + 1, seed);
    const n11 = this.hash2d(ix + 1, iy + 1, seed);
    const nx0 = n00 + (n10 - n00) * ux;
    const nx1 = n01 + (n11 - n01) * ux;
    return nx0 + (nx1 - nx0) * uy;
  }

  static parseColor(colorStr) {
    if (!colorStr || typeof colorStr !== "string") return [0, 0, 0, 0];
    const s = colorStr.trim().toLowerCase();
    if (s === "transparent" || s === "none" || s === "") return [0, 0, 0, 0];

    if (s.startsWith("#")) {
      const hex = s.slice(1);
      if (hex.length === 3) {
        return [
          parseInt(hex[0] + hex[0], 16),
          parseInt(hex[1] + hex[1], 16),
          parseInt(hex[2] + hex[2], 16),
          255
        ];
      }
      if (hex.length === 4) {
        return [
          parseInt(hex[0] + hex[0], 16),
          parseInt(hex[1] + hex[1], 16),
          parseInt(hex[2] + hex[2], 16),
          parseInt(hex[3] + hex[3], 16)
        ];
      }
      if (hex.length === 6) {
        return [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16),
          255
        ];
      }
      if (hex.length === 8) {
        return [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16),
          parseInt(hex.slice(6, 8), 16)
        ];
      }
    }
    return [0, 0, 0, 255];
  }

  static rgbaToHex(r, g, b, a = 255) {
    const toH = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
    if (a <= 0) return "transparent";
    if (a < 255) return `#${toH(r)}${toH(g)}${toH(b)}${toH(a)}`;
    return `#${toH(r)}${toH(g)}${toH(b)}`;
  }

  // ==========================================================================
  // Pillar 3: Perceptual Oklab / Oklch Color Engine & Surface Micro-Shaders
  // ==========================================================================

  static srgbToLinear(c) {
    const v = Math.max(0.0, Math.min(1.0, c / 255.0));
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }

  static linearToSrgb(v) {
    const clamped = Math.max(0.0, Math.min(1.0, v));
    const c = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1.0 / 2.4) - 0.055;
    return Math.max(0, Math.min(255, Math.round(c * 255.0)));
  }

  static rgbToOklab(r, g, b) {
    const lr = this.srgbToLinear(r);
    const lg = this.srgbToLinear(g);
    const lb = this.srgbToLinear(b);
    const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
    const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
    const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
    const l_ = l > 0 ? Math.cbrt(l) : 0.0;
    const m_ = m > 0 ? Math.cbrt(m) : 0.0;
    const s_ = s > 0 ? Math.cbrt(s) : 0.0;
    return [
      0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
      1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
      0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
    ];
  }

  static oklabToRgb(L, a, bVal) {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * bVal;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * bVal;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * bVal;
    const l = Math.pow(Math.max(0.0, l_), 3);
    const m = Math.pow(Math.max(0.0, m_), 3);
    const s = Math.pow(Math.max(0.0, s_), 3);
    const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
    return [this.linearToSrgb(lr), this.linearToSrgb(lg), this.linearToSrgb(lb)];
  }

  static rgbToOklch(r, g, b) {
    const [L, a, bVal] = this.rgbToOklab(r, g, b);
    const C = Math.sqrt(a * a + bVal * bVal);
    const h = ((Math.atan2(bVal, a) * 180.0) / Math.PI + 360.0) % 360.0;
    return [L, C, h];
  }

  static oklchToRgb(L, C, hDeg) {
    const rad = (hDeg * Math.PI) / 180.0;
    return this.oklabToRgb(L, C * Math.cos(rad), C * Math.sin(rad));
  }

  static shiftHueToward(hDeg, targetDeg, amount) {
    const diff = (((targetDeg - hDeg + 180.0) % 360.0) + 360.0) % 360.0 - 180.0;
    return (hDeg + diff * amount + 360.0) % 360.0;
  }

  static generateColorRamp(baseHex) {
    const [r, g, b, a] = this.parseColor(baseHex);
    const [L, C, h] = this.rgbToOklch(r, g, b);
    const isNeutral = C < 0.025;

    const lLight = Math.min(0.97, L + (1.0 - L) * 0.42 + 0.06);
    const cLight = !isNeutral ? C * 0.85 : Math.min(0.015, C + 0.005);
    const hLight = this.shiftHueToward(h, 90.0, !isNeutral ? 0.18 : 0.0);
    const [lr, lg, lb] = this.oklchToRgb(lLight, cLight, hLight);

    const shadowTarget = (h > 315.0 || h < 25.0) ? 335.0 : 275.0;
    const lDark = Math.max(0.14, L * 0.74 - 0.04);
    const cDark = !isNeutral ? Math.min(0.28, C * 1.08 + 0.012) : Math.min(0.022, C + 0.012);
    const hDark = this.shiftHueToward(h, shadowTarget, 0.22);
    const [dr, dg, db] = this.oklchToRgb(lDark, cDark, hDark);

    const lOut = Math.max(0.16, Math.min(0.26, L * 0.34));
    const cOut = !isNeutral ? Math.min(0.14, C * 0.75 + 0.02) : 0.025;
    const hOut = this.shiftHueToward(h, shadowTarget, 0.35);
    const [or_, og, ob] = this.oklchToRgb(lOut, cOut, hOut);

    return {
      base: baseHex,
      light: this.rgbaToHex(lr, lg, lb, a),
      dark: this.rgbaToHex(dr, dg, db, a),
      outline: this.rgbaToHex(or_, og, ob, 255)
    };
  }

  static deriveSdfShadingTones(baseRGBA) {
    const [r, g, b, a] = baseRGBA;
    const [L, C, h] = this.rgbToOklch(r, g, b);
    const isNeutral = C < 0.025;
    const shadowTarget = (h > 315.0 || h < 25.0) ? 335.0 : 275.0;

    const dsRgb = this.oklchToRgb(
      Math.max(0.12, L * 0.68 - 0.05),
      !isNeutral ? Math.min(0.28, C * 1.10 + 0.015) : Math.min(0.025, C + 0.014),
      this.shiftHueToward(h, shadowTarget, 0.25)
    );
    const shRgb = this.oklchToRgb(
      Math.max(0.18, L * 0.84 - 0.02),
      !isNeutral ? Math.min(0.28, C * 1.04 + 0.008) : Math.min(0.018, C + 0.008),
      this.shiftHueToward(h, shadowTarget, 0.14)
    );
    const hiRgb = this.oklchToRgb(
      Math.min(0.96, L + (1.0 - L) * 0.36 + 0.04),
      !isNeutral ? C * 0.88 : C,
      this.shiftHueToward(h, 90.0, !isNeutral ? 0.16 : 0.0)
    );
    const spRgb = this.oklchToRgb(
      Math.min(0.99, L + (1.0 - L) * 0.68 + 0.07),
      !isNeutral ? C * 0.55 : C * 0.5,
      this.shiftHueToward(h, 92.0, !isNeutral ? 0.25 : 0.0)
    );

    return {
      deepShadow: [dsRgb[0], dsRgb[1], dsRgb[2], a],
      shadow: [shRgb[0], shRgb[1], shRgb[2], a],
      base: [r, g, b, a],
      highlight: [hiRgb[0], hiRgb[1], hiRgb[2], a],
      specular: [spRgb[0], spRgb[1], spRgb[2], a]
    };
  }

  static resolveFullPalette(spec) {
    let merged = { ".": "transparent" };
    if (spec.palettePreset && BUILTIN_PALETTES[spec.palettePreset]) {
      merged = Object.assign(merged, BUILTIN_PALETTES[spec.palettePreset]);
    }
    if (spec.palette && typeof spec.palette === "object") {
      merged = Object.assign(merged, spec.palette);
    }
    if (spec.ramps && typeof spec.ramps === "object") {
      for (const [key, cfg] of Object.entries(spec.ramps)) {
        if (typeof cfg === "string") {
          const ramp = this.generateColorRamp(cfg);
          merged[key] = ramp.base;
          merged[key.toUpperCase() !== key ? key.toUpperCase() : `${key}_dark`] = ramp.dark;
          merged[`${key}_light`] = ramp.light;
          if (!merged["O"]) merged["O"] = ramp.outline;
        } else if (cfg && typeof cfg === "object" && cfg.base) {
          const ramp = this.generateColorRamp(cfg.base);
          merged[key] = ramp.base;
          const explicitPal = (spec && spec.palette && typeof spec.palette === "object") ? spec.palette : {};
          if (cfg.light && !explicitPal[cfg.light]) merged[cfg.light] = ramp.light;
          if (cfg.dark && !explicitPal[cfg.dark]) merged[cfg.dark] = ramp.dark;
          if (cfg.outline && !explicitPal[cfg.outline]) merged[cfg.outline] = ramp.outline;
        }
      }
    }
    return merged;
  }

  static expandRLE(rowStr) {
    return String(rowStr || "").replace(/(\d+)(.)/g, (_, count, ch) => ch.repeat(Math.min(256, parseInt(count, 10))));
  }

  static normalizeGrid(grid, width, height, useRLE = false, symmetry = "none") {
    const warnings = [];
    const normalized = [];
    const rows = Array.isArray(grid) ? grid : [];

    for (let y = 0; y < height; y++) {
      let raw = y < rows.length ? String(rows[y] || "") : "";
      if (useRLE) raw = this.expandRLE(raw);
      if (symmetry === "horizontal" && raw.length === Math.floor(width / 2) && raw.length > 0) {
        const reversed = raw.split("").reverse().join("");
        raw = raw + reversed;
      }
      if (y < rows.length && raw.length !== width) {
        warnings.push(`Row ${y + 1}: length ${raw.length} != ${width}`);
      }
      if (raw.length < width) raw = raw.padEnd(width, ".");
      else if (raw.length > width) raw = raw.slice(0, width);
      normalized.push(raw);
    }

    if (rows.length > 0 && rows.length !== height) {
      warnings.push(`Grid rows: ${rows.length} != ${height}`);
    }

    return { normalized, warnings };
  }

  static worley2d(x, y, scale = 5.0, seed = 0) {
    const sx = x / Math.max(1.0, Number(scale));
    const sy = y / Math.max(1.0, Number(scale));
    const ix = Math.floor(sx);
    const iy = Math.floor(sy);
    let f1 = 1e9;
    let f2 = 1e9;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const cx = ix + dx;
        const cy = iy + dy;
        const px = cx + 0.15 + 0.70 * this.hash2d(cx, cy, seed + 17);
        const py = cy + 0.15 + 0.70 * this.hash2d(cx, cy, seed + 53);
        const d2 = (sx - px) * (sx - px) + (sy - py) * (sy - py);
        if (d2 < f1) {
          f2 = f1;
          f1 = d2;
        } else if (d2 < f2) {
          f2 = d2;
        }
      }
    }
    return [Math.sqrt(f1), Math.sqrt(f2)];
  }

  static turingPattern(x, y, scale = 1.0, seed = 0) {
    const s = Math.max(0.5, Number(scale));
    const u = this.valueNoise2d(x / (1.8 * s), y / (1.8 * s), seed + 101);
    const v = this.valueNoise2d(x / (3.8 * s), y / (3.8 * s), seed + 307);
    const detail = this.valueNoise2d(x / (1.1 * s), y / (1.1 * s), seed + 509);
    return (u - v) + 0.18 * (detail - 0.5);
  }

  static checkDither(pattern, x, y, nx = 0.0, ny = 0.0, scale = 5.0, seed = 0) {
    if (!pattern || pattern === "none") return false;
    const p = String(pattern).toLowerCase();

    if (p === "checker") return (x + y) % 2 === 1;
    if (p === "sparse") return (x % 2 === 0) && (y % 2 === 0);
    if (p === "grid") return (x % 3 === 0) || (y % 3 === 0);
    if (p === "scales") {
      const row = Math.floor(y / 3);
      const offset = (row % 2) * 2;
      const lx = (x + offset) % 4;
      const ly = y % 3;
      return (ly === 2 && (lx === 1 || lx === 2)) || (ly === 1 && lx === 0);
    }
    if (p === "bayer4x4") {
      return BAYER_4X4[y & 3][x & 3] > 0.5;
    }
    if (p === "blue_noise") {
      const ign = (52.9829189 * ((0.06711056 * x + 0.00583715 * y) % 1.0)) % 1.0;
      return ign > 0.55;
    }
    if (p === "worley") {
      const [f1, f2] = this.worley2d(x + nx * 2.2, y + ny * 2.2, scale, seed);
      return (f2 - f1) < 0.22;
    }
    if (p === "voronoi") {
      const [f1] = this.worley2d(x + nx * 2.0, y + ny * 2.0, scale, seed);
      return f1 < 0.36;
    }
    if (p === "turing") {
      return this.turingPattern(x + nx * 1.5, y + ny * 1.5, scale / 4.0, seed) > 0.045;
    }
    return false;
  }

  // ==========================================================================
  // Pillar 2: Felzenszwalb & Huttenlocher O(W*H) 2D EDT + Discrete Morphology
  // ==========================================================================

  static edt1d(f, n) {
    const d = new Float32Array(n);
    const v = new Int32Array(n);
    const z = new Float32Array(n + 1);
    let k = 0;
    v[0] = 0;
    z[0] = -1e20;
    z[1] = 1e20;

    for (let q = 1; q < n; q++) {
      const fq = f[q] + q * q;
      let s = ((fq - (f[v[k]] + v[k] * v[k])) / (2.0 * (q - v[k])));
      while (s <= z[k]) {
        k--;
        s = ((fq - (f[v[k]] + v[k] * v[k])) / (2.0 * (q - v[k])));
      }
      k++;
      v[k] = q;
      z[k] = s;
      z[k + 1] = 1e20;
    }

    k = 0;
    for (let q = 0; q < n; q++) {
      while (z[k + 1] < q) k++;
      const dx = q - v[k];
      d[q] = dx * dx + f[v[k]];
    }
    return d;
  }

  static edt2dSq(boolGrid, width, height) {
    const inf = 1e12;
    const f2d = new Float32Array(width * height);
    for (let i = 0; i < width * height; i++) {
      f2d[i] = boolGrid[i] ? 0.0 : inf;
    }
    const colIn = new Float32Array(height);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) colIn[y] = f2d[y * width + x];
      const colOut = this.edt1d(colIn, height);
      for (let y = 0; y < height; y++) f2d[y * width + x] = colOut[y];
    }
    const rowIn = new Float32Array(width);
    for (let y = 0; y < height; y++) {
      const rowStart = y * width;
      for (let x = 0; x < width; x++) rowIn[x] = f2d[rowStart + x];
      const rowOut = this.edt1d(rowIn, width);
      for (let x = 0; x < width; x++) f2d[rowStart + x] = rowOut[x];
    }
    return f2d;
  }

  static computeEdtSdf(mask, width, height) {
    const insideFeatures = new Uint8Array(width * height);
    const outsideFeatures = new Uint8Array(width * height);
    for (let i = 0; i < width * height; i++) {
      if (mask[i]) outsideFeatures[i] = 1;
      else insideFeatures[i] = 1;
    }
    const distToOutsideSq = this.edt2dSq(insideFeatures, width, height);
    const distToInsideSq = this.edt2dSq(outsideFeatures, width, height);
    const sdf = new Float32Array(width * height);
    for (let i = 0; i < width * height; i++) {
      if (mask[i]) {
        sdf[i] = -(Math.sqrt(distToOutsideSq[i]) - 0.5);
      } else {
        sdf[i] = Math.sqrt(distToInsideSq[i]) - 0.5;
      }
    }
    return sdf;
  }

  static cleanSdfMask(mask, sdfField, width, height, pruneSpurs = true) {
    if (!pruneSpurs) return new Uint8Array(mask);
    const filled = new Uint8Array(mask);
    let activeTotal = 0;
    for (let i = 0; i < filled.length; i++) if (filled[i]) activeTotal++;
    if (activeTotal <= 4) return filled;

    // Pass 1: Fill isolated 1px interior pinholes
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (!filled[idx]) {
          const n4 =
            filled[idx - 1] +
            filled[idx + 1] +
            filled[idx - width] +
            filled[idx + width];
          if (n4 === 4) filled[idx] = 1;
        }
      }
    }

    // Pass 2: Prune shallow 1px cardinal pimples/spurs and grazing tangent slivers on curved SDF boundaries
    const cleaned = new Uint8Array(filled);
    if (sdfField) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          if (!filled[idx]) continue;
          const depth = -sdfField[idx];
          if (depth > 0.65) continue;
          const hasL = (x > 0 && filled[idx - 1]) ? 1 : 0;
          const hasR = (x < width - 1 && filled[idx + 1]) ? 1 : 0;
          const hasU = (y > 0 && filled[idx - width]) ? 1 : 0;
          const hasD = (y < height - 1 && filled[idx + width]) ? 1 : 0;
          const ortho = hasL + hasR + hasU + hasD;
          if (ortho <= 1) {
            cleaned[idx] = 0;
          } else if (activeTotal >= 12 && ortho === 2 && (hasL !== hasR) && (hasU !== hasD) && depth < 0.04) {
            cleaned[idx] = 0;
          }
        }
      }
    }
    return cleaned;
  }

  static rotateStampEpx(gridRows, angleDeg) {
    const h = gridRows.length;
    if (h === 0) return [];
    const w = Math.max(...gridRows.map((r) => String(r || "").length));
    if (w === 0) return [];

    const padGrid = gridRows.map((r) => String(r || "").padEnd(w, "."));
    const getP = (x, y) => {
      if (x < 0 || x >= w || y < 0 || y >= h) return ".";
      return padGrid[y][x];
    };

    const w2 = w * 2;
    const h2 = h * 2;
    const epx = Array.from({ length: h2 }, () => new Array(w2).fill("."));
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const p = getP(x, y);
        const a = getP(x, y - 1);
        const b = getP(x + 1, y);
        const c = getP(x - 1, y);
        const d = getP(x, y + 1);
        let p1 = p, p2 = p, p3 = p, p4 = p;
        if (c === a && c !== d && a !== b) p1 = a;
        if (a === b && a !== c && b !== d) p2 = b;
        if (d === c && d !== b && c !== a) p3 = c;
        if (b === d && b !== a && d !== c) p4 = d;
        epx[y * 2][x * 2] = p1;
        epx[y * 2][x * 2 + 1] = p2;
        epx[y * 2 + 1][x * 2] = p3;
        epx[y * 2 + 1][x * 2 + 1] = p4;
      }
    }

    const rad = (angleDeg * Math.PI) / 180.0;
    const cosA = Math.cos(-rad);
    const sinA = Math.sin(-rad);
    const cx = (w - 1) * 0.5;
    const cy = (h - 1) * 0.5;
    const pad = Math.ceil(Math.hypot(w, h) * 0.5) + 1;
    const outPts = [];
    for (let dy = -pad; dy <= pad; dy++) {
      for (let dx = -pad; dx <= pad; dx++) {
        const lx = dx * cosA - dy * sinA + cx;
        const ly = dx * sinA + dy * cosA + cy;
        const sx2 = Math.round(lx * 2.0);
        const sy2 = Math.round(ly * 2.0);
        if (sx2 >= 0 && sx2 < w2 && sy2 >= 0 && sy2 < h2) {
          const ch = epx[sy2][sx2];
          if (ch !== "." && ch !== " ") {
            outPts.push([Math.round(cx + dx), Math.round(cy + dy), ch]);
          }
        }
      }
    }
    return outPts;
  }

  // ==========================================================================
  // Pillar 1: 2.5D SDF & CSG Algebra (Quilez Primitives + Domain Ops)
  // ==========================================================================

  static smin(a, b, k) {
    if (!k || k <= 0) return Math.min(a, b);
    const h = Math.max(k - Math.abs(a - b), 0.0) / k;
    return Math.min(a, b) - h * h * k * 0.25;
  }

  static csgCombine(dA, dB, opMode = "union", k = 0.0) {
    const mode = String(opMode || "union").toLowerCase();
    if (mode === "subtract") return Math.max(dA, -dB);
    if (mode === "smooth_subtract") return -this.smin(-dA, dB, k > 0 ? k : 1.5);
    if (mode === "intersect") return Math.max(dA, dB);
    if (mode === "smooth_union" || k > 0) return this.smin(dA, dB, k);
    return Math.min(dA, dB);
  }

  static sdUnevenCapsuleLocal(px, py, x1, y1, x2, y2, r1, r2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lSeg = Math.hypot(dx, dy);
    if (lSeg < 1e-5) return Math.hypot(px - x1, py - y1) - Math.max(r1, r2);
    const ux = dx / lSeg;
    const uy = dy / lSeg;
    const qx = (px - x1) * ux + (py - y1) * uy;
    const qy = Math.abs(-(px - x1) * uy + (py - y1) * ux);
    const b = (r1 - r2) / lSeg;
    if (Math.abs(b) >= 0.9999) {
      return Math.min(Math.hypot(px - x1, py - y1) - r1, Math.hypot(px - x2, py - y2) - r2);
    }
    const a = Math.sqrt(Math.max(0.0, 1.0 - b * b));
    const k = qx * a - qy * b;
    if (k < 0.0) return Math.hypot(qx, qy) - r1;
    if (k > a * lSeg) return Math.hypot(qx - lSeg, qy) - r2;
    return qx * b + qy * a - r1;
  }

  static sdVesicaLocal(lx, ly, rx, ry) {
    if (rx > ry) {
      [lx, ly] = [ly, lx];
      [rx, ry] = [ry, rx];
    }
    const a = Math.max(0.5, Number(ry));
    const b = Math.max(0.25, Math.min(Number(rx), a - 0.05));
    const r = (a * a + b * b) / (2.0 * b);
    const d = (a * a - b * b) / (2.0 * b);
    const px = Math.abs(lx);
    const py = Math.abs(ly);
    if ((py - a) * d > px * a) return Math.hypot(px, py - a);
    return Math.hypot(px + d, py) - r;
  }

  static sdMoonLocal(lx, ly, d, ra, rb) {
    const py = Math.abs(ly);
    const a = (ra * ra - rb * rb + d * d) / Math.max(1e-5, 2.0 * d);
    const b = Math.sqrt(Math.max(0.0, ra * ra - a * a));
    if (d * (lx * b - py * a) > d * d * Math.max(b - py, 0.0)) {
      return Math.hypot(lx - a, py - b);
    }
    return Math.max(Math.hypot(lx, py) - ra, -(Math.hypot(lx - d, py) - rb));
  }

  static sdStarLocal(lx, ly, r, nPts = 5, ratio = 0.45) {
    const n = Math.max(3, Math.floor(nPts));
    const m = Math.max(0.15, Math.min(1.0, Number(ratio)));
    const an = Math.PI / n;
    let ang = ((Math.atan2(lx, -ly) % (2.0 * an)) + 2.0 * an) % (2.0 * an);
    if (ang > an) ang = 2.0 * an - ang;
    const distP = Math.hypot(lx, ly);
    const px = distP * Math.cos(ang);
    const py = distP * Math.sin(ang);
    const ax = r, ay = 0.0;
    const bx = r * m * Math.cos(an), by = r * m * Math.sin(an);
    const vx = bx - ax, vy = by - ay;
    const wx = px - ax, wy = py - ay;
    const t = Math.max(0.0, Math.min(1.0, (wx * vx + wy * vy) / Math.max(1e-7, vx * vx + vy * vy)));
    const dx = wx - vx * t;
    const dy = wy - vy * t;
    const s = (vx * wy - vy * wx) > 0.0 ? -1.0 : 1.0;
    return Math.hypot(dx, dy) * s;
  }

  static sdBezierLocal(px, py, p0, p1, p2, r1, r2) {
    let minD = 1e9;
    const steps = 16;
    const x0 = Number(p0[0]), y0 = Number(p0[1]);
    const x1 = Number(p1[0]), y1 = Number(p1[1]);
    const x2 = Number(p2[0]), y2 = Number(p2[1]);
    let prevX = x0, prevY = y0, prevR = r1;
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const inv = 1.0 - t;
      const bx = inv * inv * x0 + 2.0 * inv * t * x1 + t * t * x2;
      const by = inv * inv * y0 + 2.0 * inv * t * y1 + t * t * y2;
      const curR = r1 + (r2 - r1) * t;
      const dSeg = this.sdUnevenCapsuleLocal(px, py, prevX, prevY, bx, by, prevR, curR);
      if (dSeg < minD) minD = dSeg;
      prevX = bx;
      prevY = by;
      prevR = curR;
    }
    return minD;
  }

  static computeLayerSDF(layer, width, height) {
    const op = String(layer.op || "").toLowerCase();
    const sdf = new Float64Array(width * height).fill(1e4);
    const defaultCx = (width - 1) * 0.5;
    const defaultCy = (height - 1) * 0.5;

    let pivX = defaultCx, pivY = defaultCy;
    if (op === "rect" && layer.x !== undefined) {
      const wVal = Math.max(1.0, Number(layer.w ?? 4));
      const hVal = Math.max(1.0, Number(layer.h ?? 4));
      pivX = Number(layer.x ?? 0) + (wVal - 1.0) * 0.5;
      pivY = Number(layer.y ?? 0) + (hVal - 1.0) * 0.5;
    } else if (op === "capsule" || op === "uneven_capsule") {
      if (Array.isArray(layer.points) && layer.points.length >= 2) {
        const pts = layer.points;
        pivX = pts.reduce((acc, p) => acc + Number(p[0]), 0) / pts.length;
        pivY = pts.reduce((acc, p) => acc + Number(p[1]), 0) / pts.length;
      } else {
        pivX = (Number(layer.x1 ?? defaultCx) + Number(layer.x2 ?? defaultCx)) * 0.5;
        pivY = (Number(layer.y1 ?? defaultCy - 4) + Number(layer.y2 ?? defaultCy + 4)) * 0.5;
      }
    } else if ((op === "polygon" || op === "bezier_sdf") && Array.isArray(layer.points) && layer.points.length > 0) {
      const pts = layer.points;
      pivX = pts.reduce((acc, p) => acc + Number(p[0]), 0) / pts.length;
      pivY = pts.reduce((acc, p) => acc + Number(p[1]), 0) / pts.length;
    } else {
      pivX = Number(layer.cx ?? defaultCx);
      pivY = Number(layer.cy ?? defaultCy);
    }

    const angleDeg = Number(layer.angle || 0.0);
    const rad = (angleDeg * Math.PI) / 180.0;
    const cosA = Math.cos(-rad);
    const sinA = Math.sin(-rad);

    const polarCount = parseInt(layer.polarRepeat || 0, 10);
    const polarCx = Number(layer.polarCx ?? defaultCx);
    const polarCy = Number(layer.polarCy ?? defaultCy);

    let warpAmp = 0.0, warpFreq = 0.18, warpSeed = parseInt(layer.seed || 0, 10);
    if (layer.domainWarp && typeof layer.domainWarp === "object") {
      warpAmp = Number(layer.domainWarp.amp ?? layer.domainWarp.strength ?? 1.5);
      warpFreq = Number(layer.domainWarp.freq ?? layer.domainWarp.scale ?? 0.18);
      warpSeed = parseInt(layer.domainWarp.seed ?? warpSeed, 10);
    } else if (typeof layer.domainWarp === "number") {
      warpAmp = Number(layer.domainWarp);
    }

    const onionW = Number(layer.onion || 0.0);

    const transformPt = (x, y) => {
      let px = Number(x);
      let py = Number(y);
      if (warpAmp !== 0.0) {
        const nx = this.valueNoise2d(px * warpFreq, py * warpFreq, warpSeed + 11) * 2.0 - 1.0;
        const ny = this.valueNoise2d(px * warpFreq, py * warpFreq, warpSeed + 37) * 2.0 - 1.0;
        px += nx * warpAmp;
        py += ny * warpAmp;
      }
      if (polarCount >= 2) {
        const ddx = px - polarCx;
        const ddy = py - polarCy;
        const rPol = Math.hypot(ddx, ddy);
        const sector = (2.0 * Math.PI) / polarCount;
        let ang = ((Math.atan2(ddx, -ddy) % (2.0 * Math.PI)) + 2.0 * Math.PI) % (2.0 * Math.PI);
        ang = (((ang + sector * 0.5) % sector) + sector) % sector - sector * 0.5;
        px = polarCx + rPol * Math.sin(ang);
        py = polarCy - rPol * Math.cos(ang);
      }
      const dx = px - pivX;
      const dy = py - pivY;
      const lx = dx * cosA - dy * sinA;
      const ly = dx * sinA + dy * cosA;
      return [lx, ly];
    };

    if (op === "ellipse") {
      const rx = Math.max(0.5, Number(layer.rx ?? 4.0));
      const ry = Math.max(0.5, Number(layer.ry ?? 4.0));
      const rx2 = rx * rx, ry2 = ry * ry;
      const rx4 = rx2 * rx2, ry4 = ry2 * ry2;
      const minR = Math.min(rx, ry);
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const [lx, ly] = transformPt(x, y);
          const q = Math.sqrt((lx * lx) / rx2 + (ly * ly) / ry2);
          let d;
          if (q < 1e-6) {
            d = -minR;
          } else {
            const grad = Math.sqrt((lx * lx) / rx4 + (ly * ly) / ry4);
            d = (q * (q - 1.0)) / Math.max(1e-6, grad);
          }
          sdf[y * width + x] = onionW > 0 ? Math.abs(d) - onionW : d;
        }
      }
    } else if (op === "rect") {
      const w = Math.max(1.0, Number(layer.w ?? 4));
      const h = Math.max(1.0, Number(layer.h ?? 4));
      const r = Math.max(0.0, Number(layer.rx ?? 0));
      const bx = Math.max(0.1, w * 0.5 - r);
      const by = Math.max(0.1, h * 0.5 - r);
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const [lx, ly] = transformPt(x, y);
          const qx = Math.abs(lx) - bx;
          const qy = Math.abs(ly) - by;
          const outDist = Math.hypot(Math.max(qx, 0.0), Math.max(qy, 0.0));
          const inDist = Math.min(Math.max(qx, qy), 0.0);
          const d = outDist + inDist - r;
          sdf[y * width + x] = onionW > 0 ? Math.abs(d) - onionW : d;
        }
      }
    } else if (op === "polygon" && Array.isArray(layer.points) && layer.points.length >= 3) {
      const pts = layer.points.map((p) => [Number(p[0]) - pivX, Number(p[1]) - pivY]);
      const n = pts.length;
      const rRound = Math.max(0.0, Number(layer.rx || 0.0));
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const [lx, ly] = transformPt(x, y);
          let inside = false;
          let minDistSq = 1e9;
          let j = n - 1;
          for (let i = 0; i < n; i++) {
            const [xi, yi] = pts[i];
            const [xj, yj] = pts[j];
            const vx = xj - xi, vy = yj - yi;
            const wx = lx - xi, wy = ly - yi;
            const lenSq = vx * vx + vy * vy || 1e-7;
            const t = Math.max(0.0, Math.min(1.0, (wx * vx + wy * vy) / lenSq));
            const dx = wx - vx * t;
            const dy = wy - vy * t;
            minDistSq = Math.min(minDistSq, dx * dx + dy * dy);
            const denom = (yj - yi) !== 0 ? (yj - yi) : 1e-7;
            if (((yi > ly) !== (yj > ly)) && (lx < ((xj - xi) * (ly - yi)) / denom + xi)) {
              inside = !inside;
            }
            j = i;
          }
          const dist = Math.sqrt(minDistSq);
          const d = (inside ? -dist : dist) - rRound;
          sdf[y * width + x] = onionW > 0 ? Math.abs(d) - onionW : d;
        }
      }
    } else if (op === "capsule" || op === "uneven_capsule") {
      const r1 = Math.max(0.5, Number(layer.r1 ?? layer.r ?? layer.rx ?? 3.0));
      const r2 = Math.max(0.5, Number(layer.r2 ?? r1));
      if (Array.isArray(layer.points) && layer.points.length >= 2) {
        const pts = layer.points.map((p) => [Number(p[0]) - pivX, Number(p[1]) - pivY]);
        const nSeg = pts.length - 1;
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const [lx, ly] = transformPt(x, y);
            let minD = 1e9;
            for (let sI = 0; sI < nSeg; sI++) {
              const ra = r1 + (r2 - r1) * (sI / nSeg);
              const rb = r1 + (r2 - r1) * ((sI + 1) / nSeg);
              const dSeg = this.sdUnevenCapsuleLocal(lx, ly, pts[sI][0], pts[sI][1], pts[sI + 1][0], pts[sI + 1][1], ra, rb);
              if (dSeg < minD) minD = dSeg;
            }
            sdf[y * width + x] = onionW > 0 ? Math.abs(minD) - onionW : minD;
          }
        }
      } else {
        const x1 = Number(layer.x1 ?? pivX) - pivX;
        const y1 = Number(layer.y1 ?? pivY - 4) - pivY;
        const x2 = Number(layer.x2 ?? pivX) - pivX;
        const y2 = Number(layer.y2 ?? pivY + 4) - pivY;
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const [lx, ly] = transformPt(x, y);
            const d = this.sdUnevenCapsuleLocal(lx, ly, x1, y1, x2, y2, r1, r2);
            sdf[y * width + x] = onionW > 0 ? Math.abs(d) - onionW : d;
          }
        }
      }
    } else if (op === "vesica") {
      const rx = Math.max(0.5, Number(layer.rx ?? layer.w ?? 4.0));
      const ry = Math.max(0.5, Number(layer.ry ?? layer.r ?? 7.0));
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const [lx, ly] = transformPt(x, y);
          const d = this.sdVesicaLocal(lx, ly, rx, ry);
          sdf[y * width + x] = onionW > 0 ? Math.abs(d) - onionW : d;
        }
      }
    } else if (op === "moon") {
      const ra = Math.max(1.0, Number(layer.r1 ?? layer.r ?? layer.rx ?? 6.0));
      const rb = Math.max(0.5, Number(layer.r2 ?? layer.ry ?? ra * 0.8));
      const dOff = Number(layer.d ?? layer.offset ?? ra * 0.45);
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const [lx, ly] = transformPt(x, y);
          const d = this.sdMoonLocal(lx, ly, dOff, ra, rb);
          sdf[y * width + x] = onionW > 0 ? Math.abs(d) - onionW : d;
        }
      }
    } else if (op === "bezier_sdf" && Array.isArray(layer.points) && layer.points.length >= 3) {
      const pts = layer.points.slice(0, 3).map((p) => [Number(p[0]) - pivX, Number(p[1]) - pivY]);
      const r1 = Math.max(0.5, Number(layer.r1 ?? layer.r ?? layer.thickness ?? 2.0));
      const r2 = Math.max(0.5, Number(layer.r2 ?? r1));
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const [lx, ly] = transformPt(x, y);
          const d = this.sdBezierLocal(lx, ly, pts[0], pts[1], pts[2], r1, r2);
          sdf[y * width + x] = onionW > 0 ? Math.abs(d) - onionW : d;
        }
      }
    } else if (op === "star" || op === "ngon") {
      const r = Math.max(1.0, Number(layer.r ?? layer.rx ?? 6.0));
      const nPts = parseInt(layer.n ?? layer.pointsCount ?? 5, 10);
      const defaultRatio = op === "ngon" ? Math.cos(Math.PI / Math.max(3, nPts)) : 0.45;
      const ratio = Number(layer.innerRatio ?? layer.m ?? defaultRatio);
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const [lx, ly] = transformPt(x, y);
          const d = this.sdStarLocal(lx, ly, r, nPts, ratio);
          sdf[y * width + x] = onionW > 0 ? Math.abs(d) - onionW : d;
        }
      }
    }

    const mirror = layer.mirror || "none";
    const smoothK = Number(layer.smoothBlend || 0);
    if (mirror !== "none") {
      const mirrored = new Float64Array(sdf);
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let d = sdf[y * width + x];
          if (mirror === "x" || mirror === "quad") {
            d = this.smin(d, sdf[y * width + (width - 1 - x)], smoothK);
          }
          if (mirror === "y" || mirror === "quad") {
            d = this.smin(d, sdf[(height - 1 - y) * width + x], smoothK);
          }
          if (mirror === "quad") {
            d = this.smin(d, sdf[(height - 1 - y) * width + (width - 1 - x)], smoothK);
          }
          mirrored[y * width + x] = d;
        }
      }
      return mirrored;
    }

    return sdf;
  }

  // ==========================================================================
  // Pillar 4: Kinematic Bone Hierarchy + Analytical 2-Bone IK + Motion Engine
  // ==========================================================================

  static solveIk2Bone(root, target, l1, l2, flip = false) {
    const r2 = (v) => Math.floor(Number(v) * 100.0 + 0.5) / 100.0;
    const ax = Number(root[0]), ay = Number(root[1]);
    const bx = Number(target[0]), by = Number(target[1]);
    const len1 = Math.max(0.5, Number(l1));
    const len2 = Math.max(0.5, Number(l2));
    const dx = bx - ax;
    const dy = by - ay;
    const dist = Math.hypot(dx, dy);
    const minD = Math.abs(len1 - len2) + 1e-4;
    const maxD = (len1 + len2) - 1e-4;
    const dClamped = Math.max(minD, Math.min(maxD, dist));
    const cosA = Math.max(-1.0, Math.min(1.0, (len1 * len1 + dClamped * dClamped - len2 * len2) / (2.0 * len1 * dClamped)));
    const alpha = Math.acos(cosA);
    const baseAng = Math.atan2(dy, dx);
    const jointAng = flip ? baseAng - alpha : baseAng + alpha;
    const jx = ax + len1 * Math.cos(jointAng);
    const jy = ay + len1 * Math.sin(jointAng);
    const scale = dist > 1e-5 ? dClamped / dist : 0.0;
    const ex = ax + dx * scale;
    const ey = ay + dy * scale;
    return [
      [r2(ax), r2(ay)],
      [r2(jx), r2(jy)],
      [r2(ex), r2(ey)]
    ];
  }

  static getLayerCenter(layer, width = 32, height = 32) {
    if (Array.isArray(layer.pivot) && layer.pivot.length >= 2) {
      return [Number(layer.pivot[0]), Number(layer.pivot[1])];
    }
    if (layer.cx !== undefined && layer.cy !== undefined) {
      return [Number(layer.cx), Number(layer.cy)];
    }
    if (layer.x !== undefined && layer.y !== undefined) {
      const w = Number(layer.w ?? 1);
      const h = Number(layer.h ?? 1);
      return [Number(layer.x) + (w - 1) * 0.5, Number(layer.y) + (h - 1) * 0.5];
    }
    if (layer.x1 !== undefined && layer.y1 !== undefined) {
      return [
        (Number(layer.x1) + Number(layer.x2 ?? layer.x1)) * 0.5,
        (Number(layer.y1) + Number(layer.y2 ?? layer.y1)) * 0.5
      ];
    }
    if (Array.isArray(layer.points) && layer.points.length > 0) {
      const pts = layer.points;
      return [
        pts.reduce((acc, p) => acc + Number(p[0]), 0) / pts.length,
        pts.reduce((acc, p) => acc + Number(p[1]), 0) / pts.length
      ];
    }
    return [(width - 1) * 0.5, (height - 1) * 0.5];
  }

  static translateAndRotateLayerInplace(layer, dx, dy, dAngleDeg, pivotPt) {
    const [px, py] = pivotPt;
    const rad = (dAngleDeg * Math.PI) / 180.0;
    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);
    const xform = (x, y) => {
      const rx = x - px;
      const ry = y - py;
      return [px + rx * cosA - ry * sinA + dx, py + rx * sinA + ry * cosA + dy];
    };

    let hasVerts = false;
    if (typeof layer.cx === "number" && typeof layer.cy === "number") {
      [layer.cx, layer.cy] = xform(layer.cx, layer.cy);
    } else if (typeof layer.x === "number" && typeof layer.y === "number") {
      const w = Number(layer.w ?? 1);
      const h = Number(layer.h ?? 1);
      const [cx, cy] = xform(layer.x + (w - 1) * 0.5, layer.y + (h - 1) * 0.5);
      layer.x = cx - (w - 1) * 0.5;
      layer.y = cy - (h - 1) * 0.5;
    }
    if (typeof layer.x1 === "number" && typeof layer.y1 === "number") {
      [layer.x1, layer.y1] = xform(layer.x1, layer.y1);
      if (typeof layer.x2 === "number" && typeof layer.y2 === "number") {
        [layer.x2, layer.y2] = xform(layer.x2, layer.y2);
      }
      hasVerts = true;
    }
    if (Array.isArray(layer.points)) {
      layer.points = layer.points.map((pt) => xform(Number(pt[0]), Number(pt[1])));
      hasVerts = true;
    }
    if (dAngleDeg !== 0.0 && !hasVerts) {
      layer.angle = (Number(layer.angle) || 0.0) + dAngleDeg;
    }
  }

  static computeProceduralMotionMods(spec, frameIndex) {
    const motion = spec && spec.motion;
    if (!motion || typeof motion !== "object" || frameIndex <= 0) return {};
    const nFrames = Math.max(2, parseInt(motion.frames || 4, 10));
    const mType = String(motion.type || "idle_breathe").toLowerCase();
    const amp = Number(motion.amplitude ?? 1.0);
    const squash = Number(motion.squash ?? 0.10);
    const phase = (2.0 * Math.PI * (frameIndex % nFrames)) / nFrames;
    const sVal = Math.sin(phase);
    const cVal = Math.cos(phase);

    const mods = {};
    const layers = Array.isArray(spec.layers) ? spec.layers : [];
    layers.forEach((layer, idx) => {
      if (!layer || !layer.id) return;
      const lid = layer.id;
      const lidL = lid.toLowerCase();
      const hasParent = Boolean(layer.parent);
      const lagPhase = phase - 0.55 * (hasParent ? 1.0 : 0.35);
      const sLag = Math.sin(lagPhase);

      if (mType === "idle_breathe") {
        if (["body", "core", "torso", "slime", "shell"].some((k) => lidL.includes(k))) {
          const scaleX = 1.0 + squash * sVal;
          const rx0 = Number(layer.rx ?? 6);
          const ry0 = Number(layer.ry ?? 6);
          mods[lid] = {
            drx: rx0 * (scaleX - 1.0),
            dry: ry0 * (1.0 / scaleX - 1.0),
            dy: hasParent ? 0.0 : (-sVal * 0.75 * amp)
          };
        } else if (["ear", "crown", "tail", "wing", "head", "hat"].some((k) => lidL.includes(k))) {
          mods[lid] = {
            dy: hasParent ? (-sLag * 0.25 * amp) : (-sLag * 0.75 * amp),
            dAngle: sLag * 5.0
          };
        }
      } else if (mType === "swim_cycle") {
        if (lidL.includes("flipper") || lidL.includes("fin")) {
          const sign = lidL.includes("back") ? -1.0 : 1.0;
          mods[lid] = { dAngle: sign * sVal * 16.0, dy: -sign * sVal * 0.8 * amp };
        } else if (lidL.includes("tail")) {
          mods[lid] = { dx: sLag * 1.2 * amp };
        }
      } else if (mType === "walk_cycle") {
        if (lidL.includes("leg") || lidL.includes("foot") || lidL.includes("paw")) {
          const sign = (lidL.includes("mid") || lidL.includes("back")) ? -1.0 : 1.0;
          mods[lid] = { dy: sign * sVal * 1.5 * amp, dAngle: sign * cVal * 10.0 };
        } else if (lidL.includes("body") || lidL.includes("torso")) {
          mods[lid] = { dy: -Math.abs(sVal) * 0.8 * amp };
        }
      } else if (mType === "jump_arc") {
        if (lidL.includes("shadow")) {
          mods[lid] = { drx: -Math.max(0.0, sVal) * 2.0 * amp };
        } else if (["body", "core", "torso"].some((k) => lidL.includes(k))) {
          const scaleX = 1.0 - squash * sVal;
          const rx0 = Number(layer.rx ?? 6);
          const ry0 = Number(layer.ry ?? 6);
          mods[lid] = {
            dy: hasParent ? 0.0 : (-sVal * 1.8 * amp),
            drx: rx0 * (scaleX - 1.0),
            dry: ry0 * (1.0 / scaleX - 1.0)
          };
        } else if (lidL.includes("ear") || lidL.includes("tail")) {
          mods[lid] = {
            dy: hasParent ? 0.0 : (-sVal * 1.8 * amp),
            dAngle: -cVal * 10.0
          };
        }
      } else if (mType === "wave") {
        mods[lid] = { dy: Math.sin(phase - idx * 0.45) * 1.2 * amp };
      }
    });
    return mods;
  }

  static getFrameCount(spec) {
    if (!spec || typeof spec !== "object") return 1;
    if (spec.type === "shader" || spec.type === "glsl" || spec.glsl || spec.shaderType) {
      if (spec.framesCount) return Math.max(1, parseInt(spec.framesCount, 10) || 1);
    }
    const extra = Array.isArray(spec && spec.frames) ? spec.frames.length : 0;
    let motionFrames = 0;
    if (spec && spec.motion && typeof spec.motion === "object") {
      motionFrames = Math.max(0, (parseInt(spec.motion.frames, 10) || 0) - 1);
    }
    return 1 + Math.max(extra, motionFrames);
  }


  static applyFrameOverrides(spec, frameIndex = 0) {
    const cloned = JSON.parse(JSON.stringify(spec || {}));
    const width = this.clampSize(cloned.width || (cloned.size && cloned.size[0]), 32);
    const height = this.clampSize(cloned.height || (cloned.size && cloned.size[1]), 32);

    const frames = Array.isArray(cloned.frames) ? cloned.frames : [];
    const frameDef = (frameIndex > 0 && frameIndex <= frames.length) ? (frames[frameIndex - 1] || {}) : {};

    if (Array.isArray(frameDef.grid) && frameDef.grid.length > 0) {
      cloned.grid = frameDef.grid;
    }

    const motionMods = frameIndex > 0 ? this.computeProceduralMotionMods(cloned, frameIndex) : {};
    const explicitMods = (frameDef && (frameDef.layers || frameDef.overrides)) || {};

    const layerMods = {};
    for (const [k, v] of Object.entries(motionMods)) {
      layerMods[k] = Object.assign({}, v);
    }
    for (const [k, v] of Object.entries(explicitMods)) {
      if (layerMods[k] && typeof v === "object") {
        Object.assign(layerMods[k], v);
      } else {
        layerMods[k] = Object.assign({}, v);
      }
    }

    if (Array.isArray(cloned.layers)) {
      const origCenters = {};
      const byId = {};
      for (const lyr of cloned.layers) {
        if (lyr && lyr.id) {
          origCenters[lyr.id] = this.getLayerCenter(lyr, width, height);
          byId[lyr.id] = lyr;
        }
      }

      const resolvedXform = {};
      const getCumXform = (lid, visited = new Set()) => {
        if (resolvedXform[lid]) return resolvedXform[lid];
        if (visited.has(lid) || !byId[lid]) {
          return [0.0, 0.0, 0.0, origCenters[lid] || [(width - 1) * 0.5, (height - 1) * 0.5]];
        }
        visited.add(lid);
        const lyr = byId[lid];
        const mod = layerMods[lid] || {};
        let dx = Number(mod.dx || 0.0);
        let dy = Number(mod.dy || 0.0);
        let da = Number(mod.dAngle || 0.0);
        let piv = origCenters[lid] || [(width - 1) * 0.5, (height - 1) * 0.5];
        if (lyr.parent && byId[lyr.parent]) {
          const [pdx, pdy, pda, ppiv] = getCumXform(lyr.parent, visited);
          dx += pdx;
          dy += pdy;
          da += pda;
          piv = ppiv;
        }
        resolvedXform[lid] = [dx, dy, da, piv];
        return resolvedXform[lid];
      };

      const newLayers = [];
      for (const layer of cloned.layers) {
        if (!layer || typeof layer !== "object") continue;
        const lid = layer.id;
        const mod = (lid && layerMods[lid]) ? layerMods[lid] : {};
        if (mod.hidden) continue;

        const updated = JSON.parse(JSON.stringify(layer));
        for (const [mk, mv] of Object.entries(mod)) {
          if (!["dx", "dy", "dAngle", "drx", "dry", "ikTarget"].includes(mk)) {
            updated[mk] = mv;
          }
        }

        const dx = Number(mod.dx || 0.0);
        const dy = Number(mod.dy || 0.0);
        const dAngle = Number(mod.dAngle || 0.0);
        let piv = origCenters[lid] || this.getLayerCenter(updated, width, height);

        if (lid && updated.parent && byId[updated.parent]) {
          const [pdx, pdy, pda, ppiv] = getCumXform(updated.parent);
          if (pdx !== 0.0 || pdy !== 0.0 || pda !== 0.0) {
            this.translateAndRotateLayerInplace(updated, pdx, pdy, pda, ppiv);
            if (Array.isArray(updated.pivot) && updated.pivot.length >= 2) {
              const prad = (pda * Math.PI) / 180.0;
              const pcos = Math.cos(prad), psin = Math.sin(prad);
              const rx = Number(updated.pivot[0]) - ppiv[0];
              const ry = Number(updated.pivot[1]) - ppiv[1];
              updated.pivot = [
                ppiv[0] + rx * pcos - ry * psin + pdx,
                ppiv[1] + rx * psin + ry * pcos + pdy
              ];
            }
          }
          piv = this.getLayerCenter(updated, width, height);
        }

        if (dx !== 0.0 || dy !== 0.0 || dAngle !== 0.0) {
          this.translateAndRotateLayerInplace(updated, dx, dy, dAngle, piv);
        }

        if (typeof mod.drx === "number" && typeof updated.rx === "number") {
          updated.rx = Math.max(0.5, updated.rx + mod.drx);
        }
        if (typeof mod.dry === "number" && typeof updated.ry === "number") {
          updated.ry = Math.max(0.5, updated.ry + mod.dry);
        }

        if (updated.ik && typeof updated.ik === "object") {
          const ikCfg = updated.ik;
          const rootPt = ikCfg.root || (Array.isArray(updated.points) && updated.points[0]) || [width / 2, height / 2];
          const targetPt = [...(mod.ikTarget || ikCfg.target || [rootPt[0], rootPt[1] + 6])];
          if (dx !== 0.0 || dy !== 0.0) {
            targetPt[0] += dx;
            targetPt[1] += dy;
          }
          const l1 = Number(ikCfg.l1 ?? 5.0);
          const l2 = Number(ikCfg.l2 ?? 5.0);
          const flip = Boolean(ikCfg.flip);
          updated.points = this.solveIk2Bone(rootPt, targetPt, l1, l2, flip);
        }

        newLayers.push(updated);
      }
      cloned.layers = newLayers;
    }

    return cloned;
  }

  // ==========================================================================
  // Main Rendering Pipeline (v3.0)
  // ==========================================================================

  static registerSdfToneSymbols(fillSym, tones, paletteRaw, paletteRGBA) {
    const toneSyms = { base: fillSym || "S" };
    const pool = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*+=~^?!";
    for (const toneName of ["deepShadow", "shadow", "highlight", "specular"]) {
      const rgba = tones[toneName];
      let matchedSym = null;
      for (const [k, ex] of Object.entries(paletteRGBA)) {
        if (k === "." || k === " ") continue;
        if (
          Math.abs(ex[0] - rgba[0]) + Math.abs(ex[1] - rgba[1]) + Math.abs(ex[2] - rgba[2]) <= 10 &&
          Math.abs(ex[3] - rgba[3]) <= 15
        ) {
          matchedSym = k;
          break;
        }
      }
      if (matchedSym) {
        toneSyms[toneName] = matchedSym;
      } else {
        let assigned = null;
        for (const ch of pool) {
          if (!paletteRaw[ch] && ch !== "." && ch !== " ") {
            const hexCol = this.rgbaToHex(rgba[0], rgba[1], rgba[2], rgba[3]);
            paletteRaw[ch] = hexCol;
            paletteRGBA[ch] = rgba;
            assigned = ch;
            break;
          }
        }
        toneSyms[toneName] = assigned || fillSym || "S";
      }
    }
    return toneSyms;
  }

  static applyCellularRules(rules, width, height, symbolBuffer, buffer, resolveColorFn) {
    if (!Array.isArray(rules) || rules.length === 0) return;
    rules.forEach((rule, rIdx) => {
      if (!rule || typeof rule !== "object") return;
      const rType = String(rule.type || "top_coat").toLowerCase();
      const target = String(rule.target || "S");
      const replace = String(rule.replace || "L");
      const prob = Number(rule.prob ?? 0.75);
      const seed = parseInt(rule.seed ?? (42 + rIdx * 31), 10);
      const repRGBA = resolveColorFn(replace);
      if (repRGBA[3] <= 0) return;

      const snap = [...symbolBuffer];
      if (rType === "top_coat") {
        for (let y = 1; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = y * width + x;
            const upSym = snap[(y - 1) * width + x];
            if (snap[idx] === target && (upSym === "." || upSym === " " || upSym === "O")) {
              if (this.hash2d(x, y, seed) <= prob) {
                symbolBuffer[idx] = replace;
                const bIdx = idx * 4;
                buffer[bIdx] = repRGBA[0];
                buffer[bIdx + 1] = repRGBA[1];
                buffer[bIdx + 2] = repRGBA[2];
                buffer[bIdx + 3] = repRGBA[3];
              }
            }
          }
        }
      } else if (rType === "bottom_drip") {
        const maxLen = Math.max(1, parseInt(rule.length || 2, 10));
        for (let y = height - 2; y >= 0; y--) {
          for (let x = 0; x < width; x++) {
            const idx = y * width + x;
            if (snap[idx] === target && snap[(y + 1) * width + x] === ".") {
              if (this.hash2d(x, y, seed) <= prob) {
                for (let dStep = 1; dStep <= maxLen; dStep++) {
                  const ny = y + dStep;
                  if (ny < height && snap[ny * width + x] === ".") {
                    const nIdx = ny * width + x;
                    symbolBuffer[nIdx] = replace;
                    const bIdx = nIdx * 4;
                    buffer[bIdx] = repRGBA[0];
                    buffer[bIdx + 1] = repRGBA[1];
                    buffer[bIdx + 2] = repRGBA[2];
                    buffer[bIdx + 3] = repRGBA[3];
                  }
                }
              }
            }
          }
        }
      } else if (rType === "nw_glint" || rType === "highlight_glint") {
        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = y * width + x;
            if (snap[idx] === target && snap[(y - 1) * width + x] !== target && snap[y * width + (x - 1)] !== target) {
              if (this.hash2d(x, y, seed) <= prob) {
                symbolBuffer[idx] = replace;
                const bIdx = idx * 4;
                buffer[bIdx] = repRGBA[0];
                buffer[bIdx + 1] = repRGBA[1];
                buffer[bIdx + 2] = repRGBA[2];
                buffer[bIdx + 3] = repRGBA[3];
              }
            }
          }
        }
      }
    });
  }

  // ==========================================================================
  // SKELETAL CAPSULE RIG ENGINE (PixelRig)
  // ==========================================================================

  static solveFkRig(bonesDef, pose = {}) {
    const bonesById = {};
    if (Array.isArray(bonesDef)) {
      bonesDef.forEach((b) => {
        if (b && b.id) bonesById[b.id] = b;
      });
    }
    const resolved = {};

    const getBoneXform = (bid, visited = new Set()) => {
      if (resolved[bid]) return resolved[bid];
      if (visited.has(bid) || !bonesById[bid]) {
        return { start: [0, 0], end: [0, 0], angle: 0 };
      }
      visited.add(bid);

      const b = bonesById[bid];
      const mod = (pose && typeof pose === "object" && pose[bid]) || {};
      const dAngle = Number(mod.dAngle || 0);
      const dx = Number(mod.dx || 0);
      const dy = Number(mod.dy || 0);

      let startX = 0;
      let startY = 0;
      let worldAngle = 0;

      const parentId = b.parent;
      if (parentId && bonesById[parentId]) {
        const parentXform = getBoneXform(parentId, visited);
        const offset = Array.isArray(b.offset) ? b.offset : [0, 0];
        const prad = (parentXform.angle * Math.PI) / 180.0;
        const pcos = Math.cos(prad);
        const psin = Math.sin(prad);
        const rx = Number(offset[0] || 0) * pcos - Number(offset[1] || 0) * psin;
        const ry = Number(offset[0] || 0) * psin + Number(offset[1] || 0) * pcos;
        startX = parentXform.end[0] + rx + dx;
        startY = parentXform.end[1] + ry + dy;
        worldAngle = parentXform.angle + Number(b.angle || 0) + dAngle;
      } else {
        startX = Number(b.x || 0) + dx;
        startY = Number(b.y || 0) + dy;
        worldAngle = Number(b.angle || 0) + dAngle;
      }

      const length = Number(b.length || 0);
      const wrad = (worldAngle * Math.PI) / 180.0;
      const endX = startX + length * Math.cos(wrad);
      const endY = startY + length * Math.sin(wrad);

      resolved[bid] = { start: [startX, startY], end: [endX, endY], angle: worldAngle };
      return resolved[bid];
    };

    if (Array.isArray(bonesDef)) {
      bonesDef.forEach((b) => {
        if (b && b.id) getBoneXform(b.id);
      });
    }
    return resolved;
  }

  static renderRig(specInput, frameIndex = 0) {
    const spec = specInput || {};
    const width = this.clampSize(spec.width || (spec.size && spec.size[0]), 32);
    const height = this.clampSize(spec.height || (spec.size && spec.size[1]), 32);

    const rigDef = spec.rig && typeof spec.rig === "object" ? spec.rig : spec;
    const bonesDef = Array.isArray(rigDef.bones) ? rigDef.bones : [];

    const frames = Array.isArray(spec.frames) ? spec.frames : [];
    let framePose = {};
    if (frameIndex > 0 && frameIndex <= frames.length) {
      const fDef = frames[frameIndex - 1];
      framePose = fDef.pose || fDef.layers || {};
    } else if (frameIndex === 0 && frames.length === 1 && (frames[0].pose || frames[0].layers)) {
      framePose = frames[0].pose || frames[0].layers || {};
    }

    const fkResults = this.solveFkRig(bonesDef, framePose);

    const paletteRaw = this.resolveFullPalette(spec);
    const paletteRGBA = { ".": [0, 0, 0, 0], " ": [0, 0, 0, 0] };
    for (const [key, val] of Object.entries(paletteRaw)) {
      paletteRGBA[key] = this.parseColor(val);
    }

    const outlineKey = rigDef.outline || "o";
    const outlineRGBA = paletteRGBA[outlineKey] || this.parseColor(outlineKey);
    const outlineW = Number(rigDef.outlineWidth || 1.0);

    const sortedBones = bonesDef
      .filter((b) => b && b.id && !b.hidden)
      .sort((a, b) => Number(a.z || 0) - Number(b.z || 0));

    const colorBuf = new Array(width * height).fill(null);
    const zBuf = new Float32Array(width * height).fill(-9999.0);
    const boneIdBuf = new Array(width * height).fill(null);
    const normalBuffer = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < width * height; i++) {
      normalBuffer[i * 4] = 128;
      normalBuffer[i * 4 + 1] = 128;
      normalBuffer[i * 4 + 2] = 255;
      normalBuffer[i * 4 + 3] = 0;
    }

    const minDistBuf = new Float32Array(width * height).fill(9999.0);
    const symbolBuffer = new Array(width * height).fill(".");

    const lightDir = [-0.52, -0.62, 0.58];
    const lMag = Math.hypot(lightDir[0], lightDir[1], lightDir[2]);
    const lx = lightDir[0] / lMag;
    const ly = lightDir[1] / lMag;
    const lz = lightDir[2] / lMag;

    for (const b of sortedBones) {
      const bid = b.id;
      const xf = fkResults[bid] || { start: [0, 0], end: [0, 0], angle: 0 };
      const ax = xf.start[0];
      const ay = xf.start[1];
      const bx = xf.end[0];
      const by = xf.end[1];

      const r1 = Math.max(0.5, Number(b.r1 || 2.0));
      const r2 = Math.max(0.5, Number(b.r2 || r1));
      const z = Number(b.z || 0);
      const fillKey = b.fill || "b";
      const fillRGBA = paletteRGBA[fillKey] || this.parseColor(fillKey);
      const shape = String(b.shape || "capsule").toLowerCase();

      const vax = bx - ax;
      const vay = by - ay;
      const vLenSq = vax * vax + vay * vay;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const px = x + 0.5;
          const py = y + 0.5;
          let d = 9999.0;
          let qx = ax;
          let qy = ay;
          let effR = r1;

          if (shape === "head_oval" || shape === "oval") {
            const hasLen = Number(b.length || 0) > 0;
            const cx = hasLen ? bx : ax;
            const cy = hasLen ? by : ay;
            const rx = r2;
            const ry = r1;
            const pLocX = px - cx;
            const pLocY = py - cy;
            const k0 = Math.hypot(pLocX / rx, pLocY / ry);
            d = (k0 - 1.0) * Math.min(rx, ry);
            qx = cx;
            qy = cy;
            effR = (rx + ry) * 0.5;
          } else {
            if (vLenSq < 1e-6) {
              qx = ax;
              qy = ay;
              effR = r1;
            } else {
              const hVal = Math.max(0.0, Math.min(1.0, ((px - ax) * vax + (py - ay) * vay) / vLenSq));
              qx = ax + hVal * vax;
              qy = ay + hVal * vay;
              effR = r1 + hVal * (r2 - r1);
            }
            d = Math.hypot(px - qx, py - qy) - effR;
          }

          const idx = y * width + x;
          if (d < minDistBuf[idx]) {
            minDistBuf[idx] = d;
          }

          if (d <= 0.0) {
            if (z >= zBuf[idx]) {
              zBuf[idx] = z;
              boneIdBuf[idx] = bid;

              const vx = (px - qx) / Math.max(0.1, effR);
              const vy = (py - qy) / Math.max(0.1, effR);
              const vzSq = Math.max(0.0, 1.0 - vx * vx - vy * vy);
              const vz = Math.sqrt(vzSq);

              const dot = vx * lx + vy * ly + vz * lz;
              let col = fillRGBA;
              if (dot > 0.45) {
                col = [Math.min(255, Math.round(fillRGBA[0] * 1.15)), Math.min(255, Math.round(fillRGBA[1] * 1.15)), Math.min(255, Math.round(fillRGBA[2] * 1.15)), 255];
              } else if (dot < -0.1) {
                col = [Math.max(0, Math.round(fillRGBA[0] * 0.82)), Math.max(0, Math.round(fillRGBA[1] * 0.82)), Math.max(0, Math.round(fillRGBA[2] * 0.82)), 255];
              }

              if (b.features && typeof b.features === "object") {
                const feats = b.features;
                if (feats.eyes && typeof feats.eyes === "object") {
                  const ef = feats.eyes;
                  const edx = Number(ef.dx || 2.0);
                  const edy = Number(ef.dy || 0.0);
                  const ew = Number(ef.w || 2.0);
                  const eh = Number(ef.h || 3.0);
                  const hasLen = Number(b.length || 0) > 0;
                  const eyeCenterX = (hasLen ? bx : ax) + edx;
                  const eyeCenterY = (hasLen ? by : ay) + edy;
                  if (Math.abs(px - eyeCenterX) <= ew * 0.5 && Math.abs(py - eyeCenterY) <= eh * 0.5) {
                    const eyeC = ef.color || "#4e221c";
                    col = paletteRGBA[eyeC] || this.parseColor(eyeC);
                  }
                }
              }

              colorBuf[idx] = col;
              symbolBuffer[idx] = paletteRaw[fillKey] ? fillKey : "b";
              normalBuffer[idx * 4] = Math.max(0, Math.min(255, Math.round((vx * 0.5 + 0.5) * 255.0)));
              normalBuffer[idx * 4 + 1] = Math.max(0, Math.min(255, Math.round((-vy * 0.5 + 0.5) * 255.0)));
              normalBuffer[idx * 4 + 2] = Math.max(0, Math.min(255, Math.round((vz * 0.5 + 0.5) * 255.0)));
              normalBuffer[idx * 4 + 3] = 255;
            }
          }
        }
      }
    }

    const buffer = new Uint8ClampedArray(width * height * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const dVal = minDistBuf[idx];
        if (colorBuf[idx] !== null) {
          let isInternalCrease = false;
          const curZ = zBuf[idx];
          const neighbors = [[-1, 0], [1, 0], [0, -1], [0, 1]];
          for (let ni = 0; ni < 4; ni++) {
            const ny = y + neighbors[ni][0];
            const nx = x + neighbors[ni][1];
            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
              const nIdx = ny * width + nx;
              if (zBuf[nIdx] > -9000.0 && curZ - zBuf[nIdx] >= 1.5) {
                isInternalCrease = true;
                break;
              }
            }
          }
          if (isInternalCrease) {
            const c = colorBuf[idx];
            buffer[idx * 4] = Math.max(0, Math.round(c[0] * 0.72));
            buffer[idx * 4 + 1] = Math.max(0, Math.round(c[1] * 0.72));
            buffer[idx * 4 + 2] = Math.max(0, Math.round(c[2] * 0.72));
            buffer[idx * 4 + 3] = 255;
          } else {
            const c = colorBuf[idx];
            buffer[idx * 4] = c[0];
            buffer[idx * 4 + 1] = c[1];
            buffer[idx * 4 + 2] = c[2];
            buffer[idx * 4 + 3] = c[3] !== undefined ? c[3] : 255;
          }
        } else if (dVal > 0.0 && dVal <= outlineW) {
          buffer[idx * 4] = outlineRGBA[0];
          buffer[idx * 4 + 1] = outlineRGBA[1];
          buffer[idx * 4 + 2] = outlineRGBA[2];
          buffer[idx * 4 + 3] = 255;
          symbolBuffer[idx] = paletteRaw[outlineKey] ? outlineKey : "o";
          normalBuffer[idx * 4] = 128;
          normalBuffer[idx * 4 + 1] = 128;
          normalBuffer[idx * 4 + 2] = 255;
          normalBuffer[idx * 4 + 3] = 255;
        }
      }
    }

    const diagnostics = this.analyze(width, height, buffer);
    return {
      width,
      height,
      buffer,
      normalBuffer,
      symbolBuffer,
      resolvedPalette: paletteRaw,
      warnings: [],
      diagnostics
    };
  }

  // ==========================================================================
  // PROCEDURAL GLSL / MATH SHADER ENGINE (PixelShader)
  // ==========================================================================

  static renderShader(specInput, frameIndex = 0) {
    const spec = specInput || {};
    const width = this.clampSize(spec.width || (spec.size && spec.size[0]), 32);
    const height = this.clampSize(spec.height || (spec.size && spec.size[1]), 32);
    const paletteRaw = this.resolveFullPalette(spec);
    const paletteList = Object.entries(paletteRaw)
      .filter(([k]) => k !== "." && k !== " ")
      .map(([, v]) => this.parseColor(v).slice(0, 3));
    if (paletteList.length === 0) {
      paletteList.push([7, 11, 25], [38, 75, 135], [96, 165, 250], [255, 255, 255]);
    }

    const framesCount = Math.max(1, parseInt(spec.framesCount, 10) || (Array.isArray(spec.frames) ? spec.frames.length : 1));
    const t = framesCount > 1 ? frameIndex / framesCount : Number(spec.time || 0);

    const ditherMode = String(spec.dither || "bayer4x4").toLowerCase();
    const ditherStr = Number(spec.ditherStrength ?? 0.16);
    const shaderType = String(spec.shaderType || spec.preset || "custom").toLowerCase();

    const palOklab = paletteList.map((c) => this.rgbToOklab(c[0], c[1], c[2]));
    const palKeys = Object.keys(paletteRaw).filter((k) => k !== "." && k !== " ");

    const buffer = new Uint8ClampedArray(width * height * 4);
    const normalBuffer = new Uint8ClampedArray(width * height * 4);
    const symbolBuffer = new Array(width * height).fill(".");
    const intensityMap = new Float32Array(width * height);

    const bayer4x4Norm = [
      [-0.5, 0.0, -0.375, 0.125],
      [0.25, -0.25, 0.375, -0.125],
      [-0.3125, 0.1875, -0.4375, 0.0625],
      [0.4375, -0.0625, 0.3125, -0.1875]
    ];

    const evalSample = (u, v, timeVal) => {
      const px = u * 2.0 - 1.0;
      const py = v * 2.0 - 1.0;
      const rDist = Math.hypot(px, py);
      const ang = Math.atan2(py, px);

      if (shaderType === "portal" || shaderType === "vortex" || shaderType === "orb") {
        const spiral = Math.sin(ang * 4.0 - timeVal * 6.28318 + rDist * 6.0);
        const orb = rDist - 0.72 + 0.08 * spiral;
        if (orb > 0.06) return [0, 0, 0, 0];
        const core = Math.max(0.0, 1.0 - rDist / 0.75);
        const ring = Math.max(0.0, 1.0 - Math.abs(orb) / 0.12);
        const intensity = Math.max(0.0, Math.min(1.0, core * 0.7 + ring * 0.9 + 0.25 * spiral));
        const cr = Math.sin(intensity * Math.PI) * 0.6;
        const cg = intensity * 0.9;
        const cb = 0.5 + intensity * 0.5;
        return [cr, cg, cb, 1.0];
      } else if (shaderType === "fire" || shaderType === "flame") {
        const noiseVal = this.valueNoise2d((px + 1.0) * 4.0, (py - timeVal * 2.0) * 4.0);
        const flameShape = rDist - (0.65 - (py + 0.5) * 0.4) + noiseVal * 0.25;
        if (flameShape > 0.05 || py < -0.85) return [0, 0, 0, 0];
        const intensity = Math.max(0.0, Math.min(1.0, 1.0 - flameShape * 1.5));
        const cr = Math.min(1.0, intensity * 1.4);
        const cg = Math.min(1.0, Math.max(0.0, (intensity - 0.3) * 1.5));
        const cb = Math.min(1.0, Math.max(0.0, (intensity - 0.8) * 3.0));
        return [cr, cg, cb, 1.0];
      } else if (shaderType === "shield" || shaderType === "forcefield") {
        const hexGrid = Math.sin(px * 16.0) * Math.cos(py * 16.0);
        const ring = Math.abs(rDist - 0.75);
        if (ring > 0.15) return [0, 0, 0, 0];
        const intensity = Math.max(0.0, Math.min(1.0, (1.0 - ring / 0.15) * 0.8 + 0.2 * Math.sin(timeVal * 6.28 + hexGrid * 4.0)));
        return [0.2 * intensity, 0.8 * intensity, 1.0 * intensity, 1.0];
      } else {
        const wave = Math.sin(rDist * 8.0 - timeVal * 6.28) * 0.5 + 0.5;
        if (rDist > 0.85) return [0, 0, 0, 0];
        return [wave, wave * 0.8, wave * 1.2, 1.0];
      }
    };

    for (let y = 0; y < height; y++) {
      const v = 1.0 - (y + 0.5) / height;
      for (let x = 0; x < width; x++) {
        const u = (x + 0.5) / width;
        const [r, g, b, alpha] = evalSample(u, v, t);
        const idx = y * width + x;
        intensityMap[idx] = ((r + g + b) / 3.0) * alpha;

        if (alpha <= 0.05) {
          buffer[idx * 4] = 0;
          buffer[idx * 4 + 1] = 0;
          buffer[idx * 4 + 2] = 0;
          buffer[idx * 4 + 3] = 0;
          continue;
        }

        let ditherOffset = 0.0;
        if (ditherMode === "bayer4x4") {
          ditherOffset = bayer4x4Norm[y % 4][x % 4] * ditherStr;
        } else if (ditherMode === "bayer2x2") {
          ditherOffset = this.bayer2x2[y % 2][x % 2] * ditherStr;
        }

        const rq = Math.max(0.0, Math.min(255.0, (r + ditherOffset) * 255.0));
        const gq = Math.max(0.0, Math.min(255.0, (g + ditherOffset) * 255.0));
        const bq = Math.max(0.0, Math.min(255.0, (b + ditherOffset) * 255.0));

        const [pL, pa, pbOk] = this.rgbToOklab(rq, gq, bq);
        let bestIdx = 0;
        let bestDist = 1e9;
        for (let pi = 0; pi < palOklab.length; pi++) {
          const [tL, ta, tb] = palOklab[pi];
          const dist = (pL - tL) ** 2 + (pa - ta) ** 2 + (pbOk - tb) ** 2;
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = pi;
          }
        }

        const chosenCol = paletteList[bestIdx];
        buffer[idx * 4] = chosenCol[0];
        buffer[idx * 4 + 1] = chosenCol[1];
        buffer[idx * 4 + 2] = chosenCol[2];
        buffer[idx * 4 + 3] = 255;
        symbolBuffer[idx] = palKeys[Math.min(bestIdx, palKeys.length - 1)] || "S";
      }
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (buffer[idx * 4 + 3] === 0) {
          normalBuffer[idx * 4] = 128;
          normalBuffer[idx * 4 + 1] = 128;
          normalBuffer[idx * 4 + 2] = 255;
          normalBuffer[idx * 4 + 3] = 0;
          continue;
        }
        const leftI = intensityMap[y * width + Math.max(0, x - 1)];
        const rightI = intensityMap[y * width + Math.min(width - 1, x + 1)];
        const upI = intensityMap[Math.max(0, y - 1) * width + x];
        const downI = intensityMap[Math.min(height - 1, y + 1) * width + x];
        const gx = (rightI - leftI) * 2.0;
        const gy = (downI - upI) * 2.0;
        const gl = Math.hypot(gx, gy);
        const nx = gl > 1e-5 ? (gx / gl) * 0.7 : 0.0;
        const ny = gl > 1e-5 ? (gy / gl) * 0.7 : 0.0;
        const nz = Math.sqrt(Math.max(0.1, 1.0 - nx * nx - ny * ny));

        normalBuffer[idx * 4] = Math.max(0, Math.min(255, Math.round((nx * 0.5 + 0.5) * 255.0)));
        normalBuffer[idx * 4 + 1] = Math.max(0, Math.min(255, Math.round((-ny * 0.5 + 0.5) * 255.0)));
        normalBuffer[idx * 4 + 2] = Math.max(0, Math.min(255, Math.round((nz * 0.5 + 0.5) * 255.0)));
        normalBuffer[idx * 4 + 3] = 255;
      }
    }

    const diagnostics = this.analyze(width, height, buffer);
    return {
      width,
      height,
      buffer,
      normalBuffer,
      symbolBuffer,
      resolvedPalette: paletteRaw,
      warnings: [],
      diagnostics
    };
  }

  static render(specInput, frameIndex = 0) {
    const specRaw = specInput || {};
    const specType = String(specRaw.type || "").toLowerCase();
    if (specType === "rig" || (specRaw.rig && typeof specRaw.rig === "object" && Array.isArray(specRaw.rig.bones))) {
      return this.renderRig(specRaw, frameIndex);
    }
    if (specType === "shader" || specType === "glsl" || specRaw.glsl || (specRaw.shaderType && !(specRaw.rig && specRaw.rig.bones))) {
      return this.renderShader(specRaw, frameIndex);
    }

    const spec = this.applyFrameOverrides(specRaw, frameIndex);
    const width = this.clampSize(spec.width || (spec.size && spec.size[0]), 32);
    const height = this.clampSize(spec.height || (spec.size && spec.size[1]), 32);
    const paletteRaw = this.resolveFullPalette(spec);
    const post = spec.postProcess || {};

    const globalSdfShading = Boolean(post.sdfShading);
    const useSelOut = Boolean(post.selOut);

    const paletteRGBA = { ".": [0, 0, 0, 0], " ": [0, 0, 0, 0] };
    for (const [key, val] of Object.entries(paletteRaw)) {
      paletteRGBA[key] = this.parseColor(val);
    }

    const resolveColor = (keyOrHex) => {
      if (!keyOrHex) return [0, 0, 0, 0];
      if (paletteRGBA[keyOrHex]) return paletteRGBA[keyOrHex];
      return this.parseColor(keyOrHex);
    };

    const buffer = new Uint8ClampedArray(width * height * 4);
    const normalBuffer = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < width * height; i++) {
      normalBuffer[i * 4] = 128;
      normalBuffer[i * 4 + 1] = 128;
      normalBuffer[i * 4 + 2] = 255;
      normalBuffer[i * 4 + 3] = 0;
    }
    const symbolBuffer = new Array(width * height).fill(".");

    const setNormalPixel = (x, y, nx, ny, nz) => {
      const ix = Math.round(x);
      const iy = Math.round(y);
      if (ix < 0 || ix >= width || iy < 0 || iy >= height) return;
      const cnx = Math.abs(nx) < 1e-9 ? 0.0 : nx;
      const cny = Math.abs(ny) < 1e-9 ? 0.0 : ny;
      const idx = (iy * width + ix) * 4;
      normalBuffer[idx] = Math.max(0, Math.min(255, Math.round((cnx * 0.5 + 0.5) * 255.0)));
      normalBuffer[idx + 1] = Math.max(0, Math.min(255, Math.round((-cny * 0.5 + 0.5) * 255.0)));
      normalBuffer[idx + 2] = Math.max(0, Math.min(255, Math.round((nz * 0.5 + 0.5) * 255.0)));
      normalBuffer[idx + 3] = 255;
    };

    const blendPixel = (x, y, rgba, sym = null) => {
      const ix = Math.round(x);
      const iy = Math.round(y);
      if (ix < 0 || ix >= width || iy < 0 || iy >= height) return;
      const [sr, sg, sb, sa] = rgba;
      if (sa <= 0) return;

      const idx = (iy * width + ix) * 4;
      if (sa >= 255 || buffer[idx + 3] === 0) {
        buffer[idx] = sr;
        buffer[idx + 1] = sg;
        buffer[idx + 2] = sb;
        buffer[idx + 3] = sa;
      } else {
        const srcA = sa / 255;
        const dstA = buffer[idx + 3] / 255;
        const outA = srcA + dstA * (1 - srcA);
        if (outA > 0) {
          buffer[idx] = Math.round((sr * srcA + buffer[idx] * dstA * (1 - srcA)) / outA);
          buffer[idx + 1] = Math.round((sg * srcA + buffer[idx + 1] * dstA * (1 - srcA)) / outA);
          buffer[idx + 2] = Math.round((sb * srcA + buffer[idx + 2] * dstA * (1 - srcA)) / outA);
          buffer[idx + 3] = Math.round(outA * 255);
        }
      }
      if (sym && (sa >= 128 || symbolBuffer[iy * width + ix] === ".")) {
        symbolBuffer[iy * width + ix] = sym;
      }
    };

    const rasterizeSdfField = (sdfField, layer, subSdfs = null) => {
      const rawMask = new Uint8Array(width * height);
      let maxDepth = 1.0;
      for (let i = 0; i < width * height; i++) {
        if (sdfField[i] <= 0.0) {
          rawMask[i] = 1;
          if (-sdfField[i] > maxDepth) maxDepth = -sdfField[i];
        }
      }

      const opName = String(layer.op || "").toLowerCase();
      const pruneSpurs = !["polygon", "star", "ngon", "rect"].includes(opName) || Number(layer.smoothBlend || 0) > 0;
      const fullMask = this.cleanSdfMask(rawMask, sdfField, width, height, pruneSpurs);

      const fillSym = layer.fill;
      const fillRGBA = resolveColor(fillSym);
      const outlineKey = layer.outline;
      const outlineRGBA = outlineKey ? resolveColor(outlineKey) : null;
      const ditherKey = layer.ditherColor;
      const ditherRGBA = ditherKey ? resolveColor(ditherKey) : fillRGBA;
      const ditherMode = layer.dither || layer.shader || "none";
      const shaderScale = Number(layer.shaderScale || 5.0);
      const shaderSeed = parseInt(layer.seed || 0, 10);
      const useSdf3D = Boolean(layer.sdf || globalSdfShading) && fillRGBA[3] >= 200;

      const tones = this.deriveSdfShadingTones(fillRGBA);
      const toneSyms = useSdf3D ? this.registerSdfToneSymbols(fillSym, tones, paletteRaw, paletteRGBA) : null;

      let creaseSym = layer.creaseColor;
      let creaseRGBA = null;
      if (creaseSym) {
        creaseRGBA = resolveColor(creaseSym);
      } else if (paletteRGBA["S"] && fillSym === "W") {
        creaseSym = "S";
        creaseRGBA = paletteRGBA["S"];
      } else {
        creaseRGBA = tones.shadow;
        creaseSym = toneSyms ? toneSyms.shadow : fillSym;
      }

      // 2.5D Internal Anatomical Crease detection
      const creaseMask = new Uint8Array(width * height);
      const baseZ = (Array.isArray(subSdfs) && subSdfs.length > 0) ? subSdfs[0][1] : 0.0;
      if (Array.isArray(subSdfs) && subSdfs.length >= 2 && fillRGBA[3] >= 200) {
        for (let kIdx = 0; kIdx < subSdfs.length; kIdx++) {
          const [frontSdf, frontZ, frontCrease] = subSdfs[kIdx];
          if (!frontCrease) continue;
          for (let prevIdx = 0; prevIdx < subSdfs.length; prevIdx++) {
            if (prevIdx === kIdx) continue;
            const [backSdf, backZ] = subSdfs[prevIdx];
            if (frontZ <= backZ) continue;
            for (let y = 1; y < height - 1; y++) {
              for (let x = 1; x < width - 1; x++) {
                const idx = y * width + x;
                if (!fullMask[idx]) continue;
                const df = frontSdf[idx];
                const db = backSdf[idx];
                if (df >= -0.95 && df <= 0.15 && db <= -0.45) {
                  creaseMask[idx] = 1;
                }
              }
            }
          }
        }
      }

      const lxLight = -0.52, lyLight = -0.62, lzLight = 0.58;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          if (!fullMask[idx]) continue;

          const isEdge =
            x === 0 || x === width - 1 || y === 0 || y === height - 1 ||
            !fullMask[y * width + (x - 1)] ||
            !fullMask[y * width + (x + 1)] ||
            !fullMask[(y - 1) * width + x] ||
            !fullMask[(y + 1) * width + x];

          const dL = sdfField[y * width + Math.max(0, x - 1)];
          const dR = sdfField[y * width + Math.min(width - 1, x + 1)];
          const dU = sdfField[Math.max(0, y - 1) * width + x];
          const dD = sdfField[Math.min(height - 1, y + 1) * width + x];
          let gx = (dR - dL) * 0.5;
          let gy = (dD - dU) * 0.5;

          if (Array.isArray(subSdfs) && subSdfs.length >= 2) {
            let topZ = baseZ;
            let topSdf = null;
            for (const [sSdf, sZ] of subSdfs) {
              if (sZ > topZ && sSdf[idx] <= 0.0) {
                topZ = sZ;
                topSdf = sSdf;
              }
            }
            if (topSdf) {
              const fgGx = (topSdf[y * width + Math.min(width - 1, x + 1)] - topSdf[y * width + Math.max(0, x - 1)]) * 0.5;
              const fgGy = (topSdf[Math.min(height - 1, y + 1) * width + x] - topSdf[Math.max(0, y - 1) * width + x]) * 0.5;
              gx = gx * 0.45 + fgGx * 0.55;
              gy = gy * 0.45 + fgGy * 0.55;
            }
          }

          const tDepth = Math.max(0.0, Math.min(1.0, -sdfField[idx] / Math.max(1.5, maxDepth)));
          const dzDt = (0.65 * (1.0 - tDepth)) / Math.sqrt(Math.max(0.16, tDepth * (2.0 - tDepth)));
          let nx = gx * dzDt;
          let ny = gy * dzDt;
          let nz = 1.0;
          const invLen = 1.0 / Math.sqrt(nx * nx + ny * ny + nz * nz);
          nx *= invLen; ny *= invLen; nz *= invLen;
          if (fillRGBA[3] >= 180 || (outlineRGBA && outlineRGBA[3] >= 180 && isEdge)) {
            setNormalPixel(x, y, nx, ny, nz);
          }

          if (outlineRGBA && outlineRGBA[3] > 0 && isEdge) {
            if ((useSelOut || layer.selOut) && (nx * lxLight + ny * lyLight + nz * lzLight) > 0.25) {
              const selRGBA = [
                Math.floor((outlineRGBA[0] + tones.deepShadow[0]) * 0.5),
                Math.floor((outlineRGBA[1] + tones.deepShadow[1]) * 0.5),
                Math.floor((outlineRGBA[2] + tones.deepShadow[2]) * 0.5),
                outlineRGBA[3]
              ];
              blendPixel(x, y, selRGBA, outlineKey);
            } else {
              blendPixel(x, y, outlineRGBA, outlineKey);
            }
          } else if (creaseMask[idx] && creaseRGBA) {
            blendPixel(x, y, creaseRGBA, creaseSym);
          } else if (fillRGBA[3] > 0) {
            if (useSdf3D && toneSyms) {
              const bayer = BAYER_2X2[y & 1][x & 1];
              const intensity = (nx * lxLight + ny * lyLight + nz * lzLight) + bayer;

              let chosenName = "base";
              if (intensity > 0.86) chosenName = "specular";
              else if (intensity > 0.66) chosenName = "highlight";
              else if (intensity < 0.25) chosenName = "deepShadow";
              else if (intensity < 0.44) chosenName = "shadow";

              let chosenRGBA = tones[chosenName];
              let chosenSym = toneSyms[chosenName];

              if (ditherMode !== "none" && this.checkDither(ditherMode, x, y, nx, ny, shaderScale, shaderSeed)) {
                chosenRGBA = ditherKey ? ditherRGBA : tones.deepShadow;
                chosenSym = ditherKey ? ditherKey : toneSyms.deepShadow;
              }
              blendPixel(x, y, chosenRGBA, chosenSym);
            } else {
              const useDither = this.checkDither(ditherMode, x, y, nx, ny, shaderScale, shaderSeed);
              blendPixel(
                x,
                y,
                useDither ? ditherRGBA : fillRGBA,
                useDither ? (ditherKey || fillSym) : fillSym
              );
            }
          }
        }
      }
    };

    const plotPointWithMirror = (x, y, thickness, rgba, sym, mirror) => {
      const r = Math.max(1, Math.round(thickness || 1));
      const half = Math.floor((r - 1) / 2);
      const put = (px, py) => {
        for (let dy = -half; dy <= r - 1 - half; dy++) {
          for (let dx = -half; dx <= r - 1 - half; dx++) {
            blendPixel(px + dx, py + dy, rgba, sym);
          }
        }
      };
      put(x, y);
      if (mirror === "x" || mirror === "quad") put(width - 1 - x, y);
      if (mirror === "y" || mirror === "quad") put(x, height - 1 - y);
      if (mirror === "quad") put(width - 1 - x, height - 1 - y);
    };

    const drawBresenhamLine = (x0, y0, x1, y1, thickness, rgba, sym, mirror) => {
      let ix0 = Math.round(x0), iy0 = Math.round(y0);
      const ix1 = Math.round(x1), iy1 = Math.round(y1);
      const dx = Math.abs(ix1 - ix0), sx = ix0 < ix1 ? 1 : -1;
      const dy = -Math.abs(iy1 - iy0), sy = iy0 < iy1 ? 1 : -1;
      let err = dx + dy;

      while (true) {
        plotPointWithMirror(ix0, iy0, thickness, rgba, sym, mirror);
        if (ix0 === ix1 && iy0 === iy1) break;
        const e2 = 2 * err;
        if (e2 >= dy) { err += dy; ix0 += sx; }
        if (e2 <= dx) { err += dx; iy0 += sy; }
      }
    };

    const layers = Array.isArray(spec.layers) ? spec.layers : [];
    let i = 0;
    while (i < layers.length) {
      const layer = layers[i];
      if (!layer || !layer.op || layer.hidden) {
        i++;
        continue;
      }
      const op = String(layer.op).toLowerCase();

      if (SDF_SHAPE_OPS.includes(op)) {
        const combinedSdf = this.computeLayerSDF(layer, width, height);
        const hasExplicitZ = (layer.z !== undefined) || Boolean(layer.crease);
        const subSdfs = [[new Float64Array(combinedSdf), Number(layer.z ?? 0), hasExplicitZ]];

        while (
          i + 1 < layers.length &&
          layers[i + 1] &&
          !layers[i + 1].hidden &&
          SDF_SHAPE_OPS.includes(String(layers[i + 1].op || "").toLowerCase()) &&
          (
            (Number(layers[i + 1].smoothBlend || 0) > 0 && layers[i + 1].fill === layer.fill) ||
            ["subtract", "smooth_subtract", "intersect", "union", "smooth_union"].includes(String(layers[i + 1].opMode || "").toLowerCase())
          )
        ) {
          const nextLayer = layers[i + 1];
          const nextSdf = this.computeLayerSDF(nextLayer, width, height);
          const k = Number(nextLayer.smoothBlend || 0);
          const opMode = nextLayer.opMode || (k > 0 ? "smooth_union" : "union");
          for (let p = 0; p < width * height; p++) {
            combinedSdf[p] = this.csgCombine(combinedSdf[p], nextSdf[p], opMode, k);
          }
          if (["union", "smooth_union"].includes(String(opMode).toLowerCase())) {
            const nextHasZ = (nextLayer.z !== undefined) || Boolean(nextLayer.crease);
            subSdfs.push([nextSdf, Number(nextLayer.z ?? 0), nextHasZ]);
          }
          i++;
        }
        rasterizeSdfField(combinedSdf, layer, subSdfs);
      } else if (op === "line") {
        const colKey = layer.color || layer.fill || "O";
        const rgba = resolveColor(colKey);
        if (Array.isArray(layer.points) && layer.points.length >= 2) {
          for (let s = 0; s < layer.points.length - 1; s++) {
            drawBresenhamLine(
              layer.points[s][0], layer.points[s][1],
              layer.points[s + 1][0], layer.points[s + 1][1],
              layer.thickness || 1, rgba, colKey, layer.mirror || "none"
            );
          }
        } else {
          drawBresenhamLine(
            layer.x1 ?? 0, layer.y1 ?? 0,
            layer.x2 ?? 0, layer.y2 ?? 0,
            layer.thickness || 1, rgba, colKey, layer.mirror || "none"
          );
        }
      } else if (op === "curve" && Array.isArray(layer.points) && layer.points.length >= 3) {
        const colKey = layer.color || layer.fill || "O";
        const rgba = resolveColor(colKey);
        const [p0, p1, p2] = layer.points;
        const steps = 24;
        let prevX = p0[0], prevY = p0[1];
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const inv = 1 - t;
          const nx = inv * inv * p0[0] + 2 * inv * t * p1[0] + t * t * p2[0];
          const ny = inv * inv * p0[1] + 2 * inv * t * p1[1] + t * t * p2[1];
          drawBresenhamLine(prevX, prevY, nx, ny, layer.thickness || 1, rgba, colKey, layer.mirror || "none");
          prevX = nx;
          prevY = ny;
        }
      } else if ((op === "stamp" || op === "stamp_grid") && Array.isArray(layer.grid)) {
        const ox = Math.round(Number(layer.x ?? 0));
        const oy = Math.round(Number(layer.y ?? 0));
        const mirror = layer.mirror || "none";
        const stAngle = Number(layer.angle || 0);
        if (Math.abs(stAngle) > 0.5) {
          const rotPts = this.rotateStampEpx(layer.grid, stAngle);
          for (const [sx, sy, ch] of rotPts) {
            const cKey = (layer.map && layer.map[ch]) ? layer.map[ch] : ch;
            const rgba = resolveColor(cKey);
            plotPointWithMirror(ox + sx, oy + sy, 1, rgba, cKey, mirror);
          }
        } else {
          for (let sy = 0; sy < layer.grid.length; sy++) {
            const row = String(layer.grid[sy] || "");
            for (let sx = 0; sx < row.length; sx++) {
              const ch = row[sx];
              if (ch === "." || ch === " ") continue;
              const cKey = (layer.map && layer.map[ch]) ? layer.map[ch] : ch;
              const rgba = resolveColor(cKey);
              plotPointWithMirror(ox + sx, oy + sy, 1, rgba, cKey, mirror);
            }
          }
        }
      } else if (op === "pixels" && Array.isArray(layer.points)) {
        const colKey = layer.color || layer.fill || "O";
        const rgba = resolveColor(colKey);
        const mirror = layer.mirror || "none";
        for (const pt of layer.points) {
          if (Array.isArray(pt) && pt.length >= 2) {
            plotPointWithMirror(pt[0], pt[1], 1, rgba, colKey, mirror);
          }
        }
      } else if (op === "rig" && Array.isArray(layer.bones)) {
        const subRes = this.renderRig(layer, frameIndex);
        const subBuf = subRes.buffer;
        for (let sy = 0; sy < Math.min(height, subRes.height); sy++) {
          for (let sx = 0; sx < Math.min(width, subRes.width); sx++) {
            const sIdx = (sy * subRes.width + sx) * 4;
            if (subBuf[sIdx + 3] > 0) {
              blendPixel(sx, sy, [subBuf[sIdx], subBuf[sIdx + 1], subBuf[sIdx + 2], subBuf[sIdx + 3]]);
            }
          }
        }
      } else if (op === "shader" || op === "glsl") {
        const subRes = this.renderShader(layer, frameIndex);
        const subBuf = subRes.buffer;
        for (let sy = 0; sy < Math.min(height, subRes.height); sy++) {
          for (let sx = 0; sx < Math.min(width, subRes.width); sx++) {
            const sIdx = (sy * subRes.width + sx) * 4;
            if (subBuf[sIdx + 3] > 0) {
              blendPixel(sx, sy, [subBuf[sIdx], subBuf[sIdx + 1], subBuf[sIdx + 2], subBuf[sIdx + 3]]);
            }
          }
        }
      }
      i++;

    }

    let warnings = [];
    if (!spec.hideGrid && Array.isArray(spec.grid) && spec.grid.length > 0) {
      const norm = this.normalizeGrid(spec.grid, width, height, Boolean(spec.rle), spec.symmetry || "none");
      warnings = norm.warnings;
      for (let y = 0; y < height; y++) {
        const row = norm.normalized[y];
        for (let x = 0; x < width; x++) {
          const ch = row[x];
          if (ch === "." || ch === " ") continue;
          const rgba = resolveColor(ch);
          blendPixel(x, y, rgba, ch);
        }
      }
    }

    if (Array.isArray(spec.rules)) {
      this.applyCellularRules(spec.rules, width, height, symbolBuffer, buffer, resolveColor);
    }

    const symMode = spec.symmetry || "none";
    if (symMode === "horizontal" || symMode === "quad") {
      const halfW = Math.floor(width / 2);
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < halfW; x++) {
          const srcIdx = (y * width + x) * 4;
          const dstX = width - 1 - x;
          const dstIdx = (y * width + dstX) * 4;
          if (buffer[srcIdx + 3] > 0) {
            buffer[dstIdx] = buffer[srcIdx];
            buffer[dstIdx + 1] = buffer[srcIdx + 1];
            buffer[dstIdx + 2] = buffer[srcIdx + 2];
            buffer[dstIdx + 3] = buffer[srcIdx + 3];
            symbolBuffer[y * width + dstX] = symbolBuffer[y * width + x];
          }
        }
      }
    }
    if (symMode === "vertical" || symMode === "quad") {
      const halfH = Math.floor(height / 2);
      for (let y = 0; y < halfH; y++) {
        for (let x = 0; x < width; x++) {
          const srcIdx = (y * width + x) * 4;
          const dstY = height - 1 - y;
          const dstIdx = (dstY * width + x) * 4;
          if (buffer[srcIdx + 3] > 0) {
            buffer[dstIdx] = buffer[srcIdx];
            buffer[dstIdx + 1] = buffer[srcIdx + 1];
            buffer[dstIdx + 2] = buffer[srcIdx + 2];
            buffer[dstIdx + 3] = buffer[srcIdx + 3];
            symbolBuffer[dstY * width + x] = symbolBuffer[y * width + x];
          }
        }
      }
    }

    if (post.autoShading) {
      const strength = Number(post.shadingStrength ?? 0.16);
      const copy = new Uint8ClampedArray(buffer);
      const isDarkOutline = (idx) => {
        const r = copy[idx], g = copy[idx + 1], b = copy[idx + 2], a = copy[idx + 3];
        if (a < 200) return true;
        return (r + g + b) < 110;
      };
      const sameColor = (i1, i2) =>
        copy[i1] === copy[i2] && copy[i1 + 1] === copy[i2 + 1] && copy[i1 + 2] === copy[i2 + 2] && copy[i1 + 3] === copy[i2 + 3];

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = (y * width + x) * 4;
          if (copy[idx + 3] < 200 || isDarkOutline(idx)) continue;

          const upIdx = ((y - 1) * width + x) * 4;
          const leftIdx = (y * width + (x - 1)) * 4;
          const downIdx = ((y + 1) * width + x) * 4;
          const rightIdx = (y * width + (x + 1)) * 4;

          const topLeftDiff = !sameColor(idx, upIdx) && !sameColor(idx, leftIdx);
          const botRightDiff = !sameColor(idx, downIdx) && !sameColor(idx, rightIdx);

          if (topLeftDiff && !botRightDiff) {
            buffer[idx] = Math.min(255, Math.round(copy[idx] + (255 - copy[idx]) * strength));
            buffer[idx + 1] = Math.min(255, Math.round(copy[idx + 1] + (255 - copy[idx + 1]) * (strength * 1.1)));
            buffer[idx + 2] = Math.min(255, Math.round(copy[idx + 2] + (255 - copy[idx + 2]) * (strength * 0.7)));
          } else if (botRightDiff && !topLeftDiff) {
            buffer[idx] = Math.max(0, Math.round(copy[idx] * (1 - strength * 1.1)));
            buffer[idx + 1] = Math.max(0, Math.round(copy[idx + 1] * (1 - strength)));
            buffer[idx + 2] = Math.max(0, Math.round(copy[idx + 2] * (1 - strength * 0.8)));
          }
        }
      }
    }

    if (post.autoOutline) {
      const outRGBA = this.parseColor(post.outlineColor || paletteRaw["O"] || "#14182e");
      const copy = new Uint8ClampedArray(buffer);
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          if (copy[idx + 3] > 0) continue;

          const hasOpaqueNeighbor =
            (x > 0 && copy[(y * width + (x - 1)) * 4 + 3] > 180) ||
            (x < width - 1 && copy[(y * width + (x + 1)) * 4 + 3] > 180) ||
            (y > 0 && copy[((y - 1) * width + x) * 4 + 3] > 180) ||
            (y < height - 1 && copy[((y + 1) * width + x) * 4 + 3] > 180);

          if (hasOpaqueNeighbor) {
            buffer[idx] = outRGBA[0];
            buffer[idx + 1] = outRGBA[1];
            buffer[idx + 2] = outRGBA[2];
            buffer[idx + 3] = outRGBA[3];
            symbolBuffer[y * width + x] = "O";
          }
        }
      }
    }

    // Pillar 2: Compute Felzenszwalb EDT normals (and optional 3D bevel shading) for non-SDF active pixels
    const alphaMask = new Uint8Array(width * height);
    let anyActive = false;
    for (let i = 0; i < width * height; i++) {
      if (buffer[i * 4 + 3] >= 180) {
        alphaMask[i] = 1;
        anyActive = true;
      }
    }
    if (anyActive) {
      const edtSdf = this.computeEdtSdf(alphaMask, width, height);
      let maxEdt = 1.0;
      for (let i = 0; i < width * height; i++) {
        if (alphaMask[i] && -edtSdf[i] > maxEdt) maxEdt = -edtSdf[i];
      }
      const lxLight = -0.52, lyLight = -0.62, lzLight = 0.58;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          if (!alphaMask[idx] || normalBuffer[idx * 4 + 3] !== 0) continue;
          const dl = edtSdf[y * width + Math.max(0, x - 1)];
          const dr = edtSdf[y * width + Math.min(width - 1, x + 1)];
          const du = edtSdf[Math.max(0, y - 1) * width + x];
          const dd = edtSdf[Math.min(height - 1, y + 1) * width + x];
          const gx = (dr - dl) * 0.5;
          const gy = (dd - du) * 0.5;
          const gl = Math.hypot(gx, gy);
          const tD = Math.max(0.0, Math.min(1.0, -edtSdf[idx] / maxEdt));
          const slope = Math.pow(1.0 - tD, 0.85) * 0.78;
          const nx = gl > 1e-5 ? (gx / gl) * slope : 0.0;
          const ny = gl > 1e-5 ? (gy / gl) * slope : 0.0;
          const nz = Math.sqrt(Math.max(0.05, 1.0 - nx * nx - ny * ny));
          setNormalPixel(x, y, nx, ny, nz);
          if (globalSdfShading && -edtSdf[idx] > 0.6) {
            const bIdx = idx * 4;
            const r0 = buffer[bIdx], g0 = buffer[bIdx + 1], b0 = buffer[bIdx + 2], a0 = buffer[bIdx + 3];
            if ((r0 + g0 + b0) >= 110 && symbolBuffer[idx] !== "O") {
              const tones = this.deriveSdfShadingTones([r0, g0, b0, a0]);
              const toneSyms = this.registerSdfToneSymbols(symbolBuffer[idx], tones, paletteRaw, paletteRGBA);
              const bayer = BAYER_2X2[y & 1][x & 1];
              const intensity = (nx * lxLight + ny * lyLight + nz * lzLight) + bayer;
              let chosenName = "base";
              if (intensity > 0.86) chosenName = "specular";
              else if (intensity > 0.66) chosenName = "highlight";
              else if (intensity < 0.25) chosenName = "deepShadow";
              else if (intensity < 0.44) chosenName = "shadow";
              const cRGBA = tones[chosenName];
              buffer[bIdx] = cRGBA[0];
              buffer[bIdx + 1] = cRGBA[1];
              buffer[bIdx + 2] = cRGBA[2];
              symbolBuffer[idx] = toneSyms[chosenName];
            }
          }
        }
      }
    }

    const diagnostics = this.analyze(width, height, buffer);

    return {
      width,
      height,
      buffer,
      normalBuffer,
      symbolBuffer,
      resolvedPalette: paletteRaw,
      warnings,
      diagnostics
    };
  }

  static analyze(width, height, buffer) {
    let activeCount = 0;
    let sumX = 0, sumY = 0;
    let minX = width, maxX = -1, minY = height, maxY = -1;
    let clipTop = 0, clipBottom = 0, clipLeft = 0, clipRight = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const a = buffer[(y * width + x) * 4 + 3];
        if (a > 32) {
          activeCount++;
          sumX += x;
          sumY += y;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          if (a > 160) {
            if (y === 0) clipTop++;
            if (y === height - 1) clipBottom++;
            if (x === 0) clipLeft++;
            if (x === width - 1) clipRight++;
          }
        }
      }
    }

    const total = width * height;
    const fillPct = Number(((activeCount / total) * 100).toFixed(1));
    const centerX = activeCount > 0 ? Number((sumX / activeCount - (width - 1) / 2).toFixed(1)) : 0;
    const centerY = activeCount > 0 ? Number((sumY / activeCount - (height - 1) / 2).toFixed(1)) : 0;

    const clippedEdges = [];
    if (clipTop > 2) clippedEdges.push("top");
    if (clipBottom > 2) clippedEdges.push("bottom");
    if (clipLeft > 2) clippedEdges.push("left");
    if (clipRight > 2) clippedEdges.push("right");

    return {
      activePixels: activeCount,
      fillPct,
      bbox: activeCount > 0 ? [minX, minY, maxX, maxY] : [0, 0, 0, 0],
      offsetFromCenter: [centerX, centerY],
      clippedEdges
    };
  }

  static analyzeBuffer(width, height, buffer) {
    return this.analyze(width, height, buffer);
  }

  static bakeToGrid(renderResult, palette) {
    const { width, height, buffer, symbolBuffer } = renderResult;
    const resolved = palette || renderResult.resolvedPalette || {};
    if (!resolved["."]) resolved["."] = "transparent";

    const pool =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
      "!@#$%^&*()-_=+[]{}|;:,.<>?/~`" +
      "αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";

    const rgbaToSym = {};
    for (const [k, v] of Object.entries(resolved)) {
      if (k !== ".") {
        const c = this.parseColor(v);
        rgbaToSym[`${c[0]},${c[1]},${c[2]},${c[3]}`] = k;
      }
    }

    const rows = [];
    for (let y = 0; y < height; y++) {
      let rowStr = "";
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const r = buffer[idx], g = buffer[idx + 1], b = buffer[idx + 2], a = buffer[idx + 3];
        if (a === 0) {
          rowStr += ".";
          continue;
        }
        const sym = symbolBuffer[y * width + x] || ".";
        const key = `${r},${g},${b},${a}`;
        const curC = sym !== "." && resolved[sym] ? this.parseColor(resolved[sym]) : null;
        if (curC && curC[0] === r && curC[1] === g && curC[2] === b && curC[3] === a) {
          rowStr += sym;
        } else if (rgbaToSym[key]) {
          rowStr += rgbaToSym[key];
        } else {
          let newSym = "O";
          for (const ch of pool) {
            if (!resolved[ch] && ch !== ".") {
              newSym = ch;
              break;
            }
          }
          const hex = this.rgbaToHex(r, g, b, a);
          resolved[newSym] = hex;
          if (renderResult.resolvedPalette) renderResult.resolvedPalette[newSym] = hex;
          rgbaToSym[key] = newSym;
          rowStr += newSym;
        }
      }
      rows.push(rowStr);
    }
    return rows;
  }

  // ==========================================================================
  // Pillar 5: 100% LLM-Free Parametric Archetype Generator & Genome Mutator
  // ==========================================================================

  static generateArchetype(archetype = "sword", seed = 42, width = 32, height = 32) {
    const rng = new SeededRNG(seed);
    const arch = String(archetype || "sword").toLowerCase().trim();
    const w = this.clampSize(width, 32);
    const h = this.clampSize(height, 32);
    const cx = (w - 1) * 0.5;
    const cy = (h - 1) * 0.5;
    const sc = Math.min(w, h) / 32.0;
    const r1 = (v) => Math.floor(Number(v) * 10.0 + 0.5) / 10.0;
    const r2 = (v) => Math.floor(Number(v) * 100.0 + 0.5) / 100.0;

    const hueMain = rng.range(0, 360);
    const hueAcc = (hueMain + rng.choice([120, 150, 180, 210, 60])) % 360.0;
    const colMain = this.rgbaToHex(...this.oklchToRgb(rng.range(0.60, 0.74), rng.range(0.14, 0.22), hueMain));
    const colAcc = this.rgbaToHex(...this.oklchToRgb(rng.range(0.68, 0.82), rng.range(0.16, 0.24), hueAcc));
    const colSteel = this.rgbaToHex(...this.oklchToRgb(0.78, 0.04, (hueMain + 220) % 360));
    const colWood = this.rgbaToHex(...this.oklchToRgb(0.48, 0.11, 55.0));

    const spec = {
      name: `proc_${arch}_s${seed}_${w}x{h}`.replace("{h}", String(h)),
      prompt: `Procedural ${arch} (seed=${seed}, ${w}x${h}) — 100% LLM-Free PixelDSL v3.0`,
      width: w,
      height: h,
      symmetry: "none",
      rle: false,
      ramps: {
        M: { base: colMain, light: "L", dark: "D", outline: "O" },
        A: { base: colAcc, light: "W", dark: "B", outline: "O" },
        S: { base: colSteel, light: "w", dark: "d", outline: "O" },
        H: { base: colWood, light: "h", dark: "b", outline: "O" }
      },
      palette: {
        ".": "transparent",
        O: "#14182e",
        e: "#0e101c",
        w: "#ffffff",
        a: "#14182e44"
      },
      postProcess: {
        autoOutline: false,
        outlineColor: "#14182e",
        autoShading: false,
        shadingStrength: 0.16,
        sdfShading: true,
        selOut: true
      },
      layers: [],
      frames: [],
      grid: []
    };

    if (arch === "sword") {
      const bladeW = rng.range(2.8, 4.4) * sc;
      const tipW = rng.range(0.8, 1.5) * sc;
      const guardW = rng.range(5.5, 8.5) * sc;
      spec.layers = [
        { id: "shadow", op: "ellipse", cx, cy: r1(h - 3 * sc), rx: r1(6 * sc), ry: r1(1.5 * sc), fill: "a" },
        { id: "pommel", op: "ellipse", cx, cy: r1(h - 4.5 * sc), rx: r1(2.2 * sc), ry: r1(2.2 * sc), fill: "A", outline: "O", sdf: true },
        { id: "grip", op: "uneven_capsule", x1: cx, y1: r1(h - 6 * sc), x2: cx, y2: r1(h - 11 * sc), r1: r1(1.6 * sc), r2: r1(1.9 * sc), fill: "H", outline: "O", sdf: true },
        { id: "blade", op: "uneven_capsule", x1: cx, y1: r1(h - 11 * sc), x2: cx, y2: r1(4.5 * sc), r1: r1(bladeW), r2: r1(tipW), fill: "S", outline: "O", sdf: true },
        { id: "blade_tip", op: "vesica", cx, cy: r1(7.5 * sc), rx: r1(bladeW * 0.95), ry: r1(5.0 * sc), fill: "S", outline: "O", sdf: true, smoothBlend: 1.5 },
        { id: "fuller", op: "uneven_capsule", x1: cx, y1: r1(h - 12 * sc), x2: cx, y2: r1(9 * sc), r1: r1(1.0 * sc), r2: r1(0.6 * sc), fill: "M", sdf: true },
        { id: "guard", op: "vesica", cx, cy: r1(h - 11 * sc), rx: r1(guardW), ry: r1(2.2 * sc), angle: rng.range(-8, 8), fill: "A", outline: "O", sdf: true },
        { id: "gem", op: "ellipse", cx, cy: r1(h - 11 * sc), rx: r1(1.8 * sc), ry: r1(1.8 * sc), fill: "M", outline: "O", sdf: true }
      ];
      spec.motion = { type: "idle_breathe", frames: 4, amplitude: 0.8, squash: 0.04 };
    } else if (arch === "axe") {
      const headY = r1(11 * sc);
      const reach = r1(rng.range(7.5, 10.5) * sc);
      spec.layers = [
        { id: "shadow", op: "ellipse", cx, cy: r1(h - 3 * sc), rx: r1(7 * sc), ry: r1(1.5 * sc), fill: "a" },
        { id: "haft", op: "uneven_capsule", x1: cx, y1: r1(h - 4 * sc), x2: cx, y2: r1(4 * sc), r1: r1(1.8 * sc), r2: r1(2.2 * sc), fill: "H", outline: "O", sdf: true },
        { id: "blade_wing", op: "moon", cx: r1(cx - 3.5 * sc), cy: headY, r: reach, r2: r1(reach * 0.78), d: r1(reach * 0.42), angle: 180, fill: "S", outline: "O", mirror: "x", sdf: true },
        { id: "socket", op: "rect", x: r1(cx - 2.5 * sc), y: r1(headY - 3 * sc), w: r1(5 * sc), h: r1(6 * sc), rx: r1(1.5 * sc), fill: "A", outline: "O", sdf: true },
        { id: "core_gem", op: "ellipse", cx, cy: headY, rx: r1(1.8 * sc), ry: r1(2.2 * sc), fill: "M", outline: "O", sdf: true }
      ];
    } else if (arch === "shield") {
      const rxS = r1(rng.range(9.5, 11.5) * sc);
      const ryS = r1(rng.range(11.0, 12.5) * sc);
      spec.layers = [
        { id: "shadow", op: "ellipse", cx, cy: r1(h - 3 * sc), rx: r1(8 * sc), ry: r1(2 * sc), fill: "a" },
        { id: "rim", op: "vesica", cx, cy, rx: rxS, ry: ryS, fill: "S", outline: "O", sdf: true },
        { id: "field", op: "vesica", cx, cy, rx: r1(rxS - 2.2 * sc), ry: r1(ryS - 2.2 * sc), fill: "M", outline: "O", sdf: true, dither: rng.choice(["worley", "checker", "none"]), shaderScale: 6.0, seed },
        { id: "emblem", op: "star", cx, cy, r: r1(5.5 * sc), n: rng.choice([4, 5, 6]), innerRatio: 0.48, fill: "A", outline: "O", sdf: true }
      ];
    } else if (arch === "potion") {
      const bodyR = r1(rng.range(7.5, 9.5) * sc);
      const by = r1(cy + 3.5 * sc);
      spec.layers = [
        { id: "shadow", op: "ellipse", cx, cy: r1(h - 3 * sc), rx: r1(7 * sc), ry: r1(1.8 * sc), fill: "a" },
        { id: "cork", op: "rect", x: r1(cx - 2.2 * sc), y: r1(3.5 * sc), w: r1(4.4 * sc), h: r1(3.5 * sc), rx: r1(1.0 * sc), fill: "H", outline: "O", sdf: true },
        { id: "neck", op: "rect", x: r1(cx - 3.2 * sc), y: r1(6.5 * sc), w: r1(6.4 * sc), h: r1(4.5 * sc), rx: r1(1.0 * sc), fill: "S", outline: "O", sdf: true },
        { id: "flask_outer", op: "ellipse", cx, cy: by, rx: bodyR, ry: bodyR, fill: "S", outline: "O", sdf: true },
        { id: "liquid", op: "ellipse", cx, cy: r1(by + 1.0 * sc), rx: r1(bodyR - 1.6 * sc), ry: r1(bodyR - 2.0 * sc), fill: "M", outline: "O", sdf: true, dither: "voronoi", shaderScale: 4.5, seed },
        { id: "glint", op: "ellipse", cx: r1(cx - bodyR * 0.45), cy: r1(by - bodyR * 0.35), rx: r1(1.6 * sc), ry: r1(2.6 * sc), angle: -25, fill: "w" }
      ];
      spec.motion = { type: "idle_breathe", frames: 4, amplitude: 0.7, squash: 0.06 };
    } else if (arch === "gem") {
      const nSides = rng.choice([5, 6, 8]);
      spec.layers = [
        { id: "shadow", op: "ellipse", cx, cy: r1(h - 3.5 * sc), rx: r1(6.5 * sc), ry: r1(1.8 * sc), fill: "a" },
        { id: "body_gem", op: "ngon", cx, cy, r: r1(10.5 * sc), n: nSides, fill: "M", outline: "O", sdf: true, dither: "worley", shaderScale: 5.5, seed },
        { id: "inner_core", op: "star", cx, cy, r: r1(6.5 * sc), n: nSides, innerRatio: 0.62, fill: "A", outline: "O", sdf: true },
        { id: "spec", op: "ellipse", cx: r1(cx - 2.5 * sc), cy: r1(cy - 3.0 * sc), rx: r1(1.8 * sc), ry: r1(1.2 * sc), angle: -30, fill: "w" }
      ];
      spec.motion = { type: "idle_breathe", frames: 4, amplitude: 1.0, squash: 0.05 };
    } else if (arch === "slime") {
      const rxB = r1(rng.range(9.0, 10.5) * sc);
      const ryB = r1(rng.range(7.2, 8.6) * sc);
      spec.layers = [
        { id: "shadow", op: "ellipse", cx, cy: r1(h - 4 * sc), rx: r1(rxB * 1.05), ry: r1(2.2 * sc), fill: "a" },
        { id: "crown", op: "star", cx, cy: r1(cy - ryB - 1.2 * sc), r: r1(3.8 * sc), n: 5, innerRatio: 0.55, fill: "A", outline: "O", sdf: true, parent: "slime_body" },
        { id: "slime_body", op: "ellipse", cx, cy: r1(cy + 2 * sc), rx: rxB, ry: ryB, fill: "M", outline: "O", sdf: true, smoothBlend: 3.0 },
        { id: "slime_lobes", op: "ellipse", cx: r1(cx - rxB * 0.68), cy: r1(cy + 5.2 * sc), rx: r1(4.6 * sc), ry: r1(3.6 * sc), fill: "M", outline: "O", mirror: "x", sdf: true, smoothBlend: 3.0 },
        { id: "slime_top", op: "ellipse", cx, cy: r1(cy - 2.8 * sc), rx: r1(rxB * 0.62), ry: r1(4.2 * sc), fill: "M", outline: "O", sdf: true, smoothBlend: 2.5 },
        { id: "eye_l", op: "ellipse", cx: r1(cx - 3.5 * sc), cy: r1(cy + 1.0 * sc), rx: Math.max(1.0, r1(1.5 * sc)), ry: Math.max(1.2, r1(2.0 * sc)), fill: "e", mirror: "x", parent: "slime_body" },
        { id: "glint", op: "pixels", color: "w", mirror: "x", points: [[Math.round(cx - 4 * sc), Math.round(cy)]], parent: "slime_body" }
      ];
      spec.motion = { type: "idle_breathe", frames: 4, amplitude: r2(1.0 * sc), squash: 0.12 };
    } else if (arch === "beetle") {
      spec.layers = [
        { id: "shadow", op: "ellipse", cx, cy: r1(cy + 2 * sc), rx: r1(10 * sc), ry: r1(10 * sc), fill: "a" },
        { id: "mandibles", op: "moon", cx: r1(cx - 2.5 * sc), cy: r1(5.5 * sc), r: r1(3.0 * sc), r2: r1(2.2 * sc), d: r1(1.3 * sc), angle: -90, fill: "A", outline: "O", mirror: "x", sdf: true },
        { id: "leg_front", op: "bezier_sdf", points: [[r1(cx - 5 * sc), r1(cy - 4 * sc)], [r1(cx - 10 * sc), r1(cy - 7 * sc)], [r1(cx - 12 * sc), r1(cy - 11 * sc)]], r1: r1(1.4 * sc), r2: r1(0.9 * sc), fill: "H", outline: "O", mirror: "x", sdf: true },
        { id: "leg_mid", op: "bezier_sdf", points: [[r1(cx - 6 * sc), r1(cy)], [r1(cx - 11 * sc), r1(cy)], [r1(cx - 13 * sc), r1(cy - 2 * sc)]], r1: r1(1.4 * sc), r2: r1(0.9 * sc), fill: "H", outline: "O", mirror: "x", sdf: true },
        { id: "leg_back", op: "bezier_sdf", points: [[r1(cx - 5 * sc), r1(cy + 5 * sc)], [r1(cx - 10 * sc), r1(cy + 8 * sc)], [r1(cx - 12 * sc), r1(cy + 12 * sc)]], r1: r1(1.4 * sc), r2: r1(0.9 * sc), fill: "H", outline: "O", mirror: "x", sdf: true },
        { id: "thorax", op: "ellipse", cx, cy: r1(10.5 * sc), rx: r1(6.5 * sc), ry: r1(4.0 * sc), fill: "A", outline: "O", sdf: true },
        { id: "abdomen", op: "ellipse", cx, cy: r1(cy + 3.5 * sc), rx: r1(8.0 * sc), ry: r1(9.5 * sc), fill: "M", outline: "O", sdf: true, dither: "worley", shaderScale: 4.8, seed },
        { id: "seam", op: "line", x1: cx, y1: Math.round(11 * sc), x2: cx, y2: Math.round(cy + 12 * sc), thickness: 1, color: "O" }
      ];
      spec.motion = { type: "walk_cycle", frames: 4, amplitude: r2(1.0 * sc), squash: 0.05 };
    } else if (arch === "turtle") {
      spec.layers = [
        { id: "shadow", op: "ellipse", cx, cy: r1(cy + 1.5 * sc), rx: r1(11 * sc), ry: r1(11 * sc), fill: "a" },
        { id: "flipper_front", op: "vesica", cx: r1(cx - 9.5 * sc), cy: r1(cy - 4.5 * sc), rx: r1(2.8 * sc), ry: r1(5.5 * sc), angle: 55, fill: "A", outline: "O", mirror: "x", sdf: true },
        { id: "flipper_back", op: "vesica", cx: r1(cx - 7.5 * sc), cy: r1(cy + 7.5 * sc), rx: r1(2.2 * sc), ry: r1(4.2 * sc), angle: -45, fill: "A", outline: "O", mirror: "x", sdf: true },
        { id: "head", op: "ellipse", cx, cy: r1(5.5 * sc), rx: r1(3.8 * sc), ry: r1(3.8 * sc), fill: "A", outline: "O", sdf: true },
        { id: "shell_rim", op: "ellipse", cx, cy: r1(cy + 1.0 * sc), rx: r1(8.8 * sc), ry: r1(10.5 * sc), fill: "H", outline: "O", sdf: true },
        { id: "shell_dome", op: "ellipse", cx, cy: r1(cy + 1.0 * sc), rx: r1(7.5 * sc), ry: r1(9.0 * sc), fill: "M", outline: "O", sdf: true, dither: "worley", shaderScale: 5.2, seed },
        { id: "eyes", op: "pixels", color: "e", mirror: "x", points: [[Math.round(cx - 2.5 * sc), Math.round(4.0 * sc)]] }
      ];
      spec.motion = { type: "swim_cycle", frames: 4, amplitude: r2(1.0 * sc), squash: 0.04 };
    } else if (arch === "bunny") {
      spec.layers = [
        { id: "shadow", op: "ellipse", cx, cy: r1(h - 3.5 * sc), rx: r1(8.5 * sc), ry: r1(1.5 * sc), fill: "a" },
        { id: "ear_back", op: "uneven_capsule", x1: r1(cx + 1 * sc), y1: r1(cy - 3 * sc), x2: r1(cx - 2 * sc), y2: r1(5.5 * sc), r1: r1(2.1 * sc), r2: r1(1.4 * sc), fill: "A", outline: "O", sdf: true, parent: "body" },
        { id: "tail", op: "ellipse", cx: r1(cx - 9.0 * sc), cy: r1(cy + 4.5 * sc), rx: r1(2.6 * sc), ry: r1(2.6 * sc), fill: "S", outline: "O", sdf: true, parent: "body" },
        { id: "body", op: "ellipse", cx, cy: r1(cy + 4.5 * sc), rx: r1(6.2 * sc), ry: r1(5.0 * sc), angle: -8, fill: "S", outline: "O", sdf: true, smoothBlend: 2.0, z: 1 },
        { id: "thigh", op: "ellipse", cx: r1(cx - 4.5 * sc), cy: r1(cy + 5.5 * sc), rx: r1(4.8 * sc), ry: r1(3.8 * sc), angle: -10, fill: "S", outline: "O", sdf: true, smoothBlend: 1.8, z: 2, crease: true, parent: "body" },
        { id: "head", op: "ellipse", cx: r1(cx + 4.5 * sc), cy: r1(cy - 1.0 * sc), rx: r1(4.8 * sc), ry: r1(4.5 * sc), fill: "S", outline: "O", sdf: true, smoothBlend: 1.6, z: 1, parent: "body" },
        { id: "ear_front", op: "uneven_capsule", x1: r1(cx + 3.5 * sc), y1: r1(cy - 3 * sc), x2: r1(cx + 1.0 * sc), y2: r1(5.5 * sc), r1: r1(2.2 * sc), r2: r1(1.5 * sc), fill: "S", outline: "O", sdf: true, smoothBlend: 1.4, z: 2, crease: true, parent: "body" },
        { id: "eye", op: "ellipse", cx: r1(cx + 6.5 * sc), cy: r1(cy - 2.0 * sc), rx: Math.max(1.0, r1(1.3 * sc)), ry: Math.max(1.2, r1(1.6 * sc)), fill: "e", parent: "body" }
      ];
      spec.motion = { type: "jump_arc", frames: 4, amplitude: r2(1.0 * sc), squash: 0.10 };
    } else if (arch === "crystal_monolith") {
      spec.layers = [
        { id: "shadow", op: "ellipse", cx, cy: r1(h - 3.5 * sc), rx: r1(9.0 * sc), ry: r1(2.0 * sc), fill: "a" },
        { id: "pedestal", op: "rect", x: r1(cx - 6.5 * sc), y: r1(h - 8.5 * sc), w: r1(13 * sc), h: r1(4.0 * sc), rx: r1(1.0 * sc), fill: "H", outline: "O", sdf: true },
        { id: "monolith_body", op: "vesica", cx, cy: r1(cy - 1.5 * sc), rx: r1(5.2 * sc), ry: r1(10.5 * sc), fill: "M", outline: "O", sdf: true, dither: "worley", shaderScale: 5.5, seed },
        { id: "shard_orbit", op: "vesica", cx: r1(cx - 8.5 * sc), cy, rx: r1(2.0 * sc), ry: r1(4.5 * sc), angle: -18, fill: "A", outline: "O", mirror: "x", sdf: true },
        { id: "core_star", op: "star", cx, cy: r1(cy - 1.5 * sc), r: r1(3.8 * sc), n: 4, innerRatio: 0.45, fill: "w", outline: "O", sdf: true }
      ];
      spec.motion = { type: "idle_breathe", frames: 4, amplitude: r2(1.0 * sc), squash: 0.04 };
    } else if (arch === "spaceship") {
      spec.layers = [
        { id: "wings", op: "polygon", points: [[cx, r1(6 * sc)], [r1(cx - 12 * sc), r1(cy + 6 * sc)], [r1(cx - 10 * sc), r1(h - 5 * sc)], [cx, r1(cy + 4 * sc)]], fill: "S", outline: "O", mirror: "x", sdf: true },
        { id: "thrusters", op: "rect", x: r1(cx - 6.5 * sc), y: r1(h - 7.5 * sc), w: r1(3.5 * sc), h: r1(4 * sc), rx: r1(1.0 * sc), fill: "A", outline: "O", mirror: "x", sdf: true },
        { id: "hull", op: "vesica", cx, cy, rx: r1(5.2 * sc), ry: r1(11.5 * sc), fill: "M", outline: "O", sdf: true },
        { id: "cockpit", op: "vesica", cx, cy: r1(cy - 1.5 * sc), rx: r1(2.6 * sc), ry: r1(5.0 * sc), fill: "A", outline: "O", sdf: true }
      ];
      spec.motion = { type: "idle_breathe", frames: 4, amplitude: r2(0.8 * sc), squash: 0.03 };
    } else {
      const padB = Math.max(1.5, r1(2.5 * sc));
      spec.layers = [
        { id: "block_base", op: "rect", x: padB, y: padB, w: r1(w - 2 * padB), h: r1(h - 2 * padB), rx: r1(2.5 * sc), fill: "M", outline: "O", sdf: true, dither: "worley", shaderScale: 6.0, seed },
        { id: "moss_cap", op: "ellipse", cx, cy: Math.max(2.5, r1(6.5 * sc)), rx: r1(9.5 * sc), ry: r1(3.5 * sc), fill: "A", outline: "O", sdf: true, domainWarp: { amp: r2(1.4 * sc), freq: 0.25, seed } }
      ];
      spec.rules = [
        { type: "bottom_drip", target: "A", replace: "A", length: Math.max(1, Math.round(2 * sc)), prob: 0.45, seed }
      ];
    }

    return spec;
  }

  static mutateSpec(specInput, seed = 101, rate = 0.25) {
    const rng = new SeededRNG(seed);
    const child = JSON.parse(JSON.stringify(specInput || {}));
    const w = this.clampSize(child.width, 32);
    const h = this.clampSize(child.height, 32);
    const r1 = (v) => Math.floor(Number(v) * 10.0 + 0.5) / 10.0;
    child.name = String(child.name || "sprite").replace(/_mut\d+$/, "") + `_mut${seed}`;

    const jitterHex = (hexStr) => {
      const rgba = this.parseColor(hexStr);
      if (rgba[3] === 0) return hexStr;
      const [L, C, hue] = this.rgbToOklch(rgba[0], rgba[1], rgba[2]);
      if (C < 0.02 && L > 0.9) return hexStr;
      const lNew = Math.max(0.15, Math.min(0.95, L + rng.range(-0.08, 0.08) * rate));
      const cNew = Math.max(0.0, Math.min(0.28, C + rng.range(-0.05, 0.06) * rate));
      const hNew = (hue + rng.range(-55.0, 55.0) * rate + 360.0) % 360.0;
      const [nr, ng, nb] = this.oklchToRgb(lNew, cNew, hNew);
      return this.rgbaToHex(nr, ng, nb, rgba[3]);
    };

    if (child.ramps && typeof child.ramps === "object") {
      for (const [k, cfg] of Object.entries(child.ramps)) {
        if (typeof cfg === "string") {
          child.ramps[k] = jitterHex(cfg);
        } else if (cfg && typeof cfg === "object" && cfg.base) {
          cfg.base = jitterHex(cfg.base);
        }
      }
    }

    if (child.palette && typeof child.palette === "object") {
      for (const [k, col] of Object.entries(child.palette)) {
        if (![".", " ", "O", "w", "e"].includes(k) && typeof col === "string" && col.startsWith("#")) {
          child.palette[k] = jitterHex(col);
        }
      }
    }

    const shaders = ["none", "worley", "voronoi", "turing", "scales", "bayer4x4", "checker"];
    if (Array.isArray(child.layers)) {
      for (const lyr of child.layers) {
        if (!lyr || typeof lyr !== "object") continue;
        for (const prop of ["rx", "ry", "r", "r1", "r2", "w", "h"]) {
          if (typeof lyr[prop] === "number" && lyr[prop] >= 2) {
            const delta = lyr[prop] * rng.range(-0.22, 0.22) * rate;
            lyr[prop] = r1(Math.max(1.0, Math.min(Math.max(w, h) * 0.44, lyr[prop] + delta)));
          }
        }
        if (typeof lyr.smoothBlend === "number" && lyr.smoothBlend > 0) {
          lyr.smoothBlend = r1(Math.max(0.5, lyr.smoothBlend + rng.range(-1.2, 1.2) * rate));
        }
        if (lyr.dither && rng.nextFloat() < rate * 0.65) {
          lyr.dither = rng.choice(shaders);
          lyr.seed = seed;
        }
      }
    }

    return child;
  }
}

if (typeof window !== "undefined") {
  window.BUILTIN_PALETTES = BUILTIN_PALETTES;
  window.PixelDSLRenderer = PixelDSLRenderer;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { BUILTIN_PALETTES, PixelDSLRenderer };
}
