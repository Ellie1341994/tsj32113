uniform sampler2D uPerlinTexture;
uniform float uTime;
varying vec2 vUv;
void main() {
	// Scale & animate
	vec2 smokeUv = vUv;
	smokeUv.x *= 0.5;
	// smokeUv.y -= uTime * 0.1;
	smokeUv.y = 0.5;
	// Smoke
	float smoke = texture(uPerlinTexture, smokeUv).r;

	gl_FragColor = vec4(1.0,1.0,1.0,smoke);
	#include <tonemapping_fragment>  // adds support for tonemapping in the renderer
	#include <colorspace_fragment> // "" for colorspace
}