import {dump} from "./debug.js";
import {config} from "./config.js";
import {game} from "./game.js";

export default class Keymap {
    constructor() {
        this.keymap = {
            [config.keyCodes.x]: () => config.toggleDebug(),
            [config.keyCodes.r]: (event) => game.state.rotateOnMouse(!event.shiftKey),
            [config.keyCodes.q]: () => game.state.inHand.usePicker(),
            [config.keyCodes.b]: () => game.state.inHand.pickBelt(),
            [config.keyCodes.m]: () => game.state.inHand.pickExtractor(),
            [config.keyCodes.g]: () => game.state.inHand.pickMerger(),
            [config.keyCodes.t]: () => game.state.inHand.pickSplitter(),
            [config.keyCodes.u]: () => game.state.inHand.pickUndergroundBelt(),
            [config.keyCodes.i]: () => game.state.inHand.pickSink(),
            [config.keyCodes.f]: () => config.toggleFullscreen(),
            [config.keyCodes.p]: () => game.state.togglePause(),
            [config.keyCodes.k]: () => game.state.save(),
            [config.keyCodes.l]: () => game.state.load(),
            [config.keyCodes.z]: (event) => game.state.handleHistory(event),
            [config.keyCodes.bracketRight]: () => game.state.stepForward(),
        }
    }

    handleKeyDown(event) {
        dump(event);

        this.keymap[keyCode]?.(event);
    }
}
