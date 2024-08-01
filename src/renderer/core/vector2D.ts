export class Vector2D {
    public readonly x: number;
    public readonly y: number;

    public constructor(x: number, y: number) {
        this.x = this.cast(x);
        this.y = this.cast(y);
    }

    public add(v: Vector2D): Vector2D {
        return new Vector2D(this.x + v.x, this.y + v.y);
    }

    public sub(v: Vector2D): Vector2D {
        return new Vector2D(this.x - v.x, this.y - v.y);
    }

    public mul(v: Vector2D): Vector2D {
        return new Vector2D(this.x * v.x, this.y * v.y);
    }

    public mulScalar(n: number): Vector2D {
        return new Vector2D(this.x * n, this.y * n);
    }

    public div(v: Vector2D): Vector2D {
        return new Vector2D(this.x / v.x, this.y / v.y);
    }

    public mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public dot(v: Vector2D): number {
        return this.x * v.x + this.y * v.y;
    }

    protected cast(n: number): number {
        return n;
    }

    public toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}

export class VectorI2D extends Vector2D {
    protected cast(n: number): number {
        return Math.floor(n);
    }
}
