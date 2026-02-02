/**
 * Represents an in-game order
 *
 * @author Preston Sia
 */
export class Order {
    constructor() {
        this.items = new Set();
        this.arrivalTime = null;
    }
    addItem(item) {
        this.items.add(item);
    }
    setArrivalTime(time) {
        this.arrivalTime = time;
    }
    getArrivalTime() {
        return this.arrivalTime;
    }
}
