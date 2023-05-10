import {
    IPoint,
    IPointSafe,
} from '../common/types';
import {
    IDebugInfo,
    TControlIdentifier,
    TControlsMap,
} from './types';

import {
    pointSafe,
    idxToPoint,
    getSubfield,
} from '../common/utils';

import Cell from '../common/cell';

import World from '../common/world';

import { miscSprites, terrainSprites } from './sprites';

export default class Renderer {
    private canvas: HTMLCanvasElement;

    private ctx: CanvasRenderingContext2D;

    private doRenderDebugInfo: boolean = true;

    private debugInfoPos: IPointSafe = { x: 0, y: 0, z: 0 };

    private doRenderCtrlInfo: boolean = true;

    private ctrlInfoPos: IPointSafe = { x: 0, y: 0, z: 0 };

    private renderOffset: IPointSafe = { x: 0, y: 0, z: 0 };

    private _renderOffsetChangeStep = 3;

    private cellDims = {
        x: terrainSprites.size.x,
        y: Math.floor(terrainSprites.size.x / 2),
        z: terrainSprites.size.y - Math.floor(terrainSprites.size.x / 2),
    };

    private renderedSubfield = {
        origin: { x: 0, y: 0, z: 0 },
        dims: { x: 1, y: 1, z: 1 },
    };

    private precomputedValues = {
        zCorrection: 0,
        worldRenderBox: {
            x: 0,
            y: 0,
        },
        centerOffset: {
            x: 0,
            y: 0,
        },
        renderedIdxArray: new Array<number>(0),
    };

    constructor(canvasElem: HTMLCanvasElement, customDims?: IPoint) {
        this.canvas = canvasElem;
        // const scale = window.devicePixelRatio;
        const scale = 1;
        if (typeof customDims !== 'undefined') {
            const dims = pointSafe(customDims);
            this.canvas.width = Math.floor(dims.x * scale);
            this.canvas.height = Math.floor(dims.y * scale);
        }
        this.canvas.style.width = `${this.canvas.width}px`;
        this.canvas.style.height = `${this.canvas.height}px`;
        this.ctx = this.canvas.getContext('2d')!;
        this.ctx.scale(scale, scale);
        this.ctx.imageSmoothingEnabled = false;
    }

    get canvasWidthPx(): number {
        return this.canvas.width;
    }

    get canvasHeightPx(): number {
        return this.canvas.height;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        return this;
    }

    set renderOffsetChangeStep(n: number) {
        this._renderOffsetChangeStep = n;
    }

    get renderOffsetChangeStep(): number {
        return this._renderOffsetChangeStep;
    }

    renderOffsetXInc() {
        this.renderOffset.x += this._renderOffsetChangeStep;
        return this;
    }

    renderOffsetXDec() {
        this.renderOffset.x -= this._renderOffsetChangeStep;
        return this;
    }

    renderOffsetYInc() {
        this.renderOffset.y += this._renderOffsetChangeStep;
        return this;
    }

    renderOffsetYDec() {
        this.renderOffset.y -= this._renderOffsetChangeStep;
        return this;
    }

    setRenderOffset(newOffset: IPoint = { x: 0, y: 0, z: 0 }) {
        this.renderOffset = pointSafe(newOffset);
        return this;
    }

    precomputeValues(world: World) {
        this.precomputedValues.zCorrection = this.cellDims.z * (world.fieldDims.z - 1);
        this.precomputedValues.worldRenderBox = {
            x: Math.floor(((world.fieldDims.x + world.fieldDims.y) * this.cellDims.x) / 2),
            y: Math.floor(((world.fieldDims.x + world.fieldDims.y) * this.cellDims.y) / 2
                + this.precomputedValues.zCorrection + this.cellDims.z),
        };
        this.precomputedValues.centerOffset = {
            x: Math.floor((this.canvas.width / 2) - (this.precomputedValues.worldRenderBox.x / 2)),
            y: Math.floor((this.canvas.height / 2) - (this.precomputedValues.worldRenderBox.y / 2)),
        };
        return this;
    }

    get subfield() {
        return this.renderedSubfield;
    }

    setSubfield(origin: IPoint, dims: IPoint) {
        this.renderedSubfield = {
            origin: pointSafe(origin, 0),
            dims: pointSafe(dims, 1),
        };
        this.precomputedValues.renderedIdxArray = [];
        return this;
    }

    // =========================================================================

    renderCell(cell: Cell, originPoint: IPointSafe, selected: boolean = false): void {
        if (terrainSprites.images[cell.type]) {
            this.ctx.drawImage(
                terrainSprites.images[cell.type]!,
                originPoint.x,
                originPoint.y,
                terrainSprites.size.x,
                terrainSprites.size.y,
            );
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 1;
            this.ctx.globalAlpha = 1;
            this.ctx.strokeRect(
                originPoint.x,
                originPoint.y,
                terrainSprites.size.x,
                terrainSprites.size.y / 2,
            );
        }
        if (selected) {
            this.ctx.drawImage(
                miscSprites.images.select,
                originPoint.x,
                originPoint.y,
                miscSprites.size.x,
                miscSprites.size.y,
            );
        }
        // this.ctx.strokeStyle = 'black';
        // this.ctx.lineWidth = 1;
        // this.ctx.globalAlpha = 1;
        // this.ctx.strokeRect(
        //     originPoint.x,
        //     originPoint.y,
        //     terrainSprites.size.x,
        //     terrainSprites.size.y / 2,
        // );
    }

    renderWorld(world: World): void {
        if (this.precomputedValues.renderedIdxArray.length <= 0) {
            this.precomputedValues.renderedIdxArray = getSubfield(
                {
                    x: world.fieldDims.x,
                    y: world.fieldDims.y,
                    z: world.fieldDims.z,
                },
                this.renderedSubfield.origin,
                this.renderedSubfield.dims,
            );
        }
        const renderOriginPoint = {
            x: this.precomputedValues.centerOffset.x + this.renderOffset.x,
            y: this.precomputedValues.centerOffset.y + this.renderOffset.y,
        };
        for (let i = 0; i < this.precomputedValues.renderedIdxArray.length; i += 1) {
            const cellIdx = this.precomputedValues.renderedIdxArray[i];
            const cellWorldCoords = idxToPoint(i, this.renderedSubfield.dims);
            const cellIsoCol = this.renderedSubfield.dims.y
                - 1 + cellWorldCoords.x - cellWorldCoords.y;
            const cellIsoRow = cellWorldCoords.x + cellWorldCoords.y;
            const cellOriginPoint: IPointSafe = {
                x: Math.floor((this.cellDims.x / 2) * cellIsoCol
                    + renderOriginPoint.x),
                y: Math.floor((this.cellDims.y / 2) * cellIsoRow
                    + renderOriginPoint.y + this.precomputedValues.zCorrection),
                z: 0,
            };

            // applying elevation for z axis
            cellOriginPoint.y -= this.cellDims.z * cellWorldCoords.z;
            const selected: boolean = false;
            this.renderCell(world.getCell(cellIdx), cellOriginPoint, selected);
        }

        // TODO: remove this
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(
            renderOriginPoint.x,
            renderOriginPoint.y,
            this.precomputedValues.worldRenderBox.x,
            this.precomputedValues.worldRenderBox.y,
        );
    }

    // =========================================================================
    setDebugPos(pos: IPoint) {
        this.debugInfoPos = pointSafe(pos);
        return this;
    }

    showDebug(pos: IPoint = { x: 0, y: 0 }) {
        this.setDebugPos(pos);
        this.doRenderDebugInfo = true;
        return this;
    }

    hideDebug() {
        this.doRenderDebugInfo = false;
        return this;
    }

    toggleDebug() {
        this.doRenderDebugInfo = !this.doRenderDebugInfo;
        return this;
    }

    renderDebugInfo(data: IDebugInfo): void {
        if (!this.doRenderDebugInfo) return;
        const lineHeightPx = 12;
        const lineWidthPx = 120;
        const keys = Object.keys(data);
        this.ctx.fillStyle = 'black';
        this.ctx.globalAlpha = 0.8;
        this.ctx.fillRect(
            this.debugInfoPos.x,
            this.debugInfoPos.y || 0,
            lineWidthPx,
            lineHeightPx * keys.length,
        );
        this.ctx.globalAlpha = 1.0;
        this.ctx.fillStyle = 'white';
        this.ctx.font = `${lineHeightPx}px Courier New`;
        for (let i = 0; i < keys.length; i += 1) {
            const text = `${keys[i]}: ${data[keys[i]]}`;
            const newY = this.debugInfoPos.y + (lineHeightPx * (i + 1) - 3);
            this.ctx.fillText(text, this.debugInfoPos.x, newY, lineWidthPx);
        }
    }

    // =========================================================================
    setCtrlPos(pos: IPoint) {
        this.ctrlInfoPos = pointSafe(pos);
        return this;
    }

    showCtrl(pos: IPoint = { x: 0, y: 0 }) {
        this.setCtrlPos(pos);
        this.doRenderCtrlInfo = true;
        return this;
    }

    hideCtrl() {
        this.doRenderCtrlInfo = false;
        return this;
    }

    toggleCtrl() {
        this.doRenderCtrlInfo = !this.doRenderCtrlInfo;
        return this;
    }

    renderCtrlInfo(ctrlMap: TControlsMap): void {
        if (!this.doRenderCtrlInfo) return;
        const lineHeightPx = 12;
        const lineWidthPx = 150;
        const keys: TControlIdentifier[] = Object.keys(ctrlMap) as TControlIdentifier[];
        this.ctx.fillStyle = 'black';
        this.ctx.globalAlpha = 0.8;
        this.ctx.fillRect(
            this.ctrlInfoPos.x,
            this.ctrlInfoPos.y,
            lineWidthPx,
            lineHeightPx * keys.length,
        );
        this.ctx.globalAlpha = 1.0;
        this.ctx.fillStyle = 'white';
        this.ctx.font = `${lineHeightPx}px Courier New`;
        for (let i = 0; i < keys.length; i += 1) {
            const text = `${keys[i]}: ${ctrlMap[keys[i]]!.keys.join(', ')}`;
            const newY = this.ctrlInfoPos.y + (lineHeightPx * (i + 1) - 3);
            this.ctx.fillText(text, this.ctrlInfoPos.x, newY, lineWidthPx);
        }
    }

    // =========================================================================
    renderGrid(): void {
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 1;
        this.ctx.strokeStyle = 'black';

        this.ctx.strokeRect(0.5, 0.5, 10, 10);
        this.ctx.strokeRect(this.canvas.width - 10.5, 0.5, 10, 10);
        this.ctx.strokeRect(this.canvas.width - 10.5, this.canvas.height - 10.5, 10, 10);
        this.ctx.strokeRect(0.5, this.canvas.height - 10.5, 10, 10);

        this.ctx.moveTo(0, Math.floor(this.canvas.height / 2) - 0.5);
        this.ctx.lineTo(this.canvas.width, Math.floor(this.canvas.height / 2) - 0.5);
        this.ctx.moveTo(Math.floor(this.canvas.width / 2) - 0.5, 0);
        this.ctx.lineTo(Math.floor(this.canvas.width / 2) - 0.5, this.canvas.height - 0.5);
        this.ctx.stroke();
    }
}
