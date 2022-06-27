class Belt extends Entity {
    /**
     * @param {p5.Vector} originCell
     * @param {Direction} direction
     * @param {boolean} isGhost
     */
    constructor(originCell, direction = Direction.Up, isGhost = false) {
        super(originCell, direction, isGhost);
        /** @type {Item|null} */
        this.item = null;
        this.progress = 0;
        this.reset = false;
        this.fromDirection = direction.opposite();
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

        rectMode(CENTER);
        rect(0, 0, gridSize, gridSize);
        drawingContext.clip();


        push();
        translate(0, 25);

        if (this.isGhost) {
            fill(255, 225, 25, 40);
        } else {
            fill(255, 225, 25);
        }


        // translate(0, -((beltAnimationProgress - gridSize) / 2))
        translate(0, -(beltAnimationProgress * gridSize / 60));
        // rect(0, 0, gridSize / 2, gridSize / 10);
        triangle((-gridSize / 8), (gridSize / 8), 0, (-gridSize / 8), (gridSize / 8), (gridSize / 8));

        // translate(0, -gridSize / 2);
        // // rect(0, 0, gridSize / 2, gridSize / 10);
        // triangle((-gridSize / 8), (gridSize / 8), 0, (-gridSize / 8), (gridSize / 8), (gridSize / 8));

        translate(0, -gridSize);
        // rect(0, 0, gridSize / 2, gridSize / 10);
        triangle((-gridSize / 8), (gridSize / 8), 0, (-gridSize / 8), (gridSize / 8), (gridSize / 8));

        translate(0, 2 * gridSize);
        // rect(0, 0, gridSize / 2, gridSize / 10);
        triangle((-gridSize / 8), (gridSize / 8), 0, (-gridSize / 8), (gridSize / 8), (gridSize / 8));

        // translate(0, -gridSize / 2);
        // // rect(0, 0, gridSize / 2, gridSize / 10);
        // triangle((-gridSize / 8), (gridSize / 8), 0, (-gridSize / 8), (gridSize / 8), (gridSize / 8));


        // if (beltAnimationProgress <= 50) {
        //     translate(0, -(50 + (beltAnimationProgress - gridSize) / 2))
        // } else {
        //     translate(0, -(-50 + (beltAnimationProgress - gridSize) / 2))
        // }
        //
        // rect(0, 0, gridSize / 2, gridSize / 10);
        // triangle((-gridSize / 8), (gridSize / 8), 0, (-gridSize / 8), (gridSize / 8), (gridSize / 8));

        pop()

        // if (!this.isGhost && this.item !== null) {
        //     // fill(53, 77, 117);
        //     // rectMode(CENTER);
        //
        //     if (this.progress < 50 + (this.item.width / 2) / (gridSize / 100)) {
        //         if (this.fromDirection.value === Direction.Left.value) {
        //             this.item.draw(new p5.Vector(-(gridSize / 2 - (gridSize * this.progress / 100)) - this.item.width / 2, 0));
        //             // rect(-(gridSize / 2 - (gridSize * this.progress / 100)) - 2, 0, 4, 4);
        //         } else if (this.fromDirection.value === Direction.Right.value) {
        //             this.item.draw(new p5.Vector((gridSize / 2 - (gridSize * this.progress / 100)) + this.item.width / 2, 0));
        //             // rect((gridSize / 2 - (gridSize * this.progress / 100)) + 2, 0, 4, 4);
        //         } else {
        //             this.item.draw(new p5.Vector(0, gridSize / 2 - (gridSize * this.progress / 100) + this.item.height / 2));
        //             // rect(0, gridSize / 2 - (gridSize * this.progress / 100) + 2, 4, 4);
        //         }
        //     } else {
        //         this.item.draw(new p5.Vector(0, gridSize / 2 - (gridSize * this.progress / 100) + this.item.height / 2));
        //         // rect(0, gridSize / 2 - (gridSize * this.progress / 100) + 2, 4, 4);
        //     }
        // }

        pop();
    }

    /**
     * @param {p5.Vector} cell
     */
    drawItem(cell) {
        push();
        translate(cell.x * gridSize + gridSize / 2, cell.y * gridSize + gridSize / 2);

        if (!this.isGhost && this.item !== null) {
            // fill(53, 77, 117);
            // rectMode(CENTER);

            if (this.progress < 30 + (this.item.width / 2) / (gridSize / 60)) {
                if (this.fromDirection.value === Direction.Left.value) {
                    rotate(this.direction.rotation());
                    translate(-(gridSize / 2 - (gridSize * this.progress / 60)) - this.item.width / 2, 0)
                    rotate(-this.direction.rotation());

                    this.item.draw(new p5.Vector(0, 0));
                    // rect(-(gridSize / 2 - (gridSize * this.progress / 60)) - 2, 0, 4, 4);
                } else if (this.fromDirection.value === Direction.Right.value) {
                    rotate(this.direction.rotation());
                    translate((gridSize / 2 - (gridSize * this.progress / 60)) + this.item.width / 2, 0)
                    rotate(-this.direction.rotation());

                    this.item.draw(new p5.Vector(0, 0));
                    // rect((gridSize / 2 - (gridSize * this.progress / 60)) + 2, 0, 4, 4);
                } else {
                    rotate(this.direction.rotation());
                    translate(0, gridSize / 2 - (gridSize * this.progress / 60) + this.item.height / 2)
                    rotate(-this.direction.rotation());
                    this.item.draw(new p5.Vector(0, 0));
                    // rect(0, gridSize / 2 - (gridSize * this.progress / 60) + 2, 4, 4);
                }
            } else {
                rotate(this.direction.rotation());
                translate(0, gridSize / 2 - (gridSize * this.progress / 60) + this.item.height / 2)
                rotate(-this.direction.rotation());
                this.item.draw(new p5.Vector(0, 0));
                // rect(0, gridSize / 2 - (gridSize * this.progress / 60) + 2, 4, 4);
            }
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

        if (this.progress === 60) {
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
     * @param {Item} item
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
        if (direction.opposite().value === this.direction.value) {
            return false;
        }

        return this.item === null;
    }

    /**
     * @param {Direction} direction
     * @param {Item} item
     * @return {boolean}
     */
    acceptItem(direction, item) {
        if (this.item !== null) {
            return false;
        }

        this.item = item;
        this.fromDirection = direction.opposite().inRelationToDirection(this.direction);

        return true;
    }
}
