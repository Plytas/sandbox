import Entity from "./entity.js";
import Direction from "../common/direction.js";
import {config} from "../config.js";
import {game} from "../game.js";
import Output from "../common/output.js";
import Input from "../common/input.js";
import Position from "../common/position.js";
import Belt from "./belt.js";
import UndergroundBelt from "./undergroundBelt.js";

export default class UndergroundBeltEntrance extends Entity {
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
        this.side = 'input';
        /** @type {UndergroundBelt[]} */
        this.belts = [];

        this.configureInput();
        this.configureOutput();
    }

    configureInput() {
        this.input = new Input(this.originPosition, this.direction.opposite());
    }

    configureOutput() {
        this.output = new Output(this.originPosition, this.direction);
    }

    configureUndergroundBelts() {
        let outputPosition = this.getOutputPosition();

        if (this.side === 'input') {
            let newLength = this.originPosition.distanceToPosition(outputPosition) - 1;

            if (newLength !== this.belts.length) {
                if (newLength < this.belts.length) {
                    this.belts.splice(newLength, this.belts.length - newLength);
                } else {
                    for (let i = this.belts.length; i < newLength; i++) {
                        this.belts.push(new UndergroundBelt(this.originPosition.nextPositionInDirection(this.direction, i + 1), this.direction, true, i));
                    }
                }
            }
        }
    }

    /**
     * @returns {Position}
     */
    getOutputPosition() {
        /** @type {Position|null|undefined} */
        let outputPosition = game.engine.iterateOverPositionsInDirection(this.originPosition, this.direction, (position) => {
            let object = game.state.objectMap.getCell(position);

            if (object === null || object.isEmpty() || !(object.entity instanceof UndergroundBeltEntrance)) {
                return;
            }

            let entity = object.entity;

            if (entity.side === 'input' && entity.direction.equals(this.direction)) {
                return null;
            }

            if (entity.side === 'output' && entity.direction.equals(this.direction)) {
                return entity.originPosition;
            }
        }, 5);

        if (outputPosition === undefined || outputPosition === null) {
            return this.originPosition;
        }

        return outputPosition;
    }

    /**
     * @param {boolean} clockwise
     */
    rotate(clockwise = true) {
        if (this.isGhost) {
            super.rotate(clockwise);
        } else {
            this.switchSide();
        }

        this.configureInput();
        this.configureOutput();
    }

    switchSide() {
        if (this.side === 'input') {
            this.side = 'output';
        } else {
            this.side = 'input';
        }
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
            this.configureInput();
        } else {
            fill(0);
        }

        //middle
        translate(position.x * config.gridSize + config.gridSize / 2, position.y * config.gridSize + config.gridSize / 2);
        circle(0, 0, config.gridSize / 2 + 5)

        this.input.draw();
        this.output.draw();

        push();
        fill(245);
        text(this.side, 0, 0);
        pop();

        pop();
    }

    /**
     * @param {Position} position
     */
    drawItem(position) {
        if (this.isGhost) {
            return;
        }

        drawingContext.save();
        this.drawClip(position);
        drawingContext.clip();

        push();
        translate(position.x * config.gridSize + config.gridSize / 2, position.y * config.gridSize + config.gridSize / 2);

        if (this.item !== null) {
            this.input.drawItem(this.item, this.progress);
        }

        pop();

        this.belts.forEach((belt) => {
            belt.drawItem(belt.originPosition);
        });

        drawingContext.restore();
    }

    /**
     * @param {Position} position
     */
    drawClip(position) {
        push();
        rectMode(CENTER);
        fill(0, 1);
        translate(position.x * config.gridSize + config.gridSize / 2, position.y * config.gridSize + config.gridSize / 2);
        rotate(this.direction.rotation());
        translate(0, this.side === 'input' ? +config.gridSize / 2 : -config.gridSize / 2);
        rect(0, 0, config.gridSize, config.gridSize * 2);
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

        this.belts.forEach((belt) => {
            belt.drawInfo(belt.originPosition);
        });
    }

    work() {
        if (this.reset) {
            this.reset = false;
            this.item = null;
            this.progress = 0;
        }

        this.belts.forEach((belt, index, belts) => {
            belt.work(belts);
        });

        if (this.item === null) {
            this.progress = 0;
            return;
        }

        if (this.side === 'input') {
            this.workInput()
        } else {
            this.workOutput();
        }
    }

    workInput() {
        this.configureUndergroundBelts();

        if (this.progress === 60) {
            if (this.belts.length !== 0 && this.belts[0].acceptItem(this.direction, this.item)) {
                this.reset = true;
            }

            return;
        }

        this.progress += 1;
    }

    workOutput() {
        if (this.progress === 60) {
            let nextPosition = this.output.cell.nextPosition(this.output.direction);
            let object = game.state.objectMap.getCell(nextPosition)

            if (!object.isEmpty() && object.acceptItem(this.direction, this.item)) {
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
