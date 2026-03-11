import { BasicSize } from "../../componentLibrary/BasicSize.js";
import { BoundingBox } from "../../componentLibrary/boundingBox.js";
import { MovementComponent } from "../../componentLibrary/movementComponent.js";
import { Entity } from "../../entity.js";
import { AnimatedSpriteRenderer } from "./animatedSpriteRenderer.js";
import { PlayerCollisionHandler } from "./playerCollisionHandler.js";
import { PlayerInputController } from "./playerInputController.js";
// CONSTANTS
const PLAYER_SPEED = 300;
const PLAYER_SIZE_X = 20;
const PLAYER_SIZE_Y = 19;
const PLAYER_BOUND_X = 14;
const PLAYER_BOUND_Y = 17;
const PLAYER_BOUND_OFFSET_X = 13;
const PLAYER_BOUND_OFFSET_Y = 11;
/**
 * This is the main entity controller for the player.
 * Logic is included to add components representing the player,
 * with the ability to add additional state directly. Any
 * sharable logic should be added as a component, while
 * state specific to the player can be added here.
 *
 * @author Preston Sia
 */
export class PlayerController extends Entity {
    constructor(assetManager, inputSystem, defaultXY, scale, inventoryMgr, orderLoop) {
        super();
        // ADD ESSENTIAL LOGIC COMPONENTS
        const playerMovementAndPosition = new MovementComponent(defaultXY);
        const playerInputCtl = new PlayerInputController(playerMovementAndPosition, inputSystem, PLAYER_SPEED);
        const playerSize = new BasicSize(PLAYER_SIZE_X, PLAYER_SIZE_Y, scale);
        const playerBoundSize = new BasicSize(PLAYER_BOUND_X, PLAYER_BOUND_Y, scale);
        const playerBoundingBox = new BoundingBox(playerMovementAndPosition, playerBoundSize, PLAYER_BOUND_OFFSET_X, PLAYER_BOUND_OFFSET_Y);
        const playerCollisionHandler = new PlayerCollisionHandler(playerBoundingBox, playerMovementAndPosition, playerSize, inputSystem, inventoryMgr, orderLoop);
        super.addComponent(playerMovementAndPosition);
        super.addComponent(playerInputCtl);
        // super.addComponent(playerSize);
        // super.addComponent(playerBoundSize);
        super.addComponent(playerBoundingBox);
        super.addComponent(playerCollisionHandler);
        const playerSprite = assetManager.getImageAsset("player");
        if (playerSprite === null) {
            throw new Error("Failed to load asset for the player");
        }
        const renderer = new AnimatedSpriteRenderer(playerSprite, playerMovementAndPosition, playerSize, inputSystem, scale, playerBoundingBox);
        super.setRenderer(renderer);
    }
}
