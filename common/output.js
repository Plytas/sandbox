import {config} from "../config.js";
import Cell from "./cell.js";
import Item from "../items/item.js";
import Direction from "./direction.js";
import Position from "./position.js";

export default class Output {
    /**
     * @param {Position} position
     * @param {Direction} direction
     */
    constructor(position, direction) {
        this.cell = new Cell(position);
        this.direction = direction;
    }

    draw() {
        push();

        //base
        rotate(this.direction.rotation());
        translate(-config.gridSize / 2 + 10, -config.gridSize / 2);
        rect(0, 0, config.gridSize - 20, config.gridSize / 2);

        //arrow
        push()
        fill(config.colors.output);
        translate(+config.gridSize / 2 - 10, 10)
        triangle((-config.gridSize / 8), 0, 0, (-config.gridSize / 8), (config.gridSize / 8), 0);
        pop()

        pop();
    }

    /**
     * @param {Item} item
     * @param {number} progress
     */
    drawItem(item, progress) {
        push();

        rotate(this.direction.rotation());
        translate(0, (config.gridSize / 2 - (config.gridSize * progress / 60)) + item.width / 2);

        item.draw(new Position(0, 0));

        pop();
    }

    /**
     * @param {boolean} isGhost
     */
    drawInfo(isGhost = false) {
        push();

        if (isGhost) {
            fill([...config.colors.output, 90]);
        } else {
            fill(config.colors.output);
        }

        translate(this.cell.position.x * config.gridSize + config.gridSize / 2, this.cell.position.y * config.gridSize + config.gridSize / 2);
        rotate(this.direction.rotation());
        translate(0, -config.gridSize / 2);
        rectMode(CENTER);

        triangle(
            -config.gridSize / 4, 0,
            config.gridSize / 4, 0,
            0, -config.gridSize / 4
        )

        pop();
    }
}
