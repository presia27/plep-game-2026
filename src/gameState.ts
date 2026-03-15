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
import { GAME_RESET_GOTO_MENU, GAME_RESET_REPLAY, GameStateEventTrigger, LEVEL_OVER, NEXT_SCENE, TOGGLE_PAUSE } from "./gameStateEventTrigger.ts";
import { StatScreenScene } from "./gamefiles/scenes/statScreen/statScreenScene.ts";
import { LevelResult, LevelSummary } from "./gamefiles/levels/levelinterfaces.ts";
import { LoseScreenScene } from "./gamefiles/scenes/loseScreen/loseScreenScene.ts";
import { WinScreenScene } from "./gamefiles/scenes/winScreen/winScreenSceen.ts";
import { BossSatisfaction } from "./gamefiles/bosssatisfaction/bossSatisfactionController.ts";
import { SatisfactionDisplayEntity } from "./gamefiles/bosssatisfaction/satisfactionDisplayEntity.ts";
import { TextboxManager } from "./gamefiles/textbox/textboxManager.ts";
import { BossDialogueController } from "./gamefiles/textbox/bossDialogueController.ts";
import { GlobalKeyListenerEntity } from "./gamefiles/globalKeyListenerEntity.ts";
import { loadControlScreen } from "./gamefiles/scenes/controlScreen/controlScreenLoader.ts";
import { SETTINGSSCREEN_SCENEID, SettingsScreenScene } from "./gamefiles/scenes/controlScreen/settingsScreen.ts";
import { XY } from "./typeinterfaces.ts";
import { MovementComponent } from "./componentLibrary/movementComponent.ts";
import { PlayerHealthMonitor } from "./gamefiles/playerHealthMonitor/playerHealthMonitor.ts";
import { FlashAndFade } from "./gamefiles/flashAndFade/flashAndFade.ts";
import { BasicLifecycle } from "./componentLibrary/lifecycle.ts";
import { STARTSCREEN_SCENEID, StartScreenScene } from "./gamefiles/scenes/controlScreen/startScreenScene.ts";

export const INVENTORY_MAX_SLOTS = 5;
const PLAYER_MAX_HEALTH = 8;
const PLAYER_HEALTH_STEP = 1;
const PLAYER_DEFAULT_POSITION: XY = {x: 640, y: 360};

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
  private bossSatisfaction: BossSatisfaction
  private player: PlayerController;
  private healthMon: PlayerHealthMonitor;
  private flashFade: FlashAndFade; // Similar to vignette but for flashing and fading on damage
  private globalKeyEntity: GlobalKeyListenerEntity;

  // For loading in game
  private pauseSettingsScene: SettingsScreenScene | null = null;
  private playerLastPositionBeforePause: XY | null = null; // reload the player's last position on resume from pause screen

  private levelNumber: number;
  private levelActive: boolean;

  // boss dialogue controls
  private textboxManager: TextboxManager;
  private bossDialogue: BossDialogueController;

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

    /* Initialize boss satisfaction */
    this.bossSatisfaction = new BossSatisfaction(this.gsEventTrigger);

    // Create new flash and fade entity
    this.flashFade = new FlashAndFade();

    /* Initialize player health */
    this.healthMon = new PlayerHealthMonitor(PLAYER_MAX_HEALTH, PLAYER_HEALTH_STEP, this.gsEventTrigger, this.flashFade);

    /* Initialize the player */
    this.player = new PlayerController(
      ASSET_MANAGER,
      gameEngine.getInputSystem(),
      { x: PLAYER_DEFAULT_POSITION.x, y: PLAYER_DEFAULT_POSITION.y },
      5,
      this.inventoryManager,
      this.orderLoop,
      this.healthMon
    );

    // boss dialogue
    this.textboxManager = new TextboxManager(
      sceneManager,
      ASSET_MANAGER,
      400, //default X
      0, //default Y
      498, //default width
      133, //default height
      "dialogueBox" //img
    );

    this.textboxManager.setDefaultDuration(4.0);
    this.textboxManager.setDefaultRevealSpeed(35);

    this.bossDialogue = new BossDialogueController(this.textboxManager, this.bossSatisfaction);

    /* Initialize the global key (pause) controller */
    this.globalKeyEntity = new GlobalKeyListenerEntity(
      this.gameEngine.getInputSystem(),
      this.gsEventTrigger
    );

    // Load the initialized classes into their respective places
    //this.loadState();

    /* Load level or scene */
    // Load the function reference from the list of levels, then call it to load the level
    // const levelLoadProcedure = levelLoaders[0];
    // if (levelLoadProcedure) {
    //   levelLoadProcedure(gameEngine, sceneManager, ctx, this.inventoryManager, this.orderLoop);
    //   this.levelActive = true;
    // }
    
    loadControlScreen(
      this.sceneManager,
      this.gameEngine.getInputSystem(),
      this.ctx,
      this.gsEventTrigger
    );
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
      30,
      this.ctx.canvas.height - 70,
      this.inventoryManager,
      this.gameEngine.getInputSystem()
    );
    this.sceneManager.addUIEntity(inventoryDisplayEntity);

    // add order display renderer
    const orderDisplayEntity = new OrderDisplayEntity(
      this.ctx.canvas.width - 270,
      this.ctx.canvas.height - 70,
      this.orderLoop,
      () => this.levelNumber + 1
    );
    this.sceneManager.addUIEntity(orderDisplayEntity);

    // add boss satisfaction renderer
    const satisfactionDisplay = new SatisfactionDisplayEntity(1075, 30, this.bossSatisfaction);
    this.sceneManager.addUIEntity(satisfactionDisplay);
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
    this.textboxManager.clearAll(); // clear textboxes
    this.inventoryManager.clearItems();
    this.sceneManager.resetAll();
    this.orderLoop.reset();
    this.bossSatisfaction.reset();
    this.gameEngine.getCollisionSystem().clearEntities();
    this.healthMon.resetHealth();
    this.player.getComponent(MovementComponent)?.resetSpeedBias();
    this.flashFade.reset();
    this.pauseSettingsScene = null;
    this.playerLastPositionBeforePause = null;
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
    this.orderLoop.subscribe(this.bossSatisfaction);
    this.orderLoop.subscribe(this.bossDialogue);
    this.initDisplayEntities();   // load display entities
    this.sceneManager.addLevelEntity(this.player);
    this.gameEngine.getCollisionSystem().addEntity(this.player);

    // add bossDialogue (British)
    this.sceneManager.addLevelEntity(this.bossDialogue);

    // add flash and fade
    this.sceneManager.addLevelEntity(this.flashFade);
    
    // Add pause controller
    this.sceneManager.addLevelEntity(this.globalKeyEntity);
  }    

  /**
   * Perform a hard reset of the game state system.
   */
  public reset(): void {
    this.textboxManager.clearAll();
    this.bossDialogue = new BossDialogueController(this.textboxManager, this.bossSatisfaction);
    MSG_SERVICE.clearQueue();
    this.inventoryManager = new InventoryManager(INVENTORY_MAX_SLOTS);
    this.orderLoop = new OrderDeliveryLoop(this.gsEventTrigger);
    this.bossSatisfaction = new BossSatisfaction(this.gsEventTrigger);
    this.gameEngine.getCollisionSystem().clearEntities();
    this.sceneManager.resetAll();
    this.levelNumber = 0;
    this.levelActive = false;
    this.flashFade = new FlashAndFade();
    this.healthMon = new PlayerHealthMonitor(PLAYER_MAX_HEALTH, PLAYER_HEALTH_STEP, this.gsEventTrigger, this.flashFade);
    this.pauseSettingsScene = null;
    this.playerLastPositionBeforePause = null;

    // create new player
    this.player = new PlayerController(
      ASSET_MANAGER,
      this.gameEngine.getInputSystem(),
      { x: PLAYER_DEFAULT_POSITION.x, y: PLAYER_DEFAULT_POSITION.y },
      5,
      this.inventoryManager,
      this.orderLoop,
      this.healthMon
    );
  }

  public stateChangeHandler(data: any, eventType: string) {
    if (this.gameEngine.getGameContext().debug) {
      // Show debug info if enabled
      console.log("Received state change assertion: ", eventType);
    }
    
    if (LEVEL_OVER === eventType) {
      // Evaluate win/lose state
      const levelState = data as LevelResult;

      if (levelState.success) {
        MSG_SERVICE.queueMessage("YOUR SHIFT IS OVER");

        const levelSummary: LevelSummary = {
          quota: this.orderLoop.getTotalOrders(),
          ordersFulfilled: this.orderLoop.getNumberOfDoneOrders(),
          avgAccuracy: this.orderLoop.getAverageAccuracy(),
          bossSatisfaction: this.bossSatisfaction.getSatisfaction()
        }

        setTimeout(() => {
          this.cleanState();
          // go to next level state
          this.levelNumber = this.levelNumber + 1;
          this.levelActive = false;
          // Load stat screen
          this.sceneManager.loadScene("statScreen", new StatScreenScene(this.gsEventTrigger, levelSummary));
        }, 5000);
      } else {
        const loseReason = levelState.reason ?? "YOU FAILED";
        //MSG_SERVICE.queueMessage(loseReason);
        this.player.getComponent(BasicLifecycle)?.die();
        this.flashFade.fadeToBlack();
        setTimeout(() => {
          this.cleanState();
          this.sceneManager.loadScene("loseScreen", new LoseScreenScene(this.gsEventTrigger, loseReason, this.gameEngine.getInputSystem(), this.ctx.canvas.width, this.ctx.canvas.height));
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
          levelLoadProcedure(this.gameEngine, this.sceneManager, this.ctx, this.inventoryManager, this.orderLoop, this.bossSatisfaction);
          this.levelActive = true;

          this.bossDialogue.onLevelStart();
        }
      } else {
        this.cleanState();
        this.sceneManager.loadScene("winScreen", new WinScreenScene(
          this.gsEventTrigger,
          this.gameEngine.getInputSystem(),
          this.ctx.canvas.width,
          this.ctx.canvas.height
        ));
      }
    }

    if (GAME_RESET_REPLAY === eventType) {
      this.reset();
      this.cleanState();
      this.loadState();
      const levelLoadProcedure = levelLoaders[this.levelNumber];
      if (levelLoadProcedure) {
        levelLoadProcedure(this.gameEngine, this.sceneManager, this.ctx, this.inventoryManager, this.orderLoop, this.bossSatisfaction);
        this.levelActive = true;

        this.bossDialogue.onLevelStart();
      }
    }

    if (GAME_RESET_GOTO_MENU === eventType) {
      this.reset();
      const settingsScreen = new SettingsScreenScene(
        this.gsEventTrigger,
        this.gameEngine.getInputSystem(),
        this.ctx.canvas.width,
        this.ctx.canvas.height, false
      );
      const startScreen = new StartScreenScene(
        this.gsEventTrigger,
        this.gameEngine.getInputSystem(),
        this.ctx.canvas.width,
        this.ctx.canvas.height
      );
      this.sceneManager.registerScene(SETTINGSSCREEN_SCENEID, settingsScreen);
      this.sceneManager.loadScene(STARTSCREEN_SCENEID, startScreen);
    }

    if (TOGGLE_PAUSE === eventType) {
      this.gameEngine.togglePause();

      if (this.gameEngine.gameIsPaused()) {
        // create and register scene if not done already
        if (!this.pauseSettingsScene) {
          this.pauseSettingsScene = new SettingsScreenScene(
            this.gsEventTrigger,
            this.gameEngine.getInputSystem(),
            this.ctx.canvas.width,
            this.ctx.canvas.height,
            true
          );
          this.sceneManager.registerScene(SETTINGSSCREEN_SCENEID, this.pauseSettingsScene);
        }
        this.sceneManager.loadScene(SETTINGSSCREEN_SCENEID);
        const movementComponent = this.player.getComponent(MovementComponent);
        if (movementComponent) {
          this.playerLastPositionBeforePause = {
            x: movementComponent.getPosition().x,
            y: movementComponent.getPosition().y
          }
        }

      } else {
        this.sceneManager.loadLastScene();

        // Snap the player back to its position before pause
        // Otherwiser, the last scene will snap it to the nearest spawn point
        const movementComponent = this.player.getComponent(MovementComponent);
        if (movementComponent && this.playerLastPositionBeforePause) {
          movementComponent.setPosition({
            x: this.playerLastPositionBeforePause.x,
            y: this.playerLastPositionBeforePause.y
          });
        }
      }
      
    }
  }

  public getTextboxManager(): TextboxManager {
    return this.textboxManager;
  }

  public getBossDialogue(): BossDialogueController {
    return this.bossDialogue;
  }

  public getInventoryManager(): InventoryManager {
    return this.inventoryManager;
  }

  public getOrderLoop(): OrderDeliveryLoop {
    return this.orderLoop;
  }
}