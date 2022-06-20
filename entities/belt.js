class Belt extends Entity {
  draw(x, y) {
    push();
    translate(x * gridSize + gridSize / 2, y * gridSize + gridSize / 2);

    rotate(this.direction);

    if (this.isGhost) {
      fill(40, 40, 40, 40);
    } else {
      fill(0);
    }
    triangle(-8, 8, 0, -8, 8, 8);

    pop();
  }

  work() {}
}
