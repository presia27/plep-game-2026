import { Item } from "./item.ts";

/**
 * Represents an in-game order
 * 
 * @author Preston Sia
 */
export class Order {
  /** Holds all items in the order */
  items: Set<Item>
  /** Stores the time of arrival, or null if it hasn't arrived yet */
  arrivalTime: number | null

  constructor() {
    this.items = new Set();
    this.arrivalTime = null;
  }

  public addItem(item: Item) {
    this.items.add(item);
  }
}