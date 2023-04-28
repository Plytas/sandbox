import { config } from './config.js';
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
        this.processExtractors();
        this.processBelts();
    }

    processExtractors() {
        this.extractors
            .slice()
            .reverse()
            .forEach((cell, index, list) => {
                if (cell.isEmpty()) {
                    this.extractors.splice(list.length - 1 - index, 1);
                    return;
                }

                cell.draw();
            });

        this.extractors
            .slice()
            .reverse()
            .forEach((cell) => {
                cell.drawItem();
            });

        this.extractors
            .slice()
            .reverse()
            .forEach((cell) => {
                cell.work();
            });
    }

    processBelts() {
        if (config.beltAnimationProgress > 60) {
            config.beltAnimationProgress = 0;
        }

        this.belts
            .slice()
            .reverse()
            .forEach((cell, index, list) => {
                if (cell.isEmpty()) {
                    this.belts.splice(list.length - 1 - index, 1);
                    return;
                }

                cell.draw();
            });

        this.belts
            .slice()
            .reverse()
            .forEach(cell => {
                cell.drawItem();
            });

        this.belts
            .slice()
            .reverse()
            .forEach(cell => {
                cell.work();
            });

        config.beltAnimationProgress += 1;
    }
}
