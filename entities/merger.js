import Direction from "../common/direction.js";
import {config} from "../config.js";
import Entity from "./entity.js";
import {game} from "../game.js";
import Item from "../items/item.js";
import Output from "../common/output.js";
import Input from "../common/input.js";

export default class Merger extends Entity {
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
        /** @type {Direction|null} */
        this.fromDirection = null;

        this.configureInputs();
        this.configureOutput();
    }

    configureInputs() {
        this.inputs = [
            new Input(this.originPosition, this.direction.inRelationToDirection(Direction.Down)),
            new Input(this.originPosition, this.direction.inRelationToDirection(Direction.Left).opposite()),
            new Input(this.originPosition, this.direction.inRelationToDirection(Direction.Right).opposite()),
        ];
        this.currentInputIndex = 0;
    }


    configureOutput() {
        this.output = new Output(this.originPosition, this.direction);
    }

    /**
     * @param {boolean} clockwise
     */
    rotate(clockwise = true) {
        super.rotate(clockwise);

        this.configureInputs();
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
            this.configureInputs();
        } else {
            fill(0);
        }

        //middle
        translate(position.x * config.gridSize + config.gridSize / 2, position.y * config.gridSize + config.gridSize / 2);
        // circle(0, 0, config.gridSize / 2 + 5)
        rotate(this.direction.rotation());

        //output
        translate(- config.gridSize / 2 + 10, -config.gridSize / 2);
        rect(0, 0, config.gridSize - 20, config.gridSize / 2);

        //output details
        // push()
        // fill(255, 225, 25);
        // translate(+ config.gridSize / 2 - 10, 10)
        // triangle((-config.gridSize / 8), 0, 0, (-config.gridSize / 8), (config.gridSize / 8), 0);
        // pop()

        //input
        this.inputs.forEach((input) => {
            push();

            translate(+ config.gridSize / 2 - 10, config.gridSize / 2);
            rotate(input.direction.inRelationToDirection(this.direction).opposite().rotation())

            translate(- config.gridSize / 2 + 10, +config.gridSize / 2);
            rect(0, 0, config.gridSize - 20, -config.gridSize / 2);

            //input details
            // push()
            // fill(255, 225, 25);
            // translate(+ config.gridSize / 2 - 10, -15)
            // triangle((-config.gridSize / 8), 0, 0, (-config.gridSize / 8), (config.gridSize / 8), 0);
            // pop()

            pop();
        })

        // translate(+ config.gridSize / 2 - 10, config.gridSize / 2);
        // rotate(this.input.direction.inRelationToDirection(this.direction).opposite().rotation())
        //
        // translate(- config.gridSize / 2 + 10, +config.gridSize / 2);
        // rect(0, 0, config.gridSize - 20, -config.gridSize / 2);
        //
        // //input details
        push()
        fill(255, 225, 25);
        translate(+ config.gridSize / 2 - 10, config.gridSize / 2 + 4)
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
                if (this.fromDirection.inRelationToDirection(this.direction).value === Direction.Left.value) {
                    rotate(this.direction.rotation());
                    translate(-(config.gridSize / 2 - (config.gridSize * this.progress / 60)) - this.item.width / 2, 0)
                    rotate(-this.direction.rotation());

                    this.item.draw(new p5.Vector(0, 0));
                } else if (this.fromDirection.inRelationToDirection(this.direction).value === Direction.Right.value) {
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
            this.configureInputs();
        }

        this.output.drawInfo(this.isGhost);

        this.inputs.forEach((input) => {
            input.drawInfo(this.isGhost);
        });
    }

    work() {
        if (this.reset) {
            this.reset = false;
            this.item = null;
            this.progress = 0;
        }

        if (this.item === null) {
            for (let i = 0; i < 2; i++) {
                this.currentInputIndex = (this.currentInputIndex + 1) % this.inputs.length;

                let input = this.inputs[this.currentInputIndex];
                let object = game.state.objectMap.getCell(input.cell.nextPosition(input.direction));

                if (!object.isEmpty()) {
                    this.item = object.provideItem(input.direction);

                    if (this.item === null) {
                        this.progress = 0;
                        continue;
                    }

                    this.fromDirection = input.direction;

                    return;
                }
            }

            this.progress = 0;
            return;
        }

        if (this.progress === 60) {
            let nextPosition = this.output.cell.nextPosition(this.output.direction)
            let object = game.state.objectMap.getCell(nextPosition)

            if (!object.isEmpty() && object.acceptItem(this.direction, this.item)) {
                this.reset = true;
            }

            return;
        }

        this.progress += 1;
    }

    providesItem(direction) {
        return direction.opposite().equals(this.output.direction);
    }

    isProvidingItem(direction) {
        return this.item !== null && this.progress === 60;
    }

    provideItem(direction) {
        if (this.item === null) {
            return null;
        }

        if (this.progress !== 60) {
            return null;
        }

        let item = this.item;
        this.item = null;
        this.progress = 0;

        return item;
    }
}
