"use strict";

import {circle} from "./paintings.js";

// TODO:
// Need to understand how to make an 'interface' like typescript (without typescript) so that
// this methods can be used only if a certain interface / Object prototype implements it.


function CollisionWallStopMotion() {
    const wallXMin = this.x - this.radius / 2;
    const wallXMax = this.x + this.radius / 2;

    const wallYMin = this.y - this.radius / 2;
    const wallYMax = this.y + this.radius / 2;
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
}


function Ball(canvas, ctx) {
    // Movement
    this.MAX_SPEED = 10;
    this.MIN_SPEED = 0.15;
    this.BASE_SPEED = this.MAX_SPEED / 2;
    this.ATTRACTION = 1.5;

    this.ctx = ctx;
    this.canvas = canvas;
    this.x = 250;
    this.y = 250;
    this.radius = 50;
    this.velocityX = this.BASE_SPEED;
    this.velocityY = this.BASE_SPEED;
    this.lastMovementTimeStamp = 0;

    this.color = `rgb(255, 0, 0)`


}

Ball.prototype.draw = function () {
    circle(this.ctx, this.x, this.y, this.radius, this.color);
}

Ball.prototype.update = function (clickX, clickY, clickClock) {
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
        let distance = Math.max(0, Math.sqrt(diff_x * diff_x + diff_y * diff_y) + this.radius * 4);
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

Ball.collisionWallType = 'stopMotion';
if (Ball.collisionWallType === 'bounce') {
    Ball.prototype.collisionDetect = CollisionWallBounce;
} else if (Ball.collisionWallType === "stopMotion") {
    Ball.prototype.collisionDetect = CollisionWallStopMotion;
} else {
    Ball.prototype.collisionDetect = () => {
    }
}


export {
    Ball,
}