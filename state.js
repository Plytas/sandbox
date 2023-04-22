import Mouse from "./mouse.js";
import ObjectMap from "./objectMap.js";
import Cell from "./common/cell.js";
import Belt from "./entities/belt.js";
import Extractor from "./entities/extractor.js";
import {config} from "./config.js";
import {game} from "./game.js";
import inHand from "./inHand.js";

export default class State {
    constructor() {
        this.mouse = new Mouse();
        this.objectMap = new ObjectMap();
        this.inHand = new inHand();
    }

    processObjects() {
        this.objectMap.processObjects();
    }

    rotateOnMouse(clockwise = true) {
        if (!this.inHand.isEmpty()) {
            this.inHand.rotate(clockwise);
            return;
        }

        return this.objectMap.rotateObjectInPosition(this.mouse.position, clockwise);
    }

    createBelt() {
        let handPosition = this.mouse.position;
        let belt = new Belt(handPosition, this.inHand.entity.direction);
        let cell = new Cell(handPosition, belt);
        this.objectMap.setCell(cell);

        translate(-config.origin.x, -config.origin.y);
        scale(config.zoom.scale);
        cell.draw();

        this.objectMap.belts.push(cell);
    }

    createExtractor() {
        let handPosition = this.mouse.position;
        let extractor = new Extractor(handPosition, this.inHand.entity.direction);

        game.engine.iterateOverPositions(handPosition, extractor.size, (callbackPosition, loops) => {
            let cell = new Cell(callbackPosition, extractor);
            this.objectMap.setCell(cell);

            if (loops === 0) {
                translate(-config.origin.x, -config.origin.y);
                scale(config.zoom.scale);
                cell.draw();

                this.objectMap.extractors.push(cell);
            }
        });
    }
}
