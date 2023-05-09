import Direction from "../common/direction.js";
import Output from "../common/output.js";
import {config} from "../config.js";
import Item from "../items/item.js";
import Entity from "./entity.js";
import {game} from "../game.js";
import Position from "../common/position.js";
import Size from "../common/size.js";

export default class Extractor extends Entity {
    /**
     * @param {Position} originPosition
     * @param {Direction} direction
     * @param {boolean} isGhost
     */
    constructor(originPosition, direction = Direction.Up, isGhost = false) {
        super(originPosition, direction, isGhost);
        this.size = new Size(2, 2);
        this.speed = 0.5;
        this.craftingTime = 120;
        this.count = 0;
        this.steps = 0;
        this.item = new Item();

        this.configureOutput();
    }

    configureOutput() {
        this.output = new Output(this.outputPosition(), this.direction);
    }

    /**
     * @returns {Position}
     */
    outputPosition() {
        switch (this.direction.value) {
            case Direction.Up.value:
                return this.originPosition.relativePosition(0, 0);
            case Direction.Right.value:
                return this.originPosition.relativePosition(1, 0);
            case Direction.Down.value:
                return this.originPosition.relativePosition(1, 1);
            case Direction.Left.value:
                return this.originPosition.relativePosition(0, 1);
        }
    }

    /**
     * @param {boolean} clockwise
     */
    rotate(clockwise = true) {
        super.rotate(clockwise);

        this.configureOutput();
    }

    work() {
        if (this.steps >= this.craftingTime) {
            let nextPosition = this.output.cell.nextPosition(this.output.direction);
            let object = game.state.objectMap.getCell(nextPosition);

            if (object !== null && object.acceptItem(this.direction, this.item)) {
                this.steps = 0;
                this.item = new Item();
            }

            return;
        }

        this.steps += this.speed;
    }

    /**
     * @param {Position} position
     */
    draw(position) {

        if (this.isGhost) {
            fill(40, 40, 40, 40);
        } else {
            fill(0);
        }

        rect(position.x * config.gridSize + 2, position.y * config.gridSize + 2, (this.size.x * config.gridSize) - 4, (this.size.y * config.gridSize) - 4);
        fill(255);
        rect(position.x * config.gridSize + 2, position.y * config.gridSize + 2, ((this.size.x * config.gridSize - 4) * this.steps) / this.craftingTime, 2);
    }

    /**
     * @param {Position} position
     */
    drawItem(position) {
        if (this.isGhost || this.item === null) {
            return;
        }

        push();

        translate(this.output.cell.position.x * config.gridSize + config.gridSize / 2, this.output.cell.position.y * config.gridSize + config.gridSize / 2);
        rotate(this.output.direction.rotation());
        translate(0, config.gridSize / 2 - (config.gridSize * this.steps / this.craftingTime) + this.item.height / 2)
        rotate(-this.output.direction.rotation());
        this.item.draw(new Position(0, 0));

        pop();
    }

    /**
     * @param {Position} position
     */
    drawInfo(position) {
        if (this.isGhost) {
            this.originPosition = position;
            this.configureOutput();
        }

        this.output.drawInfo(this.isGhost);
    }

    /**
     * @param {Direction} direction
     * @returns {boolean}
     */
    providesItem(direction) {
        return direction.opposite().equals(this.output.direction);
    }

    /**
     * @param {Direction} direction
     * @returns {boolean}
     */
    isProvidingItem(direction) {
        return this.item !== null && this.steps >= this.craftingTime;
    }

    /**
     * @param {Direction} direction
     * @returns {Item|null}
     */
    provideItem(direction) {
        if (this.item === null) {
            return null;
        }

        if (this.steps < this.craftingTime) {
            return null;
        }

        let item = this.item;
        this.steps = 0;
        this.item = new Item();

        return item;
    }
}
