let ball;
let paddle;
let bricks;
const brickRows = 4;
const brickCols = 5;
const brickWidth = 70;
const brickHeight = 20;
const brickPadding = 8;
let score = 0;
let gameEnded = false;

function setup() {
  createCanvas(400, 400);

  ball = {
    x: width / 2,
    y: height / 2,
    radius: 10,
    dx: 3,
    dy: -3,
  };

  paddle = {
    x: width / 2 - 50,
    y: height - 50,
    width: 100,
    height: 10,
  };

  bricks = createBricks();
}

function draw() {
  background(220);

  // Move the paddle based on user input
  if (keyIsDown(LEFT_ARROW) && paddle.x > 0) {
    paddle.x -= 5;
  } else if (keyIsDown(RIGHT_ARROW) && paddle.x + paddle.width < width) {
    paddle.x += 5;
  }

  // Update the ball's position
  if (!gameEnded) {
    ball.x += ball.dx;
    ball.y += ball.dy;
  }

  // Check collision with paddle
  if (
    ball.y + ball.radius >= paddle.y && 
    ball.y - ball.radius <= paddle.y + paddle.height && 
    ball.x + ball.radius >= paddle.x && 
    ball.x - ball.radius <= paddle.x + paddle.width && 
    ball.dy > 0 
  ) {
    
    ball.dy *= -1;
  }

  // Check collision with bricks
  for (let row = 0; row < bricks.length; row++) {
    for (let col = 0; col < bricks[row].length; col++) {
      const brick = bricks[row][col];
      if (
        brick && // Check if the brick exists
        ball.y - ball.radius <= brick.y + brickHeight && 
        ball.y + ball.radius >= brick.y && 
        ball.x + ball.radius >= brick.x && 
        ball.x - ball.radius <= brick.x + brickWidth 
      ) {
        // Remove brick
        bricks[row][col] = null;
        // Change ball's direction when collision occurs
        ball.dy *= -1;
        // Increase the score
        score++;
        // Increase ball speed on collision with bricks
        ball.dx += 0.1 * Math.sign(ball.dx);
        ball.dy += 0.1 * Math.sign(ball.dy);
      }
    }
  }

  //Checking for boundary collisions
  if (ball.x >= width - ball.radius || ball.x <= ball.radius) {
    ball.dx = -ball.dx;
  }
  if (ball.y <= ball.radius) {
    ball.dy = -ball.dy;
  }

  // Draw bricks
  for (let row = 0; row < bricks.length; row++) {
    for (let col = 0; col < bricks[row].length; col++) {
      const brick = bricks[row][col];
      if (brick) {
        rect(brick.x, brick.y, brickWidth, brickHeight);
      }
    }
  }

  // Draw the paddle
  rect(paddle.x, paddle.y, paddle.width, paddle.height);

  // Draw the ball
  ellipse(ball.x, ball.y, ball.radius * 2);

  // Display the score
  fill(0);
  textSize(20);
  textAlign(CENTER); // Set the text alignment to center
  text(`Score: ${score}`, width / 2, 30);

  // Check if all bricks are destroyed
  let bricksRemaining = 0;
  for (let row = 0; row < bricks.length; row++) {
    for (let col = 0; col < bricks[row].length; col++) {
      if (bricks[row][col]) {
        bricksRemaining++;
      }
    }
  }
  if (bricksRemaining === 0) {
    gameEnded = true;
    fill(0);
    textSize(30);
    text("You Win!", width / 2 - 60, height / 2);
    drawRestartButton();
    noLoop();
  }

  // Check if the ball goes out of bounds
  if (ball.y + ball.radius > height) {
    gameEnded = true;
    fill(0);
    textSize(30);
    text("Game Over!", width / 2 - 80, height / 2);
    drawRestartButton();
    noLoop();
  }
}

function drawRestartButton() {
  const buttonX = width / 2 - 50;
  const buttonY = height / 2 + 30;
  const buttonWidth = 100;
  const buttonHeight = 40;

  fill(100);
  rect(buttonX, buttonY, buttonWidth, buttonHeight);

  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Restart", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);

  if (
    mouseX >= buttonX &&
    mouseX <= buttonX + buttonWidth &&
    mouseY >= buttonY &&
    mouseY <= buttonY + buttonHeight
  ) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

function mousePressed() {
  if (gameEnded) {
    const buttonX = width / 2 - 50;
    const buttonY = height / 2 + 30;
    const buttonWidth = 100;
    const buttonHeight = 40;

    if (
      mouseX >= buttonX &&
      mouseX <= buttonX + buttonWidth &&
      mouseY >= buttonY &&
      mouseY <= buttonY + buttonHeight
    ) {
      restartGame();
    }
  }
}

function restartGame() {
  score = 0;
  gameEnded = false;
  ball.x = width / 2;
  ball.y = height / 2;
  ball.dx = 3;
  ball.dy = -3;
  bricks = createBricks();
  loop();
}

function createBricks() {
  const bricks = [];
  const xOffset = (width - (brickWidth + brickPadding) * brickCols) / 2;
  const yOffset = 50;

  for (let row = 0; row < brickRows; row++) {
    bricks[row] = [];
    for (let col = 0; col < brickCols; col++) {
      const x = xOffset + col * (brickWidth + brickPadding);
      const y = yOffset + row * (brickHeight + brickPadding);
      bricks[row][col] = { x, y };
    }
  }

  return bricks;
}