class Belt extends Entity {
    /**
     * @param {Direction} direction
     * @param {boolean} isGhost
     */
    constructor(direction = Direction.Up, isGhost = false) {
        super(direction, isGhost);
        this.item = null;
        this.progress = 0;
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
        pop();

        if (!this.isGhost) {
            fill(255);
            rect(cell.x * gridSize + 2, cell.y * gridSize + 2, ((gridSize - 4) * this.progress) / 100, 2);
        }
    }

    /**
     * @param {Cell} cell
     */
    work(cell) {
        if (this.item === null) {
            this.progress = 0;
            return;
        }

        if (this.progress === 100) {
            let nextCell = cell.nextCell()
            let object = objectMap.getCell(nextCell)

            if (object !== null && object.acceptItem(this.direction, this.item)) {
                this.item = null;
                this.progress = 0;
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
