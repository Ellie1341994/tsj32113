varying vec2 uVv;

void main()
{
 gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
 uVv = uv;
}