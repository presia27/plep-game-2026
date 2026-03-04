import { InventoryManager } from "./gamefiles/inventory/inventoryManager.js";
import { ASSET_MANAGER } from "./gamefiles/main.js";
import { InventoryDisplayEntity } from "./gamefiles/inventory/inventoryDisplayEntity.js";
import { PlayerController } from "./gamefiles/player/playerController.js";
import { loadLevelOne } from "./gamefiles/levels/levelone.js";
import { MessageEntity } from "./gamefiles/messageHandler/messageEntity.js";
export const INVENTORY_MAX_SLOTS = 6;
/**
 * Holds all global state that persists across rooms and scenes.
 * Acts as the main controller class after initialization.
 *
 * @author Luke Willis, Claude Sonnet 4.5, Preston Sia
 */
export class GameState {
    constructor(gameEngine, sceneManager, ctx) {
        this.gameEngine = gameEngine;
        this.sceneManager = sceneManager;
        this.ctx = ctx;
        this.inventoryManager = new InventoryManager(INVENTORY_MAX_SLOTS);
        this.initDisplayEntities(); // load display entities
        /* Add the player */
        const player = new PlayerController(ASSET_MANAGER, gameEngine.getInputSystem(), { x: 0, y: 0 }, 5, this.inventoryManager);
        sceneManager.addLevelEntity(player);
        gameEngine.getCollisionSystem().addEntity(player);
        loadLevelOne(gameEngine, sceneManager, ctx, this.inventoryManager);
    }
    /**
     * Helper method to initialize and add
     * UI display entities
     */
    initDisplayEntities() {
        // add message entity and renderer
        const messageEntity = new MessageEntity();
        this.sceneManager.addUIEntity(messageEntity);
        // add inventory renderer
        const inventoryDisplayEntity = new InventoryDisplayEntity(256, this.ctx.canvas.height - 96, this.inventoryManager, this.gameEngine.getInputSystem());
        this.sceneManager.addUIEntity(inventoryDisplayEntity);
    }
    reset() {
        this.inventoryManager = new InventoryManager(INVENTORY_MAX_SLOTS);
    }
    getInventoryManager() {
        return this.inventoryManager;
    }
}
