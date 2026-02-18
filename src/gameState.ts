import { InventoryManager } from "./gamefiles/inventory/inventoryManager.ts";

///revise///


/**
 * Holds all global state that persists across rooms and scenes.
 * Create once inside SceneManager — never instantiate elsewhere.
 *
 * Add new global state here as the game grows rather than
 * threading new constructor parameters through every class.
 *
 * @author Luke Willis, Claude Sonnet 4.5
 */
export class GameState {
  public inventoryManager: InventoryManager;
  // Future additions might look like:
  // public score: number = 0;
  // public completedOrders: number = 0;
  // public currentLevel: string = "demo";

  constructor() {
    this.inventoryManager = new InventoryManager(6);
  }

  /**
   * Resets all global state back to defaults.
   * Call this when starting a new level or resetting the game.
   */
  public reset(): void {
    this.inventoryManager = new InventoryManager(6);
    // reset any other state here as you add more fields
  }
}

