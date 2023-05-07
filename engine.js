import Keymap from "./keymap.js";
import {config} from "./config.js";
import Position from "./common/position.js";

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
     * @param {p5.Vector} size
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
     * @returns {boolean}
     */
    positionIsOutOfBounds(position) {
        return position.x < 0 ||
            position.x >= config.mapSize.x / config.gridSize ||
            position.y < 0 ||
            position.y >= config.mapSize.y / config.gridSize;
    }
}
