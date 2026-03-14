import { IRenderer, GameContext } from "../../../classinterfaces.ts";
import { XY } from "../../../typeinterfaces.ts";
import { BasicSize } from "../../../componentLibrary/BasicSize.ts";

export class WallSpriteRenderer implements IRenderer {
  private wallSprite: HTMLImageElement;
  private wallSXY: XY; // wall spritesheet x + y
  private wallSSize: BasicSize; // wall sprite size
  private wallPos: XY; // position to place wall
  private wallSize: BasicSize; // wall destination size
  private cornerSprite: HTMLImageElement | null;
  private cornerSXY: XY | null; // corner spritesheet x + y
  private cornerPos: XY | null; // position to place corner

  constructor(
    wallSprite: HTMLImageElement,
    wallSXY: XY, // wall spritesheet x + y
    wallSSize: BasicSize, // wall sprite size
    wallPos: XY, // position to place wall
    wallSize: BasicSize, // wall destination size
    cornerSprite?: HTMLImageElement,
    cornerSXY?: XY, // corn er spritesheet x + y
    cornerPos?: XY, // position to place corner
  ) {
    /* Initialize wall variables */
    this.wallSprite = wallSprite;
    this.wallSXY = wallSXY;
    this.wallSSize = wallSSize;
    this.wallPos = wallPos;
    this.wallSize = wallSize;

    /* Initialize corner variables (if applicable) */
    this.cornerSprite = cornerSprite ?? null;
    this.cornerSXY = cornerSXY ?? null;
    this.cornerPos = cornerPos ?? null;
  }

  public draw(context: GameContext): void {
    context.ctx.drawImage(
      this.wallSprite,
      this.wallSXY.x, this.wallSXY.y,
      this.wallSSize.getWidth(), this.wallSSize.getHeight(),
      this.wallPos.x, this.wallPos.y,
      this.wallSize.getWidth(), this.wallSize.getHeight()
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
  }
}