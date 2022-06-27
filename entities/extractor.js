class Extractor extends Entity {
    /**
     * @param {p5.Vector} originCell
     * @param {Direction} direction
     * @param {boolean} isGhost
     */
    constructor(originCell, direction = Direction.Up, isGhost = false) {
        super(originCell, direction, isGhost);
        this.size = new p5.Vector(2, 2);
        this.speed = 0.5;
        this.craftingTime = 120;
        this.count = 0;
        this.steps = 0;
    }

    produce() {
        this.count++;
        this.steps = 0;
    }

    /**
     * @param {Cell} cell
     */
    work(cell) {
        if (this.steps >= this.craftingTime) {
            this.produce();
        }

        this.steps += this.speed;
    }

    /**
     * @param {p5.Vector} cell
     */
    draw(cell) {
        if (this.isGhost) {
            fill(40, 40, 40, 40);
        } else {
            fill(0);
        }

        rect(cell.x * gridSize + 2, cell.y * gridSize + 2, (this.size.x * gridSize) - 4, (this.size.y * gridSize) - 4);
        fill(255);
        rect(cell.x * gridSize + 2, cell.y * gridSize + 2, ((this.size.x * gridSize - 4) * this.steps) / this.craftingTime, 2);
    }
}
