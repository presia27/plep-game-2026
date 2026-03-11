import { InventoryManager } from "./gamefiles/inventory/inventoryManager.js";
import { ASSET_MANAGER, MSG_SERVICE } from "./gamefiles/main.js";
import { InventoryDisplayEntity } from "./gamefiles/inventory/inventoryDisplayEntity.js";
import { PlayerController } from "./gamefiles/player/playerController.js";
import { levelLoaders } from "./gamefiles/levels/levelLoaders.js";
import { MessageEntity } from "./gamefiles/messageHandler/messageEntity.js";
import { OrderDeliveryLoop } from "./gamefiles/ordermanagement/orderloopsys.js";
import { OrderDisplayEntity } from "./gamefiles/ordermanagement/orderdisplayentity.js";
import { GameStateEventTrigger, LEVEL_OVER, NEXT_SCENE, TOGGLE_PAUSE } from "./gameStateEventTrigger.js";
import { StatScreenScene } from "./gamefiles/scenes/statScreen/statScreenScene.js";
import { LoseScreenScene } from "./gamefiles/scenes/loseScreen/loseScreenScene.js";
import { WinScreenScene } from "./gamefiles/scenes/winScreen/winScreenSceen.js";
import { BossSatisfaction } from "./gamefiles/bosssatisfaction/bossSatisfactionController.js";
import { SatisfactionDisplayEntity } from "./gamefiles/bosssatisfaction/satisfactionDisplayEntity.js";
import { GlobalKeyListenerEntity } from "./gamefiles/globalKeyListenerEntity.js";
import { loadControlScreen } from "./gamefiles/scenes/controlScreen/controlScreenLoader.js";
import { SETTINGSSCREEN_SCENEID, SettingsScreenScene } from "./gamefiles/scenes/controlScreen/settingsScreen.js";
import { MovementComponent } from "./componentLibrary/movementComponent.js";
export const INVENTORY_MAX_SLOTS = 5;
/**
 * Holds all global state that persists across rooms and scenes.
 * Acts as the main controller class after initialization.
 *
 * @author Luke Willis, Claude Sonnet 4.5, Preston Sia
 */
export class GameState {
    constructor(gameEngine, sceneManager, ctx) {
        // For loading in game
        this.pauseSettingsScene = null;
        this.playerLastPositionBeforePause = null; // reload the player's last position on resume from pause screen
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
        /* Initialize the player */
        this.player = new PlayerController(ASSET_MANAGER, gameEngine.getInputSystem(), { x: 0, y: 0 }, 5, this.inventoryManager, this.orderLoop);
        /* Initialize the global key (pause) controller */
        this.globalKeyEntity = new GlobalKeyListenerEntity(this.gameEngine.getInputSystem(), this.gsEventTrigger);
        // Load the initialized classes into their respective places
        //this.loadState();
        /* Load level or scene */
        // Load the function reference from the list of levels, then call it to load the level
        // const levelLoadProcedure = levelLoaders[0];
        // if (levelLoadProcedure) {
        //   levelLoadProcedure(gameEngine, sceneManager, ctx, this.inventoryManager, this.orderLoop);
        //   this.levelActive = true;
        // }
        loadControlScreen(this.sceneManager, this.gameEngine.getInputSystem(), this.ctx, this.gsEventTrigger);
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
        const inventoryDisplayEntity = new InventoryDisplayEntity(30, this.ctx.canvas.height - 70, this.inventoryManager, this.gameEngine.getInputSystem());
        this.sceneManager.addUIEntity(inventoryDisplayEntity);
        // add order display renderer
        const orderDisplayEntity = new OrderDisplayEntity(this.ctx.canvas.width - 270, this.ctx.canvas.height - 70, this.orderLoop, () => this.levelNumber + 1);
        this.sceneManager.addUIEntity(orderDisplayEntity);
        // add boss satisfaction renderer
        const satisfactionDisplay = new SatisfactionDisplayEntity(950, 20, this.bossSatisfaction);
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
    cleanState() {
        this.inventoryManager.clearItems();
        this.sceneManager.resetAll();
        this.orderLoop.reset();
        this.bossSatisfaction.reset();
        this.gameEngine.getCollisionSystem().clearEntities();
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
    loadState() {
        this.inventoryManager.subscribe(this.orderLoop);
        this.orderLoop.subscribe(this.bossSatisfaction);
        this.initDisplayEntities(); // load display entities
        this.sceneManager.addLevelEntity(this.player);
        this.gameEngine.getCollisionSystem().addEntity(this.player);
        // Add pause controller
        this.sceneManager.addLevelEntity(this.globalKeyEntity);
    }
    /**
     * Perform a hard reset of the game state system.
     */
    reset() {
        this.inventoryManager = new InventoryManager(INVENTORY_MAX_SLOTS);
        this.orderLoop = new OrderDeliveryLoop(this.gsEventTrigger);
        this.sceneManager.resetAll();
        this.levelNumber = 0;
        this.levelActive = false;
        this.pauseSettingsScene = null;
        this.playerLastPositionBeforePause = null;
    }
    stateChangeHandler(data, eventType) {
        var _a;
        console.log("Received state change assertion: ", eventType);
        if (LEVEL_OVER === eventType) {
            // Evaluate win/lose state
            const levelState = data;
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
            }
            else {
                const loseReason = (_a = levelState.reason) !== null && _a !== void 0 ? _a : "YOU FAILED";
                MSG_SERVICE.queueMessage(loseReason);
                setTimeout(() => {
                    this.cleanState();
                    this.sceneManager.loadScene("loseScreen", new LoseScreenScene(this.gsEventTrigger, loseReason));
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
                }
            }
            else {
                MSG_SERVICE.queueMessage("The game is over.");
                setTimeout(() => {
                    this.cleanState();
                    this.sceneManager.loadScene("winScreen", new WinScreenScene(this.gsEventTrigger));
                }, 3000);
            }
        }
        if (TOGGLE_PAUSE === eventType) {
            this.gameEngine.togglePause();
            if (this.gameEngine.gameIsPaused()) {
                // create and register scene if not done already
                if (!this.pauseSettingsScene) {
                    this.pauseSettingsScene = new SettingsScreenScene(this.gsEventTrigger, this.gameEngine.getInputSystem(), this.ctx.canvas.width, this.ctx.canvas.height, true);
                    this.sceneManager.registerScene(SETTINGSSCREEN_SCENEID, this.pauseSettingsScene);
                }
                this.sceneManager.loadScene(SETTINGSSCREEN_SCENEID);
                const movementComponent = this.player.getComponent(MovementComponent);
                if (movementComponent) {
                    this.playerLastPositionBeforePause = {
                        x: movementComponent.getPosition().x,
                        y: movementComponent.getPosition().y
                    };
                }
            }
            else {
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
    getInventoryManager() {
        return this.inventoryManager;
    }
    getOrderLoop() {
        return this.orderLoop;
    }
}
