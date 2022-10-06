"use strict";

import {circle} from "../paintings.js";
import {random} from "../utils.js";

export {
    animationAlmostExploding,
    animationDoubleCellOne,
    animationDoubleCellTwo,
    animationDoubleCellThree,
    animationDoubleCellFour,
    animationBacteriaOne
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