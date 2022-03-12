import Grid from "./Grid.js";
import Tile from "./Tile.js";

const grid = new Grid();

// generate random two tiles on empty cells
grid.randomEmptyCell().tile = new Tile();
grid.randomEmptyCell().tile = new Tile();

// user input 
setupInput();
function setupInput () {
  document.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput (e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) return setupInput();
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) return setupInput();
      await moveDown();
      break;
    case "ArrowRight":
      if (!canMoveRight()) return setupInput();
      await moveRight();
      break;
    case "ArrowLeft":
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
      grid.updateScore(cell.tile.value);
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
  
      // generate random two new tiles
      grid.randomEmptyCell().tile = new Tile();
      grid.randomEmptyCell().tile = new Tile();
      return alert('game over');
    })
  }

  setupInput();
}

function moveUp () {
  return slideTiles(grid.cellsByColumn);
}

function moveDown () {
  return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()));
}

function moveLeft () {
    return slideTiles(grid.cellsByRow);
}

function moveRight () {
    return slideTiles(
      grid.cellsByRow.map((row) => [...row].reverse())
    );
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
}

const canMoveDown = () => {
  return canMove(grid.cellsByColumn.map(column => [...column].reverse()));
};

const canMoveLeft = () => {
  return canMove(grid.cellsByRow)
};

const canMoveRight = () => {
  return canMove(grid.cellsByRow.map(row => [...row].reverse()));
};


/**
 * @param {array} cells - takes array of columns or rows containing cells
 * @returns Boolean - returns boolean indicating whether canMove or not
 */
function canMove (cells) {
  return cells.some((group) => {
      return group.some((cell, i) => {
        if (i === 0) return false;
        if (cell.tile == null) return false;
        const moveToCell = group[i - 1];
        return moveToCell.canAccept(cell.tile);
      });
    });
}


