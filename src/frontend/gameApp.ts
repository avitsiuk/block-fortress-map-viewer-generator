import {
    IPoint,
} from '../common/types';
import {
    IDebugInfo,
    TControlIdentifier,
    TControlsMap,
} from './types';
import World from '../common/world';
import Renderer from './renderer';
import { pointSafe } from '../common/utils';

export class Game {
    private _world: World;

    private _renderer: Renderer;

    private _isRunning: boolean = false;

    private _doHalt: boolean = false;

    private _ctrl: TControlsMap = {
        resetPosition: { mode: 1, isOn: false, keys: ['f', 'F'] },
        scrollUp: { mode: 2, isOn: false, keys: ['w', 'W'] },
        scrollLeft: { mode: 2, isOn: false, keys: ['a', 'A'] },
        scrollDown: { mode: 2, isOn: false, keys: ['s', 'S'] },
        scrollRight: { mode: 2, isOn: false, keys: ['d', 'D'] },
    };

    private ctlList: TControlIdentifier[] = (Object.keys(this._ctrl) as TControlIdentifier[]);

    constructor(canvasElemId: string, customCanvasDims?: IPoint) {
        const canvasElem = document.getElementById(canvasElemId);
        if (canvasElem === null) {
            throw new Error(`Canvas element "${canvasElemId}" not found.`);
        }
        if (!(canvasElem instanceof HTMLCanvasElement)) {
            throw new Error(`Element "${canvasElemId}" is not a canvas.`);
        }

        this._world = new World();

        this._renderer = new Renderer(canvasElem, customCanvasDims)
            .precomputeValues(this._world);

        this._renderer.renderGrid();

        document.addEventListener('keypress', (e) => {
            this.ctlList.forEach((ctlId) => {
                if (
                    this._ctrl[ctlId]!.mode === 1
                    && this._ctrl[ctlId]!.keys.includes(e.key)
                ) {
                    this._ctrl[ctlId]!.presses = this._ctrl[ctlId]!.presses
                        ? this._ctrl[ctlId]!.presses! + 1
                        : 1;
                }
            });
        });
        document.addEventListener('keydown', (e) => {
            this.ctlList.forEach((ctlId) => {
                if (
                    this._ctrl[ctlId]!.mode === 2
                    && this._ctrl[ctlId]!.keys.includes(e.key)
                ) {
                    this._ctrl[ctlId]!.isOn = true;
                }
            });
        });
        document.addEventListener('keyup', (e) => {
            this.ctlList.forEach((ctlId) => {
                if (
                    this._ctrl[ctlId]!.mode === 2
                    && this._ctrl[ctlId]!.keys.includes(e.key)
                ) {
                    this._ctrl[ctlId]!.isOn = false;
                }
            });
        });
    }

    get world(): World {
        return this._world;
    }

    get renderer(): Renderer {
        return this._renderer;
    }

    setWorldSize(dims: IPoint) {
        const _dims = pointSafe(dims, 1);
        this._world.setFieldDims(_dims);
        this._world.initField();
        this._renderer.precomputeValues(this._world);
        this._renderer.setSubfield(
            { x: 0, y: 0, z: 0 },
            _dims,
        );

        // const p1 = { x: 1, y: 0, z: 1 };
        // const p2 = { x: 0, y: 1, z: 0 };
        // const subOrigin = {
        //     x: Math.min(p1.x, p2.x),
        //     y: Math.min(p1.y, p2.y),
        //     z: Math.min(p1.z, p2.z),
        // };
        // const subDims = {
        //     x: (Math.max(p1.x, p2.x) - subOrigin.x) + 1,
        //     y: (Math.max(p1.y, p2.y) - subOrigin.y) + 1,
        //     z: (Math.max(p1.z, p2.z) - subOrigin.z) + 1,
        // };
        // console.log(subOrigin);
        // console.log(subDims);
        return this;
    }

    get renderedSubfield() {
        return this._renderer.subfield;
    }

    setRenderedSubfield(origin: IPoint, dim: IPoint) {
        this._renderer.setSubfield(origin, dim);
        return this;
    }

    initFromArray(initArray: number[]) {
        this._world.initFieldFromArray(initArray);
        return this;
    }

    showDebug(pos?: IPoint) {
        this._renderer.showDebug(pos);
        return this;
    }

    hideDebug() {
        this._renderer.hideDebug();
        return this;
    }

    toggleDebug() {
        this._renderer.toggleDebug();
        return this;
    }

    showCtrl(pos?: IPoint) {
        this._renderer.showCtrl(pos);
        return this;
    }

    hideCtrl() {
        this._renderer.hideCtrl();
        return this;
    }

    toggleCtrl() {
        this._renderer.toggleCtrl();
        return this;
    }

    applyControls() {
        if (this._ctrl.scrollDown!.isOn) {
            this._renderer.renderOffsetYDec();
        }
        if (this._ctrl.scrollUp!.isOn) {
            this._renderer.renderOffsetYInc();
        }
        if (this._ctrl.scrollLeft!.isOn) {
            this._renderer.renderOffsetXInc();
        }
        if (this._ctrl.scrollRight!.isOn) {
            this._renderer.renderOffsetXDec();
        }
        if (this._ctrl.resetPosition!.presses) {
            this._renderer.setRenderOffset();
            this._ctrl.resetPosition!.presses -= 1;
        }
    }

    run() {
        if (this._isRunning) return;
        this._isRunning = true;
        let pTimestamp = 0;
        const tick = (timestamp: number) => {
            if (this._doHalt) {
                this._doHalt = false;
                this._isRunning = false;
                return;
            }
            requestAnimationFrame(tick);
            this.applyControls();
            this._renderer.clearCanvas();

            const renderStart = new Date().getTime();
            this._renderer.renderWorld(this._world);
            const renderTimeMs = new Date().getTime() - renderStart;

            // ==================
            const tDelta = Math.floor((timestamp - pTimestamp) * 1000) / 1000;
            const debugInfo: IDebugInfo = {
                t: timestamp,
                renderT: `${renderTimeMs} ms`,
                fps: Math.round(1000 / tDelta),
                canvasW: this._renderer.canvasWidthPx,
                canvasH: this._renderer.canvasHeightPx,
            };
            this._renderer.renderDebugInfo(debugInfo);
            this._renderer.renderCtrlInfo(this._ctrl);
            // this._renderer.renderGrid();
            pTimestamp = timestamp;
        };
        requestAnimationFrame(tick);
    }

    halt() {
        if (this._isRunning) {
            this._doHalt = true;
        }
    }
}

export default Game;
