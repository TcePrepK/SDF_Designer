import { BaseShader } from "../../core/webgl/baseShader";
import { VectorI2D } from "../../core/vector2D";

export class MainShader extends BaseShader {
    public constructor() {
        super("main",
            `#version 300 es
precision mediump float;

in vec4 in_position;

void main() {
    gl_Position = in_position;
}`,
            `#version 300 es
precision mediump float;

struct Circle {
    vec4 data;
};

uniform int size;
layout(std140) uniform Circles {
    Circle circles[32];
};

out vec4 out_color;

void main() {
    out_color = vec4(1.0, 0.0, 0.0, 1.0);
    
    if (size > 0) {
        out_color = vec4(0.0, 1.0, 1.0, 1.0);
        out_color.rgb = circles[0].data.xyz;
    }
}`);
    }

    public loadResolution(width: number, height: number): void {
        this.loadUniform("resolution", new VectorI2D(width, height));
    }
}