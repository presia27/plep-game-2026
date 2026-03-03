import { INVENTORY_MAX_SLOTS } from "../../gameState.js";
import { BossSatisfaction } from "../bosssatisfaction/bossSatisfactionController.js";
import { TemporarySatisfactionDisplayEntity } from "../bosssatisfaction/temporarySatisfactionDisplayEntity.js";
import { OrderDisplayEntity } from "../ordermanagement/orderdisplayentity.js";
import { OrderDeliveryLoop } from "../ordermanagement/orderloopsys.js";
import { CleaningScene } from "../scenes/rooms/cleaningScene.js";
import { FoodScene } from "../scenes/rooms/foodScene.js";
import { PharmaScene } from "../scenes/rooms/pharmaScene.js";
/**
 * Represents concrete level data/parameters
 * @author Preston Sia
 */
const levelParams = {
    duration: 120,
    orderPromptVariability: 6,
    totalOrders: 10
};
export function loadLevelOne(gameEngine, sceneManager, ctx, inventoryManager) {
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
    const orderLoop = new OrderDeliveryLoop(gameEngine.getGameContext().gameTime, levelParams.duration, levelParams.orderPromptVariability, levelParams.totalOrders, INVENTORY_MAX_SLOTS, allowedItems);
    sceneManager.addLevelEntity(orderLoop);
    const orderDisplayEntity = new OrderDisplayEntity(720, ctx.canvas.height - 96, orderLoop);
    sceneManager.addUIEntity(orderDisplayEntity);
    // Register the order loop as a listener of the inventory
    inventoryManager.subscribe(orderLoop);
    // Add boss satisfaction manager
    const bossSatisfaction = new BossSatisfaction(orderLoop);
    sceneManager.addLevelEntity(bossSatisfaction);
    const temporarySatisfactionDisplayEntity = new TemporarySatisfactionDisplayEntity(900, 30, bossSatisfaction);
    sceneManager.addUIEntity(temporarySatisfactionDisplayEntity); // temporarily add an entity to display the boss satisfaction renderer since the scene manager is still in progress
}
