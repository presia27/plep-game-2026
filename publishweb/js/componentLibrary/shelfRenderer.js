/**
 * Renderer for shelf with optional item sprite on top
 * Displays shelf.JPG as base and item from items.png spritesheet if present
 * @author pmo
 */
import { getItemMetadata } from "../gamefiles/itemTypes.js";
/**
 * Renders a shelf and its item (if present)
 */
export class ShelfRenderer {
    /**
     * @param shelfImage The shelf.JPG image
     * @param itemsSpritesheet The items.png spritesheet
     * @param positionComponent Position of the shelf
     * @param shelfComponent ShelfComponent to check for items
     * @param itemFrameWidth Width of each item frame in spritesheet
     * @param itemFrameHeight Height of each item frame in spritesheet
     * @param itemOffsetX X offset to center item on shelf
     * @param itemOffsetY Y offset to position item on shelf
     * @param scale Scale factor for rendering
     */
    constructor(shelfImage, itemsSpritesheet, positionComponent, shelfComponent, itemFrameWidth = 16, itemFrameHeight = 16, itemOffsetX = 8, itemOffsetY = -10, scale = 2.0) {
        this.shelfImage = shelfImage;
        this.itemsSpritesheet = itemsSpritesheet;
        this.positionComponent = positionComponent;
        this.shelfComponent = shelfComponent;
        this.itemFrameWidth = itemFrameWidth;
        this.itemFrameHeight = itemFrameHeight;
        this.itemOffsetX = itemOffsetX;
        this.itemOffsetY = itemOffsetY;
        this.scale = scale;
    }
    draw(context) {
        const pos = this.positionComponent.getPosition();
        const ctx = context.ctx;
        // Calculate item center position for interaction circle
        const itemCenterX = pos.x + this.itemOffsetX * this.scale + (this.itemFrameWidth * this.scale) / 2;
        const itemCenterY = pos.y + this.itemOffsetY * this.scale + (this.itemFrameHeight * this.scale) / 2;
        // Debug: Draw interaction radius FIRST so it appears behind everything
        // Center the circle on where the ITEM appears, not the shelf base
        if (context.debug) {
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
            ctx.fillStyle = 'rgba(0, 255, 0, 0.1)'; // Light green fill
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(itemCenterX, itemCenterY, this.shelfComponent.getInteractionRadius(), 0, Math.PI * 2);
            ctx.fill(); // Fill the circle first
            ctx.stroke(); // Then draw the outline
        }
        // Draw shelf base
        ctx.drawImage(this.shelfImage, pos.x, pos.y, this.shelfImage.width * this.scale, this.shelfImage.height * this.scale);
    }
    /**
     * Draw the item on top of the shelf (call this after all shelves are drawn)
     */
    drawItem(context) {
        const itemType = this.shelfComponent.getItemType();
        if (itemType === null)
            return;
        const pos = this.positionComponent.getPosition();
        const ctx = context.ctx;
        const itemMetadata = getItemMetadata(itemType);
        const frameIndex = itemMetadata.spriteFrameIndex;
        // Calculate source position in spritesheet
        // 4x3 grid layout (4 columns, 3 rows)
        const col = frameIndex % 4;
        const row = Math.floor(frameIndex / 4);
        const srcX = col * this.itemFrameWidth;
        const srcY = row * this.itemFrameHeight;
        // Calculate destination position (on top of shelf)
        const destX = pos.x + this.itemOffsetX * this.scale;
        const destY = pos.y + this.itemOffsetY * this.scale;
        const destWidth = this.itemFrameWidth * this.scale;
        const destHeight = this.itemFrameHeight * this.scale;
        ctx.drawImage(this.itemsSpritesheet, srcX, srcY, this.itemFrameWidth, this.itemFrameHeight, destX, destY, destWidth, destHeight);
    }
}
