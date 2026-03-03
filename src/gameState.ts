import GameEngine from "./gameengine.ts";
import { InventoryManager } from "./gamefiles/inventory/inventoryManager.ts";
import SceneManager from "./sceneManager.ts";
import { ASSET_MANAGER, MSG_SERVICE } from "./gamefiles/main.ts";
import { InventoryDisplayEntity } from "./gamefiles/inventory/inventoryDisplayEntity.ts";
import { PlayerController } from "./gamefiles/player/playerController.ts";
import { loadLevelOne } from "./gamefiles/levels/levelone.ts";
import { MessageEntity } from "./gamefiles/messageHandler/messageEntity.ts";
import { OrderDeliveryLoop } from "./gamefiles/ordermanagement/orderloopsys.ts";
import { OrderDisplayEntity } from "./gamefiles/ordermanagement/orderdisplayentity.ts";
import { GameStateEventTrigger, LEVEL_OVER } from "./gameStateEventTrigger.ts";

export const INVENTORY_MAX_SLOTS = 6;

/**
 * Holds all global state that persists across rooms and scenes.
 * Acts as the main controller class after initialization.
 *
 * @author Luke Willis, Claude Sonnet 4.5, Preston Sia
 */
export class GameState {
  private gsEventTrigger: GameStateEventTrigger;
  private gameEngine: GameEngine;
  private sceneManager: SceneManager;
  private ctx: CanvasRenderingContext2D;
  private inventoryManager: InventoryManager;
  private orderLoop: OrderDeliveryLoop;
  private player: PlayerController;

  constructor(gameEngine: GameEngine, sceneManager: SceneManager, ctx: CanvasRenderingContext2D) {
    this.gsEventTrigger = new GameStateEventTrigger(this);
    
    this.gameEngine = gameEngine;
    this.sceneManager = sceneManager;
    this.ctx = ctx;
    this.inventoryManager = new InventoryManager(INVENTORY_MAX_SLOTS);

    /* Initialize the order loop */
    this.orderLoop = new OrderDeliveryLoop(this.gsEventTrigger);

    /* Initialize the player */
    this.player = new PlayerController(
      ASSET_MANAGER,
      gameEngine.getInputSystem(),
      {x: 0, y: 0}, 5,
      this.inventoryManager,
      this.orderLoop
    );

    // Load the initialized classes into their respective places
    this.loadState();

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

  /**
   * Prepare for a level or screen transition by clearing
   * out scenes and entities.
   * 
   * Scenes and entities need to be cleared out, but this clears
   * out the player, order loop, and display entities as well.
   * They need to be reloaded after being cleared, but not
   * re-instantiated.
   */
  public cleanState() {
    this.inventoryManager.clearItems();
    this.sceneManager.resetAll();
    this.orderLoop.reset();
    this.gameEngine.getCollisionSystem().clearEntities();
  }

  /**
   * Prepares for a level or screen transition by loading existing
   * entities such as the player and order loop.
   * 
   * Scenes and entities need to be cleared out, but this clears
   * out the player, order loop, and display entities as well.
   * They need to be reloaded after being cleared, but not
   * re-instantiated.
   */
  public loadState() {
    this.inventoryManager.subscribe(this.orderLoop);
    this.initDisplayEntities();   // load display entities
    this.sceneManager.addLevelEntity(this.player);
    this.gameEngine.getCollisionSystem().addEntity(this.player);
  }

  /**
   * Perform a hard reset of the game state system.
   */
  public reset(): void {
    this.inventoryManager = new InventoryManager(INVENTORY_MAX_SLOTS);
    this.orderLoop = new OrderDeliveryLoop(this.gsEventTrigger);
    this.sceneManager.resetAll();
  }

  public stateChangeHandler(data: any, eventType: string) {
    if (eventType === LEVEL_OVER) {
      console.log("Received state change assertion: ", eventType);
      MSG_SERVICE.queueMessage("LEVEL OVER");
      const loadStuff = () => {
        this.cleanState();
        this.loadState();
        loadLevelOne(this.gameEngine, this.sceneManager, this.ctx, this.inventoryManager, this.orderLoop);
      }

      setTimeout(() => {
        loadStuff();
      }, 3000);
    }
  }

  public getInventoryManager(): InventoryManager {
    return this.inventoryManager;
  }

  public getOrderLoop(): OrderDeliveryLoop {
    return this.orderLoop;
  }
}