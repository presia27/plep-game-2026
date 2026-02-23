import { BasicSize } from "../../componentLibrary/BasicSize.js";
import { BoundingBox } from "../../componentLibrary/boundingBox.js";
import { staticPositionComponent } from "../../componentLibrary/staticPositionComponent.js";
import { Entity } from "../../entity.js";
import { ASSET_MANAGER } from "../main.js";
import { ItemCollisionHandler } from "./itemCollisionHandler.js";
import { ItemLifecycle } from "./itemLifecycle.js";
import { ItemRenderer } from "./itemRenderer.js";
import { getItemMetadata } from "./itemTypes.js";
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
    constructor(itemType, positionXY) {
        super();
        this.itemType = itemType;
        const itemSize = new BasicSize(ITEM_WIDTH, ITEM_HEIGHT, 1);
        const itemPosition = new staticPositionComponent(positionXY);
        const pickupSize = new BasicSize(ITEM_WIDTH, ITEM_HEIGHT, PICKUP_RADIUS_MULTIPLIER);
        const pickupBounds = new BoundingBox(itemPosition, pickupSize, -((ITEM_WIDTH * PICKUP_RADIUS_MULTIPLIER - ITEM_WIDTH) / 2), -((ITEM_HEIGHT * PICKUP_RADIUS_MULTIPLIER - ITEM_HEIGHT) / 2));
        const lifecycle = new ItemLifecycle();
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
        const renderer = new ItemRenderer(itemSprite, itemMeta.spriteFrameX, itemMeta.spriteFrameY, ITEM_WIDTH, ITEM_HEIGHT, itemPosition, itemSize, pickupBounds);
        const itemCollision = new ItemCollisionHandler(renderer);
        super.addComponent(itemCollision);
        super.setRenderer(renderer);
    }
    getItemType() {
        return this.itemType;
    }
}
