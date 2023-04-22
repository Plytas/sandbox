import State from "./state.js";
import Engine from "./engine.js";
import Camera from "./camera.js";
import World from "./world.js";

export const game = {
	state: new State(),
    engine: new Engine(),
    camera: new Camera(),
    world: new World(),
}
