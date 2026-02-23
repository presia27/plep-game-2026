import { ItemType } from "../ordermanagement/itemTypes.ts";

export class InventoryManager {
  /** Hold items */
  private items: Map<ItemType, number>;
  private maxItems: number;
  //private items: ItemType[];

  constructor(maxItems: number) {
    this.maxItems = maxItems;
    this.items = new Map<ItemType, number>();
  }

  public addItem(item: ItemType) {
    const currentCount = this.items.get(item) || 0;
    if (this.items.size < this.maxItems || currentCount > 0) {
      this.items.set(item, currentCount + 1);
    } else {
      console.error("Inventory is full!");
    }
  }

  public dropItem() {

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
}