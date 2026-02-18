import AssetManager from "../../assetmanager.ts";
import { GameContext, IEntity, IScene } from "../../classinterfaces.ts";
import { CollisionSystem } from "../../collisionsys.ts";
import GameEngine from "../../gameengine.ts";
import { InputSystem } from "../../inputsys.ts";
import SceneManager from "../../sceneManager.ts";
import { XY } from "../../typeinterfaces.ts";
import { ASSET_MANAGER } from "../main.ts";
import { PlayerController } from "../player/playerController.ts";
import { ShelfController } from "../shelves/shelfController.ts";
import { DoorTrigger } from "./doorTrigger.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";

/** Describes a single shelf's position and which sprite to use */
interface ShelfData {
  position: XY;
  spriteId: string;
}

/** Describes a door trigger's position, size, and which scene it leads to */
interface DoorData {
  position: XY;
  size: XY;
  targetSceneId: string;
}

/**
 * Base class for all room scenes.
 * Handles all common setup logic so individual rooms only
 * need to define their data via the abstract methods below.
 *
 * To create a new room, extend this class and implement:
 *   - getPlayerSpawnPoint()
 *   - getShelfPositions()
 *   - getDoorTriggers()
 *
 * @author Luke Willis, Claude Sonnet 4.5
 */
export abstract class BaseRoomScene implements IScene {
  protected inputSystem: InputSystem;
  protected collisionSystem: CollisionSystem;
  protected entities: IEntity[] = []; // owned by the scene for caching on resume

  constructor(game: GameEngine) {
    this.inputSystem = game.getInputSystem();
    this.collisionSystem = game.getCollisionSystem();
  }

  // -------------------------------------------------------
  // Abstract methods — subclasses define these to describe
  // their room layout. This is the only code you need to
  // write when adding a new room.
  // -------------------------------------------------------

  /** Where the player spawns when first entering this room */
  protected abstract getPlayerSpawnPoint(): XY;

  /**
   * List of shelves in the room.
   * Each shelf has its own position and sprite id,
   * allowing multiple shelf styles in the same room.
   */
  protected abstract getShelfPositions(): ShelfData[];

  /**
   * List of door triggers in the room.
   * Each door has a position, size (the trigger zone), and
   * the id of the scene it leads to.
   */
  protected abstract getDoorTriggers(): DoorData[];

  // -------------------------------------------------------
  // Common setup logic — no need to touch this in subclasses
  // -------------------------------------------------------

  onEnter(sceneManager: SceneManager): void {
    // --- Player ---
    const player = new PlayerController(
      ASSET_MANAGER,
      this.inputSystem,
      this.getPlayerSpawnPoint(),
      5,
      sceneManager.gameState.inventoryManager
    );
    this.entities.push(player);
    sceneManager.addEntity(player);
    this.collisionSystem.addEntity(player);

    // --- Shelves ---
    for (const shelfData of this.getShelfPositions()) {
      const shelfSprite = ASSET_MANAGER.getImageAsset(shelfData.spriteId);
      if (shelfSprite === null) {
        throw new Error(`Failed to load shelf sprite: "${shelfData.spriteId}"`);
      }
      const shelf = new ShelfController(shelfData.position, shelfSprite);
      this.entities.push(shelf);
      sceneManager.addEntity(shelf);
      this.collisionSystem.addEntity(shelf);
    }

    // --- Door triggers ---
    const playerBoundingBox = player.getComponent(BoundingBox);
    if (playerBoundingBox === null) {
      throw new Error("Player is missing a BoundingBox component");
    }

    for (const door of this.getDoorTriggers()) {
      const trigger = new DoorTrigger(
        door.position,
        door.size,
        door.targetSceneId,
        sceneManager,
        playerBoundingBox!
      );
      this.entities.push(trigger);
      sceneManager.addEntity(trigger);
    }
  }

  /**
   * Called when the player returns to this room.
   * Re-registers cached entities with the SceneManager
   * so they get updated and drawn again — without
   * recreating them from scratch.
   */
  onResume(sceneManager: SceneManager): void {
    for (const entity of this.entities) {
      sceneManager.addEntity(entity);
    }
  }

  onExit(): void {
    // no teardown needed since we're preserving state via caching
  }

  update(context: GameContext): void {}
  draw(context: GameContext): void {}
}