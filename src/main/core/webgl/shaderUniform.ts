import { Vector2D, VectorI2D } from "../vector2D";
import { Color, Vector3D, VectorI3D } from "../vector3D";
import { Logger } from "../logger";
import { UniformRegistry, UniformType } from "./uniformRegistry";
import { Float, Integer } from "../types";

export type PreInitializedUniform = {
    name: string;
    type: string;
    options?: string
}

type UniformResponder = (name: string, value: any) => void;

const logger = new Logger("ShaderUniform", "💅");

export class ShaderUniform {
    private static readonly INITIAL_REGEX = /<(.*)>/;
    private static readonly COLOR_REGEX = /RGB\s+<(\d+(\.\d+)?,\s*\d+(\.\d+)?,\s*\d+(\.\d+)?)>/;
    private static readonly SLIDER_REGEX = /\[.*]/;
    private static typeMap = new Map<string, UniformType<any>>();
    private static typeSizeMap = new Map<UniformType<any>, number>();

    private readonly name: string;
    private type!: UniformType<unknown>;
    private typeSize!: number;
    private attachedData!: { holder: unknown, variable: unknown };
    private updateResponse!: UniformResponder;

    private readonly range: Array<unknown> = [];
    private readonly step: Array<number> = [];

    private readonly location!: WebGLUniformLocation;

    static {
        ShaderUniform.typeMap.set("int", Integer);
        ShaderUniform.typeMap.set("float", Float);
        ShaderUniform.typeMap.set("vec2", Vector2D);
        ShaderUniform.typeMap.set("ivec2", VectorI2D);
        ShaderUniform.typeMap.set("vec3", Vector3D);
        ShaderUniform.typeMap.set("ivec3", VectorI3D);

        ShaderUniform.typeSizeMap.set(Vector2D, 2);
        ShaderUniform.typeSizeMap.set(VectorI2D, 2);
        ShaderUniform.typeSizeMap.set(Vector3D, 3);
        ShaderUniform.typeSizeMap.set(VectorI3D, 3);
        ShaderUniform.typeSizeMap.set(Color, 3);
    }

    constructor(preInit: PreInitializedUniform, location: WebGLUniformLocation) {
        this.name = preInit.name;
        this.location = location;
        this.resolveType(preInit.type);
        this.resolveOptions(preInit.options);
    }

    public setUpdateResponse(response: UniformResponder): void {
        this.updateResponse = response;
        if (this.attachedData && this.attachedData.holder === this) {
            // @ts-ignore
            this.updateResponse(this.name, this.fixType(this[this.name]));
        }
    }

    public attachVariable<T, K extends keyof T>(holder: T, variable: K, data: unknown = undefined): void {
        data ??= holder[variable];
        if (data === undefined) {
            logger.throw(`Variable "${String(variable)}" not found in "${holder}"`);
        }

        const typeSize = this.typeSize;
        if (typeSize > 1) {
            // @ts-ignore
            holder[variable] = new Proxy(data, {
                set: (target, prop, value): boolean => {
                    this.updateResponse(this.name, this.fixType(target));
                    return Reflect.set(target, prop, value);
                }
            });
            data = holder[variable];
        }

        // @ts-ignore
        holder[`uniform_${variable}`] = data;
        Object.defineProperty(holder, variable, {
            // @ts-ignore
            get: () => holder[`uniform_${variable}`]?.valueOf(),
            set: (value) => {
                // @ts-ignore
                holder[`uniform_${variable}`] = value;
                this.updateResponse(this.name, this.fixType(value));
            }
        });

        this.attachedData = { holder, variable };
        if (this.updateResponse) this.updateResponse(this.name, this.fixType(data));
    }

    public loadData<T>(newData: T): void {
        UniformRegistry.load(this.location, newData);
    }

    private fixType<T>(data: T): T | Integer | Float {
        if (typeof data !== "number") return data;
        if (this.type === Integer) return new Integer(data);
        return new Float(data);
    }

    private resolveOptions(options?: string): void {
        if (!options) return;

        const colorMatch = options.match(ShaderUniform.COLOR_REGEX);
        const sliderMatch = options.match(ShaderUniform.SLIDER_REGEX);
        if (sliderMatch) {
            const range = sliderMatch[0];
            const stripped = range.replace(/[[\]]/g, "");
            const allOptions = stripped.split(":").map(a => a.replace(/[()]/g, ""));
            if (allOptions.length < 2) return;

            const minVals = allOptions[0].split(",").map(Number);
            const maxVals = allOptions[1].split(",").map(Number);

            const minimums = [0, 0, 0].map((_, i) => Math.min(minVals[i], maxVals[i]));
            const maximums = [0, 0, 0].map((_, i) => Math.max(minVals[i], maxVals[i]));
            this.range.push(new this.type(...minimums), new this.type(...maximums));

            const stepVals = allOptions[2]?.split(",").map(Number);
            this.step.push(...stepVals ?? []);
        } else if (this.type === Vector3D && colorMatch) {
            this.type = Color;
        }

        const initialMatch = options.match(ShaderUniform.INITIAL_REGEX);
        if (initialMatch) {
            const value = initialMatch[1].split(",").map(Number);
            // @ts-ignore
            this.attachVariable(this, this.name, new this.type(...value));
            // this.attachedData[this.name] = new this.type(...value);
        }
    }

    private resolveType(type: string): void {
        const typeObj = ShaderUniform.typeMap.get(type);
        if (!typeObj) {
            logger.error(`Invalid/Unregistered type: ${type}`);
            return;
        }

        this.type = typeObj;

        const typeSize = ShaderUniform.typeSizeMap.get(typeObj);
        this.typeSize = typeSize ?? 1;
    }
}