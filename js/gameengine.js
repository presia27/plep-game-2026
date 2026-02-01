/**
 * Main Game Engine Script, refactored in TypeScript from Dr. Chris Marriott's game engine template
 *
 * Original comment: This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011
 * @author Preston Sia, KV Le, Chris Marriott, Seth Ladd
 */
import { Timer } from "./timer.js";
import { InputSystem } from "./inputsys.js";
import { BasicLifecycle } from "./componentLibrary/lifecycle.js";
import { CollisionSystem } from "./collisionsys.js";
export default class GameEngine {
    /**
     *
     * @param ctx An HTML canvas element
     * @param inputMap A user-defined map of peripheral inputs and intended action when actuated
     * @param options Option parameters to pass to the game
     */
    constructor(ctx, inputMap, options) {
        this.running = false;
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = ctx;
        // Disable image smoothing for crisp pixel art
        this.ctx.imageSmoothingEnabled = false;
        this.timer = new Timer();
        this.clockTick = 0; // Game delta
        // Everything that will be updated and drawn each frame
        this.entities = [];
        // Options and the Details
        this.options = options || {
            debugging: false,
        };
        // Start Input
        this.inputMap = inputMap;
        this.inputSystem = new InputSystem(ctx, inputMap, this.options.debugging);
        this.collisionSystem = new CollisionSystem();
    }
    ;
    /**
     * Reinitialize the game engine to a new canvas
     * @param ctx Reference to the HTML canvas 2D rendering context
     */
    init(ctx) {
        this.ctx = ctx;
        this.inputSystem = new InputSystem(ctx, this.inputMap, this.options.debug);
        this.timer = new Timer();
    }
    ;
    /**
     * Start the game loop
     */
    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
    ;
    /**
     * Adds an entity to the game engine entity list
     * @param entity Entity implementing IEntity
     */
    addEntity(entity) {
        this.entities.push(entity);
    }
    ;
    draw() {
        var _a;
        if (this.ctx !== null) {
            // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            // Draw latest things first
            for (let i = this.entities.length - 1; i >= 0; i--) {
                (_a = this.entities[i]) === null || _a === void 0 ? void 0 : _a.draw(this.getGameContext());
            }
        }
    }
    ;
    update() {
        this.entities = this.entities.filter((entity) => {
            const lifecycle = entity.getComponent(BasicLifecycle);
            return !lifecycle || lifecycle.isAlive();
        });
        this.entities.forEach((entity) => {
            entity.update(this.getGameContext());
        });
        this.collisionSystem.checkCollisions();
        // Clear input flags AFTER all entities have had a chance to read them
        this.inputSystem.onFrameUpdate();
    }
    ;
    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    }
    ;
    toggleDebugging() {
        this.options.debugging = !this.options.debugging;
        this.inputSystem.debugState = this.options.debugging;
    }
    /**
     * Returns an object of the latest game engine data
     * @returns GameContext object containing the canvas and current clock tick
     */
    getGameContext() {
        return {
            clockTick: this.clockTick,
            ctx: this.ctx,
            debug: this.options.debugging
        };
    }
    /**
     * Returns the input system currently in use
     * @returns InputSystem instance
     */
    getInputSystem() {
        return this.inputSystem;
    }
    getCollisionSystem() {
        return this.collisionSystem;
    }
}
;
// KV Le was here :)
