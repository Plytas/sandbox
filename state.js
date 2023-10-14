import Mouse from "./mouse.js";
import ObjectMap from "./objectMap.js";
import Belt from "./entities/belt.js";
import Extractor from "./entities/extractor.js";
import Merger from "./entities/merger.js";
import Splitter from "./entities/splitter.js";
import UndergroundBeltEntrance from "./entities/undergroundBeltEntrance.js";
import {config} from "./config.js";
import {game} from "./game.js";
import inHand from "./inHand.js";
import SaveState from "./savestate.js";
import History from "./history.js";
import BeltCreateAction from "./actions/beltCreateAction.js";
import BeltDestroyAction from "./actions/beltDestroyAction.js";
import ExtractorCreateAction from "./actions/extractorCreateAction.js";
import ExtractorDestroyAction from "./actions/extractorDestroyAction.js";
import MergerCreateAction from "./actions/mergerCreateAction.js";
import MergerDestroyAction from "./actions/mergerDestroyAction.js";
import SplitterCreateAction from "./actions/splitterCreateAction.js";
import SplitterDestroyAction from "./actions/splitterDestroyAction.js";
import UndergroundBeltCreateAction from "./actions/undergroundBeltCreateAction.js";
import UndergroundBeltDestroyAction from "./actions/undergroundBeltDestroyAction.js";
import RotateAction from "./actions/rotateAction.js";
import Cell from "./common/cell.js";
import Position from "./common/position.js";

export default class State {
    constructor() {
        this.mouse = new Mouse();
        this.objectMap = new ObjectMap();
        this.inHand = new inHand();
        this.saveState = new SaveState();
        this.history = new History();
    }

    togglePause() {
        config.pause = !config.pause;
    }

    stepForward() {
        if (config.pause) {
            this.objectMap.processObjects();
        }
    }

    save() {
        this.saveState.save();
    }

    load() {
        this.saveState.load();
    }

    handleHistory(event) {
        if (!event.ctrlKey) {
            return;
        }

        if (event.shiftKey) {
            this.history.redo();
            return;
        }

        this.history.undo();
    }

    processObjects() {
        if (!config.pause) {
            this.objectMap.processObjects();
        }
        this.objectMap.drawObjects();
        this.objectMap.drawItems();
        this.objectMap.drawObjectDetails();
    }

    /**
     * @param {boolean} clockwise
     */
    rotateOnMouse(clockwise = true) {
        if (!this.inHand.isEmpty()) {
            this.inHand.rotate(clockwise);
            return;
        }

        let cell = this.objectMap.getCell(this.mouse.position);

        if (cell.isEmpty()) {
            return;
        }

        (new RotateAction(this.mouse.position, clockwise)).execute();
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

    /**
     * @param {Position} position
     */
    performActionOnPosition(position) {
        if (!this.inHand.isEmpty()) {
            this.createFromInHand(position);

            return;
        }

        if (this.objectMap.positionIsEmpty(position)) {
            return;
        }

        let cell = this.objectMap.getCell(position);

        this.performActionOnCell(cell);
    }

    /**
     * @param {Position} position
     */
    createFromInHand(position) {
        let size = this.inHand.entity.size;

        if (this.anyPositionIsNotEmpty(position, size)) {
            return;
        }

        if (this.inHand.entity instanceof Belt) {
            (new BeltCreateAction(this.mouse.position, this.inHand.entity.direction)).execute();
        } else if (this.inHand.entity instanceof Extractor) {
            (new ExtractorCreateAction(this.mouse.position, this.inHand.entity.direction)).execute();
        } else if (this.inHand.entity instanceof Merger) {
            (new MergerCreateAction(this.mouse.position, this.inHand.entity.direction)).execute();
        } else if (this.inHand.entity instanceof Splitter) {
            (new SplitterCreateAction(this.mouse.position, this.inHand.entity.direction)).execute();
        } else if (this.inHand.entity instanceof UndergroundBeltEntrance) {
            (new UndergroundBeltCreateAction(this.mouse.position, this.inHand.entity.direction, this.inHand.entity.side)).execute();
            this.inHand.entity.switchSide();
        }
    }

    /**
     * @param {Cell} cell
     */
    performActionOnCell(cell) {
        if (cell.entity instanceof Belt) {
            (new BeltDestroyAction(cell.entity.originPosition, cell.entity.direction)).execute();
        } else if (cell.entity instanceof Extractor) {
            (new ExtractorDestroyAction(cell.entity.originPosition, cell.entity.direction)).execute();
        } else if (cell.entity instanceof Merger) {
            (new MergerDestroyAction(cell.entity.originPosition, cell.entity.direction)).execute();
        } else if (cell.entity instanceof Splitter) {
            (new SplitterDestroyAction(cell.entity.originPosition, cell.entity.direction)).execute();
        } else if (cell.entity instanceof UndergroundBeltEntrance) {
            (new UndergroundBeltDestroyAction(cell.entity.originPosition, cell.entity.direction, cell.entity.side)).execute();
        }
    }
}
