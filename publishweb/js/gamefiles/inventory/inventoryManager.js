export class InventoryManager {
    //private items: ItemType[];
    constructor(maxItems) {
        this.maxItems = maxItems;
        this.items = new Map();
    }
    addItem(item) {
        const currentCount = this.items.get(item) || 0;
        if (this.items.size < this.maxItems || currentCount > 0) {
            this.items.set(item, currentCount + 1);
        }
        else {
            console.error("Inventory is full!");
        }
    }
    dropItem() {
    }
    getItem() {
    }
    getAllItems() {
        return this.items;
    }
    getMaxItems() {
        return this.maxItems;
    }
    hasItem(item) {
        var _a;
        return this.items.has(item) && ((_a = this.items.get(item)) !== null && _a !== void 0 ? _a : 0) > 0;
    }
}
