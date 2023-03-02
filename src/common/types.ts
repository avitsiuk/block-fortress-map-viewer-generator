export interface IPoint {
    x: number;
    y?: number;
    z?: number;
}

export interface IDim extends IPoint {}

export interface IPointSafe extends IPoint {
    y: number;
    z: number;
}

export interface IDimSafe extends IPointSafe {}

export type TCellType = 'grass' | '';

export interface IServiceGameData {
    t: number,
    tDelta: number,
    fps: number,
    [key: string]: number,
}
