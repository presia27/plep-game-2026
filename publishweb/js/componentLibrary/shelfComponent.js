/**
 * Shelf component that holds an item and allows player interaction
 * @author pmo
 */
/**
 * Component that manages shelf state and item storage
 */
export class ShelfComponent {
    /**
     * @param positionComponent Position component of the shelf entity
     * @param interactionRadius Radius within which players can interact
     * @param initialItem Item type initially on the shelf (null for empty)
     */
    constructor(positionComponent, interactionRadius = 50, initialItem = null) {
        this.positionComponent = positionComponent;
        this.interactionRadius = interactionRadius;
        this.itemType = initialItem;
        this.isEmpty = initialItem === null;
    }
    update(context) {
        // Shelf is static, no update needed
    }
    /**
     * Get the current item on this shelf
     */
    getItemType() {
        return this.itemType;
    }
    /**
     * Set the item on this shelf
     */
    setItemType(itemType) {
        this.itemType = itemType;
        this.isEmpty = itemType === null;
    }
    /**
     * Remove the item from this shelf
     */
    removeItem() {
        const item = this.itemType;
        this.itemType = null;
        this.isEmpty = true;
        return item;
    }
    /**
     * Check if shelf is empty
     */
    isShelfEmpty() {
        return this.isEmpty;
    }
    /**
     * Get the interaction radius
     */
    getInteractionRadius() {
        return this.interactionRadius;
    }
    /**
     * Get the shelf position
     */
    getPosition() {
        return this.positionComponent.getPosition();
    }
    /**
     * Check if a position is within interaction range
     */
    isInRange(pos) {
        const shelfPos = this.positionComponent.getPosition();
        const dx = pos.x - shelfPos.x;
        const dy = pos.y - shelfPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= this.interactionRadius;
    }
    /**
     * Convert to ShelfConfig for use with order system functions
     */
    toShelfConfig() {
        return {
            itemType: this.itemType,
            position: this.positionComponent.getPosition(),
            interactionRadius: this.interactionRadius
        };
    }
}
