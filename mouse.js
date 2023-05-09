import {config} from "./config.js";
import {game} from "./game.js";
import Position from "./common/position.js";
import Size from "./common/size.js";

export default class Mouse {
    precalculatePosition() {
        /** @type {Position} */
        this.position = new Position(
            Math.floor((mouseX + config.origin.x) / (config.gridSize * config.zoom.scale)),
            Math.floor((mouseY + config.origin.y) / (config.gridSize * config.zoom.scale)),
        );
    }

    draw() {
        push();

        let size = this.cellSize()
        this.cellFill(this.position, size)

        if (!game.state.inHand.isEmpty()) {
            game.state.inHand.draw(this.position);
        }

        strokeWeight(1);
        stroke(51);

        rect(this.position.x * config.gridSize, this.position.y * config.gridSize, size.x * config.gridSize, size.y * config.gridSize);

        if (!game.state.inHand.isEmpty()) {
            game.state.inHand.drawInfo(this.position);
        } else if (!game.state.objectMap.positionIsEmpty(this.position)) {
            game.state.objectMap.getCell(this.position).drawInfo();
        }

        if (config.debug) {
            fill(255);
            text(this.position.x + ":" + this.position.y, this.position.x * config.gridSize, this.position.y * config.gridSize);
        }

        pop();
    }

    /**
     * @returns {Size}
     */
    cellSize() {
        if (!game.state.inHand.isEmpty()) {
            return game.state.inHand.entity.size;
        }

        return new Size(1, 1);
    }

    /**
     * @param {Position} position
     * @param {Size} size
     * @returns {void}
     */
    cellFill(position, size) {
        fill(200, 200, 200, 200);

        game.engine.iterateOverPositions(position, size, (callbackPosition) => {
            if (game.engine.positionIsOutOfBounds(callbackPosition) || !game.state.objectMap.positionIsEmpty(callbackPosition)) {
                return fill(200, 0, 0, 100);
            }
        });
    }

    click() {
        let position = this.position;
        let size = this.cellSize();

        if (this.anyPositionIsOutOfBounds(position, size)) {
            return;
        }

        if (!game.state.inHand.isEmpty()) {
            if (this.anyPositionIsNotEmpty(position, size)) {
                return;
            }

            if (game.state.inHand.isBelt()) {
                game.state.createBelt();
            } else if (game.state.inHand.isExtractor()) {
                game.state.createExtractor();
            } else if (game.state.inHand.isMerger()) {
                game.state.createMerger();
            } else if (game.state.inHand.isSplitter()) {
                game.state.createSplitter();
            }

            return;
        }

        game.state.objectMap.performActionOnPosition(position);
    }

    wheel(event) {
        game.camera.performZoom(new Position(event.x, event.y), event.deltaY > 0)
    }

    /**
     * @param {Position} position
     * @param {Size} size
     * @return boolean|void
     */
    anyPositionIsOutOfBounds(position, size) {
        return game.engine.iterateOverPositions(position, size, (callbackPosition) => {
            if (game.engine.positionIsOutOfBounds(callbackPosition)) {
                return true;
            }
        });
    }

    /**
     * @param {Position} position
     * @param {Size} size
     * @return boolean|void
     */
    anyPositionIsNotEmpty(position, size) {
        return game.engine.iterateOverPositions(position, size, (callbackPosition) => {
            if (!game.state.objectMap.positionIsEmpty(callbackPosition)) {
                return true;
            }
        });
    }
}
