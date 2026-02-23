import { GameContext, IRenderer } from "../../classinterfaces.ts";
import { ASSET_MANAGER } from "../main.ts";
import { ITEM_HEIGHT, ITEM_WIDTH } from "./itemEntity.ts";
import { getItemMetadata } from "./itemTypes.ts";
import { Order } from "./order.ts";
import { OrderDeliveryLoop } from "./orderloopsys.ts";

const PANELWIDTH = 400;
const PANELHEIGHT = 80;
const ITEM_SIDE_LENGTH = 36;
const BUFFER = 4;

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

    // Draw active orders
    const currentOrder = activeOrders[0];
    if (currentOrder !== undefined && currentOrder !== null) {
      this.drawActiveOrder(ctx, currentOrder, itemSprite);
    }

    // Draw statistics
    ctx.fillStyle = "white";
    ctx.font = "14px Arial"
    ctx.fillText(
      "Shift quota: " + this.orderLoop.getTotalOrders(),
      this.posX + (PANELWIDTH - 96),
      this.posY + 16
    )
    ctx.fillText(
      "Total Waiting: " + activeOrders.length,
      this.posX + (PANELWIDTH - 108),
      this.posY + 32
    )
    ctx.fillText(
      "Fulfilled: " + this.orderLoop.getNumberOfDoneOrders(),
      this.posX + (PANELWIDTH - 76),
      this.posY + 48
    )

    ctx.fillStyle = "black";
    ctx.font = "bold 24px Arial"
    ctx.fillText(
      Math.ceil((this.orderLoop.getStartTime() + this.orderLoop.getLevelDuration()) - context.gameTime).toString(),
      this.posX + PANELWIDTH,
      this.posY + PANELHEIGHT - 48
    );

    ctx.restore();
  }

  private drawActiveOrder(ctx: CanvasRenderingContext2D, order: Order, itemSprite: HTMLImageElement) {
    const items = order.getAllItems();
    
    ctx.strokeStyle = 'rgba(240, 240, 240, 0.5)';
    ctx.strokeRect(
      this.posX + 8,
      this.posY + 32,
      Math.min(items.size * (ITEM_SIDE_LENGTH + BUFFER), PANELWIDTH - 48),
      PANELHEIGHT - 36
    );

    let i = 0;
    items.forEach((value, key) => {
      const item = key;
      const itemMeta = getItemMetadata(item);
      ctx.drawImage(
        itemSprite,
        itemMeta.spriteFrameX,
        itemMeta.spriteFrameY,
        ITEM_WIDTH,
        ITEM_HEIGHT,
        this.posX + 8 + ((i * (ITEM_SIDE_LENGTH + BUFFER)) + BUFFER),
        this.posY + 34,
        ITEM_SIDE_LENGTH,
        ITEM_SIDE_LENGTH
      );
      ctx.fillStyle = "white";
      ctx.font = "bold 18px Arial";
      ctx.fillText(
        value.toString(),
        this.posX + ((i * (ITEM_SIDE_LENGTH + BUFFER)) + BUFFER) + 20,
        this.posY + 36 + 20);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.strokeText(
        value.toString(),
        this.posX + ((i * (ITEM_SIDE_LENGTH + BUFFER)) + BUFFER) + 20,
        this.posY + 36 + 20);
      i++;
    })
  }

}