import Cell from "../common/cell.js";
import Direction from "../common/direction.js";
import Output from "../common/output.js";
import { config } from "../config.js";
import Item from "../items/item.js";
import { dump } from "../sketch.js";
import Entity from "./entity.js";

export default class Extractor extends Entity {
    /**
     * @param {p5.Vector} originCell
     * @param {Direction} direction
     * @param {boolean} isGhost
     */
    constructor(originCell, direction = Direction.Up, isGhost = false) {
        super(originCell, direction, isGhost);
        this.size = new p5.Vector(2, 2);
        this.speed = 0.5;
        this.craftingTime = 120;
        this.count = 0;
        this.steps = 0;
        this.item = new Item();

        this.configureOutput(originCell, direction);
    }

    /**
     * @param {p5.Vector} originCell
     * @param {Direction} direction
     */
    configureOutput(originCell, direction) {
        dump(originCell);
        dump(direction);

        this.output = new Output(this.outputCell(originCell, direction), direction);

        dump(this.output);
    }

    /**
     * @param {p5.Vector} originCell 
     * @param {Direction} direction 
     * @returns {p5.Vector}
     */
    outputCell(originCell, direction) {
        switch (direction.value) {
            case Direction.Up.value:
                return new p5.Vector(originCell.x, originCell.y);
            case Direction.Right.value:
                return new p5.Vector(originCell.x + 1, originCell.y);
            case Direction.Down.value:
                return new p5.Vector(originCell.x + 1, originCell.y + 1);
            case Direction.Left.value:
                return new p5.Vector(originCell.x, originCell.y + 1);
        }
    }

    /**
     * @param {boolean} clockwise
     */
    rotate(clockwise = true) {
        super.rotate(clockwise);

        this.output.cell = new Cell(this.outputCell(this.originCell, this.direction));
        this.output.direction = this.direction;
    }

    /**
     * @param {Cell} cell
     */
    work(cell) {
        if (this.steps >= this.craftingTime) {
            let nextCell = this.output.cell.nextCell(this.output.direction);
            let object = config.objectMap.getCell(nextCell);

            if (object !== null && object.acceptItem(this.direction, this.item)) {
                this.steps = 0;
                this.item = new Item();
            }

            return;
        }

        this.steps += this.speed;
    }

    /**
     * @param {p5.Vector} cell
     */
    draw(cell) {

        if (this.isGhost) {
            fill(40, 40, 40, 40);

            this.drawInfo(cell)
        } else {
            fill(0);
        }

        rect(cell.x * config.gridSize + 2, cell.y * config.gridSize + 2, (this.size.x * config.gridSize) - 4, (this.size.y * config.gridSize) - 4);
        fill(255);
        rect(cell.x * config.gridSize + 2, cell.y * config.gridSize + 2, ((this.size.x * config.gridSize - 4) * this.steps) / this.craftingTime, 2);
    }

    /**
     * @param {p5.Vector} cell
     */
    drawItem(cell) {
        if (this.isGhost || this.item === null) {
            return;
        }

        push();
        cell = this.output.cell

        translate(cell.x * config.gridSize + config.gridSize / 2, cell.y * config.gridSize + config.gridSize / 2);
        rotate(this.output.direction.rotation());
        translate(0, config.gridSize / 2 - (config.gridSize * this.steps / this.craftingTime) + this.item.height / 2)
        rotate(-this.output.direction.rotation());
        this.item.draw(new p5.Vector(0, 0));

        pop();
    }

    /**
     * @param {p5.Vector} cell 
     */
    drawInfo(cell) {
        if (this.isGhost) {
            this.output.cell = new Cell(this.outputCell(cell, this.direction));
            this.output.direction = this.direction;
        }

        this.output.drawInfo(this.isGhost);
    }
}
