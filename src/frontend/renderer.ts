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
} from '../common/utils';

import Cell from '../common/cell';

import World from '../common/world';

import { terrains } from './sprites';

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
        x: terrains.size.x,
        y: terrains.size.y / 2,
    };

    constructor(canvasElem: HTMLCanvasElement, customDims?: IPoint) {
        this.canvas = canvasElem;
        const scale = window.devicePixelRatio;
        if (typeof customDims !== 'undefined') {
            const dims = pointSafe(customDims);
            this.canvas.width = Math.floor(dims.x * scale);
            this.canvas.height = Math.floor(dims.y * scale);
        }
        this.canvas.style.width = `${this.canvas.width}px`;
        this.canvas.style.height = `${this.canvas.height}px`;
        this.ctx = this.canvas.getContext('2d')!;
        this.ctx.scale(scale, scale);
    }

    get canvasWidthPx(): number {
        return this.canvas.width;
    }

    get canvasHeightPx(): number {
        return this.canvas.height;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    set renderOffsetChangeStep(n: number) {
        this._renderOffsetChangeStep = n;
    }

    get renderOffsetChangeStep(): number {
        return this._renderOffsetChangeStep;
    }

    renderOffsetXInc() {
        this.renderOffset.x += this._renderOffsetChangeStep;
    }

    renderOffsetXDec() {
        this.renderOffset.x -= this._renderOffsetChangeStep;
    }

    renderOffsetYInc() {
        this.renderOffset.y += this._renderOffsetChangeStep;
    }

    renderOffsetYDec() {
        this.renderOffset.y -= this._renderOffsetChangeStep;
    }

    setRenderOffset(newOffset: IPoint = { x: 0, y: 0, z: 0 }) {
        this.renderOffset = {
            x: newOffset.x,
            y: newOffset.y || 0,
            z: 0,
        };
    }

    // =========================================================================

    renderCell(cell: Cell, originPoint: IPointSafe, selected: boolean = false) {
        this.ctx.drawImage(
            terrains.images.grass,
            originPoint.x,
            originPoint.y,
            terrains.size.x,
            terrains.size.y,
        );
        if (selected) {
            this.ctx.drawImage(
                terrains.images.select,
                originPoint.x,
                originPoint.y,
                terrains.size.x,
                terrains.size.y,
            );
        }
    }

    renderWorld(world: World): void {
        // const i = 0x29;
        // console.log(`${i}: [${JSON.stringify(idxToPoint(i, { x: 8, y: 8, z: 0 }))}]`);
        const zCorrection = this.cellDims.y * (world.fieldDims.z - 1);
        const worldRenderBox = {
            x: ((world.fieldDims.x + world.fieldDims.y) * this.cellDims.x) / 2,
            y: ((world.fieldDims.x + world.fieldDims.y) * this.cellDims.y) / 2
                + zCorrection,
        };
        const centerOffset = {
            x: (this.canvas.width / 2) - (worldRenderBox.x / 2),
            y: (this.canvas.height / 2) - (worldRenderBox.y / 2),
        };
        const renderOriginPoint = {
            x: centerOffset.x + this.renderOffset.x,
            y: centerOffset.y + this.renderOffset.y,
        };
        for (let cellIdx = 0; cellIdx < world.fieldLen; cellIdx += 1) {
            const cellWorldCoords = idxToPoint(cellIdx, world.fieldDims);
            const cellIsoCol = world.fieldDims.y - 1 + cellWorldCoords.x - cellWorldCoords.y;
            const cellIsoRow = cellWorldCoords.x + cellWorldCoords.y;
            const cellOriginPoint: IPointSafe = {
                x: Math.floor((this.cellDims.x / 2) * cellIsoCol)
                    + renderOriginPoint.x,
                y: Math.floor((this.cellDims.y / 2) * cellIsoRow)
                    + renderOriginPoint.y + zCorrection,
                z: 0,
            };

            // applying elevation for z axis
            cellOriginPoint.y -= this.cellDims.y * cellWorldCoords.z;
            const selected: boolean = false;
            this.renderCell(world.getCell(cellIdx), cellOriginPoint, selected);
        }

        // TODO: remove this
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(
            renderOriginPoint.x,
            renderOriginPoint.y,
            worldRenderBox.x,
            worldRenderBox.y,
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

    renderDebugInfo(data: IDebugInfo) {
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

    renderCtrlInfo(ctrlMap: TControlsMap) {
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

    renderGrid() {
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = 'black';
        this.ctx.moveTo(0, Math.floor(this.canvas.height / 2));
        this.ctx.lineTo(this.canvas.width, Math.floor(this.canvas.height / 2));
        this.ctx.moveTo(Math.floor(this.canvas.width / 2), 0);
        this.ctx.lineTo(Math.floor(this.canvas.width / 2), this.canvas.height);
        this.ctx.stroke();
    }
}
