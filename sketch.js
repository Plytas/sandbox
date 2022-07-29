import { config } from "./config.js";
import Belt from "./entities/belt.js";
import Extractor from "./entities/extractor.js";
import * as game from "./game.js";
import Item from "./items/item.js";
import Cell from "./common/cell.js";

window.preload = function() {
    config.oresSpriteData = loadJSON('sprites/ores.json');
    config.oresSpriteSheet = loadImage('sprites/ores.png');
}

window.setup = function() {
    config.canvasSize.x = displayWidth
    config.canvasSize.y = displayHeight
    let canvas = createCanvas(config.canvasSize.x, config.canvasSize.y);
    canvas.touchStarted(touch);
    canvas.touchMoved(touchMove);
    canvas.mousePressed(click);
    canvas.mouseWheel(wheel);
}

window.draw = function() {
    config.mouse.precalculateCell();

    noSmooth();
    push();
    game.move();
    noStroke();

    background(50);
    fill(220);
    rect(0, 0, config.mapSize.x, config.mapSize.y);

    config.objectMap.processCells();

    config.mouse.draw();

    pop();

    if (config.debug) {
        fill(255);
        text(config.objectMap.extractors.length, 20, 20);

        rectMode(CENTER);
        fill(0);
        rect(config.canvasSize.x / 2, config.canvasSize.y / 2, 3, 3);
        rectMode(CORNER);
    }
}

function click() {
    let cell = config.mouse.cell;
    let size = config.mouse.cellSize();

    let anyCellIsOutOfBounds = game.iterateOverCells(cell, size, (callbackCell, loops) => {
        if (game.cellIsOutOfBounds(callbackCell)) {
            return true;
        }
    });

    if (anyCellIsOutOfBounds) {
        return;
    }

    if (config.inHand !== null) {
        let anyCellIsNotEmpty = game.iterateOverCells(cell, size, (callbackCell, loops) => {
            if (!config.objectMap.cellIsEmpty(callbackCell)) {
                return true;
            }
        });

        if (anyCellIsNotEmpty) {
            return;
        }

        if (config.inHand.entity instanceof Belt) {
            game.createBelt();
        } else if (config.inHand.entity instanceof Extractor) {
            game.createExtractor();
        }

        return;
    }

    let object = config.objectMap.getCell(cell);

    if (object === null || object.isEmpty()) {
        return;
    }

    if (object.entity instanceof Belt) {
        object.acceptItem(object.entity.direction, new Item());

        return;
    }

    game.iterateOverCells(object.entity.originCell, object.entity.size, (callbackCell, loops) => {
        config.objectMap.deleteObjectInCell(callbackCell);
    });

    // objectMap.deleteObjectInCell(cell);
}

function wheel(event) {
    game.performZoom(new p5.Vector(event.x, event.y), event.deltaY > 0)
}

window.keyPressed = function(event) {
    dump(event);

    if (keyCode === 88) {
        //x
        config.debug = !config.debug;
    }

    if (keyCode === 82) {
        //r
        if (config.inHand !== null) {
            config.inHand.rotate(!event.shiftKey);
            config.globalDirection = config.inHand.entity.direction;
            dump(config.globalDirection);
            return
        }

        return config.objectMap.rotateObjectInCell(config.mouse.cell, !event.shiftKey);
    }

    if (keyCode === 66) {
        //b
        dump(config.globalDirection);
        config.inHand = new Cell(config.mouse.cell, new Belt(config.mouse.cell, config.globalDirection, true));
    }

    if (keyCode === 77) {
        //m
        config.inHand = new Cell(config.mouse.cell, new Extractor(config.mouse.cell, config.globalDirection, true));
    }

    if (keyCode === 70) {
        //f

        let fs = fullscreen();
        fullscreen(!fs);
    }

    if (keyCode === 81) {
        //q
        if (config.inHand !== null) {
            config.inHand = null;
        } else if (!config.objectMap.cellIsEmpty(config.mouse.cell)) {
            let cellObject = config.objectMap.getCell(config.mouse.cell);

            config.globalDirection = cellObject.entity.direction;
            config.inHand = new Cell(
                config.mouse.cell,
                new cellObject.entity.constructor(config.mouse.cell, config.globalDirection, true)
            );
        }
    }
}

export function dump(value) {
    if (config.debug) {
        console.log(value);
    }
}

window.windowResized = function() {
    config.canvasSize.x = windowWidth;
    config.canvasSize.y = windowHeight;
    resizeCanvas(windowWidth, windowHeight);
}

function touch() {
}

function touchMove(event) {
    if (touches.length === 2) {
        config.wasTouchZoomed = true;
        config.touchZoom.unshift(event.touches)

        if (config.touchZoom.length > 10) {
            config.touchZoom.pop();
        }

        if (config.touchZoom.length === 10) {
            firstTouches = config.touchZoom[0];
            lastTouches = config.touchZoom[config.touchZoom.length - 1];

            firstDistance = dist(firstTouches[0].clientX, firstTouches[0].clientY, firstTouches[1].clientX, firstTouches[1].clientY);
            lastDistance = dist(lastTouches[0].clientX, lastTouches[0].clientY, lastTouches[1].clientX, lastTouches[1].clientY);

            dump({
                firstDistance: firstDistance,
                lastDistance: lastDistance
            });

            if (abs(firstDistance - lastDistance) > 10) {
                game.performZoom(new p5.Vector(config.canvasSize.x / 2, config.canvasSize.y / 2), firstDistance > lastDistance);
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
            firstTouch = config.touchMovement[0];
            lastTouch = config.touchMovement[config.touchMovement.length - 1];

            game.performMove(new p5.Vector(lastTouch.clientX - firstTouch.clientX, lastTouch.clientY - firstTouch.clientY));
        }
    }
}

window.touchEnded = function(event) {
    if (event.type === 'mouseup') {
        return;
    }

    let fs = fullscreen();

    if (!fs) {
        fullscreen(true);
    }

    if (!config.touchMovement.length && !config.wasTouchZoomed) {
        click();
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
