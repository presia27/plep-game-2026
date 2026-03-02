import { GameContext, IRenderer } from "../../classinterfaces.ts";
import { ASSET_MANAGER } from "../main.ts";
import { getItemMetadata } from "../ordermanagement/itemTypes.ts";
import { InventoryManager } from "./inventoryManager.ts";
import { ITEM_WIDTH, ITEM_HEIGHT } from "../ordermanagement/itemEntity.ts";
import { InventorySelectorComponent } from "./inventorySelectorComponent.ts";

const PANELWIDTH = 400;
const PANELHEIGHT = 80;
const ITEM_SIDE_WIDTH = 36;
const BUFFER = 4;

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
  constructor(posX: number, posY: number, inventoryManager: InventoryManager, selectorComponent: InventorySelectorComponent) {
    this.posX = posX;
    this.posY = posY;
    this.inventoryMgr = inventoryManager;
  }

  draw(context: GameContext): void {
    const ctx = context.ctx;

    ctx.save();

    // Draw background panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(this.posX, this.posY, PANELWIDTH, PANELHEIGHT);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.posX, this.posY, PANELWIDTH, PANELHEIGHT);

    // Draw title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Inventory', this.posX + 10, this.posY + 25);

    // Get inventory state
    const inventory = this.inventoryMgr.getAllItems();
    const totalSize = this.inventoryMgr.getMaxItems();

    // Get inventory sprites
    const itemSprite = ASSET_MANAGER.getImageAsset("items");
    if (itemSprite === null) {
      throw new Error("Inventory Renderer: Failed to load spritesheet for items");
    }

    // old implementation using array, changed to Map
    /*for (let i = 0; i < inventory.length; i++) {
      const item = inventory[i];
      if (item === null || item === undefined) continue;
      const itemMeta = getItemMetadata(item);
      ctx.drawImage(
        itemSprite,
        itemMeta.spriteFrameX,
        itemMeta.spriteFrameY,
        ITEM_WIDTH,
        ITEM_HEIGHT,
        this.posX + ((i * (ITEM_SIDE_WIDTH + BUFFER)) + BUFFER),
        this.posY + 36,
        ITEM_SIDE_WIDTH,
        ITEM_SIDE_WIDTH
      );
    }*/

    let i = 0;
    inventory.forEach((value, key) => {
      const item = key;
      const itemMeta = getItemMetadata(item);
      ctx.drawImage(
        itemSprite,
        itemMeta.spriteFrameX,
        itemMeta.spriteFrameY,
        ITEM_WIDTH,
        ITEM_HEIGHT,
        this.posX + ((i * (ITEM_SIDE_WIDTH + BUFFER)) + BUFFER),
        this.posY + 36,
        ITEM_SIDE_WIDTH,
        ITEM_SIDE_WIDTH
      );
      ctx.fillText(value.toString(), this.posX + ((i * (ITEM_SIDE_WIDTH + BUFFER)) + BUFFER) + 20, this.posY + 36 + 20);
      i++;
    });

    ctx.strokeStyle = "white";
    ctx.strokeRect(
      this.posX + ((this.inventoryMgr.getSlot() * (ITEM_SIDE_WIDTH + BUFFER)) + BUFFER),
      this.posY + 36,
      ITEM_SIDE_WIDTH,
      ITEM_SIDE_WIDTH
    );

    ctx.restore();
  }
}