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
import { ASSET_MANAGER } from "../main.ts";
import { Ball } from "../scenes/storeExterior/ballController.ts";
import { Bush } from "../scenes/storeExterior/bushController.ts";
import { VehicleEntity } from "../scenes/storeExterior/vehicleEntity.ts";
import { SelfCheckout } from "../scenes/storeInterior/selfCheckoutController.ts";
import { ShoppingCart } from "../scenes/storeInterior/shoppingCartController.ts";
import { XY } from "../../typeinterfaces.ts";
import { MonsterEntity } from "../monster/monsterEntity.ts";

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
  private enemyCooldownFlag: boolean = false;

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
    const pos: XY = { x: this.movementComponent.getPosition().x, y: this.movementComponent.getPosition().y };
    const bbWidth = this.boundingBox.getRight() - this.boundingBox.getLeft();
    const bbHeight = this.boundingBox.getBottom() - this.boundingBox.getTop();
    const xOffset = this.boundingBox.getOffsetX();
    const yOffset = this.boundingBox.getOffsetY();

    const playerLeft = this.boundingBox.getLeft();
    const playerRight = this.boundingBox.getRight();
    const playerTop = this.boundingBox.getTop();
    const playerBottom = this.boundingBox.getBottom();

    // Do not allow walking through the following objects
    if (
      other instanceof ShelfController
      || other instanceof WallEntity
      || other instanceof Ball
      || other instanceof Bush
      || other instanceof VehicleEntity
      || other instanceof SelfCheckout
      || other instanceof ShoppingCart
    ) {
      const othLeft = otherBounds.getLeft();
      const othRight = otherBounds.getRight();
      const othTop = otherBounds.getTop();
      const othBottom = otherBounds.getBottom();

      // Calculate overlap on each axis
      const overlapLeft = playerRight - othLeft;
      const overlapRight = othRight - playerLeft;
      const overlapTop = playerBottom - othTop;
      const overlapBottom = othBottom - playerTop;

      // Find the smallest overlap to determine which side to push out from
      const minOverlapX = Math.min(overlapLeft, overlapRight);
      const minOverlapY = Math.min(overlapTop, overlapBottom);

      // Push the player out on the axis with smallest penetration
      if (minOverlapX < minOverlapY) {
        // Resolve on X axis
        if (overlapLeft < overlapRight) {
          // Push player to the left
          pos.x = othLeft - (xOffset + bbWidth);
        } else {
          // Push player to the right
          pos.x = othRight - xOffset;
        }
      } else {
        // Resolve on Y axis
        if (overlapTop < overlapBottom) {
          // Push player up
          pos.y = othTop - (yOffset + bbHeight);
        } else {
          // Push player down
          pos.y = othBottom - yOffset;
        }
      }

      this.movementComponent.setPosition(pos);
    }

    // handle item collisions and pickups
    if (other instanceof ItemEntity) {
      const item = other as ItemEntity;
      const itemType = item.getItemType();
      if (this.inputSys.isActionActiveSingle(InputAction.PICK_UP)) {
        //console.debug("Picking up " + itemType);
        
        // Pickup component and remove the component from the canvas
        this.inventoryMgr.addItem(itemType).then(
          function () {
            // Play pickup sound
            ASSET_MANAGER.playMusic("itemPickup");

            // promise resolved, remove the item from the shelf
            item.getComponent(BasicLifecycle)?.die();
          },
          function (reject) { }
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

    if (other instanceof MonsterEntity) {
      const decreaseFactor = 0.2;
      const enemyCoolTimeMs = 3000;
      if (!this.enemyCooldownFlag) {
        const currentSpeedBias = this.movementComponent.getSpeedBias();
        this.movementComponent.setSpeedBias(currentSpeedBias - decreaseFactor);
        console.log(this.movementComponent.getSpeedBias());
        this.enemyCooldownFlag = true;
        // to avoid spamming to 0 on collision, use a cooldown
        setTimeout(() => {
          this.enemyCooldownFlag = false;
        }, enemyCoolTimeMs);
      }
      
    }

  }
}
