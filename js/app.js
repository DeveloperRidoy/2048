import Grid from "./Grid.js";
import Tile from "./Tile.js";
import calcSwipeDirection from "./utils/calcSwipeDirection.js";
import { DOWN, header, LEFT, resetBtn, RIGHT, UP } from "./utils/config.js";

// create grid instance
const grid = new Grid();

// show header section after grid is created
header.classList.remove("hidden");

// generate random two tiles on empty cells
grid.randomEmptyCell().tile = new Tile();
grid.randomEmptyCell().tile = new Tile();

// restart game on clicking restart button
resetBtn.addEventListener("click", () => {
  grid.reset();
});

// user input
setupInput();
function setupInput() {
  // handle keyboard input
  document.addEventListener("keydown", handleInput, { once: true });

  // handle swipe input
  document.addEventListener("touchstart", handleSwipeInput, { once: true });
}

function handleSwipeInput(e) {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;

  document.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      const swipeDir = calcSwipeDirection({
        touchStartX,
        touchEndX,
        touchStartY,
        touchEndY,
      });
      handleInput(e, swipeDir);
    },
    { once: true }
  );
}

/**
 * @param {KeyboardEvent | TouchEvent} e
 * @returns
 */
async function handleInput(e, swipeDir) {
  let direction;

  // keyboard event
  if (e.type === "keydown") {
    direction =
      e.key === "ArrowUp"
        ? UP
        : e.key === "ArrowDown"
        ? DOWN
        : e.key === "ArrowRight"
        ? RIGHT
        : e.key === "ArrowLeft" && LEFT;
  }

  // swipe event
  if (e.type === "touchend") direction = swipeDir;

  switch (direction) {
    case UP:
      if (!canMoveUp()) return setupInput();
      await moveUp();
      break;
    case DOWN:
      if (!canMoveDown()) return setupInput();
      await moveDown();
      break;
    case RIGHT:
      if (!canMoveRight()) return setupInput();
      await moveRight();
      break;
    case LEFT:
      if (!canMoveLeft()) return setupInput();
      await moveLeft();
      break;
    default:
      setupInput();
      return;
  }

  // merge tiles
  grid.cells.forEach((cell) => {
    const mergeSuccess = cell.mergeTiles();

    // update score on successful merge
    if (mergeSuccess) {
      grid.updateScore(grid.score + cell.tile.value);
    }
  });

  // add a new tile
  const newTile = new Tile();
  grid.randomEmptyCell().tile = newTile;

  // check for game over
  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      // reset game
      grid.reset();

      return alert(`game over. Your score is ${grid.score}`);
    });
  }

  setupInput();
}

function moveUp() {
  return slideTiles(grid.cellsByColumn);
}

function moveDown() {
  return slideTiles(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function moveLeft() {
  return slideTiles(grid.cellsByRow);
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

function slideTiles(cells) {
  return Promise.all(
    cells.flatMap((column) => {
      const promises = [];
      for (let i = 1; i < column.length; i++) {
        const cell = column[i];
        let lastMovableCell;

        if (cell.tile == null) continue;

        for (let j = i - 1; j >= 0; j--) {
          const targetCell = column[j];
          if (!targetCell.canAccept(cell.tile)) break;
          lastMovableCell = targetCell;
        }

        if (lastMovableCell == null) continue;

        promises.push(cell.tile.waitForTransition());

        if (lastMovableCell.tile != null) {
          lastMovableCell.mergeTile = cell.tile;
        } else {
          lastMovableCell.tile = cell.tile;
        }

        cell.tile = null;
      }

      return promises;
    })
  );
}

const canMoveUp = () => {
  return canMove(grid.cellsByColumn);
};

const canMoveDown = () => {
  return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
};

const canMoveLeft = () => {
  return canMove(grid.cellsByRow);
};

const canMoveRight = () => {
  return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
};

/**
 * @param {array} cells - takes array of columns or rows containing cells
 * @returns Boolean - returns boolean indicating whether canMove or not
 */
function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, i) => {
      if (i === 0) return false;
      if (cell.tile == null) return false;
      const moveToCell = group[i - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
}

