/**
 * UI component for displaying the current order and progress
 * @author pmo
 */
import { getItemMetadata } from "../gamefiles/itemTypes.js";
import { getProgressText } from "../gamefiles/orderSystem.js";
/**
 * Renders the order UI showing required items and progress
 */
export class OrderUIRenderer {
    /**
     * @param orderState Current order state to display
     * @param itemsSpritesheet Items spritesheet for icons
     * @param x X position on screen for UI
     * @param y Y position on screen for UI
     * @param itemFrameWidth Width of each item frame in spritesheet
     * @param itemFrameHeight Height of each item frame in spritesheet
     * @param iconScale Scale factor for item icons
     * @param iconSpacing Spacing between icons
     */
    constructor(orderState, itemsSpritesheet, x = 20, y = 20, itemFrameWidth = 16, itemFrameHeight = 16, iconScale = 2.0, iconSpacing = 40) {
        this.orderState = orderState;
        this.itemsSpritesheet = itemsSpritesheet;
        this.x = x;
        this.y = y;
        this.itemFrameWidth = itemFrameWidth;
        this.itemFrameHeight = itemFrameHeight;
        this.iconScale = iconScale;
        this.iconSpacing = iconSpacing;
    }
    draw(context) {
        const ctx = context.ctx;
        // Draw background panel
        const panelWidth = 200;
        const panelHeight = 80;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(this.x, this.y, panelWidth, panelHeight);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, panelWidth, panelHeight);
        // Draw title
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Order', this.x + 10, this.y + 25);
        // Draw progress
        const progressText = getProgressText(this.orderState);
        ctx.fillStyle = this.orderState.isComplete ? '#00ff00' : 'white';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(progressText, this.x + 160, this.y + 25);
        // Draw item icons
        const iconY = this.y + 40;
        for (let i = 0; i < this.orderState.requiredItems.length; i++) {
            const itemType = this.orderState.requiredItems[i];
            if (itemType === undefined)
                continue;
            const itemMetadata = getItemMetadata(itemType);
            const iconX = this.x + 10 + (i * this.iconSpacing);
            // Draw icon background
            const isCollected = this.orderState.collectedItems.has(itemType);
            ctx.fillStyle = isCollected ? 'rgba(0, 255, 0, 0.3)' : 'rgba(128, 128, 128, 0.3)';
            ctx.fillRect(iconX - 2, iconY - 2, this.itemFrameWidth * this.iconScale + 4, this.itemFrameHeight * this.iconScale + 4);
            // Draw item icon from spritesheet
            // 4x3 grid layout (4 columns, 3 rows)
            const frameIndex = itemMetadata.spriteFrameIndex;
            const col = frameIndex % 4;
            const row = Math.floor(frameIndex / 4);
            const srcX = col * this.itemFrameWidth;
            const srcY = row * this.itemFrameHeight;
            ctx.drawImage(this.itemsSpritesheet, srcX, srcY, this.itemFrameWidth, this.itemFrameHeight, iconX, iconY, this.itemFrameWidth * this.iconScale, this.itemFrameHeight * this.iconScale);
            // Draw checkmark if collected
            if (isCollected) {
                ctx.strokeStyle = '#00ff00';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(iconX + 2, iconY + 16);
                ctx.lineTo(iconX + 10, iconY + 24);
                ctx.lineTo(iconX + 28, iconY + 8);
                ctx.stroke();
            }
        }
        // Draw completion message
        if (this.orderState.isComplete) {
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 12px Arial';
            ctx.fillText('COMPLETE!', this.x + 10, this.y + 75);
        }
    }
    /**
     * Update the order state reference
     */
    setOrderState(orderState) {
        this.orderState = orderState;
    }
    /**
     * Set UI position
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
}
