class BrickBreakerGame extends HTMLElement {
  constructor() {
      super();

      // Attach a shadow DOM tree to this element.
      const shadow = this.attachShadow({ mode: 'open' });

      // Create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = 480;
      canvas.height = 320;
      canvas.id = 'gameCanvas';

      // Append the canvas to the shadow DOM
      shadow.appendChild(canvas);

      // Create styles and append them to the shadow DOM
      const style = document.createElement('style');
      style.textContent = `
          canvas {
              background: #eee;
              display: block;
              margin: 0 auto;
          }
      `;
      shadow.appendChild(style);

      // Initialize the game
      this.initGame(canvas);
      shadow.querySelector('canvas').focus();
  }

  initGame(canvas) {
      const ctx = canvas.getContext("2d");

      // Paddle properties
      const paddleHeight = 10;
      const paddleWidth = 75;
      let paddleX = (canvas.width - paddleWidth) / 2;

      // Ball properties
      const ballRadius = 10;
      let x = canvas.width / 2;
      let y = canvas.height - 30;
      let dx = 2;
      let dy = -2;

      // Brick properties
      const brickRowCount = 1;
      const brickColumnCount = 2;
      const brickWidth = 75;
      const brickHeight = 20;
      const brickPadding = 10;
      const brickOffsetTop = 30;
      const brickOffsetLeft = 30;

      // Brick object
      let bricks = [];
      for (let c = 0; c < brickColumnCount; c++) {
          bricks[c] = { x: 0, y: 0, status: 1 };
      }

      // Paddle movement
      let rightPressed = false;
      let leftPressed = false;

      // Bind event handlers to the component's shadow DOM
      this.shadowRoot.addEventListener("keydown", keyDownHandler, false);
      this.shadowRoot.addEventListener("keyup", keyUpHandler, false);

      // Focus the shadow DOM to receive keyboard events
      this.shadowRoot.tabIndex = 0;
      this.shadowRoot.querySelector('canvas').focus();

      function keyDownHandler(e) {
          console.log(e.key);
          if (e.key === "Right" || e.key === "ArrowRight") {
              rightPressed = true;
          } else if (e.key === "Left" || e.key === "ArrowLeft") {
              leftPressed = true;
          }
      }

      function keyUpHandler(e) {
          if (e.key === "Right" || e.key === "ArrowRight") {
              rightPressed = false;
          } else if (e.key === "Left" || e.key === "ArrowLeft") {
              leftPressed = false;
          }
      }

      // Drawing functions
      function drawBall() {
          ctx.beginPath();
          ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
      }

      function drawPaddle() {
          ctx.beginPath();
          ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
      }

      function drawBricks() {
          for (let c = 0; c < brickColumnCount; c++) {
              if (bricks[c].status === 1) {
                  let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                  let brickY = brickOffsetTop;
                  bricks[c].x = brickX;
                  bricks[c].y = brickY;
                  ctx.beginPath();
                  ctx.rect(brickX, brickY, brickWidth, brickHeight);
                  ctx.fillStyle = "#0095DD";
                  ctx.fill();
                  ctx.closePath();
              }
          }
      }

      // Collision detection
      function collisionDetection() {
          for (let c = 0; c < brickColumnCount; c++) {
              let b = bricks[c];
              if (b.status === 1) {
                  if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                      dy = -dy;
                      b.status = 0;
                  }
              }
          }
      }

      function draw() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawBricks();
          drawBall();
          drawPaddle();
          collisionDetection();

          // Ball movement
          if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
              dx = -dx;
          }
          if (y + dy < ballRadius) {
              dy = -dy;
          } else if (y + dy > canvas.height - ballRadius) {
              if (x > paddleX && x < paddleX + paddleWidth) {
                  dy = -dy;
              } else {
                  dy = -dy;
                  // alert("Game Over");
                  // document.location.reload();
              }
          }

          x += dx;
          y += dy;

          // Paddle movement
          if (rightPressed && paddleX < canvas.width - paddleWidth) {
              paddleX += 7;
          } else if (leftPressed && paddleX > 0) {
              paddleX -= 7;
          }

          requestAnimationFrame(draw);
      }

      // Start the game
      draw();
  }
}

// Define the custom element
customElements.define('brick-breaker-game', BrickBreakerGame);