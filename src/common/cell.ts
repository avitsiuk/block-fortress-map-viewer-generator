import { IPosition } from './utils';

const fillStyles = [
    'black', // empty
    'blue', // water
    'yellow', // sand
    'green', // grass
    'gray', // rocks
    'white', // snow
];

const MAX_CELL_HEIGHT = fillStyles.length;

export class WorldCell {
    private _height: number;

    static get maxHeight(): number {
        return MAX_CELL_HEIGHT;
    }

    constructor(cellHeight: number) {
        this._height = Math.min(cellHeight, WorldCell.maxHeight);
    }

    get height(): number {
        return this._height;
    }

    render(
        ctx: CanvasRenderingContext2D,
        center: IPosition,
        cellWidthPx: number,
        cellHeightPx: number,
    ) {
        // console.log(center);
        ctx.fillStyle = fillStyles[Math.ceil(this._height)];
        ctx.fillRect(
            center.x - Math.floor(cellWidthPx / 2),
            center.y - Math.floor(cellHeightPx / 2),
            cellWidthPx,
            cellHeightPx,
        );
    }
}

export default WorldCell;
