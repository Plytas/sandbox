import ActionInterface from "./actions/actionInterface.js";

export default class History {
    constructor() {
        this.history = [];
        this.index = 0;
    }

    /**
     * @param {ActionInterface} action
     */
    push(action) {
        this.history.splice(this.index, this.history.length - this.index);
        this.history.push(action);
        this.index++;
    }

    undo() {
        if (this.index > 0) {
            this.index--;
            this.history[this.index].undo();
        }
    }

    redo() {
        if (this.index < this.history.length) {
            this.history[this.index].do();
            this.index++;
        }
    }
}
