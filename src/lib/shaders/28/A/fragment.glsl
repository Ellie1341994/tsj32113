varying vec2 uVv;
void main(){
    // R G B A
    // P1
    // cyan = vec4(0.0, 0.851, 1.0, 1.0);
    // magenta = vec4(1.0,0.0,1.0,1.0);
    // blue = vec4(0.0157, 0.0, 1.0, 1.0);
    // white = vec4(0.9882, 0.9882, 0.9882, 1.0);
    // gl_FragColor = vec4(uVv, 1.0, 1.0);
    
    // P2
    // orange = vec4(0.9255, 0.0392, 0.0392, 1.0);
    // yellow = vec4(0.9255, 0.8667, 0.0431, 1.0);
    // green = vec4(0.3961, 0.9255, 0.0431, 1.0);
    // black = vec4(0.1098, 0.1137, 0.1059, 1.0);
    // gl_FragColor = vec4(uVv, 0.1, 1.0);
    
    
    // P3
    // float horizontalBlackToWhite = uVv.x;
    // gl_FragColor = vec4(horizontalBlackToWhite,horizontalBlackToWhite,horizontalBlackToWhite, 1.0);
    
    // P4
    // float verticalBlackToWhite = 1.0 - uVv.y;
    // gl_FragColor = vec4(
    //     verticalBlackToWhite,
    //     verticalBlackToWhite,
    //     verticalBlackToWhite, 
    //     1.0
    //     );

    //  P5
    // float invertedVerticalBlackToWhite = 1.0 - uVv.y;
    // gl_FragColor = vec4(
    //     invertedVerticalBlackToWhite,
    //     invertedVerticalBlackToWhite,
    //     invertedVerticalBlackToWhite,
    //     1.0
    //     );

    // P6
    // float val = uVv.y * 9.0;
    // gl_FragColor = vec4(
    //     val,
    //     val,
    //     val,
    //     1.0
    //     );
    
    // P7
    // P6
    float halfCircle = 3.14;
    float cycles = 10.0 * uVv.y;
    // float val = abs(sin( cycles * halfCircle));
    float v = mod(cycles, 1.0);

    // float val = sin( cycles * halfCircle) ;
    gl_FragColor = vec4(
        v,
        v,
        v,
        1.0
        );
}