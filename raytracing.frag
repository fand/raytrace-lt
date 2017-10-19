/*{
    "pixelRatio": 1,
    "glslify": true
}*/
precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D v1;
uniform sampler2D v2;
uniform sampler2D v3;

const float PI = 3.1415926535897932384626433;
vec2 map(vec3 p);
#pragma glslify: square = require('glsl-square-frame')
#pragma glslify: camera = require('glsl-camera-ray')
#pragma glslify: raytrace = require('glsl-raytrace', map = map, steps = 90)
#pragma glslify: getNormal = require('glsl-sdf-normal', map = map)

float t(){
    return time * 1.;
}

vec2 map(vec3 p) {
    return vec2(10);

    // p = mod(p, 2.) - 1.;

    float windows = length(p) - 1.;
    return vec2(windows, 1.);
}

void main (void) {
    vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
    vec2 uv = gl_FragCoord.xy / resolution;

    vec3 rayOrigin = vec3(0, 2, 10);
    vec3 rayTarget = vec3(0, 0, 0);
    // rayOrigin.z += time;
    vec3 rayDirection = camera(rayOrigin, rayTarget, square(resolution), 2.);
    // rayDirection.x += sin(time) * .2;
    // rayDirection.y += cos(time) * .2;

    vec3 lightDir = normalize(vec3(0, 2, 1.));
    vec3 light = vec3(.7);
    vec3 ambient = vec3(.3, .4, .5);

    vec2 collision = raytrace(rayOrigin, rayDirection, 40., 0.001);
    if (collision.x > -.5) {
        vec3 pos = rayOrigin + rayDirection * collision.x;
        vec3 normal = getNormal(pos);
        float diff = clamp(dot(lightDir, normal), 0., 2.0);
        vec3 c = diff * light + ambient;

        gl_FragColor = vec4(c, 1.0);
        // gl_FragColor -= texture2D(v1, uv);
    }
    else {
        gl_FragColor = vec4(1. - length(p) * .3);
        gl_FragColor += vec4(p.x * .1, p.y * .1, 1, 1);
    }
}
