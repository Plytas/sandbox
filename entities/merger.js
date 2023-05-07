import Direction from "../common/direction.js";
import {config} from "../config.js";
import Entity from "./entity.js";
import {game} from "../game.js";
import Item from "../items/item.js";
import Output from "../common/output.js";
import Input from "../common/input.js";
import Position from "../common/position.js";

export default class Merger extends Entity {
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

        this.configureInputs();
        this.configureOutput();
    }

    configureInputs() {
        this.inputs = [
            new Input(this.originPosition, this.direction.relativeToDirection(Direction.Down)),
            new Input(this.originPosition, this.direction.relativeToDirection(Direction.Left).opposite()),
            new Input(this.originPosition, this.direction.relativeToDirection(Direction.Right).opposite()),
        ];
        this.currentInputIndex = 0;
    }


    configureOutput() {
        this.output = new Output(this.originPosition, this.direction);
    }

    /**
     * @param {boolean} clockwise
     */
    rotate(clockwise = true) {
        super.rotate(clockwise);

        this.configureInputs();
        this.configureOutput();
    }

    /**
     * @param {Position} position
     */
    draw(position) {
        push();

        if (this.isGhost) {
            fill(40, 40, 40);

            this.originPosition = position;
            this.configureOutput();
            this.configureInputs();
        } else {
            fill(0);
        }

        //middle
        translate(position.x * config.gridSize + config.gridSize / 2, position.y * config.gridSize + config.gridSize / 2);

        this.inputs.forEach(/** Input */ input => input.draw());
        this.output.draw();

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

        if (this.progress < 30 + (this.item.width / 2) / (config.gridSize / 60)) {
            this.inputs[this.currentInputIndex].drawItem(this.item, this.progress);
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
            this.configureInputs();
        }

        this.output.drawInfo(this.isGhost);

        this.inputs.forEach(/** Input */ input => input.drawInfo(this.isGhost));
    }

    work() {
        if (this.reset) {
            this.reset = false;
            this.item = null;
            this.progress = 0;
        }

        if (this.item === null) {
            for (let i = 0; i < 2; i++) {
                this.currentInputIndex = (this.currentInputIndex + 1) % this.inputs.length;

                let input = this.inputs[this.currentInputIndex];
                let object = game.state.objectMap.getCell(input.cell.nextPosition(input.direction));

                if (!object.isEmpty()) {
                    this.item = object.provideItem(input.direction);

                    if (this.item === null) {
                        this.progress = 0;
                        continue;
                    }

                    return;
                }
            }

            this.progress = 0;
            return;
        }

        if (this.progress === 60) {
            let nextPosition = this.output.cell.nextPosition(this.output.direction)
            let object = game.state.objectMap.getCell(nextPosition)

            if (!object.isEmpty() && object.acceptItem(this.direction, this.item)) {
                this.reset = true;
            }

            return;
        }

        this.progress += 1;
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
