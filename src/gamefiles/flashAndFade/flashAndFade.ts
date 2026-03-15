import { GameContext } from "../../classinterfaces.ts";
import { Entity } from "../../entity.ts";

/**
 * Similar to the vignette controller, but designed to flash
 * on damage and fade on fail. Otherwise, it's invisible.
 * 
 * @author Preston Sia (presia27), Claude Sonnet 4.5
 */
export class FlashAndFade extends Entity {
  // Flash state
  private isFlashing: boolean = false;
  private flashTimer: number = 0;
  private flashDuration: number = 0.15; // seconds - quick flash
  private flashIntensity: number = 0;

  // Darken mask state
  private darkenOpacity: number = 0;

  // Fade state
  private maskOpacity: number = 0;
  private isFadingToBlack: boolean = false;
  private fadeSpeed: number = 1.0; // opacity

  constructor() {
    super();
  }

  // Flash methods

  /**
   * Flash the screen red with a radial pattern
   * @param duration Length of flash
   * @param flashIntensity Intensity value of flash (default 1.0)
   */
  public triggerFlash(duration?: number, flashIntensity?: number): void {
    this.isFlashing = true;
    this.flashTimer = duration || this.flashDuration;
    this.flashIntensity = flashIntensity ?? 1.0;
  }

  // Fade methods

  /**
   * Incrementally darken the screen
   * @param amount How much to increase darkness (0-1)
   */
  public darken(amount: number): void {
    this.darkenOpacity = Math.min(this.darkenOpacity + amount, 1.0);
  }
  
  /**
   * Fade to black over time
   * @param speed Optional fade speed (opacity per second, default 1.0)
   */
  public fadeToBlack(speed?: number): void {
    this.isFadingToBlack = true;
    this.fadeSpeed = speed || 1.0;
  }

  /**
   * Reset all mask parameters
   */
  public reset(): void {
    this.maskOpacity = 0;
    this.isFadingToBlack = false;
    this.darkenOpacity = 0;
  }

  /**
   * Get current black mask opacity
   */
  public getMaskOpacity(): number {
    return this.maskOpacity;
  }

  /**
   * Get the opacity for darkening
   * @returns Darken opacity number
   */
  public getDarkenOpacity(): number {
    return this.darkenOpacity;
  }

  /**
   * Set black mask opacity directly
   */
  public setMaskOpacity(opacity: number): void {
    this.maskOpacity = Math.max(0, Math.min(opacity, 1.0));
  }

  public setDarkenOpacity(opacity: number): void {
    this.darkenOpacity = Math.max(0, Math.min(opacity, 1.0));
  }
  
  /**
   * Check if fade to black is complete
   */
  public isFadeComplete(): boolean {
    return this.maskOpacity >= 1.0;
  }

  public override update(context: GameContext): void {
    if (this.isFlashing) {
      this.flashTimer -= context.clockTick;
      
      // Fade out the flash intensity over time
      this.flashIntensity = Math.max(this.flashTimer / this.flashDuration, 0);
      
      if (this.flashTimer <= 0) {
        this.isFlashing = false;
        this.flashIntensity = 0;
      }
    }

    // Update fade to black
    if (this.isFadingToBlack && this.maskOpacity < 1.0) {
      this.maskOpacity = Math.min(
        this.maskOpacity + (this.fadeSpeed * context.clockTick),
        1.0
      );
    }
  }

  public override draw(gameContext: GameContext): void {
    const ctx = gameContext.ctx;
    
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    if (this.isFlashing && this.flashIntensity > 0) {
      const redGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, Math.sqrt(centerX ** 2 + centerY ** 2)
      );
      
      redGradient.addColorStop(0, `rgba(255, 0, 0, ${0.1 * this.flashIntensity})`);
      redGradient.addColorStop(1, `rgba(139, 0, 0, ${0.6 * this.flashIntensity})`); // dark red edges
      
      ctx.fillStyle = redGradient;
      ctx.fillRect(0, 0, width, height);
    }

    if (this.darkenOpacity > 0) {
      const blackGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, Math.sqrt(centerX ** 2 + centerY ** 2)
      );

      blackGradient.addColorStop(0, `rgba(20, 0, 0, ${0.25 * this.darkenOpacity})`);
      blackGradient.addColorStop(1, `rgba(20, 0, 0, ${0.5 * this.darkenOpacity})`);

      ctx.fillStyle = blackGradient;
      ctx.fillRect(0, 0, width, height);
    }

    if (this.maskOpacity > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${this.maskOpacity})`;
      ctx.fillRect(0, 0, width, height);
    }
  }
}

