// dom elements
const gameBoard = document.querySelector("#game-board");
const scoreElement = document.querySelector("#score-count");
const bestScoreElement = document.querySelector("#best-score-count");
const resetBtn = document.querySelector('#restart')
const header = document.querySelector('header');

// variables 
const GRID_SIZE = 4;
const CELL_SIZE = 70 / GRID_SIZE;
const CELL_GAP = 2;
const BEST_SCORE = Number(localStorage.getItem("BEST_SCORE")) ?? 0;
const UP = 'UP'; 
const DOWN = 'DOWN'; 
const LEFT = 'LEFT'; 
const RIGHT = 'RIGHT';

export { gameBoard, scoreElement, bestScoreElement, GRID_SIZE, CELL_SIZE, CELL_GAP, BEST_SCORE, UP, DOWN, LEFT, RIGHT, resetBtn, header };