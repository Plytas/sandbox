import Cell from "./common/cell.js";
import Direction from "./common/direction.js";
import Mouse from "./mouse.js";
import ObjectMap from "./objectMap.js";

export const config = {
    debug: false,
    gridSize: 50,
    zoom: {
        min: 0.4,
        max: 2,
        step: 0.2,
        scale: 1,
    },
    scrollStep: 5,
    mapSize: new p5.Vector(2500, 2500),
    canvasSize: new p5.Vector(500, 500),
    origin: new p5.Vector(0, 0),
    mouse: new Mouse(),

    objectMap: new ObjectMap(),

    /** @type {Cell|null} */
    inHand: null,
    globalDirection: Direction.Up,

    touchZoom: [],
    touchMovement: [],
    wasTouchZoomed: false,
    oresSpriteSheet: null,
    oresSpriteData: null,
    beltAnimationProgress: 30,
}