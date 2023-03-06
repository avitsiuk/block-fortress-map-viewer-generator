import {
    ITerrainSpritesCollection,
} from './types';

// ==================== TERRAINS ====================
const terrainSpritesPx = {
    x: 32,
    y: 32,
};

const terrains: ITerrainSpritesCollection = {
    size: { x: terrainSpritesPx.x, y: terrainSpritesPx.y },
    images: {
        '': new Image(terrainSpritesPx.x, terrainSpritesPx.y),
        select: new Image(terrainSpritesPx.x, terrainSpritesPx.y),
        grass: new Image(terrainSpritesPx.x, terrainSpritesPx.y),
    },
};

terrains.images.grass.src = 'assets/tiles/tile_grass.png';
terrains.images.select.src = 'assets/tiles/tile_select.png';

export {
    terrains,
};
