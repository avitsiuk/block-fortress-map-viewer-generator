import {
    IMiscSpritesCollection,
    ITerrainSpritesCollection,
} from './types';

// ==================== TERRAINS ====================
const terrainSpritesPx = {
    x: 32,
    y: 32,
};

// =============================================================================
const terrainSprites: ITerrainSpritesCollection = {
    size: { x: terrainSpritesPx.x, y: terrainSpritesPx.y },
    images: {
        '': null,
        dirt: new Image(terrainSpritesPx.x, terrainSpritesPx.y),
    },
};
terrainSprites.images.dirt!.src = 'assets/tiles/tile_grass.png';

// =============================================================================
const miscSprites: IMiscSpritesCollection = {
    size: { x: terrainSpritesPx.x, y: terrainSpritesPx.y },
    images: {
        select: new Image(terrainSpritesPx.x, terrainSpritesPx.y),
    },
};
miscSprites.images.select.src = 'assets/tiles/tile_grass.png';

// =============================================================================
export {
    terrainSprites,
    miscSprites,
};
