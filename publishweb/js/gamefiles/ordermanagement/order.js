/**
 * Represents an in-game order
 *
 * @author Preston Sia
 */
export class Order {
    constructor() {
        this.items = new Map();
        this.arrivalTime = null;
        this.fulfillTime = null;
        this.fulfillMistakeCount = null;
        this.fulfillAccuracy = null;
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
    setFulfillTime(time) {
        this.fulfillTime = time;
    }
    getFulfilTime() {
        return this.fulfillTime;
    }
    /** Record the fulfillment accuracy as a decimal percentage between 0 and 1 inclusive */
    setFulfillAccuracy(percent) {
        if (percent < 0) {
            this.fulfillAccuracy = 0;
        }
        else if (percent > 1) {
            this.fulfillAccuracy = 1;
        }
        else {
            this.fulfillAccuracy = percent;
        }
    }
    getFulfillAccuracy() {
        return this.fulfillAccuracy;
    }
    /** Set the number of mistakes made in the order */
    setFulfillMistakeCount(count) {
        if (count < 0) {
            this.fulfillMistakeCount = 0;
        }
        else {
            this.fulfillMistakeCount = count;
        }
    }
    getFulfillMistakeCount() {
        return this.fulfillMistakeCount;
    }
    getItems() {
        return this.items;
    }
}
