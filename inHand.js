import Belt from "./entities/belt.js";
import Extractor from "./entities/extractor.js";
import {game} from "./game.js";
import Direction from "./common/direction.js";
import Merger from "./entities/merger.js";
import Splitter from "./entities/splitter.js";

export default class inHand {
    /**
     * @param {Entity|null} entity
     */
    constructor(entity = null) {
        /** @type {Entity|null} */
        this.entity = entity;
        this.globalDirection = Direction.Up;
    }

    /**
     * @return {boolean}
     */
    isEmpty() {
        return this.entity === null;
    }

    /**
     * @return {boolean}
     */
    isBelt() {
        return this.entity instanceof Belt;
    }

    /**
     * @return {boolean}
     */
    isExtractor() {
        return this.entity instanceof Extractor;
    }

    /**
     * @returns {boolean}
     */
    isMerger() {
        return this.entity instanceof Merger;
    }

    /**
     * @returns {boolean}
     */
    isSplitter() {
        return this.entity instanceof Splitter;
    }

    usePicker() {
        if (!this.isEmpty()) {
            this.entity = null;
            return;
        }

        let cellObject = game.state.objectMap.getCell(game.state.mouse.position);

        if (!cellObject.isEmpty()) {
            this.globalDirection = cellObject.entity.direction;
            this.entity = new cellObject.entity.constructor(game.state.mouse.position, this.globalDirection, true);
        }
    }

    pickBelt() {
        this.entity = new Belt(game.state.mouse.position, this.globalDirection, true);
    }

    pickExtractor() {
        this.entity = new Extractor(game.state.mouse.position, this.globalDirection, true);
    }

    pickMerger() {
        this.entity = new Merger(game.state.mouse.position, this.globalDirection, true);
    }

    pickSplitter() {
        this.entity = new Splitter(game.state.mouse.position, this.globalDirection, true);
    }

    /**
     * @param {boolean} clockwise
     */
    rotate(clockwise = true) {
        if (this.isEmpty()) {
            return;
        }

        this.entity.rotate(clockwise);
        this.globalDirection = this.entity.direction;
    }

    /**
     * @param {p5.Vector} position
     */
    draw(position) {
        if (this.isEmpty()) {
            return;
        }

        push();

        if (!game.state.objectMap.positionIsEmpty(position)) {
            translate(2, 2);
        }

        this.entity.draw(position);

        pop();
    }

    /**
     * @param {p5.Vector} position
     */
    drawInfo(position) {
        if (this.isEmpty()) {
            return;
        }

        push();

        if (!game.state.objectMap.positionIsEmpty(position)) {
            translate(2, 2);
        }

        this.entity.drawInfo(position);

        pop();
    }
}
