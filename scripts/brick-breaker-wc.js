class BrickBreakerGame extends HTMLElement {
  constructor() {
      super();

      // Attach a shadow DOM tree to this element.
      const shadow = this.attachShadow({ mode: 'open' });

      // Create styles and append them to the shadow DOM
      const style = document.createElement('style');
      style.textContent = `
          canvas {
              background: #222;
              display: block;
              margin: 0 auto;
          }
      `;
      shadow.appendChild(style);

      // Create a canvas element
      const canvas = document.createElement('canvas');
      canvas.id = 'gameCanvas';

      // Set canvas dimensions based on the viewport size
      canvas.width = Math.min(window.innerWidth, 480);
      canvas.height = Math.min(window.innerHeight, 320);

      // Append the canvas to the shadow DOM
      shadow.appendChild(canvas);

      this.shadowRoot.tabIndex = 0;

      // Initialize the game
      this.initGame(canvas);
      this.shadowRoot.children[1].focus();
  }

  initGame(canvas) {
      const ctx = canvas.getContext("2d");

      // Paddle properties
      const paddleHeight = 10;
      const paddleWidth = 75;
      let paddleX = (canvas.width - paddleWidth) / 2;
      let livePaddle = false;

      // Ball properties
      const ballRadius = 10;
      let x = canvas.width / 2;
      let y = canvas.height - 30;
      let dx = 2;
      let dy = -2;

      // Brick properties
      const brickRowCount = 2;
      const brickColumnCount = 5;
      const brickWidth = 75;
      const brickHeight = 20;
      const brickPadding = 10;
      const brickOffsetTop = 30;
      const brickOffsetLeft = 30;

      // use brickRowCount and brickColumnCount to create a 2D array of bricks
      const bricks = [];
      for (let r = 0; r < brickRowCount; r++) {
          bricks[r] = [];
          for (let c = 0; c < brickColumnCount; c++) {
              bricks[r][c] = { x: 0, y: 0, status: 1 };
          }
      }

      // Paddle movement
      let rightPressed = false;
      let leftPressed = false;

      // Bind event handlers to the component's shadow DOM
      this.shadowRoot.addEventListener("keydown", keyDownHandler, false);
      this.shadowRoot.addEventListener("keyup", keyUpHandler, false);
      this.shadowRoot.addEventListener("mousemove", mouseMoveHandler, false);
      this.shadowRoot.addEventListener("touchstart", touchStartHandler, false);
      this.shadowRoot.addEventListener("touchmove", touchMoveHandler, false);
      this.shadowRoot.addEventListener("touchend", touchEndHandler, false);

      // Focus the shadow DOM to receive keyboard events
      this.shadowRoot.tabIndex = 0;
      this.shadowRoot.querySelector('canvas').focus();

      function keyDownHandler(e) {
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

      function mouseMoveHandler(e) {
        const relativeX = e.clientX - canvas.getBoundingClientRect().left;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
      }

      function touchStartHandler(e) {
        e.preventDefault();
      }

      function touchMoveHandler(e) {
        const touch = e.touches[0];
        const relativeX = touch.clientX - canvas.getBoundingClientRect().left;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
      }

      function touchEndHandler(e) {
        e.preventDefault();
      }

      // Drawing functions
      function drawBall() {
          ctx.beginPath();
          ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
          ctx.fillStyle = "#556";
          ctx.fill();
          ctx.closePath();
      }

      function drawPaddle() {
          ctx.beginPath();
          ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
          ctx.fillStyle = "#565";
          ctx.fill();
          ctx.closePath();
      }

      function drawBricks() {
        for (let r = 0; r < brickRowCount; r++)
          for (let c = 0; c < brickColumnCount; c++) {
              if (bricks[r][c].status === 1) {
                  let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                  let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                  bricks[r][c].x = brickX;
                  bricks[r][c].y = brickY;
                  ctx.beginPath();
                  ctx.rect(brickX, brickY, brickWidth, brickHeight);
                  ctx.fillStyle = "#655";
                  ctx.fill();
                  ctx.closePath();
              }
          }
      }

      // Collision detection
      function collisionDetection() {
        for (let r = 0; r < brickRowCount; r++) {
          for (let c = 0; c < brickColumnCount; c++) {
              let b = bricks[r][c];
              if (b.status === 1) {
                  if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                      dy = -dy;
                      b.status = 0;
                      if(livePaddle) {
                        // send partiallyCleanUp
                        partiallyCleanUp();
                        livePaddle = false;
                      }
                  }
              }
          }
        }
      }

      function checkAllBricksBroken() {
          let allBricksBroken = true;
          for (let r = 0; r < brickRowCount; r++) {
              for (let c = 0; c < brickColumnCount; c++) {
                  if (bricks[r][c].status === 1) {
                      allBricksBroken = false;
                      return;
                  }
              }
          }
          if (allBricksBroken) {
            cleanUp();
          }
      }

      function draw() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawBricks();
          drawBall();
          drawPaddle();
          collisionDetection();
          checkAllBricksBroken();

          // Ball movement
          if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
              dx = -dx;
          }
          if (y + dy < ballRadius) {
              dy = -dy;
          } else if (y + dy > canvas.height - ballRadius) {
              if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
                livePaddle = true;
              } else {
                livePaddle = false;
                // Check if the ball hits the bottom of the canvas
                if (y + dy > canvas.height - ballRadius) {
                  // Find the first brick with status 0 and set its status to 1
                  outerLoop:
                  for (let r = 0; r < brickRowCount; r++) {
                      for (let c = 0; c < brickColumnCount; c++) {
                          if (bricks[r][c].status === 0) {
                              bricks[r][c].status = 1;
                              break outerLoop;
                          }
                      }
                  }
                }

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