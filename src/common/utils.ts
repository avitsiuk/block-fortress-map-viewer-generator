import type {
    IPoint,
    IPointSafe,
    IDim,
    IDimSafe,
} from './types';

export function pointSafe(pos: IPoint): IPointSafe {
    return {
        x: typeof pos.x === 'number' && pos.x > 0 ? pos.x : 0,
        y: typeof pos.y === 'number' && pos.y > 0 ? pos.y : 0,
        z: typeof pos.z === 'number' && pos.z > 0 ? pos.z : 0,
    };
}

export function dimSafe(dim: IDim): IDimSafe {
    return {
        x: typeof dim.x === 'number' && dim.x > 1 ? dim.x : 1,
        y: typeof dim.y === 'number' && dim.y > 1 ? dim.y : 1,
        z: typeof dim.z === 'number' && dim.z > 1 ? dim.z : 1,
    };
}

export function pointToIdx(pos: IPointSafe, dim: IDimSafe): number {
    return (pos.y * dim.x + pos.x) + (dim.x * dim.y * pos.z);
}

export function idxToPoint(idx: number, dim: IDimSafe): IPointSafe {
    return {
        x: idx % dim.x,
        y: Math.floor(idx / dim.x) % dim.y,
        z: Math.floor(idx / (dim.x * dim.y)),
    };
}

export function sleep(timeMs: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeMs);
    });
}
