import AssetManager from "../assetmanager.ts";
import GameEngine from "../gameengine.ts";
import { myInputMap } from "./inputmap.ts";
import { OrderDeliveryLoop } from "./ordermanagement/orderloopsys.ts";
import { environmentAssets, itemAssets, playerAssets } from "./assetlist.ts";
import { PlayerController } from "./player/playerController.ts";
import { ShelfController } from "./shelves/shelfController.ts";
import SceneManager from "../sceneManager.ts";
import { DemoScene } from "./scenes/demoscene.ts";

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

  const demoScene = new DemoScene(gameEngine);
  sceneManager.loadScene(demoScene);

  gameEngine.start();
});

document.getElementById("btnDebug")?.addEventListener("click", () => {
  gameEngine.toggleDebugging();
})
