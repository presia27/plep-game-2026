import { ASSET_MANAGER } from "../../gamefiles/main.js";
import { BasicSize } from "../../componentLibrary/BasicSize.js";
import { BoundingBox } from "../../componentLibrary/boundingBox.js";
import { staticPositionComponent } from "../../componentLibrary/staticPositionComponent.js";
import { Entity } from "../../entity.js";
import { DeliveryCollisionHandler } from "./deliveryCollisionHandler.js";
import { DeliveryRenderer } from "./deliveryRenderer.js";
// // CONSTANTS
// const PLAYER_SPEED: number = 300;
// const PLAYER_SIZE_X: number = 20;
// const PLAYER_SIZE_Y: number = 19;
// const PLAYER_BOUND_X: number = 14;
// const PLAYER_BOUND_Y: number = 17;
// const PLAYER_BOUND_OFFSET_X: number = 13;
// const PLAYER_BOUND_OFFSET_Y: number = 11;
const SIZE_WIDTH = 340;
const SIZE_HEIGHT = 164;
const RADIUS_MULTIPLIER = 2;
/**
 * This is the main entity controller for the player.
 * Logic is included to add components representing the player,
 * with the ability to add additional state directly. Any
 * sharable logic should be added as a component, while
 * state specific to the player can be added here.
 *
 * @author Preston Sia
 */
export class DeliveryController extends Entity {
    constructor(defaultXY, scale) {
        super();
        // ADD ESSENTIAL LOGIC COMPONENTS
        const deliveryPosition = new staticPositionComponent(defaultXY);
        const deliverySize = new BasicSize(SIZE_WIDTH, SIZE_HEIGHT, scale);
        const deliveryBoundSize = new BasicSize(SIZE_WIDTH * RADIUS_MULTIPLIER, SIZE_HEIGHT * RADIUS_MULTIPLIER, scale);
        const deliveryBoundingBox = new BoundingBox(deliveryPosition, deliveryBoundSize, -((SIZE_WIDTH * RADIUS_MULTIPLIER - SIZE_WIDTH) / 2), -((SIZE_HEIGHT * RADIUS_MULTIPLIER - SIZE_HEIGHT) / 2));
        const deliveryCollisionHandler = new DeliveryCollisionHandler();
        super.addComponent(deliveryPosition);
        super.addComponent(deliveryBoundingBox);
        super.addComponent(deliveryCollisionHandler);
        const deliveryImage = ASSET_MANAGER.getImageAsset("deliveryImage");
        if (deliveryImage === null) {
            throw new Error("Failed to load asset for the deliveryEntity");
        }
        const renderer = new DeliveryRenderer(deliveryImage, 0, 0, deliveryImage.width, deliveryImage.height, deliveryPosition, deliverySize, deliveryBoundingBox);
        super.setRenderer(renderer);
    }
}
