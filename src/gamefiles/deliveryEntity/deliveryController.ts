import { ASSET_MANAGER } from "../../gamefiles/main.ts";
import { BasicSize } from "../../componentLibrary/BasicSize.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { MovementComponent } from "../../componentLibrary/movementComponent.ts";
import { staticPositionComponent } from "../../componentLibrary/staticPositionComponent.ts";
import { Entity } from "../../entity.ts";
import { InputSystem } from "../../inputsys.ts";
import { XY } from "../../typeinterfaces.ts";
import { InventoryManager } from "../inventory/inventoryManager.ts";
import { DeliveryCollisionHandler } from "./deliveryCollisionHandler.ts";
import { DeliveryRenderer } from "./deliveryRenderer.ts";

// // CONSTANTS
// const PLAYER_SPEED: number = 300;
// const PLAYER_SIZE_X: number = 20;
// const PLAYER_SIZE_Y: number = 19;
// const PLAYER_BOUND_X: number = 14;
// const PLAYER_BOUND_Y: number = 17;
// const PLAYER_BOUND_OFFSET_X: number = 13;
// const PLAYER_BOUND_OFFSET_Y: number = 11;

const SIZE_WIDTH: number = 300;
const SIZE_HEIGHT: number = 300;

const RADIUS_MULTIPLIER: number = 2;

/**
 * This is the main entity controller for the player.
 * Logic is included to add components representing the player,
 * with the ability to add additional state directly. Any 
 * sharable logic should be added as a component, while
 * state specific to the player can be added here.
 * 
 * @author Preston Sia, Emma Szebenyi
 */
export class DeliveryController extends Entity {

  constructor(
    defaultXY: XY,
    scale: number,
    //inventoryMgr: InventoryManager

  ) {
    super();

    // ADD ESSENTIAL LOGIC COMPONENTS
    const deliveryPosition = new staticPositionComponent(defaultXY);
    const deliverySize = new BasicSize(SIZE_WIDTH, SIZE_HEIGHT, scale);
    const deliveryBoundSize = new BasicSize(SIZE_WIDTH * RADIUS_MULTIPLIER, SIZE_HEIGHT * RADIUS_MULTIPLIER, scale);

    const deliveryBoundingBox = new BoundingBox(
      deliveryPosition,
      deliveryBoundSize,
      -((SIZE_WIDTH * RADIUS_MULTIPLIER - SIZE_WIDTH) / 2),
      -((SIZE_HEIGHT * RADIUS_MULTIPLIER - SIZE_HEIGHT) / 2)
    );


    const deliveryCollisionHandler = new DeliveryCollisionHandler();

    super.addComponent(deliveryPosition)
    super.addComponent(deliveryBoundingBox);
    super.addComponent(deliveryCollisionHandler);

    const vehicleSpritesheet = ASSET_MANAGER.getImageAsset("vehicles");
    if (vehicleSpritesheet === null) {
      throw new Error("Failed to load asset for the vehicles (delivery entity)");
    }
    //const renderer = new DeliveryRenderer(vehicleSpritesheet, 0, 0, vehicleSpritesheet.width, vehicleSpritesheet.height,
    //  deliveryPosition, deliverySize, deliveryBoundingBox);
    //super.setRenderer(renderer);
  }
}