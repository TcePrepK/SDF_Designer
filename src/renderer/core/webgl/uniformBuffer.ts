import { GlobalVariables } from "../globalVariables";

export class UniformBuffer {
    private readonly program: WebGLProgram;
    private readonly name: string;

    private readonly boundLocation: number;
    private readonly data: Float32Array;
    private readonly buffer: WebGLBuffer | null;

    public constructor(program: WebGLProgram, name: string, data: Float32Array, boundLocation: number) {
        this.program = program;
        this.name = name;

        this.boundLocation = boundLocation;
        this.data = data;

        const ctx = GlobalVariables.ctx;
        this.buffer = ctx.createBuffer();

        ctx.bindBuffer(ctx.UNIFORM_BUFFER, this.buffer);
        // ctx.bufferData(ctx.UNIFORM_BUFFER, this.data.length, ctx.STATIC_DRAW);
        // ctx.bindBufferRange(ctx.UNIFORM_BUFFER, this.boundLocation, this.buffer, 0, this.data.length);

        ctx.bufferData(ctx.UNIFORM_BUFFER, this.data, ctx.DYNAMIC_DRAW);
        ctx.bindBuffer(ctx.UNIFORM_BUFFER, null);
        ctx.bindBufferBase(ctx.UNIFORM_BUFFER, this.boundLocation, this.buffer);
    }

    public update(data: Array<number>, offset = 0): void {
        this.data.set(data, offset);

        console.log(this.data);

        const ctx = GlobalVariables.ctx;
        ctx.bindBuffer(ctx.UNIFORM_BUFFER, this.buffer);
        ctx.bufferSubData(ctx.UNIFORM_BUFFER, 0, this.data, 0, this.data.length);
        ctx.bindBuffer(ctx.UNIFORM_BUFFER, null);
        ctx.bindBufferBase(ctx.UNIFORM_BUFFER, this.boundLocation, this.buffer);
    }

    public bind(): void {
        const ctx = GlobalVariables.ctx;
        ctx.uniformBlockBinding(this.program, ctx.getUniformBlockIndex(this.program, this.name), this.boundLocation);
    }
}