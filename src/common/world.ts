import { createNoise2D } from 'simplex-noise';
import alea from 'alea';
import Cell from './cell';
// import {
//     IServiceGameData,
//     IPosition,
// } from './utils';

export class World {
    private fieldCols: number;

    private fieldRows: number;

    private _field: Array<Cell>;

    private cellWidthPx: number = 10;

    private cellHeightPx: number = 10;

    constructor(
        fieldCols: number,
        fieldRows: number,
    ) {
        this.fieldCols = fieldCols;
        this.fieldRows = fieldRows;
        this._field = [];
        this.initField();
    }

    incCellWidth(amount: number = 1) {
        this.cellWidthPx += amount;
    }

    decCellWidth(amount: number = 1) {
        if (this.cellWidthPx < 2) return;
        this.cellWidthPx -= amount;
    }

    setCellWidth(amount: number = 1) {
        this.cellWidthPx = amount;
    }

    incCellHeight(amount: number = 1) {
        this.cellHeightPx += amount;
    }

    decCellHeight(amount: number = 1) {
        if (this.cellHeightPx < 2) return;
        this.cellHeightPx -= amount;
    }

    setCellHeight(amount: number = 1) {
        this.cellHeightPx = amount;
    }

    initField(
        cols: number = this.fieldCols,
        rows: number = this.fieldRows,
        type: number = 0,
    ): void {
        this._field = [];
        if (!cols || !rows) {
            return;
        }
        this._field = new Array<Cell>(cols * rows)
            .fill(new Cell(type));
    }

    resizeField(newCols: number, newRows: number): this {
        this.fieldCols = newCols;
        this.fieldRows = newRows;
        this.initField();
        return this;
    }

    randomizeField(
        cols: number = this.fieldCols,
        rows: number = this.fieldRows,
    ): void {
        this._field = [];
        if (!cols || !rows) {
            return;
        }
        const len = cols * rows;
        for (let i = 0; i < len; i += 1) {
            this._field.push(new Cell(Cell.maxHeight * Math.random()));
        }
    }

    generateNoise(
        seed: any,
        cols: number = this.fieldCols,
        rows: number = this.fieldRows,
    ) {
        const prng = alea(seed);
        const noise2D = createNoise2D(prng);
        this._field = [];
        if (!cols || !rows) {
            return;
        }
        const len = cols * rows;
        for (let i = 0; i < len; i += 1) {
            const currCol = i % cols;
            const currRow = Math.floor(Math.max(i / cols, 0));
            const height = noise2D(currCol, currRow) + 1;
            this._field.push(
                new Cell(
                    ((height / 2) * Cell.maxHeight),
                ),
            );
        }
    }

    clearField(): this {
        this.initField();
        return this;
    }

    getCell(x: number, y: number) {
        if (x >= this.fieldCols || y >= this.fieldRows) throw new Error(`Cell (${x};${y}) out of bounds.`);
        return this._field[y * this.fieldCols + x];
    }

    setCellRenderSize(cellWidthPx: number, cellHeightPx: number) {
        this.cellWidthPx = cellWidthPx;
        this.cellHeightPx = cellHeightPx;
        return this;
    }

    drawBox(ctx: CanvasRenderingContext2D, xOffset: number = 0, yOffset: number = 0) {
        ctx.strokeStyle = 'black';
        ctx.strokeRect(
            xOffset,
            yOffset,
            this.fieldCols * this.cellWidthPx,
            this.fieldRows * this.cellHeightPx,
        );
    }

    render(ctx: CanvasRenderingContext2D, xOffset: number = 0, yOffset: number = 0) {
        for (let row = 0; row < this.fieldRows; row += 1) {
            const cellCenterY = Math.floor(
                (this.cellHeightPx / 2) + (this.cellHeightPx * row),
            ) + yOffset;
            for (let col = 0; col < this.fieldCols; col += 1) {
                const cellCenterX = Math.floor(
                    (this.cellWidthPx / 2) + (this.cellWidthPx * col),
                ) + xOffset;
                this.getCell(col, row).render(
                    ctx,
                    { x: cellCenterX, y: cellCenterY },
                    this.cellWidthPx,
                    this.cellHeightPx,
                );
            }
        }
        this.drawBox(ctx, xOffset, yOffset);
    }

    stringifyField(printBox: boolean = false): string {
        const sets = [
            ['┌', '─┬', '─┐'],
            ['├', '─┼', '─┤'],
            ['└', '─┴', '─┘'],
        ];
        let resultString: string = '';
        for (let row = 0; row < this.fieldRows; row += 1) {
            if (printBox) {
                const charset = row ? sets[1] : sets[0];
                resultString += charset[0];
                for (let i = 0; i < this.fieldCols - 1; i += 1) {
                    resultString += charset[1];
                }
                resultString += `${charset[2]}\n`;
            }
            for (let col = 0; col < this.fieldCols; col += 1) {
                const char = this._field[row * this.fieldCols + col] ? Math.ceil(this._field[row * this.fieldCols + col].height) : ' ';
                resultString += printBox ? `│${char}` : char;
            }
            resultString += printBox ? '│\n' : '\n';
        }
        if (printBox) {
            resultString += sets[2][0];
            for (let i = 0; i < this.fieldCols - 1; i += 1) {
                resultString += sets[2][1];
            }
            resultString += `${sets[2][2]}\n`;
        }
        return resultString;
    }
}

export default World;
