export const config = {
    debug: false,
    toggleDebug: () => {
        config.debug = !config.debug;
    },
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
        m: 77,
        q: 81,
        r: 82,
        s: 83,
        w: 87,
        x: 88,
    }
}
