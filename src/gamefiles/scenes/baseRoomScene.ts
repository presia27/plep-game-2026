import { GameContext, IEntity, IScene } from "../../classinterfaces.ts";
import { CollisionSystem } from "../../collisionsys.ts";
import GameEngine from "../../gameengine.ts";
import { InputSystem } from "../../inputsys.ts";
import SceneManager from "../../sceneManager.ts";
import { XY } from "../../typeinterfaces.ts";
import { ASSET_MANAGER } from "../main.ts";
import { PlayerController } from "../player/playerController.ts";
import { ShelfController, SHELF_WIDTH, SHELF_HEIGHT, SHELF_SCALE } from "../shelves/shelfController.ts";
import { DoorTrigger } from "./doorTrigger.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { MovementComponent } from "../../componentLibrary/movementComponent.ts";
import { DoorData, ShelfData } from "./roomData.ts";
import { ItemType } from "../ordermanagement/itemTypes.ts";
import { ItemEntity } from "../ordermanagement/itemEntity.ts";

/**
 * Altered base class for all room scenes.
 * Handles all common setup logic so individual rooms only
 * ned to define their data via abstract methods.
 * 
 * @author Luke Willis, Claude Sonnet 4.5, Preston Sia
 */
export abstract class BaseRoomScene implements IScene {
  protected inputSystem: InputSystem;
  protected collisionSystem: CollisionSystem;
  protected localEntities: IEntity[];

  constructor(game: GameEngine) {
    this.inputSystem = game.getInputSystem();
    this.collisionSystem = game.getCollisionSystem();
    this.localEntities = [];
  }

  protected abstract getPlayerSpawnPoint(): XY;
  protected abstract getShelfPositions(): ShelfData[];
  protected abstract getDoorTriggers(): DoorData[];
  protected abstract getAllowedItems(): ItemType[];
  abstract getRoomId(): string;

  /**
   * Loads scene data and adds them as actual instances
   * to the scene manager.
   * @param sceneManager Scene manager
   */
  onEnter(sceneManager: SceneManager): void {
    console.log("Loading scene " + this.getRoomId());
    // Attempt to find the current player
    let player: PlayerController | null;
    const existingPlayer = sceneManager.getLevelEntities().find(
      entity => entity instanceof PlayerController
    );

    if (existingPlayer) {
      player = existingPlayer as PlayerController;

      // Reuse existing player, just update spawn point
      player = existingPlayer as PlayerController;
      const movementComponent = player.getComponent(MovementComponent);
      if (movementComponent) {
        movementComponent.setPosition(this.getPlayerSpawnPoint());
      }
    } else {
      player = null;
      console.error("Player not found during scene load");
    }

    /* Allow the adding of items */
    const allowedItems = this.getAllowedItems();
    let itemIndex = 0;
    /* Create and load shelving */
    for (const shelfData of this.getShelfPositions()) {
      const shelfSprite = ASSET_MANAGER.getImageAsset(shelfData.spriteId);
      if (shelfSprite === null) {
        throw new Error(`Failed to load shelf sprite: "${shelfData.spriteId}"`);
      }
      const shelf = new ShelfController(shelfData.position, shelfSprite);

      // add items
      const item = allowedItems[itemIndex]
      if (item) {
        const roomItem = new ItemEntity(item, shelfData.position);
        sceneManager.addEntity(roomItem);
        this.collisionSystem.addEntity(roomItem);
        this.localEntities.push(roomItem);
      }
      if (itemIndex < allowedItems.length) {
        itemIndex++;
      }
      
      this.localEntities.push(shelf);
      sceneManager.addEntity(shelf);
      this.collisionSystem.addEntity(shelf);
    }

    /* Create door triggers */
    if (player) {
      const playerBoundingBox = player.getComponent(BoundingBox);
      if (!playerBoundingBox) {
        throw new Error("Player is missing a BoundingBox component");
      }

      for (const door of this.getDoorTriggers()) {
        const trigger = new DoorTrigger(
          door.position,
          door.size,
          door.targetSceneId,
          sceneManager,
          playerBoundingBox
        );
        this.localEntities.push(trigger);
        sceneManager.addEntity(trigger);
        this.collisionSystem.addEntity(trigger);
      }
    }

    /* Place items */
  }

  /**
   * Called when the player returns to this room.
   * Re-registers cached entities with the SceneManager
   * so they get updated and drawn again — without
   * recreating them from scratch.
   */
  onResume(sceneManager: SceneManager): void {
    console.log("Resuming " + this.getRoomId());
    // Reposition player
    const existingPlayer = sceneManager.getLevelEntities().find(
      entity => entity instanceof PlayerController
    );
    
    if (existingPlayer) {
      const player = existingPlayer as PlayerController;
      const movementComponent = player.getComponent(MovementComponent);
      if (movementComponent) {
        movementComponent.setPosition(this.getPlayerSpawnPoint());
      }
    }

    // Re-add room entities
    for (const entity of this.localEntities) {
      console.log("Re-adding entity:", entity.constructor.name);
      sceneManager.addEntity(entity);
      this.collisionSystem.addEntity(entity);
    }
    
    console.log("onResume complete");
  }

  /**
   * Handles exiting the room by removing
   * entities from the core systems.
   */
  onExit(): void {
    //remove all room entities from collision system when leaving
    for (const entity of this.localEntities) {
      this.collisionSystem.removeEntity(entity);
    }
  }

  update(context: GameContext): void {}
  draw(context: GameContext): void {}
  
}
