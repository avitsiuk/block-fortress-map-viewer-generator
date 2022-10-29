import GameApp from './gameApp';

const canvasElemId = 'gameCanvas';
const runBtnElemId = 'runBtn';
const haltBtnElemId = 'haltBtn';
const ctrlTglBtnElemId = 'ctrlTglBtn';
const dbgTglBtnElemId = 'dbgTglBtn';

async function main() {
    const g = new GameApp(canvasElemId, 640, 640)
        .setWorldSize(128, 128)
        .generateWorld(0.42141786048107965)
        .setCellRenderSize(6, 6)
        .showDebug()
        .showCtrl(false, 120);
    document.getElementById(runBtnElemId)?.addEventListener('click', () => {
        g.run();
    });
    document.getElementById(haltBtnElemId)?.addEventListener('click', () => {
        g.halt();
    });
    document.getElementById(ctrlTglBtnElemId)?.addEventListener('click', () => {
        g.toggleCtrl();
    });
    document.getElementById(dbgTglBtnElemId)?.addEventListener('click', () => {
        g.toggleDebug();
    });
}

main();

export default main;
