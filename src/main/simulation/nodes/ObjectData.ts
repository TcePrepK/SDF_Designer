export abstract class ObjectData {
    public x!: number;
    public y!: number;
    public width!: number;
    public height!: number;
    public rotation!: number;

    public id!: number;
    public radius!: number;
    public zIndex!: number;

    public serialize(): Array<number> {
        return [this.x, this.y, this.width, this.height, this.rotation, this.radius, this.id, this.zIndex];
    }
}