/**
 * Complete minimal example of integrating the order pickup system
 * Copy and adapt this code to your main.js file
 * @author pmo
 */
import { Entity } from "../entity.js";
import { InputAction } from "../inputactionlist.js";
import { staticPositionComponent } from "../componentLibrary/staticPositionComponent.js";
import { MovementComponent } from "../componentLibrary/movementComponent.js";
import { ShelfComponent } from "../componentLibrary/shelfComponent.js";
import { ShelfRenderer } from "../componentLibrary/shelfRenderer.js";
import { PlayerInteractionComponent } from "../componentLibrary/playerInteractionComponent.js";
import { OrderUIRenderer } from "../componentLibrary/orderUIRenderer.js";
import { OrderManager } from "./OrderManager.js";
/**
 * STEP-BY-STEP INTEGRATION GUIDE
 *
 * 1. Add this to your input map in main.ts:
 */
export const INPUT_MAP_WITH_PICKUP = [
    // Your existing mappings...
    { type: "key", value: "w", action: InputAction.MOVE_UP },
    { type: "key", value: "a", action: InputAction.MOVE_LEFT },
    { type: "key", value: "s", action: InputAction.MOVE_DOWN },
    { type: "key", value: "d", action: InputAction.MOVE_RIGHT },
    // Add E key for pickup
    { type: "key", value: "e", action: InputAction.PICK_UP },
    { type: "key", value: "E", action: InputAction.PICK_UP }
];
/**
 * 2. After creating your game engine and player, add this:
 */
export async function initializeOrderPickupSystem(gameEngine, assetManager, playerEntity) {
    console.log("🛒 Initializing Order Pickup System...");
    // ===== LOAD ASSETS =====
    assetManager.queueDownload("shelf", "img", "./assets/shelf.JPG");
    assetManager.queueDownload("items", "img", "./assets/items.png");
    await assetManager.downloadAll();
    const shelfImage = assetManager.getImageAsset("shelf");
    const itemsSprite = assetManager.getImageAsset("items");
    if (!shelfImage || !itemsSprite) {
        throw new Error("Failed to load required assets: shelf.JPG and items.png");
    }
    // ===== CREATE SHELVES =====
    const shelfPositions = [
        { x: 200, y: 200 },
        { x: 400, y: 200 },
        { x: 600, y: 200 },
        { x: 200, y: 400 },
        { x: 400, y: 400 },
        { x: 600, y: 400 }
    ];
    const shelfComponents = [];
    for (const pos of shelfPositions) {
        const shelfEntity = new Entity();
        const posComp = new staticPositionComponent(pos);
        const shelfComp = new ShelfComponent(posComp, 60);
        const renderer = new ShelfRenderer(shelfImage, itemsSprite, posComp, shelfComp, 16, 16, // item sprite frame size
        8, -10, // item offset on shelf
        2.0 // scale
        );
        shelfEntity.addComponent(posComp);
        shelfEntity.addComponent(shelfComp);
        shelfEntity.setRenderer(renderer);
        gameEngine.addEntity(shelfEntity);
        shelfComponents.push(shelfComp);
    }
    // ===== CREATE ORDER MANAGER =====
    const orderManager = new OrderManager(shelfComponents, (orderState) => {
        console.log("✅ ORDER COMPLETE!");
        console.log("Collected:", Array.from(orderState.collectedItems));
        // Auto-start next order after 3 seconds
        setTimeout(() => {
            console.log("📋 Starting new order...");
            orderManager.startNewOrder();
        }, 3000);
    });
    // Start first order
    const orderState = orderManager.startNewOrder();
    // ===== ADD INTERACTION TO PLAYER =====
    // Get player position component (adjust this based on your player setup)
    const playerPos = playerEntity.getComponent(staticPositionComponent)
        || playerEntity.getComponent(MovementComponent);
    if (!playerPos) {
        throw new Error("Player must have a position component (staticPositionComponent or MovementComponent)");
    }
    const interactionComp = new PlayerInteractionComponent(playerPos, gameEngine.getInputSystem(), orderManager, (result) => {
        // This callback fires on every pickup attempt
        orderManager.handlePickup(result);
        // Optional: Add visual/audio feedback here
        if (result.success) {
            console.log("✓", result.message);
        }
        else {
            console.log("✗", result.message);
        }
    });
    playerEntity.addComponent(interactionComp);
    // ===== ADD UI =====
    const uiEntity = new Entity();
    const uiRenderer = new OrderUIRenderer(orderState, itemsSprite, 20, 20, // top-left corner
    16, 16, // item sprite size
    2.0, // icon scale
    40 // spacing between icons
    );
    uiEntity.setRenderer(uiRenderer);
    gameEngine.addEntity(uiEntity);
    console.log("✅ Order Pickup System initialized!");
}
/**
 * 3. In your main.ts, call it like this:
 *
 * async function main() {
 *   const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
 *   const ctx = canvas.getContext("2d")!;
 *   const assetManager = new AssetManager();
 *   const gameEngine = new GameEngine(ctx, INPUT_MAP_WITH_PICKUP);
 *
 *   // Create your player entity
 *   const player = createPlayerEntity(gameEngine, assetManager);
 *   gameEngine.addEntity(player);
 *
 *   // Initialize order pickup system
 *   await initializeOrderPickupSystem(gameEngine, assetManager, player);
 *
 *   // Start game
 *   gameEngine.start();
 * }
 *
 * main();
 */
