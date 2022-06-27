class Mouse {
    draw() {
        push();
        strokeWeight(1);
        stroke(51);

        let size = this.cellSize()
        this.cellFill(this.cell, size)

        if (inHand !== null) {
            inHand.position(this.cell);

            push();
            if (!objectMap.cellIsEmpty(this.cell)) {
                translate(2, 2);
            }
            inHand.draw();
            pop();
        }

        rect(this.cell.x * gridSize, this.cell.y * gridSize, size.x * gridSize, size.y * gridSize);

        if (debug) {
            fill(255);
            text(this.cell.x + ":" + this.cell.y, this.cell.x * gridSize, this.cell.y * gridSize);
        }

        pop();
    }

    precalculateCell() {
        /** @type {p5.Vector} */
        this.cell = new p5.Vector(
            Math.floor((mouseX + origin.x) / (gridSize * zoom.scale)),
            Math.floor((mouseY + origin.y) / (gridSize * zoom.scale)),
        );
    }

    /**
     * @return {p5.Vector}
     */
    cellSize() {
        if (inHand !== null) {
            return inHand.entity.size;
        }

        return new p5.Vector(1, 1);
    }

    /**
     * @param {p5.Vector} cell
     * @param {p5.Vector} size
     * @return {void}
     */
    cellFill(cell, size) {
        fill(200, 200, 200, 200);

        iterateOverCells(cell, size, (callbackCell) => {
            if (cellIsOutOfBounds(callbackCell) || !objectMap.cellIsEmpty(callbackCell)) {
                return fill(200, 0, 0, 100);
            }
        });
    }
}
