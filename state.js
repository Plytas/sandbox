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

        let cell = this.objectMap.getCell(this.mouse.position);

        if (cell.isEmpty()) {
            return;
        }

        cell.rotate(clockwise);
        let pos = new p5.Vector(cell.entity.originPosition.x - 1, cell.entity.originPosition.y - 1);

        game.engine.iterateOverPositions(pos, new p5.Vector(cell.entity.size.x + 2, cell.entity.size.y + 2), (callbackPosition, loops) => {
            if (callbackPosition.equals(this.mouse.position)) {
                return;
            }

            let object = game.state.objectMap.getCell(callbackPosition)

            if (object.entity instanceof Belt) {
                object.entity.configureInput();
            }
        });
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

        let nextPosition = belt.output.cell.nextPosition(belt.output.direction)
        let object = game.state.objectMap.getCell(nextPosition)

        if (object.entity instanceof Belt) {
            object.entity.configureInput();
        }
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

        let nextPosition = extractor.output.cell.nextPosition(extractor.output.direction)
        let object = game.state.objectMap.getCell(nextPosition)

        if (object.entity instanceof Belt) {
            object.entity.configureInput();
        }
    }
}
