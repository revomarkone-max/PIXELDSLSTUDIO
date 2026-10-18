"""
Quality & parity checks for PixelDSL (stdlib unittest, no pip packages).

    python -m unittest discover tests -v

JS parity tests run only when `node` is on PATH.
"""
import json
import os
import shutil
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

import paperdoll  # noqa: E402
import pixeldsl  # noqa: E402
import tilegen  # noqa: E402
from tools.gallery import SPRITE_ARCHETYPES  # noqa: E402

NODE = shutil.which("node")


def run_node(script):
    out = subprocess.run([NODE, "-e", script], cwd=ROOT, capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def px(buf, w, x, y):
    i = (y * w + x) * 4
    return buf[i], buf[i + 1], buf[i + 2]


def col_diff(buf, w, h, xa, xb):
    total = 0
    for y in range(h):
        a, b = px(buf, w, xa, y), px(buf, w, xb, y)
        total += sum(abs(a[k] - b[k]) for k in range(3))
    return total / h


def row_diff(buf, w, h, ya, yb):
    total = 0
    for x in range(w):
        a, b = px(buf, w, x, ya), px(buf, w, x, yb)
        total += sum(abs(a[k] - b[k]) for k in range(3))
    return total / w


class TileTests(unittest.TestCase):
    SIZES = [(16, 16), (32, 32), (48, 48), (24, 40)]

    def test_tiles_are_seamless(self):
        """The wrap-around seam must be no harsher than the harshest interior boundary.

        Structured tiles (stone) legitimately have strong interior edges (mortar), so the
        seam is compared with the strongest interior column/row transition, not the mean.
        """
        for mat in tilegen.MATERIALS:
            for seed in (1, 42, 999):
                for w, h in self.SIZES:
                    with self.subTest(mat=mat, seed=seed, size=(w, h)):
                        r = pixeldsl.render_sprite(tilegen.generate_tile_spec(mat, seed, w, h), 0)
                        buf = r["buffer"]
                        inner_x = max(col_diff(buf, w, h, x, x + 1) for x in range(w - 1))
                        inner_y = max(row_diff(buf, w, h, y, y + 1) for y in range(h - 1))
                        # small tiles have few boundaries to compare with, hence the slack
                        self.assertLessEqual(col_diff(buf, w, h, w - 1, 0), inner_x * 1.25 + 8)
                        self.assertLessEqual(row_diff(buf, w, h, h - 1, 0), inner_y * 1.25 + 8)

    def test_noise_is_exactly_periodic(self):
        """The noise field itself must repeat with the tile size (the real seam guarantee)."""
        for w, h in self.SIZES:
            for x in range(0, w, 3):
                for y in range(0, h, 3):
                    with self.subTest(size=(w, h), x=x, y=y):
                        v = tilegen.fbm(x, y, w, h, 42, tilegen._base_cells(w))
                        self.assertAlmostEqual(v, tilegen.fbm(x + w, y, w, h, 42, tilegen._base_cells(w)), places=9)
                        self.assertAlmostEqual(v, tilegen.fbm(x, y + h, w, h, 42, tilegen._base_cells(w)), places=9)

    def test_tiles_are_opaque_and_calm(self):
        """Full coverage and a limited palette (a busy tile breaks up a tilemap)."""
        for mat in tilegen.MATERIALS:
            with self.subTest(mat=mat):
                spec = tilegen.generate_tile_spec(mat, 42, 32, 32)
                r = pixeldsl.render_sprite(spec, 0)
                alphas = r["buffer"][3::4]
                self.assertTrue(all(a == 255 for a in alphas))
                colours = {bytes(r["buffer"][i:i + 3]) for i in range(0, len(r["buffer"]), 4)}
                self.assertLessEqual(len(colours), 9)

    def test_water_animation_loops(self):
        spec = tilegen.generate_tile_spec("water", 42, 32, 32)
        self.assertEqual(pixeldsl.get_frame_count(spec), 8)
        # frame 8 would equal frame 0: the phase wraps exactly
        again = tilegen._gen_water(32, 32, 42, 8)
        self.assertEqual(["".join(r) for r in again], spec["grid"])

    def test_determinism_and_seed_variation(self):
        a = tilegen.generate_tile_spec("dirt", 5, 32, 32)
        b = tilegen.generate_tile_spec("dirt", 5, 32, 32)
        c = tilegen.generate_tile_spec("dirt", 6, 32, 32)
        self.assertEqual(a, b)
        self.assertNotEqual(a["grid"], c["grid"])

    @unittest.skipUnless(NODE, "node not installed")
    def test_tilegen_js_parity(self):
        cases = [(m, s, w, h) for m in tilegen.MATERIALS for s in (1, 42, 123456) for (w, h) in self.SIZES]
        js = run_node(
            "const T=require('./tilegen.js');"
            f"const c={json.dumps(cases)};"
            "console.log(JSON.stringify(c.map(([m,s,w,h])=>{const t=T.generateTileSpec(m,s,w,h);"
            "return [t.grid,t.frames.map(f=>f.grid)];})))"
        )
        for (m, s, w, h), (grid, frames) in zip(cases, js):
            with self.subTest(mat=m, seed=s, size=(w, h)):
                spec = tilegen.generate_tile_spec(m, s, w, h)
                self.assertEqual(spec["grid"], grid)
                self.assertEqual([f["grid"] for f in spec["frames"]], frames)


class ArchetypeTests(unittest.TestCase):
    def test_every_archetype_renders_a_sane_silhouette(self):
        for arch in SPRITE_ARCHETYPES:
            for size in (16, 32, 48):
                with self.subTest(arch=arch, size=size):
                    spec = pixeldsl.generate_archetype(arch, 42, size, size)
                    r = pixeldsl.render_sprite(spec, 0)
                    alphas = r["buffer"][3::4]
                    cover = sum(1 for a in alphas if a > 0) / float(size * size)
                    self.assertGreater(cover, 0.03, "sprite is (almost) empty")
                    self.assertLess(cover, 0.90, "sprite fills the whole canvas")

    def test_archetypes_are_deterministic(self):
        for arch in SPRITE_ARCHETYPES:
            with self.subTest(arch=arch):
                a = pixeldsl.render_sprite(pixeldsl.generate_archetype(arch, 9, 32, 32), 0)["buffer"]
                b = pixeldsl.render_sprite(pixeldsl.generate_archetype(arch, 9, 32, 32), 0)["buffer"]
                self.assertEqual(a, b)


class PaperDollTests(unittest.TestCase):
    def test_4way_sheet_has_every_cell_filled(self):
        slots = paperdoll.LOADOUTS["paladin"]["slots"]
        sheet = paperdoll.render_4way_sheet("humanoid", slots, "walk", "steel", 4, True)
        fw, fh, sw = sheet["frame_width"], sheet["frame_height"], sheet["width"]
        buf = sheet["sheet_buffer"]
        for row in range(4):
            for col in range(sheet["frames_count"]):
                with self.subTest(row=row, col=col):
                    filled = 0
                    for y in range(row * fh, (row + 1) * fh):
                        for x in range(col * fw, (col + 1) * fw):
                            if buf[(y * sw + x) * 4 + 3] > 0:
                                filled += 1
                    self.assertGreater(filled, fw * fh * 0.08)

    def test_tall_hat_gets_headroom_and_is_not_clipped(self):
        slots = paperdoll.LOADOUTS["wanderer"]["slots"]
        for d in ("down", "right", "up"):
            with self.subTest(direction=d):
                spec = paperdoll.assemble_spec("humanoid", slots, "walk", "amethyst", 8, d, True)
                self.assertEqual(spec["height"], 56)
                for f in range(1, 9):
                    buf = pixeldsl.render_rig(spec, f)["buffer"]
                    top_row = buf[3:spec["width"] * 4:4]
                    self.assertTrue(all(a == 0 for a in top_row), f"hat clipped at frame {f}")

    def test_cape_is_cloth_not_metal(self):
        spec = paperdoll.assemble_spec("humanoid", paperdoll.LOADOUTS["paladin"]["slots"], "walk", "steel", 8, "up", True)
        fills = {b["id"]: b["fill"] for b in spec["rig"]["bones"]}
        self.assertTrue(fills["eq_cape_mid"].startswith("cape"))
        self.assertIn("cape", spec["palette"])

    def test_godot_tres_load_steps(self):
        tres = paperdoll.generate_godot4_tres("x/sheet.png", "humanoid", "walk", 48, 48, 6, True)
        self.assertIn("load_steps=26", tres)  # 1 ext + 24 atlas sub-resources + 1
        self.assertEqual(tres.count('[sub_resource type="AtlasTexture"'), 24)
        self.assertNotIn("uid=", tres)

    @unittest.skipUnless(NODE, "node not installed")
    def test_paperdoll_js_parity(self):
        dirs = ["down", "right", "up"]
        js = run_node(
            "const P=require('./paperdoll.js');const out={};"
            "for(const [id,lo] of Object.entries(P.LOADOUTS)){for(const d of " + json.dumps(dirs) + "){"
            "const s=P.assembleSpec(lo.mannequin||'humanoid',lo.slots,'walk',{theme:lo.theme||'steel',direction:d,frames:8,useIK:true});"
            "out[id+'/'+d]={bones:s.rig.bones,frames:s.frames};}}console.log(JSON.stringify(out))"
        )

        def norm(o):
            if isinstance(o, float):
                return int(o) if o == int(o) else round(o, 6)
            if isinstance(o, dict):
                return {k: norm(v) for k, v in o.items() if v is not None}
            if isinstance(o, list):
                return [norm(v) for v in o]
            return o

        for lid, lo in paperdoll.LOADOUTS.items():
            for d in dirs:
                key = f"{lid}/{d}"
                if key not in js:
                    continue
                with self.subTest(loadout=lid, direction=d):
                    spec = paperdoll.assemble_spec(lo.get("mannequin", "humanoid"), lo["slots"], "walk",
                                                   lo.get("theme", "steel"), 8, d, True)
                    self.assertEqual(norm(spec["rig"]["bones"]), norm(js[key]["bones"]))
                    self.assertEqual(norm(spec["frames"]), norm(js[key]["frames"]))


if __name__ == "__main__":
    unittest.main()
