"use strict";

// Classes
import GameEngine from "./GameEngine.js";
import GameEvents from "./GameEvent.js";
import {Ball} from "./entities.js";

function Game(canvas) {
    const BACKGROUND_COLOR = `rgba(0, 0, 0)`;
    const BACKGROUND_TYPES = ["svg", "css"];
    const BACKGROUND_TYPE = BACKGROUND_TYPES[0];

    const FONT_SIZE = "55px";
    const FONT_FAMILY = "serif";
    const FONT_COLOR = `rgb(255, 255, 255)`;

    this.canvas = canvas;
    this.ctx = undefined;
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.arenaWidth = document.body.scrollWidth;
    this.arenaHeight = document.body.scrollHeight;
    this.background = undefined;

    this.gameEngine = GameEngine;
    this.gameEvents = GameEvents;

    // Game Engine
    this.GAME_CLOCK = 0;


    // Event driven properties
    this.clickClock = 0; // register the last click timestamp
    this.clickX = undefined;
    this.clickY = undefined;

    this.screenX = 0;
    this.screenY = 0;


    this.constants = Object.freeze({
        BACKGROUND_COLOR: BACKGROUND_COLOR,
        BACKGROUND_TYPES: BACKGROUND_TYPES,
        BACKGROUND_TYPE: BACKGROUND_TYPE,

        FONT_SIZE: FONT_SIZE,
        FONT_FAMILY: FONT_FAMILY,
        FONT_COLOR: FONT_COLOR,
    })

    this.constructor = function () {
        this.ctx = this.canvas.getContext("2d", {alpha: true}); // Optimization by set alpha to false
        // Init Game-Engine
        this.gameEngine.game = this;
        this.gameEngine = Object.freeze(this.gameEngine);
        // Init Game-Events
        this.gameEvents.game = this;
        this.gameEvents = Object.freeze(this.gameEvents);
        this.gameEvents.resizeCanvas();

        /// Build Background
        if (BACKGROUND_TYPE === "svg") {
            const background = document.createElement("div");
            background.id = "background";
            background.innerHTML = `
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="smallGrid" width="5" height="5" patternUnits="userSpaceOnUse">
                            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" stroke-width="0.5"/>
                        </pattern>
                        <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                            <rect width="50" height="50" fill="url(#grid)"/>
                            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)"/>
                </svg>
            `;
            background.style.width = `${this.screenWidth}px` ;
            background.style.height = `${this.screenHeight}px`;
            document.body.insertBefore(background, this.canvas);
            this.background = background;

        } else if (BACKGROUND_TYPE === "css") {
            document.body.classList.add("backgroundGrid");
        }


    }
    this.constructor();


    this.run = function () {
        this.gameEngine.gameLoop();
    }

    // --------------------------
    // Event Listeners
    // --------------------------
    // Window / Global Events
    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', this.gameEvents.resizeCanvas.bind(this.gameEvents), false);
    // Mouse Events
    document.addEventListener('click', this.gameEvents.OnClick.bind(this.gameEvents, this.updatePointerPosition.bind(this)), false);
    document.addEventListener('dblclick', (e) => {
    }, false);
    document.addEventListener('mousedown', (e) => {
    }, false);
    document.addEventListener('mouseup', this.gameEvents.OnMouseUp.bind(this.gameEvents), false);
    document.addEventListener('mousemove', this.gameEvents.OnMouseMove.bind(this.gameEvents, this.updatePointerPosition.bind(this)), false);

    // Keyboard Events
    document.addEventListener("keydown", this.gameEvents.keyDownHandler.bind(this.gameEvents), false);
    document.addEventListener("keyup", this.gameEvents.keyUpHandler.bind(this.gameEvents), false);

    // --------------------------
    // Game Logic
    // --------------------------

    // Game Entities Declarations here
    this.ball = new Ball(canvas, this.ctx);
    // the render logic should be focus ing on the rendering


    const MAX_SMOOTH = 3;
    this.cameraSmooth = 2;


    this.update = function () {

        // Add Game Updates here
        this.ball.update(this.clickX, this.clickY, this.clickClock);


        let w = window.innerWidth;
        let h = window.innerHeight;
        window.scroll((this.ball.x + this.ball.velocityX)  - (w / 2)   , (this.ball.y + this.ball.velocityY) - (h / 2)  );


    }




}

// --------------------------
// Game Methods
// --------------------------

Game.prototype.updatePointerPosition = function(e) {
    this.clickX = e.pageX;
    this.clickY = e.pageY;
    this.clickClock = this.GAME_CLOCK;
}


export default Game;