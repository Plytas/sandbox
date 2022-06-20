class Cell {
    /**
     * @param {Cell} cell
     * @param {Entity|null} entity
     */
    constructor(cell, entity = null) {
        this.x = cell.x;
        this.y = cell.y;
        /** @type {Entity|null} */
        this.entity = entity;
    }

    /**
     * @param {Cell|null} cell
     * @returns {p5.Vector}
     */
    position(cell = null) {
        if (cell === null) {
            return new p5.Vector(this.x, this.y);
        }

        this.x = cell.x;
        this.y = cell.y;
    }

    /**
     * @returns {boolean}
     */
    isEmpty() {
        return this.entity === null;
    }

    destroy() {
        this.entity = null;
    }

    draw() {
        if (!this.isEmpty()) {
            this.entity.draw(new p5.Vector(this.x, this.y));
        }
    }

    work() {
        if (!this.isEmpty()) {
            this.entity.work();
        }
    }

    /**
     * @param {boolean} clockwise
     */
    rotate(clockwise = true) {
        if (!this.isEmpty()) {
            this.entity.rotate(clockwise);
        }
    }

    /**
     * @param {number|null} direction
     * @returns {p5.Vector|null}
     */
    nextCell(direction = null) {
        if (direction === null) {
            if (this.isEmpty()) {
                return null
            }

            direction = this.entity.direction;
        }

        switch (direction) {
            case Direction.Up:
                return new p5.Vector(this.x, this.y - 1);
            case Direction.Down:
                return new p5.Vector(this.x, this.y + 1);
            case Direction.Left:
                return new p5.Vector(this.x - 1, this.y);
            case Direction.Right:
                return new p5.Vector(this.x + 1, this.y);
            default:
                return null;
        }
    }
}
