import GameEngine from "./gameengine.ts";
import { InventoryManager } from "./gamefiles/inventory/inventoryManager.ts";
import SceneManager from "./sceneManager.ts";
import { ASSET_MANAGER } from "./gamefiles/main.ts";
import { TemporaryInventoryDisplayEntity } from "./gamefiles/inventory/temporaryInventoryDisplayEntity.ts";
import { BackStorageScene, ColdStorageScene, DemoScene } from "./gamefiles/scenes/complete_level_example.ts";
import { ItemSpawner } from "./gamefiles/ordermanagement/itemSpawner.ts";
import { OrderDeliveryLoop } from "./gamefiles/ordermanagement/orderloopsys.ts";

/**
 * Holds all global state that persists across rooms and scenes.
 * Acts as the main controller class after initialization.
 *
 * @author Luke Willis, Claude Sonnet 4.5, Preston Sia
 */
export class GameState {
  private gameEngine: GameEngine;
  private sceneManager: SceneManager;
  private ctx: CanvasRenderingContext2D;
  private inventoryManager: InventoryManager;

  constructor(gameEngine: GameEngine, sceneManager: SceneManager, ctx: CanvasRenderingContext2D) {
    this.gameEngine = gameEngine;
    this.sceneManager = sceneManager;
    this.ctx = ctx;
    this.inventoryManager = new InventoryManager(6);

    this.initDisplayEntities();   // load display entities

    // TEMPORARY STUFF THIS MUST BE CHANGED!!!
    //start the order delivery loop, which is a level-scoped entity that persists across all rooms
      const orderLoop = new OrderDeliveryLoop(0, 120, 8, 10);
      sceneManager.addLevelEntity(orderLoop);
    
      //////////////// item
      const spawnConfigs = [
      {
        roomId: "demo",
        spawnPoints: [
          { x: 200, y: 200 },
          { x: 400, y: 200 },
          { x: 600, y: 200 },
          { x: 200, y: 450 },
          { x: 400, y: 450 },
        ]
      },
      {
        roomId: "backStorage",
        spawnPoints: [
          { x: 250, y: 250 },
          { x: 450, y: 250 },
          { x: 250, y: 450 },
        ]
      },
      {
        roomId: "coldStorage",
        spawnPoints: [
          { x: 150, y: 250 },
          { x: 350, y: 250 },
          { x: 550, y: 250 },
          { x: 150, y: 450 },
          { x: 350, y: 450 },
          { x: 550, y: 450 },
        ]
      }
    ];
    
    const itemSpawner = new ItemSpawner(
      sceneManager,
      gameEngine.getCollisionSystem(),
      spawnConfigs
    );
    sceneManager.addLevelEntity(itemSpawner);
    
    ///// item ^
    
      // ========================================
      // Room-specific entities should be added in the individual scene files, not here.
      // ========================================
    
      // Pre-register all rooms so they're ready when the player walks through doors
      sceneManager.registerScene("backStorage", new BackStorageScene(gameEngine));
      sceneManager.registerScene("coldStorage", new ColdStorageScene(gameEngine));
    
      // Load the starting room — this is the main store floor
      sceneManager.loadScene("demo", new DemoScene(gameEngine));
  }

  /**
   * Helper method to initialize and add
   * UI display entities
   */
  private initDisplayEntities() {
    const inventoryDisplayEntity = new TemporaryInventoryDisplayEntity(
      256,
      this.ctx.canvas.height - 96,
      this.inventoryManager
    );
  }

  public reset(): void {
    this.inventoryManager = new InventoryManager(6);
  }

  public getInventoryManager(): InventoryManager {
    return this.inventoryManager;
  }
}