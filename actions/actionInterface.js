import {game} from "../game.js";

export default class ActionInterface {
    execute() {
        this.do();

        game.state.history.push(this);
    }

    do() {

    }

    undo() {

    }
}
