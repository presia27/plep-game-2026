import { GameContext, IRenderer, IPosition, ISize } from "../../classinterfaces.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";

/**
 * Update point renderer component that draws the update point and its bounding box at the specified location
 * @author Emma Szebenyi
 */
export class UpdatePointRenderer implements IRenderer {
  private positionComponent: IPosition;
  private boundingBox: BoundingBox | null;

  /**
   * @param positionComponent The position component to place the sprite on the canvas
   * @param sizeComponent Width, height, and scale for drawing the thing to draw
   */
  constructor(
    positionComponent: IPosition,
    boundingBox?: BoundingBox | null
  ) {
    this.positionComponent = positionComponent;
    this.boundingBox = boundingBox ?? null;
  }
  
  public draw(context: GameContext): void {
    const pos = this.positionComponent.getPosition();
    if (context.debug) {
      context.ctx.save();

      // draw the full extent of the entity
      context.ctx.strokeStyle = "#e30282";
      context.ctx.strokeRect(
        this.positionComponent.getPosition().x,
        this.positionComponent.getPosition().y,
        1,
        1
      );
      // Draw points
      context.ctx.fillStyle = 'gray';
      context.ctx.font = 'bold 8px Arial';
      context.ctx.fillText('Boss Satisfaction', this.positionComponent.getPosition().x + 5, this.positionComponent.getPosition().x + 5);


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
