export interface IDebugInfo {
    t: number,
    tDelta: number,
    fps: number,
    [key: string]: number,
}

export type TControlIdentifier = 'resetPosition'
| 'scrollUp' | 'scrollDown' | 'scrollLeft' | 'scrollRight';

export type TControlsMap = {
    [key in TControlIdentifier]?: {
        /** 0- disabled; 1- press; 2- hold */
        mode: 0 | 1 | 2;
        /** Current control state */
        isOn: boolean,
        /** Array of keys to listen to */
        keys: string[],
        /** How many times the key has been pressed */
        presses?: number,
    }
}

export interface ISpritesCollection {
    size: {x: number, y: number};
    images: {
        [key: string]: HTMLImageElement;
    }
}

export type TTerrainType = 'grass' | 'select' | '';

export interface ITerrainSpritesCollection extends ISpritesCollection {
    images: {
        [key in TTerrainType]: HTMLImageElement;
    }
}
