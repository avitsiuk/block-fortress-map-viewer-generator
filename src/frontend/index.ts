// import Game from './game';

const canvasElemId = 'gameCanvas';
const runBtnElemId = 'runBtn';
const haltBtnElemId = 'haltBtn';
const ctrlTglBtnElemId = 'ctrlTglBtn';
const dbgTglBtnElemId = 'dbgTglBtn';

interface coord {
    x: number;
    y: number;
    z: number;
};

interface dim extends coord {}

function coordsToIdx(coords: coord, size: dim): number {
    return (coords.y * size.x + coords.x) + (coords.z * (size.x * size.y));
}

function idxToCoords(idx: number, size: dim): coord {
    return {
        x: idx % size.x,
        y: Math.floor(idx / size.x) % size.y,
        z: Math.floor(idx / (size.x * size.y)),
    };
}

async function main() {
    const size: dim = { x: 4, y: 3, z: 2 };
    console.log(`matrix size: {x:${size.x},y:${size.y},z:${size.z}}`);
    console.log(`max idx: ${(size.x * size.y * size.z) - 1}`);

    // let sourceCoords: coord = { x: 3, y: 2, z: 1 };
    // let resultIdx = coordsToIdx(sourceCoords, size);
    // console.log(`{x:${sourceCoords.x}, y:${sourceCoords.y}, z:${sourceCoords.z}} => ${resultIdx}`);

    // sourceCoords = { x: 0, y: 0, z: 0 };
    // resultIdx = coordsToIdx(sourceCoords, size);
    // console.log(`{x:${sourceCoords.x}, y:${sourceCoords.y}, z:${sourceCoords.z}} => ${resultIdx}`);

    // sourceCoords = { x: 0, y: 2, z: 1 };
    // resultIdx = coordsToIdx(sourceCoords, size);
    // console.log(`{x:${sourceCoords.x}, y:${sourceCoords.y}, z:${sourceCoords.z}} => ${resultIdx}`);

    // sourceCoords = { x: 3, y: 0, z: 1 };
    // resultIdx = coordsToIdx(sourceCoords, size);
    // console.log(`{x:${sourceCoords.x}, y:${sourceCoords.y}, z:${sourceCoords.z}} => ${resultIdx}`);

    // sourceCoords = { x: 3, y: 2, z: 0 };
    // resultIdx = coordsToIdx(sourceCoords, size);
    // console.log(`{x:${sourceCoords.x}, y:${sourceCoords.y}, z:${sourceCoords.z}} => ${resultIdx}`);

    let sourceIdx = 0;
    let resultCoords = idxToCoords(sourceIdx, size);
    console.log(`${sourceIdx}  => {x:${resultCoords.x}, y:${resultCoords.y}, z:${resultCoords.z}}`);

    sourceIdx = 12;
    resultCoords = idxToCoords(sourceIdx, size);
    console.log(`${sourceIdx}  => {x:${resultCoords.x}, y:${resultCoords.y}, z:${resultCoords.z}}`);

    sourceIdx = 20;
    resultCoords = idxToCoords(sourceIdx, size);
    console.log(`${sourceIdx}  => {x:${resultCoords.x}, y:${resultCoords.y}, z:${resultCoords.z}}`);

    sourceIdx = 8;
    resultCoords = idxToCoords(sourceIdx, size);
    console.log(`${sourceIdx}  => {x:${resultCoords.x}, y:${resultCoords.y}, z:${resultCoords.z}}`);

    sourceIdx = 3;
    resultCoords = idxToCoords(sourceIdx, size);
    console.log(`${sourceIdx}  => {x:${resultCoords.x}, y:${resultCoords.y}, z:${resultCoords.z}}`);

    sourceIdx = 15;
    resultCoords = idxToCoords(sourceIdx, size);
    console.log(`${sourceIdx}  => {x:${resultCoords.x}, y:${resultCoords.y}, z:${resultCoords.z}}`);

    sourceIdx = 23;
    resultCoords = idxToCoords(sourceIdx, size);
    console.log(`${sourceIdx}  => {x:${resultCoords.x}, y:${resultCoords.y}, z:${resultCoords.z}}`);

    sourceIdx = 11;
    resultCoords = idxToCoords(sourceIdx, size);
    console.log(`${sourceIdx}  => {x:${resultCoords.x}, y:${resultCoords.y}, z:${resultCoords.z}}`);
    // const game = new Game(canvasElemId, 1500, 900)
    //     .setWorldSize(50, 40)
    //     // .generateWorld(0.42141786048107965)
    //     .setCellRenderSize(32, 16)
    //     .showDebug()
    //     .showCtrl(false, 120);
    // game.xOffset = 0;
    // game.yOffset = 0;
    // document.getElementById(runBtnElemId)?.addEventListener('click', () => {
    //     game.run();
    // });
    // document.getElementById(haltBtnElemId)?.addEventListener('click', () => {
    //     game.halt();
    // });
    // document.getElementById(ctrlTglBtnElemId)?.addEventListener('click', () => {
    //     game.toggleCtrl();
    // });
    // document.getElementById(dbgTglBtnElemId)?.addEventListener('click', () => {
    //     game.toggleDebug();
    // });
}

main();

export default main;
