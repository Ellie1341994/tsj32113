uniform vec3 uColor;
varying vec3 vNormal;
varying vec3 vPos;
#include lights/ambientL;
#include lights/directionalL;
#include lights/pointL;

void main(){
    // Setup
    vec3 color = uColor;
    vec3 cameraViewDirection = normalize(vPos - cameraPosition);
    vec3 normal = normalize(vNormal);
    // Lights 
    vec3 light = vec3(0.0);

    light += ambientLight(
        vec3(1.0 ),
        0.03
    );

    light += directionalLight(
        vec3(0.1,0.1, 1.0 ),
        1.0,
        normal,
        vec3(0.0, 0.0,3.0),
        cameraViewDirection,
        20.0
    );

    light += pointLight(
      vec3(1.0,0.1, 0.1 ),
      1.0,
      normal,
      vec3(0.0, 2.5,0.0),
      cameraViewDirection,
      20.0,
      vPos,0.25
    );
    

    // Mix
    color *= light;
    
    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}