import { GameContext, IRenderer } from "../../classinterfaces.ts";
import { ASSET_MANAGER } from "../main.ts";
import { OrderDeliveryLoop } from "./orderloopsys.ts";

const PANELWIDTH = 400;
const PANELHEIGHT = 80;
const ITEM_SIDE_LENGTH = 36;

export class OrderDisplayRenderer implements IRenderer {
  private posX: number;
  private posY: number;
  private orderLoop: OrderDeliveryLoop;

  constructor(posX: number, posY: number, orderLoop: OrderDeliveryLoop) {
    this.posX = posX;
    this.posY = posY;
    this.orderLoop = orderLoop;
  }

  draw(context: GameContext): void {
    const ctx = context.ctx;
    ctx.save();

    // draw panels
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(this.posX, this.posY, PANELWIDTH, PANELHEIGHT);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.posX, this.posY, PANELWIDTH, PANELHEIGHT);

    // Draw title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Your Orders', this.posX + 10, this.posY + 25);

    // Get orders
    const activeOrders = this.orderLoop.getActiveOrders();

    // Get item sprites
    const itemSprite = ASSET_MANAGER.getImageAsset("items");
    if (itemSprite === null) {
      throw new Error("Order Display Renderer: Failed to load spritesheet for items");
    }

    

    ctx.restore();
  }

}