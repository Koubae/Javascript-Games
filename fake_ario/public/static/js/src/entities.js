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


function Cell(canvas, ctx) {
    // Movement
    this.MAX_SPEED = 15;
    this.MIN_SPEED = 0.15;
    this.BASE_SPEED = this.MAX_SPEED / 2;
    this.ATTRACTION = 0.5;

    this.ctx = ctx;
    this.canvas = canvas;
    this.x = 250;
    this.y = 250;
    this.mass = 50;
    this.gravity = this.mass + this.mass / 2;
    this.velocityX = this.BASE_SPEED;
    this.velocityY = this.BASE_SPEED;
    this.lastMovementTimeStamp = 0;

    this._dead = false;

    // Animations
    this.animation = undefined;
    this.animationTime = 25.5;

    this.color = `rgb(255, 0, 0)`


}

Cell.prototype.isDead = function () {
    return this._dead;
}

Cell.prototype.die = function () {
    this._dead = true;
    this.x = -1000;
    this.y = -1000;
    this.velocityX = 0;
    this.velocityY = 0;
    this.mass = 0;
    circle(this.ctx, this.x, this.y, this.mass, this.color);
}

Cell.prototype.draw = function (gameClock) {
    if (gameClock === null || this.animation === undefined) {
        circle(this.ctx, this.x, this.y, this.mass, this.color);
    } else {
        this.animation(gameClock);
    }

}

Cell.prototype.update = function (clickX, clickY, clickClock, gameClock) {
    this.draw(gameClock);
    clickX = clickX ? clickX : 0;
    clickY = clickY ? clickY : 0;

    //
    /* register Last Movement
        NOTE: If the lastMovementTimestamp is not equal to the current clickClock, the user
        clicked for a new movement so we need to register it!
     */
    if (this.lastMovementTimeStamp !== clickClock) {
        this.lastMovementTimeStamp = clickClock;
        this.changeDirection(clickX, clickY);
    }

    this.collisionDetect();
    this.x += this.velocityX;
    this.y += this.velocityY;


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

/// Entity Actions
Cell.prototype.eat = function (entity, diffX, diffY) {
    // First Check the position. Is this entity close enough to eat THAT entity?
    if (Math.abs(diffX) > this.mass - 10 || Math.abs(diffY) > this.mass - 10) {
        return false;
    }
    // Next Check. is THIS entity big enough to eat THAT entity?
    // that entity must be at least smaller than THIS entity minus 1/6th of its mass
    if ((this.mass - (this.mass / 6)) < entity.mass) {
        return false;
    }

    let massAcquired = entity.mass / 30;
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

Cell.animationType = 'doubleCellOne';
if (Cell.animationType === 'almostExploding') {
    Cell.prototype.animation = animationAlmostExploding;
} else if (Cell.animationType === 'doubleCellOne') {
    Cell.prototype.animation = animationDoubleCellOne;
} else if (Cell.animationType === 'doubleCellTwo') {
    Cell.prototype.animation = animationDoubleCellTwo;
} else if (Cell.animationType === 'doubleCellThree') {
    Cell.prototype.animation = animationDoubleCellThree;
} else if (Cell.animationType === 'doubleCellFour') {
    Cell.prototype.animation = animationDoubleCellFour;
} else if (Cell.animationType === 'bacteriaOne') {
    Cell.prototype.animation = animationBacteriaOne;
}


function Food(canvas, ctx, x, y) {
    Cell.call(this, canvas, ctx)
    this.x = x;
    this.y = y;
    this.mass = 50 / 4;
    this.gravity = this.mass + this.mass / 2;
    this.color = randomRGB();

}

Food.prototype.draw = Cell.prototype.draw;
Food.prototype.update = function (cell, clickClock, gameClock) {
    if (this.lastMovementTimeStamp !== clickClock) {
        this.lastMovementTimeStamp = clickClock;
    }
    // Algorithm to move object X towards target Y
    // 1) calculate x,y difference between object and target. target is the Minuend and object the Subtrahend
    // 2) Get the distance. Square Root of diffX **2 + diffY **2
    // 3) Check that diffX is less than gravity

    let [distance, diffX, diffY] = calculateDistance(cell, this);
    if (checkEntityProximity(diffX, diffY, cell.gravity)) {
        let isEaten = cell.eat(this, diffX, diffY);
        if (isEaten) return false;

        let [gravityPullX, gravityPullY] = calculateGravityPull(
            [distance, diffX, diffY],
            this,
            cell
        );

        this.x += gravityPullX;
        this.y += gravityPullY;
    }
    this.draw(null);
    return true;
}


function CellBot(canvas, ctx, x, y) {
    Cell.call(this, canvas, ctx)
    this.x = x;
    this.y = y;
    this.mass = random(25, 75);
    this.gravity = this.mass + this.mass / 2;
    this.color = randomRGB();
    this.MAX_SPEED = 8;

    // CellBot Specific
    this.cellActivityRangeMax = random(10, 60); // lower number: very active, highest number less active

}

CellBot.prototype.draw = Cell.prototype.draw;
CellBot.prototype.update = function (cell, clickClock, gameClock) {
    this.draw(gameClock);
    let movementChange = random(0, this.cellActivityRangeMax);
    if (movementChange === 0) {
        this.changeDirection(random(0, this.canvas.width - 1), random(0, this.canvas.height - 1));
    }

    // Check if Cell is eating this CellBot or the opposite

    if (cell.gravity > this.gravity) {
        let [distance, diffX, diffY] = calculateDistance(cell, this);
        if (checkEntityProximity(diffX, diffY, cell.gravity)) {
            let isEaten = cell.eat(this, diffX, diffY);
            if (isEaten) return false;

            let [gravityPullX, gravityPullY] = calculateGravityPull(
                [distance, diffX, diffY],
                this,
                cell
            );

            cell.velocityX += gravityPullX;
            cell.velocityY += gravityPullY;
        }
    } else if (cell.gravity < this.gravity) {
        let [distance, diffX, diffY] = calculateDistance(this, cell);
        if (checkEntityProximity(diffX, diffY, this.gravity)) {
            let isEaten = this.eat(cell, diffX, diffY);
            if (isEaten) {
                cell.die();
            } else {
                let [gravityPullX, gravityPullY] = calculateGravityPull(
                    [distance, diffX, diffY],
                    cell,
                    this
                );

                cell.velocityX += gravityPullX;
                cell.velocityY += gravityPullY;
            }


        }
    }

    this.collisionDetect();
    this.x += this.velocityX;
    this.y += this.velocityY;
    return true;
}

CellBot.prototype.eat = Cell.prototype.eat;
CellBot.prototype.changeDirection = Cell.prototype.changeDirection;

/// Entity physics
Cell.collisionWallType = 'bacteriaOne';
CellBot.prototype.collisionDetect = CollisionWallStopMotion;

export {
    Cell,
    CellBot,
    Food
}