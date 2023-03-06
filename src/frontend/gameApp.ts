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

export class Game {
    private _world: World;

    private _renderer: Renderer;

    private _halt: boolean;

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

        this._renderer = new Renderer(canvasElem, customCanvasDims);

        this._world = new World();

        this._halt = false;

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

    setWorldSize(dims: IPoint) {
        this._world.setFieldDims(dims);
        this._world.initField();
        return this;
    }

    get world(): World {
        return this._world;
    }

    get renderer(): Renderer {
        return this._renderer;
    }

    showDebug(pos?: IPoint) {
        this.renderer.showDebug(pos);
        return this;
    }

    hideDebug() {
        this.renderer.hideDebug();
        return this;
    }

    toggleDebug() {
        this.renderer.toggleDebug();
        return this;
    }

    showCtrl(pos?: IPoint) {
        this.renderer.showCtrl(pos);
        return this;
    }

    hideCtrl() {
        this.renderer.hideCtrl();
        return this;
    }

    toggleCtrl() {
        this.renderer.toggleCtrl();
        return this;
    }

    applyControls() {
        if (this._ctrl.scrollDown!.isOn) {
            this.renderer.renderOffsetYDec();
        }
        if (this._ctrl.scrollUp!.isOn) {
            this.renderer.renderOffsetYInc();
        }
        if (this._ctrl.scrollLeft!.isOn) {
            this.renderer.renderOffsetXInc();
        }
        if (this._ctrl.scrollRight!.isOn) {
            this.renderer.renderOffsetXDec();
        }
        if (this._ctrl.resetPosition!.presses) {
            this.renderer.setRenderOffset();
            this._ctrl.resetPosition!.presses -= 1;
        }
    }

    run() {
        let pTimestamp = 0;
        const tick = (timestamp: number) => {
            if (!this._halt) {
                requestAnimationFrame(tick);
            } else {
                this._halt = false;
            }
            const tDelta = Math.floor((timestamp - pTimestamp) * 1000) / 1000;
            const debugInfo: IDebugInfo = {
                t: timestamp,
                tDelta,
                fps: Math.round(1000 / tDelta),
                canvasW: this.renderer.canvasWidthPx,
                canvasH: this.renderer.canvasHeightPx,
            };
            debugInfo.fps = Math.round(1000 / tDelta);
            this.applyControls();
            this.renderer.clearCanvas();
            this.renderer.renderWorld(this.world);
            // ==================
            this.renderer.renderDebugInfo(debugInfo);
            this.renderer.renderCtrlInfo(this._ctrl);
            pTimestamp = timestamp;
        };
        requestAnimationFrame(tick);
    }

    halt() {
        this._halt = true;
    }
}

export default Game;
