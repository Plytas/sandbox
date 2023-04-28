import Direction from "../common/direction.js";
import {config} from "../config.js";
import Entity from "./entity.js";
import {game} from "../game.js";
import Item from "../items/item.js";
import Output from "../common/output.js";
import Input from "../common/input.js";
import {dump} from "../debug.js";
import Cell from "../common/cell.js";

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

        this.configureInput();
        this.configureOutput();
    }

    configureInput() {
        this.input = new Input(this.originPosition, this.inputDirection());
    }

    /**
     * @returns {Direction}
     */
    inputDirection() {
        let cellBehind = (new Cell(this.originPosition).getCellBehind(this.direction));

        if (cellBehind.hasOutput(this.direction.inRelationToDirection(Direction.Down).opposite())) {
            return this.direction.opposite();
        }

        let cellToTheLeft = (new Cell(this.originPosition).getCellToTheLeft(this.direction));
        let cellToTheRight = (new Cell(this.originPosition)).getCellToTheRight(this.direction);

        if ((cellToTheLeft.isEmpty() && cellToTheRight.isEmpty())) {
            return this.direction.opposite();
        }

        let cellToTheLeftHasOutput = cellToTheLeft.hasOutput(this.direction.inRelationToDirection(Direction.Left));
        let cellToTheRightHasOutput = cellToTheRight.hasOutput(this.direction.inRelationToDirection(Direction.Right))

        if ((cellToTheLeftHasOutput && cellToTheRightHasOutput) || (!cellToTheLeftHasOutput && !cellToTheRightHasOutput)) {
            return this.direction.opposite();
        }

        if (cellToTheLeftHasOutput) {
            return this.direction.inRelationToDirection(Direction.Left).opposite();
        }

        return this.direction.inRelationToDirection(Direction.Right).opposite();
    }

    configureOutput() {
        this.output = new Output(this.originPosition, this.direction);
    }

    /**
     * @param {boolean} clockwise
     */
    rotate(clockwise = true) {
        super.rotate(clockwise);

        this.configureInput();
        this.configureOutput();
    }

    /**
     * @param {p5.Vector} position
     */
    draw(position) {
        push();
        if (this.isGhost) {
            fill(40, 40, 40);

            this.originPosition = position;
            this.configureOutput();
            this.configureInput();
        } else {
            fill(0);
        }

        //middle
        translate(position.x * config.gridSize + config.gridSize / 2, position.y * config.gridSize + config.gridSize / 2);
        circle(0, 0, config.gridSize / 2 + 5)
        rotate(this.direction.rotation());

        //output
        translate(- config.gridSize / 2 + 10, -config.gridSize / 2);
        rect(0, 0, config.gridSize - 20, config.gridSize / 2);

        //output details
        push()
        fill(255, 225, 25);
        translate(+ config.gridSize / 2 - 10, 10)
        triangle((-config.gridSize / 8), 0, 0, (-config.gridSize / 8), (config.gridSize / 8), 0);
        pop()

        //input
        translate(+ config.gridSize / 2 - 10, config.gridSize / 2);
        rotate(this.input.direction.inRelationToDirection(this.direction).opposite().rotation())

        translate(- config.gridSize / 2 + 10, +config.gridSize / 2);
        rect(0, 0, config.gridSize - 20, -config.gridSize / 2);

        //input details
        push()
        fill(255, 225, 25);
        translate(+ config.gridSize / 2 - 10, -15)
        triangle((-config.gridSize / 8), 0, 0, (-config.gridSize / 8), (config.gridSize / 8), 0);
        pop()

        pop();
    }

    /**
     * @param {p5.Vector} position
     */
    drawItem(position) {
        push();
        translate(position.x * config.gridSize + config.gridSize / 2, position.y * config.gridSize + config.gridSize / 2);

        if (!this.isGhost && this.item !== null) {
            if (this.progress < 30 + (this.item.width / 2) / (config.gridSize / 60)) {
                if (this.input.direction.inRelationToDirection(this.direction).value === Direction.Left.value) {
                    rotate(this.direction.rotation());
                    translate(-(config.gridSize / 2 - (config.gridSize * this.progress / 60)) - this.item.width / 2, 0)
                    rotate(-this.direction.rotation());

                    this.item.draw(new p5.Vector(0, 0));
                } else if (this.input.direction.inRelationToDirection(this.direction).value === Direction.Right.value) {
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
     * @param {p5.Vector} position
     */
    drawInfo(position) {
        if (this.isGhost) {
            this.originPosition = position;
            this.configureOutput();
            this.configureInput();
        }

        this.output.drawInfo(this.isGhost);
        this.input.drawInfo(this.isGhost);
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

            if (!object.isEmpty() && object.acceptItem(this.direction, this.item)) {
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
        return direction.opposite().equals(this.input.direction);
    }

    /**
     * @param {Direction} direction
     * @returns {boolean}
     */
    isAcceptingItems(direction) {
        if (!direction.opposite().equals(this.input.direction)) {
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
        if (!direction.opposite().equals(this.input.direction)) {
            return false;
        }

        if (this.item !== null) {
            return false;
        }

        this.item = item;

        return true;
    }
}
