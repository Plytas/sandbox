import Direction from '../common/direction.js';
import Item from "../items/item.js";
import Input from "../common/input.js";
import Output from "../common/output.js";

export default class Entity {
    /**
     * @param {p5.Vector} originPosition
     * @param {Direction} direction
     * @param {boolean} isGhost
     */
    constructor(originPosition, direction = Direction.Up, isGhost = false) {
        this.originPosition = originPosition;
        this.size = new p5.Vector(1, 1);
        this.direction = direction;
        this.isGhost = isGhost;
        /** @type {Input|null} */
        this.input = null;
        /** @type {Input[]|null} */
        this.inputs = null;
        /** @type {Output|null} */
        this.output = null;
        /** @type {Output[]|null} */
        this.outputs = null;
    }

    /**
     * @param {boolean} clockwise
     */
    rotate(clockwise = true) {
        this.direction = clockwise ? this.direction.clockwise() : this.direction.counterclockwise();
    }

    /**
     * @param {p5.Vector} position
     */
    draw(position) {

    }

    /**
     * @param {p5.Vector} position
     */
    drawItem(position) {

    }

    /**
     * @param {p5.Vector} position
     */
    drawInfo(position) {

    }

    /**
     * @param {p5.Vector} position
     */
    drawDetails(position) {

    }

    work() {

    }

    /**
     * @param {p5.Vector} position
     * @param {Direction} direction
     * @returns {boolean}
     */
    hasInputAtPositionWithDirection(position, direction) {
        if (this.input !== null) {
            return this.input.cell.position().equals(position)
                && this.input.direction.opposite().equals(direction);
        }

        if (this.inputs !== null) {
            return this.inputs.some((input) => {
                return input.cell.position().equals(position)
                    && input.direction.opposite().equals(direction)
            });
        }

        return false;
    }

    /**
     * @param {p5.Vector} position
     * @param {Direction} direction
     * @returns {boolean}
     */
    hasOutputAtPositionWithDirection(position, direction) {
        if (this.output !== null) {
            return this.output.cell.position().equals(position)
                && this.output.direction.opposite().equals(direction);
        }

        if (this.outputs !== null) {
            return this.outputs.some((output) => {
                return output.cell.position().equals(position)
                    && output.direction.opposite().equals(direction)
            });
        }

        return false;
    }

    /**
     * @param {Direction} direction
     * @param {Item} item
     * @returns {boolean}
     */
    acceptsItem(direction, item) {
        return false;
    }

    /**
     * @param {Direction} direction
     * @returns {boolean}
     */
    isAcceptingItems(direction) {
        return false;
    }

    /**
     * @param {Direction} direction
     * @param {Item} item
     * @returns {boolean}
     */
    acceptItem(direction, item) {
        return false;
    }

    /**
     * @param {Direction} direction
     * @returns {boolean}
     */
    providesItem(direction) {
        return false;
    }

    /**
     * @param {Direction} direction
     * @returns {boolean}
     */
    isProvidingItem(direction) {
        return false;
    }

    /**
     * @param {Direction} direction
     * @returns {Item|null}
     */
    provideItem(direction) {
        return null;
    }
}
