export default class Direction {
    /**
     * @param {number} directionValue
     */
    constructor(directionValue) {
        this.value = directionValue;
    }

    /**
     * @returns {Direction}
     * @constructor
     */
    static get Up() {
        return new Direction(0);
    }

    /**
     * @returns {Direction}
     * @constructor
     */
    static get Right() {
        return new Direction(1);
    }

    /**
     * @returns {Direction}
     * @constructor
     */
    static get Down() {
        return new Direction(2);
    }

    /**
     * @returns {Direction}
     * @constructor
     */
    static get Left() {
        return new Direction(3);
    }

    /**
     * @returns {number}
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
     * @returns {Direction}
     */
    clockwise() {
        return new Direction((this.value + 1) % 4);
    }

    /**
     * @returns {Direction}
     */
    counterclockwise() {
        return new Direction((this.value + 3) % 4);
    }

    /**
     * @returns {Direction}
     */
    opposite() {
        return new Direction((this.value + 2) % 4);
    }

    /**
     * @param {Direction} direction
     * @returns {Direction}
     */
    inRelationToDirection(direction) {
        return new Direction((4 + this.value - direction.value) % 4);
    }

    /**
     * @param {Direction} direction
     * @returns {boolean}
     */
    equals(direction) {
        return this.value === direction.value;
    }
}
