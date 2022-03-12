import Cell from "./Cell.js";
import Tile from "./Tile.js";
import { bestScoreElement, BEST_SCORE, CELL_GAP, CELL_SIZE, gameBoard, GRID_SIZE, scoreElement } from "./utils/config.js";


export default class Grid {
  #cells;
  #score = 0;
  #bestScore = BEST_SCORE;
  constructor () {
    gameBoard.style.setProperty("--grid-size", GRID_SIZE);
    gameBoard.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
    gameBoard.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);
    bestScoreElement.innerText = this.#bestScore;

    this.#cells = createCellElements().map((element, i) => {
      return new Cell(element, i % GRID_SIZE, Math.floor(i / GRID_SIZE));
    });
  }

  get score () {
    return this.#score
  }

  updateScore (value) {
    // current score
    this.#score = value;
    scoreElement.innerText = this.#score;
    
    // best score 
    if (this.#score >= this.#bestScore) {
      this.#bestScore = this.#score
      bestScoreElement.innerText = this.#score
      localStorage.setItem('BEST_SCORE', this.#score);
    }

  }

  get cells() {
    return this.#cells;
  }

  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, []);
  }

  get cellsByRow() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;
      return cellGrid;
    }, []);
  }

  get #emptyCells() {
    return this.#cells.filter((cell) => cell.tile == null);
  }

  randomEmptyCell = () => {
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
    return this.#emptyCells[randomIndex];
  };

  reset () {
    // remove all tiles from cell and the DOM
    this.#cells.forEach((cell) => {
      if (cell.tile) {
        cell.tile.removeFromDom();
        cell.tile = null;
      }
      if (cell.mergeTile) {
        cell.mergeTile.removeFromDom();
        cell.mergeTile = null;
      }
    });
    // generate random two new tiles
    this.randomEmptyCell().tile = new Tile();
    this.randomEmptyCell().tile = new Tile();

    // reset score 
    this.updateScore(0)
  }
}


const createCellElements = () => {
  const cells = [];
  for (let i = 1; i <= GRID_SIZE * GRID_SIZE; i++) {
    const cellElement = document.createElement("div");
    cellElement.setAttribute("class", "cell");
    gameBoard.append(cellElement);
    cells.push(cellElement);
  }

  return cells;
};