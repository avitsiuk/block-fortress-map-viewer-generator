// import { createNoise2D } from 'simplex-noise';
// import alea from 'alea';
import {
    IDim,
    IDimSafe,
    TCellType,
} from './types';
import {
    dimSafe,
} from './utils';
import Cell from './cell';

export const defWorldDims: IDimSafe = { x: 1, y: 1, z: 1 };

export const defCellType: TCellType = '';

type TFieldType = Array<Cell>;

export class World {
    private _fieldDims: IDimSafe = defWorldDims;

    private _field: TFieldType = [];

    seed: number;

    constructor(
        dims: IDim = defWorldDims,
        initCellType: TCellType = defCellType,
        seed: number = 0,
    ) {
        this.seed = seed;
        this.setFieldDims(dims);
        this.initField(initCellType);
    }

    setFieldDims(newDims: IDim) {
        this._fieldDims = dimSafe(newDims);
        return this;
    }

    initField(initCellType: TCellType = defCellType) {
        this._field = [];
        this._field = new Array<Cell>(this._fieldDims.x * this._fieldDims.y * this._fieldDims.z)
            .fill(new Cell(initCellType));
        return this;
    }

    clearField(initCellType: TCellType = defCellType) {
        return this.initField(initCellType);
    }

    randSeed() {
        this.seed = Math.random();
        return this;
    }

    // generateNoise(
    //     seed: any,
    //     saveSeed: boolean = true,
    //     cols: number = this.fieldCols,
    //     rows: number = this.fieldRows,
    // ) {
    //     if (saveSeed) this.seed = seed;
    //     const prng = alea(seed);
    //     const noise2D = createNoise2D(prng);
    //     this._field = [];
    //     if (!cols || !rows) {
    //         return;
    //     }
    //     const len = cols * rows;
    //     for (let i = 0; i < len; i += 1) {
    //         const currCol = i % cols;
    //         const currRow = Math.floor(Math.max(i / cols, 0));
    //         const height = noise2D(
    //             (currCol / this.noiseRes) + (this.panX / this.noiseRes),
    //             (currRow / this.noiseRes) + (this.panY / this.noiseRes),
    //         ) + 1;
    //         this._field.push(
    //             new Cell(
    //                 ((height / 2) * Cell.maxHeight),
    //             ),
    //         );
    //     }
    // }

    // getCell(x: number, y: number) {
    //     if (x >= this.fieldCols || y >= this.fieldRows) throw new Error(`Cell (${x};${y}) out of bounds.`);
    //     return this._field[y * this.fieldCols + x];
    // }

    // setCellRenderSize(cellWidthPx: number, cellHeightPx: number) {
    //     this.cellWidthPx = cellWidthPx;
    //     this.cellHeightPx = cellHeightPx;
    //     return this;
    // }

    // drawBox(ctx: CanvasRenderingContext2D, xOffset: number = 0, yOffset: number = 0) {
    //     ctx.strokeStyle = 'black';
    //     ctx.strokeRect(
    //         xOffset,
    //         yOffset,
    //         this.fieldCols * this.cellWidthPx,
    //         this.fieldRows * this.cellHeightPx,
    //     );
    // }

    // render(ctx: CanvasRenderingContext2D, xOffset: number = 0, yOffset: number = 0) {
    //     // this.generateNoise(this.seed, false);
    //     for (let row = 0; row < this.fieldRows; row += 1) {
    //         for (let col = 0; col < this.fieldCols; col += 1) {
    //             const cellIsoCol = this.fieldRows - 1 + col - row;
    //             const cellIsoRow = col + row;

    //             const cellCenterX = Math.floor(
    //                 (this.cellWidthPx / 2) * (cellIsoCol + 1),
    //             ) + xOffset;

    //             const cellCenterY = Math.floor(
    //                 (this.cellHeightPx / 2) * (cellIsoRow + 1),
    //             ) + yOffset;
    //             this.getCell(col, row).render(
    //                 ctx,
    //                 { x: cellCenterX, y: cellCenterY },
    //                 this.cellWidthPx,
    //                 this.cellHeightPx,
    //             );
    //         }
    //     }
    //     // this.drawBox(ctx, xOffset, yOffset);
    // }

    // stringifyField(printBox: boolean = false): string {
    //     const sets = [
    //         ['┌', '─┬', '─┐'],
    //         ['├', '─┼', '─┤'],
    //         ['└', '─┴', '─┘'],
    //     ];
    //     let resultString: string = '';
    //     for (let row = 0; row < this.fieldRows; row += 1) {
    //         if (printBox) {
    //             const charset = row ? sets[1] : sets[0];
    //             resultString += charset[0];
    //             for (let i = 0; i < this.fieldCols - 1; i += 1) {
    //                 resultString += charset[1];
    //             }
    //             resultString += `${charset[2]}\n`;
    //         }
    //         for (let col = 0; col < this.fieldCols; col += 1) {
    //             const char = this._field[row * this.fieldCols + col] ? Math.ceil(this._field[row * this.fieldCols + col].height) : ' ';
    //             resultString += printBox ? `│${char}` : char;
    //         }
    //         resultString += printBox ? '│\n' : '\n';
    //     }
    //     if (printBox) {
    //         resultString += sets[2][0];
    //         for (let i = 0; i < this.fieldCols - 1; i += 1) {
    //             resultString += sets[2][1];
    //         }
    //         resultString += `${sets[2][2]}\n`;
    //     }
    //     return resultString;
    // }
}

export default World;
