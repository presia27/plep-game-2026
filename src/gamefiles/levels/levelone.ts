import GameEngine from "../../gameengine.ts";
import { INVENTORY_MAX_SLOTS } from "../../gameState.ts";
import SceneManager from "../../sceneManager.ts";
import { BossSatisfaction } from "../bosssatisfaction/bossSatisfactionController.ts";
import { InventoryManager } from "../inventory/inventoryManager.ts";
import { OrderDeliveryLoop } from "../ordermanagement/orderloopsys.ts";
import { MSG_SERVICE } from "../main.ts";
import { BaseRoomScene } from "../scenes/baseRoomScene.ts";
import { CleaningRoom, DeliveryRoom, FoodRoom, PharmaRoom  } from "../scenes/roomData.ts"

/**
 * Represents concrete level data/parameters
 * @author Preston Sia
 */

const levelParams = {
  duration: 60,
  orderPromptVariability: 6,
  totalOrders: 2
}

export function loadLevelOne(
  gameEngine: GameEngine,
  sceneManager: SceneManager,
  ctx: CanvasRenderingContext2D,
  inventoryManager: InventoryManager,
  orderLoop: OrderDeliveryLoop
) {
  // Create rooms
  const pharmaScene = new BaseRoomScene(gameEngine, PharmaRoom);
  const cleaningScene = new BaseRoomScene(gameEngine, CleaningRoom);
  const foodScene = new BaseRoomScene(gameEngine, FoodRoom);
  const deliveryScene = new BaseRoomScene(gameEngine, DeliveryRoom);

  // Get list of all allowed items for the level
  const allowedItems = PharmaRoom.allowedItems
    .concat(CleaningRoom.allowedItems)
    .concat(FoodRoom.allowedItems);

  // Pre-register all rooms so they're ready when the player walks through doors
  sceneManager.registerScene(CleaningRoom.sceneId, cleaningScene);
  sceneManager.registerScene(FoodRoom.sceneId, foodScene);
  sceneManager.registerScene(DeliveryRoom.sceneId, deliveryScene);
  sceneManager.loadScene(PharmaRoom.sceneId, pharmaScene);
  
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
  const bossSatisfaction = new BossSatisfaction(orderLoop); // TODO: help idk where to get asset maanager from and if my implementation even makes sense im too tired to deal w this rn
  sceneManager.addLevelEntity(bossSatisfaction);

  //const temporarySatisfactionDisplayEntity = new TemporarySatisfactionDisplayEntity(1000, 10, bossSatisfaction);
  //sceneManager.addUIEntity(temporarySatisfactionDisplayEntity); // temporarily add an entity to display the boss satisfaction renderer since the scene manager is still in progress

  MSG_SERVICE.queueMessage("SHIFT 1");
  MSG_SERVICE.queueMessage("You have " + levelParams.duration + " seconds");
}
  

