import { GameContext } from "../../classinterfaces.ts";
import { BasicSize } from "../../componentLibrary/BasicSize.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { staticPositionComponent } from "../../componentLibrary/staticPositionComponent.ts";
import { Entity } from "../../entity.ts";
import { OBS_NEW_ACTIVE_ORDER, OBS_ORDER_COMPLETE, Observer } from "../../observerinterfaces.ts";
import { XY } from "../../typeinterfaces.ts";
import { ASSET_MANAGER } from "../main.ts";
import { ItemCollisionHandler } from "./itemCollisionHandler.ts";
import { ItemLifecycle } from "./itemLifecycle.ts";
import { ItemRenderer } from "./itemRenderer.ts";
import { getItemMetadata, ItemType } from "./itemTypes.ts";
import { Order } from "./order.ts";

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
export class ItemEntity extends Entity implements Observer {
  private itemType: ItemType;
  private itemRenderer: ItemRenderer; // maintain a local reference to the item renderer to set pulsing

  constructor(itemType: ItemType, positionXY: XY) {
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
      pickupBounds
    );
    this.itemRenderer = renderer;

    const itemCollision = new ItemCollisionHandler(renderer);
    super.addComponent(itemCollision);

    super.setRenderer(renderer);
  }

  /** Take in observer updates when a new active order is available */
  observerUpdate(data: any, propertyName: string): void {
    if (OBS_ORDER_COMPLETE) {
      // disable pulsing when an order is complete in case there are no
      // active orders. If there are, the code below for OBS_NEW_ACTIVE_ORDER
      // will handle it
      this.disablePulsing();
    }
    if (OBS_NEW_ACTIVE_ORDER === propertyName) {
      const newOrderDataCast = data as Order;

      this.disablePulsing(); // first, reset the state

      if (newOrderDataCast.hasItem(this.itemType)) {
        this.enablePulsing(); // enable pulsing if this item is needed
      }
    }
  }

  // Manually make the item pulse
  public enablePulsing(): void {
    this.itemRenderer.setPulsing(true);
  }

  public disablePulsing(): void {
    this.itemRenderer.setPulsing(false);
  }

  public getItemType(): ItemType {
    return this.itemType;
  }
}