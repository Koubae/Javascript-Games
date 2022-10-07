"use strict";

// Classes
import GameEngine from "./GameEngine.js";
import GameEvents from "./GameEvent.js";
import {Cell, CellBot, Food} from "./entities.js";
import {random} from "./utils.js";

function Game(canvas) {
    const DEBUG = true;
    const BACKGROUND_COLOR = `rgba(0, 0, 0)`;
    const BACKGROUND_TYPES = ["svg", "css"];
    const BACKGROUND_TYPE = BACKGROUND_TYPES[0];
    const CHUNK_SIZE = 64;

    const FONT_SIZE = "55px";
    const FONT_FAMILY = "serif";
    const FONT_COLOR = `rgb(255, 255, 255)`;

    const FOOD_COUNT = 350;

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

    this.zoom = 1;
    this.zoomOutMax = 0.1;
    this.zoomInMax = 5;


    this.constants = Object.freeze({
        DEBUG: DEBUG,
        BACKGROUND_COLOR: BACKGROUND_COLOR,
        BACKGROUND_TYPES: BACKGROUND_TYPES,
        BACKGROUND_TYPE: BACKGROUND_TYPE,

        CHUNK_SIZE: CHUNK_SIZE,

        FONT_SIZE: FONT_SIZE,
        FONT_FAMILY: FONT_FAMILY,
        FONT_COLOR: FONT_COLOR,

        FOOD_COUNT: FOOD_COUNT,
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
            background.style.width = `${this.screenWidth}px`;
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
    document.addEventListener('wheel', this.gameEvents.OnMouseWheel.bind(this.gameEvents, () => {
    }));
    // Keyboard Events
    document.addEventListener("keydown", this.gameEvents.keyDownHandler.bind(this.gameEvents), false);
    document.addEventListener("keyup", this.gameEvents.keyUpHandler.bind(this.gameEvents), false);

    // --------------------------
    // Game Logic
    // --------------------------
    this.worldSections = {};
    // let chunkNumber = 1;
    // for (let y = CHUNK_SIZE; y < this.canvas.height + CHUNK_SIZE; y += CHUNK_SIZE) {
    //     for (let i = CHUNK_SIZE; i < this.canvas.width + CHUNK_SIZE; i += CHUNK_SIZE) {
    //         this.worldSections[chunkNumber] = []
    //         chunkNumber += 1;
    //     }
    // }


    // Game Entities Declarations here
    this.cell = new Cell(canvas, this.ctx, 250, 250);
    let cellPosY = Math.floor((250) / CHUNK_SIZE);
    let cellPosX = Math.floor((250) / CHUNK_SIZE);
    if (!(cellPosY in this.worldSections)) {
        this.worldSections[cellPosY] = {};
    }

    if (cellPosX in this.worldSections[cellPosY]) {
        this.worldSections[cellPosY][cellPosX].push(this.cell);
    } else {
        this.worldSections[cellPosY][cellPosX] = [this.cell];
    }


    // the render logic should be focus ing on the rendering
    this.foods = [];
    for (let i = 0; i < FOOD_COUNT; i++) {
        let food = this.makeFood();
        this.foods.push(food);
    }

    this.cellBots = [];
    for (let i = 0; i < 1; i++) {
        let cellBoot = new CellBot(
            this.canvas,
            this.ctx,
            700,
            500
        );
        let cellPosY = Math.floor((500) / this.constants.CHUNK_SIZE);
        let cellPosX = Math.floor((700) / this.constants.CHUNK_SIZE);
        if (!(cellPosY in this.worldSections)) {
            this.worldSections[cellPosY] = {};
        }

        if (cellPosX in this.worldSections[cellPosY]) {
            this.worldSections[cellPosY][cellPosX].push(cellBoot);
        } else {
            this.worldSections[cellPosY][cellPosX] = [cellBoot];
        }

        this.cellBots.push(cellBoot);
    }

    // this.cells = [this.cell, ...this.cellBots, ...this.foods];

    // TODO: zoom-in / zoom-out currently is not working and is a mess!

    // const zoomBy = 1.1;
    // this.origin = {x: 0, y: 0};         // canvas origin
    // this.scale = 1;                     // current scale
    // const scaleMax = 1.2;
    // const scaleMin = 0.6;
    // this.scaleAt = function (direction) {  // at pixel coords x, y scale by scaleBy
    //     let x = this.cell.x;
    //     let y = this.cell.y;
    //
    //     let scaleBy = zoomBy;
    //     if (direction === "zoomOut") {
    //         scaleBy = 1 / scaleBy;
    //     }
    //     this.scale *= scaleBy;
    //     this.scale = Math.round((this.scale + Number.EPSILON) * 100) / 100;
    //     if (this.scale < scaleMin) this.scale = scaleMin;
    //     if (this.scale > scaleMax) this.scale = scaleMax;
    //     this.origin.x = x - (x - this.origin.x) * scaleBy;
    //     this.origin.y = y - (y - this.origin.y) * scaleBy;
    //     this.ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    //     // restore
    //     // ctx.setTransform(1,0,0,1,0,0);
    // }

    // let chunksX = Math.floor(this.canvas.width / CHUNK_SIZE);
    // let chunksY = Math.floor(this.canvas.height / CHUNK_SIZE);
    // console.log("chunksX ", chunksX, "chunksY ", chunksY);


    this.update = function () {
        let self = this;


        if (DEBUG) {
            let entityGroups = Object.entries(this.worldSections);
            try {
                // makes all entities green for debugging purposes
                entityGroups.forEach(
                    group => Object.entries(group[1]).forEach(row => row[1].forEach(e => e.color = "rgb(0, 255, 0)")))
                ;
            } catch (e) {
                console.error(`Error while making entities green (DEBUG) | Error ${e}`)
            }

        }
        let players = [];
        let bots = [];
        let foods= [];
        for (const [coordY, data] of Object.entries(this.worldSections)) {
            for (const [coordX, col] of Object.entries(data)) {
                col.forEach(c => {
                    if (!c) {
                        console.log("opps " + coordY + " " + coordX + " no data")
                        return;

                    }
                    if (c.type === 'cell') {
                        players.push(c);
                    } else if (c.type === 'cellBot') {
                        bots.push(c);
                    } else if (c.type === 'food') {
                        foods.push(c);
                    } else {
                        console.log("opps " + coordY + " " + coordX + " no cell type!!!")
                        return;
                    }


                });
            }

        }


        // TODO: use a worker(s) to update the food.(or anything really!!!)


        foods.forEach(cell => {
            let isAlive = cell.update([self.cell, ...self.cellBots], self.clickClock, self.GAME_CLOCK, self.worldSections);
            if (isAlive) return cell;
            return self.makeFood(); // is dead then we create a new food
        });

        players.forEach(cell => {
            // Add Game Updates here
            if (!cell.isDead()) {
                cell.update(self.clickX, self.clickY, self.clickClock, self.GAME_CLOCK, self.worldSections);
            }
        });
        bots.forEach(cell => {
            let alive = cell.update(self.cell, self.clickClock, self.GAME_CLOCK, self.worldSections);
            if (!alive) {
            }
        });

        let a = players[0];
       if (a)  console.log(`player is dead ${a.isDead()}`)


        // WORLD
        this.cameraUpdate();

        // TODO: zoom-in / zoom-out currently is not working and is a mess!
        // this.ctx.translate(this.cell.x,this.cell.y);
        // this.ctx.scale(this.zoom,this.zoom);
        // this.ctx.translate(-this.cell.x,-this.cell.y);


        // this.ctx.font = '25px serif';
        // this.ctx.fillStyle = "#000";
        // this.ctx.fillText(
        //     `scale(${this.scale}%)`,
        //     this.cell.x - 50,
        //     this.cell.y - 50
        // );
//         window.scroll(
//     ((this.cell.x + this.cell.velocityX )  - (w / 2) ) * (this.zoom / 100),
//     ((this.cell.y + this.cell.velocityY ) - (h / 2) )  * (this.zoom / 100)
//         );
//
//         this.ctx.font = '25px serif';
//         this.ctx.fillStyle = "#000";
//         this.ctx.fillText(
//             `scale(${this.zoom}%) |
// X=${Math.floor(this.cell.velocityX)} Y=${Math.floor(this.cell.velocityX)}
// PX=${Math.floor(this.cell.x)}, PY=${Math.floor(this.cell.y)}
// CX=${this.clickX} , CY=${this.clickY}`,
//             this.cell.x - 350,
//             this.cell.y - 50
//         );
    }


}

// --------------------------
// Game Methods
// --------------------------

Game.prototype.updatePointerPosition = function (e) {
    this.clickX = e.pageX;
    this.clickY = e.pageY;
    this.clickClock = this.GAME_CLOCK;
}

Game.prototype.cameraUpdate = function() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    window.scroll(
        ((this.cell.x + this.cell.velocityX) - (w / 2)),
        ((this.cell.y + this.cell.velocityY) - (h / 2))
    );

}

Game.prototype.makeFood = function() {
    const margin = 25;  // add / remove 25 as margin so that is not sticked to the walls
    let foodX = random(margin, this.canvas.width - margin);
    let foodY = random(margin, this.canvas.height - margin);
    let food =  new Food(
        this.canvas,
        this.ctx,
        foodX,
        foodY
    );

    let cellPosY = Math.floor((foodY) / this.constants.CHUNK_SIZE);
    let cellPosX = Math.floor((foodX) / this.constants.CHUNK_SIZE);
    if (!(cellPosY in this.worldSections)) {
        this.worldSections[cellPosY] = {};
    }

    if (cellPosX in this.worldSections[cellPosY]) {
        this.worldSections[cellPosY][cellPosX].push(food);
    } else {
        this.worldSections[cellPosY][cellPosX] = [food];
    }


    return food
}

/**
 * // TODO: use a worker(s) to update the food.
 */
Game.prototype.renderFoods = function() {
    this.foods = this.foods.map(f => {
        let isAlive = f.update([this.cell, ...this.cellBots], this.clickClock, this.GAME_CLOCK);
        if (isAlive) return f;
        return this.makeFood(); // is dead then we create a new food
    });
}


export default Game;