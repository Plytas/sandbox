import ActionInterface from "./actionInterface.js";
import {game} from "../game.js";
import Position from "../common/position.js";
import Direction from "../common/direction.js";

export default class RotateAction extends ActionInterface {
    /**
     * @param {Position} position
     * @param {boolean} clockwise
     */
    constructor(position, clockwise = true) {
        super();
        this.position = position.relativePosition(0, 0);
        this.clockwise = clockwise;
    }

    do() {
        let cell = game.state.objectMap.getCell(this.position);

        cell.rotate(this.clockwise);
    }

    undo() {
        let cell = game.state.objectMap.getCell(this.position);

        cell.rotate(!this.clockwise);
    }
}
