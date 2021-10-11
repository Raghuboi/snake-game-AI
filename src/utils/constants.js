const SCALE = (window.innerWidth<800) ? 20 : 40;
const CANVAS_SIZE = (window.innerWidth<800) ? [window.innerWidth*0.8, window.innerWidth*0.8+SCALE] : [600, 600+SCALE];
const SNAKE_START = [
  [8, 7],
  [8, 8]
];
const APPLE_START = [8, 3];
const SPEED = 200;
const DIRECTIONS = {
  38: [0, -1], // up
  40: [0, 1], // down
  37: [-1, 0], // left
  39: [1, 0] // right
};

export {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS
};
