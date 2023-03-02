import { IPosition, IServiceGameData } from '../common/utils';
import World from '../common/world';

type TControlIdentifier = 'resetPosition' | 'scrollUp' | 'scrollDown' | 'scrollLeft' | 'scrollRight' | 'zoomIn' | 'zoomOut'
| 'panX+' | 'panX-' | 'panY+' | 'panY-' | 'noiseRes+' | 'noiseRes-' | 'randSeed';

type TControlsMap = {
    [key in TControlIdentifier]: {
        /** 0- disabled; 1- press; 2- hold */
        mode: 0 | 1 | 2;
        isOn: boolean,
        keys: string[],
        presses?: number,
    }
}

export class Game {
    private _world: World;

    private canvas: HTMLCanvasElement;

    private ctx: CanvasRenderingContext2D;

    private _halt: boolean;

    private _renderDebugInfo: boolean = false;

    private _renderCtrlInfo: boolean = false;

    xOffset: number = 0;

    yOffset: number = 0;

    private offsetStep: number = 6;

    private debugInfoPos: IPosition = { x: 0, y: 0 };

    private ctrlInfoPos: IPosition = { x: 0, y: 0 };

    private ctrl: TControlsMap = {
        resetPosition: { mode: 1, isOn: false, keys: ['f', 'F'] },
        zoomIn: { mode: 1, isOn: false, keys: ['e', 'E'] },
        zoomOut: { mode: 1, isOn: false, keys: ['q', 'Q'] },
        scrollUp: { mode: 2, isOn: false, keys: ['w', 'W'] },
        scrollLeft: { mode: 2, isOn: false, keys: ['a', 'A'] },
        scrollDown: { mode: 2, isOn: false, keys: ['s', 'S'] },
        scrollRight: { mode: 2, isOn: false, keys: ['d', 'D'] },
        'panX+': { mode: 2, isOn: false, keys: ['ArrowRight'] },
        'panX-': { mode: 2, isOn: false, keys: ['ArrowLeft'] },
        'panY+': { mode: 2, isOn: false, keys: ['ArrowDown'] },
        'panY-': { mode: 2, isOn: false, keys: ['ArrowUp'] },
        'noiseRes+': { mode: 2, isOn: false, keys: ['x', 'X'] },
        'noiseRes-': { mode: 2, isOn: false, keys: ['z', 'Z'] },
        randSeed: { mode: 1, isOn: false, keys: ['r', 'R'] },
    };

    private ctlList: TControlIdentifier[] = Object.keys(this.ctrl) as TControlIdentifier[];

    constructor(canvasElemId: string, widthPx: number, heightPx: number) {
        if (!document.getElementById(canvasElemId)) {
            throw new Error(`Canvas element "${canvasElemId}" not found.`);
        }
        this._halt = false;
        this.canvas = (document.getElementById(canvasElemId) as HTMLCanvasElement);
        this.canvas.style.width = `${widthPx}px`;
        this.canvas.style.height = `${heightPx}px`;
        const scale = window.devicePixelRatio;
        // const scale = window.devicePixelRatio;
        this.canvas.width = Math.floor(widthPx * scale);
        this.canvas.height = Math.floor(heightPx * scale);
        this.ctx = this.canvas.getContext('2d')!;
        this.ctx.scale(scale, scale);
        this._world = new World(0, 0);
        document.addEventListener('keypress', (e) => {
            this.ctlList.forEach((ctlId) => {
                if (
                    this.ctrl[ctlId].mode === 1
                    && this.ctrl[ctlId].keys.includes(e.key)
                ) {
                    this.ctrl[ctlId].presses = this.ctrl[ctlId].presses
                        ? this.ctrl[ctlId].presses! + 1
                        : 1;
                }
            });
        });
        document.addEventListener('keydown', (e) => {
            this.ctlList.forEach((ctlId) => {
                if (
                    this.ctrl[ctlId].mode === 2
                    && this.ctrl[ctlId].keys.includes(e.key)
                ) {
                    this.ctrl[ctlId].isOn = true;
                }
            });
        });
        document.addEventListener('keyup', (e) => {
            this.ctlList.forEach((ctlId) => {
                if (
                    this.ctrl[ctlId].mode === 2
                    && this.ctrl[ctlId].keys.includes(e.key)
                ) {
                    this.ctrl[ctlId].isOn = false;
                }
            });
        });
    }

    get canvasWidth(): number {
        return this.canvas.width;
    }

    get canvasHeight(): number {
        return this.canvas.height;
    }

    get world(): World {
        return this._world;
    }

    setWorldSize(cols: number, rows: number) {
        this._world = new World(cols, rows);
        return this;
    }

    randomizeWorld() {
        this.world.randomizeField();
        return this;
    }

    generateWorld(seed: any) {
        this.world.generateNoise(seed);
        return this;
    }

    setCellRenderSize(cellWidthPx: number, cellHeightPx: number) {
        this.world.setCellRenderSize(cellWidthPx, cellHeightPx);
        return this;
    }

    showDebug(x: number = 0, y: number = 0) {
        this.debugInfoPos = { x, y };
        this._renderDebugInfo = true;
        return this;
    }

    hideDebug() {
        this._renderDebugInfo = false;
        return this;
    }

    toggleDebug() {
        this._renderDebugInfo = !this._renderDebugInfo;
        return this;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderDebugInfo(data: IServiceGameData) {
        if (!this._renderDebugInfo) return;
        const lineHeightPx = 12;
        const lineWidthPx = 120;
        const keys = Object.keys(data);
        this.ctx.fillStyle = 'black';
        this.ctx.globalAlpha = 0.8;
        this.ctx.fillRect(
            this.debugInfoPos.x,
            this.debugInfoPos.y,
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

    showCtrl(alsoShow: boolean = true, x: number = 0, y: number = 0) {
        this.ctrlInfoPos = { x, y };
        if (alsoShow) this._renderCtrlInfo = true;
        return this;
    }

    hideCtrl() {
        this._renderCtrlInfo = false;
        return this;
    }

    toggleCtrl() {
        this._renderCtrlInfo = !this._renderCtrlInfo;
        return this;
    }

    renderCtrlInfo() {
        if (!this._renderCtrlInfo) return;
        const lineHeightPx = 12;
        const lineWidthPx = 150;
        const keys: TControlIdentifier[] = Object.keys(this.ctrl) as TControlIdentifier[];
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
            const text = `${keys[i]}: ${this.ctrl[keys[i]].keys.join(', ')}`;
            const newY = this.ctrlInfoPos.y + (lineHeightPx * (i + 1) - 3);
            this.ctx.fillText(text, this.ctrlInfoPos.x, newY, lineWidthPx);
        }
    }

    applyMapControls() {
        if (this.ctrl.scrollDown.isOn) {
            this.yOffset -= this.offsetStep;
        }
        if (this.ctrl.scrollUp.isOn) {
            this.yOffset += this.offsetStep;
        }
        if (this.ctrl.scrollLeft.isOn) {
            this.xOffset += this.offsetStep;
        }
        if (this.ctrl.scrollRight.isOn) {
            this.xOffset -= this.offsetStep;
        }
        if (this.ctrl.zoomIn.presses) {
            this._world.incCellWidth(2);
            this._world.incCellHeight(1);
            this.ctrl.zoomIn.presses -= 1;
        }
        if (this.ctrl.zoomOut.presses) {
            this._world.decCellWidth(2);
            this._world.decCellHeight(1);
            this.ctrl.zoomOut.presses -= 1;
        }
        if (this.ctrl.resetPosition.presses) {
            this._world.setCellWidth(6);
            this._world.setCellHeight(6);
            this.xOffset = 0;
            this.yOffset = 0;
            this._world.setPanX(0);
            this._world.setPanY(0);
            this._world.setNoiseRes(100);
            this.ctrl.resetPosition.presses -= 1;
        }
        if (this.ctrl['panX+'].isOn) {
            this._world.incPanX();
        }
        if (this.ctrl['panX-'].isOn) {
            this._world.decPanX();
        }
        if (this.ctrl['panY+'].isOn) {
            this._world.incPanY();
        }
        if (this.ctrl['panY-'].isOn) {
            this._world.decPanY();
        }
        if (this.ctrl['noiseRes+'].isOn) {
            this._world.incNoiseRes();
        }
        if (this.ctrl['noiseRes-'].isOn) {
            this._world.decNoiseRes();
        }
        if (this.ctrl.randSeed.presses) {
            this._world.randSeed();
            this.ctrl.randSeed.presses -= 1;
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
            pTimestamp = timestamp;
            const fps = Math.round(1000 / tDelta);
            this.applyMapControls();
            this.clearCanvas();
            this.world.render(this.ctx, this.xOffset, this.yOffset);
            this.renderDebugInfo({ t: timestamp, tDelta, fps });
            this.renderCtrlInfo();
        };
        requestAnimationFrame(tick);
    }

    halt() {
        this._halt = true;
    }
}

export default Game;
