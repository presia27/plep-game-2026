/**
 * Animates a user-defined portion of a spritesheet.
 * An instance of Animator can be said to contain
 * instructions for drawing a specific series of frames
 * that form an animation.
 *
 * @author Preston Sia, Chris Marriott
 */
export class Animator {
    /**
     *
     * @param {HTMLImageElement} spritesheet Spritesheet image
     * @param {number} xStart starting X coordinate of the first frame
     * @param {number} yStart starting Y coordinate of the first frame
     * @param {number} width width of the frame
     * @param {number} height height of the frame
     * @param {number} frameCount number of frames that make up the animation
     * @param {number} frameDuration how long each frame should be painted on the canvas
     * @param {number} framePadding amount of empty padding between each frame
     * @param {boolean} reverse flag to reverse the order in which frames are drawn
     * @param {boolean} loop specify if the animation is a looping animation
     * @param {boolean} flipflop runs in alternating reverse and forward order
     */
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop, flipflop) {
        this.spritesheet = spritesheet;
        this.xStart = xStart;
        this.yStart = yStart;
        this.width = width;
        this.height = height;
        this.frameCount = frameCount;
        this.frameDuration = frameDuration;
        this.framePadding = framePadding;
        this.reverse = reverse;
        this.loop = loop;
        this.flipflop = flipflop;
        this.elapsedTime = 0;
        this.totalTime = this.frameCount * this.frameDuration;
    }
    /**
     * Draw the correct frame within a sequence
     * of frames to form an animation.
     *
     * @param tick Game clock tick
     * @param ctx Reference to HTML canvas
     * @param x x coordinate of where to draw
     * @param y y coordinate of where to draw
     * @param scale image scale factor
     */
    drawFrame(tick, ctx, x, y, scale) {
        this.elapsedTime += tick;
        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime; // go back to the beginning if looping
                if (this.flipflop) { // if flipflopping is enabled, set to reverse order
                    this.reverse = !this.reverse;
                }
            }
        }
        let frame = this.currentFrame();
        if (this.reverse) {
            frame = this.frameCount - frame - 1;
        }
        ctx.drawImage(this.spritesheet, this.xStart + frame * (this.width + this.framePadding), this.yStart, // source from sheet
        this.width, this.height, x, y, this.width * scale, this.height * scale);
    }
    /**
     * Same as drawFrame, but with a bounding box around it
     * for debugging purposes.
     *
     * @param tick Game clock tick
     * @param ctx Reference to HTML canvas
     * @param x x coordinate of where to draw
     * @param y y coordinate of where to draw
     * @param scale image scale factor
     */
    drawFrameWithBoundingBox(tick, ctx, x, y, scale) {
        ctx.save();
        ctx.strokeStyle = "red";
        ctx.strokeRect(x, y, this.width * scale, this.height * scale);
        ctx.restore();
        this.drawFrame(tick, ctx, x, y, scale);
    }
    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    }
    isDone() {
        return (this.elapsedTime >= this.totalTime);
    }
}
