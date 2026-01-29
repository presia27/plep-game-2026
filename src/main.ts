/**
 * Main entry point for the PLEP game
 * @author Preston Sia
 */

import GameEngine from "./gameengine.ts";
import AssetManager from "./assetmanager.ts";
import { Entity } from "./entity.ts";
import { MovementComponent } from "./componentLibrary/movementComponent.ts";
import { PlayerController } from "./componentLibrary/playerController.ts";
import { ImageRenderer } from "./componentLibrary/imageRenderer.ts";
import { AnimatedSpriteRenderer } from "./componentLibrary/animatedSpriteRenderer.ts";
import { BasicSize } from "./componentLibrary/BasicSize.ts";
import { staticPositionComponent } from "./componentLibrary/staticPositionComponent.ts";
import { BoundingBox } from "./componentLibrary/boundingBox.ts";
import { PlayerCollisionHandler } from "./componentLibrary/playerCollisionHandler.ts";
import { InputMapValue } from "./typeinterfaces.ts";
import { InputAction } from "./inputactionlist.ts";

// Define WASD input mapping
const inputMap: InputMapValue[] = [
  { type: "key", value: "w", action: InputAction.MOVE_UP },
  { type: "key", value: "a", action: InputAction.MOVE_LEFT },
  { type: "key", value: "s", action: InputAction.MOVE_DOWN },
  { type: "key", value: "d", action: InputAction.MOVE_RIGHT }
];

// Asset manager for loading images
const ASSET = new AssetManager();

// Queue the animated sprite sheet and other images
ASSET.queueDownload("employeeSprite", "img", "./assets/EmployeeFullSpriteSheet.png");
ASSET.queueDownload("shelf", "img", "./assets/shelf.JPG");

// Wait for assets to load, then start the game
ASSET.downloadAll().then(() => {
  console.log("Assets loaded successfully!");
  startGame();
}).catch((error) => {
  console.error("Failed to load assets:", error);
});

function startGame() {
  // Get canvas and create game engine
  const canvas = document.getElementById("gameWorld") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  
  if (!ctx) {
    console.error("Failed to get canvas context");
    return;
  }

  const gameEngine = new GameEngine(ctx, inputMap, { debugging: false });

  // Get the employee sprite sheet
  const employeeSpriteSheet = ASSET.getImageAsset("employeeSprite");
  if (!employeeSpriteSheet) {
    console.error("Failed to load employee sprite sheet");
    return;
  }

  // Get the shelf image
  const shelfImage = ASSET.getImageAsset("shelf");
  if (!shelfImage) {
    console.error("Failed to load shelf image");
    return;
  }

  // Create player entity
  const player = new Entity();
  
  // Add movement component (starting position at center of canvas)
  const movementComponent = new MovementComponent(
    { x: canvas.width / 2, y: canvas.height / 2 },
    200 // movement speed in pixels per second
  );
  player.addComponent(movementComponent);

  // Add size component (scale the image to reasonable size)
  const sizeComponent = new BasicSize(100, 100, 1.0); // width, height, scale
  player.addComponent(sizeComponent);

  // Add player controller (handles WASD input)
  const playerController = new PlayerController(
    movementComponent,
    gameEngine.getInputSystem(),
    200 // movement speed
  );
  player.addComponent(playerController);

  // Set the animated sprite renderer
  const renderer = new AnimatedSpriteRenderer(
    employeeSpriteSheet, 
    movementComponent, 
    sizeComponent,
    gameEngine.getInputSystem(),
    5.0 // scale factor
  );
  player.setRenderer(renderer);

  // Add bounding box for collision detection
  const playerBoundingBox = new BoundingBox(movementComponent, sizeComponent);
  player.addComponent(playerBoundingBox);

  // Add collision handler
  const playerCollisionHandler = new PlayerCollisionHandler(movementComponent, sizeComponent);
  player.addComponent(playerCollisionHandler);

  // Add player to game and collision system
  gameEngine.addEntity(player);
  gameEngine.getCollisionSystem().addEntity(player);

  // Create shelf entity (static obstacle)
  const shelf = new Entity();

  // Position the shelf in the middle-right of the screen
  const shelfPosition = new staticPositionComponent({ x: 600, y: 300 });
  shelf.addComponent(shelfPosition);

  // Size the shelf
  const shelfSize = new BasicSize(150, 150, 1.0);
  shelf.addComponent(shelfSize);

  // Add renderer for the shelf
  const shelfRenderer = new ImageRenderer(shelfImage, shelfPosition, shelfSize);
  shelf.setRenderer(shelfRenderer);

  // Add bounding box for shelf collision
  const shelfBoundingBox = new BoundingBox(shelfPosition, shelfSize);
  shelf.addComponent(shelfBoundingBox);

  // Add shelf to game and collision system
  gameEngine.addEntity(shelf);
  gameEngine.getCollisionSystem().addEntity(shelf);

  // Set up debug toggle button
  const debugButton = document.getElementById("btnDebug");
  if (debugButton) {
    debugButton.addEventListener("click", () => {
      gameEngine.toggleDebugging();
    });
  }

  // Start the game loop
  gameEngine.start();
  console.log("Game started! Use WASD to move the character.");
}
