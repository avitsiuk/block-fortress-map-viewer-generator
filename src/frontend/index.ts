import Game from './gameApp';

import { testWorld1 } from './testInitArray';

const canvasElemId = 'gameCanvas';
const runBtnElemId = 'runBtn';
const haltBtnElemId = 'haltBtn';
const ctrlTglBtnElemId = 'ctrlTglBtn';
const dbgTglBtnElemId = 'dbgTglBtn';

const canvasWidthPx = 1000;
const canvasHeightPx = 600;

async function main() {
    const game = new Game(canvasElemId, { x: canvasWidthPx, y: canvasHeightPx })
        .setWorldSize(testWorld1.dims)
        .initFromArray(testWorld1.initArray)
        .showDebug({ x: 0, y: canvasHeightPx - 60 })
        .showCtrl({ x: 120, y: canvasHeightPx - 60 });

    setTimeout(() => {
        game.setRenderedSubfield(
            { x: 0, y: 0, z: 0 },
            { x: testWorld1.dims.x - 1, y: testWorld1.dims.y, z: testWorld1.dims.z },
        );
        setTimeout(() => {
            game.setRenderedSubfield(
                { x: 0, y: 0, z: 0 },
                { x: testWorld1.dims.x, y: testWorld1.dims.y, z: 1 },
            );
            setInterval(() => {
                const sf = game.renderedSubfield;
                sf.origin = {
                    x: sf.origin.x,
                    y: sf.origin.y,
                    z: (sf.origin.z + 1) % game.world.fieldDims.z,
                };
                game.setRenderedSubfield(sf.origin, sf.dims);
                console.log(
                    `[${sf.origin.x};${sf.origin.y};${sf.origin.z}],[${sf.dims.x};${sf.dims.y};${sf.dims.z}]`,
                );
            }, 1000);
        }, 2000);
    }, 3000);
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
