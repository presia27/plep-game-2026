/**
 * Order management system for the pickup objective
 * Contains functions for order generation, validation, and completion checking
 * @author pmo
 */

import { ItemType, getItemMetadata } from "./itemTypes.ts";
import { OrderState, PickupResult, ShelfConfig } from "./orderTypes.ts";

/**
 * Order system logic (pickup rules)
 * @author pmo
 */
/**
 * Generates a random order of 3 unique item types
 * @param allItemTypes Array of all available item types
 * @returns Array of 3 unique randomly selected item types
 */
export function generateOrder(allItemTypes: ItemType[] = Object.values(ItemType).filter(v => typeof v === 'number') as ItemType[]): ItemType[] {
  const shuffled = [...allItemTypes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

/**
 * Creates a new order state object
 * @param requiredItems The 3 items required for this order
 * @returns A new OrderState object
 */
export function createOrderState(requiredItems: ItemType[]): OrderState {
  return {
    requiredItems,
    collectedItems: new Set<ItemType>(),
    isComplete: false
  };
}

/**
 * Spawns shelf items across the world, ensuring all required items are present
 * @param order The required items for the current order
 * @param shelves Array of shelf configurations (positions and interaction radii)
 * @param allItemTypes All available item types for optional decoy items
 * @returns Updated shelf configurations with assigned items
 */
export function spawnShelfItems(
  order: ItemType[], 
  shelves: ShelfConfig[], 
  allItemTypes: ItemType[] = Object.values(ItemType).filter(v => typeof v === 'number') as ItemType[]
): ShelfConfig[] {
  if (shelves.length < order.length) {
    throw new Error(`Need at least ${order.length} shelves to spawn all required items`);
  }

  const updatedShelves = shelves.map(shelf => ({ ...shelf }));
  
  // Place required items on the first N shelves
  for (let i = 0; i < order.length && i < updatedShelves.length; i++) {
    updatedShelves[i]!.itemType = order[i]!;
  }
  
  // Optionally add decoy items to remaining shelves
  for (let i = order.length; i < updatedShelves.length; i++) {
    // 50% chance to add a decoy item
    if (Math.random() > 0.5) {
      const decoyItems = allItemTypes.filter(item => !order.includes(item));
      if (decoyItems.length > 0) {
        const randomDecoy = decoyItems[Math.floor(Math.random() * decoyItems.length)]!;
        updatedShelves[i]!.itemType = randomDecoy;
      }
    }
  }
  
  return updatedShelves;
}

/**
 * Checks if a player can interact with a shelf based on distance
 * @param playerPos Player's current position {x, y}
 * @param shelf Shelf configuration with position and interaction radius
 * @returns True if player is within interaction range
 */
export function canInteract(playerPos: { x: number; y: number }, shelf: ShelfConfig): boolean {
  const dx = playerPos.x - shelf.position.x;
  const dy = playerPos.y - shelf.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance <= shelf.interactionRadius;
}

/**
 * Attempts to pick up an item from a shelf
 * @param shelf The shelf being interacted with
 * @param orderState Current order state
 * @returns Result of the pickup attempt
 */
export function tryPickup(shelf: ShelfConfig, orderState: OrderState): PickupResult {
  // Check if shelf has an item
  if (shelf.itemType === null) {
    return {
      success: false,
      message: "This shelf is empty"
    };
  }

  // Check if item is required
  if (!orderState.requiredItems.includes(shelf.itemType)) {
    return {
      success: false,
      message: "This item is not in your order"
    };
  }

  // Check if already collected
  if (orderState.collectedItems.has(shelf.itemType)) {
    return {
      success: false,
      message: "You already collected this item"
    };
  }

  // Success! Collect the item
  orderState.collectedItems.add(shelf.itemType);
  const itemType = shelf.itemType;
  shelf.itemType = null; // Remove item from shelf

  const itemMetadata = getItemMetadata(itemType);
  return {
    success: true,
    message: `Collected ${itemMetadata.name}! (${orderState.collectedItems.size}/3)`,
    itemType
  };
}

/**
 * Checks if the order is complete
 * @param orderState Current order state
 * @returns True if all 3 items have been collected
 */
export function checkComplete(orderState: OrderState): boolean {
  const isComplete = orderState.collectedItems.size === orderState.requiredItems.length;
  if (isComplete && !orderState.isComplete) {
    orderState.isComplete = true;
  }
  return isComplete;
}

/**
 * Gets the current progress as a fraction
 * @param orderState Current order state
 * @returns Progress from 0.0 to 1.0
 */
export function getProgress(orderState: OrderState): number {
  return orderState.collectedItems.size / orderState.requiredItems.length;
}

/**
 * Gets the current progress as text
 * @param orderState Current order state
 * @returns Progress string like "6/7"
 */
export function getProgressText(orderState: OrderState): string {
  return `${orderState.collectedItems.size}/${orderState.requiredItems.length}`;
}
