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
        if (this.isEmpty()) {
            return;
        }

        this.entity.draw(new p5.Vector(this.x, this.y));
    }

    work() {
        if (this.isEmpty()) {
            return;
        }

        this.entity.work(this);
    }

    /**
     * @param {boolean} clockwise
     */
    rotate(clockwise = true) {
        if (this.isEmpty()) {
            return;
        }

        this.entity.rotate(clockwise);
    }

    /**
     * @param {number} direction
     * @param {null} item
     * @returns {boolean}
     */
    acceptsItem(direction, item = null) {
        if (this.isEmpty()) {
            return false;
        }

        return this.entity.acceptsItem(direction, item);
    }

    /**
     * @param {number|null} direction
     * @return {boolean}
     */
    isAcceptingItems(direction) {
        if (this.isEmpty()) {
            return false;
        }

        return this.entity.isAcceptingItems(direction);
    }

    /**
     *
     * @param direction
     * @param item
     * @return {boolean}
     */
    acceptItem(direction, item) {
        if (this.isEmpty()) {
            return false;
        }

        if (!this.acceptsItem(direction, item)) {
            return false
        }

        if (!this.isAcceptingItems(direction)) {
            return false;
        }

        return this.entity.acceptItem(direction, item);
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
