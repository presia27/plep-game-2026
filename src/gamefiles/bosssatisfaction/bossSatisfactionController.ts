import { GameContext } from "../../classinterfaces";
import { Entity } from "../../entity.ts";
import { Order } from "../ordermanagement/order.ts";
import { OBS_NEW_ACTIVE_ORDER, OBS_ORDER_COMPLETE, Observer } from "../../observerinterfaces.ts";
import { LEVEL_OVER, GameStateEventTrigger } from "../../gameStateEventTrigger.ts";
import { LevelResult } from "../levels/levelinterfaces.ts";
import { ASSET_MANAGER } from "../main.ts";

const MAX_SATISFACTION = 100; // If > MIN_SATISFACTION, the player can continue playing
const MIN_SATISFACTION = 0; // The minimum satisfaction points, if reached, the game is over and the player loses
const START_SATISFACTION = 75; // Level starts with this many satisfaction points
const SUCCESSFUL_ORDER_POINTS = 10; // Satisfaction points gained per successful order fulfillment

/**
 * Represents the boss's satisfaction level in the game. If it reaches 0, the game is over and the player loses. As
 * long as it is above 0, the player can continue playing (assuming all orders have not yet been fulfilled and the
 * level timer has not run out). 
 * The satisfaction level decreases over time and with incorrect deliveries, and increases with correct deliveries.
 * 
 * Remember to subscribe this object to the order system in the calling class.
 * 
 * @author Emma Szebenyi
 */
export class BossSatisfaction extends Entity implements Observer {
    private sceneTrigger: GameStateEventTrigger;

    private satisfaction: number; // Satisfaction points, if reaches 0, the game is over and the player loses
    private decreaseRate: number; // Satisfaction points lost per second (correlates to level length)
    private errorWeight: number; // Satisfaction points lost per incorrect item delivered
    private activeOrder: Order | null;
    
    // Threshold tracking for audio triggers
    private previousSatisfaction: number; // Previous satisfaction value to detect threshold crossings
    private angryThresholdTriggered: boolean; // Tracks if angry sound has been triggered below 25
    private happyThresholdTriggered: boolean; // Tracks if happy sound has been triggered above 75
    
    // Boss icon scale animation
    private iconScaleTimer: number; // Timer for boss icon scale animation (counts down from animation duration)

    /**
     * Initialize the boss satisfaction system to
     * zero or null values. Use initialize to
     * populate the needed parameters.
     */
    constructor(sceneTrigger: GameStateEventTrigger) {
        super();
        this.sceneTrigger = sceneTrigger;
        
        this.satisfaction = 0;
        this.decreaseRate = 0;
        this.activeOrder = null;
        this.errorWeight = 0;
        this.previousSatisfaction = 0;
        this.angryThresholdTriggered = false;
        this.happyThresholdTriggered = false;
        this.iconScaleTimer = 0;
    }

    /**
     * Initialize the state of the boss satisfaction controller
     * based on the specified order system.
     * @param duration The time duration of the level
     */
    public initialize(duration: number, satisfaction?: number) {
        this.satisfaction = satisfaction ?? START_SATISFACTION;
        //this.decreaseRate = duration / MAX_SATISFACTION; // the rate per sec at which satisfaction decrease
        this.decreaseRate = this.satisfaction / duration;
        this.activeOrder = null;
        this.errorWeight = 0;
        this.previousSatisfaction = this.satisfaction;
        this.angryThresholdTriggered = false;
        this.happyThresholdTriggered = false;
        this.iconScaleTimer = 0;
    }

    public reset(): void {
        this.satisfaction = 0;
        this.decreaseRate = 0;
        this.activeOrder = null;
        this.errorWeight = 0;
        this.previousSatisfaction = 0;
        this.angryThresholdTriggered = false;
        this.happyThresholdTriggered = false;
    }

    public override update(context: GameContext): void {
        super.update(context);
        if (this.activeOrder) { // satisfaction only affected if an order is active
            if (this.satisfaction > MIN_SATISFACTION) { // only decrease satisfaction if the game is not already over
                this.satisfaction = this.satisfaction - (this.decreaseRate * context.clockTick); // @TODO: multiply by elapsed time since start of level
                this.checkSatisfactionThresholds();
            }
        }
        
        // Update icon scale animation timer
        if (this.iconScaleTimer > 0) {
            this.iconScaleTimer -= context.clockTick;
            if (this.iconScaleTimer < 0) {
                this.iconScaleTimer = 0;
            }
        }
        
        this.checkLoseCondition();
    }
    
    /**
     * Updates the boss's satisfaction level based on the number of incorrect items delivered.
     * Update 15-MAR: New algorithm - If order accuracy > 50%, Add SUCCESS_POINTS - (error weight * # of incorrect items), minimum 0
     * If accuracy <=50%, subtract Math.min(error weight * incorrect items, SUCCESS_POINTS) i.e. subtract error points proportional to the
     * number of incorrect items, up to a maximum of SUCCESS_POINTS points.
     * This change is intended to disincentivise filling completely wrong orders just to get past the levels.
     * 
     * @param order the current active order
     * @param inventory the player's inventory
     */
    public updateSatisfaction(order: Order): void {
        const incorrectItems = order.getFulfillMistakeCount();
        const accuracy = order.getFulfillAccuracy();
        let satisfaction = this.satisfaction;
        
        // if (incorrectItems == 0) {
        //     satisfaction += SUCCESSFUL_ORDER_POINTS + 5; // bonus points for a perfect order
        // } else if (incorrectItems !== null) {
        //     satisfaction += SUCCESSFUL_ORDER_POINTS - (this.errorWeight * incorrectItems); // subtract points based on the number of incorrect items (negative if more incorrect items than correct items)
        // }
        if (accuracy !== null && incorrectItems !== null) {
            if (accuracy > 0.5) {
                satisfaction += SUCCESSFUL_ORDER_POINTS - (this.errorWeight * incorrectItems);
            } else {
                satisfaction -= Math.min(this.errorWeight * incorrectItems, SUCCESSFUL_ORDER_POINTS);
            }
        }
        

        // Ensure satisfaction does not exceed the maximum or drop below the minimum
        if (satisfaction > MAX_SATISFACTION) {
            satisfaction = MAX_SATISFACTION;
        } else if (this.satisfaction < MIN_SATISFACTION) {
            satisfaction = MIN_SATISFACTION;
        }

        this.satisfaction = satisfaction;
        this.checkSatisfactionThresholds();
    }
    
    /**
     * Checks if satisfaction has crossed threshold levels (25 or 75) and plays appropriate sounds.
     * Angry sound plays when satisfaction drops to or below 25.
     * Happy sound plays when satisfaction rises to or above 75.
     */
    private checkSatisfactionThresholds(): void {
        // Check if satisfaction dropped to or below 25 (angry threshold)
        if (this.satisfaction <= 25 && this.previousSatisfaction > 25) {
            ASSET_MANAGER.playMusic("angry");
            this.iconScaleTimer = 0.4; // Trigger 0.4 second scale animation
            this.angryThresholdTriggered = true;
            this.happyThresholdTriggered = false; // Reset happy threshold when crossing into angry territory
        }
        // Check if satisfaction rose to or above 75 (happy threshold, woo good job employee!!)
        else if (this.satisfaction >= 75 && this.previousSatisfaction < 75) {
            ASSET_MANAGER.playMusic("happy");
            this.happyThresholdTriggered = true;
            this.angryThresholdTriggered = false; // Reset angry threshold when crossing into happy territory
        }
        // Reset flags if we're back in the middle zone (aka lock in)
        else if (this.satisfaction > 25 && this.satisfaction < 75) {
            if (this.previousSatisfaction <= 25 || this.previousSatisfaction >= 75) {
                this.angryThresholdTriggered = false;
                this.happyThresholdTriggered = false;
            }
        }
        
        this.previousSatisfaction = this.satisfaction;
    }

    /** Receive observer updates from order loop */
    public observerUpdate(data: any, propertyName: string): void {
        if (OBS_NEW_ACTIVE_ORDER === propertyName) {
            const newOrderDataCast = data as Order;
            if (newOrderDataCast) {
                this.activeOrder = newOrderDataCast;
                this.errorWeight = SUCCESSFUL_ORDER_POINTS / this.activeOrder!.getTotalItems();
            }
            
        }
        if (OBS_ORDER_COMPLETE === propertyName) {
            const completedOrder = data as Order;
            this.updateSatisfaction(completedOrder);
            this.activeOrder = null;
        }
    }

    /**
     * Returns true if satisfaction reaches 0, indicating the game is over.
     * 
     * @returns boolean indicating whether the game is over or not
     */
    public checkLoseCondition(): boolean {
        if (this.satisfaction <= MIN_SATISFACTION) {
            const result: LevelResult = {
                success: false,
                reason: "BOSS SATISFACTION DROPPED TO 0!"
            }
            this.sceneTrigger.assertChange(result, LEVEL_OVER);
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
        return this.satisfaction;
    }

    /**
     * Gets the boss's satisfaction decrease rate.
     * 
     * @returns the current decrease rate
     */
    public getDecreaseRate(): number {
        return this.decreaseRate;
    }
    
    /**
     * Code for boss icon scaling during anger noise (for responsiveness so player isn't like wtf just played)
     * 
     * Gets the current scale multiplier for the boss icon animation.
     * Returns 1.0 (normal size) when not animating, scales up to 1.5 during animation.
     * 
     * @returns scale multiplier for the boss icon (1.0 to 1.5)
     */
    public getIconScale(): number {
        if (this.iconScaleTimer <= 0) {
            return 1.0; // Normal size
        }
        
        // Animation: scale up in first half, scale down in second half
        const animDuration = 0.4;
        const progress = this.iconScaleTimer / animDuration;
        
        if (progress > 0.5) {
            // First half: scale from 1.0 to 1.5
            const scaleProgress = (progress - 0.5) * 2; // 0 to 1
            return 1.0 + (scaleProgress * 0.5);
        } else {
            // Second half: scale from 1.5 back to 1.0
            const scaleProgress = progress * 2; // 1 to 0
            return 1.0 + (scaleProgress * 0.5);
        }
    }
}