uniform float uTime;
varying vec3 vPosition;
varying vec3 vNormal;
uniform vec3 uColor;
void main()
{
    // Normal
    vec3 normal = normalize(vNormal);
	// Stripes ( Lines)
    float stripes = mod((vPosition.y - uTime * 0.02) * 20.0,1.0);
    stripes = pow(stripes,3.0);
    // Fresnel ( Reflection )
    if(!gl_FrontFacing)
        normal *= -1.0;
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0);
    // Holograph ( Combination of stripes with the fresnel reflection)
    float holograph =  fresnel * (stripes + 0.5);
    // float holograph =  fresnel * stripes;
    // holograph += fresnel * 1.25;
    // Falloff
    float falloff = smoothstep(0.95,0.0, fresnel);
    holograph += fresnel*1.25;
    holograph *= falloff;
    // Final color
    gl_FragColor = vec4(uColor, holograph);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}