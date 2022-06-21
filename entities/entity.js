class Entity {
    /**
     * @param {Direction} direction
     * @param {boolean} isGhost
     */
    constructor(direction = Direction.Up, isGhost = false) {
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
     * @param {Cell} cell
     */
    work(cell) {

    }

    /**
     * @param {Direction} direction
     * @param {*} item
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
     * @param {*} item
     * @return {boolean}
     */
    acceptItem(direction, item) {
        return false
    }
}
