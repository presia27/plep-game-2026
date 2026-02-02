/**
 * Example implementation of the Order Pickup objective system
 * This file demonstrates how to integrate all the components
 * @author pmo
 */
import { Entity } from "../entity.js";
import { staticPositionComponent } from "../componentLibrary/staticPositionComponent.js";
import { ShelfComponent } from "../componentLibrary/shelfComponent.js";
import { ShelfRenderer } from "../componentLibrary/shelfRenderer.js";
import { OrderUIRenderer } from "../componentLibrary/orderUIRenderer.js";
import { OrderManager } from "./OrderManager.js";
import { InputAction } from "../inputactionlist.js";
/**
 * Example: Setting up the order pickup system
 *
 * This function shows how to:
 * 1. Load required assets (shelf.JPG and items.png)
 * 2. Create shelf entities with items
 * 3. Set up player interaction
 * 4. Display the order UI
 * 5. Handle order completion
 */
export async function setupOrderPickupExample(gameEngine, assetManager, playerEntity) {
    // ===== STEP 1: Load Assets =====
    console.log("Loading order system assets...");
    // Queue and download assets
    assetManager.queueDownload("shelf", "img", "./assets/shelf.JPG");
    assetManager.queueDownload("items", "img", "./assets/items.png");
    await assetManager.downloadAll();
    // Get loaded assets
    const shelfImage = assetManager.getImageAsset("shelf");
    const itemsSpritesheet = assetManager.getImageAsset("items");
    if (!shelfImage || !itemsSpritesheet) {
        throw new Error("Failed to load required assets: shelf.JPG and items.png");
    }
    // ===== STEP 2: Create Shelf Entities =====
    console.log("Creating shelf entities...");
    // Define shelf positions in the world
    const shelfPositions = [
        { x: 200, y: 150 },
        { x: 400, y: 150 },
        { x: 600, y: 150 },
        { x: 200, y: 350 },
        { x: 400, y: 350 },
        { x: 600, y: 350 }
    ];
    const shelfComponents = [];
    const shelfEntities = [];
    for (const pos of shelfPositions) {
        // Create shelf entity
        const shelfEntity = new Entity();
        // Add position component
        const positionComp = new staticPositionComponent(pos);
        shelfEntity.addComponent(positionComp);
        // Add shelf component (manages item storage)
        const shelfComp = new ShelfComponent(positionComp, 60, null); // 60px interaction radius
        shelfEntity.addComponent(shelfComp);
        shelfComponents.push(shelfComp);
        // Add renderer
        const renderer = new ShelfRenderer(shelfImage, itemsSpritesheet, positionComp, shelfComp, 16, 16, // item frame dimensions
        8, -10, // item offset on shelf
        2.0 // scale
        );
        shelfEntity.setRenderer(renderer);
        // Add to game engine
        gameEngine.addEntity(shelfEntity);
        shelfEntities.push(shelfEntity);
    }
    // ===== STEP 3: Create Order Manager =====
    console.log("Creating order manager...");
    const orderManager = new OrderManager(shelfComponents, (orderState) => {
        console.log("🎉 ORDER COMPLETED! 🎉");
        console.log("Collected items:", Array.from(orderState.collectedItems));
        // Example: Start a new order after 2 seconds
        setTimeout(() => {
            console.log("Starting new order...");
            orderManager.startNewOrder();
        }, 2000);
    });
    // Start the first order
    const initialOrder = orderManager.startNewOrder();
    console.log("First order started!");
    // ===== STEP 4: Set Up Player Interaction =====
    console.log("Setting up player interaction...");
    // Get player's position component (assumes player entity has one)
    const playerPos = playerEntity.getComponent(staticPositionComponent);
    if (!playerPos) {
        throw new Error("Player entity must have a position component!");
    }
    // Get input system from game engine (you'll need to expose this)
    // For now, we'll assume it's accessible
    // const inputSystem = gameEngine.getInputSystem();
    // Create interaction component
    // NOTE: You need to pass the actual input system from your game setup
    // const interactionComp = new PlayerInteractionComponent(
    //   playerPos,
    //   inputSystem,
    //   initialOrder,
    //   shelfComponents,
    //   (result) => orderManager.handlePickup(result)
    // );
    // playerEntity.addComponent(interactionComp);
    // ===== STEP 5: Create UI Display =====
    console.log("Creating order UI...");
    // Create UI entity (doesn't need position, draws at fixed screen location)
    const uiEntity = new Entity();
    const uiRenderer = new OrderUIRenderer(initialOrder, itemsSpritesheet, 20, // x position
    20, // y position
    16, // item frame width
    16, // item frame height
    2.0, // icon scale
    40 // icon spacing
    );
    uiEntity.setRenderer(uiRenderer);
    gameEngine.addEntity(uiEntity);
    console.log("Order pickup system setup complete!");
    return orderManager;
}
/**
 * Example input map configuration for order pickup
 * Add this to your main game input map
 */
export const orderPickupInputMap = [
    { type: "key", value: "e", action: InputAction.PICK_UP },
    { type: "key", value: "E", action: InputAction.PICK_UP }
];
export async function createOrderSystem(assetManager, shelfPositions) {
    // Load assets
    assetManager.queueDownload("shelf", "img", "./assets/shelf.JPG");
    assetManager.queueDownload("items", "img", "./assets/items.png");
    await assetManager.downloadAll();
    const shelfImage = assetManager.getImageAsset("shelf");
    const itemsSpritesheet = assetManager.getImageAsset("items");
    if (!shelfImage || !itemsSpritesheet) {
        throw new Error("Failed to load required assets: shelf.JPG and items.png");
    }
    // Create shelves
    const shelfComponents = [];
    const shelfEntities = [];
    for (const pos of shelfPositions) {
        const shelfEntity = new Entity();
        const positionComp = new staticPositionComponent(pos);
        const shelfComp = new ShelfComponent(positionComp, 60, null);
        const renderer = new ShelfRenderer(shelfImage, itemsSpritesheet, positionComp, shelfComp, 16, 16, 8, -10, 2.0);
        shelfEntity.addComponent(positionComp);
        shelfEntity.addComponent(shelfComp);
        shelfEntity.setRenderer(renderer);
        shelfComponents.push(shelfComp);
        shelfEntities.push(shelfEntity);
    }
    // Create order manager
    const orderManager = new OrderManager(shelfComponents);
    const initialOrder = orderManager.startNewOrder();
    // Create UI
    const uiEntity = new Entity();
    const uiRenderer = new OrderUIRenderer(initialOrder, itemsSpritesheet, 20, 20, 16, 16, 2.0, 40);
    uiEntity.setRenderer(uiRenderer);
    return {
        orderManager,
        shelfEntities,
        shelfComponents,
        uiEntity,
        uiRenderer
    };
}
