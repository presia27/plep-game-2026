import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { BasicSize } from "../../componentLibrary/BasicSize.ts";
import { MovementComponent } from "../../componentLibrary/movementComponent.ts";
import { Entity } from "../../entity.ts";
import SceneManager from "../../sceneManager.ts";
import { GameContext } from "../../classinterfaces.ts";
import { XY } from "../../typeinterfaces.ts";
import { AbstractCollisionHandler } from "../../componentLibrary/AbstractCollisionHandler.ts";
import { DoorTriggerCollisionHandler } from "./doorTriggerCollisionHandler.ts";
import { staticPositionComponent } from "../../componentLibrary/staticPositionComponent.ts";
import { StaticSpriteRenderer } from "../../componentLibrary/staticSpriteRenderer.ts";
import { ASSET_MANAGER } from "../main.ts";

const SCALE: number = 3;
const SY: number = 1;

/**
 * Abstract base class for wall entities.
 * Extend this for each individual wall side.
 */
export class WallEntity extends Entity {
  protected wallBoundingBox: BoundingBox;
  
  // sx, sw, sh values to be used when implementing sprites later on
  
  constructor(pos: staticPositionComponent, width: number, height: number) {
    super();
    const size = new BasicSize(width, height, SCALE);
    this.wallBoundingBox = new BoundingBox(pos, size, 0, 0) ;
    super.addComponent(pos);
    super.addComponent(this.wallBoundingBox);
  }
  
  override draw(context: GameContext): void {
    super.draw(context);
    if (context.debug) {
      context.ctx.save();
      context.ctx.strokeStyle = "#197d61";
      context.ctx.strokeRect(
        this.wallBoundingBox.getLeft(),
        this.wallBoundingBox.getTop(),
        this.wallBoundingBox.getRight() - this.wallBoundingBox.getLeft(),
        this.wallBoundingBox.getBottom() - this.wallBoundingBox.getTop()
      );
      context.ctx.restore();
    }
  }
}
