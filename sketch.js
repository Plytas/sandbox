let debug = false;
let gridSize = 20;
let zoom = {
    min: 1,
    max: 5,
    step: 0.5,
    scale: 2.5,
};
let scrollStep = 5;
let mapSize = new p5.Vector(1000, 1000);
let canvasSize = new p5.Vector(500, 500);
let origin = new p5.Vector(0, 0);

let objectMap = new ObjectMap();

let inHand = null;
let globalDirection = Direction.Up;

let touchZoom = [];
let touchMovement = [];
let wasTouchZoomed = false

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
    push();
    move();
    noStroke();

    background(50);
    fill(220);
    rect(0, 0, mapSize.x, mapSize.y);

    objectMap.processCells();

    drawMouseSquare(mouseCell());

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
 * @param {p5.Vector} cell
 */
function drawMouseSquare(cell) {
    push();

    strokeWeight(1);
    stroke(51);

    if (outOfBounds() || !objectMap.cellIsEmpty(cell)) {
        fill(200, 0, 0, 100);
    } else {
        fill(200, 200, 200, 200);
    }

    rect(cell.x * gridSize, cell.y * gridSize, gridSize, gridSize);

    if (inHand !== null) {
        inHand.position(cell);

        push();
        if (!objectMap.cellIsEmpty(cell)) {
            translate(2, 2);
        }
        inHand.draw();
        pop();
    }

    if (debug) {
        fill(255);
        text(cell.x + ":" + cell.y, cell.x * gridSize, cell.y * gridSize);
    }

    pop();
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
 * @returns {p5.Vector}
 */
function mouseCell() {
    return new p5.Vector(
        Math.floor((mouseX + origin.x) / (gridSize * zoom.scale)),
        Math.floor((mouseY + origin.y) / (gridSize * zoom.scale)),
    );
}

function outOfBounds() {
    return (
        mouseX + origin.x <= 0 ||
        mouseX + origin.x >= mapSize.x * zoom.scale ||
        mouseY + origin.y <= 0 ||
        mouseY + origin.y >= mapSize.y * zoom.scale
    );
}

function click() {
    if (outOfBounds()) {
        return;
    }

    let cell = mouseCell();
    let object = objectMap.getCell(cell);

    if (inHand !== null) {
        if (objectMap.cellIsEmpty(cell)) {
            if (inHand.entity instanceof Belt) {
                createBelt();
            } else if (inHand.entity instanceof Extractor) {
                createExtractor();
            }
        }

        return;
    }

    if (object === null || object.isEmpty()) {
        return;
    }

    if (object.entity instanceof Belt) {
        object.acceptItem(Direction.Up, 'coal');

        return;
    }

    objectMap.deleteObjectInCell(cell);
}

function createBelt() {
    handCell = inHand.position();
    belt = new Belt(inHand.entity.direction);
    cell = new Cell(handCell, belt);
    objectMap.setCell(cell);

    translate(-origin.x, -origin.y);
    scale(zoom.scale);
    cell.draw();

    objectMap.belts.push(cell);
}

function createExtractor() {
    handCell = inHand.position();
    extractor = new Extractor(inHand.entity.direction);
    cell = new Cell(handCell, extractor);
    objectMap.setCell(cell);

    translate(-origin.x, -origin.y);
    scale(zoom.scale);
    cell.draw();

    objectMap.extractors.push(cell);
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
        cell = mouseCell();

        if (inHand !== null) {
            inHand.rotate(!event.shiftKey);
            globalDirection = inHand.entity.direction;
            dump(globalDirection);
            return
        }

        return objectMap.rotateObjectInCell(cell, !event.shiftKey);
    }

    if (keyCode === 66) {
        //b
        cell = mouseCell();

        dump(globalDirection);
        inHand = new Cell(cell, new Belt(globalDirection, true));
    }

    if (keyCode === 77) {
        //m
        cell = mouseCell();

        inHand = new Cell(cell, new Extractor(globalDirection, true));
    }

    if (keyCode === 70) {
        //f

        fs = fullscreen();
        fullscreen(!fs);
    }

    if (keyCode === 81) {
        //q

        cell = mouseCell();

        if (inHand !== null) {
            inHand = null;
        } else if (!objectMap.cellIsEmpty(cell)) {
            cellObject = objectMap.getCell(cell);

            globalDirection = cellObject.entity.direction;
            inHand = new Cell(
                cell,
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
