import {
    IPoint,
    IPointSafe,
    TTerrainType,
} from './types';
import {
    pointSafe,
} from './utils';
import Cell from './cell';

export const defWorldDims: IPointSafe = { x: 1, y: 1, z: 1 };

export const defCellType: TTerrainType = 'dirt';

export class World {
    private _fieldDims: IPointSafe = defWorldDims;

    private _field: Cell[] = [];

    seed: number;

    constructor(
        dims: IPoint = defWorldDims,
        initCellType: TTerrainType = defCellType,
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

    initField(initCellType: TTerrainType = defCellType) {
        this._field = [];
        this._field = new Array<Cell>(this._fieldDims.x * this._fieldDims.y * this._fieldDims.z)
            .fill(new Cell(initCellType));
        return this;
    }

    initFieldFromArray(initArray: Array<number>) {
        const fieldLen = this._fieldDims.x * this._fieldDims.y * this._fieldDims.z;
        if (initArray.length < fieldLen) {
            throw new Error(`Initialization array too short. Expected ${fieldLen} elements but received ${initArray.length}.`);
        }
        this._field = new Array<Cell>(0);
        for (let elemIdx = 0; elemIdx < fieldLen; elemIdx += 1) {
            switch (initArray[elemIdx]) {
                case 0:
                    this._field.push(new Cell(''));
                    break;
                case 1:
                    this._field.push(new Cell('dirt'));
                    break;
                default:
                    break;
            }
        }
        return this;
    }

    clearField(initCellType: TTerrainType = defCellType) {
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
