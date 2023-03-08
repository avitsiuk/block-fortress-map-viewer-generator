import Game from './gameApp';

const canvasElemId = 'gameCanvas';
const runBtnElemId = 'runBtn';
const haltBtnElemId = 'haltBtn';
const ctrlTglBtnElemId = 'ctrlTglBtn';
const dbgTglBtnElemId = 'dbgTglBtn';

const canvasWidthPx = 1000;
const canvasHeightPx = 600;
const worldDims = { x: 7, y: 7, z: 5 };
const initArray: number[] = [
    1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1,

    1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1,

    1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 1, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1,

    1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1,

    1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1,
];

async function main() {
    const game = new Game(canvasElemId, { x: canvasWidthPx, y: canvasHeightPx })
        .setWorldSize(worldDims)
        .initFromArray(initArray)
        .setRenderedSubfield(
            { x: 0, y: 0, z: 0 },
            { x: 7, y: 7, z: 1 },
        )
        .showDebug({ x: 0, y: canvasHeightPx - 60 })
        .showCtrl({ x: 120, y: canvasHeightPx - 60 });

    // cycle layers
    setInterval(
        () => {
            const sf = game.renderedSubfield;
            sf.origin = {
                x: sf.origin.x,
                y: sf.origin.y,
                z: (sf.origin.z + 1) % game.world.fieldDims.z,
            };
            game.setRenderedSubfield(sf.origin, sf.dims);
            console.log(`[${sf.origin.x};${sf.origin.y};${sf.origin.z}],[${sf.dims.x};${sf.dims.y};${sf.dims.z}]`);
        },
        1000,
    );
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
