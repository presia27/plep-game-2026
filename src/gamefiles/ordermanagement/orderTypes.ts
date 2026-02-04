/**
 * Type definitions for the order pickup system
 * @author pmo
 */

import { ItemType } from "../itemTypes.ts";

/**
 * Represents the current state of a player's order
 */
export interface OrderState {
  /** The 3 unique items required to complete the order */
  requiredItems: ItemType[];
  
  /** Set of items that have been collected */
  collectedItems: Set<ItemType>;
  
  /** Whether the order has been completed */
  isComplete: boolean;
}

/**
 * Result of attempting to pick up an item
 */
export interface PickupResult {
  success: boolean;
  message: string;
  itemType?: ItemType;
}

/**
 * Configuration for a shelf in the game world
 */
export interface ShelfConfig {
  /** Type of item on this shelf (null if empty) */
  itemType: ItemType | null;
  
  /** Position in the game world */
  position: { x: number; y: number };
  
  /** Interaction radius in pixels */
  interactionRadius: number;
}

/**
 * Callback fired when order is completed
 */
export type OrderCompleteCallback = (orderState: OrderState) => void;
