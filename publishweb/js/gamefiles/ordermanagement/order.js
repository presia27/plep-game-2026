/**
 * Represents an in-game order
 *
 * @author Preston Sia
 */
export class Order {
    constructor() {
        this.items = new Map();
        this.arrivalTime = null;
        this.fulfilTime = null;
    }
    addItem(item) {
        var _a;
        if (this.items.has(item)) {
            this.items.set(item, ((_a = this.items.get(item)) !== null && _a !== void 0 ? _a : 0) + 1);
        }
        else {
            this.items.set(item, 1);
        }
    }
    hasItem(item) {
        return this.items.has(item);
    }
    // return all items in the order
    getAllItems() {
        return this.items;
    }
    // returns the total number of all items in the order
    getTotalItems() {
        let total = 0;
        for (const count of this.items.values()) {
            total += count;
        }
        return total;
    }
    setArrivalTime(time) {
        this.arrivalTime = time;
    }
    getArrivalTime() {
        return this.arrivalTime;
    }
    setFulfilTime(time) {
        this.fulfilTime = time;
    }
    getFulfilTime() {
        return this.fulfilTime;
    }
    getItems() {
        return this.items;
    }
}
