import GameEngine from "../../gameengine.ts";
import SceneManager from "../../sceneManager.ts";
import { OrderDeliveryLoop } from "../ordermanagement/orderloopsys.ts";
import { CleaningScene } from "../scenes/rooms/cleaningScene.ts";
import { FoodScene } from "../scenes/rooms/foodScene.ts";
import { PharmaScene } from "../scenes/rooms/pharmaScene.ts";

/**
 * Represents concrete level data/parameters
 * @author Preston Sia
 */

const levelParams = {
  duration: 120
}

export function loadLevelOne(gameEngine: GameEngine, sceneManager: SceneManager) {
  // Create rooms
  const pharmaScene = new PharmaScene(gameEngine);
  const cleaningScene = new CleaningScene(gameEngine);
  const foodScene = new FoodScene(gameEngine);

  // Pre-register all rooms so they're ready when the player walks through doors
  sceneManager.registerScene(cleaningScene.getRoomId(), cleaningScene);
  sceneManager.registerScene(foodScene.getRoomId(), foodScene);

  sceneManager.loadScene(pharmaScene.getRoomId(), pharmaScene);
  
  // Add order loop
  const orderLoop = new OrderDeliveryLoop(
    gameEngine.getGameContext().gameTime,
    levelParams.duration,
    8,
    10
  );
  sceneManager.addLevelEntity(orderLoop);
}
