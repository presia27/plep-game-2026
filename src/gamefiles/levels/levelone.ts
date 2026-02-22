import GameEngine from "../../gameengine.ts";
import SceneManager from "../../sceneManager.ts";

/**
 * Represents concrete level data/parameters
 * @author Preston Sia
 */

const levelParams = {
  duration: 120
}

export function loadLevelOne(gameEngine: GameEngine, sceneManager: SceneManager) {
  // Pre-register all rooms so they're ready when the player walks through doors
  // sceneManager.registerScene("backStorage", new BackStorageScene(gameEngine));
  // sceneManager.registerScene("coldStorage", new ColdStorageScene(gameEngine));
}
