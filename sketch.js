let canvasX = 900;
let canvasY = 700;

let colors = [0, 1, 2];

// BALL dimensions/variables
let ballR = 25;
let ballX = -ballR;
let ballY;
let speeds = [-4, 4];
let ballSpeedX;
let ballSpeedY;

let ballColor = 0;

let paddleWidth = 20;
let paddleHeight = 100;

let paddleColor = 0;

// constant left and right positions of paddle and variables for top and bottom positions
let paddleLeft = 100;
let paddleRight = paddleLeft + paddleWidth;
let paddleBottom;
let paddleTop;
let lastHit = -1000;

// game variables
let score = 0;
let scoreMark = 10;
let lifeCount = 3 + 1; // 3 (+ 1 to start game)
let reset = false;

function paddleCollisionX()
{
  let collision = (ballY >= paddleTop * .90) // ball below top
                  && (ballY <= paddleBottom * 1.1); // and above bottom

  collision = collision && (ballX - ballR <= paddleRight)
                        && (ballX - ballR >= paddleRight + ballSpeedX - 5); // check right side

  if(collision)
    lastHit = millis();

  return collision;
}

function wallCollisionX()
{
  let collision =  (ballX >= (canvasX - ballR + 1));

  return collision;

}

function wallCollisionY()
{
  let collision = ((ballY <= 0) || (ballY >= (canvasY - ballR + 1)));

  return collision;

}

function drawBall()
{
  if(ballColor == 0)
    fill(255, 0, 0); // blue
  else if(ballColor == 1)
    fill(0, 255, 0); // green
  else
    fill(0, 0, 255); // red

  ellipse(ballX, ballY, ballR * 2, ballR * 2); // createBall
}

function drawPaddle()
{
  if(paddleColor == 0)
    fill(255, 0, 0); // blue
  else if(paddleColor == 1)
    fill(0, 255, 0); // green
  else if(paddleColor == 2)
    fill(0, 0, 255); // red

  // draw paddle in middle of mouse, limited in the range of (100..250)
  if(mouseX >= 100 && mouseX <= 250)
  {
    paddleLeft = mouseX - paddleWidth / 2;
  }
  else if(mouseX > 250)
  {
    paddleLeft = 250 - paddleWidth / 2;
  }
  else if(mouseX < 100)
  {
    paddleLeft = 100 - paddleWidth / 2;
  }

  paddleRight = paddleLeft + paddleWidth;

  rect(paddleLeft, mouseY - (paddleHeight / 2), paddleWidth, paddleHeight);
  paddleBottom = mouseY + (paddleHeight / 2);
  paddleTop = mouseY - (paddleHeight / 2);
}

function keyPressed()
{
  if(keyCode == 32)
  {
    paddleColor = (paddleColor + 1) % colors.length;
  }
}

function printInfo()
{
  let fontSize = 25;
  textSize(fontSize);

  let infoString = "Lives: " + lifeCount + "       Score: " + int(score);
  let infoX = (canvasX / 2) - (infoString.length * fontSize / 4);

  strokeWeight(1);
  stroke(210, 210, 210); // border black

  fill(255, 0, 0);
  text("Lives: " + lifeCount, canvasX / 3, 25);

  fill(50, 255, 50);
  text("Score: " + int(score), canvasX / 2, 25);

  fill(0, 0, 255);
  text("Speed: " + speeds[1], canvasX / 1.5, 25);

}

function checkLose()
{
  return (ballX <= -ballR);
}

function resetBall()
{
  ballSpeedX = random(speeds);
  ballSpeedY = random(speeds);

  ballX = canvasX / 2;
  ballY = canvasY / 2;
}

function mousePressed()
{
  if(lifeCount >= 1)
  {
    reset = false;
    loop();
  }
}

function promptClick()
{
  let fontSize = 21;
  textSize(fontSize);

  let textInfo = "Press mouse button to continue...";
  fill(0, 0, 0);
  text(textInfo, (canvasX / 2) - textInfo.length * fontSize / 4, canvasY / 2 - ballR * fontSize / 4);
}

function setup()
{
  createCanvas(canvasX, canvasY);

  noCursor();
}

function gameOver()
{
  let fontSize = 42;
  textSize(fontSize);

  let textInfo = "GAME OVER";
  fill(0, 0, 0);
  text(textInfo, (canvasX / 2) - textInfo.length * fontSize / 4, canvasY / 2);
}

function draw()
{
  if(checkLose())
  {
    reset = true;

    lifeCount--;

    if(lifeCount >= 1)
    {
      promptClick();
      resetBall();
    }
    else
    {
      gameOver();
    }

    noLoop();
  }

  if(!reset)
  {
    score += .03;

    if(int(score) - scoreMark == 0)
    {
      scoreMark *= 2;

      for(let i = 0; i < speeds.length; i++)
      {
        if(speeds[i] < 0)
          speeds[i] -= 1;
        else if(speeds[i] > 0)
          speeds[i] += 1;
      }

      if(ballSpeedX < 0)
        ballSpeedX = speeds[0];
      else if(ballSpeedX > 0)
        ballSpeedY = speeds[1];

      if(ballSpeedY < 0)
        ballSpeedY = speeds[0];
      else if(ballSpeedY > 0)
        ballSpeedY = speeds[1]
    }

    background(235, 235, 235);

    //print paddle borders

    strokeWeight(1);
    stroke(0, 0, 0); // border black
    line(100, 0, 100, canvasY);
    line(250, 0, 250, canvasY);

    strokeWeight(0);
    stroke(0, 0, 0); // border black
    printInfo();

    strokeWeight(1);

    // paddle rectangle
    drawPaddle();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // bouncing ball
    drawBall();

    // check for a collision
    if(wallCollisionX() || ((millis() - lastHit) >= 1000) && paddleCollisionX() && ballColor == paddleColor)
    {
      ballSpeedX = -ballSpeedX;

      ballColor = random(colors);
    }
    if(wallCollisionY())
    {
      ballSpeedY = -ballSpeedY;

      ballColor = random(colors);
    }
  }
  else if(lifeCount >= 1)
  {
    promptClick();
  }
}
