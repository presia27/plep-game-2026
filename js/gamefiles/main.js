import AssetManager from "../assetmanager.js";
import GameEngine from "../gameengine.js";
import { myInputMap } from "./inputmap.js";
import { OrderDeliveryLoop } from "./ordermanagement/orderloopsys.js";
const canvas = document.getElementById("gameWorld");
const ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext("2d");
if (ctx === null || ctx === undefined) {
    throw new Error("Unable to get 2D canvas context");
}
const gameEngine = new GameEngine(ctx, myInputMap);
const ASSET_MANAGER = new AssetManager();
gameEngine.start();
gameEngine.addEntity(new OrderDeliveryLoop(gameEngine.getGameContext().gameTime, 120, 8, 10));
// Download assets and start the game engine and related systems
