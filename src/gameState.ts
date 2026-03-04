import GameEngine from "./gameengine.ts";
import { InventoryManager } from "./gamefiles/inventory/inventoryManager.ts";
import SceneManager from "./sceneManager.ts";
import { ASSET_MANAGER, MSG_SERVICE } from "./gamefiles/main.ts";
import { InventoryDisplayEntity } from "./gamefiles/inventory/inventoryDisplayEntity.ts";
import { PlayerController } from "./gamefiles/player/playerController.ts";
import { levelLoaders } from "./gamefiles/levels/levelLoaders.ts";
import { MessageEntity } from "./gamefiles/messageHandler/messageEntity.ts";
import { OrderDeliveryLoop } from "./gamefiles/ordermanagement/orderloopsys.ts";
import { OrderDisplayEntity } from "./gamefiles/ordermanagement/orderdisplayentity.ts";
import { GameStateEventTrigger, LEVEL_OVER, NEXT_SCENE } from "./gameStateEventTrigger.ts";
import { StatScreenScene } from "./gamefiles/scenes/statScreen/statScreenScene.ts";
import { LevelResult } from "./gamefiles/levels/levelinterfaces.ts";
import { LoseScreenScene } from "./gamefiles/scenes/loseScreen/loseScreenScene.ts";
import { WinScreenScene } from "./gamefiles/scenes/winScreen/winScreenSceen.ts";
import { StartScreenScene } from "./gamefiles/scenes/startScreen/startScreenScene.ts";

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

  private levelNumber: number;
  private levelActive: boolean;

  constructor(gameEngine: GameEngine, sceneManager: SceneManager, ctx: CanvasRenderingContext2D) {
    this.gsEventTrigger = new GameStateEventTrigger(this);

    this.levelNumber = 0; // 0 based level number to load
    this.levelActive = false;
    
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

    /* Load level or scene */
    // Load the function reference from the list of levels, then call it to load the level
    // const levelLoadProcedure = levelLoaders[0];
    // if (levelLoadProcedure) {
    //   levelLoadProcedure(gameEngine, sceneManager, ctx, this.inventoryManager, this.orderLoop);
    //   this.levelActive = true;
    // }
    this.sceneManager.loadScene("start", new StartScreenScene(
      this.gsEventTrigger,
      this.gameEngine.getInputSystem(),
      this.ctx.canvas.width,
      this.ctx.canvas.height
    ));
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
    console.log("Received state change assertion: ", eventType);
    if (LEVEL_OVER === eventType) {
      // Evaluate win/lose state
      const levelState = data as LevelResult;

      if (levelState.success) {
        MSG_SERVICE.queueMessage("YOUR SHIFT IS OVER");
        setTimeout(() => {
          this.cleanState();
          // go to next level state
          this.levelNumber = this.levelNumber + 1;
          this.levelActive = false;
          // Load stat screen
          this.sceneManager.loadScene("statScreen", new StatScreenScene(this.gsEventTrigger));
        }, 3000);
      } else {
        MSG_SERVICE.queueMessage(levelState.reason ?? "YOU FAILED");
        setTimeout(() => {
          this.cleanState();
          this.sceneManager.loadScene("loseScreen", new LoseScreenScene(this.gsEventTrigger));
        }, 3000);
      }
    }

    if (NEXT_SCENE === eventType) {
      this.cleanState();
      this.loadState();

      // Load next scene, set to level field to active
      if (this.levelNumber < levelLoaders.length) {
        const levelLoadProcedure = levelLoaders[this.levelNumber];
        if (levelLoadProcedure) {
          levelLoadProcedure(this.gameEngine, this.sceneManager, this.ctx, this.inventoryManager, this.orderLoop);
          this.levelActive = true;
        }
      } else {
        MSG_SERVICE.queueMessage("The game is over.");
        setTimeout(() => {
          this.cleanState();
          this.sceneManager.loadScene("winScreen", new WinScreenScene(this.gsEventTrigger));
        }, 3000);
      }
    }
  }

  public getInventoryManager(): InventoryManager {
    return this.inventoryManager;
  }

  public getOrderLoop(): OrderDeliveryLoop {
    return this.orderLoop;
  }
}