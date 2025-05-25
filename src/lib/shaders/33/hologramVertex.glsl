uniform float uTime;
uniform float drawCallIterationId;
varying vec3 vPosition;
varying vec3 vNormal;
#include random2D;
void main()
{	
	// Position
	vec4 modelPosition =  modelMatrix * vec4(position, 1.0);
	// Glitch
	// bool glitchDirectionUp = mod(drawCallIterationId, 10.0) == 0.0; //? modelPosition.y > 0.0 : modelPosition.y < 0.0; 
	float  glitchTime = (modelPosition.y < 0.0) ? uTime * 1.0 - modelPosition.y : uTime * 1.0 + modelPosition.y;
	float glitchStrength = sin(glitchTime);
	glitchStrength += sin(glitchTime * 3.52) + sin(glitchTime * 8.752); // randomness
	glitchStrength = smoothstep(0.95,1.0,glitchStrength);
	glitchStrength *=  0.25;
	modelPosition.z += (random2D(modelPosition.xz + uTime)  - 0.5) * glitchStrength;
	modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
	// Final position
	gl_Position = projectionMatrix * viewMatrix * modelPosition;
	// Model normal for holograph style in all directions
	vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
	// varying
	vPosition = modelPosition.xyz;
	// vNormal = normal;
	vNormal = modelNormal.xyz;

}