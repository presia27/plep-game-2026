import { IEntity } from "../../classinterfaces.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { AbstractCollisionHandler } from "../../componentLibrary/AbstractCollisionHandler.ts";
import { MovementComponent } from "../../componentLibrary/movementComponent.ts";
import { ISize } from "../../classinterfaces.ts";
import { ShelfController } from "../shelves/shelfController.ts";
import { InputSystem } from "../../inputsys.ts";
import { ItemEntity } from "../ordermanagement/itemEntity.ts";
import { InputAction } from "../../inputactionlist.ts";

/**
 * Player collision handler that prevents the player from
 * moving through solid objects
 * @author Emma and Primo, Preston
 */
export class PlayerCollisionHandler extends AbstractCollisionHandler {
  private boundingBox: BoundingBox;
  private movementComponent: MovementComponent;
  private sizeComponent: ISize;
  private inputSys: InputSystem;

  constructor(boundingBox: BoundingBox, movementComponent: MovementComponent, sizeComponent: ISize, inputSys: InputSystem) {
    super();
    this.boundingBox = boundingBox;
    this.movementComponent = movementComponent;
    this.sizeComponent = sizeComponent;
    this.inputSys = inputSys;
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

    // Do not allow walking through the following objects
    if (other instanceof ShelfController) {
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

    // handle item collisions and pickups
    if (other instanceof ItemEntity) {
      if (this.inputSys.isActionActiveSingle(InputAction.PICK_UP)) {
        console.log("Picking up " + (other as ItemEntity).getItemType());
      }
    }
  }
}
