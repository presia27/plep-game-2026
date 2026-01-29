import { GameContext } from "../../classinterfaces";
import { Entity } from "../../entity.ts";
import { Order } from "./order.ts";

export class OrderDeliveryLoop extends Entity {
  startTime: number;
  duration: number;
  promptIntervalFactor: number;
  totalOrders: number;
  inactiveOrders: Order[];
  activeOrders: Order[];
  doneOrders: Order[];
  lastPromptTime: number | null;

  /**
   * 
   * @param startTime Timestamp of the start of the level
   * @param duration Length of time that the level runs for
   * @param promptIntervalFactor A number that varies the prompting of active orders
   * @param totalOrders Total number of orders in a level
   */
  constructor(startTime: number, duration: number, promptIntervalFactor: number, totalOrders: number) {
    // explicit call to super()
    super();

    this.startTime = startTime;
    this.duration = duration;
    this.promptIntervalFactor = promptIntervalFactor;
    this.totalOrders = totalOrders;
    this.inactiveOrders = [];
    this.activeOrders = [];
    this.doneOrders = [];
    this.lastPromptTime = null;
  }

  public override update(context: GameContext): void {
    super.update(context);

    const currentTime = context.clockTick;

    if (currentTime < this.startTime + this.duration) {
      // do something
    }
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