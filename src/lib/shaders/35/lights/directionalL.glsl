vec3 directionalLight(
    vec3 color,
    float intensity,
    vec3 position,
    vec3 normal
    ) {
        vec3 direction = normalize(position);
        float shading = dot(normal, direction);
        // return color * intensity;
        return vec3(shading);

}