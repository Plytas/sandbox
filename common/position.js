import Direction from "./direction.js";

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

    /**
     * @param {Direction} direction
     * @param {number} distance
     * @returns {Position}
     */
    nextPositionInDirection(direction, distance = 1) {
        if (distance > 1) {
            return this.nextPositionInDirection(direction, distance - 1).nextPositionInDirection(direction);
        }

        switch (direction.value) {
            case Direction.Up.value:
                return this.relativePosition(0, -1);
            case Direction.Down.value:
                return this.relativePosition(0, 1);
            case Direction.Left.value:
                return this.relativePosition(-1, 0);
            case Direction.Right.value:
                return this.relativePosition(1, 0);
        }
    }

    /**
     * @param {Position} position
     * @returns {number}
     */
    distanceToPosition(position) {
        return Math.abs(this.x - position.x) + Math.abs(this.y - position.y);
    }
}
