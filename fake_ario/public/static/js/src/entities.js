"use strict";

import {circle} from "./paintings.js";
import {randomRGB, random} from "./utils.js";
// TODO:
// Need to understand how to make an 'interface' like typescript (without typescript) so that
// this methods can be used only if a certain interface / Object prototype implements it.


function CollisionWallStopMotion() {
    const wallXMin = this.x - this.mass / 2;
    const wallXMax = this.x + this.mass / 2;

    const wallYMin = this.y - this.mass / 2;
    const wallYMax = this.y + this.mass / 2;
    if (wallXMax + this.velocityX > this.canvas.width || wallXMin + this.velocityX < 0) {
        this.velocityX = 0;
        this.velocityY /= 2; // Stick effect to the wall
    }
    if (wallYMax + this.velocityY > this.canvas.height || wallYMin + this.velocityY < 0) {
        this.velocityY = 0;
        this.velocityX /= 2; // Stick effect to the wall
    }
}

function CollisionWallBounce() {
    const wallXMin = this.x - this.mass / 2;
    const wallXMax = this.x + this.mass / 2;

    const wallYMin = this.y - this.mass / 2;
    const wallYMax = this.y + this.mass / 2;
    if (wallXMax + this.velocityX > this.canvas.width || wallXMin + this.velocityX < 0) {
        this.velocityX = -this.velocityX;
    }
    if (wallYMax + this.velocityY > this.canvas.height || wallYMin + this.velocityY < 0) {
        this.velocityY = -this.velocityY;
    }
}

function animationAlmostExploding(gameClock) {
    circle(this.ctx, this.x, this.y, this.mass, this.color);
    if (this.animationTimeNext === undefined) {
        this.xR1 = random(0, 10);
        this.yR1 = random(0, 10);
        this.xR2 = random(0, 10);
        this.yR2 = random(0, 10);
        this.xR3 = random(0, 5);
        this.yR3 = random(0, 5);
        this.xR4 = random(0, 5);
        this.yR4 = random(0, 5);
        this.animationTimeNext = gameClock;
    }
    if (gameClock && Math.abs(gameClock - this.animationTimeNext) > this.animationTime) {
        this.animationTimeNext = gameClock;
        this.xR1 = random(0, 10);
        this.yR1 = random(0, 10);
        this.xR2 = random(0, 10);
        this.yR2 = random(0, 10);
        this.xR3 = random(0, 5);
        this.yR3 = random(0, 5);
        this.xR4 = random(0, 5);
        this.yR4 = random(0, 5);
    }
    circle(this.ctx, this.x + this.xR1, this.y + this.yR1, this.mass, this.color);
    circle(this.ctx, this.x + this.xR2, this.y + this.yR2, this.mass, this.color);
    circle(this.ctx, this.x + this.xR3, this.y + this.yR3, this.mass, this.color);
    circle(this.ctx, this.x + this.xR4, this.y + this.yR4, this.mass, this.color);

    circle(this.ctx, this.x - this.xR1, this.y - this.yR1, this.mass, this.color);
    circle(this.ctx, this.x - this.xR2, this.y - this.yR2, this.mass, this.color);
    circle(this.ctx, this.x - this.xR3, this.y - this.yR3, this.mass, this.color);
    circle(this.ctx, this.x - this.xR4, this.y - this.yR4, this.mass, this.color);


}


function animationDoubleCellOne(gameClock) {
    circle(this.ctx, this.x, this.y, this.mass, this.color);
    if (this.animationTimeNext === undefined) {
        this.animationTimeNext = gameClock;
        this.radX = -2;
        this.radY = 2;
        this.animationTime += 50;
        this.roation = 0;
    }
    if (gameClock && Math.abs(gameClock - this.animationTimeNext) > this.animationTime) {
        this.animationTimeNext = gameClock;
        this.radX = this.radX === 2 ? -2 : 2;
        this.radY = this.radY === 2 ? -2 : 2;
        this.roation += 0.8;
        if (this.roation > 365)  this.roation = 0;
    }
    // Draw the ellipse
    this.ctx.beginPath();
    this.ctx.ellipse(this.x, this.y, this.mass + this.radX, this.mass+this.radY, Math.PI / 4 + this.roation, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
}

function animationDoubleCellTwo(gameClock) {
    circle(this.ctx, this.x, this.y, this.mass, this.color);
    if (this.animationTimeNext === undefined) {
        this.animationTimeNext = gameClock;
        this.radX = -4;
        this.radY = 4;
        this.animationTime += 50;
        this.roation = 0;
    }
    if (gameClock && Math.abs(gameClock - this.animationTimeNext) > this.animationTime) {
        this.animationTimeNext = gameClock;
        this.radX = this.radX === 4 ? -4 : 4;
        this.radY = this.radY === 4 ? -4 : 4;
        this.roation += 0.2;
        if (this.roation > 365)  this.roation = 0;
    }
    // Draw the ellipse
    this.ctx.beginPath();
    this.ctx.ellipse(this.x, this.y, this.mass + this.radX, this.mass+this.radY, Math.PI / 4 + this.roation, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
}

function animationDoubleCellThree(gameClock) {
    // circle(this.ctx, this.x, this.y, this.mass, this.color);
    if (this.animationTimeNext === undefined) {

        this.animationTimeNext = gameClock;
        this.animationTime += 50;

        this.radX1 = -2;
        this.radY1 = 2;
        this.roation1 = 0;

        this.radX2 = -2;
        this.radY2 = 2;
        this.roation2 = -365;

        this.radX3 = -2;
        this.radY3 = 2;
        this.roation3 = -365;

        this.radX4 = -2;
        this.radY4 = 2;
        this.roation4 = 0;
    }
    if (gameClock && Math.abs(gameClock - this.animationTimeNext) > this.animationTime) {

        this.radX1 = this.radX1 === 2 ? -2 : 2;
        this.radY1 = this.radY1 === 2 ? -2 : 2;
        this.roation1 += 1;
        if (this.roation1 > 365)  this.roation1 = 0

        if (gameClock && Math.abs(gameClock - this.animationTimeNext) > this.animationTime / 2) {
            this.radX2 = this.radX2 === 2 ? -2 : 2;
            this.radY2 = this.radY2 === 2 ? -2 : 2;
            this.roation2 += 1;
            if (this.roation2 > 0)  this.roation2 = -365;
        }

        if (gameClock && Math.abs(gameClock - this.animationTimeNext) > this.animationTime +  25) {
            this.radX3 = this.radX3 === 2 ? -2 : 2;
            this.radY3 = this.radY3 === 2 ? -2 : 2;
            this.roation3 += 1;
            if (this.roation3 > 0)  this.roation3 = -365;
        }

        if (gameClock && Math.abs(gameClock - this.animationTimeNext) > this.animationTime / 2 + 65) {
            this.radX4 = this.radX4 === 2 ? -2 : 2;
            this.radY4 = this.radY4 === 2 ? -2 : 2;
            this.roation4 += 1;
            if (this.roation4 > 365)  this.roation4 = 0;
        }

        this.animationTimeNext = gameClock;

    }



    // Draw the ellipse
    this.ctx.beginPath();
    this.ctx.ellipse(this.x, this.y, this.mass + this.radX1, this.mass+this.radY1, Math.PI / 4 + this.roation1, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();

    // Draw the ellipse
    this.ctx.beginPath();
    this.ctx.ellipse(this.x, this.y, this.mass + this.radX2, this.mass+this.radY2, +(Math.PI / 4 + this.roation2), 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();

    // // Draw the ellipse
    this.ctx.beginPath();
    this.ctx.ellipse(this.x, this.y, this.mass + this.radX3, this.mass+this.radY3, +(Math.PI / 4 + this.roation3), 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();

    // Draw the ellipse
    this.ctx.beginPath();
    this.ctx.ellipse(this.x, this.y, this.mass + this.radX4, this.mass+this.radY4, -(Math.PI / 4 + this.roation4), 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
}


function animationDoubleCellFour(gameClock) {
    // circle(this.ctx, this.x, this.y, this.mass, this.color);
    if (this.animationTimeNext === undefined) {

        this.animationTimeNext = gameClock;
        this.animationTime += 50;

        this.radX = 1;
        this.radY = -2;
        this.roation1 = 0;
        this.roation2 = 90;
        this.roation3 = 180;
        this.roation4 = 320;
    }
    if (gameClock && Math.abs(gameClock - this.animationTimeNext) > this.animationTime) {
        this.roation1 += 1;
        if (this.roation1 > 365)  this.roation1 = 0

        if (gameClock && Math.abs(gameClock - this.animationTimeNext) > this.animationTime - 15) {
            this.roation2 += 1;
            if (this.roation2 > 365)  this.roation2 = 0;
        }

        if (gameClock && Math.abs(gameClock - this.animationTimeNext) > this.animationTime / 2 ) {
            this.roation3 += 1;
            if (this.roation3 > 365)  this.roation3 = 0;
        }

        if (gameClock && Math.abs(gameClock - this.animationTimeNext) > this.animationTime / 2 + 65) {
            this.roation4 += 1;
            if (this.roation4 > 365)  this.roation4 = 0;
        }
        this.animationTimeNext = gameClock;

    }



    // Draw the ellipse
    this.ctx.beginPath();
    this.ctx.ellipse(this.x, this.y, this.mass + this.radX, this.mass+this.radY, Math.PI / 4 + this.roation1, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    // Draw the ellipse
    this.ctx.beginPath();
    this.ctx.ellipse(this.x, this.y, this.mass + this.radX, this.mass+this.radY, -(Math.PI / 4 + this.roation2), 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();

    // // // Draw the ellipse
    this.ctx.beginPath();
    this.ctx.ellipse(this.x, this.y, this.mass + this.radX, this.mass+this.radY, +(Math.PI / 4 + this.roation3), 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    // // Draw the ellipse
    this.ctx.beginPath();
    this.ctx.ellipse(this.x, this.y, this.mass + this.radX, this.mass+this.radY, -(Math.PI / 4 + this.roation3), 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
}

function animationBacteriaOne(gameClock) {
    circle(this.ctx, this.x, this.y, this.mass, this.color);
    if (this.animationTimeNext === undefined) {
        this.animationTimeNext = gameClock;
        this.radX = -8;
        this.radY = 8;

        this.radX2 = 12;
        this.radY2 = -12;

        this.animationTime += 50;
        this.roation = 0;
    }
    if (gameClock && Math.abs(gameClock - this.animationTimeNext) > this.animationTime) {
        this.animationTimeNext = gameClock;
        this.radX = this.radX === 8 ? -8 : 8;
        this.radY = this.radY === 8 ? -8 : 8;

        this.radX2 = this.radX2 === 12 ? -12 : 12;
        this.radY2 = this.radY2 === 12 ? -12 : 12;

        this.roation += 2;
        if (this.roation > 365)  this.roation = 0;
    }
    // Draw the ellipse
    this.ctx.beginPath();
    this.ctx.ellipse(this.x, this.y, this.mass + this.radX, this.mass+this.radY, Math.PI / 4 + this.roation, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();


    this.ctx.beginPath();
    this.ctx.ellipse(this.x, this.y, this.mass + this.radX2, this.mass+this.radY2, Math.PI / 4 + this.roation, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
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
    this.gravity = 300;
    this.velocityX = this.BASE_SPEED;
    this.velocityY = this.BASE_SPEED;
    this.lastMovementTimeStamp = 0;

    // Animations
    this.animationTimeNext = undefined;
    this.animationTime = 25.5;

    this.color = `rgb(255, 0, 0)`



}

Cell.prototype.draw = function (gameClock) {
    if (gameClock === null) {
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
        // Grap the difference of the click with the player position
        let diff_y = clickY - this.y;
        let diff_x = clickX - this.x;
        // Calculate the distance
        let distance = Math.max(0, Math.sqrt(diff_x * diff_x + diff_y * diff_y) + this.mass * 4);

        let speed = distance * this.ATTRACTION; // add attraction
        if (speed > this.MAX_SPEED) speed = this.MAX_SPEED;
        if (speed < this.MIN_SPEED) speed = this.MIN_SPEED;

        this.velocityX = (diff_x / distance) * speed;
        this.velocityY = (diff_y / distance) * speed;

    }

    this.collisionDetect();
    this.x += this.velocityX;
    this.y += this.velocityY;



}

/// Entity Actions
Cell.prototype.eat = function (entity, diffX, diffY) {
    if (Math.abs(diffX) > this.mass - 10 || Math.abs(diffY) > this.mass - 10) {
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

Cell.animationType = 'doubleCellFour';
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
}

else if (Cell.animationType === 'bacteriaOne') {
    Cell.prototype.animation = animationBacteriaOne;
}


function Food(canvas, ctx, x, y) {
    Cell.call(this, canvas, ctx)
    this.x = x;
    this.y = y;
    this.mass = 50 / 4;
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

    let foodX = this.x;
    let foodY = this.y;
    let diffX = cell.x - foodX;
    let diffY = cell.y - foodY;
    let distance = Math.max(0, Math.sqrt(diffX * diffX + diffY * diffY));
    if (Math.abs(diffX) < cell.gravity && Math.abs(diffY) < cell.gravity) {
        let isEaten = cell.eat(this, diffX, diffY);
        if (isEaten) return false;

        this.x += (diffX / distance) * 2;
        this.y += (diffY / distance) * 2;
    }
    this.draw(null);
    return true;
}


export {
    Cell,
    Food
}