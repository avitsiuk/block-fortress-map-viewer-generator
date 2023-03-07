import Game from './gameApp';

const canvasElemId = 'gameCanvas';
const runBtnElemId = 'runBtn';
const haltBtnElemId = 'haltBtn';
const ctrlTglBtnElemId = 'ctrlTglBtn';
const dbgTglBtnElemId = 'dbgTglBtn';

async function main() {
    const canvasWidthPx = 1000;
    const canvasHeightPx = 600;
    const game = new Game(canvasElemId, { x: canvasWidthPx, y: canvasHeightPx })
        .setWorldSize({ x: 10, y: 10, z: 10 })
        .showDebug({ x: 0, y: canvasHeightPx - 60 })
        .showCtrl({ x: 120, y: canvasHeightPx - 60 });
    document.getElementById(runBtnElemId)?.addEventListener('click', () => {
        game.run();
    });
    document.getElementById(haltBtnElemId)?.addEventListener('click', () => {
        game.halt();
    });
    document.getElementById(ctrlTglBtnElemId)?.addEventListener('click', () => {
        game.toggleCtrl();
    });
    document.getElementById(dbgTglBtnElemId)?.addEventListener('click', () => {
        game.toggleDebug();
    });
}

main();

export default main;
