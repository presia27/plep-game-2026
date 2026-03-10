var _a;
import AssetManager from "../assetmanager.js";
import GameEngine from "../gameengine.js";
import { myInputMap } from "./inputmap.js";
import { deliveryAssets, environmentAssets, monsterAssets, itemAssets, playerAssets, bossAssets, soundEffects } from "./assetlist.js";
import SceneManager from "../sceneManager.js";
import { GameState } from "../gameState.js";
import { MessengerService } from "../messengerService.js";
/**
 * This file bootstraps the game engine and loads
 * the core systems needed for the game. This script
 * does the minimum possible to accomplish this before
 * passing control to the game/scene manager.
 *
 * @author Preston Sia, Luke Willis
 */
const canvas = document.getElementById("gameWorld");
const ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext("2d");
if (ctx === null || ctx === undefined) {
    throw new Error("Unable to get 2D canvas context");
}
const sceneManager = new SceneManager();
const gameEngine = new GameEngine(ctx, sceneManager, myInputMap, { debugging: false });
export const ASSET_MANAGER = new AssetManager();
export const MSG_SERVICE = new MessengerService();
// Download assets and start the game engine and related systems
playerAssets.forEach((asset) => ASSET_MANAGER.queueDownload(asset.id, asset.type, asset.location));
monsterAssets.forEach((asset) => ASSET_MANAGER.queueDownload(asset.id, asset.type, asset.location));
bossAssets.forEach((asset) => ASSET_MANAGER.queueDownload(asset.id, asset.type, asset.location));
environmentAssets.forEach((asset) => ASSET_MANAGER.queueDownload(asset.id, asset.type, asset.location));
itemAssets.forEach((asset) => ASSET_MANAGER.queueDownload(asset.id, asset.type, asset.location));
deliveryAssets.forEach((asset) => ASSET_MANAGER.queueDownload(asset.id, asset.type, asset.location));
soundEffects.forEach((asset) => ASSET_MANAGER.queueDownload(asset.id, asset.type, asset.location));
// Configure Fonts
const pixelFont = new FontFace("Jersey-20", 'url("./assets/Jersey20-Regular.ttf")');
document.fonts.add(pixelFont);
pixelFont.load().then(() => {
    console.log("Custom font loaded");
}, (err) => {
    console.error("Font not loaded properly.", err);
});
ASSET_MANAGER.downloadAll().then(() => {
    // Initialize the game engine and components, pass control to the manager
    const gameState = new GameState(gameEngine, sceneManager, ctx);
    gameEngine.start();
});
(_a = document.getElementById("btnDebug")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    gameEngine.toggleDebugging();
});
