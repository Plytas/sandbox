let debug = false;
let miners = [];
let belts = [];
let gridSize = 20;
let zoom = {
  min: 1,
  max: 5,
  step: 0.5,
  scale: 2.5,
};
let scrollStep = 5;
let mapSize = {
  x: 1000,
  y: 1000,
};
let canvasSize = {
  x: 500,
  y: 500,
};
let origin = {
  x: 0,
  y: 0,
};
let objectMap = Array.from(Array(mapSize.x / gridSize), (item, x) =>
  Array(mapSize.y / gridSize)
);

let inHand = null;
const Direction = {
  Up: 0,
  Down: Math.PI,
  Left: -Math.PI / 2,
  Right: Math.PI / 2,
};
let globalDirection = 0;

function setup() {
  // canvasSize.x = displayWidth
  // canvasSize.y = displayHeight
  canvas = createCanvas(canvasSize.x, canvasSize.y);
  canvas.mousePressed(click);
  canvas.mouseWheel(wheel);
}

function draw() {
  push();
  move();
  noStroke();

  background(50);
  fill(220);
  rect(0, 0, mapSize.x, mapSize.y);

  miners
    .slice()
    .reverse()
    .forEach(function (miner, index, list) {
      if (miner.isEmpty()) {
        miners.splice(list.length - 1 - index, 1);
        return;
      }

      miner.work();
      miner.draw();
    });

  belts
    .slice()
    .reverse()
    .forEach(function (belt, index, list) {
      if (belt.isEmpty()) {
        belts.splice(list.length - 1 - index, 1);
        return;
      }

      belt.work();
      belt.draw();
    });

  drawMouseSquare(mouseCell());

  pop();

  if (debug) {
    fill(255);
    text(miners.length, 20, 20);

    rectMode(CENTER);
    fill(0);
    rect(canvasSize.x / 2, canvasSize.y / 2, 3, 3);
    rectMode(CORNER);
  }
}

function drawMouseSquare(cell) {
  push();

  strokeWeight(1);
  stroke(51);

  if (outOfBounds() || !cellIsEmpty(cell)) {
    fill(200, 0, 0, 100);
  } else {
    fill(200, 200, 200, 200);
  }

  rect(cell.x * gridSize, cell.y * gridSize, gridSize, gridSize);

  if (inHand !== null) {
    inHand.position(cell);

    push();
    if (!cellIsEmpty(cell)) {
      translate(2, 2);
    }
    inHand.draw();
    pop();
  }

  if (debug) {
    fill(255);
    text(cell.x + ":" + cell.y, cell.x * gridSize, cell.y * gridSize);
  }

  pop();
}

function minX() {
  return (gridSize * zoom.scale) / 2 - canvasSize.x / 2;
}

function minY() {
  return (gridSize * zoom.scale) / 2 - canvasSize.y / 2;
}

function maxX() {
  return (
    mapSize.x * zoom.scale - (gridSize * zoom.scale) / 2 - canvasSize.x / 2
  );
}

function maxY() {
  return (
    mapSize.y * zoom.scale - (gridSize * zoom.scale) / 2 - canvasSize.y / 2
  );
}

function move() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    dump(origin);

    if (origin.x > minX()) {
      origin.x -= scrollStep;

      if (origin.x < minX()) {
        origin.x = minX();
      }
    }
  }

  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    dump(origin);

    if (origin.x < maxX()) {
      origin.x += scrollStep;
      if (origin.x > maxX()) {
        origin.x = maxX();
      }
    }
  }

  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    dump(origin);

    if (origin.y > minY()) {
      origin.y -= scrollStep;

      if (origin.y < minY()) {
        origin.y = minY();
      }
    }
  }

  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    dump(origin);

    if (origin.y < maxY()) {
      origin.y += scrollStep;
      if (origin.y > maxY()) {
        origin.y = maxY();
      }
    }
  }

  translate(-origin.x, -origin.y);
  scale(zoom.scale);
}

function mouseCell() {
  return {
    x: floor((mouseX + origin.x) / (gridSize * zoom.scale)),
    y: floor((mouseY + origin.y) / (gridSize * zoom.scale)),
  };
}

function outOfBounds() {
  return (
    mouseX + origin.x <= 0 ||
    mouseX + origin.x >= mapSize.x * zoom.scale ||
    mouseY + origin.y <= 0 ||
    mouseY + origin.y >= mapSize.y * zoom.scale
  );
}

function cellIsEmpty(cell) {
  return (
    objectMap[cell.x] === undefined ||
    objectMap[cell.x][cell.y] === undefined ||
    objectMap[cell.x][cell.y].isEmpty()
  );
}

function click() {
  if (outOfBounds()) {
    return;
  }

  cell = mouseCell();

  if (inHand !== null) {
    if (cellIsEmpty(cell)) {
      if (inHand.entity instanceof Belt) {
        createBelt();
      } else if (inHand.entity instanceof Miner) {
        createMiner();
      }
    }

    return;
  }

  if (!cellIsEmpty(cell)) {
    return deleteObjectInCell(cell);
  }
}

function createBelt() {
  cell = inHand.position();
  belt = new Belt(inHand.entity.direction);
  entity = new Cell(cell, belt);
  objectMap[cell.x][cell.y] = entity;

  translate(-origin.x, -origin.y);
  scale(zoom.scale);
  entity.draw();

  belts.push(entity);
}

function createMiner() {
  cell = inHand.position();
  miner = new Miner(inHand.entity.direction);
  entity = new Cell(cell, miner);
  objectMap[cell.x][cell.y] = entity;

  translate(-origin.x, -origin.y);
  scale(zoom.scale);
  entity.draw();
  miners.push(entity);
}

function deleteObjectInCell(cell) {
  objectMap[cell.x][cell.y].destroy();
}

function rotateObjectInCell(cell, clockwise = true) {
  objectMap[cell.x][cell.y].rotate(clockwise);
}

function wheel(event) {
  let step = event.deltaY < 0 ? zoom.step : -zoom.step;
  let newScale = max(zoom.min, min(zoom.max, zoom.scale + step));

  if (newScale === zoom.scale) {
    return;
  }

  origin.x = (event.x + origin.x) * (newScale / zoom.scale) - event.x;
  origin.y = (event.y + origin.y) * (newScale / zoom.scale) - event.y;

  zoom.scale = newScale;

  if (origin.x < minX()) {
    origin.x = minX();
  }

  if (origin.y < minY()) {
    origin.y = minY();
  }

  if (origin.x > maxX()) {
    origin.x = maxX();
  }

  if (origin.y > maxY()) {
    origin.y = maxY();
  }
}

function keyPressed(event) {
  dump(event);

  if (keyCode === 88) {
    //x
    debug = !debug;
  }

  if (keyCode === 82) {
    //r
    cell = mouseCell();

    if (inHand !== null) {
      inHand.rotate(!event.shiftKey);
      globalDirection = inHand.entity.direction;
      dump(globalDirection);
    } else if (!cellIsEmpty(cell)) {
      return rotateObjectInCell(cell, !event.shiftKey);
    }
  }

  if (keyCode === 66) {
    //b

    cell = mouseCell();

    dump(globalDirection);
    inHand = new Cell(cell, new Belt(globalDirection, true));
  }

  if (keyCode === 77) {
    //m

    cell = mouseCell();
    inHand = new Cell(cell, new Miner(globalDirection, true));
  }

  if (keyCode === 70) {
    //f

    fs = fullscreen();
    fullscreen(!fs);
  }

  if (keyCode === 81) {
    //q

    cell = mouseCell();

    if (inHand !== null) {
      inHand = null;
    } else if (!cellIsEmpty(cell)) {
      cellObject = objectMap[cell.x][cell.y];

      globalDirection = cellObject.entity.direction;
      inHand = new Cell(
        cell,
        new cellObject.entity.constructor(globalDirection, true)
      );
    }
  }
}

function dump(value) {
  if (debug) {
    console.log(value);
  }
}

function windowResized() {
  canvasSize.x = windowWidth;
  canvasSize.y = windowHeight;
  resizeCanvas(windowWidth, windowHeight);
}
