import { config } from "../config.js";
import Position from "../common/position.js";

export default class Item {
    constructor() {
        this.width = config.gridSize * 0.4;
        this.height = config.gridSize * 0.4;
    }

    /**
     * @param {Position} position
     */
    draw(position) {
        fill(53, 77, 117);
        rectMode(CENTER);
        rect(position.x, position.y, this.width, this.height);
    }
}
