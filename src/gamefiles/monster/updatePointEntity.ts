import AssetManager from "../../assetmanager.ts";
import { BasicSize } from "../../componentLibrary/BasicSize.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { MovementComponent } from "../../componentLibrary/movementComponent.ts";
import { Entity } from "../../entity.ts";
import { XY } from "../../typeinterfaces.ts";
import { MonsterSpriteRenderer } from "./monsterSpriteRenderer.ts";
import { MonsterCollisionHandler } from "./monsterCollisionHandler.ts";
import { MonsterMovementSystem } from "./monsterMovementSystem.ts";
import { IPosition } from "../../classinterfaces.ts";
import { GameContext } from "../../classinterfaces.ts";
import { staticPositionComponent } from "../../componentLibrary/staticPositionComponent.ts";

/**
 * Update point class for monster entity to determine when the monster is allowed to change direction.
 * Handles spawning of these points and detection of monster collision.
 * 
 * @author Emma Szebenyi
 */
export class UpdatePoint extends Entity {
  private updatePoint: XY;
  private updatePointBB: BoundingBox;

  /**
   * A point on the canvas where the monster is allowed to change direction
   * 
   * @param updatePoint A point on the canvas where the monster is allowed to change direction
   */
  constructor(
    updatePoint: XY
  ) {
    super();

    this.updatePoint = updatePoint;

    // create static position component for bounding box + for entity
    const pointPosition = new staticPositionComponent({ x: updatePoint.x, y: updatePoint.y });
    // set size + scale of bounding box
    const updatePointBBSize = new BasicSize(5, 5, 5);
    // instantiate bounding box
    this.updatePointBB = new BoundingBox(pointPosition, updatePointBBSize);

    // NOTE: not sure if i should add this.updatePoint or pointPosition, since they seem to be the same thing to me.. but apparently theyre not
    super.addComponent(pointPosition);
    super.addComponent(this.updatePointBB);
  }

  public getPosition(): XY {
    return this.updatePoint;
  }

  override draw(context: GameContext): void {
    if (context.debug) {
      context.ctx.save();

      // draw the full extent of the entity
      context.ctx.strokeStyle = "#e30282";
      context.ctx.strokeRect(
        this.updatePoint.x - context.cameraPosition.x,
        this.updatePoint.y - context.cameraPosition.y,
        2,
        2
      );

      // draw bounding box
      context.ctx.strokeStyle = "#197d61";
      if (this.updatePointBB) {
        context.ctx.strokeRect(
          this.updatePointBB.getLeft() - context.cameraPosition.x,
          this.updatePointBB.getTop() - context.cameraPosition.y,
          this.updatePointBB.getRight() - this.updatePointBB.getLeft(),
          this.updatePointBB.getBottom() - this.updatePointBB.getTop()
        )
      }
      context.ctx.restore();
    }
  }
}
