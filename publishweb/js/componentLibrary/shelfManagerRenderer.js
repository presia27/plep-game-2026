/**
 * Manager renderer that draws all shelves in two passes:
 * 1. All shelf bases
 * 2. All items on top
 * This ensures items are never covered by other shelf bases
 * @author pmo
 */
/**
 * Manages rendering of multiple shelves with proper layering
 */
export class ShelfManagerRenderer {
    /**
     * @param shelfRenderers Array of all shelf renderers to manage
     */
    constructor(shelfRenderers) {
        this.shelfRenderers = shelfRenderers;
    }
    draw(context) {
        // First pass: Draw all shelf bases
        for (const renderer of this.shelfRenderers) {
            renderer.draw(context);
        }
        // Second pass: Draw all items on top
        for (const renderer of this.shelfRenderers) {
            renderer.drawItem(context);
        }
    }
    /**
     * Add a shelf renderer to the manager
     */
    addShelfRenderer(renderer) {
        this.shelfRenderers.push(renderer);
    }
    /**
     * Remove a shelf renderer from the manager
     */
    removeShelfRenderer(renderer) {
        const index = this.shelfRenderers.indexOf(renderer);
        if (index !== -1) {
            this.shelfRenderers.splice(index, 1);
        }
    }
}
