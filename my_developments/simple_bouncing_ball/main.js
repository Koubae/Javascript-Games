function Ball(canvas, ctx) {
    this.x = 250;
    this.y = 250;
    this.radius = 50;
    this.velocityX = 10;
    this.velocityY = 10;
    this.color = `rgb(255, 0, 0)`
    this.ctx = ctx;
    this.canvas = canvas;


}

Ball.prototype.draw = function () {
    circle(this.ctx, this.x, this.y, this.radius, this.color);
}

Ball.prototype.update = function () {
    this.draw();

    // TODO: 'inject' the collision type into the enity!
    const wallXMin = this.x - this.radius / 2;
    const wallXMax = this.x + this.radius / 2;

    const wallYMin = this.y - this.radius / 2;
    const wallYMax = this.y + this.radius / 2;

    if (wallXMax + this.velocityX > this.canvas.width || wallXMin + this.velocityX < 0) {
        this.velocityX = -this.velocityX;
    }
    if (wallYMax + this.velocityY > this.canvas.height || wallYMin + this.velocityY < 0) {
        this.velocityY = -this.velocityY;
    }

    // TODO: we should 'inject' into the instance type that this entity is subject to gravity
    // GRAVITY
    this.x += this.velocityX;
    this.y += this.velocityY;


}

function circle(ctx, coordX, coordY, radius, color) {
    ctx.beginPath();
    ctx.arc(coordX, coordY, radius, 0, Math.PI * 2, true); // circle
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}


function main() {
    const canvas = document.getElementById('screen');
    if (!canvas.getContext) {
        // canvas-unsupported code here
        alert("Unsupported browser :/");
        return;
    }
    // Constants and variables
    const BACKGROUND_COLOR = `rgba(0, 0, 0)`;

    const FONT_SIZE = "55px";
    const FONT_FAMILY = "serif";
    const FONT_COLOR = `rgb(255, 255, 255)`;

    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;
    let backgroundGradient;

    // Initialize the 2D context
    const ctx = canvas.getContext("2d");

    // Initialize game objects
    resizeCanvas();
    this.ball = new Ball(canvas, ctx);

    // The game which references the main function
    const game = this;

    let value = 5;


    // --------------------------
    // Game-Engine
    // --------------------------
    function clearScreen() {

        ctx.save();
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Add gradient to screen
        ctx.fillStyle = backgroundGradient;
        ctx.fillRect(0, 0, screenWidth, screenHeight);
        ctx.restore();
    }


    function draw() {
        clearScreen();

        game.ball.update();
        if (game.ball.velocityX < 0) {
                    game.ball.velocityX = -value;

        } else {
                    game.ball.velocityX = value;

        }
        if (game.ball.velocityY < 0) {
               game.ball.velocityY = -value;
        } else {
               game.ball.velocityY = value;
        }


        ctx.font = '48px serif';
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillText(value, 500, 150);

    }

    function gameLoop() {
        draw();
        requestAnimationFrame(gameLoop);

    }

    gameLoop();

    // --------------------------
    // Game-Logic
    // --------------------------

    // --------------------------
    // DOM Elements
    // --------------------------

    const ballSpeedController = document.getElementById('ballSpeed');
    ballSpeedController.value = value;
    ballSpeedController.addEventListener('input', function (event) {
        value = parseInt(this.value);
    });

    // --------------------------
    // Event Listeners
    // --------------------------
    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    /**
     * Resize the canvas
     */
    function resizeCanvas() {
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;
        canvas.width = screenWidth;
        canvas.height = screenHeight;
        /**
         * Your drawings need to be inside this function otherwise they will be reset when
         * you resize the browser window and the canvas goes will be cleared.
         */
        // draw(); // becareful with this
    }


}

window.addEventListener('DOMContentLoaded', function (event) {
    main()
});



