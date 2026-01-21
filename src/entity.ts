import { GameContext, IComponent, IRenderer, IEntity } from "./classinterfaces.ts";

/**
 * Represents a game entity to be present in the game.
 * The behavior for this entity is defined using components
 * implementing the IComponent type.
 * @author Preston Sia
 */
export class Entity implements IEntity {
  private components: IComponent[] = [];
  private renderer: IRenderer | null = null;

  /**
   * Add a component to the entity
   * @param component Component to add
   */
  public addComponent(component: IComponent): void {
    this.components.push(component);
  }

  /**
   * Set the rendering component for drawing on screen.
   * @param renderer IRenderer component
   */
  public setRenderer(renderer: IRenderer): void {
    this.renderer = renderer;
  }

  /**
   * Called by the game loop to update all components
   * with the latest game delta time and HTML canvas.
   * This handles the updating of the game logic.
   * @param context Game context containing the latest clock tick and canvas
   */
  public update(context: GameContext): void {
    for (const component of this.components) {
      component.update(context);
    }
  }

  /**
   * Calls the rendering component of an entity
   * to render the latest chanes on screen
   * @param gameContext Game context containing the latest clock tick and canvas
   */
  public draw(gameContext: GameContext): void {
    if (this.renderer !== null) {
      this.renderer.draw(gameContext);
    }
  }

  // Originally had components: any, changed to
  // TypeScript generic with Claude's help
  /**
   * Retrieves a component from the component list based on type
   * @param component A component class of type IComponent
   * @returns An instance of a component matching the passed-in class
   */
  public getComponent<T extends IComponent>(
    component: new (...args: any[]) => T): T | undefined {
    return this.components.find(c => c instanceof component) as T | undefined;
  }
}