import {Vector2D} from "../../core/vector2D";
import {NodePort} from "../nodes/NodePort";

export class VisualConnection {
    /**
     * Calculates the position of a port
     * @param port
     */
    public static positionFromPort(port: NodePort): Vector2D {
        const box = port.port.getBoundingClientRect();
        return new Vector2D(box.left + box.width / 2, box.top + box.height / 2);
    }

    /**
     * Draws a bezier curve from A to B
     * @param ctx
     * @param A
     * @param B
     * @param overrideColor
     */
    public static drawAtoB(ctx: CanvasRenderingContext2D, A: Vector2D, B: Vector2D, overrideColor: string | null = null): void {
        const dist = A.sub(B).mag();
        const totalTime = Math.round(dist / 15);

        for (let i = 0; i <= totalTime; i++) {
            const it = i / totalTime;

            const s = it * (1 - it);
            // const s = 0.75;
            const smoothT = 3 * it * it - 2 * it * it * it;
            const t = smoothT * s + it * (1 - s);

            // Cubic Bezier
            const x = A.x * (1 - t) ** 3 + 3 * (A.x + B.x) / 2 * (1 - t) * t + B.x * t ** 3;
            const y = A.y * (1 - t) ** 2 * (1 + 2 * t) + B.y * t * t * (3 - 2 * t);

            ctx.strokeStyle = overrideColor ?? "#999";
            ctx.lineWidth = 2;

            const r = i === 0 || i === totalTime ? 5 : 3;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
}