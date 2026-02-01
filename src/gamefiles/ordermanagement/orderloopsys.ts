import { GameContext } from "../../classinterfaces";
import { Entity } from "../../entity.ts";
import { Item } from "./item.ts";
import { Order } from "./order.ts";

const MAX_ORDER_PROMPT_FREQ = 8; // maximum range of order frequency variation
const SCHED_BUFFER = 10; // Time in seconds to use as a buffer between start and end timestamps
const MAX_ORDERS_PERCENT_OF_TIME = 0.8; // The number of orders must not exceed THIS percent of the number of seconds

export class OrderDeliveryLoop extends Entity {
  private startTime: number;
  private duration: number;
  private promptIntervalFactor: number;
  private totalOrders: number;
  private inactiveOrders: Order[];
  private activeOrders: Order[];
  private doneOrders: Order[];
  private lastPromptTime: number | null;
  private promptTimes: number[]; // order prompts times in reverse order (treat as a stack)

  /**
   * 
   * @param startTime Timestamp of the start of the level
   * @param duration Length of time that the level runs for (MUST be at least 60 seconds)
   * @param promptIntervalFactor A number that varies the prompting of active orders
   * @param totalOrders Total number of orders in a level (must be less than 80% of the number of seconds)
   */
  constructor(startTime: number, duration: number, promptIntervalFactor: number, totalOrders: number) {
    // explicit call to super
    super();

    if (duration < 60) {
      throw new Error("Duration must be at least 60 seconds, instead got " + duration);
    }

    if (totalOrders > Math.floor(duration * MAX_ORDERS_PERCENT_OF_TIME)) {
      throw new Error("The number of orders must be less than " + (MAX_ORDERS_PERCENT_OF_TIME * 100) + "% of the number of seconds passed in")
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
  }

  public override update(context: GameContext): void {
    super.update(context);

    const currentTime = context.gameTime;

    if (currentTime < this.startTime + this.duration) {
      console.log(Math.floor(context.gameTime));

      const nextTime = this.promptTimes[this.promptTimes.length - 1];
      if (Math.floor(currentTime) === nextTime) {
        this.promptTimes.pop();

        // load the next order
        const nextOrder: Order | undefined = this.inactiveOrders.shift();
        if (nextOrder !== undefined) {
          this.activeOrders.push(nextOrder);
          nextOrder.setArrivalTime(Math.floor(currentTime));
          console.log(nextOrder);
        }
      }
    }
  }

  private generateOrders(quantity: number) {
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

  private generateTimes(): number[] {
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
    for (let j = times.length - 1; j >= 0; j--) {
      let random = this.generateRandom(0, this.promptIntervalFactor);
      if (this.generateRandNegative()) {
        random = random * -1;
      }

      const curTime: number | undefined = times[j];
      if (curTime !== undefined) {
        // ensure that each timestamp is greater than the last one (doesn't quite work right now)
        let timeAdjusted: number = curTime + random;

        if (times.length > 1 && j < times.length - 1) {
          const previousTime = times[j + 1];
          if (previousTime !== undefined && timeAdjusted < previousTime) {
            timeAdjusted = previousTime + 1;
          }
        }

        times[j] = timeAdjusted;
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
  private generateRandom(min: number, max: number): number {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max + 1); // make it inclusive
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }

  /**
   * Randomly returns true or false to indicate a negative or positive sign
   */
  private generateRandNegative(): boolean {
    const rand = Math.random();
    return rand < 0.5;
  }

  private activateNextOrder(): void {
    if (this.inactiveOrders.length > 0) {
      const nextOrder = this.inactiveOrders.pop();
      if (nextOrder !== undefined) {
        this.activeOrders.push(nextOrder);
      }
    }
  }
}