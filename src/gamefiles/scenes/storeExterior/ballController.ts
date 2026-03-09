import { GameContext } from "../../../classinterfaces.ts";
import { BasicSize } from "../../../componentLibrary/BasicSize.ts";
import { BoundingBox } from "../../../componentLibrary/boundingBox.ts";
import { staticPositionComponent } from "../../../componentLibrary/staticPositionComponent.ts";
import { StaticSpriteRenderer } from "../../../componentLibrary/staticSpriteRenderer.ts";
import { Entity } from "../../../entity.ts";
import { XY } from "../../../typeinterfaces.ts";
import { ASSET_MANAGER } from "../../main.ts";

/**
 * Ball entity for store exterior to deal with player collision
 * @author Emma Szebenyi
 */
export class Ball extends Entity {
  protected ballBoundingBox: BoundingBox;

  constructor(
    pos: staticPositionComponent
  ) {
    super();
    const ballSize = new BasicSize(80, 40, 1);
    this.ballBoundingBox = new BoundingBox(pos, ballSize, 0, 0);

    super.addComponent(pos);
    super.addComponent(this.ballBoundingBox);
  }
  
  override draw(context: GameContext): void {
    if (context.debug) {
      context.ctx.save();
      context.ctx.strokeStyle = "#ff0000";
      context.ctx.strokeRect(
        this.ballBoundingBox.getLeft(),
        this.ballBoundingBox.getTop(),
        this.ballBoundingBox.getRight() - this.ballBoundingBox.getLeft(),
        this.ballBoundingBox.getBottom() - this.ballBoundingBox.getTop()
      );
      context.ctx.restore();
    }
  }
}