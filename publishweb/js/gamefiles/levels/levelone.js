import { INVENTORY_MAX_SLOTS } from "../../gameState.js";
import { MSG_SERVICE } from "../main.js";
import { BaseRoomScene } from "../scenes/baseRoomScene.js";
import { CheckoutRoom, DeliveryRoom, PharmaRoom } from "../scenes/roomData.js";
import { Vignette } from "../scenes/storeInterior/vignetteController.js";
/**
 * Represents concrete level data/parameters
 * @author Preston Sia
 */
const levelParams = {
    duration: 60,
    orderPromptVariability: 6,
    totalOrders: 2
};
export function loadLevelOne(gameEngine, sceneManager, ctx, inventoryManager, orderLoop, bossSatisfaction) {
    // Create rooms
    const allowedRoomIds = [
        PharmaRoom.sceneId,
        CheckoutRoom.sceneId,
        DeliveryRoom.sceneId
    ];
    // Get list of all allowed items for the level
    const allowedItems = PharmaRoom.allowedItems;
    const pharmaScene = new BaseRoomScene(gameEngine, PharmaRoom, allowedRoomIds, orderLoop);
    const checkoutScene = new BaseRoomScene(gameEngine, CheckoutRoom, allowedRoomIds, orderLoop);
    const deliveryScene = new BaseRoomScene(gameEngine, DeliveryRoom, allowedRoomIds, orderLoop);
    // Pre-register all rooms so they're ready when the player walks through doors
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
    MSG_SERVICE.queueMessage("SHIFT 1");
    MSG_SERVICE.queueMessage("You have " + levelParams.duration + " seconds");
}
