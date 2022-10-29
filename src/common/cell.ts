import { IPosition } from './utils';

type TBiomeName = 'null' | 'abyss' | 'depth' | 'water' | 'shore' | 'grass' | 'rocks' | 'snow';

type TBiomeFillStyle = string;

const MAX_CELL_HEIGHT: number = 1000;

const biomes: [number, TBiomeName, TBiomeFillStyle][] = [
    [0, 'null', 'black'],
    [1, 'abyss', 'black'],
    [1, 'depth', '#00008b'],
    [2, 'water', 'blue'],
    [3, 'shore', 'yellow'],
    [4, 'grass', 'green'],
    [5, 'rocks', 'gray'],
    [6, 'snow', 'white'],
];

const biomeHeights: [number, number][] = [
    [0, 0],
    [1, 1],
    [50, 2],
    [200, 3],
    [350, 4],
    [400, 5],
    [750, 6],
    [900, 7],
];

export class WorldCell {
    private _height: number;

    private _biomeId: number;

    private _biomeName: TBiomeName;

    private fillStyle: TBiomeFillStyle;

    static get maxHeight(): number {
        return MAX_CELL_HEIGHT;
    }

    constructor(cellHeight: number) {
        this._height = Math.ceil(Math.min(cellHeight, WorldCell.maxHeight));
        this._biomeId = biomes[biomeHeights[biomeHeights.length - 1][1]][0];
        this._biomeName = biomes[biomeHeights[biomeHeights.length - 1][1]][1];
        this.fillStyle = biomes[biomeHeights[biomeHeights.length - 1][1]][2];
        for (let i = 0; i < biomeHeights.length; i += 1) {
            if (biomeHeights[i][0] < this._height) {
                this._biomeId = biomes[biomeHeights[i][1]][0];
                this._biomeName = biomes[biomeHeights[i][1]][1];
                this.fillStyle = biomes[biomeHeights[i][1]][2];
            } else break;
        }
    }

    get height(): number {
        return this._height;
    }

    get biomeId(): number {
        return this._biomeId;
    }

    get biomeName(): TBiomeName {
        return this._biomeName;
    }

    render(
        ctx: CanvasRenderingContext2D,
        center: IPosition,
        cellWidthPx: number,
        cellHeightPx: number,
    ) {
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(
            center.x - Math.floor(cellWidthPx / 2),
            center.y - Math.floor(cellHeightPx / 2),
            cellWidthPx,
            cellHeightPx,
        );
    }
}

export default WorldCell;
