import { GameContext, IScene } from "../../classinterfaces.ts";
import { CollisionSystem } from "../../collisionsys.ts";
import GameEngine from "../../gameengine.ts";
import { InputSystem } from "../../inputsys.ts";
import SceneManager from "../../sceneManager.ts";
import { ASSET_MANAGER } from "../main.ts";
import { OrderDeliveryLoop } from "../ordermanagement/orderloopsys.ts";
import { PlayerController } from "../player/playerController.ts";
import { ShelfController } from "../shelves/shelfController.ts";

class DemoScene implements IScene {
  private inputSystem: InputSystem;
  private collisionSystem: CollisionSystem;
  private getContext: () => GameContext;

  constructor(game: GameEngine) {
    this.inputSystem = game.getInputSystem();
    this.collisionSystem = game.getCollisionSystem();
    this.getContext = game.getGameContext; // store the method for getting the game context
  }

  onEnter(sceneManager: SceneManager): void {
    sceneManager.addEntity(new OrderDeliveryLoop(this.getContext().gameTime, 120, 8, 10))
    const player = new PlayerController(ASSET_MANAGER, this.inputSystem, {x: 50, y: 50}, 5)
    sceneManager.addEntity(player);
    this.collisionSystem.addEntity(player);

    // SHELVES

    // Create shelves TEMPORARILY
    const shelfPositions = [
      { x: 150, y: 150 },
      { x: 350, y: 150 },
      { x: 550, y: 150 },
      { x: 150, y: 500 },
      { x: 350, y: 500 },
      { x: 550, y: 500 }
    ];

    const shelfSprite = ASSET_MANAGER.getImageAsset("shelf");
    if (shelfSprite === null) {
      throw new Error("Failed to load asset for the player");
    }
  
    for (const pos of shelfPositions) {
      const shelf = new ShelfController(pos, shelfSprite);
  
      sceneManager.addEntity(shelf);
      this.collisionSystem.addEntity(shelf);
    }
  }
  onExit(): void {
    
  }
  update(context: GameContext): void {
    
  }
  draw(context: GameContext): void {
    
  }
  
}