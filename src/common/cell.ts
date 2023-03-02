import {
    TCellType,
} from './types';

export class Cell {
    private _type: TCellType;

    constructor(type: TCellType = '') {
        this._type = type;
    }

    get type(): TCellType {
        return this._type;
    }

    set type(type: TCellType) {
        this._type = type;
    }

    getType(): TCellType {
        return this._type;
    }

    setType(type: TCellType) {
        this._type = type;
        return this;
    }
}

export default Cell;
