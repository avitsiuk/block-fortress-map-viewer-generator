export class DrawApp {
    private canvas: HTMLCanvasElement;

    private ctx2d: CanvasRenderingContext2D;

    private canvasWidth: number;
    private canvasHeight: number;

    constructor(canvasElemId: string) {
        if (!document.getElementById(canvasElemId)) {
            throw new Error(`Canvas element "${canvasElemId}" not found.`);
        }
        this.canvas = (document.getElementById(canvasElemId) as HTMLCanvasElement);
        const { width, height } = this.canvas.getBoundingClientRect();
        this.canvasWidth = 
    }

    get canvasWidth(): number {
        return this.canvas.getBoundingClientRect().width;
    }

    get canvasHeight(): number {
        return this.canvas.getBoundingClientRect().height;
    }
}

export default DrawApp;
