import { Animator } from "../../../animator.ts";
import { GameContext, IPosition, IRenderer, ISize } from "../../../classinterfaces.ts";
import { BoundingBox } from "../../../componentLibrary/boundingBox.ts";
import { StaticSpriteRenderer } from "../../../componentLibrary/staticSpriteRenderer.ts";
import { VehicleMovementSys } from "./vehicleMovementSystem.ts";

export class VehicleRender implements IRenderer {
  //private animation: Animator;
  private sprite: HTMLImageElement;
  private sx: number;
  private sy: number;
  private sw: number;
  private sh: number;
  private pos: IPosition;
  private size: ISize;
  private bBox?: BoundingBox | null;

  constructor(
    spritesheet: HTMLImageElement,
    spriteXstart: number,
    spriteYstart: number,
    spriteWidth: number,
    spriteHeight: number,
    positionComponent: IPosition,
    sizeComponent: ISize,
    boundingBox?: BoundingBox | null
  ) {
    this.sprite = spritesheet;
    this.sx = spriteXstart;
    this.sy = spriteYstart;
    this.sw = spriteWidth;
    this.sh = spriteHeight;
    this.pos = positionComponent;
    this.size = sizeComponent;
    this.bBox = boundingBox ?? null;
  }

  /**
   * Change what is rendered based on passed values
   * 
   * @param sx starting x on spritesheet 
   * @param sy starting y on spritesheet
   * @param sw sprite width
   * @param sh sprite height
   * @param size size of entity
   * @param bBox size of bounding box (if applicable)
   */
  public setSprite(sx: number, sy: number, sw: number, sh: number, size: ISize, bBox?: BoundingBox | null ) {
    this.sx = sx;
    this.sy = sy;
    this.sw = sw;
    this.sh = sh;
    this.size = size;
    this.bBox = bBox ?? null;
  }

  // extend the functionality of draw to be able to draw hint text
  public draw(context: GameContext): void {
    const pos = this.pos.getPosition();
    context.ctx.drawImage(
      this.sprite,
      this.sx, this.sy,
      this.sw, this.sh,
      this.pos.getPosition().x, this.pos.getPosition().y,
      this.size.getWidth(), this.size.getHeight()
    )
    if (context.debug) {
      context.ctx.save();

      // draw the full extent of the entity
      context.ctx.strokeStyle = "#0000cd";
      context.ctx.strokeRect(
        this.pos.getPosition().x,
        this.pos.getPosition().y,
        this.size.getWidth(),
        this.size.getHeight(),
      );

      // draw bounding box
      context.ctx.strokeStyle = "#ff0000";
      if (this.bBox) {
        context.ctx.strokeRect(
          this.bBox.getLeft(),
          this.bBox.getTop(),
          this.bBox.getRight() - this.bBox.getLeft(),
          this.bBox.getBottom() - this.bBox.getTop()
        )
      }
      context.ctx.restore();
    }
  }

}