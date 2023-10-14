import Entity from "./entity.js";
import Direction from "../common/direction.js";
import {config} from "../config.js";
import {game} from "../game.js";
import Output from "../common/output.js";
import Input from "../common/input.js";
import Item from "../items/item.js";
import Position from "../common/position.js";

export default class UndergroundBelt extends Entity {
    /**
     * @param {Position} originPosition
     * @param {Direction} direction
     * @param {boolean} isGhost
     * @param {number} index
     */
    constructor(originPosition, direction = Direction.Up, isGhost = false, index) {
        super(originPosition, direction, isGhost);
        /** @type {Item|null} */
        this.item = null;
        this.progress = 0;
        this.reset = false;
        this.index = index;

        this.configureInput();
        this.configureOutput();
    }

    configureInput() {
        this.input = new Input(this.originPosition, this.direction.opposite());
    }

    configureOutput() {
        this.output = new Output(this.originPosition, this.direction);
    }

    /**
     * @param {Position} position
     */
    drawItem(position) {
        if (this.item === null) {
            return;
        }

        push();
        translate(position.x * config.gridSize + config.gridSize / 2, position.y * config.gridSize + config.gridSize / 2);

        if (this.progress < 30 + (this.item.width / 2) / (config.gridSize / 60)) {
            this.input.drawItem(this.item, this.progress);
        } else {
            this.output.drawItem(this.item, this.progress);
        }

        pop();
    }

    /**
     * @param {Position} position
     */
    drawInfo(position) {
        if (this.isGhost) {
            this.originPosition = position;
            this.configureOutput();
            this.configureInput();
        }

        this.output.drawInfo(this.isGhost);
        this.input.drawInfo(this.isGhost);
    }

    /**
     * @param {UndergroundBelt[]} belts
     */
    work(belts) {
        if (this.reset) {
            this.reset = false;
            this.item = null;
            this.progress = 0;
        }

        if (this.item === null) {
            this.progress = 0;
            return;
        }

        if (this.progress === 60) {
            let nextBelt = belts[this.index + 1];

            if (nextBelt === undefined) {
                let nextPosition = this.output.cell.nextPosition(this.output.direction);
                let object = game.state.objectMap.getCell(nextPosition)

                if (!object.isEmpty() && object.acceptItem(this.direction, this.item)) {
                    this.reset = true;
                }

                return;
            }

            if (nextBelt.acceptItem(this.direction, this.item)) {
                this.reset = true;
            }

            return;
        }

        this.progress += 1;
    }

    /**
     * @param {Direction} direction
     * @param {Item} item
     * @returns {boolean}
     */
    acceptsItem(direction, item = null) {
        return direction.opposite().equals(this.input.direction);
    }

    /**
     * @param {Direction} direction
     * @returns {boolean}
     */
    isAcceptingItems(direction) {
        if (!direction.opposite().equals(this.input.direction)) {
            return false;
        }

        return this.item === null;
    }

    /**
     * @param {Direction} direction
     * @param {Item} item
     * @returns {boolean}
     */
    acceptItem(direction, item) {
        if (!direction.opposite().equals(this.input.direction)) {
            return false;
        }

        if (this.item !== null) {
            return false;
        }

        this.item = item;

        return true;
    }

    providesItem(direction) {
        return direction.opposite().equals(this.output.direction);
    }

    isProvidingItem(direction) {
        return this.item !== null && this.progress === 60;
    }

    provideItem(direction) {
        if (this.item === null) {
            return null;
        }

        if (this.progress !== 60) {
            return null;
        }

        let item = this.item;
        this.item = null;
        this.progress = 0;

        return item;
    }
}
