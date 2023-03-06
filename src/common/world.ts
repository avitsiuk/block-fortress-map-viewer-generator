import {
    IPoint,
    IPointSafe,
    TCellType,
} from './types';
import {
    pointSafe,
} from './utils';
import Cell from './cell';

export const defWorldDims: IPointSafe = { x: 1, y: 1, z: 1 };

export const defCellType: TCellType = '';

type TFieldType = Array<Cell>;

export class World {
    private _fieldDims: IPointSafe = defWorldDims;

    private _field: TFieldType = [];

    seed: number;

    constructor(
        dims: IPoint = defWorldDims,
        initCellType: TCellType = defCellType,
        seed: number = 0,
    ) {
        this.setFieldDims(dims);
        this.initField(initCellType);
        this.seed = seed;
    }

    get fieldLen(): number {
        return this._field.length;
    }

    setFieldDims(newDims: IPoint) {
        this._fieldDims = pointSafe(newDims, 1);
        return this;
    }

    get fieldDims() {
        return this._fieldDims;
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

    getCell(cellIdx: number): Cell {
        if (cellIdx >= this.fieldLen) {
            throw new Error(`Cell idx ${cellIdx} ou of bounds (0-${this.fieldLen - 1})`);
        }
        return this._field[cellIdx];
    }
}

export default World;
