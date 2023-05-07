import Direction from "../common/direction.js";
import {config} from "../config.js";
import Entity from "./entity.js";
import {game} from "../game.js";
import Item from "../items/item.js";
import Output from "../common/output.js";
import Input from "../common/input.js";

export default class Splitter extends Entity {
    /**
     * @param {p5.Vector} originPosition
     * @param {Direction} direction
     * @param {boolean} isGhost
     */
    constructor(originPosition, direction = Direction.Up, isGhost = false) {
        super(originPosition, direction, isGhost);
        /** @type {Item|null} */
        this.item = null;
        this.progress = 0;
        this.reset = false;

        this.configureInput();
        this.configureOutputs();
    }

    configureInput() {
        this.input = new Input(this.originPosition, this.direction.relativeToDirection(Direction.Down));
    }

    configureOutputs() {
        this.outputs = [
            new Output(this.originPosition, this.direction),
            new Output(this.originPosition, this.direction.relativeToDirection(Direction.Right)),
            new Output(this.originPosition, this.direction.relativeToDirection(Direction.Left)),
        ];
        this.currentOutputIndex = 0;
    }

    /**
     * @param {boolean} clockwise
     */
    rotate(clockwise = true) {
        super.rotate(clockwise);

        this.configureInput();
        this.configureOutputs();
    }

    /**
     * @param {p5.Vector} position
     */
    draw(position) {
        push();

        if (this.isGhost) {
            fill(40, 40, 40);

            this.originPosition = position;
            this.configureOutputs();
            this.configureInput();
        } else {
            fill(0);
        }

        //middle
        translate(position.x * config.gridSize + config.gridSize / 2, position.y * config.gridSize + config.gridSize / 2);

        this.input.draw();
        this.outputs.forEach(/** Output */ output => output.draw())

        pop();
    }

    /**
     * @param {p5.Vector} position
     */
    drawItem(position) {
        if (this.isGhost || this.item === null) {
            return;
        }

        push();
        translate(position.x * config.gridSize + config.gridSize / 2, position.y * config.gridSize + config.gridSize / 2);

        if (this.progress < 30 + (this.item.width / 2) / (config.gridSize / 60)) {
            this.input.drawItem(this.item, this.progress);
        } else {
            this.outputs[this.currentOutputIndex].drawItem(this.item, this.progress);
        }

        pop();
    }

    /**
     * @param {p5.Vector} position
     */
    drawInfo(position) {
        if (this.isGhost) {
            this.originPosition = position;
            this.configureOutputs();
            this.configureInput();
        }

        this.outputs.forEach(/** Output */ output => output.drawInfo(this.isGhost));

        this.input.drawInfo(this.isGhost);
    }

    work() {
        if (this.reset) {
            this.reset = false;
            this.item = null;
            this.currentOutputIndex = (this.currentOutputIndex + 1) % this.outputs.length;
            this.progress = 0;
        }

        if (this.item === null) {
            this.progress = 0;
            return;
        }

        if (this.progress === 60) {
            let output = this.outputs[this.currentOutputIndex];
            let object = game.state.objectMap.getCell(output.cell.nextPosition(output.direction));

            if (!object.isEmpty() && object.acceptItem(output.direction, this.item)) {
                this.reset = true;
            }

            return;
        }

        this.detectOutput();

        this.progress += 1;
    }

    detectOutput() {
        for (let i = 0; i < 3; i++) {
            let output = this.outputs[this.currentOutputIndex];
            let object = game.state.objectMap.getCell(output.cell.nextPosition(output.direction));

            if (object.isEmpty()) {
                this.currentOutputIndex = (this.currentOutputIndex + 1) % this.outputs.length;
                continue;
            }

            if (!object.hasInput(output.direction)) {
                this.currentOutputIndex = (this.currentOutputIndex + 1) % this.outputs.length;
                continue;
            }

            return;
        }

        this.currentOutputIndex = 0;
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

    /**
     * @param {Direction} direction
     * @returns {boolean}
     */
    providesItem(direction) {
        return !direction.opposite().equals(this.input.direction);
    }

    /**
     * @param {Direction} direction
     * @returns {boolean}
     */
    isProvidingItem(direction) {
        return this.item !== null && this.progress === 60;
    }

    /**
     * @param {Direction} direction
     * @returns {Item|null}
     */
    provideItem(direction) {
        if (this.item === null) {
            return null;
        }

        if (this.progress !== 60) {
            return null;
        }

        if (!this.outputs[this.currentOutputIndex].direction.opposite().equals(direction)) {
            return null;
        }

        let item = this.item;
        this.item = null;
        this.progress = 0;
        this.currentOutputIndex = (this.currentOutputIndex + 1) % this.outputs.length;

        return item;
    }
}
