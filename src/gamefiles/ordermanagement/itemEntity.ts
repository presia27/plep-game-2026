import { BasicSize } from "../../componentLibrary/BasicSize.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { staticPositionComponent } from "../../componentLibrary/staticPositionComponent.ts";
import { StaticSpriteRenderer } from "../../componentLibrary/staticSpriteRenderer.ts";
import { Entity } from "../../entity.ts";
import { XY } from "../../typeinterfaces.ts";
import { ASSET_MANAGER } from "../main.ts";
import { getItemMetadata, ItemType } from "./itemTypes.ts";

const ITEM_WIDTH = 60;
const ITEM_HEIGHT = 58;

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
    const pickupSize = new BasicSize(ITEM_WIDTH, ITEM_HEIGHT, 1.25);
    const pickupBounds = new BoundingBox(itemPosition, pickupSize);

    super.addComponent(itemSize);
    super.addComponent(itemPosition);
    super.addComponent(pickupSize);
    super.addComponent(pickupBounds);

    const itemSprite = ASSET_MANAGER.getImageAsset("items");
    if (itemSprite === null) {
      throw new Error("Failed to load spritesheet for items");
    }
    const itemMeta = getItemMetadata(itemType);
    const renderer = new StaticSpriteRenderer(
      itemSprite,
      itemMeta.spriteFrameX,
      itemMeta.spriteFrameY,
      ITEM_WIDTH,
      ITEM_HEIGHT,
      itemPosition,
      itemSize
    );
    super.setRenderer(renderer);
  }
}