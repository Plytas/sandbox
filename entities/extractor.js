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
        this.item = new Item();

        this.configureOutput(originCell, direction);
    }

    /**
     * @param {p5.Vector} originCell
     * @param {Direction} direction
     */
    configureOutput(originCell, direction) {
        dump(originCell);
        dump(direction);
        switch (direction.value) {
            case Direction.Up.value:
                this.output = new Output(new p5.Vector(originCell.x, originCell.y), direction);
                break;
            case Direction.Right.value:
                this.output = new Output(new p5.Vector(originCell.x + 1, originCell.y), direction);
                break;
            case Direction.Down.value:
                this.output = new Output(new p5.Vector(originCell.x + 1, originCell.y + 1), direction);
                break;
            case Direction.Left.value:
                this.output = new Output(new p5.Vector(originCell.x, originCell.y + 1), direction);
                break;
        }

        dump(this.output);
    }

    /**
     * @param {Cell} cell
     */
    work(cell) {
        if (this.steps >= this.craftingTime) {
            let nextCell = this.output.cell.nextCell(this.output.direction);
            let object = objectMap.getCell(nextCell);

            if (object !== null && object.acceptItem(this.direction, this.item)) {
                this.steps = 0;
                this.item = new Item();
            }

            return;
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

    /**
     * @param {p5.Vector} cell
     */
    drawItem(cell) {
        if (this.isGhost || this.item === null) {
            return;
        }

        push();
        cell = this.output.cell

        translate(cell.x * gridSize + gridSize / 2, cell.y * gridSize + gridSize / 2);
        rotate(this.output.direction.rotation());
        translate(0, gridSize / 2 - (gridSize * this.steps / this.craftingTime) + this.item.height / 2)
        rotate(-this.output.direction.rotation());
        this.item.draw(new p5.Vector(0, 0));

        pop();
    }
}
