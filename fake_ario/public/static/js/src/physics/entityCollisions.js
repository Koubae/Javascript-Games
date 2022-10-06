"use strict";

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

export {
    CollisionWallStopMotion,
    CollisionWallBounce
}