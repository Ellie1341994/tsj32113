uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;
attribute float aSize;
attribute float aTimeMultiplier;
#include utils/remap;
void main(){
    // Animation
    float progress = uProgress * aTimeMultiplier;
    vec3 newPosition = position;
    //  Explotion
    float explotionProgress = remap(progress, 0.0, 0.1, 0.0,1.0);
    explotionProgress = clamp(explotionProgress, 0.0, 1.0);
    explotionProgress = 1.0 - pow(1.0 - explotionProgress, 3.0);
    newPosition *= explotionProgress;
    //  Falling
    float fallingProgress = remap(progress, 0.1, 1.0, 0.0,1.0);
    fallingProgress = clamp(fallingProgress, 0.0, 1.0);
    fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);
    newPosition.y -= fallingProgress * 0.25;
    //  Scaling
    float scaleOpeningProgress = remap(progress, 0.0, 0.125, 0.0, 1.0);
    float scaleClosingProgress = remap(progress, 0.125, 1.0, 1.0, 0.0);
    float sizeProgress = min(scaleOpeningProgress,scaleClosingProgress);
    sizeProgress = clamp(sizeProgress, 0.0,1.0);
    //  Twinkling
    float twinklingProgress = remap(progress,0.4,0.0,0.0,1.0);
    twinklingProgress = clamp(twinklingProgress, 0.0,1.0);
    float sizeTwinkling = sin (progress * 30.0) * 0.5 + 1.0;
    sizeTwinkling = 1.0 - sizeTwinkling * twinklingProgress;
    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    // Final size
    gl_PointSize = uSize * uResolution.y * aSize * sizeProgress * sizeTwinkling;
    gl_PointSize *= 1.0 / - viewPosition.z;
    if(gl_PointSize < 1.0){
        gl_Position = vec4(999.0);
    }
}