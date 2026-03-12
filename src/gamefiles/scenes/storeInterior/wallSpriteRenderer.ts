import { GameContext, IPosition, IRenderer, ISize } from "../../../classinterfaces.ts";
import { BasicSize } from "../../../componentLibrary/BasicSize";
import { XY } from "../../../typeinterfaces";


export class WallSpriteRenderer implements IRenderer {
  private wallSprite: HTMLImageElement;
  private wallSXY: XY; // wall spritesheet x + y
  private wallPos: XY; // position to place wall
  private wallSize: BasicSize; // wall size
  private cornerSprite: HTMLImageElement | null;
  private cornerSXY: XY | null; // corner spritesheet x + y
  private cornerPos: XY | null; // position to place corner

  constructor(
    wallSprite: HTMLImageElement,
    wallSXY: XY, // wall spritesheet x + y
    wallPos: XY, // position to place wall
    wallSize: BasicSize, // wall size
    cornerSprite?: HTMLImageElement,
    cornerSXY?: XY, // corner spritesheet x + y
    cornerPos?: XY, // position to place corner
  ) {
    /* Initialize wall variables */
    this.wallSprite = wallSprite;
    this.wallSXY = wallSXY;
    this.wallPos = wallPos;
    this.wallSize = wallSize;

    /* Initialize corner variables (if applicable) */
    this.cornerSprite = cornerSprite ?? null;
    this.cornerSXY = cornerSXY ?? null;
    this.cornerPos = cornerPos ?? null;
  }

  // extend the functionality of draw to be able to draw hint text
  public draw(context: GameContext): void {
    context.ctx.drawImage(
      this.wallSprite,
      this.wallSXY.x, this.wallSXY.y,
      this.wallSize.getWidth(), this.wallSize.getWidth(),
      this.wallPos.x, this.wallPos.y,
      this.wallSize.getWidth() * this.wallSize.getScale(), this.wallSize.getWidth() * this.wallSize.getScale()
    )
    if (this.cornerSprite && this.cornerSXY && this.cornerPos) {
      context.ctx.drawImage(
        this.cornerSprite,
        this.cornerSXY.x, this.cornerSXY.y,
        5, 5,
        this.cornerPos.x, this.cornerPos.y,
        5 * this.wallSize.getScale(), 5 * this.wallSize.getScale()
      )
    }
    context.ctx.restore();
  }
}