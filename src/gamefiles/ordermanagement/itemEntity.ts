import { GameContext } from "../../classinterfaces.ts";
import { BasicSize } from "../../componentLibrary/BasicSize.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { BasicLifecycle } from "../../componentLibrary/lifecycle.ts";
import { staticPositionComponent } from "../../componentLibrary/staticPositionComponent.ts";
import { Entity } from "../../entity.ts";
import { XY } from "../../typeinterfaces.ts";
import { ASSET_MANAGER } from "../main.ts";
import { ItemCollisionHandler } from "./itemCollisionHandler.ts";
import { ItemRenderer } from "./itemRenderer.ts";
import { getItemMetadata, ItemType } from "./itemTypes.ts";

export const ITEM_WIDTH = 60;
export const ITEM_HEIGHT = 58;
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

  constructor(itemType: ItemType, positionXY: XY) {
    super();

    this.itemType = itemType;

    const itemSize = new BasicSize(ITEM_WIDTH, ITEM_HEIGHT, 1);
    const itemPosition = new staticPositionComponent(positionXY);
    const pickupSize = new BasicSize(ITEM_WIDTH, ITEM_HEIGHT, PICKUP_RADIUS_MULTIPLIER);
    const pickupBounds = new BoundingBox(
      itemPosition,
      pickupSize,
      -((ITEM_WIDTH * PICKUP_RADIUS_MULTIPLIER - ITEM_WIDTH) / 2),
      -((ITEM_HEIGHT * PICKUP_RADIUS_MULTIPLIER - ITEM_HEIGHT) / 2));
    
    const lifecycle = new BasicLifecycle();

    super.addComponent(itemSize);
    super.addComponent(itemPosition);
    super.addComponent(pickupSize);
    super.addComponent(pickupBounds);

    super.addComponent(lifecycle);

    const itemSprite = ASSET_MANAGER.getImageAsset("items");
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