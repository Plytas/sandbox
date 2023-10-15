import Direction from "../common/direction.js";
import {config} from "../config.js";
import Entity from "./entity.js";
import Input from "../common/input.js";
import Item from "../items/item.js";
import Position from "../common/position.js";

export default class Sink extends Entity {
    /**
     * @param {Position} originPosition
     * @param {Direction} direction
     * @param {boolean} isGhost
     */
    constructor(originPosition, direction = Direction.Up, isGhost = false) {
        super(originPosition, direction, isGhost);
        /** @type {Item|null} */
        this.item = null;
        this.progress = 0;
        this.reset = false;
        this.count = 0;

        this.configureInput();
    }

    configureInput() {
        this.input = new Input(this.originPosition, this.direction.opposite());
    }

    /**
     * @param {boolean} clockwise
     */
    rotate(clockwise = true) {
        super.rotate(clockwise);

        this.configureInput();
    }

    /**
     * @param {Position} position
     */
    draw(position) {
        push();

        if (this.isGhost) {
            fill(40, 40, 40);

            this.originPosition = position;
            this.configureInput();
        } else {
            fill(0);
        }

        //middle
        translate(position.x * config.gridSize + config.gridSize / 2, position.y * config.gridSize + config.gridSize / 2);
        circle(0, 0, config.gridSize / 2 + 15)

        this.input.draw();

        pop();
    }

    /**
     * @param {Position} position
     */
    drawItem(position) {
        if (this.isGhost || this.item === null) {
            return;
        }

        push();
        translate(position.x * config.gridSize + config.gridSize / 2, position.y * config.gridSize + config.gridSize / 2);

        this.input.drawItem(this.item, this.progress);

        pop();
    }

    /**
     * @param {Position} position
     */
    drawInfo(position) {
        if (this.isGhost) {
            this.originPosition = position;
            this.configureInput();
        }

        this.input.drawInfo(this.isGhost);
    }

    drawDetails(position) {
        push();

        translate(position.x * config.gridSize + config.gridSize / 2, position.y * config.gridSize + config.gridSize / 2);
        textAlign(CENTER, CENTER);
        textSize(16);
        fill(245);
        text(this.count, 0, 0);
        pop();
    }

    work() {
        if (this.reset) {
            this.reset = false;
            this.item = null;
            this.progress = 0;
            this.count++;
        }

        if (this.item === null) {
            this.progress = 0;
            return;
        }

        if (this.progress === 60) {
            this.reset = true;

            return;
        }

        this.progress += 2;
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
}
