import Keymap from "./keymap.js";
import {config} from "./config.js";
import Position from "./common/position.js";
import Size from "./common/size.js";

export default class Engine {
    constructor() {
        this.keymap = new Keymap();
    }

    /**
     * @callback iteratedPosition
     * @param {Position} position
     * @param {number} loops
     * @returns {*}
     */

    /**
     * @param {Position} position
     * @param {Size} size
     * @param {iteratedPosition} callback
     * @returns {*}
     */
    iterateOverPositions(position, size, callback) {
        let callbackResponse;
        let loops = 0;

        for (let i = 0; i < size.x; i++) {
            for (let j = 0; j < size.y; j++) {
                callbackResponse = callback(position.relativePosition(i, j), loops);

                if (callbackResponse !== undefined) {
                    return callbackResponse;
                }

                loops++;
            }
        }
    }

    /**
     * @param {Position} position
     * @param {Direction} direction
     * @param {iteratedPosition} callback
     * @param {number} numberOfCells
     * @returns {*}
     */
    iterateOverPositionsInDirection(position, direction, callback, numberOfCells = 1) {
        let callbackResponse;
        let loops = 0;

        for (let i = 0; i < numberOfCells; i++) {
            position = position.nextPositionInDirection(direction);
            callbackResponse = callback(position, loops);

            if (callbackResponse !== undefined) {
                return callbackResponse;
            }

            loops++;
        }
    }

    /**
     * @param {Position} position
     * @returns {boolean}
     */
    positionIsOutOfBounds(position) {
        return position.x < 0 ||
            position.x >= config.mapSize.x / config.gridSize ||
            position.y < 0 ||
            position.y >= config.mapSize.y / config.gridSize;
    }
}
