"use strict";
function circle(ctx, coordX, coordY, mass, color) {
    ctx.beginPath();
    ctx.arc(coordX, coordY, mass, 0, Math.PI * 2, true); // circle
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

export {
    circle,
}