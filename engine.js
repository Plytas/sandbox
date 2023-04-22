import Keymap from "./keymap.js";
import {config} from "./config.js";

export default class Engine {
    constructor() {
        this.keymap = new Keymap();
    }

    /**
     * @callback iteratedPosition
     * @param {p5.Vector} position
     * @param {number} loops
     * @returns {*}
     */

    /**
     * @param {p5.Vector} position
     * @param {p5.Vector} size
     * @param {iteratedPosition} callback
     * @returns {*}
     */
    iterateOverPositions(position, size, callback) {
        let callbackResponse;
        let loops = 0;

        for (let i = 0; i < size.x; i++) {
            for (let j = 0; j < size.y; j++) {
                callbackResponse = callback(new p5.Vector(position.x + i, position.y + j), loops);

                if (callbackResponse !== undefined) {
                    return callbackResponse;
                }

                loops++;
            }
        }
    }

    /**
     * @param {p5.Vector} position
     * @returns {boolean}
     */
    positionIsOutOfBounds(position) {
        return position.x < 0 ||
            position.x >= config.mapSize.x / config.gridSize ||
            position.y < 0 ||
            position.y >= config.mapSize.y / config.gridSize;
    }
}
