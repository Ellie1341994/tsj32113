varying vec3 vNormal;
varying vec3 vPos;
void main(){
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    
    // 
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
    // varying
    vNormal = modelNormal.xyz;
    vPos = modelPosition.xyz;

}