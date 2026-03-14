import { LevelResult } from "../gamefiles/levels/levelinterfaces.ts";
import { GameStateEventTrigger, LEVEL_OVER } from "../gameStateEventTrigger.ts";

/**
 * Game-scoped monitor of the player's health/status
 * intended to monitor health changes and provide
 * user feedback accordingly, as well as game loop
 * changes on certain conditions. Hence this is separate
 * from the player itself.
 * 
 * @author Preston Sia (presia27)
 */
export class PlayerHealthMonitor {
  private currentHealth: number;
  private maxHealth: number;
  private initMaxHealth: number;
  private healthStep: number;
  private initHealthStep: number;

  private eventTrigger: GameStateEventTrigger;

  /**
   * 
   * @param maxHealth Maximum health of the player (also the default on instantiation)
   * @param healthStep How much to alter the health of the player by default
   */
  constructor(maxHealth: number, healthStep: number, eventTrigger: GameStateEventTrigger) {
    this.currentHealth = maxHealth;
    this.maxHealth = maxHealth;
    this.initMaxHealth = maxHealth;
    this.healthStep = healthStep;
    this.initHealthStep = healthStep;
    this.eventTrigger = eventTrigger;
  }

  /**
   * Apply damage based on health step and return the new health value
   */
  public damage(): number {
    this.currentHealth = Math.max(this.currentHealth - this.healthStep, 0);
    this.checkHealthState();
    return this.currentHealth;
  }

  /**
   * Apply regeneration based on health step and return the new health value
   */
  public regen(): number {
    this.currentHealth = Math.min((this.currentHealth + this.healthStep), this.maxHealth);
    return this.currentHealth;
  }

  /**
   * Reset health to full state
   */
  public resetHealth(): void {
    this.currentHealth = this.maxHealth;
  }

  /**
   * Reset all state
   */
  public resetAll(): void {
    this.maxHealth = this.initMaxHealth;
    this.healthStep = this.initHealthStep;
    this.currentHealth = this.initMaxHealth;
  }

  /**
   * Get the current health
   * @returns Current health number
   */
  public getHealth(): number {
    return this.currentHealth;
  }

  /**
   * Set health step, minimum 0 maximum (maxHealth)
   * @param step Step number
   */
  public setHealthStep(step: number): void {
    this.healthStep = Math.min(Math.max(step, 0), this.maxHealth);
  }

  /**
   * Get the maximum health
   * @returns Max health number
   */
  public getMaxHealth(): number {
    return this.maxHealth;
  }

  /**
   * Set the max health
   * @param maxHealth Max health param (>=0)
   */
  public setMaxHealth(maxHealth: number): void {
    this.maxHealth = Math.max(maxHealth, 0);
  }

  /**
   * Check if the health has hit 0 and, if so,
   * trigger a state change
   */
  private checkHealthState(): void {
    if (this.currentHealth <= 0) {
      const levelStatus: LevelResult = {
        success: false,
        reason: "SOUL STOLEN"
      }
      this.eventTrigger.assertChange(levelStatus, LEVEL_OVER)
    }
  }
}