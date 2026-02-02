import { AbstractCollisionHandler } from "./AbstractCollisionHandler.js";
/**
 * Player collision handler that prevents the player from
 * moving through solid objects
 * @author Preston Sia
 */
export class PlayerCollisionHandler extends AbstractCollisionHandler {
    constructor(movementComponent, sizeComponent) {
        super();
        this.movementComponent = movementComponent;
        this.sizeComponent = sizeComponent;
    }
    handleCollision(other, otherBounds) {
        const pos = this.movementComponent.getPosition();
        const playerWidth = this.sizeComponent.getWidth();
        const playerHeight = this.sizeComponent.getHeight();
        const playerLeft = pos.x;
        const playerRight = pos.x + playerWidth;
        const playerTop = pos.y;
        const playerBottom = pos.y + playerHeight;
        const shelfLeft = otherBounds.getLeft();
        const shelfRight = otherBounds.getRight();
        const shelfTop = otherBounds.getTop();
        const shelfBottom = otherBounds.getBottom();
        // Calculate overlap on each axis
        const overlapLeft = playerRight - shelfLeft;
        const overlapRight = shelfRight - playerLeft;
        const overlapTop = playerBottom - shelfTop;
        const overlapBottom = shelfBottom - playerTop;
        // Find the smallest overlap to determine which side to push out from
        const minOverlapX = Math.min(overlapLeft, overlapRight);
        const minOverlapY = Math.min(overlapTop, overlapBottom);
        // Push the player out on the axis with smallest penetration
        if (minOverlapX < minOverlapY) {
            // Resolve on X axis
            if (overlapLeft < overlapRight) {
                // Push player to the left
                pos.x = shelfLeft - playerWidth;
            }
            else {
                // Push player to the right
                pos.x = shelfRight;
            }
        }
        else {
            // Resolve on Y axis
            if (overlapTop < overlapBottom) {
                // Push player up
                pos.y = shelfTop - playerHeight;
            }
            else {
                // Push player down
                pos.y = shelfBottom;
            }
        }
        this.movementComponent.setPosition(pos);
    }
}
