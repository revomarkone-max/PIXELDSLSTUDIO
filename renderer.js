// PixelDSL Engine v2.5: Parser, SDF Smooth Union (Metaballs), 3D Heightmap Normal Shading, Auto-Ramps, Layers, and Sprite Sheets

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

// 2x2 Bayer matrix for crisp pixel-art tonal transitions in SDF 3D shading
const BAYER_2X2 = [
  [-0.06,  0.02],
  [ 0.06, -0.02]
];

class PixelDSLRenderer {
  static clampSize(val, fallback = 32) {
    const n = parseInt(val, 10);
    if (isNaN(n)) return fallback;
    return Math.max(8, Math.min(128, n));
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
    if (a === 0) return "transparent";
    if (a < 255) return `#${toH(r)}${toH(g)}${toH(b)}${toH(a)}`;
    return `#${toH(r)}${toH(g)}${toH(b)}`;
  }

  // Generate pixel-art tonal ramp (warm-shifted highlight, cool-shifted shadow, deep tinted outline)
  static generateColorRamp(baseHex) {
    const [r, g, b, a] = this.parseColor(baseHex);
    const light = this.rgbaToHex(
      Math.min(255, r + (255 - r) * 0.35 + 12),
      Math.min(255, g + (255 - g) * 0.38 + 14),
      Math.min(255, b + (255 - b) * 0.18),
      a
    );
    const dark = this.rgbaToHex(
      Math.max(0, r * 0.62 - 6),
      Math.max(0, g * 0.66 - 4),
      Math.max(0, Math.min(255, b * 0.78 + 10)),
      a
    );
    const outline = this.rgbaToHex(
      Math.max(8, r * 0.22),
      Math.max(10, g * 0.22),
      Math.max(22, Math.min(255, b * 0.34 + 14)),
      255
    );
    return { base: baseHex, light, dark, outline };
  }

  // Derive 4 discrete RGBA tones from a single RGBA color for SDF 3D Volume Shading
  static deriveSdfShadingTones(baseRGBA) {
    const [r, g, b, a] = baseRGBA;
    const deepShadow = [
      Math.max(0, Math.round(r * 0.56 - 6)),
      Math.max(0, Math.round(g * 0.60 - 4)),
      Math.max(0, Math.min(255, Math.round(b * 0.74 + 12))),
      a
    ];
    const shadow = [
      Math.max(0, Math.round(r * 0.76 - 3)),
      Math.max(0, Math.round(g * 0.79 - 2)),
      Math.max(0, Math.min(255, Math.round(b * 0.88 + 6))),
      a
    ];
    const base = [r, g, b, a];
    const highlight = [
      Math.min(255, Math.round(r + (255 - r) * 0.30 + 10)),
      Math.min(255, Math.round(g + (255 - g) * 0.34 + 12)),
      Math.min(255, Math.round(b + (255 - b) * 0.16)),
      a
    ];
    const specular = [
      Math.min(255, Math.round(r + (255 - r) * 0.62 + 18)),
      Math.min(255, Math.round(g + (255 - g) * 0.65 + 18)),
      Math.min(255, Math.round(b + (255 - b) * 0.45 + 8)),
      a
    ];
    return { deepShadow, shadow, base, highlight, specular };
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
          if (cfg.light) merged[cfg.light] = ramp.light;
          if (cfg.dark) merged[cfg.dark] = ramp.dark;
          if (cfg.outline) merged[cfg.outline] = ramp.outline;
        }
      }
    }
    return merged;
  }

  static expandRLE(rowStr) {
    return rowStr.replace(/(\d+)(.)/g, (_, count, ch) => ch.repeat(Math.min(256, parseInt(count, 10))));
  }

  static normalizeGrid(grid, width, height, useRLE = false, symmetry = "none") {
    const warnings = [];
    const normalized = [];
    const rows = Array.isArray(grid) ? grid : [];

    for (let y = 0; y < height; y++) {
      let raw = y < rows.length ? String(rows[y] || "") : "";
      if (useRLE) {
        raw = this.expandRLE(raw);
      }
      if (symmetry === "horizontal" && raw.length === Math.floor(width / 2) && raw.length > 0) {
        const reversed = raw.split("").reverse().join("");
        raw = raw + reversed;
      }

      if (y < rows.length && raw.length !== width) {
        warnings.push(`Row ${y + 1}: length ${raw.length} != ${width}`);
      }

      if (raw.length < width) {
        raw = raw.padEnd(width, ".");
      } else if (raw.length > width) {
        raw = raw.slice(0, width);
      }
      normalized.push(raw);
    }

    if (rows.length > 0 && rows.length !== height) {
      warnings.push(`Grid rows: ${rows.length} != ${height}`);
    }

    return { normalized, warnings };
  }

  static checkDither(pattern, x, y) {
    if (!pattern || pattern === "none") return false;
    if (pattern === "checker") return (x + y) % 2 === 1;
    if (pattern === "sparse") return (x % 2 === 0) && (y % 2 === 0);
    if (pattern === "grid") return (x % 3 === 0) || (y % 3 === 0);
    if (pattern === "scales") {
      const row = Math.floor(y / 3);
      const offset = (row % 2) * 2;
      const lx = (x + offset) % 4;
      const ly = y % 3;
      return (ly === 2 && (lx === 1 || lx === 2)) || (ly === 1 && lx === 0);
    }
    return false;
  }

  // Polynomial Smooth Minimum for SDF Metaball blending
  static smin(a, b, k) {
    if (!k || k <= 0) return Math.min(a, b);
    const h = Math.max(k - Math.abs(a - b), 0.0) / k;
    return Math.min(a, b) - h * h * k * 0.25;
  }

  // Compute exact 2D Signed Distance Field (negative inside, positive outside) for a shape layer
  static computeLayerSDF(layer, width, height) {
    const op = (layer.op || "").toLowerCase();
    const sdf = new Float32Array(width * height).fill(1e4);

    if (op === "ellipse") {
      const cx = Number(layer.cx ?? width / 2);
      const cy = Number(layer.cy ?? height / 2);
      const rx = Math.max(0.5, Number(layer.rx ?? 4));
      const ry = Math.max(0.5, Number(layer.ry ?? 4));
      const rad = ((Number(layer.angle) || 0) * Math.PI) / 180;
      const cosA = Math.cos(-rad);
      const sinA = Math.sin(-rad);
      const scale = Math.min(rx, ry);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - cx;
          const dy = y - cy;
          const lx = dx * cosA - dy * sinA;
          const ly = dx * sinA + dy * cosA;
          const q = Math.sqrt((lx * lx) / (rx * rx) + (ly * ly) / (ry * ry));
          sdf[y * width + x] = (q - 1.0) * scale;
        }
      }
    } else if (op === "rect") {
      const x0 = Number(layer.x ?? 0);
      const y0 = Number(layer.y ?? 0);
      const w = Math.max(1, Number(layer.w ?? 4));
      const h = Math.max(1, Number(layer.h ?? 4));
      const r = Math.max(0, Number(layer.rx ?? 0));
      const cx = x0 + (w - 1) * 0.5;
      const cy = y0 + (h - 1) * 0.5;
      const bx = Math.max(0.1, w * 0.5 - r);
      const by = Math.max(0.1, h * 0.5 - r);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const qx = Math.abs(x - cx) - bx;
          const qy = Math.abs(y - cy) - by;
          const outDist = Math.sqrt(Math.max(qx, 0) ** 2 + Math.max(qy, 0) ** 2);
          const inDist = Math.min(Math.max(qx, qy), 0);
          sdf[y * width + x] = outDist + inDist - r;
        }
      }
    } else if (op === "polygon" && Array.isArray(layer.points) && layer.points.length >= 3) {
      const pts = layer.points;
      const n = pts.length;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let inside = false;
          let minDistSq = 1e9;
          for (let i = 0, j = n - 1; i < n; j = i++) {
            const xi = pts[i][0], yi = pts[i][1];
            const xj = pts[j][0], yj = pts[j][1];
            const vx = xj - xi, vy = yj - yi;
            const wx = x - xi, wy = y - yi;
            const lenSq = vx * vx + vy * vy || 1e-7;
            const t = Math.max(0, Math.min(1, (wx * vx + wy * vy) / lenSq));
            const dx = wx - vx * t;
            const dy = wy - vy * t;
            minDistSq = Math.min(minDistSq, dx * dx + dy * dy);

            const intersect = ((yi > y) !== (yj > y)) &&
              (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-7) + xi);
            if (intersect) inside = !inside;
          }
          const dist = Math.sqrt(minDistSq);
          sdf[y * width + x] = inside ? -dist : dist;
        }
      }
    }

    // Apply mirror with optional smooth blend across symmetry axes
    const mirror = layer.mirror || "none";
    const smoothK = Number(layer.smoothBlend || 0);
    if (mirror !== "none") {
      const mirrored = new Float32Array(sdf);
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

  static applyFrameOverrides(spec, frameIndex = 0) {
    const frames = Array.isArray(spec.frames) ? spec.frames : [];
    if (frameIndex <= 0 || frameIndex > frames.length) {
      return spec;
    }
    const frameDef = frames[frameIndex - 1] || {};
    const cloned = JSON.parse(JSON.stringify(spec));

    if (Array.isArray(frameDef.grid) && frameDef.grid.length > 0) {
      cloned.grid = frameDef.grid;
    }

    const layerMods = frameDef.layers || frameDef.overrides || {};
    if (Array.isArray(cloned.layers) && layerMods && typeof layerMods === "object") {
      cloned.layers = cloned.layers
        .map((layer) => {
          const id = layer.id;
          if (!id || !layerMods[id]) return layer;
          const mod = layerMods[id];
          if (mod.hidden) return null;
          const updated = Object.assign({}, layer, mod);
          if (typeof mod.dx === "number") {
            if (typeof updated.cx === "number") updated.cx += mod.dx;
            if (typeof updated.x === "number") updated.x += mod.dx;
            if (typeof updated.x1 === "number") { updated.x1 += mod.dx; updated.x2 += mod.dx; }
            if (Array.isArray(updated.points)) {
              updated.points = updated.points.map((pt) => [pt[0] + mod.dx, pt[1]]);
            }
          }
          if (typeof mod.dy === "number") {
            if (typeof updated.cy === "number") updated.cy += mod.dy;
            if (typeof updated.y === "number") updated.y += mod.dy;
            if (typeof updated.y1 === "number") { updated.y1 += mod.dy; updated.y2 += mod.dy; }
            if (Array.isArray(updated.points)) {
              updated.points = updated.points.map((pt) => [pt[0], pt[1] + mod.dy]);
            }
          }
          if (typeof mod.dAngle === "number") {
            updated.angle = (Number(updated.angle) || 0) + mod.dAngle;
          }
          if (typeof mod.drx === "number" && typeof updated.rx === "number") {
            updated.rx = Math.max(1, updated.rx + mod.drx);
          }
          if (typeof mod.dry === "number" && typeof updated.ry === "number") {
            updated.ry = Math.max(1, updated.ry + mod.dry);
          }
          return updated;
        })
        .filter(Boolean);
    }

    return cloned;
  }

  static render(specInput, frameIndex = 0) {
    const spec = this.applyFrameOverrides(specInput || {}, frameIndex);
    const width = this.clampSize(spec.width || (spec.size && spec.size[0]), 32);
    const height = this.clampSize(spec.height || (spec.size && spec.size[1]), 32);
    const paletteRaw = this.resolveFullPalette(spec);
    const post = spec.postProcess || {};
    const globalSdfShading = Boolean(post.sdfShading);

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
    const symbolBuffer = new Array(width * height).fill(".");

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
      if (sym) {
        symbolBuffer[iy * width + ix] = sym;
      }
    };

    // Rasterize a 2D SDF field with optional 3D Heightmap Normal Lighting & quantized pixel-art bands
    const rasterizeSdfField = (sdfField, layer) => {
      const fullMask = new Uint8Array(width * height);
      let maxDepth = 1.0;
      for (let i = 0; i < width * height; i++) {
        if (sdfField[i] <= 0.0) {
          fullMask[i] = 1;
          if (-sdfField[i] > maxDepth) maxDepth = -sdfField[i];
        }
      }

      const fillRGBA = resolveColor(layer.fill);
      const outlineRGBA = layer.outline ? resolveColor(layer.outline) : null;
      const ditherRGBA = layer.ditherColor ? resolveColor(layer.ditherColor) : fillRGBA;
      const ditherMode = layer.dither || "none";
      const useSdf3D = Boolean(layer.sdf || globalSdfShading) && fillRGBA[3] >= 200;

      // Precompute 3D heightmap z(x, y) if SDF 3D shading is enabled
      let heightField = null;
      let tones = null;
      if (useSdf3D) {
        tones = this.deriveSdfShadingTones(fillRGBA);
        heightField = new Float32Array(width * height);
        for (let i = 0; i < width * height; i++) {
          if (fullMask[i]) {
            const t = Math.max(0, Math.min(1, -sdfField[i] / maxDepth));
            // Spherical dome profile: z = sqrt(1 - (1 - t)^2) * maxDepth
            heightField[i] = Math.sqrt(Math.max(0, 1 - (1 - t) * (1 - t))) * maxDepth;
          }
        }
      }

      // Light vector from top-left-front: L = normalize(-0.52, -0.62, 0.58)
      const lx = -0.52, ly = -0.62, lz = 0.58;

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

          if (outlineRGBA && outlineRGBA[3] > 0 && isEdge) {
            blendPixel(x, y, outlineRGBA, layer.outline);
          } else if (fillRGBA[3] > 0) {
            if (useSdf3D && heightField) {
              const zL = x > 0 ? heightField[y * width + (x - 1)] : 0;
              const zR = x < width - 1 ? heightField[y * width + (x + 1)] : 0;
              const zU = y > 0 ? heightField[(y - 1) * width + x] : 0;
              const zD = y < height - 1 ? heightField[(y + 1) * width + x] : 0;

              let nx = -(zR - zL) * 0.65;
              let ny = -(zD - zU) * 0.65;
              let nz = 1.0;
              const invLen = 1.0 / Math.sqrt(nx * nx + ny * ny + nz * nz);
              nx *= invLen; ny *= invLen; nz *= invLen;

              // Lambertian + Bayer 2x2 dither offset
              const bayer = BAYER_2X2[y & 1][x & 1];
              const intensity = (nx * lx + ny * ly + nz * lz) + bayer;

              let chosenRGBA = tones.base;
              if (intensity > 0.86) chosenRGBA = tones.specular;
              else if (intensity > 0.66) chosenRGBA = tones.highlight;
              else if (intensity < 0.25) chosenRGBA = tones.deepShadow;
              else if (intensity < 0.44) chosenRGBA = tones.shadow;

              // Optional explicit dither pattern overlay on top of SDF volume
              if (ditherMode !== "none" && this.checkDither(ditherMode, x, y)) {
                chosenRGBA = ditherRGBA;
              }
              blendPixel(x, y, chosenRGBA, layer.fill);
            } else {
              const useDither = this.checkDither(ditherMode, x, y);
              blendPixel(
                x,
                y,
                useDither ? ditherRGBA : fillRGBA,
                useDither ? (layer.ditherColor || layer.fill) : layer.fill
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
      const op = layer.op.toLowerCase();

      if (op === "ellipse" || op === "rect" || op === "polygon") {
        let combinedSdf = this.computeLayerSDF(layer, width, height);
        // Check if subsequent layers have smoothBlend > 0 and same fill/group to metaball-merge them!
        while (
          i + 1 < layers.length &&
          layers[i + 1] &&
          !layers[i + 1].hidden &&
          ["ellipse", "rect", "polygon"].includes((layers[i + 1].op || "").toLowerCase()) &&
          Number(layers[i + 1].smoothBlend) > 0 &&
          layers[i + 1].fill === layer.fill
        ) {
          const nextLayer = layers[i + 1];
          const nextSdf = this.computeLayerSDF(nextLayer, width, height);
          const k = Number(nextLayer.smoothBlend);
          for (let p = 0; p < width * height; p++) {
            combinedSdf[p] = this.smin(combinedSdf[p], nextSdf[p], k);
          }
          i++;
        }
        rasterizeSdfField(combinedSdf, layer);
      } else if (op === "line") {
        const rgba = resolveColor(layer.color || layer.fill || "O");
        drawBresenhamLine(
          layer.x1 ?? 0, layer.y1 ?? 0,
          layer.x2 ?? 0, layer.y2 ?? 0,
          layer.thickness || 1,
          rgba,
          layer.color || layer.fill || "O",
          layer.mirror || "none"
        );
      } else if (op === "curve" && Array.isArray(layer.points) && layer.points.length >= 3) {
        const rgba = resolveColor(layer.color || layer.fill || "O");
        const [p0, p1, p2] = layer.points;
        const steps = 24;
        let prevX = p0[0], prevY = p0[1];
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const inv = 1 - t;
          const nx = inv * inv * p0[0] + 2 * inv * t * p1[0] + t * t * p2[0];
          const ny = inv * inv * p0[1] + 2 * inv * t * p1[1] + t * t * p2[1];
          drawBresenhamLine(
            prevX, prevY, nx, ny,
            layer.thickness || 1,
            rgba,
            layer.color || layer.fill || "O",
            layer.mirror || "none"
          );
          prevX = nx;
          prevY = ny;
        }
      } else if ((op === "stamp" || op === "stamp_grid") && Array.isArray(layer.grid)) {
        const ox = Math.round(Number(layer.x ?? 0));
        const oy = Math.round(Number(layer.y ?? 0));
        const mirror = layer.mirror || "none";
        for (let sy = 0; sy < layer.grid.length; sy++) {
          const row = String(layer.grid[sy] || "");
          for (let sx = 0; sx < row.length; sx++) {
            const ch = row[sx];
            if (ch === "." || ch === " ") continue;
            const cKey = (layer.map && layer.map[ch]) ? layer.map[ch] : ch;
            const rgba = resolveColor(cKey);
            plotPointWithMirror(ox + sx, oy + sy, 1, rgba, ch, mirror);
          }
        }
      } else if (op === "pixels" && Array.isArray(layer.points)) {
        const rgba = resolveColor(layer.color || layer.fill || "O");
        const mirror = layer.mirror || "none";
        for (const pt of layer.points) {
          if (Array.isArray(pt) && pt.length >= 2) {
            plotPointWithMirror(pt[0], pt[1], 1, rgba, layer.color || "O", mirror);
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

    const diagnostics = this.analyze(width, height, buffer);

    return {
      width,
      height,
      buffer,
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

  static getFrameCount(spec) {
    const extra = Array.isArray(spec && spec.frames) ? spec.frames.length : 0;
    return 1 + extra;
  }

  static bakeToGrid(renderResult, palette) {
    const { width, height, symbolBuffer } = renderResult;
    const rows = [];
    for (let y = 0; y < height; y++) {
      let rowStr = "";
      for (let x = 0; x < width; x++) {
        const sym = symbolBuffer[y * width + x] || ".";
        rowStr += palette[sym] ? sym : ".";
      }
      rows.push(rowStr);
    }
    return rows;
  }
}

window.BUILTIN_PALETTES = BUILTIN_PALETTES;
window.PixelDSLRenderer = PixelDSLRenderer;
