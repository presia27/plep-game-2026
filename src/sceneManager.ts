import {GameContext, IEntity, IScene} from "./classinterfaces.ts";
import { BasicLifecycle } from "./componentLibrary/lifecycle.ts";
import { GameState } from "./gameState.ts";

/**
 * Manage scenes and entities for the game.
 * Owns the global GameState which is shared across scenes
 * 
 * SceneManager is the ruling class of the project, handling
 * transitions, global state, and level changing.
 * 
 * Entities are divided into two categories:
 *   1. LEVEL entities - persist across room transitions (OrderDeliveryLoop, UI)
 *   2. ROOM entities - specific to each room, cached when leaving
 * 
 * @author Luke Willis, Preston Sia, Claude Sonnet 4.5
 */
export default class SceneManager {
  private currentScene: IScene | null = null;
  private roomEntities: IEntity[];  // SceneManager owns entities now
  private levelEntities: IEntity[];  // SceneManager owns entities now
  private sceneCache: Map<string, IScene>; // cache scenes/rooms by id
  public gameState: GameState; // global state, accessible to all scenes


  constructor() {
    this.gameState = new GameState();
    this.roomEntities = [];
    this.levelEntities = [];
    this.sceneCache = new Map();
  }

  /**
   * Adds an entity to the current ROOM
   * Cached per-room and restored on re-entry
   * @param entity 
   */
  public addEntity(entity: IEntity): void {
    this.roomEntities.push(entity);
  }

   /**
   * Adds a level-scoped entity that persists across all room transitions.
   * Use this for: OrderDeliveryLoop, UI elements, persistent effects, etc.
   */
  public addLevelEntity(entity: IEntity): void {
    this.levelEntities.push(entity);
  }

  public clearEntities(): void {
    this.roomEntities = [];
  }

  public getLevelEntities(): IEntity[] {
    return this.levelEntities;
  }
  
  /**
   * Pre-registers a scene in the cache without loading it.
   * Useful for registering all rooms at startup so they're
   * ready when the player walks through a door.
   * @param sceneId string representing ID of a scene
   * @param scene IScene representing a scene
   */
  public registerScene(sceneId: string, scene: IScene): void {
    this.sceneCache.set(sceneId, scene);
  }
  
  /**
   * Clears the scene cache and resets all global state.
   * Use this when starting a new level or resetting the game.
   */
  public resetAll(): void {
    this.sceneCache.clear();
    this.clearEntities();
    this.currentScene = null;
    this.gameState.reset();
  }
  

  public update(context: GameContext): void {
    // Update scene logic
    this.currentScene?.update(context);

    // Update level entities (these persist across rooms)
    this.levelEntities = this.levelEntities.filter((entity) => {
      const lifecycle = entity.getComponent(BasicLifecycle);
      return !lifecycle || lifecycle.isAlive();
    });

    this.levelEntities.forEach((entity) => {
      entity.update(context);
    });

    // Update room entities (these are room-specific)
    this.roomEntities = this.roomEntities.filter((entity) => {
      const lifecycle = entity.getComponent(BasicLifecycle);
      return !lifecycle || lifecycle.isAlive();
    });

    this.roomEntities.forEach((entity) => {
      entity.update(context);
    });
  }


  public draw(context: GameContext): void {
    this.currentScene?.draw(context);

    // Draw level entities first (usually UI on top)
    for (let i = this.levelEntities.length - 1; i >= 0; i--) {
      this.levelEntities[i]?.draw(context);
    }

    // Draw room entities
    for (let i = this.roomEntities.length - 1; i >= 0; i--) {
      this.roomEntities[i]?.draw(context);
    }
  }

  /**
   * Loads a scene by id. If the scene has been visited before,
   * the cached version is restored so room state is preserved.
   *
   * Pass a scene instance the first time you load it, or use
   * registerScene() to pre-register scenes ahead of time.
   */
  public loadScene(sceneId: string, scene?: IScene): void {
    this.currentScene?.onExit();
    this.clearEntities();

    if (this.sceneCache.has(sceneId)) {
      // restore cached scene — onEnter is NOT called again, state is preserved
      this.currentScene = this.sceneCache.get(sceneId)!;
      this.currentScene.onResume(this); // re-add cached entities to sceneManager
    } else if (scene) {
      // first visit — cache and enter the scene fresh
      this.sceneCache.set(sceneId, scene);
      this.currentScene = scene;
      scene.onEnter(this);
    } else {
      console.error(`Scene "${sceneId}" not found in cache and no scene instance was provided.`);
    }
  }
}
