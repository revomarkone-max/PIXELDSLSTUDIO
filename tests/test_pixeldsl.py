"""
Tests for pixeldsl:  python -m unittest discover tests -v
"""
import json
import re
import sys
import tempfile
import unittest
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from pixeldsl import export, model, tiles  # noqa: E402

MODELS = sorted((ROOT / "models").rglob("*.json"))


def _yy(text):
    return json.loads(re.sub(r",(\s*[}\]])", r"\1", text))


class TileTests(unittest.TestCase):
    SIZES = [(16, 16), (32, 32), (48, 48), (24, 40)]

    def _seam(self, img, axis):
        a = img[:, :, :3].astype(int)
        if axis == 1:
            inner = [np.abs(a[:, x] - a[:, x + 1]).sum(axis=1).mean() for x in range(a.shape[1] - 1)]
            seam = np.abs(a[:, -1] - a[:, 0]).sum(axis=1).mean()
        else:
            inner = [np.abs(a[y] - a[y + 1]).sum(axis=1).mean() for y in range(a.shape[0] - 1)]
            seam = np.abs(a[-1] - a[0]).sum(axis=1).mean()
        return seam, max(inner)

    def test_tiles_are_seamless(self):
        for mat in tiles.MATERIALS:
            for seed in (1, 42, 999):
                for w, h in self.SIZES:
                    with self.subTest(mat=mat, seed=seed, size=(w, h)):
                        img = tiles.render_tile(mat, seed, w, h)[0][0]
                        seam, worst = self._seam(img, 1)
                        self.assertLessEqual(seam, worst * 1.25 + 8)
                        if mat != "ground":   # side-view ground only wraps horizontally
                            seam, worst = self._seam(img, 0)
                            self.assertLessEqual(seam, worst * 1.25 + 8)

    def test_noise_is_exactly_periodic(self):
        for w, h in self.SIZES:
            for x in range(0, w, 5):
                for y in range(0, h, 5):
                    v = tiles.fbm(x, y, w, h, 42, tiles._base_cells(w))
                    self.assertAlmostEqual(v, tiles.fbm(x + w, y, w, h, 42, tiles._base_cells(w)), places=9)
                    self.assertAlmostEqual(v, tiles.fbm(x, y + h, w, h, 42, tiles._base_cells(w)), places=9)

    def test_water_loops_and_tiles_are_deterministic(self):
        frames, fps = tiles.render_tile("water", 42, 32, 32)
        self.assertEqual(len(frames), 8)
        again = tiles._gen_water(32, 32, 42, 8)
        self.assertEqual(["".join(r) for r in again], tiles.generate_tile_spec("water", 42, 32, 32)["grid"])
        self.assertTrue(np.array_equal(tiles.render_tile("dirt", 5)[0][0], tiles.render_tile("dirt", 5)[0][0]))


class ModelTests(unittest.TestCase):
    def test_every_model_loads_and_renders_inside_the_canvas(self):
        for p in MODELS:
            m = model.Model.load(p)
            for view in m.default_views:
                anims = [a for a in ("idle", "attack", "jump", "death") if a in m.anims]
                for anim in anims:
                    for d in export.directions(m, view)[:2]:
                        with self.subTest(model=m.name, view=view, anim=anim, d=d):
                            a = m.render_frame(view, anim, 0.5 if anim != "death" else 1.0, d)["rgba"][:, :, 3]
                            self.assertGreater((a > 0).sum(), 60, "almost nothing rendered")
                            self.assertFalse(a[0].any() or a[-1].any() or a[:, 0].any() or a[:, -1].any(),
                                             "touches the render canvas edge")

    def test_rendering_is_deterministic(self):
        m = model.Model.load(ROOT / "models/characters/paladin.json")
        a = m.render_frame("topdown", "walk", 0.25, 315)["rgba"]
        b = model.Model.load(ROOT / "models/characters/paladin.json").render_frame("topdown", "walk", 0.25, 315)["rgba"]
        self.assertTrue(np.array_equal(a, b))

    def test_mirror_parts_create_the_other_side(self):
        m = model.Model.load(ROOT / "models/characters/paladin.json")
        joints = {p.get("joint") for p in m.prims if p.get("group", "").startswith("pauldron")}
        self.assertEqual(joints, {"shoulder_R", "shoulder_L"})

    def test_robe_replaces_the_legs(self):
        m = model.Model.load(ROOT / "models/characters/priest.json")
        groups = {p.get("group") for p in m.prims}
        self.assertFalse({"leg_R", "leg_L", "pelvis"} & groups)
        self.assertIn("ccone", {g["kind"] for g in __import__("pixeldsl.engine", fromlist=["x"]).resolve_primitives(
            [p for p in m.prims if p["kind"] == "skirt"], m.pose("walk", 0.25, 0))})

    def test_weapons_stay_out_of_the_body(self):
        for name in ("characters/mage", "characters/paladin", "heroes/mage", "heroes/priest", "heroes/druid"):
            m = model.Model.load(ROOT / ("models/%s.json" % name))
            from pixeldsl import engine
            for anim in ("idle", "walk", "run", "cast"):
                for u in (0.0, 0.25, 0.5, 0.75):
                    with self.subTest(model=name, anim=anim, u=u):
                        J = m.pose(anim, u, 270)
                        scene = engine.Scene(engine.resolve_primitives(m.solid_prims, J), m.group_k)
                        pts, rad, _ = m._weapon_samples(J)
                        self.assertGreater(float((scene.distance(pts) - rad).min()), -1.0)

    def test_cape_simulation_is_deterministic_and_stays_out_of_the_body(self):
        from pixeldsl import engine
        a = model.Model.load(ROOT / "models/characters/paladin.json")
        b = model.Model.load(ROOT / "models/characters/paladin.json")
        for anim in ("idle", "run"):
            ra, rb = a.pose(anim, 0.25, 0), b.pose(anim, 0.25, 0)
            self.assertTrue(np.allclose(ra["cape_low"][0], rb["cape_low"][0]))
            sim = a._cape
            scene = sim._body(a.raw_pose(anim, 0.25, 270))
            pts = np.array(sim.simulate(anim)[2][1:])
            self.assertGreater(float(scene.distance(pts).min()), 0.5)
        # running pushes the cape further back than standing
        self.assertLess(a._cape.simulate("run")[0][-1][2], a._cape.simulate("idle")[0][-1][2] - 3)

    def test_glow_and_team_layers(self):
        m = model.Model.load(ROOT / "models/heroes/mage.json")
        r = m.render_frame("topdown", "idle", 0.0, 270)
        team, glow = r["team"][:, :, 3] > 0, r["glow"][:, :, 3] > 0
        self.assertGreater(team.sum(), 4, "eyes missing from the team layer")
        self.assertGreater(glow.sum(), 4, "staff crystal missing from the glow layer")
        self.assertTrue((r["team"][team][:, :3] == 255).all(), "team layer must be white for tinting")
        self.assertTrue((r["rgba"][team][:, :3] < 40).all(), "eyes must be dark in the body layer")

    def test_chibi_proportions(self):
        m = model.Model({"name": "c", "body": "chibi"})
        J = m.pose("idle", 0.0, 270)
        head = J["head"][0][1] + m.dims["head_r"][1]
        self.assertGreater(m.dims["head_r"][1] * 2 / head, 0.33)   # head ~40% of the height

    def test_quadruped_walk_moves_every_leg(self):
        m = model.Model.load(ROOT / "models/heroes/druid_panther.json")
        a, b = m.pose("walk", 0.0, 270), m.pose("walk", 0.5, 270)
        for paw in ("fpaw_R", "fpaw_L", "hpaw_R", "hpaw_L"):
            self.assertGreater(float(np.linalg.norm(a[paw][0] - b[paw][0])), 2.0, paw)

    def test_size_scales_the_model(self):
        small = model.Model({"name": "s", "type": "prop", "parts": [{"sphere": {"joint": "root", "at": [0, 5, 0], "r": 5, "mat": "m", "group": "g"}}],
                             "materials": {"m": ["#111111", "#222222", "#333333", "#444444"]}})
        big = model.Model(dict(small.data, size=2.0))
        a = (small.render_frame("front", "idle", 0, 270)["rgba"][:, :, 3] > 0).sum()
        b = (big.render_frame("front", "idle", 0, 270)["rgba"][:, :, 3] > 0).sum()
        self.assertGreater(b / a, 3.0)

    def test_unknown_builder_is_a_clear_error(self):
        with self.assertRaisesRegex(ValueError, "unknown builder"):
            model.Model({"name": "x", "parts": [{"hat_of_doom": {}}]})

    def test_direction_mapping(self):
        self.assertAlmostEqual(model.yaw_for_direction(270), 0.0)
        self.assertAlmostEqual(model.yaw_for_direction(0), 90.0)


class ExportTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.out = Path(cls.tmp.name)
        cls.m = model.Model.load(ROOT / "models/characters/priest.json")
        cls.res = export.export_model(cls.m, ["side"], ["idle", "attack"], cls.out, godot_res="res://art", log=None)

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def test_generic_sheets_match_metadata(self):
        from PIL import Image
        meta = json.loads((self.out / "priest_side.json").read_text())
        w, h = meta["frame"]["w"], meta["frame"]["h"]
        self.assertEqual([d["name"] for d in meta["dirs"]], ["right", "left"])
        for anim, e in meta["anims"].items():
            with Image.open(self.out / e["file"]) as im:
                self.assertEqual(im.size, (w * e["frames"], h * len(meta["dirs"])))
        self.assertTrue(0 < meta["origin"]["y"] <= h)
        tip = meta["anims"]["attack"]["points"]["weapon_tip"]
        self.assertEqual((len(tip), len(tip[0]), len(tip[0][0])), (2, 6, 3))

    def test_godot_spriteframes(self):
        tres = (self.out / "priest_side.tres").read_text()
        frames = 6 + 6
        self.assertIn("load_steps=%d" % (2 + frames * 2 + 1), tres)
        self.assertIn('&"attack_left"', tres)

    def test_depth_map(self):
        from pixeldsl import engine
        m = model.Model.load(ROOT / "models/props/barrel.json")
        r = m.render_frame("side", "idle", 0.0, 0, depth=True)
        d = engine.decode_depth(r["depth_map"])
        opaque = r["rgba"][:, :, 3] > 0
        self.assertTrue(np.isfinite(d[opaque]).all())
        self.assertTrue(np.isnan(d[~opaque]).all())
        hit = np.isfinite(r["depth"])
        self.assertLessEqual(np.abs(d[hit] - (r["depth"][hit] - 400.0)).max(), 0.5 / engine.DEPTH_UNITS + 1e-9)
        # a barrel bulges toward the camera: its middle column is nearer than its rims
        ys, xs = np.nonzero(hit)
        row = int(np.median(ys))
        cols = np.nonzero(hit[row])[0]
        self.assertLess(d[row, cols[len(cols) // 2]], min(d[row, cols[0]], d[row, cols[-1]]))
        with tempfile.TemporaryDirectory() as out:
            meta = export.export_model(m, ["side"], ["idle"], out, depth=True, log=None)["side"]["meta"]
            e = meta["anims"]["idle"]
            from PIL import Image
            with Image.open(Path(out) / e["depth"]) as dm, Image.open(Path(out) / e["file"]) as im:
                self.assertEqual(dm.size, im.size)

    def test_gamemaker_sprites(self):
        with tempfile.TemporaryDirectory() as proj:
            proj = Path(proj)
            (proj / "Game.yyp").write_text('{\n  "resources":[\n  ],\n}\n', encoding="utf-8")
            m = model.Model.load(ROOT / "models/props/chest.json")
            raw, dirs, origin, size = export.render_view(m, "topdown", ["idle"])
            names = export.write_gamemaker(m, "topdown", raw, origin, size, proj)
            self.assertEqual(names, ["spr_chest_topdown_idle"])
            yy = _yy((proj / "sprites/spr_chest_topdown_idle/spr_chest_topdown_idle.yy").read_text())
            self.assertEqual(len(yy["frames"]), 1)
            self.assertFalse(yy["edgeFiltering"])
            self.assertIn("spr_chest_topdown_idle", (proj / "Game.yyp").read_text())
            export.write_gamemaker(m, "topdown", raw, origin, size, proj)       # idempotent
            self.assertEqual((proj / "Game.yyp").read_text().count("spr_chest_topdown_idle.yy"), 1)


if __name__ == "__main__":
    unittest.main()
