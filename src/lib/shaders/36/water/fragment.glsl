uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
varying float vElevation;
uniform float uColorOffset;
uniform float uColorMultiplier;

void main(){
    // Base color
    float mixStrength = (uColorOffset + vElevation) * uColorMultiplier;
    vec3 mixedColor = mix(uDepthColor, uSurfaceColor, mixStrength);
    // Final color
    gl_FragColor = vec4(mixedColor,1.0);  
    #include <colorspace_fragment>
}