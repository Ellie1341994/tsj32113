uniform sampler2D uPerlinTexture;
uniform float uTime;
varying vec2 vUv;
void main() {
	// Scale & animate
	vec2 smokeUv = vUv;
	smokeUv.x *= 0.5;
	smokeUv.y *= 0.5;
	smokeUv.y -= uTime * 0.1;
	// Smoke
	float smoke = texture(uPerlinTexture, smokeUv).r;
	// Remap
	float smoothedSmoke = smoothstep(0.45, 0.9, smoke);
	// Edges
	smoothedSmoke *= smoothstep(0.0, 0.2, vUv.x);
	smoothedSmoke *= smoothstep(1.0, 0.8, vUv.x);
	smoothedSmoke *= smoothstep(0.0, 0.1, vUv.y);
	smoothedSmoke *= smoothstep(0.75, 0.25, vUv.y);
	// Test
	// gl_FragColor = vec4(1.0,0.0,0.0,1.0);
	// Final color
	gl_FragColor = vec4(0.8,0.7,1.0,smoothedSmoke);
	#include <tonemapping_fragment>  // adds support for tonemapping in the renderer
	#include <colorspace_fragment> // "" for colorspace
}