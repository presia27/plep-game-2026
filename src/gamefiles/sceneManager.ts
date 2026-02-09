// Claude's opinion (doesn't work yet lol)
/*
typescriptclass GameEngine {
  private sceneManager: SceneManager;
  // No entities list here anymore!

  constructor(
    ctx: CanvasRenderingContext2D,
    inputMap: InputMapValue[],
    sceneManager: SceneManager,
    options?: Object
  ) {
    this.sceneManager = sceneManager;
  }

  private update() {
    const context = this.getGameContext();
    
    // SceneManager updates its own entities
    this.sceneManager.update(context);
    
    // Global systems still run
    this.collisionSystem.checkCollisions();
    this.inputSystem.onFrameUpdate();
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    const context = this.getGameContext();
    
    // SceneManager draws its own entities
    this.sceneManager.draw(context);
  }
}
 */
import {GameContext, IEntity, IScene} from "../classinterfaces.ts";

export default class SceneManager {
  private currentScene: IScene | null = null;
  private entities: IEntity[] = [];  // SceneManager owns entities now

  public addEntity(entity: IEntity): void {
    this.entities.push(entity);
  }

  public clearEntities(): void {
    this.entities = [];
  }

  public loadScene(scene: IScene): void {
    this.currentScene?.onExit();
    this.clearEntities();
    
    this.currentScene = scene;
    scene.onEnter(this);  // Pass SceneManager to scene
  }

  public update(context: GameContext): void {
    // Update scene logic
    this.currentScene?.update(context);
    
    // Update and filter entities
    this.entities = this.entities.filter((entity) => {
      const lifecycle = entity.getComponent(BasicLifecycle);
      return !lifecycle || lifecycle.isAlive();
    });

    this.entities.forEach((entity) => {
      entity.update(context);
    });
  }

  public draw(context: GameContext): void {
    this.currentScene?.draw(context);
    
    // Draw entities
    for (let i = this.entities.length - 1; i >= 0; i--) {
      this.entities[i]?.draw(context);
    }
  }
}

// Scene implementation
class MainMenuScene implements IScene {
  onEnter(sceneManager: SceneManager): void {
    const background = new Background();
    sceneManager.addEntity(background);
    
    const menuButton = new MenuButton();
    sceneManager.addEntity(menuButton);
  }

  onExit(): void {}
  update(context: GameContext): void {}
  draw(context: GameContext): void {}
}