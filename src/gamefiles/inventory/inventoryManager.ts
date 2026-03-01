import { Observer, Observable, OBS_INVENTORY_CHANGE } from "../../observerinterfaces.ts";
import { MSG_SERVICE } from "../main.ts";
import { ItemType } from "../ordermanagement/itemTypes.ts";

export class InventoryManager implements Observable {
  /** Hold items */
  private items: Map<ItemType, number>;
  private maxItems: number;
  private observers: Observer[];

  constructor(maxItems: number) {
    this.maxItems = maxItems;
    this.items = new Map<ItemType, number>();
    this.observers = [];
  }

  public addItem(item: ItemType): Promise<string> {
    return new Promise((resolve, reject) => {
      const currentCount = this.items.get(item) || 0;
      if (this.items.size < this.maxItems || currentCount > 0) {
        this.items.set(item, currentCount + 1);
        resolve(item); // indicate successful insertion
      } else {
        console.error("Inventory is full!");
        MSG_SERVICE.queueMessage("Inventory is full!");
        reject("Inventory is full!"); // indicate failed insertion
      }

      this.notifyObservers();
    });
  }

  public dropItem() {
    this.notifyObservers();
  }

  public getItem() {

  }

  public getAllItems() {
    return this.items;
  }

  public getMaxItems() {
    return this.maxItems;
  }

  public hasItem(item: ItemType): boolean {
    return this.items.has(item) && (this.items.get(item) ?? 0) > 0;
  }

  public subscribe(observer: Observer): void {
    this.observers.push(observer);
  }

  public unsubscribe(observer: Observer): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  public notifyObservers(): void {
    for (const observer of this.observers) {
      observer.observerUpdate(this.getAllItems(), OBS_INVENTORY_CHANGE);
    }
  }
}