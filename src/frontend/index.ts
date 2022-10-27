import GameApp from './gameApp';

const canvasElemId = 'gameCanvas';
const runBtnElemId = 'runBtn';
const haltBtnElemId = 'haltBtn';
const ctrlTglBtnElemId = 'ctrlTglBtn';
const dbgTglBtnElemId = 'dbgTglBtn';

async function main() {
    const g = new GameApp(canvasElemId, 400, 400)
        .setWorldSize(128, 128)
        .generateWorld()
        .setCellRenderSize(2, 2)
        .showDebug()
        .showCtrl(120);
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
