/**
 * Player interaction component that handles shelf pickup using E key
 * @author pmo
 */

import { GameContext, IComponent, IPosition } from "../classinterfaces.ts";
import { InputSystem } from "../inputsys.ts";
import { InputAction } from "../inputactionlist.ts";
import { ShelfComponent } from "./shelfComponent.ts";
import { tryPickup } from "../gamefiles/orderSystem.ts";
import { OrderState, PickupResult } from "../gamefiles/orderTypes.ts";
import { OrderManager } from "../gamefiles/OrderManager.ts";

/**
 * Callback type for pickup events
 */
export type PickupCallback = (result: PickupResult) => void;

/**
 * Component that allows a player entity to interact with shelves
 */
export class PlayerInteractionComponent implements IComponent {
  private positionComponent: IPosition;
  private inputSystem: InputSystem;
  private orderManager: OrderManager;
  private onPickupCallback: PickupCallback | null;

  /**
   * @param positionComponent Player's position component
   * @param inputSystem Input system for detecting E key press
   * @param orderManager Order manager to get current order state from
   * @param onPickupCallback Optional callback fired when pickup is attempted
   */
  constructor(
    positionComponent: IPosition,
    inputSystem: InputSystem,
    orderManager: OrderManager,
    onPickupCallback: PickupCallback | null = null
  ) {
    this.positionComponent = positionComponent;
    this.inputSystem = inputSystem;
    this.orderManager = orderManager;
    this.onPickupCallback = onPickupCallback;
  }

  public update(context: GameContext): void {
    // Check if E key (PICK_UP action) was just pressed
    const pickupActive = this.inputSystem.isActionActiveSingle(InputAction.PICK_UP);
    
    if (context.debug) {
      // Only log occasionally to avoid spam
      if (Math.random() < 0.01) {
        console.log("PlayerInteractionComponent update - PICK_UP active:", pickupActive);
      }
    }
    
    if (pickupActive) {
      console.log("E key pressed! Attempting interaction...");
      this.attemptInteraction();
    }
  }

  /**
   * Attempt to interact with nearby shelves
   */
  private attemptInteraction(): void {
    const playerPos = this.positionComponent.getPosition();
    const orderState = this.orderManager.getOrderState();
    const shelves = this.orderManager.getShelves();

    if (!orderState) {
      console.log("No active order");
      return;
    }

    console.log("Player trying to interact at position:", playerPos);

    // Find nearest shelf in range
    let nearestShelf: ShelfComponent | null = null;
    let nearestDistance = Infinity;

    for (const shelf of shelves) {
      if (shelf.isInRange(playerPos)) {
        const shelfPos = shelf.getPosition();
        const dx = playerPos.x - shelfPos.x;
        const dy = playerPos.y - shelfPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        console.log(`Shelf at (${shelfPos.x}, ${shelfPos.y}): distance=${distance.toFixed(1)}, inRange=true, hasItem=${shelf.getItemType() !== null}`);
        
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestShelf = shelf;
        }
      }
    }

    // Try to pick up from nearest shelf
    if (nearestShelf) {
      console.log("Attempting pickup from nearest shelf at distance:", nearestDistance.toFixed(1));
      const shelfConfig = nearestShelf.toShelfConfig();
      const result = tryPickup(shelfConfig, orderState);
      
      console.log("Pickup result:", result);
      
      // Update shelf if pickup was successful
      if (result.success) {
        nearestShelf.removeItem();
      }

      // Fire callback if provided
      if (this.onPickupCallback) {
        this.onPickupCallback(result);
      }
    } else {
      console.log("No shelf in range to interact with");
    }
  }

  /**
   * Set callback for pickup events
   */
  public setOnPickupCallback(callback: PickupCallback): void {
    this.onPickupCallback = callback;
  }

  /**
   * Set or update the pickup callback
   */
  public setPickupCallback(callback: PickupCallback): void {
    this.onPickupCallback = callback;
  }
}
