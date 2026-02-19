import AssetManager from "../assetmanager.ts";
import GameEngine from "../gameengine.ts";
import { myInputMap } from "./inputmap.ts";
import { environmentAssets, itemAssets, playerAssets } from "./assetlist.ts";
import SceneManager from "../sceneManager.ts";
import { DemoScene, BackStorageScene, ColdStorageScene } from "./scenes/complete_level_example.ts";
import { TemporaryInventoryDisplayEntity } from "./inventory/temporaryInventoryDisplayEntity.ts";
import { OrderDeliveryLoop } from "./ordermanagement/orderloopsys.ts";
import { ItemSpawner } from "./ordermanagement/itemSpawner.ts";

/**
 * This file bootstraps the game engine and loads
 * the core systems needed for the game. This script
 * does the minimum possible to accomplish this before
 * passing control to the game/scene manager.
 * 
 * @author Preston Sia
 */

const canvas: HTMLCanvasElement = document.getElementById("gameWorld") as HTMLCanvasElement;
const ctx = canvas?.getContext("2d");

if (ctx === null || ctx === undefined) {
  throw new Error("Unable to get 2D canvas context");
}

const sceneManager = new SceneManager();
const gameEngine = new GameEngine(ctx, sceneManager, myInputMap, { debugging: true });
export const ASSET_MANAGER = new AssetManager();

// Download assets and start the game engine and related systems
playerAssets.forEach((asset) => ASSET_MANAGER.queueDownload(asset.id, asset.type, asset.location));
environmentAssets.forEach((asset) => ASSET_MANAGER.queueDownload(asset.id, asset.type, asset.location));
itemAssets.forEach((asset) => ASSET_MANAGER.queueDownload(asset.id, asset.type, asset.location));

ASSET_MANAGER.downloadAll().then(() => {
  // Start the game engine and components, pass control to the manager

 // ========================================
 // Level-scoped entities that persist across all rooms should be added here.
 // ========================================

  const temporaryInventoryDisplayEntity = new TemporaryInventoryDisplayEntity(
    256,
    ctx.canvas.height - 96,
    sceneManager.gameState.inventoryManager
  );
  sceneManager.addLevelEntity(temporaryInventoryDisplayEntity);

  //start the order delivery loop, which is a level-scoped entity that persists across all rooms
  const orderLoop = new OrderDeliveryLoop(0, 120, 8, 10, sceneManager.gameState);
  sceneManager.addLevelEntity(orderLoop);

  //////////////// item
  const spawnConfigs = [
  {
    roomId: "demo",
    spawnPoints: [
      { x: 200, y: 200 },
      { x: 400, y: 200 },
      { x: 600, y: 200 },
      { x: 200, y: 450 },
      { x: 400, y: 450 },
    ]
  },
  {
    roomId: "backStorage",
    spawnPoints: [
      { x: 250, y: 250 },
      { x: 450, y: 250 },
      { x: 250, y: 450 },
    ]
  },
  {
    roomId: "coldStorage",
    spawnPoints: [
      { x: 150, y: 250 },
      { x: 350, y: 250 },
      { x: 550, y: 250 },
      { x: 150, y: 450 },
      { x: 350, y: 450 },
      { x: 550, y: 450 },
    ]
  }
];

const itemSpawner = new ItemSpawner(
  sceneManager,
  gameEngine.getCollisionSystem(),
  spawnConfigs
);
sceneManager.addLevelEntity(itemSpawner);

///// item ^

  // ========================================
  // Room-specific entities should be added in the individual scene files, not here.
  // ========================================

  // Pre-register all rooms so they're ready when the player walks through doors
  sceneManager.registerScene("backStorage", new BackStorageScene(gameEngine));
  sceneManager.registerScene("coldStorage", new ColdStorageScene(gameEngine));

  // Load the starting room — this is the main store floor
  sceneManager.loadScene("demo", new DemoScene(gameEngine));

  gameEngine.start();
});

document.getElementById("btnDebug")?.addEventListener("click", () => {
  gameEngine.toggleDebugging();
});