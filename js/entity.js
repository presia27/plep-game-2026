/**
 * Represents a game entity to be present in the game.
 * The behavior for this entity is defined using components
 * implementing the IComponent type.
 * @author Preston Sia
 */
export class Entity {
    constructor() {
        this.components = [];
        this.renderer = null;
    }
    /**
     * Add a component to the entity
     * @param component Component to add
     */
    addComponent(component) {
        this.components.push(component);
    }
    /**
     * Set the rendering component for drawing on screen.
     * @param renderer IRenderer component
     */
    setRenderer(renderer) {
        this.renderer = renderer;
    }
    /**
     * Called by the game loop to update all components
     * with the latest game delta time and HTML canvas.
     * This handles the updating of the game logic.
     * @param context Game context containing the latest clock tick and canvas
     */
    update(context) {
        for (const component of this.components) {
            component.update(context);
        }
    }
    /**
     * Calls the rendering component of an entity
     * to render the latest chanes on screen
     * @param gameContext Game context containing the latest clock tick and canvas
     */
    draw(gameContext) {
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
    getComponent(component) {
        return this.components.find(c => c instanceof component);
    }
}
