import { GameContext, IPosition, ISize } from "../../classinterfaces.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { StaticSpriteRenderer } from "../../componentLibrary/staticSpriteRenderer.ts";

export class ItemRenderer extends StaticSpriteRenderer {
  private showHintText = false;

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
    super(
      image,
      spriteXstart,
      spriteYstart,
      spriteWidth,
      spriteHeight,
      positionComponent,
      sizeComponent,
      boundingBox
    );
  }

  public enableHintText(): void {
    this.showHintText = true;
  }

  // extend the functionality of draw to be able to draw hint text
  public override draw(context: GameContext): void {
    super.draw(context);

    if (this.showHintText) {
      const ctx = context.ctx;

      const positionX = this.positionComponent.getPosition().x + (this.sizeComponent.getWidth() / 2);
      const positionY = this.positionComponent.getPosition().y - 8;

      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = '#000000'
      ctx.fillText("PRESS E TO PICKUP", positionX - context.cameraPosition.x, positionY  - context.cameraPosition.y);
      ctx.restore()

      // Once everything is drawn, reset temporary state used when a collision occurs
      this.showHintText = false;
    }
    
  }
}