import { ItemType } from "./itemTypes.ts";

/**
 * Represents an in-game order
 * 
 * @author Preston Sia
 */
export class Order {
  /** Holds all items in the order */
  private items: Map<ItemType, number>;
  /** Stores the time of arrival, or null if it hasn't arrived yet */
  private arrivalTime: number | null;
  /** Stores the time the order was fulfilled, or null if the player hasn't picked up all items */
  private fulfilTime: number | null;

  constructor() {
    this.items = new Map();
    this.arrivalTime = null;
    this.fulfilTime = null;
  }

  public addItem(item: ItemType): void {
    if (this.items.has(item)) {
      this.items.set(item, (this.items.get(item) ?? 0) + 1);
    } else {
      this.items.set(item, 1);
    }
  }

  public hasItem(item: ItemType): boolean {
    return this.items.has(item);
  }

  public setArrivalTime(time: number): void {
    this.arrivalTime = time;
  }

  public getArrivalTime(): number | null {
    return this.arrivalTime;
  }

  public setFulfilTime(time: number): void {
    this.fulfilTime = time;
  }

  public getFulfilTime(): number | null {
    return this.fulfilTime;
  }
}