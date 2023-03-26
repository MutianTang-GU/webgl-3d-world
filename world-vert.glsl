#version 300 es

precision mediump float;

in vec3 vertPosition;
in vec3 vertNormal;
out vec3 v_color;

uniform mat4 viewMatrix;
uniform mat4 modelToWorldMatrix;
uniform mat4 projMatrix;

uniform vec3 lightDirection;

uniform vec3 ambientLightColor;
uniform vec3 materialColor;
uniform vec3 diffuseLightColor;

void main() {
    gl_Position = projMatrix * viewMatrix * modelToWorldMatrix * vec4(vertPosition, 1.0);
    
    // Iambient  = IambientColor * MaterialColor
    vec3 Iambient = ambientLightColor * materialColor;

    mat4 normalMatrix = transpose(inverse(viewMatrix * modelToWorldMatrix));

    vec3 N = normalize((normalMatrix * vec4(vertNormal, 0.0)).xyz);

    vec3 fragPosition = (modelToWorldMatrix * vec4(vertPosition, 1.0)).xyz;

    vec3 L = normalize(lightDirection - fragPosition);

    float lambert = max(0.0, dot(N, L));

    // Idiffuse = IdiffuseColor * MaterialColor * max(0, dot(N, L))
    v_color = diffuseLightColor * materialColor * lambert + Iambient;
}