vec3 pointLight(
    vec3 color,
    float intensity,
    vec3 normal,
    vec3 lightPos,
    vec3 viewFrom,
    float specularPower,
    vec3 position,
    float lightDecay
    ) {
        vec3 lightDelta = lightPos - position;
        vec3 lightDirection = normalize(lightDelta);
        // Shading
        float shading = dot(normal, lightDirection);
        float clampedShading =  max(0.0,shading);
        // Specular
        vec3 lightReflection = reflect(-lightDirection, normal);
        float specular = -dot(lightReflection, viewFrom);
        float diminishedSpecular = pow(specular, specularPower);
        float clampedDiminishedSpecular = max(0.0,diminishedSpecular);
        // Diffusion 
        float lightDistance = length(lightDelta);
        float decay = 1.0 - lightDistance * lightDecay;
        float clampedDecay = max(0.0,decay);
        return color * intensity * clampedDecay * (clampedShading + clampedDiminishedSpecular);
        // return vec3(decay);

}