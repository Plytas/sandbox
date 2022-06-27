class Output {
    /**
     * @param {p5.Vector} cell
     * @param {Direction} direction
     */
    constructor(cell, direction) {
        this.cell = new Cell(cell);
        this.direction = direction;
    }
}
