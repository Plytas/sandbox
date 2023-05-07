import {config} from "./config.js";
import {game} from "./game.js";
import * as debug from "./debug.js";
import Position from "./common/position.js";

window.preload = function () {
    config.oresSpriteData = loadJSON('sprites/ores.json');
    config.oresSpriteSheet = loadImage('sprites/ores.png');
}

window.setup = function () {
    config.canvasSize.x = windowWidth;
    config.canvasSize.y = windowHeight;

    let canvas = createCanvas(config.canvasSize.x, config.canvasSize.y);
    canvas.touchMoved(touchMove);
    canvas.mousePressed(() => game.state.mouse.click());
    canvas.mouseWheel((event) => game.state.mouse.wheel(event));
}

window.draw = function () {
    noStroke();
    noSmooth();

    push();

    game.state.mouse.precalculatePosition();

    game.camera.move();

    game.world.draw();

    game.state.processObjects();

    game.state.mouse.draw();

    pop();

    debug.draw();
}

window.keyPressed = function (event) {
    game.engine.keymap.handleKeyDown(event)
}

window.windowResized = function () {
    config.canvasSize.x = windowWidth;
    config.canvasSize.y = windowHeight;
    resizeCanvas(windowWidth, windowHeight);
}

function touchMove(event) {
    if (touches.length === 2) {
        config.wasTouchZoomed = true;
        config.touchZoom.unshift(event.touches)

        if (config.touchZoom.length > 10) {
            config.touchZoom.pop();
        }

        if (config.touchZoom.length === 10) {
            let firstTouches = config.touchZoom[0];
            let lastTouches = config.touchZoom[config.touchZoom.length - 1];

            let firstDistance = dist(firstTouches[0].clientX, firstTouches[0].clientY, firstTouches[1].clientX, firstTouches[1].clientY);
            let lastDistance = dist(lastTouches[0].clientX, lastTouches[0].clientY, lastTouches[1].clientX, lastTouches[1].clientY);

            if (abs(firstDistance - lastDistance) > 10) {
                game.camera.performZoom(new Position(config.canvasSize.x / 2, config.canvasSize.y / 2), firstDistance > lastDistance);
                config.touchZoom = [];
            }
        }
    }

    if (touches.length === 1) {
        config.touchMovement.unshift(event.touches[0]);

        if (config.touchMovement.length > 2) {
            config.touchMovement.pop();
        }

        if (config.touchMovement.length === 2) {
            let firstTouch = config.touchMovement[0];
            let lastTouch = config.touchMovement[config.touchMovement.length - 1];

            game.camera.performMove(new Position(lastTouch.clientX - firstTouch.clientX, lastTouch.clientY - firstTouch.clientY));
        }
    }
}

window.touchEnded = function (event) {
    if (event.type === 'mouseup') {
        return;
    }

    let fs = fullscreen();

    if (!fs) {
        fullscreen(true);
    }

    if (!config.touchMovement.length && !config.wasTouchZoomed) {
        game.state.mouse.click();
    }

    clearTouchTracking();
    // prevent default
    return false;
}

function clearTouchTracking() {
    config.touchZoom = [];
    config.touchMovement = [];
    if (touches.length === 0) {
        config.wasTouchZoomed = false
    }
}
