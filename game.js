import Cell from "./common/cell.js/index.js";
import { config } from "./config.js";
import Belt from "./entities/belt.js";
import Extractor from "./entities/extractor.js";

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
export function iterateOverCells(cell, size, callback) {
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

/**
 * @param {p5.Vector} cell
 * @return {boolean}
 */
export function cellIsOutOfBounds(cell) {
    return cell.x < 0 ||
        cell.x >= config.mapSize.x / config.gridSize ||
        cell.y < 0 ||
        cell.y >= config.mapSize.y / config.gridSize;
}

function minX() {
    return (config.gridSize * config.zoom.scale) / 2 - config.canvasSize.x / 2;
}

function minY() {
    return (config.gridSize * config.zoom.scale) / 2 - config.canvasSize.y / 2;
}

function maxX() {
    return config.mapSize.x * config.zoom.scale - (config.gridSize * config.zoom.scale) / 2 - config.canvasSize.x / 2;
}

function maxY() {
    return config.mapSize.y * config.zoom.scale - (config.gridSize * config.zoom.scale) / 2 - config.canvasSize.y / 2;
}

/**
 * @param {p5.Vector} position
 */
export function performMove(position) {
    config.origin.x += position.x;
    config.origin.y += position.y;

    if (config.origin.x < minX()) {
        config.origin.x = minX();
    }

    if (config.origin.x > maxX()) {
        config.origin.x = maxX();
    }

    if (config.origin.y < minY()) {
        config.origin.y = minY();
    }

    if (config.origin.y > maxY()) {
        config.origin.y = maxY();
    }
}

export function move() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        dump(config.origin);

        performMove(new p5.Vector(-config.scrollStep, 0));
    }

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        dump(config.origin);

        performMove(new p5.Vector(config.scrollStep, 0));
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        dump(config.origin);

        performMove(new p5.Vector(0, -config.scrollStep));
    }

    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        dump(config.origin);

        performMove(new p5.Vector(0, config.scrollStep));
    }

    translate(-config.origin.x, -config.origin.y);
    scale(config.zoom.scale);
}

/**
 * @param {p5.Vector} point
 * @param {boolean} out
 */
export function performZoom(point, out = false) {
    let step = out ? -config.zoom.step : +config.zoom.step;
    let newScale = max(config.zoom.min, min(config.zoom.max, config.zoom.scale + step));

    if (newScale === config.zoom.scale) {
        return;
    }

    config.origin.x = (point.x + config.origin.x) * (newScale / config.zoom.scale) - point.x;
    config.origin.y = (point.y + config.origin.y) * (newScale / config.zoom.scale) - point.y;

    config.zoom.scale = newScale;

    if (config.origin.x < minX()) {
        config.origin.x = minX();
    }

    if (config.origin.y < minY()) {
        config.origin.y = minY();
    }

    if (config.origin.x > maxX()) {
        config.origin.x = maxX();
    }

    if (config.origin.y > maxY()) {
        config.origin.y = maxY();
    }
}

export function createBelt() {
    let handCell = config.inHand.position();
    let belt = new Belt(handCell, config.inHand.entity.direction);
    let cell = new Cell(handCell, belt);
    config.objectMap.setCell(cell);

    translate(-config.origin.x, -config.origin.y);
    scale(config.zoom.scale);
    cell.draw();

    config.objectMap.belts.push(cell);
}

export function createExtractor() {
    let handCell = config.inHand.position();
    let extractor = new Extractor(handCell, config.inHand.entity.direction);

    iterateOverCells(handCell, extractor.size, (callbackCell, loops) => {
        let cell = new Cell(callbackCell, extractor);
        config.objectMap.setCell(cell);

        if (loops === 0) {
            translate(-config.origin.x, -config.origin.y);
            scale(config.zoom.scale);
            cell.draw();

            config.objectMap.extractors.push(cell);
        }
    });
}