import {GameContext, IEntity, IScene} from "./classinterfaces.ts";
import { BasicLifecycle } from "./componentLibrary/lifecycle.ts";

/**
 * Manage scenes and entities for the game.
 * 
 * @author Luke Willis, Preston Sia, Claude Sonnet 4.5
 */
export default class SceneManager {
  private currentScene: IScene | null = null;
  private entities: IEntity[];  // SceneManager owns entities now

  constructor() {
    this.entities = [];
  }

  public addEntity(entity: IEntity): void {
    this.entities.push(entity);
  }

  public clearEntities(): void {
    this.entities = [];
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

  public loadScene(scene: IScene): void {
    this.currentScene?.onExit();
    this.clearEntities();
    
    this.currentScene = scene;
    scene.onEnter(this);  // Pass SceneManager to scene
    // Does introduce some coupling, similar to Marriott's game engine,
    // but I think this is okay here now that sceneManager is separate
    // from the rest of the game engine.
  }
}
