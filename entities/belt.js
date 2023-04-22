import Direction from "../common/direction.js";
import {config} from "../config.js";
import Entity from "./entity.js";
import {game} from "../game.js";
import Item from "../items/item.js";

export default class Belt extends Entity {
    /**
     * @param {p5.Vector} originPosition
     * @param {Direction} direction
     * @param {boolean} isGhost
     */
    constructor(originPosition, direction = Direction.Up, isGhost = false) {
        super(originPosition, direction, isGhost);
        /** @type {Item|null} */
        this.item = null;
        this.progress = 0;
        this.reset = false;
        this.fromDirection = direction.opposite();
    }

    /**
     * @param {p5.Vector} position
     */
    draw(position) {
        push();

        translate(position.x * config.gridSize + config.gridSize / 2, position.y * config.gridSize + config.gridSize / 2);

        rotate(this.direction.rotation());

        if (this.isGhost) {
            fill(40, 40, 40, 40);
        } else {
            fill(0);
        }

        rectMode(CENTER);
        rect(0, 0, config.gridSize, config.gridSize);
        drawingContext.clip();

        this.drawBeltDetails();

        pop();
    }

    drawBeltDetails() {
        push();

        translate(0, 25);

        if (this.isGhost) {
            fill(255, 225, 25, 40);
        } else {
            fill(255, 225, 25);
        }

        translate(0, -(config.beltAnimationProgress * config.gridSize / 60));
        triangle((-config.gridSize / 8), (config.gridSize / 8), 0, (-config.gridSize / 8), (config.gridSize / 8), (config.gridSize / 8));

        translate(0, -config.gridSize);
        triangle((-config.gridSize / 8), (config.gridSize / 8), 0, (-config.gridSize / 8), (config.gridSize / 8), (config.gridSize / 8));

        translate(0, 2 * config.gridSize);
        triangle((-config.gridSize / 8), (config.gridSize / 8), 0, (-config.gridSize / 8), (config.gridSize / 8), (config.gridSize / 8));

        pop()
    }

    /**
     * @param {p5.Vector} position
     */
    drawItem(position) {
        push();
        translate(position.x * config.gridSize + config.gridSize / 2, position.y * config.gridSize + config.gridSize / 2);

        if (!this.isGhost && this.item !== null) {
            if (this.progress < 30 + (this.item.width / 2) / (config.gridSize / 60)) {
                if (this.fromDirection.value === Direction.Left.value) {
                    rotate(this.direction.rotation());
                    translate(-(config.gridSize / 2 - (config.gridSize * this.progress / 60)) - this.item.width / 2, 0)
                    rotate(-this.direction.rotation());

                    this.item.draw(new p5.Vector(0, 0));
                } else if (this.fromDirection.value === Direction.Right.value) {
                    rotate(this.direction.rotation());
                    translate((config.gridSize / 2 - (config.gridSize * this.progress / 60)) + this.item.width / 2, 0)
                    rotate(-this.direction.rotation());

                    this.item.draw(new p5.Vector(0, 0));
                } else {
                    rotate(this.direction.rotation());
                    translate(0, config.gridSize / 2 - (config.gridSize * this.progress / 60) + this.item.height / 2)
                    rotate(-this.direction.rotation());
                    this.item.draw(new p5.Vector(0, 0));
                }
            } else {
                rotate(this.direction.rotation());
                translate(0, config.gridSize / 2 - (config.gridSize * this.progress / 60) + this.item.height / 2)
                rotate(-this.direction.rotation());
                this.item.draw(new p5.Vector(0, 0));
            }
        }
        pop();
    }

    /**
     * @param {Cell} cell
     */
    work(cell) {
        if (this.reset) {
            this.reset = false;
            this.item = null;
            this.progress = 0;
        }

        if (this.item === null) {
            this.progress = 0;
            return;
        }

        if (this.progress === 60) {
            let nextPosition = cell.nextPosition()
            let object = game.state.objectMap.getCell(nextPosition)

            if (object !== null && object.acceptItem(this.direction, this.item)) {
                this.reset = true;
            }

            return;
        }

        this.progress += 1;
    }

    /**
     * @param {Direction} direction
     * @param {Item} item
     * @returns {boolean}
     */
    acceptsItem(direction, item = null) {
        return true
    }

    /**
     * @param {Direction} direction
     * @returns {boolean}
     */
    isAcceptingItems(direction) {
        if (direction.opposite().value === this.direction.value) {
            return false;
        }

        return this.item === null;
    }

    /**
     * @param {Direction} direction
     * @param {Item} item
     * @returns {boolean}
     */
    acceptItem(direction, item) {
        if (this.item !== null) {
            return false;
        }

        this.item = item;
        this.fromDirection = direction.opposite().inRelationToDirection(this.direction);

        return true;
    }
}
