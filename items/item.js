class Item {
    constructor() {
        let coalSpriteData = oresSpriteData.coal;
        let pos = coalSpriteData[Math.floor(Math.random()*coalSpriteData.length)].position;
        this.image = oresSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);

        // this.image = image;
        this.width = gridSize * 0.6;
        this.height = gridSize * 0.6;
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
