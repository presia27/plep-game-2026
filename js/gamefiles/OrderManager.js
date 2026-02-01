/**
 * OrderManager - Coordinates the entire order pickup objective system
 * @author pmo
 */
/**
 * Order manager for tracking active orders and shelf state
 * @author pmo
 */
import { ItemType } from "./itemTypes.js";
import { generateOrder, createOrderState, checkComplete, getProgressText } from "./orderSystem.js";
/**
 * Central manager for the order pickup objective
 */
export class OrderManager {
    /**
     * @param shelves Array of shelf components in the world
     * @param onCompleteCallback Callback fired when order is completed
     */
    constructor(shelves, onCompleteCallback = null) {
        this.orderState = null;
        this.shelves = shelves;
        this.onCompleteCallback = onCompleteCallback;
        this.onPickupCallback = null;
        this.allItemTypes = Object.values(ItemType).filter(v => typeof v === 'number');
    }
    /**
     * Start a new order with 3 random unique items (doesn't work)
     */
    startNewOrder() {
        // Generate random order
        const requiredItems = generateOrder(this.allItemTypes);
        this.orderState = createOrderState(requiredItems);
        // Assign items to shelves
        this.assignItemsToShelves(requiredItems);
        console.log('New order started:', requiredItems.map(item => ItemType[item]));
        return this.orderState;
    }
    /**
     * Assign order items to shelves (with optional decoys)
     */
    assignItemsToShelves(requiredItems) {
        if (this.shelves.length < requiredItems.length) {
            console.warn(`Not enough shelves (${this.shelves.length}) for required items (${requiredItems.length})`);
            return;
        }
        // Clear all shelves first
        this.shelves.forEach(shelf => shelf.setItemType(null));
        // Place required items on first N shelves
        for (let i = 0; i < requiredItems.length; i++) {
            const shelf = this.shelves[i];
            const item = requiredItems[i];
            if (shelf && item !== undefined) {
                shelf.setItemType(item);
            }
        }
        // Add decoy items to remaining shelves (50% chance each)
        for (let i = requiredItems.length; i < this.shelves.length; i++) {
            if (Math.random() > 0.5) {
                const decoyItems = this.allItemTypes.filter(item => !requiredItems.includes(item));
                if (decoyItems.length > 0) {
                    const randomDecoy = decoyItems[Math.floor(Math.random() * decoyItems.length)];
                    const shelf = this.shelves[i];
                    if (shelf && randomDecoy !== undefined) {
                        shelf.setItemType(randomDecoy);
                    }
                }
            }
        }
    }
    /**
     * Handle a pickup attempt (called by PlayerInteractionComponent callback)
     */
    handlePickup(result) {
        if (result.success) {
            console.log(`Picked up: ${result.message}`);
            // Check if order is complete
            if (this.orderState && checkComplete(this.orderState)) {
                console.log('Order complete!');
                if (this.onCompleteCallback) {
                    this.onCompleteCallback(this.orderState);
                }
            }
        }
        else {
            console.log(`Pickup failed: ${result.message}`);
        }
        // Call custom pickup callback if set
        if (this.onPickupCallback) {
            this.onPickupCallback(result);
        }
    }
    /**
     * Get the current order state
     */
    getOrderState() {
        return this.orderState;
    }
    /**
     * Check if there is an active order
     */
    hasActiveOrder() {
        return this.orderState !== null && !this.orderState.isComplete;
    }
    /**
     * Get current progress as text
     */
    getProgressText() {
        return this.orderState ? getProgressText(this.orderState) : "0/3";
    }
    /**
     * Set callback for order completion
     */
    setOnCompleteCallback(callback) {
        this.onCompleteCallback = callback;
    }
    /**
     * Set callback for individual pickups
     */
    setOnPickupCallback(callback) {
        this.onPickupCallback = callback;
    }
    /**
     * Reset the current order
     */
    resetOrder() {
        if (this.orderState) {
            this.orderState.collectedItems.clear();
            this.orderState.isComplete = false;
            this.assignItemsToShelves(this.orderState.requiredItems);
        }
    }
    /**
     * Clear all items from shelves
     */
    clearAllShelves() {
        this.shelves.forEach(shelf => shelf.setItemType(null));
    }
    /**
     * Add a shelf to the manager
     */
    addShelf(shelf) {
        this.shelves.push(shelf);
    }
    /**
     * Get all shelves
     */
    getShelves() {
        return this.shelves;
    }
}
