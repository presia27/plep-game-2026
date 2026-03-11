import { DynamicTextbox } from "./dynamicTextbox.js";
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
    constructor(sceneManager, assetManager, defaultX = 50, defaultY = 50, defaultWidth = 300, defaultHeight = 100, backgroundSpriteId = null) {
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
     * @returns The created DynamicTextbox entity (chainable for customization)
     */
    showMessage(text, duration) {
        var _a;
        const textbox = new DynamicTextbox(text, this.defaultX, this.defaultY, this.defaultWidth, this.defaultHeight, duration !== null && duration !== void 0 ? duration : this.defaultDuration, this.assetManager, (_a = this.backgroundSpriteId) !== null && _a !== void 0 ? _a : undefined, this.defaultRevealSpeed);
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
    clearAll() {
        for (const textbox of this.activeTextboxes) {
            textbox.forceRemove();
        }
        this.activeTextboxes = [];
    }
    /**
     * Clean up expired textboxes from the tracking list.
     * This is called automatically, but you can call it manually if needed.
     */
    cleanupExpired() {
        this.activeTextboxes = this.activeTextboxes.filter(textbox => !textbox.isExpired());
    }
    /**
     * Get the number of currently active textboxes
     */
    getActiveCount() {
        this.cleanupExpired();
        return this.activeTextboxes.length;
    }
    /**
     * Set default position for future textboxes
     */
    setDefaultPosition(x, y) {
        this.defaultX = x;
        this.defaultY = y;
    }
    /**
     * Set default size for future textboxes
     */
    setDefaultSize(width, height) {
        this.defaultWidth = width;
        this.defaultHeight = height;
    }
    /**
     * Set default duration for future textboxes
     */
    setDefaultDuration(duration) {
        this.defaultDuration = duration;
    }
    /**
     * Set default reveal speed for future textboxes
     */
    setDefaultRevealSpeed(speed) {
        this.defaultRevealSpeed = speed;
    }
    /**
     * Set the background sprite for future textboxes
     */
    setBackgroundSprite(spriteId) {
        this.backgroundSpriteId = spriteId;
    }
}
