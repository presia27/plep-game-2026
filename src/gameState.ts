import GameEngine from "./gameengine.ts";
import { InventoryManager } from "./gamefiles/inventory/inventoryManager.ts";
import SceneManager from "./sceneManager.ts";
import { ASSET_MANAGER } from "./gamefiles/main.ts";
import { InventoryDisplayEntity } from "./gamefiles/inventory/inventoryDisplayEntity.ts";
import { PlayerController } from "./gamefiles/player/playerController.ts";
import { loadLevelOne } from "./gamefiles/levels/levelone.ts";
import { MessageEntity } from "./gamefiles/messageHandler/messageEntity.ts";
import { OrderDeliveryLoop } from "./gamefiles/ordermanagement/orderloopsys.ts";
import { OrderDisplayEntity } from "./gamefiles/ordermanagement/orderdisplayentity.ts";

export const INVENTORY_MAX_SLOTS = 6;

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
  private orderLoop: OrderDeliveryLoop;

  constructor(gameEngine: GameEngine, sceneManager: SceneManager, ctx: CanvasRenderingContext2D) {
    this.gameEngine = gameEngine;
    this.sceneManager = sceneManager;
    this.ctx = ctx;
    this.inventoryManager = new InventoryManager(INVENTORY_MAX_SLOTS);

    /* Initialize the order loop (levels will initialize them) */
    this.orderLoop = new OrderDeliveryLoop();
    // Register the order loop as a listener of the inventory
    this.inventoryManager.subscribe(this.orderLoop);

    this.initDisplayEntities();   // load display entities

    /* Add the player */
    const player = new PlayerController(
      ASSET_MANAGER,
      gameEngine.getInputSystem(),
      {x: 0, y: 0}, 5,
      this.inventoryManager,
      this.orderLoop
    );
    sceneManager.addLevelEntity(player);
    gameEngine.getCollisionSystem().addEntity(player);

    /* Load level */
    loadLevelOne(gameEngine, sceneManager, ctx, this.inventoryManager, this.orderLoop);
  }

  /**
   * Helper method to initialize and add
   * UI display entities
   */
  private initDisplayEntities() {
    // add message entity and renderer
    const messageEntity = new MessageEntity();
    this.sceneManager.addUIEntity(messageEntity);

    // add inventory renderer
    const inventoryDisplayEntity = new InventoryDisplayEntity(
      256,
      this.ctx.canvas.height - 96,
      this.inventoryManager,
      this.gameEngine.getInputSystem()
    );
    this.sceneManager.addUIEntity(inventoryDisplayEntity);

    const orderDisplayEntity = new OrderDisplayEntity(
      720,
      this.ctx.canvas.height - 96,
      this.orderLoop
    );
    this.sceneManager.addUIEntity(orderDisplayEntity);
  }

  public reset(): void {
    this.inventoryManager = new InventoryManager(INVENTORY_MAX_SLOTS);
    this.orderLoop = new OrderDeliveryLoop();
  }

  public getInventoryManager(): InventoryManager {
    return this.inventoryManager;
  }

  public getOrderLoop(): OrderDeliveryLoop {
    return this.orderLoop;
  }
}