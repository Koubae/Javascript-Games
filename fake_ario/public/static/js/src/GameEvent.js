"use strict";
// --------------------------
// Event Listeners
// --------------------------

const GameEvents = {
    game: undefined,
    // Mouse Events
    OnClick(callback, e) {
        callback(e);

    },
    OnMouseUp(e) {

    },
    OnMouseMove(callback, e) {
        callback(e);
    },

    OnMouseWheel(callback, e) {
        let deltaY = e.deltaY;
        let moving = deltaY < 0 ? "up" : "down";

        const zoomBy = 1.1;

        if (moving === "up") {
            this.game.zoom += 0.1;
            if (this.game.zoom > this.game.zoomInMax) this.game.zoom = this.game.zoomInMax;
                                       // zoom in amount
            // this.game.scaleAt("zoomIn");

        } else {
            this.game.zoom -= 0.1;
            if (this.game.zoom < this.game.zoomOutMax) this.game.zoom = this.game.zoomOutMax;
                                       // zoom in amount
            // this.game.scaleAt("zoomOut"); // will zoom out by same amount at mouse x,y

        }



        // this.game.ctx.translate(this.game.ball.x,this.game.ball.y);
        // this.game.ctx.scale(this.game.zoom,this.game.zoom);
        // this.game.ctx.translate(-this.game.ball.x,-this.game.ball.y);


    },

    // Keyboard Events
    keyDownHandler(e) {
        if (!("code" in e)) {
            return;
        }

        switch (e.code) {

            case "KeyJ":
                this.toggleFullScreen(); // @credit: https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API#simple_fullscreen_usage
                break;
            default:
                return;
        }
    },
    keyUpHandler(e) {
        if (!("code" in e)) {
            return;
        }

        switch (e.code) {

            default:
                return;
        }
    },
    resizeCanvas(e) {

        this.game.screenWidth = window.innerWidth * 2;
        this.game.screenHeight = window.innerHeight * 2;
        this.game.canvas.width = this.game.screenWidth;
        this.game.canvas.height = this.game.screenHeight;

        if (this.game.constants.BACKGROUND_TYPE === 'svg' && this.game.background !== undefined) {
            let background = this.game.background;
            if (background) {
                background.style.width = `${this.game.screenWidth}px` ;
                background.style.height = `${this.game.screenHeight}px`;
            }

        }


        /**
         * Your drawings need to be inside this function otherwise they will be reset when
         * you resize the browser window and the canvas goes will be cleared.
         */
    },
    // @credit: https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API#simple_fullscreen_usage
    toggleFullScreen(e) {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    },

}

export default GameEvents;