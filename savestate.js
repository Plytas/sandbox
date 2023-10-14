import Serializer from "./serializer.js";
import {game} from "./game.js";
import Belt from "./entities/belt.js";
import Extractor from "./entities/extractor.js";
import Merger from "./entities/merger.js";
import Splitter from "./entities/splitter.js";
import Direction from "./common/direction.js";
import Position from "./common/position.js";
import Cell from "./common/cell.js";
import Item from "./items/item.js";
import Input from "./common/input.js";
import Output from "./common/output.js";
import Size from "./common/size.js";
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
import UndergroundBeltEntrance from "./entities/undergroundBeltEntrance.js";
import UndergroundBelt from "./entities/undergroundBelt.js";

export default class SaveState {
    constructor() {
        this.serializer = new Serializer();
    }

    save() {
        localStorage.setItem('save', JSON.stringify({
            cells: this.serializer.serialize(this.cellsToSave()),
            history: this.serializer.serialize(this.historyToSave())
        }));
    }

    /**
     * @returns {Cell[]}
     */
    cellsToSave() {
        let cells = [];

        for (let x = 0; x < game.state.objectMap.cells.length; x++) {
            if (!game.state.objectMap.cells[x]) {
                continue;
            }

            for (let y = 0; y < game.state.objectMap.cells[x].length; y++) {
                if (!game.state.objectMap.cells[x][y]) {
                    continue;
                }

                cells.push(game.state.objectMap.cells[x][y]);
            }
        }

        return cells;
    }

    historyToSave() {
        return game.state.history;
    }

    load() {
        let save = JSON.parse(localStorage.getItem('save'));

        game.state.objectMap.recreateFromCells(this.serializer.unserialize(save.cells, this.classMap()));
        game.state.history = this.serializer.unserialize(save.history, this.classMap());
    }

    classMap() {
        return {
            'Belt': () => new Belt(new Position(0, 0), Direction.Up),
            'Extractor': () => new Extractor(new Position(0, 0), Direction.Up),
            'Merger': () => new Merger(new Position(0, 0), Direction.Up),
            'Splitter': () => new Splitter(new Position(0, 0), Direction.Up),
            'UndergroundBeltEntrance': () => new UndergroundBeltEntrance(new Position(0, 0), Direction.Up),
            'UndergroundBelt': () => new UndergroundBelt(new Position(0, 0), Direction.Up, false, 0),
            'Cell': () => new Cell(new Position(0, 0)),
            'Item': () => new Item(),
            'Position': () => new Position(0, 0),
            'Direction': () => Direction.Up,
            'Input': () => new Input(new Position(0, 0), Direction.Up),
            'Output': () => new Output(new Position(0, 0), Direction.Up),
            'Size': () => new Size(0, 0),
            'History': () => new History(),
            'BeltCreateAction': () => new BeltCreateAction(new Position(0, 0), Direction.Up),
            'BeltDestroyAction': () => new BeltDestroyAction(new Position(0, 0), Direction.Up),
            'ExtractorCreateAction': () => new ExtractorCreateAction(new Position(0, 0), Direction.Up),
            'ExtractorDestroyAction': () => new ExtractorDestroyAction(new Position(0, 0), Direction.Up),
            'MergerCreateAction': () => new MergerCreateAction(new Position(0, 0), Direction.Up),
            'MergerDestroyAction': () => new MergerDestroyAction(new Position(0, 0), Direction.Up),
            'SplitterCreateAction': () => new SplitterCreateAction(new Position(0, 0), Direction.Up),
            'SplitterDestroyAction': () => new SplitterDestroyAction(new Position(0, 0), Direction.Up),
            'UndergroundBeltCreateAction': () => new UndergroundBeltCreateAction(new Position(0, 0), Direction.Up, 'input'),
            'UndergroundBeltDestroyAction': () => new UndergroundBeltDestroyAction(new Position(0, 0), Direction.Up, 'input'),
            'RotateAction': () => new RotateAction(new Position(0, 0), true),
        };
    }
}
