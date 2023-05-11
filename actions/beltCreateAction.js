import ActionInterface from "./actionInterface.js";
import {game} from "../game.js";
import Position from "../common/position.js";
import Direction from "../common/direction.js";

export default class BeltCreateAction extends ActionInterface {
    /**
     * @param {Position} position
     * @param {Direction} direction
     */
    constructor(position, direction) {
        super();
        this.position = position;
        this.direction = direction;
    }

    do() {
        game.state.objectMap.createBelt(this.position, this.direction);
    }

    undo() {
        game.state.objectMap.deleteObjectInPosition(this.position);
    }
}
