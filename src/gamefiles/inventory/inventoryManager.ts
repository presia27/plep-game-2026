import { Observer, Observable, OBS_INVENTORY_CHANGE } from "../../observerinterfaces.ts";
import { MSG_SERVICE } from "../main.ts";
import { ItemType } from "../ordermanagement/itemTypes.ts";

const MAX_ITEMS_PER_SLOT = 10;

export class InventoryManager implements Observable {
  /** Hold items */
  private items: Map<ItemType, number>;
  private maxItems: number;
  private observers: Observer[];
  private slotNumber: number;

  constructor(maxItems: number) {
    this.maxItems = maxItems;
    this.items = new Map<ItemType, number>();
    this.observers = [];
    this.slotNumber = 0;
  }

  public addItem(item: ItemType): Promise<string> {
    return new Promise((resolve, reject) => {
      const currentCount = this.items.get(item) || 0;
      if (this.items.size < this.maxItems || (currentCount > 0 && currentCount < MAX_ITEMS_PER_SLOT)) {
        this.items.set(item, currentCount + 1);
        resolve(item); // indicate successful insertion
      } else {
        const errorText = "No more room!";
        MSG_SERVICE.queueMessage(errorText);
        reject(errorText); // indicate failed insertion
      }

      this.notifyObservers();
    });
  }

  /**
   * Drop a single item of the specified item type.
   * Does nothing if it does not exist.
   * If there are 5 toilet paper rolls,
   * it will drop 1 to become 4 rolls.
   */
  public dropItem(item: ItemType): void {
    const currentCount = this.items.get(item) || 0;

    if (currentCount > 1) {
      this.items.set(item, currentCount - 1);
    } else if (currentCount === 1) {
      this.items.delete(item);
    }

    this.notifyObservers();
  }

  /**
   * Drop a single item currently located
   * in the specified slot
   */
  public dropItemInHand(): void {
    const toDrop = this.getItemAtIndex(this.slotNumber)
    if (toDrop) {
      this.dropItem(toDrop);
    }
  }

  public getItemAtIndex(index: number): ItemType | undefined {
    return [...this.items.keys()][index];
  }

  public getItemQuantity(item: ItemType) {
    return this.items.get(item);
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

  public getSlot(): number {
    return this.slotNumber
  }

  public setSlot(slotNum: number): void {
    if (slotNum < 0) {
      this.slotNumber = 0;
    } else {
      this.slotNumber = Math.min(slotNum, this.maxItems);
    }
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