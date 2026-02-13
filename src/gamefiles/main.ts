import AssetManager from "../assetmanager.ts";
import GameEngine from "../gameengine.ts";
import { myInputMap } from "./inputmap.ts";
import { OrderDeliveryLoop } from "./ordermanagement/orderloopsys.ts";
import { environmentAssets, itemAssets, playerAssets } from "./assetlist.ts";
import { PlayerController } from "./player/playerController.ts";
import { ShelfController } from "./shelves/shelfController.ts";
import { ItemEntity } from "./ordermanagement/itemEntity.ts";
import { ItemType } from "./ordermanagement/itemTypes.ts";
import { InventoryManager } from "./inventory/inventoryManager.ts";
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

const gameEngine = new GameEngine(ctx, myInputMap, { debugging: true });
export const ASSET_MANAGER = new AssetManager();

gameEngine.addEntity(new OrderDeliveryLoop(gameEngine.getGameContext().gameTime, 120, 8, 10))

// Download assets and start the game engine and related systems
playerAssets.forEach((asset) => ASSET_MANAGER.queueDownload(asset.id, asset.type, asset.location));
environmentAssets.forEach((asset) => ASSET_MANAGER.queueDownload(asset.id, asset.type, asset.location));
itemAssets.forEach((asset) => ASSET_MANAGER.queueDownload(asset.id, asset.type, asset.location));

ASSET_MANAGER.downloadAll().then(() => {
  // Start the game engine and components, pass control to the manager

  // Temporarily create an inventory manager (this should be managed by the scene manager)
  const inventorymgr = new InventoryManager(6);
  const temporaryInventoryDisplayEntity = new TemporaryInventoryDisplayEntity(256, ctx.canvas.height - 96, inventorymgr);
  gameEngine.addEntity(temporaryInventoryDisplayEntity); // temporarily add an entity to display the inventory renderer since the scene manager is still in progress

  // okay, temporarily create a player
  const player = new PlayerController(ASSET_MANAGER, gameEngine.getInputSystem(), {x: 50, y: 50}, 5, inventorymgr)
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

  const item = new ItemEntity(ItemType.TOILETPAPER, {x: 384, y: 72});
  gameEngine.addEntity(item);
  gameEngine.getCollisionSystem().addEntity(item);

  const item2 = new ItemEntity(ItemType.BUCKET, {x: 540, y: 72});
  gameEngine.addEntity(item2);
  gameEngine.getCollisionSystem().addEntity(item2);

  const item3 = new ItemEntity(ItemType.DETERGENT, {x: 760, y: 72});
  gameEngine.addEntity(item3);
  gameEngine.getCollisionSystem().addEntity(item3);

  gameEngine.start();
});

document.getElementById("btnDebug")?.addEventListener("click", () => {
  gameEngine.toggleDebugging();
})
