import GameEngine from "../../gameengine.ts";
import { INVENTORY_MAX_SLOTS } from "../../gameState.ts";
import SceneManager from "../../sceneManager.ts";
import { BossSatisfaction } from "../bosssatisfaction/bossSatisfactionController.ts";
import { TemporarySatisfactionDisplayEntity } from "../bosssatisfaction/temporarySatisfactionDisplayEntity.ts";
import { InventoryManager } from "../inventory/inventoryManager.ts";
import { OrderDisplayEntity } from "../ordermanagement/orderdisplayentity.ts";
import { OrderDeliveryLoop } from "../ordermanagement/orderloopsys.ts";
import { CleaningScene } from "../scenes/rooms/cleaningScene.ts";
import { FoodScene } from "../scenes/rooms/foodScene.ts";
import { PharmaScene } from "../scenes/rooms/pharmaScene.ts";
import { DeliveryScene } from "../scenes/rooms/deliveryScene.ts";
import { ASSET_MANAGER, MSG_SERVICE } from "../main.ts";

/**
 * Represents concrete level data/parameters
 * @author Preston Sia
 */

const levelParams = {
  duration: 120,
  orderPromptVariability: 6,
  totalOrders: 10
}

export function loadLevelOne(
  gameEngine: GameEngine,
  sceneManager: SceneManager,
  ctx: CanvasRenderingContext2D,
  inventoryManager: InventoryManager,
  orderLoop: OrderDeliveryLoop
) {
  // Create rooms
  const pharmaScene = new PharmaScene(gameEngine);
  const cleaningScene = new CleaningScene(gameEngine);
  const foodScene = new FoodScene(gameEngine);
  const deliveryScene = new DeliveryScene(gameEngine);

  // Get list of all allowed items for the level
  const allowedItems = pharmaScene.getAllowedItems()
    .concat(cleaningScene.getAllowedItems())
    .concat(foodScene.getAllowedItems());

  // Pre-register all rooms so they're ready when the player walks through doors
  sceneManager.registerScene(cleaningScene.getRoomId(), cleaningScene);
  sceneManager.registerScene(foodScene.getRoomId(), foodScene);
  sceneManager.registerScene(deliveryScene.getRoomId(), deliveryScene);
  sceneManager.loadScene(pharmaScene.getRoomId(), pharmaScene);
  
  // Add order loop
  orderLoop.init(
    gameEngine.getGameContext().gameTime,
    levelParams.duration,
    levelParams.orderPromptVariability,
    levelParams.totalOrders,
    INVENTORY_MAX_SLOTS,
    allowedItems
  );
  sceneManager.addLevelEntity(orderLoop);

  // Add boss satisfaction manager
  const bossSatisfaction = new BossSatisfaction(orderLoop);
  sceneManager.addLevelEntity(bossSatisfaction);
  const temporarySatisfactionDisplayEntity = new TemporarySatisfactionDisplayEntity(900, 30, bossSatisfaction);
  sceneManager.addUIEntity(temporarySatisfactionDisplayEntity); // temporarily add an entity to display the boss satisfaction renderer since the scene manager is still in progress

  MSG_SERVICE.queueMessage("SHIFT 1");
  MSG_SERVICE.queueMessage("You have " + levelParams.duration + " seconds");
}
  

