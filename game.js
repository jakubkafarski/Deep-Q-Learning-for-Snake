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
let changing_direction = false;

let food_x;
let food_y;

// Horizontal velocity
let dx = 10;
// Vertical velocity
let dy = 0;

// Get the canvas element
const snakeBoard = document.getElementById('game_board');

// Return a two dimensional drawing context
const snakeBoard_ctx = snakeBoard.getContext('2d');

// Start game
main({ speed: document.getElementById('game_speed_value_input').value });

gen_food();

document.addEventListener('keydown', change_direction);

// main function called repeatedly to keep the game running
function main({ speed = 1 }) {
  if (has_game_ended()) {
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
    document.querySelector('#game_score > span').innerHTML = score;
    // Generate new food location
    gen_food();
    setTimeout(() => {
      clear_board();
      drawFood();
      move_snake();
      drawSnake();
      main();
    }, 100 / speed);
  }

  changing_direction = false;
  setTimeout(() => {
    clear_board();
    drawFood();
    move_snake();
    drawSnake();
    // Repeat
    main({ speed: document.getElementById('game_speed_value_input').value });
  }, 100 / speed);
}

// draw a border around the canvas
function clear_board() {
  //  Select the colour to fill the drawing
  snakeBoard_ctx.fillStyle = boardBackground;
  // Draw a "filled" rectangle to cover the entire canvas
  snakeBoard_ctx.fillRect(0, 0, snakeBoard.width, snakeBoard.height);
  // Draw a "border" around the entire canvas
  snakeBoard_ctx.strokeRect(0, 0, snakeBoard.width, snakeBoard.height);
}

// Draw the snake on the canvas
function drawSnake() {
  // Draw each part
  snake.forEach(drawSnakePart);
}

function drawFood() {
  snakeBoard_ctx.fillStyle = foodColor;
  snakeBoard_ctx.strokeStyle = foodBorder;
  snakeBoard_ctx.fillRect(food_x, food_y, 10, 10);
  snakeBoard_ctx.strokeRect(food_x, food_y, 10, 10);
}

// Draw one snake part
function drawSnakePart(snakePart) {
  // Set the colour of the snake part
  snakeBoard_ctx.fillStyle = snakeColor;
  // Set the border colour of the snake part
  snakeBoard_ctx.strokeStyle = snakeBorder;
  // Draw a "filled" rectangle to represent the snake part at the coordinates
  // the part is located
  snakeBoard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  // Draw a border around the snake part
  snakeBoard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function has_game_ended() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeBoard.width - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeBoard.height - 10;
  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function random_food(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function gen_food() {
  // Generate a random number the food x-coordinate
  food_x = random_food(0, snakeBoard.width);
  // Generate a random number for the food y-coordinate
  food_y = random_food(0, snakeBoard.height);
  // if the new food location is where the snake currently is, generate a new food location
  snake.forEach((part) => {
    const has_eaten = part.x == food_x && part.y == food_y;
    if (has_eaten) gen_food();
  });
}

function change_direction(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  // Prevent the snake from reversing

  if (changing_direction) return;
  changing_direction = true;
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

function move_snake() {
  // Create the new Snake's head
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  // Add the new head to the beginning of snake body
  snake.unshift(head);
  const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
  if (has_eaten_food) {
    // Increase score
    score += 10;
    // Display score on screen
    document.querySelector('#game_score > span').innerHTML = score;
    // Generate new food location
    gen_food();
  } else {
    // Remove the last part of snake body
    snake.pop();
  }
}
