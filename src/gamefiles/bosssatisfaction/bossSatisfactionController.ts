import { GameContext } from "../../classinterfaces";
import { Entity } from "../../entity.ts";
import { OrderDeliveryLoop } from "../ordermanagement/orderloopsys";
import { InventoryManager } from "../inventory/inventoryManager";
import { StaticSpriteRenderer } from "../../componentLibrary/staticSpriteRenderer.ts";

const MAX_SATISFACTION = 100; // If > MIN_SATISFACTION, the player can continue playing
const MIN_SATISFACTION = 0; // The minimum satisfaction points, if reached, the game is over and the player loses
const START_SATISFACTION = 50; // Level starts with this many satisfaction points
const SUCCESSFUL_ORDER_POINTS = 10; // Satisfaction points gained per successful order fulfillment

/**
 * Represents the boss's satisfaction level in the game. If it reaches 0, the game is over and the player loses. As
 * long as it is above 0, the player can continue playing (assuming all orders have not yet been fulfilled and the
 * level timer has not run out). 
 * The satisfaction level decreases over time and with incorrect deliveries, and increases with correct deliveries.
 * 
 * @author Emma Szebenyi
 */
export class BossSatisfaction extends Entity {
    private satisfaction: number; // Satisfaction points, if reaches 0, the game is over and the player loses
    private decreaseRate: number; // Satisfaction points lost per second (correlates to level length)
    private errorWeight: number; // Satisfaction points lost per incorrect item delivered

    constructor(orderLoop: OrderDeliveryLoop) {
        super();
        this.satisfaction = START_SATISFACTION;
        this.decreaseRate = orderLoop.getLevelDuration() / MAX_SATISFACTION; // the rate per sec at which satisfaction decrease
        this.errorWeight = SUCCESSFUL_ORDER_POINTS / orderLoop.getCurrentActiveOrder()!.getTotalItems();
        
        //const renderer = new StaticSpriteRenderer(spritesheet, 86, 8, 68, 36, posComp, shelfSize);
        //    super.setRenderer(renderer);
    }

    public override update(context: GameContext): void {
        super.update(context);
        this.satisfaction -= this.decreaseRate; // @TODO: multiply by elapsed time since start of level
    }
    
    /**
     * Updates the boss's satisfaction level based on the number of incorrect items delivered.
     * 
     * @param order the current active order
     * @param inventory the player's inventory
     */
    public updateSatisfaction(order: OrderDeliveryLoop, inventory: InventoryManager): void {
        const incorrectItems = this.checkOrderFulfillment(order.getCurrentActiveOrder()!.getAllItems(), inventory.getAllItems());
        
        if (incorrectItems == 0) {
            this.satisfaction += SUCCESSFUL_ORDER_POINTS + 5; // bonus points for a perfect order
        } else {
            this.satisfaction += SUCCESSFUL_ORDER_POINTS - (this.errorWeight * incorrectItems); // subtract points based on the number of incorrect items (negative if more incorrect items than correct items)
        }

        // Ensure satisfaction does not exceed the maximum or drop below the minimum
        if (this.satisfaction > MAX_SATISFACTION) {
            this.satisfaction = MAX_SATISFACTION;
        } else if (this.satisfaction < MIN_SATISFACTION) {
            this.satisfaction = MIN_SATISFACTION;
        }
    }

    /**
     * Helper method that checks the player's inventory against the current active order and returns the number of incorrect items.
     * 
     * @param inventory a map representing all the items in the player's inventory
     * @param order a map representing all the items in the current active order
     * @returns the number of incorrect items
     */
    public checkOrderFulfillment(order: Map<string, number>, inventory: Map<string, number>): number {
        const allItems = new Set([...order.keys(), ...inventory.keys()]); // a set of all unique item types in both the order and inventory
        let incorrectItems = 0;

        // For each item type in the combined set, look up its quantity in the order 
        // (defaulting to 0 if absent) and its quantity in the inventory (defaulting to 0 if absent).
        allItems.forEach((item) => {
            const orderQuantity = order.get(item) ?? 0;
            const inventoryQuantity = inventory.get(item) ?? 0;
            
            // Calculate the difference between the inventory quantity and the order quantity for this item type.
            // If difference = 0 -> correct item
            // If difference != 0 -> incorrect item (too many or too few of this item type)
            const difference = inventoryQuantity - orderQuantity;
            
            if (difference != 0) // Increment incorrectItems by the absolute value of the difference (how many items of this type are incorrect)
                incorrectItems += Math.abs(difference);
        });
        return incorrectItems;
    }

    /**
     * Returns true if satisfaction reaches 0, indicating the game is over.
     * 
     * @returns boolean indicating whether the game is over or not
     */
    public isGameOver(): boolean {
        if (this.satisfaction <= MIN_SATISFACTION) {
            console.log("Game over! Boss satisfaction has reached 0.");
            return true;
        }
        return false;
    }

    /**
     * Sets the boss's satisfaction level to a specific value (can be used if the player has unfulfilled orders at the end of the level)
     * 
     * @param value the new satisfaction value to set
     */
    public setSatisfaction(value: number): void {
        this.satisfaction = value;
    }

    /**
     * Gets the boss's satisfaction level.
     * 
     * @returns the current satisfaction level
     */
    public getSatisfaction(): number {
        console.log(`Current boss satisfaction: ${this.satisfaction}`);
        return this.satisfaction;
    }
}