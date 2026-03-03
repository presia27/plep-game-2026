import { GameContext } from "../../classinterfaces.ts";
import { GameStateEventTrigger, LEVEL_OVER } from "../../gameStateEventTrigger.ts";
import { Entity } from "../../entity.ts";
import { ItemType } from "./itemTypes.ts";
import { Order } from "./order.ts";
import {
  OBS_INVENTORY_CHANGE,
  OBS_ORDER_COMPLETE,
  OBS_NEW_ACTIVE_ORDER,
  Observable,
  Observer
} from "../../observerinterfaces.ts";

const MAX_ORDER_PROMPT_FREQ = 8; // maximum range of order frequency variation
const SCHED_BUFFER = 10; // Time in seconds to use as a buffer between start and end timestamps
const MAX_ORDERS_PERCENT_OF_TIME = 0.8; // The number of orders must not exceed THIS percent of the number of seconds

/**
 * The main driver or prompting orders in the game
 * 
 * @author Preston Sia
 */
export class OrderDeliveryLoop extends Entity implements Observer, Observable {
  private isRunning: boolean;
  private startTime: number;
  private duration: number;
  private promptIntervalFactor: number;
  private totalOrders: number;
  private inactiveOrders: Order[];  /* Orders waiting in queue */
  private activeOrders: Order[];    /* Orders active in queue and require fulfilment */
  private doneOrders: Order[];      /* Orders that have already been fulfilled */
  /* Track the items in the inventory that match the current active order at the front of the queue */
  private orderProgress: Map<ItemType, number>;
  private lastClockTime: number;
  private promptTimes: number[]; // order prompts times in reverse order (treat as a stack)
  private totalItemVariety: number;
  private allowedItems: ItemType[];

  private observers: Observer[];
  private sceneTrigger: GameStateEventTrigger;

  /**
   * Initialize everything to null or 0.
   * Use init to initialize with proper values.
   */
  constructor(sceneTrigger: GameStateEventTrigger) {

    // explicit call to super
    super();

    // Set to null or 0; init logic moved to the init method
    this.isRunning = false;
    this.startTime = 0;
    this.duration = 0;
    this.promptIntervalFactor = 0;
    this.totalOrders = 0;
    this.inactiveOrders = [];
    this.activeOrders = [];
    this.doneOrders = [];
    this.orderProgress = new Map();
    this.lastClockTime = 0;
    this.promptTimes = [];
    this.totalItemVariety = 0;
    this.allowedItems = [];

    this.observers = [];
    this.sceneTrigger = sceneTrigger;
  }

  /**
   * Initialize and start the order loop with a new set of parameters.
   * 
   * @param startTime Timestamp of the start of the level
   * @param duration Length of time that the level runs for (MUST be at least 60 seconds)
   * @param promptIntervalFactor A number that varies the prompting of active orders
   * @param totalOrders Total number of orders in a level (must be less than 80% of the number of seconds)
   * @param totalItemVariety The total number of unique items that can go in an order.
   *     It should probably match the max number of items allowed in a player's inventory.
   * @param allowedItems A list of all allowed items to pick from
   */
  public init(
    startTime: number, 
    duration: number, 
    promptIntervalFactor: number, 
    totalOrders: number,
    totalItemVariety: number,
    allowedItems: ItemType[]
  ): void {
    if (duration < 60) {
      throw new Error("Duration must be at least 60 seconds, instead got " + duration);
    }

    if (totalOrders > Math.floor(duration * MAX_ORDERS_PERCENT_OF_TIME)) {
      throw new Error("The number of orders must be less than " + (MAX_ORDERS_PERCENT_OF_TIME * 100) + "% of the number of seconds passed in")
    }

    this.isRunning = true;
    this.startTime = startTime;
    this.duration = duration;
    this.promptIntervalFactor = Math.min(promptIntervalFactor, MAX_ORDER_PROMPT_FREQ);
    this.totalOrders = totalOrders;
    this.inactiveOrders = [];
    this.activeOrders = [];
    this.doneOrders = [];
    this.lastClockTime = 0;
    this.totalItemVariety = totalItemVariety;
    this.allowedItems = allowedItems;
    this.orderProgress = new Map();

    // Generate orders
    this.generateOrders(totalOrders);
    this.promptTimes = this.generateTimes();
  }

  /** Receive observer updates on inventory changes */
  public observerUpdate(data: any, propertyName: string): void {
    if (propertyName === OBS_INVENTORY_CHANGE) {
      const dataCast = data as Map<ItemType, number>;
      this.orderProgress = new Map(); // use new map to ensure data freshness
      const currentOrder = this.activeOrders[0]?.getAllItems();
      if (currentOrder) {
        currentOrder.forEach((value, key) => {
          if (dataCast.has(key)) {
            this.orderProgress.set(key, dataCast.get(key) ?? 0);
          }
        });
      }
    }
  }

  private calculateAccuracy(correctOrder: Order, itemsToEvaluate: Map<ItemType, number>): number {
    /** Calculate correctness */
      let biggerMap;
      let smallerMap;
      if (correctOrder.getAllItems().size >= itemsToEvaluate.size) {
        biggerMap = correctOrder.getAllItems();
        smallerMap = itemsToEvaluate;
      } else {
        biggerMap = itemsToEvaluate;
        smallerMap = correctOrder.getAllItems();
      }

      let totalCorrectCount = 0;
      let incorrectCount = 0;

      for (const [key, value] of biggerMap) {
        totalCorrectCount += value;
        if (!smallerMap.has(key)) {
          incorrectCount += value;
        } else if (smallerMap.has(key) && smallerMap.get(key) !== value) {
          incorrectCount = incorrectCount + (Math.abs(value - (smallerMap.get(key) ?? 0)));
        }
      }

      return(Math.max(totalCorrectCount - incorrectCount, 0)) / totalCorrectCount;
  }

  public deliverOrder(items: Map<ItemType, number>): void {
    const currentlyActive = this.activeOrders.splice(0, 1)[0];
    if (currentlyActive) {
      this.doneOrders.push(currentlyActive);
      currentlyActive.setFulfillTime(this.lastClockTime);
      // send alert
      this.notifyObservers(currentlyActive, OBS_ORDER_COMPLETE);
      if (this.getCurrentActiveOrder() !== null)
        this.notifyObservers(this.getCurrentActiveOrder(), OBS_NEW_ACTIVE_ORDER);
    
      /* Check accuracy */
      currentlyActive.setFulfillAccuracy(this.calculateAccuracy(currentlyActive, items));
      console.log(currentlyActive.getFulfillAccuracy());
    }
  }

  /** Getter method for the user's progress on collecting the current order */
  public getOrderStatus(): Map<ItemType, number> {
    return this.orderProgress;
  }

  public override update(context: GameContext): void {
    super.update(context);

    if (this.isRunning) {
      const currentTime = context.gameTime;
      this.lastClockTime = currentTime;   // update field so that time is accessible

      if (currentTime < this.startTime + this.duration) {

        const nextTime = this.promptTimes[this.promptTimes.length - 1];
        if (Math.floor(currentTime) === nextTime) {
          this.promptTimes.pop();

          // load the next order
          const nextOrder: Order | undefined = this.inactiveOrders.shift();
          if (nextOrder !== undefined) {
            // notify if the pushed order will end up at the front of the queue
            if (this.activeOrders.length === 0) {
              this.notifyObservers(nextOrder, OBS_NEW_ACTIVE_ORDER);
            }

            this.activeOrders.push(nextOrder);
            nextOrder.setArrivalTime(Math.floor(currentTime));
            if (context.debug) {
              console.log(nextOrder);
            }
          }
        }
      } else {
        // stop the loop system, fire level end event
        this.isRunning = false;
        this.sceneTrigger.assertChange(null, LEVEL_OVER);
      }
    }
  }

  public subscribe(observer: Observer): void {
    this.observers.push(observer);
  }
  public unsubscribe(observer: Observer): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  public notifyObservers(data: any, notificationType: string): void {
    for (const observer of this.observers) {
      observer.observerUpdate(data, notificationType);
    }
  }

  private generateOrders(quantity: number) {
    for (let i = 0; i < quantity; i++) {
      const order = new Order();

      for (let j = 0; j < this.totalItemVariety; j++) {
        const randomItemIndex = this.generateRandom(0, this.allowedItems.length - 1);
        const randomItem = this.allowedItems[randomItemIndex];
        if (randomItem !== undefined) {
          order.addItem(randomItem);
        }
      }

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

  public getTotalOrders(): number {
    return this.totalOrders;
  }

  public getNumberOfDoneOrders(): number {
    return this.doneOrders.length;
  }

  /**
   * Return the list of active orders
   */
  public getActiveOrders(): Order[] {
    return this.activeOrders.slice();
  }

  /**
   * Return the current active order, which is the first one in the active orders list
   * Return null if there is no currently active order
   */
  public getCurrentActiveOrder(): Order | null {
    if (this.activeOrders.length > 0) {
      return this.activeOrders[0] ?? null;
    } else {
      return null;
    }
  }

  /**
   * return the length of the level in seconds
   */
  public getLevelDuration(): number {
    return this.duration;
  }

  /**
   * return the starting time stamp
   */
  public getStartTime(): number {
    return this.startTime;
  }
}