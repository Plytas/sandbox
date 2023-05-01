import {config} from "./config.js";
import {game} from "./game.js";

export function draw() {
    if (!config.debug) {
        return;
    }

    push();

    fill(255);
    text(game.state.objectMap.extractors.length, 20, 20);
    text(frameRate(), windowWidth - 40, 20);

    rectMode(CENTER);
    fill(0);
    rect(config.canvasSize.x / 2, config.canvasSize.y / 2, 3, 3);

    pop();
}

export function dump(...values) {
    if (config.debug) {
        values.forEach((value) => console.log(value))
    }
}
