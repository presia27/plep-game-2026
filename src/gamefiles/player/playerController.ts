import AssetManager from "../../assetmanager.ts";
import { BasicSize } from "../../componentLibrary/BasicSize.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { MovementComponent } from "../../componentLibrary/movementComponent.ts";
import { Entity } from "../../entity.ts";
import { InputSystem } from "../../inputsys.ts";
import { XY } from "../../typeinterfaces.ts";
import { AnimatedSpriteRenderer } from "./animatedSpriteRenderer.ts";
import { PlayerCollisionHandler } from "./playerCollisionHandler.ts";
import { PlayerInputController } from "./playerInputController.ts";

// CONSTANTS
const PLAYER_SPEED: number = 150;
const PLAYER_SIZE_X: number = 20;
const PLAYER_SIZE_Y: number = 19;
const PLAYER_BOUND_X: number = 14;
const PLAYER_BOUND_Y: number = 17;
const PLAYER_BOUND_OFFSET_X: number = 13;
const PLAYER_BOUND_OFFSET_Y: number = 11;

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


  constructor(
    assetManager: AssetManager,
    inputSystem: InputSystem,
    defaultXY: XY,
    scale: number
  ) {
    super();

    // ADD ESSENTIAL LOGIC COMPONENTS
    const playerMovementAndPosition = new MovementComponent(defaultXY);
    const playerInputCtl = new PlayerInputController(playerMovementAndPosition, inputSystem, PLAYER_SPEED)
    const playerSize = new BasicSize(PLAYER_SIZE_X, PLAYER_SIZE_Y, scale);
    const playerBoundSize = new BasicSize(PLAYER_BOUND_X, PLAYER_BOUND_Y, scale);
    const playerBoundingBox = new BoundingBox(playerMovementAndPosition, playerBoundSize, PLAYER_BOUND_OFFSET_X, PLAYER_BOUND_OFFSET_Y);
    const playerCollisionHandler = new PlayerCollisionHandler(playerBoundingBox, playerMovementAndPosition, playerSize);
    super.addComponent(playerMovementAndPosition)
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