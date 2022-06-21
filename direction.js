class Direction {
    /**
     * @param {number} directionValue
     */
    constructor(directionValue) {
        this.value = directionValue;
    }

    /**
     * @return {Direction}
     * @constructor
     */
    static get Up() {
        return new Direction(0);
    }

    /**
     * @return {Direction}
     * @constructor
     */
    static get Right() {
        return new Direction(1);
    }

    /**
     * @return {Direction}
     * @constructor
     */
    static get Down() {
        return new Direction(2);
    }

    /**
     * @return {Direction}
     * @constructor
     */
    static get Left() {
        return new Direction(3);
    }

    /**
     * @return {number}
     */
    rotation() {
        return [
            0,
            Math.PI / 2,
            Math.PI,
            -Math.PI / 2,
        ][this.value]
    }

    /**
     * @return {Direction}
     */
    clockwise() {
        return new Direction((this.value + 1) % 4);
    }

    /**
     * @return {Direction}
     */
    counterclockwise() {
        return new Direction((this.value + 3) % 4);
    }

    /**
     * @return {Direction}
     */
    opposite() {
        return new Direction((this.value + 2) % 4);
    }
}
