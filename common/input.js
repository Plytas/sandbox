import Direction from "./direction.js";

export default class Input {
    /**
     * @param {p5.Vector} cell
     * @param {Direction} direction
     */
    constructor(cell, direction) {
        this.cell = cell;
        this.direction = direction;
    }
}
