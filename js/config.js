// dom elements
const gameBoard = document.querySelector("#game-board");
const scoreElement = document.querySelector(".score-count");
const bestScoreElement = document.querySelector(".best-score-count");

// variables 
const GRID_SIZE = 4;
const CELL_SIZE = 70 / GRID_SIZE;
const CELL_GAP = 2;
const BEST_SCORE = Number(localStorage.getItem("BEST_SCORE")) ?? 0;

export { gameBoard, scoreElement, bestScoreElement, GRID_SIZE, CELL_SIZE, CELL_GAP, BEST_SCORE };