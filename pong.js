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
const SCORE_TO_WIN = 10;
let showWinScreen = false;

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

   canvas.addEventListener('click', handleMouseClick);
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
   if (showWinScreen) {
      return;
   }

   ballX += ballSpeedX;
   if (ballX < PADDLE_SIDE_PADDING + PADDLE_WIDTH + BALL_RADIUS) {
      ballSpeedX = -ballSpeedX;

      let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
      ballSpeedY = deltaY/PADDLE_HEIGHT*7;
   } 

   if (ballX > canvas.width - PADDLE_SIDE_PADDING - PADDLE_WIDTH - BALL_RADIUS) {
      ballSpeedX = -ballSpeedX;

      let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
      ballSpeedY = deltaY/PADDLE_HEIGHT*7;
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

   if (showWinScreen) {
      let winner = p1score === SCORE_TO_WIN ? "Player 1" : "Player 2";
      canvasContext.fillStyle = 'white';
      canvasContext.font = "20px Georgia";
      canvasContext.fillText(`${winner} won! Click to continue...`, 260, 100);
      return;
   }
   // left paddle
   drawRect(PADDLE_SIDE_PADDING, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
   // right paddle
   drawRect(canvas.width - PADDLE_SIDE_PADDING - PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
   // ball
   drawBall(ballX, ballY, BALL_RADIUS, 'white');
   
   canvasContext.font = "20px Georgia";
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
   if (p1score === SCORE_TO_WIN ||
       p2score === SCORE_TO_WIN) {
         showWinScreen = true;
   }

   ballX = canvas.width/2;
   ballY = canvas.height/2;
   ballSpeedY = (Math.random()-0.5)*10;

}

function checkIfScored() {
   if (ballX < PADDLE_SIDE_PADDING + PADDLE_WIDTH + BALL_RADIUS &&
      (ballY > paddle1Y + PADDLE_HEIGHT + BALL_RADIUS || ballY < paddle1Y - BALL_RADIUS)) {
         p2score++;
         resetBall();
   }
  
  if (ballX > canvas.width - PADDLE_SIDE_PADDING - PADDLE_WIDTH - BALL_RADIUS &&
      (ballY > paddle2Y + PADDLE_HEIGHT + BALL_RADIUS || ballY < paddle2Y - BALL_RADIUS)) {
         p1score++;
         resetBall();
  }
}

function moveP2Paddle() {
   if (Math.abs(ballY - (paddle2Y + PADDLE_HEIGHT/2)) > 30) {
      if (ballY > paddle2Y + PADDLE_HEIGHT/2) {
         paddle2Y += P2_SPEED;
      } else {
         paddle2Y -= P2_SPEED;
      }
   }
}

function handleMouseClick(e) {
   if (showWinScreen) {
      showWinScreen = false;
      p1score = p2score = 0;
   }
}