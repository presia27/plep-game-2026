import { GameContext, IRenderer } from "../../classinterfaces.ts";
import { ASSET_MANAGER } from "../main.ts";
import { ITEM_HEIGHT, ITEM_WIDTH } from "./itemEntity.ts";
import { getItemMetadata } from "./itemTypes.ts";
import { Order } from "./order.ts";
import { OrderDeliveryLoop } from "./orderloopsys.ts";

const PANELHEIGHT = 80;
const ITEM_SIDE_LENGTH = 50;
const BUFFER = 8;
const OFFSET_X = 4;
const MIN_ITEM_DISPLAY_CAPACITY = 5;

export class OrderDisplayRenderer implements IRenderer {
  private posY: number;
  private orderLoop: OrderDeliveryLoop;
  private getLevelNumber: () => number;
  private rightMargin: number; // Distance from right edge of canvas

  constructor(x: number, y: number, orderLoop: OrderDeliveryLoop, getLevelNumber: () => number) {
    // Note: x parameter is ignored; panel is right-aligned with fixed margin
    this.posY = y;
    this.orderLoop = orderLoop;
    this.getLevelNumber = getLevelNumber;
    this.rightMargin = 30;
  }

  draw(context: GameContext): void {
    const ctx = context.ctx;
    ctx.save();

    // Pixel panel design colors
    const bgFill = '#d9d9d9';
    const borderOuter = '#808080';
    const slotFill = '#d9d9d9';
    const completedBorder = '#00ff00'; // green for completed items
    const incompleteBorder = '#808080'; // grey for incomplete items
    const overcountBorder = '#ff0000'; // Red for items over count

    // Get orders
    const activeOrders = this.orderLoop.getActiveOrders();
    const currentOrderNum = this.orderLoop.getNumberOfDoneOrders();
    const totalOrders = this.orderLoop.getTotalOrders();

    // Calculate panel width based on number of items in current order
    const currentOrder = activeOrders[0];
    // const numItems = currentOrder ? currentOrder.getAllItems().size : 3; // default to 3 if no order
    const numItems =  Math.max(currentOrder ? currentOrder.getAllItems().size : 0, MIN_ITEM_DISPLAY_CAPACITY); // calculate size to hold X items
    const panelWidth = (2 * OFFSET_X) + (numItems * ITEM_SIDE_LENGTH) + ((numItems - 1) * BUFFER);

    // Calculate position to right-align the panel
    const posX = ctx.canvas.width - panelWidth - this.rightMargin;

    // Draw 50% opaque border/background around entire UI
    const padding = 8;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(
      posX - padding,
      this.posY - 24 - padding,
      panelWidth + padding * 2,
      PANELHEIGHT + 24 + padding * 2
    );

    // Draw "Night X" on the left
    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'white';
    const nightTitle = 'Night ' + this.getLevelNumber();
    ctx.fillText(nightTitle, posX, this.posY - 8);

    // Draw "Order X / Y" on the right
    ctx.textAlign = 'right';
    const orderTitle = 'Shift Quota ' + currentOrderNum + ' / ' + totalOrders;
    ctx.fillText(orderTitle, posX + panelWidth, this.posY - 8);

    // Get item sprites
    const itemSprite = ASSET_MANAGER.getImageAsset("items2");
    if (itemSprite === null) {
      throw new Error("Order Display Renderer: Failed to load spritesheet for items");
    }

    // Draw active orders
    if (currentOrder !== undefined && currentOrder !== null) {
      this.drawActiveOrder(ctx, posX, currentOrder, itemSprite, bgFill, borderOuter, slotFill, completedBorder, incompleteBorder, overcountBorder);
    }

    ctx.restore();
  }

  private drawActiveOrder(
    ctx: CanvasRenderingContext2D,
    posX: number, order: Order,
    itemSprite: HTMLImageElement,
    bgFill: string,
    borderOuter: string,
    slotFill: string,
    completedBorder: string,
    incompleteBorder: string,
    overcountBorder: string
  ) {
    const items = order.getAllItems();

    let i = 0;
    const offsetY = 4;

    items.forEach((value, key) => {
      const item = key;
      const itemMeta = getItemMetadata(item);

      const startX = posX + OFFSET_X + (i * (ITEM_SIDE_LENGTH + BUFFER));
      const startY = this.posY + offsetY;

      // Determine if item is completed
      const orderProgress = this.orderLoop.getOrderStatus();
      const orderItem = orderProgress.get(item);
      const isCompleted = orderItem && orderItem === value;
      const isOverCount = orderItem && orderItem > value;

      // Draw slot background
      ctx.fillStyle = slotFill;
      ctx.fillRect(startX, startY, ITEM_SIDE_LENGTH, ITEM_SIDE_LENGTH);
      
      // Draw slot border (green if completed, grey if not)
      ctx.lineWidth = 3;
      //ctx.strokeStyle = isCompleted ? completedBorder : incompleteBorder;
      if (isCompleted) {
        ctx.strokeStyle = completedBorder;
      } else if (isOverCount) {
        ctx.strokeStyle = overcountBorder;
      } else {
        ctx.strokeStyle = incompleteBorder;
      }
      ctx.strokeRect(startX, startY, ITEM_SIDE_LENGTH, ITEM_SIDE_LENGTH);

      // Draw item sprite
      ctx.drawImage(
        itemSprite,
        itemMeta.spriteFrameX,
        itemMeta.spriteFrameY,
        ITEM_WIDTH,
        ITEM_HEIGHT,
        startX + 2,
        startY + 2,
        ITEM_SIDE_LENGTH - 4,
        ITEM_SIDE_LENGTH - 4
      );

      // Draw item quantity
      ctx.fillStyle = "black";
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(
        value.toString(),
        startX + ITEM_SIDE_LENGTH - 4,
        startY + ITEM_SIDE_LENGTH - 4
      );
      ctx.textAlign = 'left';

      i++; // increment counter
    });
  }

}