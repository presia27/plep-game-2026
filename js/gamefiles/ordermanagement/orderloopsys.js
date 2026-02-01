import { Entity } from "../../entity.js";
import { Item } from "./item.js";
import { Order } from "./order.js";
const MAX_ORDER_PROMPT_FREQ = 8; // maximum range of order frequency variation
const SCHED_BUFFER = 10; // Time in seconds to use as a buffer between start and end timestamps
export class OrderDeliveryLoop extends Entity {
    /**
     *
     * @param startTime Timestamp of the start of the level
     * @param duration Length of time that the level runs for (MUST be at least 60 seconds)
     * @param promptIntervalFactor A number that varies the prompting of active orders
     * @param totalOrders Total number of orders in a level
     */
    constructor(startTime, duration, promptIntervalFactor, totalOrders) {
        // explicit call to super
        super();
        if (duration < 60) {
            throw new Error("Duration must be at least 60 seconds, instead got " + duration);
        }
        this.startTime = startTime;
        this.duration = duration;
        this.promptIntervalFactor = Math.min(promptIntervalFactor, MAX_ORDER_PROMPT_FREQ);
        this.totalOrders = totalOrders;
        this.inactiveOrders = [];
        this.activeOrders = [];
        this.doneOrders = [];
        this.lastPromptTime = null;
        // Generate orders
        this.generateOrders(totalOrders);
        this.promptTimes = this.generateTimes();
        console.log(this.promptTimes);
    }
    update(context) {
        super.update(context);
        const currentTime = context.gameTime;
        if (currentTime < this.startTime + this.duration) {
            console.log(Math.floor(context.gameTime));
            const nextTime = this.promptTimes[this.promptTimes.length - 1];
            if (Math.floor(currentTime) === nextTime) {
                this.promptTimes.pop();
                // load the next order
                const nextOrder = this.inactiveOrders.shift();
                if (nextOrder !== undefined) {
                    this.activeOrders.push(nextOrder);
                    nextOrder.setArrivalTime(Math.floor(currentTime));
                    console.log(nextOrder);
                }
            }
        }
    }
    generateOrders(quantity) {
        for (let i = 0; i < quantity; i++) {
            // THIS IS ALL TEST CODE
            const order = new Order();
            order.addItem(new Item("Toothpaste"));
            order.addItem(new Item("Orange"));
            order.addItem(new Item("Ice Cream"));
            order.addItem(new Item("Item " + (i + 1)));
            this.inactiveOrders.push(order);
        }
    }
    generateTimes() {
        const start = Math.floor(this.startTime + SCHED_BUFFER);
        const end = Math.floor((this.startTime + this.duration) - SCHED_BUFFER); // elapsed time, not ending timestamp
        const freq = Math.floor((this.duration - (SCHED_BUFFER * 2)) / this.totalOrders);
        const times = [];
        let lastTime = end;
        for (let i = this.totalOrders; i > 0; i--) {
            let nextTime = lastTime - freq; // calculate the next order prompt time in reverse order
            times.push(nextTime);
            lastTime = nextTime;
        }
        // Introduce a variation based on promptIntervalFactor
        for (let j = 0; j < times.length; j++) {
            let random = this.generateRandom(0, this.promptIntervalFactor);
            if (this.generateRandNegative()) {
                random = random * -1;
            }
            const curTime = times[j];
            if (curTime !== undefined) {
                times[j] = curTime + random;
                //let timeAdjusted = curTime + random;
            }
        }
        return times;
    }
    /**
     * From
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
     *
     * Generate a random number between min and max INCLUSIVE
     */
    generateRandom(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max + 1); // make it inclusive
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    }
    /**
     * Randomly returns true or false to indicate a negative or positive sign
     */
    generateRandNegative() {
        const rand = Math.random();
        return rand < 0.5;
    }
    activateNextOrder() {
        if (this.inactiveOrders.length > 0) {
            const nextOrder = this.inactiveOrders.pop();
            if (nextOrder !== undefined) {
                this.activeOrders.push(nextOrder);
            }
        }
    }
}
