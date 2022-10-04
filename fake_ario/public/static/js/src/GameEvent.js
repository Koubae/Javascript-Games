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