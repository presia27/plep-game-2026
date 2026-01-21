import { XY } from "./typeinterfaces.ts";

/**
 * Interface for game entities.
 * All game entities have the ability to add a component implementing IComponent,
 * set a canvas renderer, and retrieve a component based on its class type.
 * Methods update() and draw() are called upon by the game loop.
 */
export interface IEntity {
  addComponent(component: IComponent): void;
  setRenderer(renderer: IRenderer): void;
  update(context: GameContext): void;
  draw(context: GameContext): void;
  getComponent<T extends IComponent>(component: new (...args: any[]) => T): T | undefined
}

/**
 * Interface for components written for drawing an
 * entity to the canvas.
 */
export interface IRenderer {
  draw(context: GameContext): void;
}

/**
 * A GameContext object contains important information
 * about the current state of the game engine.
 */
export interface GameContext {
  clockTick: number;
  ctx: CanvasRenderingContext2D;
  debug: boolean;
}

/**
 * Interface for entity components.
 * All components have an update() method
 * that takes in a GameContext object.
 */
export interface IComponent {
  update(context: GameContext): void;
}

/**
 * Entity components that store
 * position data implement the IPosition
 * interface, with the minimum behaviors
 * getPosition() and setPosition() to get
 * and set the entity's position respectively.
 */
export interface IPosition {
  getPosition(): XY;
  setPosition(pos: XY): void;
}

/**
 * Component which stores and
 * manages the size of an entity
 * where its size describes the
 * entity's physical composition
 * on the drawing canvas.
 */
export interface ISize {
  getScale(): number;
  getWidth(): number;
  getHeight(): number;
}

/**
 * Interface for components
 * representing the life state of
 * an entity (whether it is alive or not).
 */
export interface ILifecycle {
  isAlive(): boolean;
  die(): void;
  revive(): void;
}