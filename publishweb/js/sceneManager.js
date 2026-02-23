import { BasicLifecycle } from "./componentLibrary/lifecycle.js";
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
    constructor() {
        this.currentScene = null;
        this.currentScene = null;
        this.gameState = null;
        this.roomEntities = [];
        this.levelEntities = [];
        this.uiEntities = [];
        this.sceneCache = new Map();
    }
    /**
     * Adds an entity to the current ROOM
     * Cached per-room and restored on re-entry
     * @param entity
     */
    addEntity(entity) {
        this.roomEntities.push(entity);
    }
    /**
    * Adds a level-scoped entity that persists across all room transitions.
    * Use this for: OrderDeliveryLoop, UI elements, persistent effects, etc.
    */
    addLevelEntity(entity) {
        this.levelEntities.push(entity);
    }
    addUIEntity(entity) {
        this.uiEntities.push(entity);
    }
    clearEntities() {
        this.roomEntities = [];
    }
    getLevelEntities() {
        return this.levelEntities;
    }
    /**
     * Pre-registers a scene in the cache without loading it.
     * Useful for registering all rooms at startup so they're
     * ready when the player walks through a door.
     * @param sceneId string representing ID of a scene
     * @param scene IScene representing a scene
     */
    registerScene(sceneId, scene) {
        this.sceneCache.set(sceneId, scene);
    }
    /**
     * Register an active game state controller
     * so that the scene manager may interact with it.
     * (e.g. reset game state)
     * @param gs GameState instance
     */
    enrollGameState(gs) {
        this.gameState = gs;
    }
    /**
     * Clears the scene cache and resets all global state.
     * Use this when starting a new level or resetting the game.
     */
    resetAll() {
        this.sceneCache.clear();
        this.clearEntities();
        this.levelEntities = [];
        this.uiEntities = [];
        this.currentScene = null;
        if (this.gameState !== null)
            this.gameState.reset();
    }
    update(context) {
        var _a;
        // Update scene logic
        (_a = this.currentScene) === null || _a === void 0 ? void 0 : _a.update(context);
        //update UI entities
        this.uiEntities = this.uiEntities.filter((entity) => {
            const lifecycle = entity.getComponent(BasicLifecycle);
            return !lifecycle || lifecycle.isAlive();
        });
        this.uiEntities.forEach((entity) => {
            entity.update(context);
        });
        // Update level entities (these persist across rooms)
        this.levelEntities = this.levelEntities.filter((entity) => {
            const lifecycle = entity.getComponent(BasicLifecycle);
            return !lifecycle || lifecycle.isAlive();
        });
        this.levelEntities.forEach((entity) => {
            entity.update(context);
        });
        // Update room entities (these are room-specific)
        this.roomEntities.forEach((entity) => {
            const entityLifecycle = entity.getComponent(BasicLifecycle);
            if (entityLifecycle && !entityLifecycle.isAlive()) {
                return;
            }
            else {
                entity.update(context);
            }
        });
    }
    draw(context) {
        var _a, _b, _c, _d, _e;
        (_a = this.currentScene) === null || _a === void 0 ? void 0 : _a.draw(context);
        //draw in order: shelves --> items/player --> UI
        // 1. Room entities (shelves, doors)
        for (let i = this.roomEntities.length - 1; i >= 0; i--) {
            const entityLifecycle = (_b = this.roomEntities[i]) === null || _b === void 0 ? void 0 : _b.getComponent(BasicLifecycle);
            if (entityLifecycle && !entityLifecycle.isAlive()) {
                continue;
            }
            else {
                (_c = this.roomEntities[i]) === null || _c === void 0 ? void 0 : _c.draw(context);
            }
        }
        // 2. Level entities (player, items)
        for (let i = this.levelEntities.length - 1; i >= 0; i--) {
            (_d = this.levelEntities[i]) === null || _d === void 0 ? void 0 : _d.draw(context);
        }
        // 3. UI entities (drawn on top of everything)
        for (let i = this.uiEntities.length - 1; i >= 0; i--) {
            (_e = this.uiEntities[i]) === null || _e === void 0 ? void 0 : _e.draw(context);
        }
    }
    /**
     * Loads a scene by id. If the scene has been visited before,
     * the cached version is restored so room state is preserved.
     *
     * Pass a scene instance the first time you load it, or use
     * registerScene() to pre-register scenes ahead of time.
     */
    loadScene(sceneId, scene) {
        var _a, _b;
        (_a = this.currentScene) === null || _a === void 0 ? void 0 : _a.onExit();
        this.clearEntities();
        if (this.sceneCache.has(sceneId)) {
            const cachedScene = this.sceneCache.get(sceneId);
            // Check if this scene has been entered before by checking if it has entities
            // If this is a BaseRoomScene, it will have entities array
            const hasBeenEntered = ((_b = cachedScene.localEntities) === null || _b === void 0 ? void 0 : _b.length) > 0;
            if (hasBeenEntered) {
                // Scene has been visited before - resume it
                this.currentScene = cachedScene;
                cachedScene.onResume(this);
            }
            else {
                // Scene is registered but never entered - enter it for the first time
                this.currentScene = cachedScene;
                cachedScene.onEnter(this);
            }
        }
        else if (scene) {
            // Not registered at all - register and enter
            this.sceneCache.set(sceneId, scene);
            this.currentScene = scene;
            scene.onEnter(this);
        }
        else {
            console.error(`Scene "${sceneId}" not found in cache and no scene instance was provided.`);
        }
    }
}
