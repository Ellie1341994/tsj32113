uniform float uTime;
uniform sampler2D uPerlinTexture;
varying vec2 vUv;
#include utils/rotate2d;
void main() {
	vec3 newPosition = position;
	//  Twist
	float twistPerlin = texture(
		uPerlinTexture, 
		vec2(0.5, uv.y * 0.25 - uTime * 0.013)
		).r;
	float angle = twistPerlin * 10.0;
	newPosition.xz = rotate2d(newPosition.xz, angle);
	// Wind
	vec2 windOffset = vec2(
		texture(
			uPerlinTexture, 
			vec2(
				0.25, 
				uTime * 0.025)
			).r - 0.5,
			// 0.0, 
		texture(
			uPerlinTexture, 
			vec2(
				uTime * 0.025,
				0.25)
			).r - 0.5
		);
		windOffset *= pow(uv.y, 3.0) * 20.0;
	newPosition.xz += windOffset;
	// Final position
	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
	// varyings
	vUv = uv;
}