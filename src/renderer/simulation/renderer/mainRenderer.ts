import { MainShader } from "./mainShader";
import { GlobalVariables } from "../../core/globalVariables";
import { UniformBuffer } from "../../core/webgl/uniformBuffer";
import { Integer } from "../../core/types";

export class MainRenderer {
    private vertices = new Float32Array([
        -1.0, -1.0, 0.0,  // bottom left
        1.0, -1.0, 0.0,  // bottom right
        -1.0, 1.0, 0.0,  // top left
        1.0, 1.0, 0.0   // top right
    ]);

    private readonly mainShader: MainShader;

    private uniformBuffer!: UniformBuffer;

    public constructor() {
        this.mainShader = new MainShader();
    }

    public initialize(): void {
        const canvas = GlobalVariables.canvas;
        canvas.onResize.add(this.mainShader.loadResolution.bind(this.mainShader));
        this.mainShader.loadResolution(canvas.WIDTH, canvas.HEIGHT);

        const ctx = GlobalVariables.ctx;
        canvas.onResize.add((width, height) => {
            ctx.viewport(0, 0, width, height);
        });

        this.uniformBuffer = new UniformBuffer(this.mainShader.program, "Circles", new Float32Array(32 * 4), 0);
        this.updateUniformBuffer([1, 1, 0, 1], 0);
    }

    private updateUniformBuffer(data: Array<number>, offset = 0): void {
        this.uniformBuffer.update(data, offset);
        this.mainShader.loadUniform("size", new Integer(data.length / 4));

        this.mainShader.beginShader();
        this.uniformBuffer.bind();
        this.mainShader.stopShader();
    }

    public frameUpdate(): void {
        const ctx = GlobalVariables.ctx;
        { // Clean Screen
            ctx.clearColor(1.0, 0.0, 0.0, 1.0);
            ctx.clear(ctx.COLOR_BUFFER_BIT);
        }

        { // Main Shader
            this.mainShader.beginShader();

            // Create a buffer and put the vertices in it
            const vertexBuffer = ctx.createBuffer();
            ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexBuffer);
            ctx.bufferData(ctx.ARRAY_BUFFER, this.vertices, ctx.STATIC_DRAW);

            const positionLocation = ctx.getAttribLocation(this.mainShader.program, "in_position");
            ctx.enableVertexAttribArray(positionLocation);
            ctx.vertexAttribPointer(positionLocation, 3, ctx.FLOAT, false, 0, 0);

            // Draw the square
            ctx.clear(ctx.COLOR_BUFFER_BIT);
            ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);

            this.mainShader.stopShader();
        }
    }
}
