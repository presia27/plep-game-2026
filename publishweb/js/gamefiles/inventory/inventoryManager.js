import { OBS_INVENTORY_CHANGE } from "../../observerinterfaces.js";
import { MSG_SERVICE } from "../main.js";
const MAX_ITEMS_PER_SLOT = 10;
export class InventoryManager {
    constructor(maxItems) {
        this.maxItems = maxItems;
        this.items = new Map();
        this.observers = [];
        this.slotNumber = 0;
    }
    addItem(item) {
        return new Promise((resolve, reject) => {
            const currentCount = this.items.get(item) || 0;
            if (this.items.size < this.maxItems || (currentCount > 0 && currentCount < MAX_ITEMS_PER_SLOT)) {
                this.items.set(item, currentCount + 1);
                resolve(item); // indicate successful insertion
            }
            else {
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
    dropItem(item) {
        const currentCount = this.items.get(item) || 0;
        if (currentCount > 1) {
            this.items.set(item, currentCount - 1);
        }
        else if (currentCount === 1) {
            this.items.delete(item);
        }
        this.notifyObservers();
    }
    /**
     * Drop a single item currently located
     * in the specified slot
     */
    dropItemInHand() {
        const toDrop = this.getItemAtIndex(this.slotNumber);
        if (toDrop) {
            this.dropItem(toDrop);
        }
    }
    /**
     * Clear all items
     */
    clearItems() {
        this.items = new Map();
        this.notifyObservers();
    }
    getItemAtIndex(index) {
        return [...this.items.keys()][index];
    }
    getItemQuantity(item) {
        return this.items.get(item);
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
    getSlot() {
        return this.slotNumber;
    }
    setSlot(slotNum) {
        if (slotNum < 0) {
            this.slotNumber = 0;
        }
        else {
            this.slotNumber = Math.min(slotNum, this.maxItems);
        }
    }
    subscribe(observer) {
        this.observers.push(observer);
    }
    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    notifyObservers() {
        for (const observer of this.observers) {
            observer.observerUpdate(this.getAllItems(), OBS_INVENTORY_CHANGE);
        }
    }
}
