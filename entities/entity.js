class Entity {
  constructor(direction = Direction.Up, isGhost = false) {
    this.direction = direction;
    this.isGhost = isGhost;
  }

  rotate(clockwise = true) {
    this.direction += 2 * Math.PI + (clockwise ? Math.PI / 2 : -Math.PI / 2);

    while (this.direction >= 2 * Math.PI) {
      this.direction -= 2 * Math.PI;
    }
  }
}
