import Game from "./src/Game.js";

;(function () {
    "use strict";

    window.addEventListener('DOMContentLoaded', function (event) {
        new Boot();
    });

    function Boot() {
        let canvas = document.getElementById('screen');
        if (!canvas.getContext) {
            // canvas-unsupported code here
            alert("Unsupported browser :/");
            throw new Error("Unsupported browser :/");
        }

        let game = new Game(canvas);
        game.run();

    }

})();

// let b = document.querySelector("body");
// b.textContent = `W = ${Math.floor(window.innerWidth / 64)}  H = ${Math.floor(window.innerHeight / 64)}`;



