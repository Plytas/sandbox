import Cell from "../common/cell.js";
import Direction from "../common/direction.js";
import Output from "../common/output.js";
import {config} from "../config.js";
import Item from "../items/item.js";
import Entity from "./entity.js";
import {game} from "../game.js";

export default class Extractor extends Entity {
    /**
     * @param {p5.Vector} originPosition
     * @param {Direction} direction
     * @param {boolean} isGhost
     */
    constructor(originPosition, direction = Direction.Up, isGhost = false) {
        super(originPosition, direction, isGhost);
        this.size = new p5.Vector(2, 2);
        this.speed = 0.5;
        this.craftingTime = 120;
        this.count = 0;
        this.steps = 0;
        this.item = new Item();

        this.configureOutput(originPosition, direction);
    }

    /**
     * @param {p5.Vector} originPosition
     * @param {Direction} direction
     */
    configureOutput(originPosition, direction) {
        this.output = new Output(this.outputPosition(originPosition, direction), direction);
    }

    /**
     * @param {p5.Vector} originPosition
     * @param {Direction} direction
     * @returns {p5.Vector}
     */
    outputPosition(originPosition, direction) {
        switch (direction.value) {
            case Direction.Up.value:
                return new p5.Vector(originPosition.x, originPosition.y);
            case Direction.Right.value:
                return new p5.Vector(originPosition.x + 1, originPosition.y);
            case Direction.Down.value:
                return new p5.Vector(originPosition.x + 1, originPosition.y + 1);
            case Direction.Left.value:
                return new p5.Vector(originPosition.x, originPosition.y + 1);
        }
    }

    /**
     * @param {boolean} clockwise
     */
    rotate(clockwise = true) {
        super.rotate(clockwise);

        this.output.cell = new Cell(this.outputPosition(this.originPosition, this.direction));
        this.output.direction = this.direction;
    }

    /**
     * @param {Cell} cell
     */
    work(cell) {
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
     * @param {p5.Vector} position
     */
    draw(position) {

        if (this.isGhost) {
            fill(40, 40, 40, 40);

            this.drawInfo(position)
        } else {
            fill(0);
        }

        rect(position.x * config.gridSize + 2, position.y * config.gridSize + 2, (this.size.x * config.gridSize) - 4, (this.size.y * config.gridSize) - 4);
        fill(255);
        rect(position.x * config.gridSize + 2, position.y * config.gridSize + 2, ((this.size.x * config.gridSize - 4) * this.steps) / this.craftingTime, 2);
    }

    /**
     * @param {p5.Vector} position
     */
    drawItem(position) {
        if (this.isGhost || this.item === null) {
            return;
        }

        push();

        translate(this.output.cell.x * config.gridSize + config.gridSize / 2, this.output.cell.y * config.gridSize + config.gridSize / 2);
        rotate(this.output.direction.rotation());
        translate(0, config.gridSize / 2 - (config.gridSize * this.steps / this.craftingTime) + this.item.height / 2)
        rotate(-this.output.direction.rotation());
        this.item.draw(new p5.Vector(0, 0));

        pop();
    }

    /**
     * @param {p5.Vector} position
     */
    drawInfo(position) {
        if (this.isGhost) {
            this.output.cell = new Cell(this.outputPosition(position, this.direction));
            this.output.direction = this.direction;
        }

        this.output.drawInfo(this.isGhost);
    }
}
