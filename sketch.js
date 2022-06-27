let debug = false;
let gridSize = 50;
let zoom = {
    min: 0.4,
    max: 2,
    step: 0.2,
    scale: 1,
};
let scrollStep = 5;
let mapSize = new p5.Vector(2500, 2500);
let canvasSize = new p5.Vector(500, 500);
let origin = new p5.Vector(0, 0);
let mouse = new Mouse();

let objectMap = new ObjectMap();

let inHand = null;
let globalDirection = Direction.Up;

let touchZoom = [];
let touchMovement = [];
let wasTouchZoomed = false
let oresSpriteSheet;
let oresSpriteData;
let beltAnimationProgress = 30;

function preload() {
    oresSpriteData = loadJSON('sprites/ores.json');
    oresSpriteSheet = loadImage('sprites/ores.png');
}

function setup() {
    canvasSize.x = displayWidth
    canvasSize.y = displayHeight
    canvas = createCanvas(canvasSize.x, canvasSize.y);
    canvas.touchStarted(touch);
    canvas.touchMoved(touchMove);
    canvas.mousePressed(click);
    canvas.mouseWheel(wheel);
}

function draw() {
    mouse.precalculateCell();

    noSmooth();
    push();
    move();
    noStroke();

    background(50);
    fill(220);
    rect(0, 0, mapSize.x, mapSize.y);

    objectMap.processCells();

    mouse.draw();

    pop();

    if (debug) {
        fill(255);
        text(objectMap.extractors.length, 20, 20);

        rectMode(CENTER);
        fill(0);
        rect(canvasSize.x / 2, canvasSize.y / 2, 3, 3);
        rectMode(CORNER);
    }
}

/**
 * @callback iteratedCell
 * @param {p5.Vector} cell
 * @param {number} loops
 * @returns {*}
 */

/**
 * @param {p5.Vector} cell
 * @param {p5.Vector} size
 * @param {iteratedCell} callback
 * @returns {*}
 */
function iterateOverCells(cell, size, callback) {
    let callbackResponse;
    let loops = 0;

    for (let i = 0; i < size.x; i++) {
        for (let j = 0; j < size.y; j++) {
            callbackResponse = callback(new p5.Vector(cell.x + i, cell.y + j), loops);

            if (callbackResponse !== undefined) {
                return callbackResponse;
            }

            loops++;
        }
    }
}

function minX() {
    return (gridSize * zoom.scale) / 2 - canvasSize.x / 2;
}

function minY() {
    return (gridSize * zoom.scale) / 2 - canvasSize.y / 2;
}

function maxX() {
    return mapSize.x * zoom.scale - (gridSize * zoom.scale) / 2 - canvasSize.x / 2;
}

function maxY() {
    return mapSize.y * zoom.scale - (gridSize * zoom.scale) / 2 - canvasSize.y / 2;
}

/**
 * @param {p5.Vector} position
 */
function performMove(position) {
    origin.x += position.x;
    origin.y += position.y;

    if (origin.x < minX()) {
        origin.x = minX();
    }

    if (origin.x > maxX()) {
        origin.x = maxX();
    }

    if (origin.y < minY()) {
        origin.y = minY();
    }

    if (origin.y > maxY()) {
        origin.y = maxY();
    }
}

function move() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        dump(origin);

        performMove(new p5.Vector(-scrollStep, 0));
    }

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        dump(origin);

        performMove(new p5.Vector(scrollStep, 0));
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        dump(origin);

        performMove(new p5.Vector(0, -scrollStep));
    }

    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        dump(origin);

        performMove(new p5.Vector(0, scrollStep));
    }

    translate(-origin.x, -origin.y);
    scale(zoom.scale);
}

/**
 * @param {p5.Vector} cell
 * @return {boolean}
 */
function cellIsOutOfBounds(cell) {
    return cell.x < 0 ||
        cell.x >= mapSize.x / gridSize ||
        cell.y < 0 ||
        cell.y >= mapSize.y / gridSize;
}

function click() {
    let cell = mouse.cell;
    let size = mouse.cellSize();

    let anyCellIsOutOfBounds = iterateOverCells(cell, size, (callbackCell, loops) => {
        if (cellIsOutOfBounds(callbackCell)) {
            return true;
        }
    });

    if (anyCellIsOutOfBounds) {
        return;
    }

    if (inHand !== null) {
        let anyCellIsNotEmpty = iterateOverCells(cell, size, (callbackCell, loops) => {
            if (!objectMap.cellIsEmpty(callbackCell)) {
                return true;
            }
        });

        if (anyCellIsNotEmpty) {
            return;
        }

        if (inHand.entity instanceof Belt) {
            createBelt();
        } else if (inHand.entity instanceof Extractor) {
            createExtractor();
        }

        return;
    }

    let object = objectMap.getCell(cell);

    if (object === null || object.isEmpty()) {
        return;
    }

    if (object.entity instanceof Belt) {
        object.acceptItem(object.entity.direction, new Item());

        return;
    }

    iterateOverCells(object.entity.originCell, object.entity.size, (callbackCell, loops) => {
        objectMap.deleteObjectInCell(callbackCell);
    });

    // objectMap.deleteObjectInCell(cell);
}

function createBelt() {
    handCell = inHand.position();
    belt = new Belt(handCell, inHand.entity.direction);
    cell = new Cell(handCell, belt);
    objectMap.setCell(cell);

    translate(-origin.x, -origin.y);
    scale(zoom.scale);
    cell.draw();

    objectMap.belts.push(cell);
}

function createExtractor() {
    handCell = inHand.position();
    extractor = new Extractor(handCell, inHand.entity.direction);

    iterateOverCells(handCell, extractor.size, (callbackCell, loops) => {
        cell = new Cell(callbackCell, extractor);
        objectMap.setCell(cell);

        if (loops === 0) {
            translate(-origin.x, -origin.y);
            scale(zoom.scale);
            cell.draw();

            objectMap.extractors.push(cell);
        }
    });
}

function wheel(event) {
    performZoom(new p5.Vector(event.x, event.y), event.deltaY > 0)
}

/**
 * @param {p5.Vector} point
 * @param {boolean} out
 */
function performZoom(point, out = false) {
    let step = out ? -zoom.step : +zoom.step;
    let newScale = max(zoom.min, min(zoom.max, zoom.scale + step));

    if (newScale === zoom.scale) {
        return;
    }

    origin.x = (point.x + origin.x) * (newScale / zoom.scale) - point.x;
    origin.y = (point.y + origin.y) * (newScale / zoom.scale) - point.y;

    zoom.scale = newScale;

    if (origin.x < minX()) {
        origin.x = minX();
    }

    if (origin.y < minY()) {
        origin.y = minY();
    }

    if (origin.x > maxX()) {
        origin.x = maxX();
    }

    if (origin.y > maxY()) {
        origin.y = maxY();
    }
}

function keyPressed(event) {
    let cell;
    dump(event);

    if (keyCode === 88) {
        //x
        debug = !debug;
    }

    if (keyCode === 82) {
        //r
        if (inHand !== null) {
            inHand.rotate(!event.shiftKey);
            globalDirection = inHand.entity.direction;
            dump(globalDirection);
            return
        }

        return objectMap.rotateObjectInCell(mouse.cell, !event.shiftKey);
    }

    if (keyCode === 66) {
        //b
        dump(globalDirection);
        inHand = new Cell(mouse.cell, new Belt(mouse.cell, globalDirection, true));
    }

    if (keyCode === 77) {
        //m
        inHand = new Cell(mouse.cell, new Extractor(mouse.cell, globalDirection, true));
    }

    if (keyCode === 70) {
        //f

        fs = fullscreen();
        fullscreen(!fs);
    }

    if (keyCode === 81) {
        //q
        if (inHand !== null) {
            inHand = null;
        } else if (!objectMap.cellIsEmpty(mouse.cell)) {
            cellObject = objectMap.getCell(mouse.cell);

            globalDirection = cellObject.entity.direction;
            inHand = new Cell(
                mouse.cell,
                new cellObject.entity.constructor(globalDirection, true)
            );
        }
    }
}

function dump(value) {
    if (debug) {
        console.log(value);
    }
}

function windowResized() {
    canvasSize.x = windowWidth;
    canvasSize.y = windowHeight;
    resizeCanvas(windowWidth, windowHeight);
}

function touch() {
}

function touchMove(event) {
    if (touches.length === 2) {
        wasTouchZoomed = true;
        touchZoom.unshift(event.touches)

        if (touchZoom.length > 10) {
            touchZoom.pop();
        }

        if (touchZoom.length === 10) {
            firstTouches = touchZoom[0];
            lastTouches = touchZoom[touchZoom.length - 1];

            firstDistance = dist(firstTouches[0].clientX, firstTouches[0].clientY, firstTouches[1].clientX, firstTouches[1].clientY);
            lastDistance = dist(lastTouches[0].clientX, lastTouches[0].clientY, lastTouches[1].clientX, lastTouches[1].clientY);

            dump({
                firstDistance: firstDistance,
                lastDistance: lastDistance
            });

            if (abs(firstDistance - lastDistance) > 10) {
                performZoom(new p5.Vector(canvasSize.x / 2, canvasSize.y / 2), firstDistance > lastDistance);
                touchZoom = [];
            }
        }
    }

    if (touches.length === 1) {
        touchMovement.unshift(event.touches[0]);

        if (touchMovement.length > 2) {
            touchMovement.pop();
        }

        if (touchMovement.length === 2) {
            firstTouch = touchMovement[0];
            lastTouch = touchMovement[touchMovement.length - 1];

            performMove(new p5.Vector(lastTouch.clientX - firstTouch.clientX, lastTouch.clientY - firstTouch.clientY));
        }
    }
}

function touchEnded(event) {
    if (event.type === 'mouseup') {
        return;
    }

    let fs = fullscreen();

    if (!fs) {
        fullscreen(true);
    }

    if (!touchMovement.length && !wasTouchZoomed) {
        click();
    }

    clearTouchTracking();
    // prevent default
    return false;
}

function clearTouchTracking() {
    touchZoom = [];
    touchMovement = [];
    if (touches.length === 0) {
        wasTouchZoomed = false
    }
}
