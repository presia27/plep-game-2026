import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { BasicSize } from "../../componentLibrary/BasicSize.ts";
import { MovementComponent } from "../../componentLibrary/movementComponent.ts";
import { Entity } from "../../entity.ts";
import SceneManager from "../../sceneManager.ts";
import { GameContext } from "../../classinterfaces.ts";
import { XY } from "../../typeinterfaces.ts";


///revise///

/**
 * An invisible trigger zone placed at a doorway.
 * When the player's bounding box overlaps this trigger,
 * the SceneManager is told to load the target scene.
 *
 * Place these at doorways in each room via getDoorTriggers()
 * in your BaseRoomScene subclass.
 *
 * @author Luke Willis, Claude Sonnet 4.5
 */
export class DoorTrigger extends Entity {
  private boundingBox: BoundingBox;
  private targetSceneId: string;
  private sceneManager: SceneManager;
  private playerBoundingBox: BoundingBox;

  constructor(
    position: XY,
    size: XY,
    targetSceneId: string,
    sceneManager: SceneManager,
    playerBoundingBox: BoundingBox
  ) {
    super();
    this.targetSceneId = targetSceneId;
    this.sceneManager = sceneManager;
    this.playerBoundingBox = playerBoundingBox;

    // invisible trigger zone — no renderer needed
    const movement = new MovementComponent(position);
    const boundSize = new BasicSize(size.x, size.y, 1);
    this.boundingBox = new BoundingBox(movement, boundSize, 0, 0);

    super.addComponent(movement);
    super.addComponent(this.boundingBox);
  }

  update(context: GameContext): void {
    super.update(context);
    if (this.boundingBox.overlaps(this.playerBoundingBox)) {
      this.sceneManager.loadScene(this.targetSceneId);
    }
  }
}