import {game} from "./game.js";
import Cell from "./common/cell.js";
import Belt from "./entities/belt.js";
import Extractor from "./entities/extractor.js";
import Merger from "./entities/merger.js";
import Splitter from "./entities/splitter.js";
import {config} from "./config.js";
import Position from "./common/position.js";
import Direction from "./common/direction.js";

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
     * @param {Cell[]} cells
     */
    recreateFromCells(cells) {
        this.cells = [];
        this.belts = [];
        this.extractors = [];
        this.mergers = [];
        this.splitters = [];

        for (let i = 0; i < cells.length; i++) {
            let cell = cells[i];

            this.setCell(cell);

            if (cell.entity instanceof Belt) {
                this.belts.push(cell);
            } else if (cell.entity instanceof Extractor) {
                if (!cell.position.equals(cell.entity.originPosition)) {
                    continue;
                }

                this.extractors.push(cell);
            } else if (cell.entity instanceof Merger) {
                this.mergers.push(cell);
            } else if (cell.entity instanceof Splitter) {
                this.splitters.push(cell);
            }
        }
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
    deleteObjectInPosition(position) {
        let object = this.getCell(position);
        let originPosition = object.entity.originPosition;
        let size = object.entity.size;

        game.engine.iterateOverPositions(originPosition, size, (callbackPosition) => {
            game.state.objectMap.clearOutPosition(callbackPosition);
        });

        game.engine.iterateOverPositions(originPosition.relativePosition(-1, -1), size.relativeSize(2, 2), (callbackPosition) => {
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
    clearOutPosition(position) {
        if (this.positionIsEmpty(position)) {
            return;
        }

        this.cells[position.x][position.y].destroy();
        this.cells[position.x][position.y] = undefined;
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

    /**
     * @param {Position} position
     * @param {Direction} direction
     */
    createBelt(position, direction) {
        let belt = new Belt(position, direction);
        let cell = new Cell(position, belt);
        this.setCell(cell);

        translate(-config.origin.x, -config.origin.y);
        scale(config.zoom.scale);
        cell.draw();

        this.belts.push(cell);

        let nextPosition = belt.output.cell.nextPosition(belt.output.direction)
        let object = this.getCell(nextPosition)

        if (object.entity instanceof Belt) {
            object.entity.configureInput();
        }
    }

    /**
     * @param {Position} position
     * @param {Direction} direction
     */
    createExtractor(position, direction) {
        let extractor = new Extractor(position, direction);

        game.engine.iterateOverPositions(position, extractor.size, (callbackPosition, loops) => {
            let cell = new Cell(callbackPosition, extractor);
            this.setCell(cell);

            if (loops === 0) {
                translate(-config.origin.x, -config.origin.y);
                scale(config.zoom.scale);
                cell.draw();

                this.extractors.push(cell);
            }
        });

        let nextPosition = extractor.output.cell.nextPosition(extractor.output.direction)
        let object = game.state.objectMap.getCell(nextPosition)

        if (object.entity instanceof Belt) {
            object.entity.configureInput();
        }
    }

    /**
     * @param {Position} position
     * @param {Direction} direction
     */
    createMerger(position, direction) {
        let merger = new Merger(position, direction);
        let cell = new Cell(position, merger);
        this.setCell(cell);

        translate(-config.origin.x, -config.origin.y);
        scale(config.zoom.scale);
        cell.draw();

        this.mergers.push(cell);

        let nextPosition = merger.output.cell.nextPosition(merger.output.direction)
        let object = game.state.objectMap.getCell(nextPosition)

        if (object.entity instanceof Belt) {
            object.entity.configureInput();
        }
    }

    /**
     * @param {Position} position
     * @param {Direction} direction
     */
    createSplitter(position, direction) {
        let splitter = new Splitter(position, direction);
        let cell = new Cell(position, splitter);
        this.setCell(cell);

        translate(-config.origin.x, -config.origin.y);
        scale(config.zoom.scale);
        cell.draw();

        this.splitters.push(cell);

        for (let i = 0; i < 3; i++) {
            let nextPosition = splitter.outputs[i].cell.nextPosition(splitter.outputs[i].direction)
            let object = game.state.objectMap.getCell(nextPosition)

            if (object.entity instanceof Belt) {
                object.entity.configureInput();
            }
        }
    }
}
