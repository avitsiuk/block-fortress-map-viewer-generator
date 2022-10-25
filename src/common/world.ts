export class World {
    private maxX: number = 1;

    private maxY: number = 1;

    private field: Array<string | null> = [];

    private setDimensions(x: number, y: number): void {
        const _x = Math.floor(x);
        this.maxX = _x || 1;
        const _y = Math.floor(y);
        this.maxY = _y || 1;
    }

    private initField(): void {
        this.field = new Array<string | null>(this.maxX * this.maxY).fill(null);
    }

    constructor(x: number, y: number) {
        this.setDimensions(x, y);
        this.initField();
    }

    clearField(): this {
        this.initField();
        return this;
    }

    resizeField(x: number, y: number): this {
        this.setDimensions(x, y);
        this.initField();
        return this;
    }

    stringifyField(printBox: boolean = false): string {
        const sets = [
            ['┌', '─┬', '─┐'],
            ['├', '─┼', '─┤'],
            ['└', '─┴', '─┘'],
        ];
        let resultString: string = '';
        for (let y = 0; y < this.maxY; y += 1) {
            if (printBox) {
                const charset = y ? sets[1] : sets[0];
                resultString += charset[0];
                for (let i = 0; i < this.maxX - 1; i += 1) {
                    resultString += charset[1];
                }
                resultString += `${charset[2]}\n`;
            }
            for (let x = 0; x < this.maxX; x += 1) {
                const char = this.field[y * this.maxX + x] ? 'o' : ' ';
                resultString += printBox ? `│${char}` : char;
            }
            resultString += printBox ? '│\n' : '\n';
        }
        if (printBox) {
            resultString += sets[2][0];
            for (let i = 0; i < this.maxX - 1; i += 1) {
                resultString += sets[2][1];
            }
            resultString += `${sets[2][2]}\n`;
        }
        return resultString;
    }
}

export default World;
