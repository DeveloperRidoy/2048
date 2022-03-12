import { DOWN, LEFT, RIGHT, UP } from "./config.js";

export default function calcSwipeDirection({
  touchStartX,
  touchEndX,
  touchStartY,
  touchEndY,
}) {
  
  return Math.abs(touchEndX - touchStartX) > Math.abs(touchEndY - touchStartY)
    ? touchEndX > touchStartX
      ? RIGHT
      : LEFT
    : touchEndY > touchStartY
    ? DOWN
    : UP;
}