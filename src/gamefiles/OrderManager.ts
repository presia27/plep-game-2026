/**
 * OrderManager - Coordinates the entire order pickup objective system
 * @author pmo
 */
/**
 * Order manager for tracking active orders and shelf state
 * @author pmo
 */

import { ItemType } from "./itemTypes.ts";
import { OrderState, OrderCompleteCallback, PickupResult } from "./orderTypes.ts";
import { 
  generateOrder, 
  createOrderState, 
  checkComplete,
  getProgressText 
} from "./orderSystem.ts";
import { ShelfComponent } from "../componentLibrary/shelfComponent.ts";

/**
 * Central manager for the order pickup objective
 */
export class OrderManager {
  private orderState: OrderState | null;
  private shelves: ShelfComponent[];
  private onCompleteCallback: OrderCompleteCallback | null;
  private onPickupCallback: ((result: PickupResult) => void) | null;
  private allItemTypes: ItemType[];

  /**
   * @param shelves Array of shelf components in the world
   * @param onCompleteCallback Callback fired when order is completed
   */
  constructor(
    shelves: ShelfComponent[],
    onCompleteCallback: OrderCompleteCallback | null = null
  ) {
    this.orderState = null;
    this.shelves = shelves;
    this.onCompleteCallback = onCompleteCallback;
    this.onPickupCallback = null;
    this.allItemTypes = Object.values(ItemType).filter(v => typeof v === 'number') as ItemType[];
  }

  /**
   * Start a new order with 3 random unique items (doesn't work)
   */
  public startNewOrder(): OrderState {
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
  private assignItemsToShelves(requiredItems: ItemType[]): void {
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
  public handlePickup(result: PickupResult): void {
    if (result.success) {
      console.log(`Picked up: ${result.message}`);
      
      // Check if order is complete
      if (this.orderState && checkComplete(this.orderState)) {
        console.log('Order complete!');
        if (this.onCompleteCallback) {
          this.onCompleteCallback(this.orderState);
        }
      }
    } else {
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
  public getOrderState(): OrderState | null {
    return this.orderState;
  }

  /**
   * Check if there is an active order
   */
  public hasActiveOrder(): boolean {
    return this.orderState !== null && !this.orderState.isComplete;
  }

  /**
   * Get current progress as text
   */
  public getProgressText(): string {
    return this.orderState ? getProgressText(this.orderState) : "0/3";
  }

  /**
   * Set callback for order completion
   */
  public setOnCompleteCallback(callback: OrderCompleteCallback): void {
    this.onCompleteCallback = callback;
  }

  /**
   * Set callback for individual pickups
   */
  public setOnPickupCallback(callback: (result: PickupResult) => void): void {
    this.onPickupCallback = callback;
  }

  /**
   * Reset the current order
   */
  public resetOrder(): void {
    if (this.orderState) {
      this.orderState.collectedItems.clear();
      this.orderState.isComplete = false;
      this.assignItemsToShelves(this.orderState.requiredItems);
    }
  }

  /**
   * Clear all items from shelves
   */
  public clearAllShelves(): void {
    this.shelves.forEach(shelf => shelf.setItemType(null));
  }

  /**
   * Add a shelf to the manager
   */
  public addShelf(shelf: ShelfComponent): void {
    this.shelves.push(shelf);
  }

  /**
   * Get all shelves
   */
  public getShelves(): ShelfComponent[] {
    return this.shelves;
  }
}
