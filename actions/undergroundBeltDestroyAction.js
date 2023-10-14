import ActionInterface from "./actionInterface.js";
import {game} from "../game.js";
import Position from "../common/position.js";
import Direction from "../common/direction.js";

export default class UndergroundBeltDestroyAction extends ActionInterface {
    /**
     * @param {Position} position
     * @param {Direction} direction
     * @param {string} side
     */
    constructor(position, direction, side) {
        super();
        this.position = position.relativePosition(0, 0);
        this.direction = direction;
        this.side = side;
    }

    do() {
        game.state.objectMap.deleteObjectInPosition(this.position);
    }

    undo() {
        game.state.objectMap.createUndergroundBelt(this.position, this.direction, this.side);
    }
}
