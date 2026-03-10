import { GameContext, IRenderer } from "../../classinterfaces.ts";
import { ASSET_MANAGER } from "../main.ts";
import { getItemMetadata } from "../ordermanagement/itemTypes.ts";
import { InventoryManager } from "./inventoryManager.ts";
import { ITEM_WIDTH, ITEM_HEIGHT } from "../ordermanagement/itemEntity.ts";
import { InventorySelectorComponent } from "./inventorySelectorComponent.ts";

const PANELHEIGHT = 80;
const ITEM_SIDE_WIDTH = 50;
const BUFFER = 8;
const OFFSET_X = 4;

export class InventoryRenderer implements IRenderer {
  private posX: number;
  private posY: number;
  private inventoryMgr: InventoryManager;

  /**
   * 
   * @param posX X position to draw on the canvas
   * @param posY Y position to draw on the canvas
   * @param inventoryManager Instance of InventoryManager holding the inventory state from which to draw from
   */
  constructor(posX: number, posY: number, inventoryManager: InventoryManager) {
    this.posX = posX;
    this.posY = posY;
    this.inventoryMgr = inventoryManager;
  }

  draw(context: GameContext): void {
    // Don't render inventory when game is paused
    if (context.isPaused) {
      return;
    }

    const ctx = context.ctx;

    ctx.save();

    // Pixel panel design colors
    const bgFill = '#d9d9d9';
    const borderOuter = '#808080';
    const slotFill = '#808080';
    const selectedSlotFill = '#4d4d4d';
    const selectedSlotBorder = '#262626';

    // Get inventory state
    const inventory = this.inventoryMgr.getAllItems();
    const totalSize = this.inventoryMgr.getMaxItems();

    // Calculate panel width dynamically based on number of slots
    const panelWidth = (2 * OFFSET_X) + (totalSize * ITEM_SIDE_WIDTH) + ((totalSize - 1) * BUFFER);

    // Draw 50% opaque border/background around entire UI
    const padding = 8;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(
      this.posX - padding,
      this.posY - 24 - padding,
      panelWidth + padding * 2,
      PANELHEIGHT + 24 + padding * 2
    );

    // Draw Title Label
    ctx.font = 'bold 14px "Jersey-20", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'white';
    const title = 'Inventory';
    ctx.fillText(title, this.posX, this.posY - 8);

    // Get inventory sprites
    const itemSprite = ASSET_MANAGER.getImageAsset("items2");
    if (itemSprite === null) {
      throw new Error("Inventory Renderer: Failed to load spritesheet for items");
    }

    // Offset for items inside panel
    const offsetY = 4;

    // Get selected slot index
    const selectedSlot = this.inventoryMgr.getSlot();

    // Draw empty slots and contents
    ctx.lineWidth = 3;
    for (let s = 0; s < totalSize; s++) {
      const slotX = this.posX + OFFSET_X + (s * (ITEM_SIDE_WIDTH + BUFFER));
      const slotY = this.posY + offsetY;

      const isSelected = (s === selectedSlot);

      // Slot background
      ctx.fillStyle = isSelected ? selectedSlotFill : bgFill;
      ctx.fillRect(slotX, slotY, ITEM_SIDE_WIDTH, ITEM_SIDE_WIDTH);
      
      // Slot border
      ctx.strokeStyle = isSelected ? selectedSlotBorder : borderOuter;
      ctx.strokeRect(slotX, slotY, ITEM_SIDE_WIDTH, ITEM_SIDE_WIDTH);
    }

    let i = 0;
    inventory.forEach((value, key) => {
      const item = key;
      const itemMeta = getItemMetadata(item);
      const startX = this.posX + OFFSET_X + (i * (ITEM_SIDE_WIDTH + BUFFER));
      const startY = this.posY + offsetY;

      ctx.drawImage(
        itemSprite,
        itemMeta.spriteFrameX,
        itemMeta.spriteFrameY,
        ITEM_WIDTH,
        ITEM_HEIGHT,
        startX + 2,
        startY + 2,
        ITEM_SIDE_WIDTH - 4,
        ITEM_SIDE_WIDTH - 4
      );

      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px "Jersey-20", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(value.toString(), startX + ITEM_SIDE_WIDTH - 4, startY + ITEM_SIDE_WIDTH - 4);
      ctx.textAlign = 'left';

      i++;
    });

    ctx.restore();
  }
}