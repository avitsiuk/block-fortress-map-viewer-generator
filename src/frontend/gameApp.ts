import { IPosition, IServiceGameData } from '../common/utils';
import World from '../common/world';

type TControlIdentifier = 'resetPosition' | 'scrollUp' | 'scrollDown' | 'scrollLeft' | 'scrollRight' | 'zoomIn' | 'zoomOut';

type TControlsMap = {
    [key in TControlIdentifier]: {
        isOn: boolean,
        keys: string[]
    }
}

export class GameApp {
    private _world: World;

    private canvas: HTMLCanvasElement;

    private ctx: CanvasRenderingContext2D;

    private _halt: boolean;

    private _renderDebugInfo: boolean = false;

    private _renderCtrlInfo: boolean = false;

    private xOffset: number = 0;

    private yOffset: number = 0;

    private offsetStep: number = 10;

    private debugInfoPos: IPosition = { x: 0, y: 0 };

    private ctrlInfoPos: IPosition = { x: 0, y: 0 };

    private ctrl: TControlsMap = {
        resetPosition: { isOn: false, keys: ['f', 'F'] },
        zoomIn: { isOn: false, keys: ['e', 'E'] },
        zoomOut: { isOn: false, keys: ['q', 'Q'] },
        scrollUp: { isOn: false, keys: ['w', 'W'] },
        scrollLeft: { isOn: false, keys: ['a', 'A'] },
        scrollDown: { isOn: false, keys: ['s', 'S'] },
        scrollRight: { isOn: false, keys: ['d', 'D'] },
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
        document.addEventListener('keydown', (e) => {
            this.ctlList.forEach((ctlId) => {
                if (this.ctrl[ctlId].keys.includes(e.key)) {
                    this.ctrl[ctlId].isOn = true;
                }
            });
        });
        document.addEventListener('keyup', (e) => {
            this.ctlList.forEach((ctlId) => {
                if (this.ctrl[ctlId].keys.includes(e.key)) {
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

    showCtrl(x: number = 0, y: number = 0) {
        this.ctrlInfoPos = { x, y };
        this._renderCtrlInfo = true;
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
        if (this.ctrl.zoomIn.isOn) {
            this._world.incCellWidth();
            this._world.incCellHeight();
        }
        if (this.ctrl.zoomOut.isOn) {
            this._world.decCellWidth();
            this._world.decCellHeight();
        }
        if (this.ctrl.resetPosition.isOn) {
            this._world.setCellWidth(10);
            this._world.setCellHeight(10);
            this.xOffset = 0;
            this.yOffset = 0;
        }
    }

    run() {
        let pTimestamp = 0;
        console.log(this.world);
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

export default GameApp;
