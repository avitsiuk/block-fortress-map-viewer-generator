import {
    TTerrainType,
} from './types';

export class Cell {
    private _terrain: TTerrainType;

    constructor(type: TTerrainType = '') {
        this._terrain = type;
    }

    get type(): TTerrainType {
        return this._terrain;
    }

    set type(type: TTerrainType) {
        this._terrain = type;
    }

    getType(): TTerrainType {
        return this._terrain;
    }

    setType(type: TTerrainType) {
        this._terrain = type;
        return this;
    }
}

export default Cell;
