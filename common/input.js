import Cell from "./cell.js";
import Direction from "./direction.js";
import {config} from "../config.js";

export default class Input {
    /**
     * @param {p5.Vector} position
     * @param {Direction} direction
     */
    constructor(position, direction) {
        this.cell = new Cell(position);
        this.direction = direction;
    }

    /**
     * @param {boolean} isGhost
     */
    drawInfo(isGhost = false) {
        push();

        if (isGhost) {
            fill(40, 40, 40, 40);
        } else {
            fill(255, 225, 25);
        }

        translate(this.cell.x * config.gridSize + config.gridSize / 2, this.cell.y * config.gridSize + config.gridSize / 2);
        rotate(this.direction.rotation());
        translate(0, -config.gridSize / 2);
        rectMode(CENTER);

        triangle(
            -config.gridSize / 4, 0,
            config.gridSize / 4, 0,
            0, config.gridSize / 4
        )

        pop();
    }
}
