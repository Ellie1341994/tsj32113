varying vec2 vUv;
#define PI 3.1415926535897932384626433832795
float random(vec2 st)
{
    return fract(sin(
        dot(
            st.xy,
            vec2(12.9898,78.233))) * 43758.5453123
        );
}
vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}
//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}
vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}
void main(){
    // R G B A
    // P1
    // cyan = vec4(0.0, 0.851, 1.0, 1.0);
    // magenta = vec4(1.0,0.0,1.0,1.0);
    // blue = vec4(0.0157, 0.0, 1.0, 1.0);
    // white = vec4(0.9882, 0.9882, 0.9882, 1.0);
    // gl_FragColor = vec4(vUv, 1.0, 1.0);
    
    // P2
    // orange = vec4(0.9255, 0.0392, 0.0392, 1.0);
    // yellow = vec4(0.9255, 0.8667, 0.0431, 1.0);
    // green = vec4(0.3961, 0.9255, 0.0431, 1.0);
    // black = vec4(0.1098, 0.1137, 0.1059, 1.0);
    // gl_FragColor = vec4(vUv, 0.1, 1.0);
    
    
    // P3
    // float horizontalBlackToWhite = vUv.x;
    // gl_FragColor = vec4(horizontalBlackToWhite,horizontalBlackToWhite,horizontalBlackToWhite, 1.0);
    
    // P4
    // float verticalBlackToWhite = 1.0 - vUv.y;
    // gl_FragColor = vec4(
    //     verticalBlackToWhite,
    //     verticalBlackToWhite,
    //     verticalBlackToWhite, 
    //     1.0
    //     );

    //  P5
    // float invertedVerticalBlackToWhite = 1.0 - vUv.y;
    // gl_FragColor = vec4(
    //     invertedVerticalBlackToWhite,
    //     invertedVerticalBlackToWhite,
    //     invertedVerticalBlackToWhite,
    //     1.0
    //     );

    // P6
    // float val = vUv.y * 9.0;
    // gl_FragColor = vec4(
    //     val,
    //     val,
    //     val,
    //     1.0
    //     );
    
    // P7
    // P8
    // float halfCircle = 3.14;
    // float cycles = 10.0 * vUv.y;
    // float val = abs(sin( cycles * halfCircle));
    // float v = mod(cycles, 1.0);

    // float val = sin( cycles * halfCircle) ;
    // gl_FragColor = vec4(
    //     v,
    //     v,
    //     v,
    //     1.0
    //     );
    // P9
    // float halfCircle = 3.14;
    // float cycles = 10.0 * vUv.y ;
    // float v = sin( cycles * halfCircle * 2.0);
    // float v = mod(cycles, 1.0) > 0.5 ? 1.0 : 0.0;
    // float val = sin( cycles * halfCircle) ;
    // gl_FragColor = vec4(
    //     v,
    //     v,
    //     v,
    //     1.0
    //     );
    // P10
    // float horizontalLines = 10.0 * vUv.x ;
    // float verticalLines = 10.0 * vUv.y ;
    // float v = mod(horizontalLines, 1.0) > 0.9 || mod(verticalLines, 1.0) > 0.9  ? 1.0 : 0.0;
    // gl_FragColor = vec4(
    //     v,
    //     v,
    //     v,
    //     1.0
    //     );
    // P11
    // float horizontalLines = 10.0 * vUv.x ;
    // float verticalLines = 10.0 * vUv.y ;
    // float v = mod(horizontalLines, 1.0) > 0.9 || mod(verticalLines, 1.0) > 0.9  ? 1.0 : 0.0;
    // gl_FragColor = vec4(
    //     v,
    //     v,
    //     v,
    //     1.0
    //     );  
    // P12
    // float horizontalLines = 10.0 * vUv.x ;
    // float verticalLines = 10.0 * vUv.y ;
    // float v = mod(horizontalLines, 1.0) > 0.75 && mod(verticalLines, 1.0) > 0.75  ? 1.0 : 0.0;
    // gl_FragColor = vec4(
    //     v,
    //     v,
    //     v,
    //     1.0
    //     );
    // P13
    // float horizontalLines = 10.0 * vUv.x ;
    // float verticalLines = 10.0 * vUv.y ;
    // float v = mod(horizontalLines, 1.0) > 0.5 && mod(verticalLines, 1.0) > 0.75  ? 1.0 : 0.0;
    // gl_FragColor = vec4(
    //     v,
    //     v,
    //     v,
    //     1.0
    //     );  
    // P14
    // float horizontalLines = 10.0 * vUv.x ;
    // float verticalLines = 10.0 * vUv.y ;
    // float v = mod(horizontalLines, 1.0) > 0.5 && mod(verticalLines, 1.0) > 0.75 
    //         || mod(horizontalLines, 1.0) > 0.75 && mod(verticalLines, 1.0) > 0.5 ? 1.0 : 0.0;
    // gl_FragColor = vec4(
    //     v,
    //     v,
    //     v,
    //     1.0
    //     );  
    // P15 A
    // float horizontalLines = 10.0 * vUv.x ;
    // float verticalLines = 10.0 * vUv.y ;
    // float v = 
    // mod(horizontalLines, 1.0) > 0.25 && mod(verticalLines, 1.0) > 0.40 &&
    // mod(horizontalLines, 1.0) < 0.75 && mod(verticalLines, 1.0) < 0.60 
    // || (
    //     mod(horizontalLines, 1.0) > 0.4 && mod(verticalLines, 1.0) > 0.25 &&
    //     mod(horizontalLines, 1.0) < 0.6 && mod(verticalLines, 1.0) < 0.75
    //     )
    // ? 1.0 : 0.0;
    // gl_FragColor = vec4(
    //     v,
    //     v,
    //     v,
    //     1.0
    //     );  
    // P15 B
    // float horizontalLines = 10.0 * vUv.x ;
    // float verticalLines = 10.0 * vUv.y ;
    // float v = 
    // mod(horizontalLines, 1.0) > 0.65 && mod(verticalLines, 1.0) > 0.85 || 
    // mod(horizontalLines, 1.0) > 0.85 && mod(verticalLines, 1.0) > 0.65 ||

    // mod(horizontalLines, 1.0) < 0.35 && mod(verticalLines, 1.0) < 0.15 || 
    // mod(horizontalLines, 1.0) < 0.15 && mod(verticalLines, 1.0) < 0.35 ||


    // mod(horizontalLines, 1.0) < 0.35 && mod(verticalLines, 1.0) > 0.85 || 
    // mod(horizontalLines, 1.0) < 0.15 && mod(verticalLines, 1.0) > 0.65 || 

    // mod(horizontalLines, 1.0) > 0.65 && mod(verticalLines, 1.0) < 0.15 || 
    // mod(horizontalLines, 1.0) > 0.85 && mod(verticalLines, 1.0) < 0.35 
    // ? 1.0 : 0.0;
    // gl_FragColor = vec4(
    //     v,
    //     v,
    //     v,
    //     1.0
    //     );  
    // P16
    // float v = abs((vUv.x - 0.5) * 2.0); 
    
    // P17
    // float v = min(abs((vUv.x - 0.5) * 2.0), abs((vUv.y - 0.5) * 2.0)); 
    // P18
    // float v = max(abs((vUv.x - 0.5) * 2.0), abs((vUv.y - 0.5) * 2.0)); 
    // P19
    // float v = abs(vUv.x - 0.5) * 2.0 < 0.35 
    //     && abs(vUv.y - 0.5) * 2.0 < 0.35
    //     ? 0.0 : 1.0; 
    // P20
    // float v = abs(vUv.x - 0.5) * 2.0 < 0.75 
    //     && abs(vUv.y - 0.5) * 2.0 < 0.75
    //     ? 0.0 : 1.0; 
    // P21
    // float v = floor(vUv.x *  10.0) * 0.1;
    // P22
    // float v = floor(vUv.x *  10.0) * 0.1;
    // v *= floor(vUv.y *  10.0) * 0.1;
    // P23
    // float v = random(vUv);
    // P24
    // vec2 vUv2 = vec2(
    //     floor(vUv.x * 10.0) * 0.1,
    //     floor(vUv.y * 10.0) * 0.1);
    // float v = random(vUv2);
    // P25
    // vec2 vUv2 = vec2(
    //     floor(vUv.x * 10.0) ,
    //     floor((vUv.y + vUv.x * 0.5) * 10.0) );
    // float v = random(vUv2);
    // P26
    // float v = distance(vUv, vec2(0.0,0.0));
    // float v = length(vUv);
    // P27
    // float v = distance(vUv, vec2(0.5,0.5)) * 2.0;
    // P28
    // float v = 1.0 - distance(vUv, vec2(0.5)) ;
    // P29
    // float v =  0.01 / distance(vUv, vec2(0.5)); 
    // P30
    // float v = 0.15 / (distance(vec2(vUv.x, vUv.y * 2.0 - 0.5) , vec2(0.5)));
    // P31
    // float v = 0.15 / (distance(vec2(vUv.x , vUv.y * 5.0 - 2.0) , vec2(0.5)));
    // v *= 0.15 / (distance(vec2(vUv.x * 5.0 - 2.0, vUv.y ) , vec2(0.5)));
    // P32
    // vec2 rotatedvUv = rotate(vUv, PI * 0.25, vec2(0.5));
    // vec2 vUv3 = vec2(rotatedvUv.x, rotatedvUv.y * 5.0 - 2.0); 
    // vec2 vUv4 = vec2(rotatedvUv.y, rotatedvUv.x * 5.0 - 2.0); 
    // float v = 0.15 / (distance(vUv3, vec2(0.5)));
    //     v *= 0.15 / (distance(vUv4, vec2(0.5)));
    // // P33
    // float v = distance(vUv, vec2(0.5)) < 0.25 ? 0.0 : 1.0;
    // float v = 1.0 - step(distance(vUv, vec2(0.5)) * 5.0, 1.0);
    // P34
    // float v = abs(distance(vUv, vec2(0.5)) - 0.25);
    // P35
    // float v = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));
    // P36
    // float v = 1.0 -  step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));
    // P37
    // vec2 wavedUv = vec2(
    // vUv.x,
    // vUv.y + cos(vUv.x * 69.0) * 0.1
    // );
    // float v = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));
    // P38
    // vec2 wavedUv = vec2(
    // vUv.x + cos(vUv.y * 9.0) * 0.1,
    // vUv.y + cos(vUv.x * 9.0) * 0.1
    // );
    // float v = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));
    // P39
    // vec2 wavedUv = vec2(
    // vUv.x + cos(vUv.y * 100.0) * 0.1,
    // vUv.y + cos(vUv.x * 100.0) * 0.1
    // );
    // float v = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));
    // P40
    // float angle = atan(vUv.x, vUv.y);
    // float v = angle;
    // P41
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float v = angle;
    // P42
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    //     angle /= PI * 2.0;
    //     angle += 0.5;
    // float v = angle;
    // P43
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
    // float v = mod(angle * 20.0, 1.0);
    // P44
        // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
        // float v = sin(angle * 100.0);
    // P45
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
    // float radius = 0.25 + sin(angle * 100.0) * 0.02;
    // float v = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));
    // P46
    // float v = cnoise(vUv * 10.0);
    // P47
    // float v = step(0.0, cnoise(vUv * 10.0));
    // P48
    // float v = 1.0 - abs(cnoise(vUv * 10.0));
    // P49
    // float v = sin(cnoise(vUv * 10.0) * 20.0);
    // P50
    vec4 asd = vec4(vUv.yx, 1.0);
    float v = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));
   vec3 blackColor = vec3(0.0);
   vec3 uvColor = vec3(vUv, 1.0);
   vec3 mixedColor = mix(blackColor, uvColor, v);
    gl_FragColor = vec4(
    mixedColor,
    1.0
    );  

    // Other
    // float horizontalLines = 10.0 * vUv.x ;
    // float verticalLines = 10.0 * vUv.y ;
    // vec2 center = vec2(0.5, 0.5);
    // vec2 uvPoint = vec2(mod(horizontalLines, 1.0), mod(verticalLines, 1.0));
    // float d = distance(uvPoint, center);
    // float v = d > 0.5 ? 1.0 : 0.0;
    //     gl_FragColor = vec4(
    //     v,
    //     v,
    //     v,
    //     1.0
    //     );  
}