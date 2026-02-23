import { BossSatisfaction } from "../bosssatisfaction/bossSatisfactionController.js";
import { TemporarySatisfactionDisplayEntity } from "../bosssatisfaction/temporarySatisfactionDisplayEntity.js";
import { OrderDeliveryLoop } from "../ordermanagement/orderloopsys.js";
import { CleaningScene } from "../scenes/rooms/cleaningScene.js";
import { FoodScene } from "../scenes/rooms/foodScene.js";
import { PharmaScene } from "../scenes/rooms/pharmaScene.js";
/**
 * Represents concrete level data/parameters
 * @author Preston Sia
 */
const levelParams = {
    duration: 120
};
export function loadLevelOne(gameEngine, sceneManager) {
    // Create rooms
    const pharmaScene = new PharmaScene(gameEngine);
    const cleaningScene = new CleaningScene(gameEngine);
    const foodScene = new FoodScene(gameEngine);
    // Pre-register all rooms so they're ready when the player walks through doors
    sceneManager.registerScene(cleaningScene.getRoomId(), cleaningScene);
    sceneManager.registerScene(foodScene.getRoomId(), foodScene);
    sceneManager.loadScene(pharmaScene.getRoomId(), pharmaScene);
    // Add order loop
    const orderLoop = new OrderDeliveryLoop(gameEngine.getGameContext().gameTime, levelParams.duration, 8, 10);
    sceneManager.addLevelEntity(orderLoop);
    // Add boss satisfaction manager
    const bossSatisfaction = new BossSatisfaction(orderLoop);
    sceneManager.addLevelEntity(bossSatisfaction);
    const temporarySatisfactionDisplayEntity = new TemporarySatisfactionDisplayEntity(900, 30, bossSatisfaction);
    sceneManager.addUIEntity(temporarySatisfactionDisplayEntity); // temporarily add an entity to display the boss satisfaction renderer since the scene manager is still in progress
}
