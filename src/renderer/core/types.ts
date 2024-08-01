export class Integer extends Number {
    public constructor(value: number) {
        super(Math.floor(value));
    }
}

export class Float extends Number {
}