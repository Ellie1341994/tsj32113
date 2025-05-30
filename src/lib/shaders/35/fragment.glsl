uniform sampler2D uTexture;
uniform vec3 uColor;
void main(){
    // 
    // Final color
    gl_FragColor = vec4(uColor, 1);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}