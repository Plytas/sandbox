import Position from "./common/position.js";
import Size from "./common/size.js";

export const config = {
    debug: false,
    toggleDebug: () => {
        config.debug = !config.debug;
    },
    pause: false,
    gridSize: 50,
    zoom: {
        min: 0.4,
        max: 2,
        step: 0.2,
        scale: 1,
    },
    scrollStep: 5,
    mapSize: new Size(2500, 2500),
    canvasSize: new Size(500, 500),
    origin: new Position(0, 0),

    touchZoom: [],
    touchMovement: [],
    wasTouchZoomed: false,
    oresSpriteSheet: null,
    oresSpriteData: null,
    beltAnimationProgress: 30,
    toggleFullscreen: () => {
        fullscreen(!fullscreen());
    },
    keyCodes: {
        a: 65,
        b: 66,
        d: 68,
        f: 70,
        g: 71,
        k: 75,
        l: 76,
        m: 77,
        p: 80,
        q: 81,
        r: 82,
        s: 83,
        t: 84,
        u: 85,
        w: 87,
        x: 88,
        z: 90,
        bracketRight: 221,
    },
    colors: {
        input: [64, 219, 255],
        output: [255, 128, 53],
        yellow: [255, 225, 25],
    }
}
