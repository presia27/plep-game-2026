import { BasicSize } from "../../componentLibrary/BasicSize.js";
import { BoundingBox } from "../../componentLibrary/boundingBox.js";
import { staticPositionComponent } from "../../componentLibrary/staticPositionComponent.js";
import { Entity } from "../../entity.js";
import { OBS_NEW_ACTIVE_ORDER, OBS_ORDER_COMPLETE } from "../../observerinterfaces.js";
import { ASSET_MANAGER } from "../main.js";
import { ItemCollisionHandler } from "./itemCollisionHandler.js";
import { ItemLifecycle } from "./itemLifecycle.js";
import { ItemRenderer } from "./itemRenderer.js";
import { getItemMetadata } from "./itemTypes.js";
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
    constructor(itemType, positionXY) {
        super();
        this.itemType = itemType;
        const itemSize = new BasicSize(ITEM_WIDTH, ITEM_HEIGHT, ITEM_SCALE);
        const itemPosition = new staticPositionComponent(positionXY);
        const pickupSize = new BasicSize(ITEM_WIDTH * ITEM_SCALE, ITEM_HEIGHT * ITEM_SCALE, PICKUP_RADIUS_MULTIPLIER);
        const pickupBounds = new BoundingBox(itemPosition, pickupSize, -(((ITEM_WIDTH * ITEM_SCALE) * PICKUP_RADIUS_MULTIPLIER - (ITEM_WIDTH * ITEM_SCALE)) / 2), -(((ITEM_HEIGHT * ITEM_SCALE) * PICKUP_RADIUS_MULTIPLIER - (ITEM_HEIGHT * ITEM_SCALE)) / 2));
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
        const renderer = new ItemRenderer(itemSprite, itemMeta.spriteFrameX, itemMeta.spriteFrameY, ITEM_WIDTH, ITEM_HEIGHT, itemPosition, itemSize, pickupBounds);
        this.itemRenderer = renderer;
        const itemCollision = new ItemCollisionHandler(renderer);
        super.addComponent(itemCollision);
        super.setRenderer(renderer);
    }
    /** Take in observer updates when a new active order is available */
    observerUpdate(data, propertyName) {
        if (OBS_ORDER_COMPLETE) {
            // disable pulsing when an order is complete in case there are no
            // active orders. If there are, the code below for OBS_NEW_ACTIVE_ORDER
            // will handle it
            this.disablePulsing();
        }
        if (OBS_NEW_ACTIVE_ORDER === propertyName) {
            const newOrderDataCast = data;
            this.disablePulsing(); // first, reset the state
            if (newOrderDataCast.hasItem(this.itemType)) {
                this.enablePulsing(); // enable pulsing if this item is needed
            }
        }
    }
    // Manually make the item pulse
    enablePulsing() {
        this.itemRenderer.setPulsing(true);
    }
    disablePulsing() {
        this.itemRenderer.setPulsing(false);
    }
    getItemType() {
        return this.itemType;
    }
}
