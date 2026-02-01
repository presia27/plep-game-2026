/**
 * Main entry point for the PLEP game with Order Pickup System
 * @author Preston Sia, GitHub Copilot
 */

import GameEngine from "./gameengine.ts";
import AssetManager from "./assetmanager.ts";
import { Entity } from "./entity.ts";
import { MovementComponent } from "./componentLibrary/movementComponent.ts";
import { PlayerInputController } from "./gamefiles/player/playerInputController.ts";
import { AnimatedSpriteRenderer } from "./gamefiles/player/animatedSpriteRenderer.ts";
import { staticPositionComponent } from "./componentLibrary/staticPositionComponent.ts";
import { BoundingBox } from "./componentLibrary/boundingBox.ts";
import { BasicSize } from "./componentLibrary/BasicSize.ts";
import { PlayerCollisionHandler } from "./gamefiles/player/playerCollisionHandler.ts";
import { ShelfComponent } from "./componentLibrary/shelfComponent.ts";
import { ShelfRenderer } from "./componentLibrary/shelfRenderer.ts";
import { ShelfManagerRenderer } from "./componentLibrary/shelfManagerRenderer.ts";
import { PlayerInteractionComponent } from "./componentLibrary/playerInteractionComponent.ts";
import { OrderUIRenderer } from "./componentLibrary/orderUIRenderer.ts";
import { OrderManager } from "./gamefiles/OrderManager.ts";
import { myInputMap } from "./gamefiles/inputmap.ts";

const ASSET_MANAGER = new AssetManager();

// Download assets and start the game
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
  
  // Get canvas and create game engine
  const canvas = document.getElementById("gameWorld") as HTMLCanvasElement;
  const ctx = canvas?.getContext("2d");
  
  if (!ctx) {
    console.error("Failed to get canvas context");
    return;
  }
  
  const gameEngine = new GameEngine(ctx, myInputMap, { debugging: true });
  
  // Create player
  const player = new Entity();
  const playerPos = new MovementComponent({ x: 50, y: 50 }); // Start top-left, away from shelves
  const playerInputController = new PlayerInputController(playerPos, gameEngine.getInputSystem(), 200);
  const playerRenderer = new AnimatedSpriteRenderer(
    playerSprite,
    playerPos,
    null,
    gameEngine.getInputSystem(),
    5.0
  );
  
  // Add bounding box for collision (20x19 base size * 5.0 scale)
  const playerSize = new BasicSize(20, 19, 5.0);
  const playerBoundingBox = new BoundingBox(playerPos, playerSize);
  const playerCollisionHandler = new PlayerCollisionHandler(playerPos, playerSize);
  
  player.addComponent(playerPos);
  player.addComponent(playerSize);
  player.addComponent(playerBoundingBox);
  player.addComponent(playerCollisionHandler);
  player.addComponent(playerInputController);
  player.setRenderer(playerRenderer);
  gameEngine.addEntity(player);
  gameEngine.getCollisionSystem().addEntity(player); // Register player for collision detection
  
  // Create shelves
  const shelfPositions = [
    { x: 150, y: 150 },
    { x: 350, y: 150 },
    { x: 550, y: 150 },
    { x: 150, y: 500 },
    { x: 350, y: 500 },
    { x: 550, y: 500 }
  ];
  
  const shelfComponents: ShelfComponent[] = [];
  const shelfRenderers: ShelfRenderer[] = [];
  
  for (const pos of shelfPositions) {
    const shelfEntity = new Entity();
    const posComp = new staticPositionComponent(pos);
    const shelfComp = new ShelfComponent(posComp, 100); // Increased interaction radius to 100
    
    // Add size and collision
    const shelfSize = new BasicSize(shelfImage.width, shelfImage.height, 1.5);
    const shelfBoundingBox = new BoundingBox(posComp, shelfSize);
    
    const renderer = new ShelfRenderer(
      shelfImage,
      itemsSprite,
      posComp,
      shelfComp,
      56, 60,  // item frame size (226/4 x 180/3)
      10, -30, // item offset
      1.5      // scale
    );
    
    shelfEntity.addComponent(posComp);
    shelfEntity.addComponent(shelfSize);
    shelfEntity.addComponent(shelfBoundingBox);
    // Don't set renderer on individual shelf entities
    gameEngine.addEntity(shelfEntity);
    gameEngine.getCollisionSystem().addEntity(shelfEntity); // Register shelf for collision detection
    
    shelfComponents.push(shelfComp);
    shelfRenderers.push(renderer);  // Store renderer for manager
    
    console.log(`Created shelf at (${pos.x}, ${pos.y})`);
  }
  
  // Create shelf manager to render all shelves with proper layering
  const shelfManagerEntity = new Entity();
  const shelfManagerRenderer = new ShelfManagerRenderer(shelfRenderers);
  shelfManagerEntity.setRenderer(shelfManagerRenderer);
  gameEngine.addEntity(shelfManagerEntity);
  
  // Create order manager
  const orderManager = new OrderManager(shelfComponents, (orderState) => {
    console.log("ORDER COMPLETE!");
    console.log("Collected items:", Array.from(orderState.collectedItems));
    
    // Start new order after 2 seconds
    setTimeout(() => {
      console.log("📋 Starting new order...");
      orderManager.startNewOrder();
    }, 2000);
  });
  
  // Start first order
  const orderState = orderManager.startNewOrder();
  console.log("🛒 Order system initialized!");
  console.log("Required items:", orderState.requiredItems);
  
  // Debug: Check which shelves have items
  console.log("Shelves with items:");
  shelfComponents.forEach((shelf, idx) => {
    const itemType = shelf.getItemType();
    if (itemType !== null) {
      console.log(`  Shelf ${idx}:`, itemType);
    }
  });
  
  // Add player interaction - pass OrderManager instead of orderState
  const interactionComp = new PlayerInteractionComponent(
    playerPos,
    gameEngine.getInputSystem(),
    orderManager,
    (result) => orderManager.handlePickup(result)
  );
  player.addComponent(interactionComp);
  
  // Create UI (add LAST so it draws on top)
  const uiEntity = new Entity();
  const uiRenderer = new OrderUIRenderer(
    orderState,
    itemsSprite,
    20, 20,     // position
    56, 60,     // item frame size
    1.0,        // icon scale
    70          // icon spacing
  );
  uiEntity.setRenderer(uiRenderer);
  gameEngine.addEntity(uiEntity);
  
  console.log("UI created at position (20, 20)");
  
  // Set up debug toggle button
  const debugButton = document.getElementById("btnDebug");
  if (debugButton) {
    debugButton.addEventListener("click", () => {
      gameEngine.toggleDebugging();
    });
  }
  
  // Start game
  gameEngine.start();
  console.log("Game started! Use WASD to move, E to pick up items.");
  console.log("Walk near a shelf (green circle) and press E to collect items");
}

initGame().catch(console.error);
