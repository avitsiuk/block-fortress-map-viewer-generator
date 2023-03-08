import type {
    IPoint,
    IPointSafe,
} from './types';

export function pointSafe(pos: IPoint, minValue?: number): IPointSafe {
    const result: IPointSafe = {
        x: typeof pos.x === 'number' ? pos.x : 0,
        y: typeof pos.y === 'number' ? pos.y : 0,
        z: typeof pos.z === 'number' ? pos.z : 0,
    };

    if (typeof minValue === 'number') {
        result.x = result.x > minValue ? result.x : minValue;
        result.y = result.y > minValue ? result.y : minValue;
        result.z = result.z > minValue ? result.z : minValue;
    }

    return result;
}

export function pointToIdx(p: IPointSafe, dim: IPointSafe): number {
    const result = (p.y * dim.x + p.x) + (dim.x * dim.y * p.z);
    // console.log(`([${p.x};${p.y};${p.z}],[${dim.x};${dim.y};${dim.z}]) => [${result}]`);
    return result;
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

export function getDims(p1: IPoint, p2: IPoint = p1): IPointSafe {
    const _p1 = pointSafe(p1);
    const _p2 = pointSafe(p2);
    return {
        x: Math.abs(_p1.x - _p2.x),
        y: Math.abs(_p1.y - _p2.y),
        z: Math.abs(_p1.z - _p2.z),
    };
}

export function getSubfield(fullDims: IPoint, subfOrigin: IPoint, subfDims: IPoint): number[] {
    const _fullDims = pointSafe(fullDims, 1);
    const _subfOrigin = pointSafe(subfOrigin, 0);
    const _subfDims = pointSafe(subfDims, 1);
    const result: number[] = [];
    for (let z = _subfOrigin.z; z < _subfOrigin.z + _subfDims.z; z += 1) {
        for (let y = _subfOrigin.y; y < _subfOrigin.y + _subfDims.y; y += 1) {
            for (let x = _subfOrigin.x; x < _subfOrigin.x + _subfDims.x; x += 1) {
                result.push(pointToIdx({ x, y, z }, _fullDims));
            }
        }
    }
    return result;
}
