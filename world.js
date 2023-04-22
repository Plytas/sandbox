import {config} from "./config.js";

export default class World {
    draw() {
        push();

        background(50);
        fill(220);
        rect(0, 0, config.mapSize.x, config.mapSize.y);

        pop();
    }
}
