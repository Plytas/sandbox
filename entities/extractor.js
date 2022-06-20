class Extractor extends Entity {
  constructor(direction = Direction.Up, isGhost = false) {
    super(direction, isGhost);
    this.speed = 0.5;
    this.craftingTime = 120;
    this.count = 0;
    this.steps = 0;
  }

  produce() {
    this.count++;
    this.steps = 0;
  }

  work() {
    if (this.steps >= this.craftingTime) {
      this.produce();
    }

    this.steps += this.speed;
  }

  draw(x, y) {
    if (this.isGhost) {
      fill(40, 40, 40, 40);
    } else {
      fill(0);
    }

    rect(x * gridSize + 2, y * gridSize + 2, gridSize - 4, gridSize - 4);
    fill(255);
    rect(
      x * gridSize + 2,
      y * gridSize + 2,
      ((gridSize - 4) * this.steps) / this.craftingTime,
      2
    );
  }
}
