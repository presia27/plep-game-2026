import { IEntity } from "../../classinterfaces.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { AbstractCollisionHandler } from "../../componentLibrary/AbstractCollisionHandler.ts";
import { MovementComponent } from "../../componentLibrary/movementComponent.ts";
import { ISize } from "../../classinterfaces.ts";

/**
 * Player collision handler that prevents the player from
 * moving through solid objects
 * @author Emma and Primo
 */
export class PlayerCollisionHandler extends AbstractCollisionHandler {
  private boundingBox: BoundingBox;
  private movementComponent: MovementComponent;
  private sizeComponent: ISize;

  constructor(boundingBox: BoundingBox, movementComponent: MovementComponent, sizeComponent: ISize) {
    super();
    this.boundingBox = boundingBox;
    this.movementComponent = movementComponent;
    this.sizeComponent = sizeComponent;
  }

  override handleCollision(other: IEntity, otherBounds: BoundingBox): void {
    const pos = this.movementComponent.getPosition();
    const bbWidth = this.boundingBox.getRight() - this.boundingBox.getLeft();
    const bbHeight = this.boundingBox.getBottom() - this.boundingBox.getTop();
    const xOffset = this.boundingBox.getOffsetX();
    const yOffset = this.boundingBox.getOffsetY();
    
    // const playerLeft = pos.x;
    // const playerRight = pos.x + playerWidth;
    // const playerTop = pos.y;
    // const playerBottom = pos.y + playerHeight;
    const playerLeft = this.boundingBox.getLeft();
    const playerRight = this.boundingBox.getRight();
    const playerTop = this.boundingBox.getTop();
    const playerBottom = this.boundingBox.getBottom();

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
        pos.x = shelfLeft - (xOffset + bbWidth);
      } else {
        // Push player to the right
        pos.x = shelfRight - xOffset;
      }
    } else {
      // Resolve on Y axis
      if (overlapTop < overlapBottom) {
        // Push player up
        pos.y = shelfTop - (yOffset + bbHeight);
      } else {
        // Push player down
        pos.y = shelfBottom - yOffset;
      }
    }

    this.movementComponent.setPosition(pos);
  }
}
