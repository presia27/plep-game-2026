import AssetManager from "../assetmanager.ts";
import GameEngine from "../gameengine.ts";
import { myInputMap } from "./inputmap.ts";
import { environmentAssets, itemAssets, playerAssets } from "./assetlist.ts";
import SceneManager from "../sceneManager.ts";
import { DemoScene, BackStorageScene, ColdStorageScene } from "./scenes/complete_level_example.ts";
import { TemporaryInventoryDisplayEntity } from "./inventory/temporaryInventoryDisplayEntity.ts";

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

  // GameState now lives in SceneManager, access inventory from there
  const temporaryInventoryDisplayEntity = new TemporaryInventoryDisplayEntity(
    256,
    ctx.canvas.height - 96,
    sceneManager.gameState.inventoryManager
  );
  sceneManager.addEntity(temporaryInventoryDisplayEntity);

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