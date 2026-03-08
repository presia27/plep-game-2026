import { GameContext } from "../../../classinterfaces.ts";
import { BasicSize } from "../../../componentLibrary/BasicSize.ts";
import { BoundingBox } from "../../../componentLibrary/boundingBox.ts";
import { staticPositionComponent } from "../../../componentLibrary/staticPositionComponent.ts";
import { StaticSpriteRenderer } from "../../../componentLibrary/staticSpriteRenderer.ts";
import { Entity } from "../../../entity.ts";
import { XY } from "../../../typeinterfaces.ts";
import { ASSET_MANAGER } from "../../main.ts";

/**
 * Bush entity for store exterior to deal with player collision
 * @author Emma Szebenyi
 */
export class Bush extends Entity {
  private bushBoundingBox: BoundingBox;
  /**
   * Creates a bush entity for the store exterior 
   */
  constructor(
  ) {
    super();

    /** Add bush bounding box */
    const bushPos = new staticPositionComponent({ x: 410, y: 487 });
    const bushSize = new BasicSize(470, 60, 1);
    this.bushBoundingBox = new BoundingBox(bushPos, bushSize);

    super.addComponent(bushPos);
    super.addComponent(this.bushBoundingBox);
  }

  override draw(context: GameContext): void {
    if (context.debug) {
      context.ctx.save();

      // draw bounding box
      context.ctx.strokeStyle = "#ff0000";
      if (this.bushBoundingBox) {
        context.ctx.strokeRect(
          this.bushBoundingBox.getLeft(),
          this.bushBoundingBox.getTop(),
          this.bushBoundingBox.getRight() - this.bushBoundingBox.getLeft(),
          this.bushBoundingBox.getBottom() - this.bushBoundingBox.getTop()
        )
      }
      context.ctx.restore();
    }
  }
}