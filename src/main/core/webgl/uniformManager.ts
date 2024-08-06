import { GlobalVariables } from "../globalVariables";
import { Logger } from "../logger";
import { PreInitializedUniform, ShaderUniform } from "./shaderUniform";
import { UniformRegistry } from "./uniformRegistry";

const logger = new Logger("Uniform Loader");

export class UniformManager {
    private readonly nonExistenceNames = new Set<string>();
    private readonly nameToVariable = new Map<string, ShaderUniform>();
    private readonly program!: WebGLProgram;

    public constructor(program: WebGLProgram) {
        this.program = program;
    }

    public registerUniform(preInit: PreInitializedUniform): ShaderUniform | null {
        const name = preInit.name;
        const location = GlobalVariables.ctx.getUniformLocation(this.program, name);
        if (!location) {
            this.nonExistenceNames.add(name);
            logger.warn(`Uniform variable "${name}" is not used!`);
            return null;
        }

        const variable = new ShaderUniform(preInit, location);
        this.nameToVariable.set(name, variable);

        return variable;
    }

    public loadData<T>(name: string, data: T): void {
        if (this.nonExistenceNames.has(name)) return;

        const location = GlobalVariables.ctx.getUniformLocation(this.program, name);
        if (!location) {
            this.nonExistenceNames.add(name);
            logger.warn(`Uniform variable "${name}" is not used!`);
            return;
        }

        UniformRegistry.load(location, data);
    }

    public attachVariable<T, K extends keyof T>(name: string, holder: T, variable: K): void {
        const uniform = this.getUniform(name);
        if (!uniform) return;

        uniform.attachVariable(holder, variable);
    }

    private getUniform(name: string): ShaderUniform | undefined {
        if (this.nonExistenceNames.has(name)) return;

        const uniform = this.nameToVariable.get(name);
        if (!uniform) {
            logger.warn(`Uniform variable "${name}" does not exist!`);
            this.nonExistenceNames.add(name);
        }

        return uniform;
    }
}