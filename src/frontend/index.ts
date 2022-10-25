import World from '../common/world';

const canvasElemId = 'myCanvas';

const main = function() {
    if (!document.getElementById(canvasElemId)) {
        throw new Error(`Canvas element "${canvasElemId}" not found.`);
    }
    const canvas = (document.getElementById(canvasElemId) as HTMLCanvasElement);
    if (!canvas.getContext) throw new Error('Looks like your browser does not support canvas.');
    const context = canvas.getContext('2d')!;
    const { width: canvasWidth, height: canvasHeight } = canvas.getBoundingClientRect();
    console.log(canvasWidth, canvasHeight);
    // const w = new World(1, 1);
    // console.log(w);
    // console.log(w.stringifyField(true));
};

main();

export default main;
