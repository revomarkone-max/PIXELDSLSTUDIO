extends Node3D
# PixelDSL sprites with per-pixel depth in a 3D scene: camera-facing quads under an orthographic camera at PixelDSL's
# "topdown" elevation, so one sprite pixel is one screen pixel. Two characters walk through each other, a tree and
# props; D toggles per-pixel depth (off = flat quads). Screenshots: godot --path . -- --shot=<dir>

const PPU := 32.0                  # sprite pixels per world unit (PixelDSL scale 1)
const ELEVATION := 35.0            # degrees, PixelDSL "topdown" view
const ART := "res://art/"
const SHADER := preload("res://depth_sprite.gdshader")

var fwd := Vector3(0, -sin(deg_to_rad(ELEVATION)), -cos(deg_to_rad(ELEVATION)))
var up := Vector3.RIGHT.cross(fwd).normalized()
var sprites: Array[ShaderMaterial] = []
var walkers: Array[Dictionary] = []
var use_depth := true
var t := 0.0
var label := Label.new()


func _ready() -> void:
	var cam := Camera3D.new()
	cam.projection = Camera3D.PROJECTION_ORTHOGONAL
	cam.size = get_viewport().get_visible_rect().size.y / PPU
	add_child(cam)
	var target := Vector3(0, 0.9, 0)
	cam.look_at_from_position(target - fwd * 30.0, target, Vector3.UP)

	var ground := MeshInstance3D.new()
	var plane := PlaneMesh.new()
	plane.size = Vector2(16, 16)
	ground.mesh = plane
	var gm := StandardMaterial3D.new()
	gm.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	gm.albedo_texture = load(ART + "grass_s42_32.png")
	gm.texture_filter = BaseMaterial3D.TEXTURE_FILTER_NEAREST
	gm.uv1_scale = Vector3(16, 16, 1)    # one 32 px tile per world unit
	ground.material_override = gm
	add_child(ground)

	sprite("tree", "idle", Vector3(0.0, 0, 0.0))
	sprite("tree", "idle", Vector3(-2.6, 0, -1.2))
	sprite("barrel", "idle", Vector3(1.6, 0, 0.35))
	sprite("crystal", "idle", Vector3(-1.4, 0, 0.6))
	walkers.append({"m": sprite("priest", "walk", Vector3.ZERO), "z": 0.15, "span": 3.0, "speed": 0.9, "phase": 0.0})
	walkers.append({"m": sprite("mage", "walk", Vector3.ZERO), "z": 0.3, "span": 3.0, "speed": 0.9, "phase": PI})

	label.position = Vector2(4, 2)
	add_child(label)
	_set_depth(true)
	var shot := ""
	for a in OS.get_cmdline_user_args():
		if a.begins_with("--shot="):
			shot = a.substr(7)
	if shot != "":
		_shoot(shot)


func sprite(name: String, anim: String, pos: Vector3) -> MeshInstance3D:
	var meta: Dictionary = JSON.parse_string(FileAccess.get_file_as_string(ART + name + "_topdown.json"))
	var e: Dictionary = meta.anims[anim]
	var w: float = meta.frame.w
	var h: float = meta.frame.h
	var quad := QuadMesh.new()
	quad.size = Vector2(w, h) / PPU
	quad.center_offset = Vector3(w * 0.5 - meta.origin.x, meta.origin.y - h * 0.5, 0) / PPU
	var mat := ShaderMaterial.new()
	mat.shader = SHADER
	mat.set_shader_parameter("albedo_sheet", load(ART + e.file))
	mat.set_shader_parameter("depth_sheet", load(ART + e.depth))
	mat.set_shader_parameter("frames", Vector2(e.frames, meta.dirs.size()))
	mat.set_shader_parameter("pixels_per_unit", PPU)
	var mi := MeshInstance3D.new()
	mi.mesh = quad
	mi.material_override = mat
	mi.basis = Basis(Vector3.RIGHT, up, -fwd)   # faces the camera
	mi.position = pos
	mi.set_meta("anim", {"frames": e.frames, "fps": e.fps, "dirs": meta.dirs.map(func(d): return d.name)})
	add_child(mi)
	sprites.append(mat)
	return mi


func _process(delta: float) -> void:
	t += delta
	_place(t)


func _unhandled_input(event: InputEvent) -> void:
	var key := event as InputEventKey
	if key and key.pressed and not key.echo and key.keycode in [KEY_D, KEY_ENTER]:
		_set_depth(not use_depth)


func _place(time: float) -> void:
	for wk in walkers:
		var mi: MeshInstance3D = wk.m
		var info: Dictionary = mi.get_meta("anim")
		var s: float = sin(time * wk.speed + wk.phase)
		var v: float = cos(time * wk.speed + wk.phase)
		mi.position = Vector3(s * wk.span, 0, wk.z)
		var row: int = info.dirs.find("right" if v > 0 else "left")
		var col: int = int(time * info.fps) % int(info.frames)
		(mi.material_override as ShaderMaterial).set_shader_parameter("frame", Vector2(col, row))


func _set_depth(on: bool) -> void:
	use_depth = on
	for m in sprites:
		m.set_shader_parameter("use_depth", on)
	label.text = "per-pixel depth: %s  (D / Enter)" % ("on" if on else "off")


func _shoot(dir: String) -> void:
	set_process(false)
	# the two characters overlap each other and the first tree's trunk
	_place(0.0)
	walkers[0].m.position.x = 0.15
	walkers[1].m.position.x = -0.2
	for on in [true, false]:
		_set_depth(on)
		for i in 6:
			await get_tree().process_frame
		await RenderingServer.frame_post_draw
		get_viewport().get_texture().get_image().save_png(dir.path_join("depth_%s.png" % ("on" if on else "off")))
	get_tree().quit()
