import AssetManager from "../assetmanager.ts";
import GameEngine from "../gameengine.ts";
import { myInputMap } from "./inputmap.ts";
import { OrderDeliveryLoop } from "./ordermanagement/orderloopsys.ts";
import { Entity } from "../entity.ts";
import { staticPositionComponent } from "../componentLibrary/staticPositionComponent.ts";
import { MovementComponent } from "../componentLibrary/movementComponent.ts";
import { PlayerController } from "../componentLibrary/playerController.ts";
import { AnimatedSpriteRenderer } from "../componentLibrary/animatedSpriteRenderer.ts";
import { ShelfComponent } from "../componentLibrary/shelfComponent.ts";
import { ShelfRenderer } from "../componentLibrary/shelfRenderer.ts";
import { PlayerInteractionComponent } from "../componentLibrary/playerInteractionComponent.ts";
import { OrderUIRenderer } from "../componentLibrary/orderUIRenderer.ts";
import { OrderManager } from "./OrderManager.ts";

const canvas: HTMLCanvasElement = document.getElementById("gameWorld") as HTMLCanvasElement;
const ctx = canvas?.getContext("2d");

if (ctx === null || ctx === undefined) {
  throw new Error("Unable to get 2D canvas context");
}

const gameEngine = new GameEngine(ctx, myInputMap, { debugging: true });
const ASSET_MANAGER = new AssetManager();

gameEngine.addEntity(new OrderDeliveryLoop(gameEngine.getGameContext().gameTime, 120, 8, 10))

// Download assets and start the game engine and related systems

async function initGame() {
  // Queue assets
  ASSET_MANAGER.queueDownload("player", "img", "./assets/EmployeeFullSpriteSheet.png");
  ASSET_MANAGER.queueDownload("shelf", "img", "./assets/shelf.JPG");
  ASSET_MANAGER.queueDownload("items", "img", "./assets/items.png");
  
  // Download all assets
  await ASSET_MANAGER.downloadAll();
  
  // Get assets
  const playerSprite = ASSET_MANAGER.getImageAsset("player");
  const shelfImage = ASSET_MANAGER.getImageAsset("shelf");
  const itemsSprite = ASSET_MANAGER.getImageAsset("items");
  
  if (!playerSprite || !shelfImage || !itemsSprite) {
    console.error("Failed to load assets!");
    console.log("playerSprite:", playerSprite);
    console.log("shelfImage:", shelfImage);
    console.log("itemsSprite:", itemsSprite);
    return;
  }
  
  console.log("All assets loaded successfully");
  console.log("Items sprite dimensions:", itemsSprite.width, "x", itemsSprite.height);
  
  // Create player
  const player = new Entity();
  const playerPos = new MovementComponent({ x: 400, y: 300 });
  const playerController = new PlayerController(playerPos, gameEngine.getInputSystem(), 200);
  const playerRenderer = new AnimatedSpriteRenderer(
    playerSprite,
    playerPos,
    null,
    gameEngine.getInputSystem(),
    5.0
  );
  
  player.addComponent(playerPos);
  player.addComponent(playerController);
  player.setRenderer(playerRenderer);
  gameEngine.addEntity(player);
  
  // Create shelves
  const shelfPositions = [
    { x: 150, y: 150 },
    { x: 350, y: 150 },
    { x: 550, y: 150 },
    { x: 150, y: 350 },
    { x: 350, y: 350 },
    { x: 550, y: 350 }
  ];
  
  const shelfComponents: ShelfComponent[] = [];
  
  for (const pos of shelfPositions) {
    const shelfEntity = new Entity();
    const posComp = new staticPositionComponent(pos);
    const shelfComp = new ShelfComponent(posComp, 60);
    const renderer = new ShelfRenderer(
      shelfImage,
      itemsSprite,
      posComp,
      shelfComp,
      56, 60,  // item frame size (226/4 x 180/3)
      10, -30, // item offset (adjusted for larger sprites)
      1.5      // scale (reduced from 2.0)
    );
    
    shelfEntity.addComponent(posComp);
    shelfEntity.addComponent(shelfComp);
    shelfEntity.setRenderer(renderer);
    gameEngine.addEntity(shelfEntity);
    
    shelfComponents.push(shelfComp);
    
    console.log(`Created shelf at (${pos.x}, ${pos.y})`);
  }
  
  // Create order manager
  const orderManager = new OrderManager(shelfComponents, (orderState) => {
    console.log("ORDER COMPLETE!");
    console.log("Collected items:", Array.from(orderState.collectedItems));
    
    // Start new order after 2 seconds
    setTimeout(() => {
      console.log("Starting new order...");
      orderManager.startNewOrder();
    }, 2000);
  });
  
  // Start first order
  const orderState = orderManager.startNewOrder();
  console.log("Order system initialized!");
  console.log("Required items:", orderState.requiredItems);
  
  // Debug: Check which shelves have items
  console.log("Shelves with items:");
  shelfComponents.forEach((shelf, idx) => {
    const itemType = shelf.getItemType();
    if (itemType !== null) {
      console.log(`  Shelf ${idx}:`, itemType);
    }
  });
  
  // Add player interaction
  const interactionComp = new PlayerInteractionComponent(
    playerPos,
    gameEngine.getInputSystem(),
    orderManager,
    (result) => orderManager.handlePickup(result)
  );
  player.addComponent(interactionComp);
  
  // Create UI (add LAST so it draws on top.. hopefully)
  const uiEntity = new Entity();
  const uiRenderer = new OrderUIRenderer(
    orderState,
    itemsSprite,
    20, 20,     // position
    56, 60,     // item frame size (226/4 x 180/3)
    1.0,        // icon scale
    70          // icon spacing (increased for larger sprites)
  );
  uiEntity.setRenderer(uiRenderer);
  gameEngine.addEntity(uiEntity);
  
  console.log("UI created at position (20, 20)");
  
  // Start game
  gameEngine.start();
  console.log("Game started! Use WASD to move, E to pick up items.");
  console.log("Walk near a shelf (supposed to be green circle, for now just walk over the item sprite) and press E to collect items");
}

initGame().catch(console.error);
