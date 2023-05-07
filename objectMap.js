import {game} from "./game.js";
import Cell from "./common/cell.js";
import Belt from "./entities/belt.js";
import Position from "./common/position.js";

export default class ObjectMap {
    constructor() {
        /** @type {Cell[][]} */
        this.cells = [];
        /** @type {Cell[]} */
        this.extractors = [];
        /** @type {Cell[]} */
        this.belts = [];
        /** @type {Cell[]} */
        this.mergers = [];
        /** @type {Cell[]} */
        this.splitters = [];
    }

    /**
     * @param {Position} position
     * @returns boolean
     */
    positionIsEmpty(position) {
        return this.cells[position.x] === undefined ||
            this.cells[position.x][position.y] === undefined ||
            this.cells[position.x][position.y].isEmpty()
    }

    /**
     * @param {Cell} cell
     */
    setCell(cell) {
        if (this.cells[cell.position.x] === undefined) {
            this.cells[cell.position.x] = [];
        }

        this.cells[cell.position.x][cell.position.y] = cell;
    }

    /**
     * @param {Position} position
     * @returns {Cell}
     */
    getCell(position) {
        if (this.positionIsEmpty(position)) {
            return new Cell(position);
        }

        return this.cells[position.x][position.y];
    }

    /**
     * @param {Position} position
     */
    performActionOnPosition(position) {
        if (this.positionIsEmpty(position)) {
            return;
        }

        let object = this.getCell(position);
        let originPosition = object.entity.originPosition;
        let size = object.entity.size;

        game.engine.iterateOverPositions(originPosition, size, (callbackPosition) => {
            game.state.objectMap.deleteObjectInPosition(callbackPosition);
        });

        let startPosition = originPosition.relativePosition(-1, -1);

        game.engine.iterateOverPositions(startPosition, new p5.Vector(size.x + 2, size.y + 2), (callbackPosition) => {
            if (callbackPosition.equals(game.state.mouse.position)) {
                return;
            }

            let object = game.state.objectMap.getCell(callbackPosition)

            if (object.entity instanceof Belt) {
                object.entity.configureInput();
            }
        });
    }

    /**
     * @param {Position} position
     */
    deleteObjectInPosition(position) {
        if (this.positionIsEmpty(position)) {
            return;
        }

        this.cells[position.x][position.y].destroy();
    }

    processObjects() {
        this.iterateObjects(this.extractors, (cell, index) => {
            if (cell.isEmpty()) {
                this.extractors.splice(index, 1);
                return;
            }

            cell.work();
        });
        this.iterateObjects(this.belts, (cell, index) => {
            if (cell.isEmpty()) {
                this.belts.splice(index, 1);
                return;
            }

            cell.work();
        });
        this.iterateObjects(this.mergers, (cell, index) => {
            if (cell.isEmpty()) {
                this.mergers.splice(index, 1);
                return;
            }

            cell.work();
        });
        this.iterateObjects(this.splitters, (cell, index) => {
            if (cell.isEmpty()) {
                this.splitters.splice(index, 1);
                return;
            }

            cell.work();
        });
    }

    drawObjects() {
        this.iterateObjects(this.extractors, (cell) => {
            cell.draw();
        })
        this.iterateObjects(this.belts, (cell) => {
            cell.draw();
        })
        this.iterateObjects(this.mergers, (cell) => {
            cell.draw();
        })
        this.iterateObjects(this.splitters, (cell) => {
            cell.draw();
        })
    }

    drawItems() {
        this.iterateObjects(this.extractors, (cell) => {
            cell.drawItem();
        });
        this.iterateObjects(this.belts, (cell) => {
            cell.drawItem();
        });
        this.iterateObjects(this.mergers, (cell) => {
            cell.drawItem();
        });
        this.iterateObjects(this.splitters, (cell) => {
            cell.drawItem();
        });
    }

    drawObjectDetails() {
        this.iterateObjects(this.extractors, (cell) => {
            cell.drawDetails();
        });
        this.iterateObjects(this.belts, (cell) => {
            cell.drawDetails();
        });
        this.iterateObjects(this.mergers, (cell) => {
            cell.drawDetails();
        });
        this.iterateObjects(this.splitters, (cell) => {
            cell.drawDetails();
        });
    }

    /**
     * @callback iteratedCallback
     * @param {Cell} cell
     * @param {number} index
     * @param {Cell[]} list
     * @returns {*}
     */

    /**
     * @param {Array} objects
     * @param {iteratedCallback} callback
     */
    iterateObjects(objects, callback) {
        objects.forEach(callback);
    }
}
