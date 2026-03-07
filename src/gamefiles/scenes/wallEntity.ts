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

// const NS_WALL_SIZE = new BasicSize(1280, 3, 5);
// const EW_WALL_SIZE = new BasicSize(3, 720, 5);

/**
 * Abstract base class for wall entities.
 * Extend this for each individual wall side.
 */
export class WallEntity extends Entity {
  protected wallBoundingBox: BoundingBox;

  constructor(pos: staticPositionComponent, width: number, height: number, scale: number) {
    super();
    const size = new BasicSize(width, height, scale);
    this.wallBoundingBox = new BoundingBox(pos, size, 0, 0);
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

// export class TopWallEntity extends WallEntity {
//   constructor() {
//     super(new staticPositionComponent({ x: 0, y: 0 }), NS_WALL_SIZE);
//   }
// }

// export class BottomWallEntity extends WallEntity {
//   constructor() {
//     super(new staticPositionComponent({ x: 0, y: 705 }), NS_WALL_SIZE);
//   }
// }

// export class LeftWallEntity extends WallEntity {
//   constructor() {
//     super(new staticPositionComponent({ x: 0, y: 0 }), EW_WALL_SIZE);
//   }
// }

// export class RightWallEntity extends WallEntity {
//   constructor() {
//     super(new staticPositionComponent({ x: 1265, y: 0 }), EW_WALL_SIZE);
//   }
// }
