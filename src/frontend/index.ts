import GameApp from './gameApp';

const canvasElemId = 'gameCanvas';
const runBtnElemId = 'runBtn';
const haltBtnElemId = 'haltBtn';
const ctrlTglBtnElemId = 'ctrlTglBtn';
const dbgTglBtnElemId = 'dbgTglBtn';

async function main() {
    const game = new GameApp(canvasElemId, 1500, 900)
        .setWorldSize(128, 128)
        .generateWorld(0.42141786048107965)
        .setCellRenderSize(10, 5)
        .showDebug()
        .showCtrl(false, 120);
    game.xOffset = 50;
    game.yOffset = 400;
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
