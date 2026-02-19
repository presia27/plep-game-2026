import { InventoryManager } from "./gamefiles/inventory/inventoryManager.ts";
import { Order } from "./gamefiles/ordermanagement/order.ts";

/**
 * Holds all global state that persists across rooms and scenes.
 *
 * @author Luke Willis, Claude Sonnet 4.5
 */
export class GameState {
  public inventoryManager: InventoryManager;
  public pendingOrders: Order[];
  public activeOrders: Order[];
  public completedOrders: Order[];

  constructor() {
    this.inventoryManager = new InventoryManager(6);
    this.pendingOrders = [];
    this.activeOrders = [];
    this.completedOrders = [];
  }

  public addPendingOrder(order: Order): void {
    this.pendingOrders.push(order);
  }

  public activateOrder(order: Order): void {
    const index = this.pendingOrders.indexOf(order);
    if (index !== -1) {
      this.pendingOrders.splice(index, 1);
      this.activeOrders.push(order);
    }
  }

  public completeOrder(order: Order): void {
    const index = this.activeOrders.indexOf(order);
    if (index !== -1) {
      this.activeOrders.splice(index, 1);
      this.completedOrders.push(order);
    }
  }

  public reset(): void {
    this.inventoryManager = new InventoryManager(6);
    this.pendingOrders = [];
    this.activeOrders = [];
    this.completedOrders = [];
  }
}