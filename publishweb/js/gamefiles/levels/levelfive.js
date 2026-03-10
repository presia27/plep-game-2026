import { INVENTORY_MAX_SLOTS } from "../../gameState.js";
import { MSG_SERVICE } from "../main.js";
import { BaseRoomScene } from "../scenes/baseRoomScene.js";
import { CheckoutRoom, CleaningRoom, DeliveryRoom, ElectronicsRoom, FoodRoom, HousingRoom, PharmaRoom } from "../scenes/roomData.js";
import { Vignette } from "../scenes/storeInterior/vignetteController.js";
/**
 * Represents concrete level data/parameters
 */
const levelParams = {
    duration: 60,
    orderPromptVariability: 6,
    totalOrders: 2
};
export function loadLevelFive(gameEngine, sceneManager, ctx, inventoryManager, orderLoop, bossSatisfaction) {
    // Create rooms
    const allowedRoomIds = [
        ElectronicsRoom.sceneId,
        HousingRoom.sceneId,
        FoodRoom.sceneId,
        CleaningRoom.sceneId,
        PharmaRoom.sceneId,
        CheckoutRoom.sceneId,
        DeliveryRoom.sceneId
    ];
    // Get list of all allowed items for the level
    const allowedItems = PharmaRoom.allowedItems
        .concat(CleaningRoom.allowedItems)
        .concat(FoodRoom.allowedItems)
        .concat(HousingRoom.allowedItems)
        .concat(ElectronicsRoom.allowedItems);
    const ElectronicsScene = new BaseRoomScene(gameEngine, ElectronicsRoom, allowedRoomIds, orderLoop);
    const HousingScene = new BaseRoomScene(gameEngine, HousingRoom, allowedRoomIds, orderLoop);
    const FoodScene = new BaseRoomScene(gameEngine, FoodRoom, allowedRoomIds, orderLoop);
    const cleaningScene = new BaseRoomScene(gameEngine, CleaningRoom, allowedRoomIds, orderLoop);
    const pharmaScene = new BaseRoomScene(gameEngine, PharmaRoom, allowedRoomIds, orderLoop);
    const checkoutScene = new BaseRoomScene(gameEngine, CheckoutRoom, allowedRoomIds, orderLoop);
    const deliveryScene = new BaseRoomScene(gameEngine, DeliveryRoom, allowedRoomIds, orderLoop);
    // Pre-register all rooms so they're ready when the player walks through doors
    sceneManager.registerScene(ElectronicsRoom.sceneId, ElectronicsScene);
    sceneManager.registerScene(HousingRoom.sceneId, HousingScene);
    sceneManager.registerScene(FoodRoom.sceneId, FoodScene);
    sceneManager.registerScene(CleaningRoom.sceneId, cleaningScene);
    sceneManager.registerScene(DeliveryRoom.sceneId, deliveryScene);
    sceneManager.registerScene(PharmaRoom.sceneId, pharmaScene);
    sceneManager.loadScene(CheckoutRoom.sceneId, checkoutScene);
    // Initialize order loop
    orderLoop.init(gameEngine.getGameContext().gameTime, levelParams.duration, levelParams.orderPromptVariability, levelParams.totalOrders, INVENTORY_MAX_SLOTS, allowedItems);
    sceneManager.addLevelEntity(orderLoop);
    // Initialize boss satisfaction
    bossSatisfaction.initialize(levelParams.duration);
    sceneManager.addLevelEntity(bossSatisfaction);
    /* Create vignette */
    const vignette = new Vignette();
    sceneManager.addUIEntity(vignette);
    MSG_SERVICE.queueMessage("SHIFT 5");
    MSG_SERVICE.queueMessage("You have " + levelParams.duration + " seconds");
}
