import { GameContext, IRenderer } from "../../classinterfaces.ts";
import { InventoryManager } from "./inventoryManager.ts";

const PANELWIDTH = 600;
const PANELHEIGHT = 80;

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
    const ctx = context.ctx;

    // Draw background panel
    const panelWidth = 200;
    const panelHeight = 80;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(this.posX, this.posY, panelWidth, panelHeight);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.posX, this.posY, panelWidth, panelHeight);

    // Draw title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Inventory', this.posX + 10, this.posY + 25);

    // Get inventory state
    const inventory = this.inventoryMgr.getAllItems();
    const totalSize = this.inventoryMgr.getMaxItems();

    
  }
}