export class Vector3D {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = this.cast(x);
        this.y = this.cast(y);
        this.z = this.cast(z);
    }

    public mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public add(v: Vector3D): Vector3D {
        return new Vector3D(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    public sub(v: Vector3D): Vector3D {
        return new Vector3D(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    public mul(v: Vector3D): Vector3D {
        return new Vector3D(this.x * v.x, this.y * v.y, this.z * v.z);
    }

    public mulScalar(n: number): Vector3D {
        return new Vector3D(this.x * n, this.y * n, this.z * n);
    }

    public div(v: Vector3D): Vector3D {
        return new Vector3D(this.x / v.x, this.y / v.y, this.z / v.z);
    }

    public dot(v: Vector3D): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    public cross(vector: Vector3D): Vector3D {
        const x = this.y * vector.z - this.z * vector.y;
        const y = this.z * vector.x - this.x * vector.z;
        const z = this.x * vector.y - this.y * vector.x;
        return new Vector3D(x, y, z);
    }

    public length(): number {
        return Math.sqrt(this.dot(this));
    }

    protected cast(n: number): number {
        return n;
    }

    public toString(): string {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }
}

export class VectorI3D extends Vector3D {
    protected cast(n: number): number {
        return Math.floor(n);
    }
}

export class Color extends Vector3D {
    public constructor(r: number, g: number, b: number) {
        super(r, g, b);
    }

    get r(): number {
        return this.x;
    }

    get g(): number {
        return this.y;
    }

    get b(): number {
        return this.z;
    }

    set r(value: number) {
        this.x = value;
    }

    set g(value: number) {
        this.y = value;
    }

    set b(value: number) {
        this.z = value;
    }
}