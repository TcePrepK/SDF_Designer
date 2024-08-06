/* eslint-disable */

import { checkFor } from "../utils";
import { Float, Integer } from "../types";
import { Vector2D, VectorI2D } from "../vector2D";
import { GlobalVariables } from "../globalVariables";
import { Color, Vector3D, VectorI3D } from "../vector3D";
import { UniformBuffer } from "./uniformBuffer";

type UniformRunnable<T> = (loc: WebGLUniformLocation, val: T) => void;
export type UniformType<T> = new (...args: any[]) => T;

export class UniformRegistry {
    private static readonly loadMethods = new Map<Function, UniformRunnable<never>>();

    public static initialize(): void {
        const ctx = GlobalVariables.ctx;

        this.loadMethods.set(Number, (loc, v: number) => ctx.uniform1f(loc, v));
        this.loadMethods.set(Float, (loc, v: Float) => ctx.uniform1f(loc, v.valueOf()));
        this.loadMethods.set(Integer, (loc, v: Integer) => ctx.uniform1i(loc, v.valueOf()));
        this.loadMethods.set(VectorI2D, (loc, v: VectorI2D) => ctx.uniform2i(loc, v.x, v.y));
        this.loadMethods.set(Vector2D, (loc, v: Vector2D) => ctx.uniform2f(loc, v.x, v.y));
        this.loadMethods.set(VectorI3D, (loc, v: VectorI3D) => ctx.uniform3i(loc, v.x, v.y, v.z));
        this.loadMethods.set(Vector3D, (loc, v: Vector3D) => ctx.uniform3f(loc, v.x, v.y, v.z));
        this.loadMethods.set(Color, (loc, v: Color) => ctx.uniform3f(loc, v.r, v.g, v.b));
    }

    public static load<T>(loc: WebGLUniformLocation, val: T): void {
        // @ts-ignore
        const func = this.loadMethods.get(val.constructor as UniformType<T>) as UniformRunnable<T>;
        // @ts-ignore
        checkFor(func, `Load method for ${val.constructor.name} is not supported`);

        func(loc, val);
    }
}