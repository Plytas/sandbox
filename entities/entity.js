import Direction from '../common/direction.js';
import Item from "../items/item.js";

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
     * @returns {boolean}
     */
    isAcceptingItems(direction) {
        return false
    }

    /**
     * @param {Direction} direction
     * @param {Item} item
     * @returns {boolean}
     */
    acceptItem(direction, item) {
        return false
    }
}
