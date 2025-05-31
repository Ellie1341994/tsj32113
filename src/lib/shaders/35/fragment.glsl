uniform vec3 uColor;
varying vec3 vNormal;
#include lights/ambientL;
#include lights/directionalL;

void main(){
    // Setup
    vec3 color = uColor;
    
    // Lights
    vec3 light = vec3(0.0);
    // light += ambientLight(
    //     vec3(1.0,1.0, 1.0 ),
    //     1.0
    // );
    light += directionalLight(
        vec3(0.1,0.1, 1.0 ),
        1.0,
        vNormal,
        vec3(0.0, 0.0,3.0)
    );
    

    // Mix
    color *= light;
    
    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}