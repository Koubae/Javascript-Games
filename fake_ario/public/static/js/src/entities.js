"use strict";

import {circle} from "./paintings.js";
import {randomRGB, random} from "./utils.js";

import {CollisionWallBounce, CollisionWallStopMotion} from "./physics/entityCollisions.js";
import {
    animationAlmostExploding,
    animationDoubleCellOne,
    animationDoubleCellTwo,
    animationDoubleCellThree,
    animationDoubleCellFour,
    animationBacteriaOne
} from "./animations/entityAnimations.js";


// TODO: Create Vector Object
/**
 * Calculates distance and distance difference between 2 entities
 * @param {Vector} entityA
 * @param {Vector} entityB
 * @returns {[int, int, int]} distance, differenceX, differenceY
 */
function calculateDistance(entityA, entityB) {
    let entityA_X = entityA.x;
    let entityA_Y = entityA.y;

    let entityB_X = entityB.x;
    let entityB_Y = entityB.y;

    let diffX = entityA_X - entityB_X;
    let diffY = entityA_Y - entityB_Y;

    let distance = Math.max(0, Math.sqrt(diffX * diffX + diffY * diffY));
    return [distance, diffX, diffY];
}

/**
 * Check if the gravity pull is stronger than the X,Y distance difference of cell A (difference) and cell B (gravity)
 *
 * @param {number} diffX
 * @param {number} diffY
 * @param {number} gravityPull
 * @returns {boolean} True is cell B can pull cell A | False if cell B can't pull cell A
 */
function checkEntityProximity(diffX, diffY, gravityPull) {
    return Math.abs(diffX) < gravityPull && Math.abs(diffY) < gravityPull;
}

/**
 * Calculates the gravity force variable percentage force compare between 2 gravity forces
 * @param {number} entityAGravity
 * @param {number} entityBGravity
 * @returns {number} A float
 */
function calculateGravityPullPercentage(entityAGravity, entityBGravity) {
    return (((entityAGravity / 2) - (entityBGravity / 2)) / 10) / 30;
}

/**
 *
 * @param {(number|number|number)[]} spaces
 * @param {Entity} entityA
 * @param {Entity} entityB
 * @returns {(number|number)[]}
 */
function calculateGravityPull(spaces, entityA, entityB) {
    let [distance, diffX, diffY] = spaces;
    let gravityPull = calculateGravityPullPercentage(entityB.gravity, entityA.gravity);
    return [((diffX / distance) * 2) * gravityPull, ((diffY / distance) * 2) * gravityPull];
}


function Cell(game, x, y) {
    this.type = "cell";
    // Movement
    this.MAX_SPEED = 15;
    this.MIN_SPEED = 0.15;
    this.BASE_SPEED = this.MAX_SPEED / 2;
    this.ATTRACTION = 0.5;

    this.game = game;
    this.ctx = game.ctx;
    this.canvas = game.canvas;
    this.color = `rgb(255, 0, 0)`
    this.x = x;
    this.y = y;
    this.mass = 50;
    this.gravity = this.mass + this.mass / 2;
    this.underOtherCellGravity = false;
    this.velocityX = this.BASE_SPEED;
    this.velocityY = this.BASE_SPEED;
    this.lastMovementTimeStamp = 0;

    this._dead = false;

    // Animations
    this.animationTime = 25.5;
    this.animationType ='doubleCellOne';
    if (this.animationType === 'almostExploding') {
        this.animation = animationAlmostExploding;
    } else if (this.animationType === 'doubleCellOne') {
        this.animation = animationDoubleCellOne;
    } else if (this.animationType === 'doubleCellTwo') {
        this.animation = animationDoubleCellTwo;
    } else if (this.animationType === 'doubleCellThree') {
        this.animation = animationDoubleCellThree;
    } else if (this.animationType === 'doubleCellFour') {
        this.animation = animationDoubleCellFour;
    } else if (this.animationType === 'bacteriaOne') {
        this.animation = animationBacteriaOne;
    } else {
        this.animation = undefined;
    }




}

Cell.prototype.isDead = function () {
    return this._dead;
}

Cell.prototype.die = function () {
    // Hold previous x,y coordinates
    this.game.removeEntityWorldChunk(this);
    this._dead = true;
    this.x = -1000; // update x,y coordinates so that go outside of the canvas view
    this.y = -1000;
    this.velocityX = 0;
    this.velocityY = 0;
    this.mass = 0;
    circle(this.ctx, this.x, this.y, this.mass, this.color); // Make sure is drawn away

}

Cell.prototype.draw = function () {
    if (this.animation === undefined) {
        circle(this.ctx, this.x, this.y, this.mass, this.color);
    } else {
        this.animation(this.game.GAME_CLOCK);
    }

    if (this.game.constants.DEBUG) {
        this.ctx.font = '10px serif';
        this.ctx.fillStyle = "#000";
        this.ctx.fillText(
            `${Math.floor((Math.max(0, this.x / 64)))} ${Math.floor((Math.max(0, this.y / 64)))}`,
            this.x,
            this.y
        );
    }

}

Cell.prototype.update = function () {
    this.underOtherCellGravity = false;
    this.draw(this.game.GAME_CLOCK);

    const clickX = this.game.clickX ? this.game.clickX : 0;
    const clickY = this.game.clickY ? this.game.clickY : 0;

    //
    /* register Last Movement
        NOTE: If the lastMovementTimestamp is not equal to the current clickClock, the user
        clicked for a new movement so we need to register it!
     */
    if (this.lastMovementTimeStamp !== this.game.clickClock) {
        this.lastMovementTimeStamp = this.game.clickClock;
        this.changeDirection(clickX, clickY);
    }

    this._update();


}

/**
 * Internal update of a Cell Entity.
 *
 * Kepp in mind that the map matrix Game.worldSections is an Object of Object and more object / array.
 * Where the Y coordinates are the key of first level object and value are other object with X coordinates.
 * The X coordintas - object contains an Array with the entities wich center are within a X,Y world Chunk coordinates
 *
 * Example.
 * <code>
 * Game.worldSections = {
 *   1: {
 *       12: [entity1, entity2, entityNth...],
 *       15: [entity1, entity2, entityNth...],
 *   }
 *   15: {
 *       12: [entity1, entity2, entityNth...],
 *       15: [entity1, entity2, entityNth...],
 *   }
 * }
 * </code>
 *
 * It goes in the following stage:
 *
 * 1) Get the Y (top to bottom) and X (left to right) index coordinates of the map matrix where the
 *    cell currently is plus is gravitational pull range.
 *
 * 2) Iterate through the top (columns)
 * 3) Iterate though the left (row)
 * 4) Iterate though the entities withing the Array in current Y-X position
 * 5) If the current entity's gravity is smaller than this cell,
 *    then that entity can be eaten or only 'pulled' towards this cell gravity
 * 6) If the current entity's gravity is greater than this cell,
 *    then that entity can be eat or only 'pull' this cell
 * 7) If either the 2 cells have equal gravity nothing happens
 * 8) If the iterated, current entity is still alive than we remove it from the 'map matrix'
 *      and add to the entity to update
 * 9) Once all entity are checked within this cell gravitational pull, then the entities
 *    to update are updated
 *
 * 10) finally, if this cell is still alive, we remove from the current matrix map,
 *      update its position (and check for collisions) then add back this cell to the matrix map
 *
 *
 * @returns {boolean}
 * @private
 */
Cell.prototype._update = function() {
    if (this.isDead()) return false;

    const [left, top] = this._getMapCoordinates()

    let entityNextUpdate = new Set();
    for (let indexY = top[0]; indexY < top[1]+1; indexY++) { // Iterate through the max matrix COLUMNS (Vertically)
        if (this.isDead()) break;
        if (!(indexY in this.game.worldSections)) continue;

        let cols = this.game.worldSections[indexY];
        for (let indexX = left[0]; indexX < left[1]+1; indexX++) { // Iterate through the max matrix ROWS (Horizontally)
            if (this.isDead()) break;
            if (!(indexX in cols)) continue;

            let entities = cols[indexX];
            for (let entity of entities) {
                if (entity === this) continue;

                entity.underOtherCellGravity = true;
                if (this.game.constants.DEBUG) entity.color = "rgb(255, 0, 0)";

                if (this.gravity > entity.gravity) { // current Cell can pull / eat near-by cells
                    const stillAlive = this.gravityPull(this, entity);
                    if (!stillAlive) continue;
                } else if (this.type === "cell" && this.gravity < entity.gravity) { // near-by cell can pull / eat this cells
                    const stillAlive = this.gravityPull(entity, this);
                    if (!stillAlive) break;
                }
                // if this cell or the entity cell survived, then we remove it from the current map matrix
                // (when cell dies, it removes its self already!)
                this.game.removeEntityWorldChunk(entity);
                entityNextUpdate.add(entity);
            }
        }

    }
    // Add back the survived entities in the world map matrix
    entityNextUpdate.forEach(entity => {
        this.game.addEntityWorldChunk(entity);
    });
    if (this.isDead()) return false;

    this.game.removeEntityWorldChunk(this); // remove previous position from map matrix
    this.collisionDetect();
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.game.addEntityWorldChunk(this);  // add back updated position in the map matrix

    return true;

}

Cell.prototype.changeDirection = function (directionX, directionY) {
    // Grap the difference of the click with the player position
    let diff_x = directionX - this.x;
    let diff_y = directionY - this.y;
    // Calculate the distance
    let distance = Math.max(0, Math.sqrt(diff_x * diff_x + diff_y * diff_y) + this.mass * 4);

    let speed = distance * this.ATTRACTION; // add attraction
    if (speed > this.MAX_SPEED) speed = this.MAX_SPEED;
    if (speed < this.MIN_SPEED) speed = this.MIN_SPEED;

    this.velocityX = (diff_x / distance) * speed;
    this.velocityY = (diff_y / distance) * speed;
}

Cell.prototype._getMapCoordinates = function() {
    let leftTop = [(this.x - this.mass)+-this.gravity/2, (this.y - this.mass)+-this.gravity/2];
    let rightTop = [(this.x + this.mass)+this.gravity/2, (this.y - this.mass)+-this.gravity/2];

    let leftBottom = [(this.x - this.mass)+-this.gravity/2, (this.y + this.mass)+this.gravity/2];
    let rightBottom = [(this.x + this.mass)+this.gravity/2, (this.y + this.mass)+this.gravity/2];

    if (this.game.constants.DEBUG) { // draw 4 dots around the cell which is the visual cell boundary where the cell can start detect other entities
        circle(this.ctx, leftTop[0], leftTop[1], 2, "rgb(0, 0, 255)");
        circle(this.ctx, rightTop[0], rightTop[1], 2, "rgb(0, 0, 255)");
        circle(this.ctx, leftBottom[0], leftBottom[1], 2, "rgb(0, 0, 255)");
        circle(this.ctx, rightBottom[0], rightBottom[1], 2, "rgb(0, 0, 255)");
    }

    return [
        this.game.calculateGameChunk(leftTop[0], rightTop[0]),
        this.game.calculateGameChunk(leftTop[1], rightBottom[1])
    ];
}


Cell.prototype.gravityPull = function(cellPulling, cellPulled) {
    let [distance, diffX, diffY] = calculateDistance(cellPulling, cellPulled);
    if (checkEntityProximity(diffX, diffY, cellPulling.gravity)) {
        let isEaten = cellPulling.eat(cellPulled, diffX, diffY);
        if (isEaten) {
            cellPulled.die();
            return false;
        }

        let [gravityPullX, gravityPullY] = calculateGravityPull(
            [distance, diffX, diffY],
            cellPulled,
            cellPulling
        );

        cellPulled.x += gravityPullX;
        cellPulled.y += gravityPullY;

    }

    return true;
}


/// Entity Actions
Cell.prototype.eat = function (entity, diffX, diffY) {
    // First Check the position. Is this entity close enough to eat THAT entity?
    if (Math.abs(diffX) > this.mass - (this.mass / 3) || Math.abs(diffY) > this.mass - (this.mass / 3)) {
        return false;
    }
    // Next Check. is THIS entity big enough to eat THAT entity?
    // that entity must be at least smaller than THIS entity minus 1/6th of its mass
    if ((this.mass - (this.mass / 6)) < entity.mass) {
        return false;
    }

    let massAcquired;
    if (entity.type === "cellBot" || entity.type === "cell") {
        massAcquired = entity.mass / 10;
    } else {
        massAcquired = entity.mass / 30
    }
    // the gravity must increase at least the same as the mass, otherwise the gravity force will reduce!!!
    // why? Well, the gravity is nothing more that the 'distance from the center of the Cell to outside of is radius
    // until where it can start to attract other masses. So if is growing, its radius is growing too and hence
    // its gravity should. To keep the gravity force always at the same strength then add the new mass.
    // if need to increase gravity force each time a new mass is eaten. then add the quantity of the new mass
    // plus a tiny bit more
    let gravityAcquired = entity.mass / 25;
    // The cell, will loose its total speed equal to 1/30th of the new mass acquired. everything in life has a price :/
    let speedDecreased = massAcquired / 30;

    // upgrade the Cell
    this.mass += massAcquired;
    this.gravity += gravityAcquired;
    this.MAX_SPEED -= speedDecreased;
    this.animationTime += 0.5;

    // Now if the cell eat, we send a signal to the game to generate a new food (if is food)
    if (entity.type === "food") {
        this.game.makeFood();
    } else if (entity.type === 'cellBot') {
        this.game.makeBot();
    }

    return true;

}


/// Entity physics

Cell.collisionWallType = 'stopMotion';
if (Cell.collisionWallType === 'bounce') {
    Cell.prototype.collisionDetect = CollisionWallBounce;
} else if (Cell.collisionWallType === "stopMotion") {
    Cell.prototype.collisionDetect = CollisionWallStopMotion;
} else {
    Cell.prototype.collisionDetect = () => {
    }
}




function Food(game, x, y) {
    Cell.call(this, game, x, y);
    this.animation = undefined;
    this.animationType = undefined;
    this.type = "food";
    this.mass = 50 / 4;
    this.gravity = this.mass + this.mass / 2;
    this.color = randomRGB();

}

Food.prototype.draw = Cell.prototype.draw;
Food.prototype._getMapCoordinates = Cell.prototype._getMapCoordinates;
Food.prototype.die = Cell.prototype.die;
Food.prototype.isDead = Cell.prototype.isDead;
Food.prototype.update = function () {
    this.underOtherCellGravity = false;
    if (this.lastMovementTimeStamp !== this.game.clickClock) {
        this.lastMovementTimeStamp = this.game.clickClock;
    }

    this.draw();
    return !this.isDead();
}
Food.prototype.animation = undefined;

function CellBot(game, x, y, animationType = 'bacteriaOne') {
    Cell.call(this, game, x, y);
    this.type = "cellBot";
    this.mass = random(25, 75);
    this.gravity = this.mass + this.mass / 2;
    this.color = randomRGB();
    this.MAX_SPEED = 8;

    const ANIMATIONS = [
        'almostExploding',
        'doubleCellOne',
        'doubleCellTwo',
        'doubleCellThree',
        'doubleCellFour',
        'bacteriaOne',
    ];
    this.animationType = ANIMATIONS[random(0, ANIMATIONS.length-1)];
    if (this.animationType === 'almostExploding') {
        this.animation = animationAlmostExploding;
    } else if (this.animationType === 'doubleCellOne') {
        this.animation = animationDoubleCellOne;
    } else if (this.animationType === 'doubleCellTwo') {
        this.animation = animationDoubleCellTwo;
    } else if (this.animationType === 'doubleCellThree') {
        this.animation = animationDoubleCellThree;
    } else if (this.animationType === 'doubleCellFour') {
        this.animation = animationDoubleCellFour;
    } else if (this.animationType === 'bacteriaOne') {
        this.animation = animationBacteriaOne;
    } else {
        this.animation = undefined;
    }

    // CellBot Specific
    this.cellActivityRangeMax = random(10, 60); // lower number: very active, highest number less active

}

CellBot.prototype.draw = Cell.prototype.draw;
CellBot.prototype.die = Cell.prototype.die;
CellBot.prototype.isDead = Cell.prototype.isDead;
CellBot.prototype.update = function () {
    this.underOtherCellGravity = false;
    this.draw();
    let movementChange = random(0, this.cellActivityRangeMax);
    if (movementChange === 0) {
        this.changeDirection(random(0, this.canvas.width - 1), random(0, this.canvas.height - 1));
    }

    this._update();
    return !this.isDead();
}

CellBot.prototype._update = Cell.prototype._update;
CellBot.prototype._getMapCoordinates = Cell.prototype._getMapCoordinates;
CellBot.prototype.eat = Cell.prototype.eat;
CellBot.prototype.gravityPull = Cell.prototype.gravityPull;
CellBot.prototype.changeDirection = Cell.prototype.changeDirection;

/// Entity physics

CellBot.collisionWallType = 'stopMotion';
if (CellBot.collisionWallType === 'bounce') {
    CellBot.prototype.collisionDetect = CollisionWallBounce;
} else if (CellBot.collisionWallType === "stopMotion") {
    CellBot.prototype.collisionDetect = CollisionWallStopMotion;
} else {
    CellBot.prototype.collisionDetect = () => {
    }
}


export {
    Cell,
    CellBot,
    Food
}