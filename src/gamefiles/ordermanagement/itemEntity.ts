import { GameContext } from "../../classinterfaces.ts";
import { BasicSize } from "../../componentLibrary/BasicSize.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { staticPositionComponent } from "../../componentLibrary/staticPositionComponent.ts";
import { Entity } from "../../entity.ts";
import { XY } from "../../typeinterfaces.ts";
import { ASSET_MANAGER } from "../main.ts";
import { ItemCollisionHandler } from "./itemCollisionHandler.ts";
import { ItemLifecycle } from "./itemLifecycle.ts";
import { ItemRenderer } from "./itemRenderer.ts";
import { getItemMetadata, ItemType } from "./itemTypes.ts";
import { OrderDeliveryLoop } from "./orderloopsys.ts";

export const ITEM_WIDTH = 8; //60;
export const ITEM_HEIGHT = 8; //58;
export const ITEM_SCALE = 5;
/** 
 * multiplies the with and height by this number to determine the bounds within
 * which a player can pickup items
 */
const PICKUP_RADIUS_MULTIPLIER = 2;

/**
 * Represents a concrete Item entity that
 * can be picked up in the game. This is
 * analogous to a physical item in a store
 * that a person can hold, whereas the itemTypes
 * represent item information
 * 
 * @author Preston
 */
export class ItemEntity extends Entity {
  private itemType: ItemType;

  constructor(itemType: ItemType, positionXY: XY, orderLoop: OrderDeliveryLoop | null = null) {
    super();

    this.itemType = itemType;

    const itemSize = new BasicSize(ITEM_WIDTH, ITEM_HEIGHT, ITEM_SCALE);
    const itemPosition = new staticPositionComponent(positionXY);
    const pickupSize = new BasicSize(ITEM_WIDTH * ITEM_SCALE, ITEM_HEIGHT * ITEM_SCALE, PICKUP_RADIUS_MULTIPLIER);
    const pickupBounds = new BoundingBox(
      itemPosition,
      pickupSize,
      -(((ITEM_WIDTH * ITEM_SCALE) * PICKUP_RADIUS_MULTIPLIER - (ITEM_WIDTH * ITEM_SCALE)) / 2),
      -(((ITEM_HEIGHT * ITEM_SCALE) * PICKUP_RADIUS_MULTIPLIER - (ITEM_HEIGHT * ITEM_SCALE)) / 2));
    
    const lifecycle = new ItemLifecycle();

    super.addComponent(itemSize);
    super.addComponent(itemPosition);
    super.addComponent(pickupSize);
    super.addComponent(pickupBounds);

    super.addComponent(lifecycle);

    const itemSprite = ASSET_MANAGER.getImageAsset("items2");
    if (itemSprite === null) {
      throw new Error("Failed to load spritesheet for items");
    }
    const itemMeta = getItemMetadata(itemType);
    const renderer = new ItemRenderer(
      itemSprite,
      itemMeta.spriteFrameX,
      itemMeta.spriteFrameY,
      ITEM_WIDTH,
      ITEM_HEIGHT,
      itemPosition,
      itemSize,
      itemType,
      orderLoop,
      pickupBounds
    );

    const itemCollision = new ItemCollisionHandler(renderer);
    super.addComponent(itemCollision);

    super.setRenderer(renderer);
  }

  public getItemType(): ItemType {
    return this.itemType;
  }
}