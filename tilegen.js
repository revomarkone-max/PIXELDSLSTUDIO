// tilegen.js - seamless (toroidal) terrain tile generator for PixelDSL.
// Exact port of tilegen.py: same hash, same noise, same draw order, so the
// web studio and the Python CLI produce identical grids. Only integer hashing
// and + - * / float ops are used (no Math.sin/pow) to keep results bit-equal.
(function (root) {
  "use strict";

  const MATERIALS = ["grass", "dirt", "sand", "stone", "water"];

  const ALIASES = {
    grass: "grass", grass_tile: "grass", tile_grass: "grass",
    dirt: "dirt", dirt_tile: "dirt", tile_dirt: "dirt", earth: "dirt",
    sand: "sand", sand_tile: "sand", tile_sand: "sand",
    stone: "stone", stone_tile: "stone", tile_stone: "stone", flagstone: "stone",
    water: "water", water_tile: "water", tile_water: "water"
  };

  const PALETTES = {
    grass: { "0": "#1f4a2c", "1": "#2b6233", "2": "#3a7a3a", "3": "#4f9443", "4": "#74b052",
             y: "#f0d35a", f: "#eef0e2", k: "#18381f" },
    dirt: { "0": "#3a2618", "1": "#4f3420", "2": "#634229", "3": "#785334",
            p: "#8b847a", q: "#b3ab9c", k: "#24170e" },
    sand: { "0": "#b0844c", "1": "#c39857", "2": "#d4ab68", "3": "#e2bf7f", "4": "#f0d7a2" },
    stone: { m: "#262a35", "0": "#4a5160", "1": "#5a6273", "2": "#6b7486", "3": "#7f8899",
             "4": "#99a2b2", v: "#4b6f38", k: "#363b47" },
    water: { "0": "#1c3a66", "1": "#22487d", "2": "#2a5895", "3": "#3770ad", "4": "#6aa6d6",
             f: "#d8eef8" }
  };

  const BAYER4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];

  const mod = (a, n) => ((a % n) + n) % n;

  // 32-bit integer hash -> float in [0, 1). Mirrors tilegen.ihash.
  function ihash(x, y, s) {
    let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 1442695041)) >>> 0;
    h = Math.imul((h ^ (h >>> 13)) >>> 0, 1274126177) >>> 0;
    h = (h ^ (h >>> 16)) >>> 0;
    return h / 4294967296.0;
  }

  const smooth = (t) => t * t * (3.0 - 2.0 * t);

  function periodicNoise(x, y, w, h, cells, seed) {
    const cx = cells;
    const cy = Math.max(1, Math.floor((cells * h + Math.floor(w / 2)) / w));
    const gx = x * cx / w;
    const gy = y * cy / h;
    const ix = Math.trunc(gx);
    const iy = Math.trunc(gy);
    const fx = smooth(gx - ix);
    const fy = smooth(gy - iy);
    const x0 = ix % cx, x1 = (ix + 1) % cx, y0 = iy % cy, y1 = (iy + 1) % cy;
    const a = ihash(x0, y0, seed), b = ihash(x1, y0, seed);
    const c = ihash(x0, y1, seed), d = ihash(x1, y1, seed);
    const top = a + (b - a) * fx;
    const bot = c + (d - c) * fx;
    return top + (bot - top) * fy;
  }

  function fbm(x, y, w, h, seed, baseCells) {
    const n1 = periodicNoise(x, y, w, h, baseCells, seed);
    const n2 = periodicNoise(x, y, w, h, baseCells * 2, seed + 101);
    const n3 = periodicNoise(x, y, w, h, baseCells * 4, seed + 202);
    return (n1 * 0.6 + n2 * 0.28 + n3 * 0.12);
  }

  const frac = (v) => (v >= 0 ? v - Math.trunc(v) : v - Math.trunc(v) + 1.0);

  function tone(v, levels, x, y, spread) {
    const d = (BAYER4[y & 3][x & 3] + 0.5) / 16.0 - 0.5;
    let t = Math.trunc((v + d * spread) * levels);
    if (t < 0) t = 0;
    if (t > levels - 1) t = levels - 1;
    return t;
  }

  const baseCells = (w) => Math.max(2, Math.floor(w / 8));
  const makeGrid = (w, h, ch) => Array.from({ length: h }, () => new Array(w).fill(ch));

  function genGrass(w, h, seed) {
    const g = makeGrid(w, h, "2");
    const bc = baseCells(w);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const v = fbm(x, y, w, h, seed, bc);
        g[y][x] = "123"[tone(v * 1.1 - 0.05, 3, x, y, 0.2)];
      }
    }
    const nBlades = Math.floor((w * h) / 9);
    for (let i = 0; i < nBlades; i++) {
      const bx = Math.floor(ihash(i, 1, seed) * w);
      const by = Math.floor(ihash(i, 2, seed) * h);
      const tall = ihash(i, 3, seed) < 0.55 ? 2 : 3;
      let lean = 0;
      const r = ihash(i, 4, seed);
      if (r < 0.2) lean = -1;
      else if (r > 0.8) lean = 1;
      g[(by + 1) % h][bx] = "0";
      for (let k = 0; k < tall; k++) {
        const px = mod(bx + (k === tall - 1 ? lean : 0), w);
        const py = mod(by - k, h);
        g[py][px] = k === tall - 1 ? "4" : "3";
      }
    }
    const nFlowers = Math.floor(ihash(7, 7, seed) * 4);
    for (let i = 0; i < nFlowers; i++) {
      const fx = Math.floor(ihash(i, 11, seed) * w);
      const fy = Math.floor(ihash(i, 12, seed) * h);
      g[fy][fx] = ihash(i, 13, seed) < 0.6 ? "y" : "f";
      g[(fy + 1) % h][fx] = "k";
    }
    return g;
  }

  function genDirt(w, h, seed) {
    const g = makeGrid(w, h, "1");
    const bc = baseCells(w);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const v = fbm(x, y, w, h, seed, bc);
        g[y][x] = "0123"[tone(v * 1.15 - 0.07, 4, x, y, 0.4)];
      }
    }
    const nSpecks = Math.floor((w * h) / 40);
    for (let i = 0; i < nSpecks; i++) {
      g[Math.floor(ihash(i, 22, seed) * h)][Math.floor(ihash(i, 21, seed) * w)] = "k";
    }
    const nPebbles = Math.max(2, Math.floor((w * h) / 170));
    for (let i = 0; i < nPebbles; i++) {
      const px = Math.floor(ihash(i, 31, seed) * w);
      const py = Math.floor(ihash(i, 32, seed) * h);
      const ph = ihash(i, 33, seed) < 0.4 ? 2 : 1;
      for (let dy = 0; dy < ph; dy++) {
        for (let dx = 0; dx < 2; dx++) g[(py + dy) % h][(px + dx) % w] = "p";
      }
      g[py][px] = "q";
      for (let dx = 0; dx < 2; dx++) g[(py + ph) % h][(px + dx) % w] = "k";
    }
    return g;
  }

  function genSand(w, h, seed) {
    const g = makeGrid(w, h, "2");
    const bc = baseCells(w);
    const ripples = Math.max(2, Math.floor(h / 10));
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const v = fbm(x, y, w, h, seed, bc);
        const warp = periodicNoise(x, y, w, h, 2, seed + 7);
        const r = frac(y * ripples / h + warp * 2.4 + v * 0.8);
        let t = tone(v * 0.9 + 0.05, 3, x, y, 0.3) + 1;
        if (r < 0.10) t = 0;
        else if (r < 0.22) t = v > 0.45 ? 4 : 3;
        g[y][x] = String(t);
      }
    }
    return g;
  }

  function genStone(w, h, seed) {
    const g = makeGrid(w, h, "m");
    const rows = Math.max(2, Math.floor((h + 8) / 16));
    const rowH = h / rows;
    const stoneId = makeGrid(w, h, -1);
    let sid = 0;
    for (let r = 0; r < rows; r++) {
      const y0 = Math.trunc(r * rowH);
      const y1 = Math.trunc((r + 1) * rowH);
      const cols = Math.max(2, Math.floor(w / 14));
      const off = Math.floor(ihash(r, 41, seed) * w);
      const cuts = [];
      for (let c = 0; c < cols; c++) {
        const jitter = ihash(r * 17 + c, 42, seed) - 0.5;
        cuts.push(Math.trunc((c + 0.5 + jitter * 0.5) * w / cols + off) % w);
      }
      cuts.sort((a, b) => a - b);
      for (let c = 0; c < cols; c++) {
        const a = cuts[c];
        const b = cuts[(c + 1) % cols];
        let span = mod(b - a, w);
        if (span === 0) span = w;
        for (let k = 1; k < span; k++) {
          const x = (a + k) % w;
          for (let y = y0 + 1; y < y1; y++) stoneId[y % h][x] = sid;
        }
        sid++;
      }
    }
    const bc = baseCells(w);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const s = stoneId[y][x];
        if (s < 0) {
          const m = periodicNoise(x, y, w, h, bc * 2, seed + 55);
          g[y][x] = m > 0.78 ? "v" : "m";
          continue;
        }
        const shade = ihash(s, 43, seed) * 0.35;
        const v = fbm(x, y, w, h, seed + 9, bc) * 0.65 + shade;
        let t = tone(v, 4, x, y, 0.25);
        const up = stoneId[mod(y - 1, h)][x] !== s;
        const left = stoneId[y][mod(x - 1, w)] !== s;
        const down = stoneId[(y + 1) % h][x] !== s;
        const right = stoneId[y][(x + 1) % w] !== s;
        if (up || left) t = Math.min(4, t + 1);
        if (down || right) t = Math.max(0, t - 1);
        g[y][x] = String(t);
      }
    }
    const nCracks = Math.max(1, Math.floor((w * h) / 400));
    for (let i = 0; i < nCracks; i++) {
      let cx = Math.floor(ihash(i, 61, seed) * w);
      let cy = Math.floor(ihash(i, 62, seed) * h);
      if (stoneId[cy][cx] < 0) continue;
      const s = stoneId[cy][cx];
      for (let k = 0; k < 3; k++) {
        if (stoneId[cy][cx] === s) g[cy][cx] = "k";
        cx = (cx + 1) % w;
        cy = (cy + (ihash(i * 5 + k, 63, seed) < 0.5 ? 1 : 0)) % h;
      }
    }
    return g;
  }

  function genWater(w, h, seed, frame, frames = 8) {
    const g = makeGrid(w, h, "2");
    const bc = baseCells(w);
    const phase = frame / frames;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const v = fbm(x, y, w, h, seed, bc);
        let t = tone(v * 1.1 - 0.05, 3, x, y, 0.15);
        const band = frac(v * 4.0 + phase);
        if (band < 0.06) t = 4;
        else if (band < 0.18) t = 3;
        g[y][x] = String(t);
      }
    }
    const nSpark = Math.max(2, Math.floor((w * h) / 160));
    for (let i = 0; i < nSpark; i++) {
      const sx = Math.floor(ihash(i, 71, seed) * w);
      const sy = Math.floor(ihash(i, 72, seed) * h);
      const on = Math.floor(ihash(i, 73, seed) * frames);
      if (on === frame || (on + 1) % frames === frame) g[sy][sx] = "f";
    }
    return g;
  }

  const GENERATORS = { grass: genGrass, dirt: genDirt, sand: genSand, stone: genStone, water: genWater };

  function resolve(archetype) {
    return ALIASES[String(archetype || "").toLowerCase().trim()] || null;
  }

  // Returns a PixelDSL spec for a seamless tile, or null if not a tile archetype.
  function generateTileSpec(archetype, seed = 42, width = 32, height = 32) {
    const mat = resolve(archetype);
    if (!mat) return null;
    const w = Math.trunc(width);
    const h = Math.trunc(height);
    seed = (Math.trunc(seed) & 0x7FFFFFFF) >>> 0;
    const gen = GENERATORS[mat];
    const nFrames = mat === "water" ? 8 : 1;
    const toRows = (g) => g.map((row) => row.join(""));
    const frames = [];
    for (let f = 1; f < nFrames; f++) frames.push({ grid: toRows(gen(w, h, seed, f)) });
    return {
      name: `proc_${mat}_tile_s${seed}_${w}x${h}`,
      prompt: `Seamless ${mat} tile (seed=${seed}, ${w}x${h}) - tilegen`,
      width: w,
      height: h,
      symmetry: "none",
      rle: false,
      tileable: true,
      palette: Object.assign({ ".": "transparent" }, PALETTES[mat]),
      postProcess: { autoOutline: false, autoShading: false, sdfShading: false, selOut: false, tileNormals: true },
      layers: [],
      frames,
      grid: toRows(gen(w, h, seed, 0)),
      fps: mat === "water" ? 6 : 8
    };
  }

  const TileGen = { MATERIALS, resolve, generateTileSpec, ihash };
  root.TileGen = TileGen;
  if (typeof module !== "undefined" && module.exports) module.exports = TileGen;
})(typeof window !== "undefined" ? window : globalThis);
