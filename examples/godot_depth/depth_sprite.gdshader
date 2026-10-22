shader_type spatial;
// PixelDSL sprite with per-pixel depth (export --depth). The quad faces the camera with the sprite origin (feet) at the
// node; each pixel moves back along the view ray by the depth PixelDSL ray-marched and writes it, so sprites intersect
// each other and the ground per pixel instead of being sorted by Y.
render_mode unshaded, cull_disabled;

uniform sampler2D albedo_sheet : source_color, filter_nearest;
uniform sampler2D depth_sheet : filter_nearest;
uniform vec2 frames = vec2(1.0);   // sheet columns (frames), rows (directions)
uniform vec2 frame = vec2(0.0);    // column, row
uniform float pixels_per_unit = 32.0;
uniform bool use_depth = true;

void fragment() {
	vec2 uv = (frame + UV) / frames;
	vec4 c = texture(albedo_sheet, uv);
	if (c.a < 0.5) {
		discard;
	}
	ALBEDO = c.rgb;
	// 16 bits in R (high) and G (low): 32768 + 128 * pixels behind the origin plane
	vec4 d = texture(depth_sheet, uv);
	float px = (round(d.r * 255.0) * 256.0 + round(d.g * 255.0) - 32768.0) / 128.0;
	float behind = use_depth ? px / pixels_per_unit : 0.0;
	vec4 clip = PROJECTION_MATRIX * vec4(VERTEX - VIEW * behind, 1.0);
	DEPTH = clip.z / clip.w;
}
