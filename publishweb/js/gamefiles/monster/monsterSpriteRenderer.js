import { Animator } from "../../animator.js";
const X_START = 0;
const Y_START = 0;
const Y_OFFSET = 20;
const FRAME_COUNT = 4;
const FRAME_DUR = 0.2; // was set to 0.2 for player
const WIDTH = 20;
const HEIGHT = 19;
const MONSTER_SCALE = 5;
/**
 * Animated sprite renderer that uses directional animations
 * based on the Monster sprite sheet - based on animatedSpriteRenderer.ts for player
 *
 * NOTE: This class is probably redundant to have, but we are simply trying to get as much done as we can, so I am
 * not really worried about that right now. We can clean it up + combine the monster/player class later if there is
 * time.
 * @author Emma Szebenyi
 */
export class MonsterSpriteRenderer {
    /**
     * Creates a monster sprite renderer
     * @param spritesheet The sprite sheet image
     * @param positionComponent The position component to get x,y coordinates
     * @param sizeComponent The size component representing the width and height of the full entity,
     *                      regardless of its bounding box. This is what is used to draw the sprite.
     * @param boundingBox Bounding box component representing the corners of the actual bounding box.
     *    This is used for debugging, hence it is optional
     * @param movementSys The movement system to update movement direction
     */
    constructor(spritesheet, positionComponent, sizeComponent, movementSys, boundingBox) {
        this.spritesheet = spritesheet;
        this.positionComponent = positionComponent;
        this.sizeComponent = sizeComponent;
        this.movementSys = movementSys;
        this.animations = [];
        this.currentDirection = 0; // default facing down
        if (boundingBox) {
            this.boundingBox = boundingBox;
        }
        else {
            this.boundingBox = null;
        }
        this.loadAnimations();
    }
    /**
     * Load all 4 directional animations from the sprite sheet
     */
    loadAnimations() {
        // 0 WALK DOWN
        this.animations.push(new Animator(this.spritesheet, X_START, Y_START, // x, y start
        WIDTH, HEIGHT, // width, height
        FRAME_COUNT, FRAME_DUR, // frame count, frame duration
        0, // frame padding
        false, // reverse
        true, // loop
        false // flipflop
        ));
        // 1 WALK RIGHT
        this.animations.push(new Animator(this.spritesheet, X_START, Y_START + Y_OFFSET, WIDTH, HEIGHT, FRAME_COUNT, FRAME_DUR, 0, false, true, false));
        // 2 WALK UP
        this.animations.push(new Animator(this.spritesheet, X_START, Y_START + Y_OFFSET * 2, WIDTH, HEIGHT, FRAME_COUNT, FRAME_DUR, 0, false, true, false));
        // 3 WALK LEFT
        this.animations.push(new Animator(this.spritesheet, X_START, Y_START + Y_OFFSET * 3, WIDTH, HEIGHT, FRAME_COUNT, FRAME_DUR, 0, false, true, false));
    }
    /**
     * Update the current direction based on input and return if moving
     */
    updateDirection() {
        const up = this.movementSys.isMovingUp();
        const down = this.movementSys.isMovingDown();
        const left = this.movementSys.isMovingLeft();
        const right = this.movementSys.isMovingRight();
        const isMoving = up || down || left || right;
        // Only update direction if moving
        if (isMoving) {
            if (down) {
                this.currentDirection = 0; // DOWN
            }
            else if (left) {
                this.currentDirection = 3; // LEFT
            }
            else if (right) {
                this.currentDirection = 1; // RIGHT
            }
            else if (up) {
                this.currentDirection = 2; // UP
            }
        }
        return isMoving;
    }
    draw(context) {
        const isMoving = this.updateDirection();
        const pos = this.positionComponent.getPosition();
        const animation = this.animations[this.currentDirection];
        if (animation) {
            if (isMoving) {
                // Animate when moving
                animation.drawFrame(context.clockTick, context.ctx, pos.x, pos.y, MONSTER_SCALE);
            }
            else {
                // Draw static idle frame when not moving (first frame of current direction)
                context.ctx.drawImage(this.spritesheet, X_START, Y_START + (this.currentDirection * Y_OFFSET), // x, y on spritesheet
                WIDTH, HEIGHT, // source width, height
                pos.x, pos.y, // destination x, y
                WIDTH * MONSTER_SCALE, HEIGHT * MONSTER_SCALE // destination width, height
                );
            }
        }
        if (context.debug) {
            context.ctx.save();
            // draw the full extent of the entity
            context.ctx.strokeStyle = "#0000cd";
            context.ctx.strokeRect(this.positionComponent.getPosition().x, this.positionComponent.getPosition().y, this.sizeComponent.getWidth(), this.sizeComponent.getHeight());
            // draw bounding box
            context.ctx.strokeStyle = "#ff0000";
            if (this.boundingBox) {
                context.ctx.strokeRect(this.boundingBox.getLeft(), this.boundingBox.getTop(), this.boundingBox.getRight() - this.boundingBox.getLeft(), this.boundingBox.getBottom() - this.boundingBox.getTop());
            }
            context.ctx.restore();
        }
    }
}
