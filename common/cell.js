import Direction from "./direction.js";
import Item from "../items/item.js";
import {game} from "../game.js";

export default class Cell {
    /**
     * @param {p5.Vector} position
     * @param {Entity|null} entity
     */
    constructor(position, entity = null) {
        this.x = position.x;
        this.y = position.y;
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

    drawItem() {
        if (this.isEmpty()) {
            return;
        }

        this.entity.drawItem(new p5.Vector(this.x, this.y));
    }

    drawInfo() {
        if (this.isEmpty()) {
            return;
        }

        this.entity.drawInfo(new p5.Vector(this.x, this.y));
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
     * @param {Direction} direction
     * @returns {boolean}
     */
    hasOutput(direction) {
        return !this.isEmpty()
            && this.entity.hasOutput()
            && this.entity.output.cell.position().equals(this.position())
            && this.entity.output.direction.equals(direction);
    }

    /**
     * @param {Direction} direction
     * @param {Item} item
     * @returns {boolean}
     */
    acceptsItem(direction, item) {
        if (this.isEmpty()) {
            return false;
        }

        return this.entity.hasInput() && this.entity.acceptsItem(direction, item);
    }

    /**
     * @param {Direction} direction
     * @returns {boolean}
     */
    isAcceptingItems(direction) {
        if (this.isEmpty()) {
            return false;
        }

        return this.entity.isAcceptingItems(direction);
    }

    /**
     *
     * @param {Direction} direction
     * @param {Item} item
     * @returns {boolean}
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
     * @param {Direction|null} direction
     * @returns {p5.Vector|null}
     */
    nextPosition(direction = null) {
        if (direction === null) {
            if (this.isEmpty()) {
                return null
            }

            direction = this.entity.direction;
        }


        switch (direction.value) {
            case Direction.Up.value:
                return new p5.Vector(this.x, this.y - 1);
            case Direction.Down.value:
                return new p5.Vector(this.x, this.y + 1);
            case Direction.Left.value:
                return new p5.Vector(this.x - 1, this.y);
            case Direction.Right.value:
                return new p5.Vector(this.x + 1, this.y);
        }
    }

    /**
     * @param {Direction} direction
     * @return {Cell}
     */
    getCellBehind(direction) {
        let position = this.getPositionBehind(direction);

        return game.state.objectMap.getCell(position);
    }

    /**
     * @param {Direction} direction
     * @return {p5.Vector}
     */
    getPositionBehind(direction) {
        switch (direction.value) {
            case Direction.Up.value:
                return new p5.Vector(this.x, this.y + 1);
            case Direction.Down.value:
                return new p5.Vector(this.x, this.y - 1);
            case Direction.Left.value:
                return new p5.Vector(this.x + 1, this.y);
            case Direction.Right.value:
                return new p5.Vector(this.x - 1, this.y);
        }
    }

    /**
     * @param {Direction} direction
     * @return {Cell}
     */
    getCellToTheLeft(direction) {
        let position = this.getPositionToTheLeft(direction);

        return game.state.objectMap.getCell(position);
    }

    /**
     * @param {Direction} direction
     * @return {p5.Vector}
     */
    getPositionToTheLeft(direction) {
        switch (direction.value) {
            case Direction.Up.value:
                return new p5.Vector(this.x - 1, this.y);
            case Direction.Down.value:
                return new p5.Vector(this.x + 1, this.y);
            case Direction.Left.value:
                return new p5.Vector(this.x, this.y + 1);
            case Direction.Right.value:
                return new p5.Vector(this.x, this.y - 1);
        }
    }

    /**
     * @param {Direction} direction
     * @return {Cell}
     */
    getCellToTheRight(direction) {
        let position = this.getPositionToTheRight(direction);

        return game.state.objectMap.getCell(position);
    }

    /**
     * @param {Direction} direction
     * @return {p5.Vector}
     */
    getPositionToTheRight(direction) {
        switch (direction.value) {
            case Direction.Up.value:
                return new p5.Vector(this.x + 1, this.y);
            case Direction.Down.value:
                return new p5.Vector(this.x - 1, this.y);
            case Direction.Left.value:
                return new p5.Vector(this.x, this.y - 1);
            case Direction.Right.value:
                return new p5.Vector(this.x, this.y + 1);
        }
    }
}
