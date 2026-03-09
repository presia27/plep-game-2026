import AssetManager from "../../assetmanager.ts";
import SceneManager from "../../sceneManager.ts";
import { DynamicTextbox } from "./dynamicTextbox.ts";

/**
 * Manager for showing dynamic textboxes on screen.
 * Makes it easy to display event-driven messages from anywhere in your code.
 * 
 * This is completely independent from MSG_SERVICE.
 * Use this for:
 * - Boss dialogue
 * - Tutorial hints
 * - NPC speech
 * - Context-specific notifications
 * - Event-triggered messages
 * 
 * Automatically clears textboxes when:
 * - Duration expires (automatic)
 * - Scene changes (call clearAll())
 * 
 * Usage:
 * ```
 * const textboxMgr = new TextboxManager(sceneManager, assetManager);
 * textboxMgr.showMessage("The boss looks angry!", 3.0);
 * ```
 * 
 * @author Claude Sonnet 4.5
 */
export class TextboxManager {
  private sceneManager: SceneManager;
  private assetManager: AssetManager;
  private defaultX: number;
  private defaultY: number;
  private defaultWidth: number;
  private defaultHeight: number;
  private backgroundSpriteId: string | null;
  private defaultDuration: number;
  private defaultRevealSpeed: number;
  private activeTextboxes: DynamicTextbox[]; // Track active textboxes

  /**
   * Creates a new TextboxManager
   * @param sceneManager The scene manager to add textboxes to
   * @param assetManager The asset manager for loading sprites
   * @param defaultX Default X position (can be overridden per message)
   * @param defaultY Default Y position (can be overridden per message)
   * @param defaultWidth Default width (can be overridden per message)
   * @param defaultHeight Default height (can be overridden per message)
   * @param backgroundSpriteId Optional sprite ID for the textbox background
   */
  constructor(
    sceneManager: SceneManager,
    assetManager: AssetManager,
    defaultX: number = 50,
    defaultY: number = 50,
    defaultWidth: number = 300,
    defaultHeight: number = 100,
    backgroundSpriteId: string | null = null
  ) {
    this.sceneManager = sceneManager;
    this.assetManager = assetManager;
    this.defaultX = defaultX;
    this.defaultY = defaultY;
    this.defaultWidth = defaultWidth;
    this.defaultHeight = defaultHeight;
    this.backgroundSpriteId = backgroundSpriteId;
    this.defaultDuration = 3.0; // 3 seconds default
    this.defaultRevealSpeed = 30; // 30 characters per second
    this.activeTextboxes = [];
  }

  /**
   * Show a message in a textbox
   * @param text The message to display
   * @param duration How long to show the message after it's fully revealed (in seconds)
   * @param x Optional X position (uses default if not provided)
   * @param y Optional Y position (uses default if not provided)
   * @param width Optional width (uses default if not provided)
   * @param height Optional height (uses default if not provided)
   * @returns The created DynamicTextbox entity
   */
  public showMessage(
    text: string,
    duration?: number,
    x?: number,
    y?: number,
    width?: number,
    height?: number
  ): DynamicTextbox {
    const textbox = new DynamicTextbox(
      text,
      x ?? this.defaultX,
      y ?? this.defaultY,
      width ?? this.defaultWidth,
      height ?? this.defaultHeight,
      duration ?? this.defaultDuration,
      this.assetManager,
      this.backgroundSpriteId ?? undefined,
      this.defaultRevealSpeed
    );

    // Add to scene as a UI entity (drawn on top)
    this.sceneManager.addUIEntity(textbox);
    
    // Track this textbox
    this.activeTextboxes.push(textbox);

    return textbox;
  }

  /**
   * Clear all active textboxes immediately.
   * Call this when changing scenes to prevent textboxes from
   * carrying over to the new scene.
   */
  public clearAll(): void {
    for (const textbox of this.activeTextboxes) {
      textbox.forceRemove();
    }
    this.activeTextboxes = [];
  }

  /**
   * Clean up expired textboxes from the tracking list.
   * This is called automatically, but you can call it manually if needed.
   */
  public cleanupExpired(): void {
    this.activeTextboxes = this.activeTextboxes.filter(textbox => !textbox.isExpired());
  }

  /**
   * Get the number of currently active textboxes
   */
  public getActiveCount(): number {
    this.cleanupExpired();
    return this.activeTextboxes.length;
  }

  /**
   * Set default position for future textboxes
   */
  public setDefaultPosition(x: number, y: number): void {
    this.defaultX = x;
    this.defaultY = y;
  }

  /**
   * Set default size for future textboxes
   */
  public setDefaultSize(width: number, height: number): void {
    this.defaultWidth = width;
    this.defaultHeight = height;
  }

  /**
   * Set default duration for future textboxes
   */
  public setDefaultDuration(duration: number): void {
    this.defaultDuration = duration;
  }

  /**
   * Set default reveal speed for future textboxes
   */
  public setDefaultRevealSpeed(speed: number): void {
    this.defaultRevealSpeed = speed;
  }

  /**
   * Set the background sprite for future textboxes
   */
  public setBackgroundSprite(spriteId: string | null): void {
    this.backgroundSpriteId = spriteId;
  }
}