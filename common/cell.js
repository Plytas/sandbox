import Direction from "./direction.js";
import Item from "../items/item.js";
import {game} from "../game.js";
import Position from "./position.js";

export default class Cell {
    /**
     * @param {Position} position
     * @param {Entity|null} entity
     */
    constructor(position, entity = null) {
        this.position = position;
        /** @type {Entity|null} */
        this.entity = entity;
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

        this.entity.draw(this.position);
    }

    drawItem() {
        if (this.isEmpty()) {
            return;
        }

        this.entity.drawItem(this.position);
    }

    drawDetails() {
        if (this.isEmpty()) {
            return;
        }

        this.entity.drawDetails(this.position);
    }

    drawInfo() {
        if (this.isEmpty()) {
            return;
        }

        this.entity.drawInfo(this.position);
    }

    work() {
        if (this.isEmpty()) {
            return;
        }

        this.entity.work();
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
    hasInput(direction) {
        return !this.isEmpty()
            && this.entity.hasInputAtPositionWithDirection(this.position, direction);
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

        return this.entity.hasInputAtPositionWithDirection(this.position, direction)
            && this.entity.acceptsItem(direction, item);
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
     * @param {Direction} direction
     * @returns {boolean}
     */
    hasOutput(direction) {
        return !this.isEmpty()
            && this.entity.hasOutputAtPositionWithDirection(this.position, direction);
    }

    /**
     * @param {Direction} direction
     * @returns {boolean}
     */
    providesItem(direction) {
        if (this.isEmpty()) {
            return false;
        }

        return this.entity.hasOutputAtPositionWithDirection(this.position, direction)
            && this.entity.providesItem(direction);
    }

    /**
     * @param {Direction} direction
     * @returns {boolean}
     */
    isProvidingItem(direction) {
        if (this.isEmpty()) {
            return false;
        }

        return this.entity.isProvidingItem(direction);
    }

    /**
     * @param {Direction} direction
     * @returns {Item|null}
     */
    provideItem(direction) {
        if (this.isEmpty()) {
            return null;
        }

        if (!this.providesItem(direction)) {
            return null;
        }

        if (!this.isProvidingItem(direction)) {
            return null;
        }

        return this.entity.provideItem(direction);
    }

    /**
     * @param {Direction|null} direction
     * @returns {Position|null}
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
                return this.position.relativePosition(0, -1);
            case Direction.Down.value:
                return this.position.relativePosition(0, 1);
            case Direction.Left.value:
                return this.position.relativePosition(-1, 0);
            case Direction.Right.value:
                return this.position.relativePosition(1, 0);
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
     * @return {Position}
     */
    getPositionBehind(direction) {
        switch (direction.value) {
            case Direction.Up.value:
                this.position.relativePosition(0, 1);
            case Direction.Down.value:
                return this.position.relativePosition(0, -1);
            case Direction.Left.value:
                return this.position.relativePosition(1, 0);
            case Direction.Right.value:
                return this.position.relativePosition(-1, 0);
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
     * @return {Position}
     */
    getPositionToTheLeft(direction) {
        switch (direction.value) {
            case Direction.Up.value:
                return this.position.relativePosition(-1, 0);
            case Direction.Down.value:
                return this.position.relativePosition(1, 0);
            case Direction.Left.value:
                return this.position.relativePosition(0, 1);
            case Direction.Right.value:
                return this.position.relativePosition(0, -1);
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
     * @return {Position}
     */
    getPositionToTheRight(direction) {
        switch (direction.value) {
            case Direction.Up.value:
                return this.position.relativePosition(1, 0);
            case Direction.Down.value:
                return this.position.relativePosition(-1, 0);
            case Direction.Left.value:
                return this.position.relativePosition(0, -1);
            case Direction.Right.value:
                return this.position.relativePosition(0, 1);
        }
    }
}
