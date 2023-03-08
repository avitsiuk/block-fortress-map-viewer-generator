import {
    TTerrainType,
} from '../common/types';

export interface IDebugInfo {
    t: number,
    fps: number,
    [key: string]: number | string,
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

interface ISpritesCollection {
    size: {x: number, y: number};
    images: {
        [key: string]: HTMLImageElement | null;
    }
}

export interface IMiscSpritesCollection extends ISpritesCollection {
    images: {
        select: HTMLImageElement;
    }
}

export interface ITerrainSpritesCollection extends ISpritesCollection {
    images: {
        [key in TTerrainType]: HTMLImageElement | null;
    }
}
