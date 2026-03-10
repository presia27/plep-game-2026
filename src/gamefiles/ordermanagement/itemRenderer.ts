import { GameContext, IPosition, IRenderer, ISize } from "../../classinterfaces.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { StaticSpriteRenderer } from "../../componentLibrary/staticSpriteRenderer.ts";
import { OrderDeliveryLoop } from "./orderloopsys.ts";

export class ItemRenderer implements IRenderer{
  private image: HTMLImageElement;
  private xStart: number;
  private yStart: number;
  private spriteWidth: number;
  private spriteHeight: number;
  positionComponent: IPosition;
  sizeComponent: ISize;
  private boundingBox: BoundingBox | null;

  private showHintText = false;
  private pulseEnable = false;
  private pulseTimer: number = 0;

  constructor(
    image: HTMLImageElement,
    spriteXstart: number,
    spriteYstart: number,
    spriteWidth: number,
    spriteHeight: number,
    positionComponent: IPosition,
    sizeComponent: ISize,
    boundingBox?: BoundingBox | null
  ) {
    this.image = image;
    this.xStart = spriteXstart;
    this.yStart = spriteYstart;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.sizeComponent = sizeComponent;
    this.positionComponent = positionComponent;
    this.boundingBox = boundingBox ?? null;
  }

  public enableHintText(): void {
    this.showHintText = true;
  }

  public setPulsing(state: boolean): void {
    this.pulseEnable = state;
  }

  // private isItemNeeded(): boolean {
  //   if (!this.orderLoop) return false;
    
  //   const currentOrder = this.orderLoop.getCurrentActiveOrder();
  //   if (!currentOrder) return false;
    
  //   return currentOrder.hasItem(this.itemType);
  // }

  // extend the functionality of draw to be able to draw hint text
  public draw(context: GameContext): void {
    const ctx = context.ctx;
    const pos = this.positionComponent.getPosition();
    const width = this.sizeComponent.getWidth();
    const height = this.sizeComponent.getHeight();

    // Update pulse timer
    if (this.pulseEnable) {
      this.pulseTimer += context.clockTick * 3; // Speed of pulsing
    }

    // Calculate scale with pulsing effect
    let scaleMultiplier = 1.0;
    if (this.pulseEnable) {
      // Pulse between 1.0 and 1.15 scale
      scaleMultiplier = 1.0 + Math.sin(this.pulseTimer) * 0.15;
    }

    // Calculate scaled dimensions
    const scaledWidth = width * scaleMultiplier;
    const scaledHeight = height * scaleMultiplier;
    const offsetX = (scaledWidth - width) / 2;
    const offsetY = (scaledHeight - height) / 2;

    // Draw the item with scaling
    ctx.drawImage(
      this.image,
      this.xStart,
      this.yStart,
      this.spriteWidth,
      this.spriteHeight,
      pos.x - offsetX,
      pos.y - offsetY,
      scaledWidth,
      scaledHeight
    );

    // Draw bounding box in debug mode
    if (context.debug) {
      ctx.save();
      ctx.strokeStyle = "#0000cd";
      ctx.strokeRect(
        this.positionComponent.getPosition().x,
        this.positionComponent.getPosition().y,
        width,
        height,
      );
      if (this.boundingBox) {
        ctx.strokeStyle = "#FF0000";
        const bbLeft = this.boundingBox.getLeft();
        const bbTop = this.boundingBox.getTop();
        const bbRight = this.boundingBox.getRight();
        const bbBottom = this.boundingBox.getBottom();
        ctx.strokeRect(
          bbLeft,
          bbTop,
          bbRight - bbLeft,
          bbBottom - bbTop
        );
      }
      ctx.restore();
    }

    // Show hint text
    if (this.showHintText) {
      const positionX = this.positionComponent.getPosition().x + (this.sizeComponent.getWidth() / 2);
      const positionY = this.positionComponent.getPosition().y - 8;

      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = '#000000'
      ctx.fillText("E TO PICKUP", positionX, positionY);
      ctx.restore()

      // Once everything is drawn, reset temporary state used when a collision occurs
      this.showHintText = false;
    }
    
  }
}