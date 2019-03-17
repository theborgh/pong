let canvas;
let canvasContext;
let ballX = 330;
let ballY = 250;
let ballSpeedX = 3;
let ballSpeedY = 4;
const PADDLE_SIDE_PADDING = 30;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 120;
const BALL_RADIUS = 10;
let p1score = 0;
let p2score = 0;
let paddle1Y = 250;
let paddle2Y = 250;
const P2_SPEED = 3;
const SCORE_TO_WIN = 15;

window.onload = function() {
   const fps = 60;
   canvas = document.getElementById('gameCanvas');
   canvasContext = canvas.getContext('2d');

   setInterval(() => {
      move();
      draw();
   }, 1000/fps);
    
   canvas.addEventListener('mousemove', 
      function(e) {
         let mousePos = calculateMousePos(e);
         paddle1Y = mousePos.y - PADDLE_HEIGHT/2;
   });
}

function calculateMousePos(e) {
   let rect = canvas.getBoundingClientRect();
   let root = document.documentElement;
   let mouseX = e.clientX - rect.left - root.scrollLeft;
   let mouseY = e.clientY - rect.top - root.scrollTop;
   return {
      x: mouseX,
      y: mouseY
   };
}

function move() {
   ballX += ballSpeedX;
   if (ballX < PADDLE_SIDE_PADDING + PADDLE_WIDTH + BALL_RADIUS || 
       ballX > canvas.width - PADDLE_SIDE_PADDING - PADDLE_WIDTH - BALL_RADIUS) {
      ballSpeedX = -ballSpeedX;
   }

   ballY += ballSpeedY;
   if (ballY < BALL_RADIUS || 
       ballY > canvas.height - BALL_RADIUS) {
      ballSpeedY = -ballSpeedY;
   }

   moveP2Paddle();

   checkIfScored();
}

function draw() {
   // canvas
   drawRect(0, 0, canvas.width, canvas.height, 'black');
   // left paddle
   drawRect(PADDLE_SIDE_PADDING, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
   // right paddle
   drawRect(canvas.width - PADDLE_SIDE_PADDING - PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
   // ball
   drawBall(ballX, ballY, BALL_RADIUS, 'white');

   canvasContext.fillText(`${p1score} - ${p2score}`, 400, 100);
}

function drawRect(leftX, topY, width, height, drawColor) {
   canvasContext.fillStyle = drawColor;
   canvasContext.fillRect(leftX, topY, width, height);
   
}

function drawBall(ballX, ballY, BALL_RADIUS, drawColor) {
   canvasContext.fillStyle = drawColor;
   canvasContext.beginPath();
   canvasContext.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI*2, true);
   canvasContext.fill();
}

function resetBall() {
   ballX = canvas.width/2;
   ballY = canvas.height/2;
}

function checkIfScored() {
   if (ballX < PADDLE_SIDE_PADDING + PADDLE_WIDTH + BALL_RADIUS &&
      (ballY > paddle1Y + PADDLE_HEIGHT + BALL_RADIUS || ballY < paddle1Y - BALL_RADIUS)) {
           resetBall();
           p2score++;
  }
  
  if (ballX > canvas.width - PADDLE_SIDE_PADDING - PADDLE_WIDTH - BALL_RADIUS &&
      (ballY > paddle2Y + PADDLE_HEIGHT + BALL_RADIUS || ballY < paddle2Y - BALL_RADIUS)) {
           resetBall();
           p1score++;
  }
}

function moveP2Paddle() {
   if (ballY > paddle2Y + PADDLE_HEIGHT/2) {
      paddle2Y += P2_SPEED;
   } else {
      paddle2Y -= P2_SPEED;
   }
}