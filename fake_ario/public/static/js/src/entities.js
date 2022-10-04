"use strict";

import {circle} from "./paintings.js";
import {randomRGB} from "./utils.js";
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
    this.gravity = 100;
    this.velocityX = this.BASE_SPEED;
    this.velocityY = this.BASE_SPEED;
    this.lastMovementTimeStamp = 0;

    this.color = `rgb(255, 0, 0)`


}

Cell.prototype.draw = function () {
    circle(this.ctx, this.x, this.y, this.mass, this.color);
}

Cell.prototype.update = function (clickX, clickY, clickClock, zoom) {
    this.draw();
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
Cell.prototype.eat = function(entity, diffX, diffY) {
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


function Food(canvas, ctx, x, y) {
    Cell.call(this, canvas, ctx)
    this.x = x;
    this.y = y;
    this.mass = 50 / 4;
    this.color = randomRGB();

}

Food.prototype.draw = Cell.prototype.draw;
Food.prototype.update = function (cell) {
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
    this.draw();
    return true;
}


export {
    Cell,
    Food
}