import { checkFor } from "../utils";
import { UniformManager } from "./uniformManager";
import { GlobalVariables } from "../globalVariables";
import { Logger } from "../logger";

export abstract class BaseShader {
    private readonly shaderName: string;

    public readonly program: WebGLProgram;
    private programEnabled = false;

    private uniformQueue = new Array<{ name: string, data: unknown }>();

    private vertexShader!: WebGLShader;
    private fragmentShader!: WebGLShader;

    private readonly vertexData: string;
    private readonly fragmentData: string;
    private uniformLoader!: UniformManager;

    private logger: Logger;

    protected constructor(shaderName: string, vertexData: string, fragmentData: string) {
        this.logger = new Logger(shaderName, "💡");

        this.shaderName = shaderName;
        this.vertexData = vertexData;
        this.fragmentData = fragmentData;

        const ctx = GlobalVariables.ctx;
        const shaderProgram = ctx.createProgram();
        checkFor(shaderProgram, `${shaderName} program unable to initialize!`, ctx.getProgramInfoLog(shaderProgram as WebGLProgram));
        this.program = shaderProgram;

        this.initialize();
    }

    public initialize(): void {
        const ctx = GlobalVariables.ctx;
        this.vertexShader = this.createShader(ctx, ctx.VERTEX_SHADER, this.vertexData);
        this.fragmentShader = this.createShader(ctx, ctx.FRAGMENT_SHADER, this.fragmentData);

        ctx.attachShader(this.program, this.vertexShader);
        ctx.attachShader(this.program, this.fragmentShader);
        ctx.linkProgram(this.program);

        if (!ctx.getProgramParameter(this.program, ctx.LINK_STATUS)) {
            alert("Unable to initialize the shader program: " + ctx.getProgramInfoLog(this.program));
            return;
        }

        this.uniformLoader = new UniformManager(this.program);
        this.logger.log(`Shader "${this.shaderName}" has loaded!`);
    }

    public beginShader(): void {
        GlobalVariables.ctx.useProgram(this.program);
        this.programEnabled = true;

        this.handleUniformQueue();
    }

    public stopShader(): void {
        GlobalVariables.ctx.useProgram(null);
        this.programEnabled = false;
    }

    loadUniform<T>(name: string, data: T): void {
        if (this.programEnabled) {
            this.uniformLoader.loadData(name, data);
            return;
        }

        const alreadyQueued = this.uniformQueue.findIndex(a => a.name === name);
        if (alreadyQueued >= 0) {
            this.uniformQueue[alreadyQueued].data = data;
            return;
        }

        const request = { name, data };
        // this.logger.log("Shader has received uniform request!", request);
        this.uniformQueue.push(request);
    }

    private handleUniformQueue(): void {
        if (!this.programEnabled) return;
        while (this.uniformQueue.length > 0) {
            const request = this.uniformQueue.shift();
            if (!request) continue;
            this.uniformLoader.loadData(request.name, request.data);
        }
    }

    private createShader(gl: WebGLRenderingContext, type: number, data: string): WebGLShader {
        const shader = gl.createShader(type);
        checkFor(shader, "Unable to create simulation");

        gl.shaderSource(shader, data);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            this.logger.throw(info ?? "Failed to load shader");
        }

        return shader;
    }
}