import { Item } from "./item.ts";

/**
 * Represents an in-game order
 * 
 * @author Preston Sia
 */
export class Order {
  /** Holds all items in the order */
  private items: Set<Item>
  /** Stores the time of arrival, or null if it hasn't arrived yet */
  private arrivalTime: number | null

  constructor() {
    this.items = new Set();
    this.arrivalTime = null;
  }

  public addItem(item: Item): void {
    this.items.add(item);
  }

  public setArrivalTime(time: number): void {
    this.arrivalTime = time;
  }

  public getArrivalTime(): number | null {
    return this.arrivalTime;
  }
}