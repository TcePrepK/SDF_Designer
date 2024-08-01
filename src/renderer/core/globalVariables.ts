import { VectorI2D } from "./vector2D";
import { Canvas } from "./canvas";
import { Mouse } from "./mouse";

export class GlobalVariables {
    public static time: number = 0;

    public static mouse: Mouse;

    public static resolution: VectorI2D;

    public static canvas: Canvas;
    public static ctx: WebGL2RenderingContext;
}