vec3 directionalLight(
    vec3 color,
    float intensity,
    vec3 normal,
    vec3 position,
    vec3 viewFrom,
    float specularPower
    ) {
        vec3 lightDirection = normalize(position);
        vec3 lightReflection = reflect(-lightDirection, normal);
        float shading = dot(normal, lightDirection);
        float clampedShading =  max(0.0,shading);
        float specular = -dot(lightReflection, viewFrom);
        float diminishedSpecular = pow(specular, specularPower);
        float clampedDiminishedSpecular = max(0.0,diminishedSpecular);
        return color * intensity * (clampedShading + clampedDiminishedSpecular);
        // return vec3(clampedDiminishedSpecular);

}