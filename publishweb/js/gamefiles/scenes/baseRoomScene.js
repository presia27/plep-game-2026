import { ASSET_MANAGER } from "../main.js";
import { PlayerController } from "../player/playerController.js";
import { ShelfController } from "../shelves/shelfController.js";
import { DoorTrigger } from "./doorTrigger.js";
import { BoundingBox } from "../../componentLibrary/boundingBox.js";
import { MovementComponent } from "../../componentLibrary/movementComponent.js";
import { ItemEntity } from "../ordermanagement/itemEntity.js";
/**
 * Altered base class for all room scenes.
 * Handles all common setup logic so individual rooms only
 * ned to define their data via abstract methods.
 *
 * @author Luke Willis, Claude Sonnet 4.5, Preston Sia
 */
export class BaseRoomScene {
    constructor(game) {
        this.inputSystem = game.getInputSystem();
        this.collisionSystem = game.getCollisionSystem();
        this.localEntities = [];
    }
    /**
     * Loads scene data and adds them as actual instances
     * to the scene manager.
     * @param sceneManager Scene manager
     */
    onEnter(sceneManager) {
        console.log("Loading scene " + this.getRoomId());
        // Attempt to find the current player
        let player;
        const existingPlayer = sceneManager.getLevelEntities().find(entity => entity instanceof PlayerController);
        if (existingPlayer) {
            player = existingPlayer;
            // Reuse existing player, just update spawn point
            player = existingPlayer;
            const movementComponent = player.getComponent(MovementComponent);
            if (movementComponent) {
                movementComponent.setPosition(this.getPlayerSpawnPoint());
            }
        }
        else {
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
            const item = allowedItems[itemIndex];
            if (item) {
                const roomItem = new ItemEntity(item, shelfData.position);
                sceneManager.addEntity(roomItem);
                this.collisionSystem.addEntity(roomItem);
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
                const trigger = new DoorTrigger(door.position, door.size, door.targetSceneId, sceneManager, playerBoundingBox);
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
    onResume(sceneManager) {
        console.log("Resuming " + this.getRoomId());
        // Reposition player
        const existingPlayer = sceneManager.getLevelEntities().find(entity => entity instanceof PlayerController);
        if (existingPlayer) {
            const player = existingPlayer;
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
    onExit() {
        //remove all room entities from collision system when leaving
        for (const entity of this.localEntities) {
            this.collisionSystem.removeEntity(entity);
        }
    }
    update(context) { }
    draw(context) { }
}
