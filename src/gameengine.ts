/**
 * Main Game Engine Script, refactored in TypeScript from Dr. Chris Marriott's game engine template
 * 
 * Original comment: This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011
 * @author Preston Sia, KV Le, Chris Marriott, Seth Ladd
 */

import { GameContext, IEntity } from "./classinterfaces.ts";
import { Timer } from "./timer.ts";
import { InputSystem } from "./inputsys.ts";
import { InputMapValue } from "./typeinterfaces.ts";
import { CollisionSystem } from "./collisionsys.ts";
import SceneManager from "./sceneManager.ts";

export default class GameEngine {
  private running: boolean;
  private ctx: CanvasRenderingContext2D;
  private inputSystem: InputSystem;
  private collisionSystem: CollisionSystem;
  private inputMap: InputMapValue[]; // maps input values to actions
  private timer: Timer;
  private clockTick: number; // elapsed time in seconds since the last clock tick
  private sceneMgr: SceneManager;  // Game scene manager - added after the game engine is created

  private options: any;

  /**
   * 
   * @param ctx An HTML canvas element
   * @param inputMap A user-defined map of peripheral inputs and intended action when actuated
   * @param options Option parameters to pass to the game
   */
  constructor(ctx: CanvasRenderingContext2D, sceneMgr: SceneManager, inputMap: InputMapValue[], options?: Object) {
    this.running = false;

    // What you will use to draw
    // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
    this.ctx = ctx;

    // Disable image smoothing for crisp pixel art
    this.ctx.imageSmoothingEnabled = false;

    this.timer = new Timer();
    this.clockTick = 0; // Game delta

    // Everything that will be updated and drawn each frame
    //this.entities = [];

    // Options and the Details
    this.options = options || {
      debugging: false,
    };

    // Start Input
    this.inputMap = inputMap;
    this.inputSystem = new InputSystem(ctx, inputMap, this.options.debugging);
    this.collisionSystem = new CollisionSystem();
    this.sceneMgr = sceneMgr;
  };

  /**
   * Reinitialize the game engine to a new canvas
   * @param ctx Reference to the HTML canvas 2D rendering context
   */
  public init(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.inputSystem = new InputSystem(ctx, this.inputMap, this.options.debugging);
    this.collisionSystem = new CollisionSystem();
    this.timer = new Timer();
  };

  /**
   * Start the game loop
   */
  public start() {
    this.running = true;
    const gameLoop = () => {
      this.loop();
      requestAnimationFrame(gameLoop);
    };
    gameLoop();
  };

  /**
   * Adds an entity to the game engine entity list
   * @param entity Entity implementing IEntity
   */
  // public addEntity(entity: IEntity) {
  //   this.entities.push(entity);
  // };

  private draw() {
    if (this.ctx !== null) {
      // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

      // Update game scenes and entities
      this.sceneMgr.draw(this.getGameContext());
    }
  };

  private update() {
    // First update scenes and entities
    this.sceneMgr.update(this.getGameContext());

    // Then, update the collision system
    this.collisionSystem.checkCollisions();
    
    // Clear input flags AFTER all entities have had a chance to read them
    this.inputSystem.onFrameUpdate();
  };

  private isPaused: boolean = false;

  private loop() {
    // Only update loop time to avoid jump when unpaused
    this.clockTick = this.timer.tick();

    if (!this.isPaused) {
      this.update();
      this.draw();
    } else {
      // Consume the input frame updates, update UI entities, and draw last frame
      this.sceneMgr.updateUI(this.getGameContext());
      this.inputSystem.onFrameUpdate();
      this.draw();
    }
  };

  public togglePause(sceneMgr: SceneManager) {
    this.isPaused = !this.isPaused;
  }

  toggleDebugging() {
    this.options.debugging = !this.options.debugging;
    this.inputSystem.debugState = this.options.debugging;
  }

  /**
   * Returns an object of the latest game engine data
   * @returns GameContext object containing the canvas and current clock tick
   */
  public getGameContext(): GameContext {
    return {
      clockTick: this.clockTick,
      gameTime: this.timer.getGameTime(),
      ctx: this.ctx,
      debug: this.options.debugging
    }
  }

  /**
   * Returns the input system currently in use
   * @returns InputSystem instance
   */
  public getInputSystem(): InputSystem {
    return this.inputSystem;
  }

  public getCollisionSystem(): CollisionSystem {
    return this.collisionSystem;
  }

};

// KV Le was here :)
