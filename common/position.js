export default class Position {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {Position}
     */
    relativePosition(x, y) {
        return new Position(this.x + x, this.y + y);
    }

    /**
     * @param {Position} position
     */
    setPosition(position) {
        this.x = position.x;
        this.y = position.y;
    }

    /**
     * @param {Position} position
     */
    addPosition(position) {
        this.x += position.x;
        this.y += position.y;
    }

    /**
     * @param {Position} position
     * @returns {boolean}
     */
    equals(position) {
        return this.x === position.x
            && this.y === position.y;
    }
}
