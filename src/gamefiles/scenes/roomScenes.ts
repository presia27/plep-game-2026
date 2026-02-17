import GameEngine from "../../gameengine.ts";
import { XY } from "../../typeinterfaces.ts";
import { BaseRoomScene } from "./baseRoomScene.ts";

///revise///

/**
 * Example room scenes demonstrating how to create new rooms
 * using BaseRoomScene. Each room only needs to define three
 * things: player spawn point, shelf layout, and door locations.
 *
 * To add a new room to the game:
 *   1. Create a class extending BaseRoomScene here (or in its own file)
 *   2. Implement the three abstract methods
 *   3. Register it in main.ts via sceneManager.registerScene()
 *
 * @author Luke Willis, Claude 4.5 Sonnet
 */

// -------------------------------------------------------
// DEMO SCENE (main store floor)
// -------------------------------------------------------
export class DemoScene extends BaseRoomScene {
  constructor(game: GameEngine) { super(game); }

  protected getPlayerSpawnPoint(): XY {
    return { x: 50, y: 50 };
  }

  protected getShelfPositions() {
    return [
      { position: { x: 150, y: 150 }, spriteId: "HShelvesNoVines" },
      { position: { x: 350, y: 150 }, spriteId: "HShelvesVines" },
      { position: { x: 550, y: 150 }, spriteId: "HShelvesNoVines" },
      { position: { x: 150, y: 500 }, spriteId: "HShelvesVines" },
      { position: { x: 350, y: 500 }, spriteId: "HShelvesNoVines" },
      { position: { x: 550, y: 500 }, spriteId: "HShelvesVines" },
    ];
  }

  protected getDoorTriggers() {
    return [
      // Right side door leads to the back room
      { position: { x: 740, y: 280 }, size: { x: 20, y: 80 }, targetSceneId: "backRoom" }
    ];
  }
}

// -------------------------------------------------------
// BACK ROOM SCENE
// -------------------------------------------------------
export class BackRoomScene extends BaseRoomScene {
  constructor(game: GameEngine) { super(game); }

  protected getPlayerSpawnPoint(): XY {
    // spawn on the left side since the player enters from the right
    return { x: 50, y: 300 };
  }

  protected getShelfPositions() {
    return [
      { position: { x: 200, y: 200 }, spriteId: "HShelvesVines" },
      { position: { x: 400, y: 200 }, spriteId: "HShelvesVines" },
      { position: { x: 200, y: 400 }, spriteId: "HShelvesNoVines" },
    ];
  }

  protected getDoorTriggers() {
    return [
      // Left side door leads back to the main floor
      { position: { x: 10, y: 280 }, size: { x: 20, y: 80 }, targetSceneId: "demo" },
      // Bottom door leads to storage
      { position: { x: 350, y: 580 }, size: { x: 80, y: 20 }, targetSceneId: "storage" }
    ];
  }
}

// -------------------------------------------------------
// STORAGE ROOM SCENE
// -------------------------------------------------------
export class StorageRoomScene extends BaseRoomScene {
  constructor(game: GameEngine) { super(game); }

  protected getPlayerSpawnPoint(): XY {
    return { x: 350, y: 50 };
  }

  protected getShelfPositions() {
    return [
      { position: { x: 100, y: 200 }, spriteId: "HShelvesNoVines" },
      { position: { x: 300, y: 200 }, spriteId: "HShelvesNoVines" },
      { position: { x: 500, y: 200 }, spriteId: "HShelvesNoVines" },
      { position: { x: 100, y: 400 }, spriteId: "HShelvesNoVines" },
      { position: { x: 300, y: 400 }, spriteId: "HShelvesNoVines" },
      { position: { x: 500, y: 400 }, spriteId: "HShelvesNoVines" },
    ];
  }

  protected getDoorTriggers() {
    return [
      // Top door leads back to the back room
      { position: { x: 350, y: 10 }, size: { x: 80, y: 20 }, targetSceneId: "backRoom" }
    ];
  }
}