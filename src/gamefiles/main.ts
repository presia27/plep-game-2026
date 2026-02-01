import AssetManager from "../assetmanager.ts";
import GameEngine from "../gameengine.ts";
import { myInputMap } from "./inputmap.ts";
import { OrderDeliveryLoop } from "./ordermanagement/orderloopsys.ts";

const canvas: HTMLCanvasElement = document.getElementById("gameWorld") as HTMLCanvasElement;
const ctx = canvas?.getContext("2d");

if (ctx === null || ctx === undefined) {
  throw new Error("Unable to get 2D canvas context");
}

const gameEngine = new GameEngine(ctx, myInputMap);
const ASSET_MANAGER = new AssetManager();

gameEngine.start();

gameEngine.addEntity(new OrderDeliveryLoop(gameEngine.getGameContext().gameTime, 120, 8, 10))

// Download assets and start the game engine and related systems
