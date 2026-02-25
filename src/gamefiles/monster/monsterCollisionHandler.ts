import { IEntity } from "../../classinterfaces.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { AbstractCollisionHandler } from "../../componentLibrary/AbstractCollisionHandler.ts";
import { MovementComponent } from "../../componentLibrary/movementComponent.ts";
import { ISize } from "../../classinterfaces.ts";
import { ShelfController } from "../shelves/shelfController.ts";
import { InputSystem } from "../../inputsys.ts";
import { PlayerController } from "../player/playerController.ts";

/**
 * Monster collision handler that prevents the monster from moving through solid objects
 * Based on the player collision handler
 * @author Emma Szebenyi
 */
export class MonsterCollisionHandler extends AbstractCollisionHandler {
  private boundingBox: BoundingBox;
  private movementComponent: MovementComponent;
  private sizeComponent: ISize;
  private inputSys: InputSystem;

  /**
   * A monster collision handler that deals with moving around the room
   * 
   * @param boundingBox the bounding box for the monster
   * @param movementComponent movement system
   * @param sizeComponent size of monster
   * @param inputSys input system
   */
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
    
    // const monsterLeft = pos.x;
    // const monsterRight = pos.x + playerWidth;
    // const playerTop = pos.y;
    // const monsterBottom = pos.y + playerHeight;
    const monsterLeft = this.boundingBox.getLeft();
    const monsterRight = this.boundingBox.getRight();
    const monsterTop = this.boundingBox.getTop();
    const monsterBottom = this.boundingBox.getBottom();

    // Do not allow walking through the following objects
    if (other instanceof ShelfController) {
      const shelfLeft = otherBounds.getLeft();
      const shelfRight = otherBounds.getRight();
      const shelfTop = otherBounds.getTop();
      const shelfBottom = otherBounds.getBottom();

      // Calculate overlap on each axis
      const overlapLeft = monsterRight - shelfLeft;
      const overlapRight = shelfRight - monsterLeft;
      const overlapTop = monsterBottom - shelfTop;
      const overlapBottom = shelfBottom - monsterTop;

      // Find the smallest overlap to determine which side to push out from
      const minOverlapX = Math.min(overlapLeft, overlapRight);
      const minOverlapY = Math.min(overlapTop, overlapBottom);

      // Push the monster out on the axis with smallest penetration
      if (minOverlapX < minOverlapY) {
        // Resolve on X axis
        if (overlapLeft < overlapRight) {
          // Push monster to the left
          pos.x = shelfLeft - (xOffset + bbWidth);
        } else {
          // Push monster to the right
          pos.x = shelfRight - xOffset;
        }
      } else {
        // Resolve on Y axis
        if (overlapTop < overlapBottom) {
          // Push monster up
          pos.y = shelfTop - (yOffset + bbHeight);
        } else {
          // Push monster down
          pos.y = shelfBottom - yOffset;
        }
      }

      this.movementComponent.setPosition(pos);
    }

    // handle player collision
    if (other instanceof PlayerController) {
      const player = other as PlayerController;
      console.log("Monster ran into player");
    }
  }
}
