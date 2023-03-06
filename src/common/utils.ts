import type {
    IPoint,
    IPointSafe,
} from './types';

export function pointSafe(pos: IPoint, minValue: number = 0): IPointSafe {
    return {
        x: typeof pos.x === 'number' && pos.x > minValue ? pos.x : minValue,
        y: typeof pos.y === 'number' && pos.y > minValue ? pos.y : minValue,
        z: typeof pos.z === 'number' && pos.z > minValue ? pos.z : minValue,
    };
}

export function pointToIdx(pos: IPointSafe, dim: IPointSafe): number {
    return (pos.y * dim.x + pos.x) + (dim.x * dim.y * pos.z);
}

export function idxToPoint(idx: number, dim: IPointSafe): IPointSafe {
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
