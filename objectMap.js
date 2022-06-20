class ObjectMap {
    constructor() {
        /** @type {Cell[][]} */
        this.cells = [];
        /** @type {Cell[]} */
        this.extractors = [];
        /** @type {Cell[]} */
        this.belts = [];
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

    processCells() {
        this.processExtractors();
        this.processBelts();
    }

    processExtractors() {
        this.extractors
            .slice()
            .reverse()
            .forEach(function (cell, index, list) {
                if (cell.isEmpty()) {
                    list.splice(list.length - 1 - index, 1);
                    return;
                }

                cell.work();
                cell.draw();
            });
    }

    processBelts() {
        this.belts
            .slice()
            .reverse()
            .forEach(function (cell, index, list) {
                if (cell.isEmpty()) {
                    list.splice(list.length - 1 - index, 1);
                    return;
                }

                cell.work();
                cell.draw();
            });
    }
}
