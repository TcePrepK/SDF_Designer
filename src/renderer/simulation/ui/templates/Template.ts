export class Template {
    public body: HTMLDivElement;
    public name: string;

    public constructor(body: HTMLDivElement, name: string) {
        this.body = body;
        this.name = name;
    }

    public activate(): void {
        this.body.classList.add("active");
    }

    public deactivate(): void {
        this.body.classList.remove("active");
    }
}