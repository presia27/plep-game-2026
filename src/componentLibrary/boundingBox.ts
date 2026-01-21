import { GameContext, IComponent, IPosition, ISize } from "../classinterfaces.ts";

/**
 * 
 */
export class BoundingBox implements IComponent {
  private positionMgr: IPosition;
  private sizeMgr: ISize;
  private left: number;
  private top: number;
  private right: number;
  private bottom: number;

  /**
   * 
   * @param x Initial X coordinate
   * @param y Initial Y coordinate
   * @param width Initial width
   * @param height Initial height
   * @param positionMgr Component that holds the current X-Y position of an entity
   */
  constructor(positionMgr: IPosition, sizeMgr: ISize) {
   this.left = positionMgr.getPosition().x;
   this.top = positionMgr.getPosition().y;
   this.right = this.left + sizeMgr.getWidth();
   this.bottom = this.top + sizeMgr.getHeight(); 
   this.positionMgr = positionMgr;
   this.sizeMgr = sizeMgr;
  }

  public update(context: GameContext): void {
    this.left = this.positionMgr.getPosition().x;
    this.top = this.positionMgr.getPosition().y;
    this.right = this.left + this.sizeMgr.getWidth();
    this.bottom = this.top + this.sizeMgr.getHeight();
  }

  public getLeft(): number {
    return this.left;
  }

  public getTop(): number {
    return this.top;
  }

  public getRight(): number {
    return this.right;
  }

  public getBottom(): number {
    return this.bottom;
  }

  public collide(oth: BoundingBox) {
    if (this.right > oth.getLeft() && this.left < oth.getRight()
      && this.top < oth.getBottom() && this.bottom > oth.getTop()) {
        return true;
    }
    return false;
  }
}
