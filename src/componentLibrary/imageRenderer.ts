import { GameContext, IRenderer, IPosition, ISize } from "../classinterfaces.ts";

/**
 * Simple image renderer component that draws an image at the entity's position
 * @author Preston Sia
 */
export class ImageRenderer implements IRenderer {
  private image: HTMLImageElement;
  private positionComponent: IPosition;
  private sizeComponent: ISize | null;

  constructor(image: HTMLImageElement, positionComponent: IPosition, sizeComponent: ISize | null = null) {
    this.image = image;
    this.positionComponent = positionComponent;
    this.sizeComponent = sizeComponent;
  }

  public draw(context: GameContext): void {
    const pos = this.positionComponent.getPosition();
    
    if (this.sizeComponent) {
      const width = this.sizeComponent.getWidth();
      const height = this.sizeComponent.getHeight();
      context.ctx.drawImage(this.image, pos.x, pos.y, width, height);
    } else {
      // Draw with natural image size
      context.ctx.drawImage(this.image, pos.x, pos.y);
    }
  }
}
