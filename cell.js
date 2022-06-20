class Cell {
  constructor(cell, entity = null) {
    this.x = cell.x;
    this.y = cell.y;
    this.entity = entity;
  }

  position(cell = null) {
    if (cell === null) {
      return {
        x: this.x,
        y: this.y,
      };
    }

    this.x = cell.x;
    this.y = cell.y;
  }

  isEmpty() {
    return this.entity === null;
  }

  destroy() {
    this.entity = null;
  }

  draw() {
    if (!this.isEmpty()) {
      this.entity.draw(this.x, this.y);
    }
  }

  work() {
    if (!this.isEmpty()) {
      this.entity.work();
    }
  }

  rotate(clockwise = true) {
    if (!this.isEmpty()) {
      this.entity.rotate(clockwise);
    }
  }
}
