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

export default class SaveState {
    constructor() {
        this.serializer = new Serializer();
    }

    save() {
        localStorage.setItem('save', JSON.stringify({
            cells: this.serializer.serialize(this.cellsToSave()),
            //TODO: history
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

    load() {
        let save = JSON.parse(localStorage.getItem('save'));

        game.state.objectMap.recreateFromCells(this.serializer.unserialize(save.cells, this.classMap()));
    }

    classMap() {
        return {
            'Belt': () => new Belt(new Position(0, 0), Direction.Up),
            'Extractor': () => new Extractor(new Position(0, 0), Direction.Up),
            'Merger': () => new Merger(new Position(0, 0), Direction.Up),
            'Splitter': () => new Splitter(new Position(0, 0), Direction.Up),
            'Cell': () => new Cell(new Position(0, 0)),
            'Item': () => new Item(),
            'Position': () => new Position(0, 0),
            'Direction': () => Direction.Up,
            'Input': () => new Input(new Position(0, 0), Direction.Up),
            'Output': () => new Output(new Position(0, 0), Direction.Up),
            'Size': () => new Size(0, 0),
        };
    }
}
