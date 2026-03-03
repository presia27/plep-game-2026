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
import { staticPositionComponent } from "../../componentLibrary/staticPositionComponent.ts";

export class UpdatePoint extends Entity {
  private updatePoints: XY[];
  constructor (
    updatePoints: XY[]
  ) {
    super();

    this.updatePoints = updatePoints;
    const updatePointBBSize = new BasicSize (10, 10, 5);

    for (const point of this.updatePoints) {
      let pointPosition = new staticPositionComponent({x: point.x, y: point.y});
      let updatePointBB = new BoundingBox(pointPosition, updatePointBBSize);
      super.addComponent(updatePointBB);
    }
  }
}