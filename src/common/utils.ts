export interface IServiceGameData {
    t: number,
    tDelta: number,
    fps: number,
    [key: string]: number,
}

export interface IPosition {
    x: number,
    y: number,
}

export function sleep(timeMs: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeMs);
    });
}
