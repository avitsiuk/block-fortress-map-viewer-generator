export interface IPoint {
    x: number;
    y?: number;
    z?: number;
}

export interface IPointSafe extends IPoint {
    y: number;
    z: number;
}

export type TTerrainType = '' | 'dirt';
