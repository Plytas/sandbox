class Entity {
    /**
     * @param {number} direction
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
        this.direction += 2 * Math.PI + (clockwise ? Math.PI / 2 : -Math.PI / 2);

        while (this.direction >= 2 * Math.PI) {
            this.direction -= 2 * Math.PI;
        }
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
     * @param {number} direction
     * @param {*} item
     * @returns {boolean}
     */
    acceptsItem(direction, item) {
        return false
    }

    /**
     * @param {number} direction
     * @return {boolean}
     */
    isAcceptingItems(direction) {
        return false
    }

    /**
     * @param {number} direction
     * @param {*} item
     * @return {boolean}
     */
    acceptItem(direction, item) {
        return false
    }
}
