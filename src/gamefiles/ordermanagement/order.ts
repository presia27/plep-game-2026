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
  private fulfillTime: number | null;
  /** Store the number of mistakes made (anything that doesn't match the order) */
  private fulfillMistakeCount: number | null;
  /** Percentage representing how accurate an order was fulfilled */
  private fulfillAccuracy: number | null;

  constructor() {
    this.items = new Map();
    this.arrivalTime = null;
    this.fulfillTime = null;
    this.fulfillMistakeCount = null;
    this.fulfillAccuracy = null;
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

  // return all items in the order
  public getAllItems(): Map<ItemType, number> {
    return this.items;
  }

  // returns the total number of all items in the order
  public getTotalItems(): number {
    let total = 0;
    for (const count of this.items.values()) {
      total += count;
    }
    return total;
  }

  public setArrivalTime(time: number): void {
    this.arrivalTime = time;
  }

  public getArrivalTime(): number | null {
    return this.arrivalTime;
  }

  public setFulfillTime(time: number): void {
    this.fulfillTime = time;
  }

  public getFulfilTime(): number | null {
    return this.fulfillTime;
  }

  /** Record the fulfillment accuracy as a decimal percentage between 0 and 1 inclusive */
  public setFulfillAccuracy(percent: number): void {
    if (percent < 0) {
      this.fulfillAccuracy = 0;
    } else if (percent > 1) {
      this.fulfillAccuracy = 1;
    } else {
      this.fulfillAccuracy = percent;
    }
  }

  public getFulfillAccuracy(): number | null {
    return this.fulfillAccuracy;
  }

  /** Set the number of mistakes made in the order */
  public setFulfillMistakeCount(count: number): void {
    if (count < 0) {
      this.fulfillMistakeCount = 0;
    } else {
      this.fulfillMistakeCount = count;
    }
  }

  public getFulfillMistakeCount(): number | null {
    return this.fulfillMistakeCount;
  }

  public getItems(): Map<ItemType, number> {
    return this.items;
  }
}