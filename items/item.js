import { config } from "../config.js";

export default class Item {
    constructor() {
        let coalSpriteData = config.oresSpriteData.coal;
        let pos = coalSpriteData[Math.floor(Math.random() * coalSpriteData.length)].position;
        this.image = config.oresSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);

        // this.image = image;
        this.width = config.gridSize * 0.6;
        this.height = config.gridSize * 0.6;
    }

    /**
     * @param {p5.Vector} position
     */
    draw(position) {

        fill(53, 77, 117);
        rectMode(CENTER);
        rect(position.x, position.y, this.width, this.height);
        // imageMode(CENTER);
        // image(this.image, position.x, position.y, this.width, this.height);
    }
}
