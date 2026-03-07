import GameEngine from "../../gameengine.ts";
import { INVENTORY_MAX_SLOTS } from "../../gameState.ts";
import SceneManager from "../../sceneManager.ts";
import { BossSatisfaction } from "../bosssatisfaction/bossSatisfactionController.ts";
import { InventoryManager } from "../inventory/inventoryManager.ts";
import { OrderDeliveryLoop } from "../ordermanagement/orderloopsys.ts";
import { MSG_SERVICE } from "../main.ts";
import { BaseRoomScene } from "../scenes/baseRoomScene.ts";
import { CleaningRoom, DeliveryRoom, FoodRoom, PharmaRoom  } from "../scenes/roomData.ts"
import { StoreFloor } from "../scenes/storeInterior/storeFloorController.ts";
import { SatisfactionDisplayEntity } from "../bosssatisfaction/satisfactionDisplayEntity.ts";
import { Vignette } from "../scenes/storeInterior/vignetteController.ts";
import { ILevelParams } from "./levelinterfaces.ts";

/**
 * Represents concrete level data/parameters
 * @author Preston Sia
 */

const levelParams: ILevelParams = {
  duration: 60,
  orderPromptVariability: 6,
  totalOrders: 2
}

export function loadLevelOne(
  gameEngine: GameEngine,
  sceneManager: SceneManager,
  ctx: CanvasRenderingContext2D,
  inventoryManager: InventoryManager,
  orderLoop: OrderDeliveryLoop,
  bossSatisfaction: BossSatisfaction
) {
  // Create rooms
  const allowedRoomIds = [
    PharmaRoom.sceneId,
    CleaningRoom.sceneId,
    FoodRoom.sceneId,
    DeliveryRoom.sceneId
  ];
  const pharmaScene = new BaseRoomScene(gameEngine, PharmaRoom, allowedRoomIds);
  const cleaningScene = new BaseRoomScene(gameEngine, CleaningRoom, allowedRoomIds);
  const foodScene = new BaseRoomScene(gameEngine, FoodRoom, allowedRoomIds);
  const deliveryScene = new BaseRoomScene(gameEngine, DeliveryRoom, allowedRoomIds);

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
  bossSatisfaction.initialize(levelParams.duration);
  sceneManager.addLevelEntity(bossSatisfaction);
  
  /* Create vignette */
  const vignette = new Vignette();
  sceneManager.addUIEntity(vignette);
  
  MSG_SERVICE.queueMessage("SHIFT 1");
  MSG_SERVICE.queueMessage("You have " + levelParams.duration + " seconds");
}
  

