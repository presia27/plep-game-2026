import AssetManager from "../assetmanager.ts";
import GameEngine from "../gameengine.ts";
import { myInputMap } from "./inputmap.ts";
import { environmentAssets, monsterAssets, itemAssets, playerAssets } from "./assetlist.ts";
import SceneManager from "../sceneManager.ts";
import { GameState } from "../gameState.ts";

/**
 * This file bootstraps the game engine and loads
 * the core systems needed for the game. This script
 * does the minimum possible to accomplish this before
 * passing control to the game/scene manager.
 * 
 * @author Preston Sia, Luke Willis
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
monsterAssets.forEach((asset) => ASSET_MANAGER.queueDownload(asset.id, asset.type, asset.location));
environmentAssets.forEach((asset) => ASSET_MANAGER.queueDownload(asset.id, asset.type, asset.location));
itemAssets.forEach((asset) => ASSET_MANAGER.queueDownload(asset.id, asset.type, asset.location));

ASSET_MANAGER.downloadAll().then(() => {
  // Initialize the game engine and components, pass control to the manager
  const gameState = new GameState(gameEngine, sceneManager, ctx);

  gameEngine.start();
});

document.getElementById("btnDebug")?.addEventListener("click", () => {
  gameEngine.toggleDebugging();
});