import { IEntity } from "../../classinterfaces.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { AbstractCollisionHandler } from "../../componentLibrary/AbstractCollisionHandler.ts";
import { MovementComponent } from "../../componentLibrary/movementComponent.ts";
import { ISize } from "../../classinterfaces.ts";
import { ShelfController } from "../shelves/shelfController.ts";
import { InputSystem } from "../../inputsys.ts";
import { ItemEntity } from "../ordermanagement/itemEntity.ts";
import { InputAction } from "../../inputactionlist.ts";
import { BasicLifecycle } from "../../componentLibrary/lifecycle.ts";
import { InventoryManager } from "../inventory/inventoryManager.ts";
import { DeliveryController } from "../deliveryEntity/deliveryController.ts";
import { OrderDeliveryLoop } from "../ordermanagement/orderloopsys.ts";
import { WallEntity } from "../scenes/wallEntity.ts";

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
  private inventoryMgr: InventoryManager;
  private orderLoop: OrderDeliveryLoop;

  constructor(
    boundingBox: BoundingBox,
    movementComponent: MovementComponent,
    sizeComponent: ISize,
    inputSys: InputSystem,
    inventoryMgr: InventoryManager,
    orderLoop: OrderDeliveryLoop
  ) {
    super();
    this.boundingBox = boundingBox;
    this.movementComponent = movementComponent;
    this.sizeComponent = sizeComponent;
    this.inputSys = inputSys;
    this.inventoryMgr = inventoryMgr;
    this.orderLoop = orderLoop;
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
      const item = other as ItemEntity;
      const itemType = item.getItemType();
      if (this.inputSys.isActionActiveSingle(InputAction.PICK_UP)) {
        console.log("Picking up " + itemType);
        // Pickup component and remove the component from the canvas
        this.inventoryMgr.addItem(itemType).then(
          function() {
            // promise resolved, remove the item from the shelf
            item.getComponent(BasicLifecycle)?.die();
          },
          function(reject) {}
        );
      }
    }

    // Handle item delivery
    if (other instanceof DeliveryController) {
      const customer = other as DeliveryController;

      if (this.inputSys.isActionActiveSingle(InputAction.FULFILL)) {
        const currentItems = this.inventoryMgr.getAllItems();
        if (currentItems.size > 0 && this.orderLoop.getCurrentActiveOrder()) {
          this.orderLoop.deliverOrder(currentItems);
          this.inventoryMgr.clearItems();
        }
      }
    }

    if (other instanceof WallEntity) {
      const wallLeft = otherBounds.getLeft();
      const wallRight = otherBounds.getRight();
      const wallTop = otherBounds.getTop();
      const wallBottom = otherBounds.getBottom();

      const overlapLeft = playerRight - wallLeft;
      const overlapRight = wallRight - playerLeft;
      const overlapTop = playerBottom - wallTop;
      const overlapBottom = wallBottom - playerTop;

      const minOverlapX = Math.min(overlapLeft, overlapRight);
      const minOverlapY = Math.min(overlapTop, overlapBottom);

      if (minOverlapX < minOverlapY) {
        if (overlapLeft < overlapRight) 
          pos.x = wallLeft - (xOffset + bbWidth);
        else 
          pos.x = wallRight - xOffset;
      } else {
        if (overlapTop < overlapBottom) 
          pos.y = wallTop - (yOffset + bbHeight);
        else 
          pos.y = wallBottom - yOffset;
      }

    }
  }
}
