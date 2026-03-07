import { GameContext, IRenderer, IPosition, ISize } from "../classinterfaces.ts";
import { BoundingBox } from "./boundingBox.ts";

/**
 * Static sprite renderer component that draws an image at the entity's position with a specified starting point on the sprite sheet
 * @author Preston Sia, Emma Szebenyi
 */
export class StaticSpriteRenderer implements IRenderer {
  protected image: HTMLImageElement;
  protected xStart: number;
  protected yStart: number;
  protected spriteWidth: number;
  protected spriteHeight: number;
  positionComponent: IPosition;
  sizeComponent: ISize;
  protected boundingBox: BoundingBox | null;

  /**
   * 
   * @param image HTML Image
   * @param spriteXstart Starting x coordinate on the spritesheet
   * @param spriteYstart Starting y coordinate on the spritesheet
   * @param spriteWidth Starting x coordinate on the spritesheet
   * @param spriteHeight Starting y coordinate on the spritesheet
   * @param sizeComponent Width, height, and scale for drawing the sprite
   * @param positionComponent The position component to place the sprite on the canvas
   */
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
  
  public draw(context: GameContext): void {
    const pos = this.positionComponent.getPosition();
    const width = this.sizeComponent.getWidth();
    const height = this.sizeComponent.getHeight();
    // drawImage takes the following parameters:
    // spritesheet, 
    // spriteX, spriteY, spriteWidth, spriteHeight, 
    // destinationX, destinationY, destinationWidth, destinationHeight
    context.ctx.drawImage(
      this.image,
      this.xStart,
      this.yStart,
      this.spriteWidth,
      this.spriteHeight,
      pos.x,
      pos.y,
      width,
      height
    );

    if (context.debug) {
      context.ctx.save();

      // draw the full extent of the entity
      context.ctx.strokeStyle = "#0000cd";
      context.ctx.strokeRect(
        this.positionComponent.getPosition().x,
        this.positionComponent.getPosition().y,
        width,
        height,
      );

      // draw bounding box
      context.ctx.strokeStyle = "#ff0000";
      if (this.boundingBox) {
        context.ctx.strokeRect(
          this.boundingBox.getLeft(),
          this.boundingBox.getTop(),
          this.boundingBox.getRight() - this.boundingBox.getLeft(),
          this.boundingBox.getBottom() - this.boundingBox.getTop()
        )
      }
      context.ctx.restore();
    }
    
  } 
}
