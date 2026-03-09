import { GameContext, IRenderer } from "../../classinterfaces.ts";
import { Entity } from "../../entity.ts";
import { BasicLifecycle } from "../../componentLibrary/lifecycle.ts";
import AssetManager from "../../assetmanager.ts";

/**
 * A dynamic textbox that displays messages with a Pokemon-style
 * character-by-character reveal animation. Automatically disappears
 * after a specified duration OR when forcibly removed (e.g., scene change).
 * 
 * This is completely independent from the MSG_SERVICE system.
 * Use this for event-driven messages like:
 * - Boss dialogue
 * - Tutorial hints
 * - NPC speech
 * - Context-specific notifications
 * 
 * @author Claude Sonnet 4.5
 */
export class DynamicTextbox extends Entity {
  private text: string;
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private duration: number;
  private backgroundSprite: HTMLImageElement | null;
  private textColor: string;
  private fontSize: number;
  private padding: number;
  private revealSpeed: number; // characters per second
  private currentRevealIndex: number;
  private elapsedTime: number;
  private displayTime: number; // time spent displaying (after reveal completes)
  private isRevealing: boolean;
  private lifecycle: BasicLifecycle;
  private expired: boolean; // Track if textbox has been removed

  /**
   * Creates a new dynamic textbox
   * @param text The text to display
   * @param x X position on screen
   * @param y Y position on screen
   * @param width Width of the textbox
   * @param height Height of the textbox
   * @param duration How long to show the textbox (in seconds) after text is fully revealed
   * @param assetManager AssetManager to load the background sprite (optional)
   * @param backgroundSpriteId ID of the background sprite (optional)
   * @param revealSpeed Characters revealed per second (default: 30)
   */
  constructor(
    text: string,
    x: number,
    y: number,
    width: number,
    height: number,
    duration: number,
    assetManager?: AssetManager,
    backgroundSpriteId?: string,
    revealSpeed: number = 30
  ) {
    super();

    this.text = text;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.duration = duration;
    this.textColor = "#FFFFFF"; // default white text
    this.fontSize = 16;
    this.padding = 12;
    this.revealSpeed = revealSpeed;
    this.currentRevealIndex = 0;
    this.elapsedTime = 0;
    this.displayTime = 0;
    this.isRevealing = true;
    this.expired = false;

    // Load background sprite if provided
    if (assetManager && backgroundSpriteId) {
      this.backgroundSprite = assetManager.getImageAsset(backgroundSpriteId);
    } else {
      this.backgroundSprite = null;
    }

    // Add lifecycle component so the textbox can remove itself
    this.lifecycle = new BasicLifecycle();
    super.addComponent(this.lifecycle);

    // Set renderer
    super.setRenderer(new TextboxRenderer(this));
  }

  /**
   * Set the text color
   */
  public setTextColor(color: string): void {
    this.textColor = color;
  }

  /**
   * Set the font size
   */
  public setFontSize(size: number): void {
    this.fontSize = size;
  }

  /**
   * Set the padding inside the textbox
   */
  public setPadding(padding: number): void {
    this.padding = padding;
  }

  /**
   * Get the currently revealed portion of the text
   */
  public getRevealedText(): string {
    return this.text.substring(0, this.currentRevealIndex);
  }

  /**
   * Check if text reveal animation is complete
   */
  public isRevealComplete(): boolean {
    return !this.isRevealing;
  }

  /**
   * Skip the reveal animation and show all text immediately
   */
  public skipReveal(): void {
    this.currentRevealIndex = this.text.length;
    this.isRevealing = false;
  }

  /**
   * Check if this textbox has expired (been removed)
   */
  public isExpired(): boolean {
    return this.expired;
  }

  /**
   * Force this textbox to remove itself immediately.
   * Called when switching scenes or manually clearing textboxes.
   */
  public forceRemove(): void {
    this.lifecycle.die();
    this.expired = true;
  }

  public override update(context: GameContext): void {
    super.update(context);

    if (this.isRevealing) {
      // Update reveal animation
      this.elapsedTime += context.clockTick;
      const targetIndex = Math.floor(this.elapsedTime * this.revealSpeed);
      
      if (targetIndex >= this.text.length) {
        this.currentRevealIndex = this.text.length;
        this.isRevealing = false;
      } else {
        this.currentRevealIndex = targetIndex;
      }
    } else {
      // Text fully revealed, count down display time
      this.displayTime += context.clockTick;
      
      if (this.displayTime >= this.duration) {
        // Time's up, remove the textbox
        this.lifecycle.die();
        this.expired = true;
      }
    }
  }

  // Getters for the renderer
  public getX(): number { return this.x; }
  public getY(): number { return this.y; }
  public getWidth(): number { return this.width; }
  public getHeight(): number { return this.height; }
  public getBackgroundSprite(): HTMLImageElement | null { return this.backgroundSprite; }
  public getTextColor(): string { return this.textColor; }
  public getFontSize(): number { return this.fontSize; }
  public getPadding(): number { return this.padding; }
}

/**
 * Renderer for the dynamic textbox
 */
class TextboxRenderer implements IRenderer {
  private textbox: DynamicTextbox;

  constructor(textbox: DynamicTextbox) {
    this.textbox = textbox;
  }

  draw(context: GameContext): void {
    const ctx = context.ctx;
    ctx.save();

    const x = this.textbox.getX();
    const y = this.textbox.getY();
    const width = this.textbox.getWidth();
    const height = this.textbox.getHeight();
    const padding = this.textbox.getPadding();

    // Draw background
    const bgSprite = this.textbox.getBackgroundSprite();
    if (bgSprite) {
      // Draw the background sprite stretched to fit
      ctx.drawImage(bgSprite, x, y, width, height);
    } else {
      // Default: white box with black border
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x, y, width, height);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    }

    // Draw text (word-wrapped)
    const revealedText = this.textbox.getRevealedText();
    ctx.fillStyle = this.textbox.getTextColor();
    ctx.font = `${this.textbox.getFontSize()}px Arial`;
    
    this.drawWrappedText(
      ctx,
      revealedText,
      x + padding,
      y + padding + this.textbox.getFontSize(),
      width - (padding * 2),
      this.textbox.getFontSize() + 4
    );

    ctx.restore();
  }

  /**
   * Draw text with word wrapping
   */
  private drawWrappedText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): void {
    const words = text.split(' ');
    let line = '';
    let yPos = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        // Line is too long, draw it and start a new line
        ctx.fillText(line, x, yPos);
        line = words[i] + ' ';
        yPos += lineHeight;
      } else {
        line = testLine;
      }
    }
    
    // Draw the last line
    ctx.fillText(line, x, yPos);
  }
}