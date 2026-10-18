---
name: pixeldsl
description: >-
  Make or change pixel-art game assets (characters, props, tiles) with PixelDSL: JSON models of
  3D primitives on a shared human skeleton rendered to top-down 2.5D / side / iso sprites, exported
  as PNG sheets + JSON, GameMaker sprites or Godot SpriteFrames. Use for any sprite, character,
  outfit, prop or tile request in this repository.
---

# PixelDSL

1. Start from the closest file in `models/characters/` or `models/props/`; copy it to a new name.
2. Edit `materials` (4 colours dark -> light, optional 5th + `"gloss": true`) and `parts`
   (builder calls or raw primitives on joints, see README "Models"). Use `"mirror": true`
   for symmetric pairs and a shared `group` for pieces that should blend.
3. Check it: `python -m pixeldsl render <model.json> --view topdown --dir 315 -o out/x.png`
   and `--view side --anim walk --frame 0.25`; view the PNG. Silhouette first: it must read
   as filled black at 1x.
4. Preview everything: `python -m pixeldsl preview <model.json> -o out/preview.html`.
5. Export: `python -m pixeldsl export <model.json> --views topdown,side --out out/` (add
   `--gamemaker <project> --gm-name ...` or `--godot-res res://...`).
6. Run `python -m unittest discover tests` before committing; every model in `models/` is
   rendered by the tests and must stay inside the canvas.

Rules: never edit generated PNGs by hand (regenerate from JSON); keep code comments in English;
`out/` is a scratch folder and is not committed.
