import { config } from "./config.js";
import * as game from "./game.js";

export default class Mouse {
    draw() {
        push();
        strokeWeight(1);
        stroke(51);

        let size = this.cellSize()
        this.cellFill(this.cell, size)

        if (config.inHand !== null) {
            config.inHand.position(this.cell);

            push();
            if (!config.objectMap.cellIsEmpty(this.cell)) {
                translate(2, 2);
            }
            config.inHand.draw();
            pop();
        }

        rect(this.cell.x * config.gridSize, this.cell.y * config.gridSize, size.x * config.gridSize, size.y * config.gridSize);

        if (config.debug) {
            fill(255);
            text(this.cell.x + ":" + this.cell.y, this.cell.x * config.gridSize, this.cell.y * config.gridSize);
        }

        pop();
    }

    precalculateCell() {
        /** @type {p5.Vector} */
        this.cell = new p5.Vector(
            Math.floor((mouseX + config.origin.x) / (config.gridSize * config.zoom.scale)),
            Math.floor((mouseY + config.origin.y) / (config.gridSize * config.zoom.scale)),
        );
    }

    /**
     * @return {p5.Vector}
     */
    cellSize() {
        if (config.inHand !== null) {
            return config.inHand.entity.size;
        }

        return new p5.Vector(1, 1);
    }

    /**
     * @param {p5.Vector} cell
     * @param {p5.Vector} size
     * @return {void}
     */
    cellFill(cell, size) {
        fill(200, 200, 200, 200);

        game.iterateOverCells(cell, size, (callbackCell) => {
            if (game.cellIsOutOfBounds(callbackCell) || !config.objectMap.cellIsEmpty(callbackCell)) {
                return fill(200, 0, 0, 100);
            }
        });
    }
}
