class ObjectMap {
    constructor() {
        /** @type {Cell[][]} */
        this.cells = [];
    }

    /**
     * @param {p5.Vector} cell
     * @returns boolean
     */
    cellIsEmpty(cell) {
        return this.cells[cell.x] === undefined ||
            this.cells[cell.x][cell.y] === undefined ||
            this.cells[cell.x][cell.y].isEmpty()
    }

    /**
     * @param {Cell} cell
     */
    setCell(cell) {
        if (this.cells[cell.x] === undefined) {
            this.cells[cell.x] = [];
        }

        this.cells[cell.x][cell.y] = cell;
    }

    /**
     * @param {p5.Vector} cell
     * @returns {null|Cell}
     */
    getCell(cell) {
        if (this.cells[cell.x] === undefined
            || this.cells[cell.x][cell.y] === undefined) {
            return null;
        }

        return this.cells[cell.x][cell.y];
    }

    /**
     * @param {p5.Vector} cell
     * @param {boolean} clockwise
     */
    rotateObjectInCell(cell, clockwise = true) {
        if (this.cells[cell.x] === undefined
        || this.cells[cell.x][cell.y] === undefined
        || this.cells[cell.x][cell.y].isEmpty()) {
            return;
        }

        this.cells[cell.x][cell.y].rotate(clockwise);
    }

    /**
     * @param {p5.Vector} cell
     */
    deleteObjectInCell(cell) {
        if (this.cells[cell.x] === undefined
            || this.cells[cell.x][cell.y] === undefined
            || this.cells[cell.x][cell.y].isEmpty()) {
            return;
        }

        this.cells[cell.x][cell.y].destroy();
    }
}
