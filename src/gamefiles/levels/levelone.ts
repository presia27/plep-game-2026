import GameEngine from "../../gameengine.ts";
import { INVENTORY_MAX_SLOTS } from "../../gameState.ts";
import SceneManager from "../../sceneManager.ts";
import { BossSatisfaction } from "../bosssatisfaction/bossSatisfactionController.ts";
import { OrderDisplayEntity } from "../ordermanagement/orderdisplayentity.ts";
import { OrderDeliveryLoop } from "../ordermanagement/orderloopsys.ts";
import { CleaningScene } from "../scenes/rooms/cleaningScene.ts";
import { FoodScene } from "../scenes/rooms/foodScene.ts";
import { PharmaScene } from "../scenes/rooms/pharmaScene.ts";


/**
 * Represents concrete level data/parameters
 * @author Preston Sia
 */

const levelParams = {
  duration: 120,
  orderPromptVariability: 6,
  totalOrders: 10
}

export function loadLevelOne(gameEngine: GameEngine, sceneManager: SceneManager, ctx: CanvasRenderingContext2D) {
  // Create rooms
  const pharmaScene = new PharmaScene(gameEngine);
  const cleaningScene = new CleaningScene(gameEngine);
  const foodScene = new FoodScene(gameEngine);

  // Get list of all allowed items for the level
  const allowedItems = pharmaScene.getAllowedItems()
    .concat(cleaningScene.getAllowedItems())
    .concat(foodScene.getAllowedItems());

  // Pre-register all rooms so they're ready when the player walks through doors
  sceneManager.registerScene(cleaningScene.getRoomId(), cleaningScene);
  sceneManager.registerScene(foodScene.getRoomId(), foodScene);

  sceneManager.loadScene(pharmaScene.getRoomId(), pharmaScene);
  
  // Add order loop
  const orderLoop = new OrderDeliveryLoop(
    gameEngine.getGameContext().gameTime,
    levelParams.duration,
    levelParams.orderPromptVariability,
    levelParams.totalOrders,
    INVENTORY_MAX_SLOTS,
    allowedItems
  );
  sceneManager.addLevelEntity(orderLoop);

  const orderDisplayEntity = new OrderDisplayEntity(
    720,
    ctx.canvas.height - 96,
    orderLoop
  );
  sceneManager.addUIEntity(orderDisplayEntity);

  // Add boss satisfaction manager
  const bossSatisfaction = new BossSatisfaction(orderLoop); // TODO: help idk where to get asset maanager from and if my implementation even makes sense im too tired to deal w this rn
  sceneManager.addLevelEntity(bossSatisfaction);
  //const temporarySatisfactionDisplayEntity = new TemporarySatisfactionDisplayEntity(1000, 10, bossSatisfaction);
  //sceneManager.addUIEntity(temporarySatisfactionDisplayEntity); // temporarily add an entity to display the boss satisfaction renderer since the scene manager is still in progress
}
  

