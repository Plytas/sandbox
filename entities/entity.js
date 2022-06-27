class Entity {
    /**
     * @param {p5.Vector} originCell
     * @param {Direction} direction
     * @param {boolean} isGhost
     */
    constructor(originCell, direction = Direction.Up, isGhost = false) {
        this.originCell = originCell;
        this.size = new p5.Vector(1, 1);
        this.direction = direction;
        this.isGhost = isGhost;
    }

    /**
     * @param {boolean} clockwise
     */
    rotate(clockwise = true) {
        this.direction = clockwise ? this.direction.clockwise() : this.direction.counterclockwise();
    }

    /**
     * @param {p5.Vector} cell
     */
    draw(cell) {

    }

    /**
     * @param {p5.Vector} cell
     */
    drawItem(cell) {

    }

    /**
     * @param {Cell} cell
     */
    work(cell) {

    }

    /**
     * @param {Direction} direction
     * @param {Item} item
     * @returns {boolean}
     */
    acceptsItem(direction, item) {
        return false
    }

    /**
     * @param {Direction} direction
     * @return {boolean}
     */
    isAcceptingItems(direction) {
        return false
    }

    /**
     * @param {Direction} direction
     * @param {Item} item
     * @return {boolean}
     */
    acceptItem(direction, item) {
        return false
    }
}
