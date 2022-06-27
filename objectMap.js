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
        if (this.cellIsEmpty(cell)) {
            return null;
        }

        return this.cells[cell.x][cell.y];
    }

    /**
     * @param {p5.Vector} cell
     * @param {boolean} clockwise
     */
    rotateObjectInCell(cell, clockwise = true) {
        if (this.cellIsEmpty(cell)) {
            return;
        }

        this.cells[cell.x][cell.y].rotate(clockwise);
    }

    /**
     * @param {p5.Vector} cell
     */
    deleteObjectInCell(cell) {
        if (this.cellIsEmpty(cell)) {
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
            .forEach((cell, index, list) => {
                if (cell.isEmpty()) {
                    this.extractors.splice(list.length - 1 - index, 1);
                    return;
                }

                cell.draw();
            });

        this.extractors
            .slice()
            .reverse()
            .forEach((cell) => {
                cell.drawItem();
            });

        this.extractors
            .slice()
            .reverse()
            .forEach((cell) => {
                cell.work();
            });
    }

    processBelts() {
        if (beltAnimationProgress > 60) {
            beltAnimationProgress = 0;
        }

        this.belts
            .slice()
            .reverse()
            .forEach((cell, index, list) => {
                if (cell.isEmpty()) {
                    this.belts.splice(list.length - 1 - index, 1);
                    return;
                }

                cell.draw();
            });

        this.belts
            .slice()
            .reverse()
            .forEach(cell => {
                cell.drawItem();
            });

        this.belts
            .slice()
            .reverse()
            .forEach(cell => {
                cell.work();
            });

        beltAnimationProgress += 1;
    }
}
