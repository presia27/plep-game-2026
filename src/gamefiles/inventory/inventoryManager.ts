import { ItemType } from "../ordermanagement/itemTypes.ts";

export class InventoryManager {
  /** Hold items */
  //private items: Map<ItemType, number>;
  private maxItems: number;
  private items: ItemType[];

  constructor(maxItems: number) {
    this.maxItems = maxItems;
    this.items = [];
  }

  public addItem(item: ItemType) {
    if (this.items.length < this.maxItems) {
      this.items.push(item);
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
}