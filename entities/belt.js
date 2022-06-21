class Belt extends Entity {
    /**
     * @param {Direction} direction
     * @param {boolean} isGhost
     */
    constructor(direction = Direction.Up, isGhost = false) {
        super(direction, isGhost);
        this.item = null;
        this.progress = 0;
        this.reset = false;
    }

    /**
     * @param {p5.Vector} cell
     */
    draw(cell) {
        push();
        translate(cell.x * gridSize + gridSize / 2, cell.y * gridSize + gridSize / 2);

        rotate(this.direction.rotation());

        if (this.isGhost) {
            fill(40, 40, 40, 40);
        } else {
            fill(0);
        }
        triangle(-8, 8, 0, -8, 8, 8);

        if (!this.isGhost && this.item !== null) {
            fill(53, 77, 117);
            rectMode(CENTER);
            rect(0, gridSize / 2 - (gridSize * this.progress / 100), 4, 4);
        }

        pop();
    }

    /**
     * @param {Cell} cell
     */
    work(cell) {
        if (this.reset) {
            this.reset = false;
            this.item = null;
            this.progress = 0;
        }

        if (this.item === null) {
            this.progress = 0;
            return;
        }

        if (this.progress === 100) {
            let nextCell = cell.nextCell()
            let object = objectMap.getCell(nextCell)

            if (object !== null && object.acceptItem(this.direction, this.item)) {
                this.reset = true;
            }

            return;
        }

        this.progress += 1;
    }

    /**
     * @param {Direction} direction
     * @param {*} item
     * @returns {boolean}
     */
    acceptsItem(direction, item = null) {
        return true
    }

    /**
     * @param {Direction} direction
     * @return {boolean}
     */
    isAcceptingItems(direction) {
        return this.item === null;
    }

    /**
     * @param {Direction} direction
     * @param {*} item
     * @return {boolean}
     */
    acceptItem(direction, item) {
        if (this.item !== null) {
            return false;
        }

        this.item = item;

        return true;
    }
}
