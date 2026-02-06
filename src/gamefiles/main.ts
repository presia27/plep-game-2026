import AssetManager from "../assetmanager.ts";
import GameEngine from "../gameengine.ts";
import { myInputMap } from "./inputmap.ts";
import { OrderDeliveryLoop } from "./ordermanagement/orderloopsys.ts";
import { environmentAssets, itemAssets, playerAssets } from "./assetlist.ts";
import { PlayerController } from "./player/playerController.ts";
import { ShelfController } from "./shelves/shelfController.ts";

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

const gameEngine = new GameEngine(ctx, myInputMap, { debugging: true });
const ASSET_MANAGER = new AssetManager();

gameEngine.addEntity(new OrderDeliveryLoop(gameEngine.getGameContext().gameTime, 120, 8, 10))

// Download assets and start the game engine and related systems
playerAssets.forEach((asset) => ASSET_MANAGER.queueDownload(asset.id, asset.type, asset.location));
environmentAssets.forEach((asset) => ASSET_MANAGER.queueDownload(asset.id, asset.type, asset.location));
itemAssets.forEach((asset) => ASSET_MANAGER.queueDownload(asset.id, asset.type, asset.location));

ASSET_MANAGER.downloadAll().then(() => {
  // Start the game engine and components, pass control to the manager

  // okay, temporarily create a player
  const player = new PlayerController(ASSET_MANAGER, gameEngine.getInputSystem(), {x: 50, y: 50}, 5)
  gameEngine.addEntity(player);
  gameEngine.getCollisionSystem().addEntity(player);

  // SHELVES

  // Create shelves TEMPORARILY
  const shelfPositions = [
    { x: 100, y: 150 },
    { x: 400, y: 150 },
    { x: 700, y: 150 },
    { x: 100, y: 500 },
    { x: 400, y: 500 },
    { x: 700, y: 500 }
  ];

  const shelfSprite = ASSET_MANAGER.getImageAsset("HShelvesNoVines");
  if (shelfSprite === null) {
    throw new Error("Failed to load asset for the horizontal shelves without vines!");
  }

  for (const pos of shelfPositions) {
    const shelf = new ShelfController(pos, shelfSprite);

    gameEngine.addEntity(shelf);
    gameEngine.getCollisionSystem().addEntity(shelf);
  }

  gameEngine.start();
});

document.getElementById("btnDebug")?.addEventListener("click", () => {
  gameEngine.toggleDebugging();
})
