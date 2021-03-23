document.addEventListener('DOMContentLoaded', () => {
  const div = document.querySelector('div');
  const p = document.createElement('p');
  p.innerHTML = '';
  div.appendChild(p);
});

const boardBackground = '#fff';
const snakeColor = '#FFC0CB';
const snakeBorder = '#fff';
const foodColor = '#FFC0CB';
const foodBorder = '#fff';

let snake = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 },
];

let score = 0;

// True if changing direction
let changingDirection = false;

let foodX;
let foodY;

// Horizontal velocity
let dx = 10;
// Vertical velocity
let dy = 0;

// Get the canvas element
const snakeBoard = document.getElementById('game_board');

// Return a two dimensional drawing context
const snakeBoardCTX = snakeBoard.getContext('2d');

// main function called repeatedly to keep the game running
function randomFood(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function generateFood() {
  // Generate a random number the food x-coordinate
  foodX = randomFood(0, snakeBoard.width - 10);
  // Generate a random number for the food y-coordinate
  foodY = randomFood(0, snakeBoard.height - 10);
  // if the new food location is where the snake currently is, generate a new food location
  snake.forEach((part) => {
    const hasEaten = part.x === foodX && part.y === foodY;
    if (hasEaten) generateFood();
  });
}

// draw a border around the canvas
function clearBoard() {
  //  Select the colour to fill the drawing
  snakeBoardCTX.fillStyle = boardBackground;
  // Draw a "filled" rectangle to cover the entire canvas
  snakeBoardCTX.fillRect(0, 0, snakeBoard.width, snakeBoard.height);
  // Draw a "border" around the entire canvas
  snakeBoardCTX.strokeRect(0, 0, snakeBoard.width, snakeBoard.height);
}

// Draw one snake part
function drawSnakePart(snakePart) {
  // Set the colour of the snake part
  snakeBoardCTX.fillStyle = snakeColor;
  // Set the border colour of the snake part
  snakeBoardCTX.strokeStyle = snakeBorder;
  // Draw a "filled" rectangle to represent the snake part at the coordinates
  // the part is located
  snakeBoardCTX.fillRect(snakePart.x, snakePart.y, 10, 10);
  // Draw a border around the snake part
  snakeBoardCTX.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

// Draw the snake on the canvas
function drawSnake() {
  // Draw each part
  snake.forEach(drawSnakePart);
}

function drawFood() {
  snakeBoardCTX.fillStyle = foodColor;
  snakeBoardCTX.strokeStyle = foodBorder;
  snakeBoardCTX.fillRect(foodX, foodY, 10, 10);
  snakeBoardCTX.strokeRect(foodX, foodY, 10, 10);
}

function hasGameEnded() {
  // eslint-disable-next-line no-plusplus
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeBoard.width - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeBoard.height - 10;
  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  // Prevent the snake from reversing
  if (changingDirection) return;
  changingDirection = true;
  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;
  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

function moveSnake() {
  // Create the new Snake's head
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  // Add the new head to the beginning of snake body
  snake.unshift(head);
  const hasEatenFood = snake[0].x === foodX && snake[0].y === foodY;
  if (hasEatenFood) {
    // Increase score
    score += 10;
    // Display score on screen
    document.querySelector('#game_score > span').innerHTML = score;
    // Generate new food location
    generateFood();
  } else {
    // Remove the last part of snake body
    snake.pop();
  }
}

document.addEventListener('keydown', changeDirection);

function main(speed) {
  const gameSpeed = 1000 / speed;
  if (speed) {
    document.querySelector('#game_speed_title > span').innerHTML = speed;
  }
  if (hasGameEnded()) {
    // restart game
    dx = 10;
    dy = 0;
    score = 0;
    snake = [
      { x: 200, y: 200 },
      { x: 190, y: 200 },
      { x: 180, y: 200 },
      { x: 170, y: 200 },
      { x: 160, y: 200 },
    ];
    document.querySelector('#game_score > span').innerHTML = score.toString();
    // Generate new food location
    generateFood();
    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      main();
    }, gameSpeed);
    return false;
  }
  changingDirection = false;
  setTimeout(() => {
    clearBoard();
    drawFood();
    moveSnake();
    drawSnake();
    // Repeat
    main(document.getElementById('game_speed_value_input').value);
  }, gameSpeed);
  return true;
}

// Start game
main(document.getElementById('game_speed_value_input').value);

generateFood();
