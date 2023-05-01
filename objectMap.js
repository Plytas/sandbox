import {game} from "./game.js";
import Belt from "./entities/belt.js";
import Item from "./items/item.js";
import Cell from "./common/cell.js";

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
    }

    /**
     * @param {p5.Vector} position
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
        if (this.cells[cell.x] === undefined) {
            this.cells[cell.x] = [];
        }

        this.cells[cell.x][cell.y] = cell;
    }

    /**
     * @param {p5.Vector} position
     * @returns {Cell}
     */
    getCell(position) {
        if (this.positionIsEmpty(position)) {
            return new Cell(position);
        }

        return this.cells[position.x][position.y];
    }

    /**
     * @param {p5.Vector} position
     */
    performActionOnPosition(position) {
        if (this.positionIsEmpty(position)) {
            return;
        }

        let object = this.getCell(position);

        if (object.entity instanceof Belt) {
            object.acceptItem(object.entity.input.direction.opposite(), new Item());

            return;
        }

        game.engine.iterateOverPositions(object.entity.originPosition, object.entity.size, (callbackPosition) => {
            game.state.objectMap.deleteObjectInPosition(callbackPosition);
        });
    }

    /**
     * @param {p5.Vector} position
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
