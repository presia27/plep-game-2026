import { InventoryManager } from "./gamefiles/inventory/inventoryManager.js";
import { ASSET_MANAGER } from "./gamefiles/main.js";
import { TemporaryInventoryDisplayEntity } from "./gamefiles/inventory/temporaryInventoryDisplayEntity.js";
import { PlayerController } from "./gamefiles/player/playerController.js";
import { loadLevelOne } from "./gamefiles/levels/levelone.js";
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
        this.inventoryManager = new InventoryManager(6);
        this.initDisplayEntities(); // load display entities
        // TEMPORARY STUFF THIS MUST BE CHANGED!!!
        //////////////// item
        //   const spawnConfigs = [
        //   {
        //     roomId: "demo",
        //     spawnPoints: [
        //       { x: 200, y: 200 },
        //       { x: 400, y: 200 },
        //       { x: 600, y: 200 },
        //       { x: 200, y: 450 },
        //       { x: 400, y: 450 },
        //     ]
        //   },
        //   {
        //     roomId: "backStorage",
        //     spawnPoints: [
        //       { x: 250, y: 250 },
        //       { x: 450, y: 250 },
        //       { x: 250, y: 450 },
        //     ]
        //   },
        //   {
        //     roomId: "coldStorage",
        //     spawnPoints: [
        //       { x: 150, y: 250 },
        //       { x: 350, y: 250 },
        //       { x: 550, y: 250 },
        //       { x: 150, y: 450 },
        //       { x: 350, y: 450 },
        //       { x: 550, y: 450 },
        //     ]
        //   }
        // ];
        // const itemSpawner = new ItemSpawner(
        //   sceneManager,
        //   gameEngine.getCollisionSystem(),
        //   spawnConfigs
        // );
        // sceneManager.addLevelEntity(itemSpawner);
        ///// item ^
        /* ^^^ END OF TEMP CODE ^^^ */
        /* Add the player */
        const player = new PlayerController(ASSET_MANAGER, gameEngine.getInputSystem(), { x: 0, y: 0 }, 5, this.inventoryManager);
        sceneManager.addLevelEntity(player);
        gameEngine.getCollisionSystem().addEntity(player);
        loadLevelOne(gameEngine, sceneManager);
    }
    /**
     * Helper method to initialize and add
     * UI display entities
     */
    initDisplayEntities() {
        const inventoryDisplayEntity = new TemporaryInventoryDisplayEntity(256, this.ctx.canvas.height - 96, this.inventoryManager);
        this.sceneManager.addUIEntity(inventoryDisplayEntity);
    }
    reset() {
        this.inventoryManager = new InventoryManager(6);
    }
    getInventoryManager() {
        return this.inventoryManager;
    }
}
