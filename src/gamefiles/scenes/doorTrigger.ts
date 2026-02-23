import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { BasicSize } from "../../componentLibrary/BasicSize.ts";
import { MovementComponent } from "../../componentLibrary/movementComponent.ts";
import { Entity } from "../../entity.ts";
import SceneManager from "../../sceneManager.ts";
import { GameContext } from "../../classinterfaces.ts";
import { XY } from "../../typeinterfaces.ts";
import { AbstractCollisionHandler } from "../../componentLibrary/AbstractCollisionHandler.ts";
import { DoorTriggerCollisionHandler } from "./doorTriggerCollisionHandler.ts";


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
  private collisionHandler: AbstractCollisionHandler;

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
    this.collisionHandler = new DoorTriggerCollisionHandler(sceneManager, targetSceneId);

    super.addComponent(movement);
    super.addComponent(this.boundingBox);
    super.addComponent(this.collisionHandler);
  }

  override update(context: GameContext): void {
    // super.update(context);
    // if (this.boundingBox.collide(this.playerBoundingBox)) {
    //   this.sceneManager.loadScene(this.targetSceneId);
    // }
  }

   override draw(context: GameContext): void {
    super.draw(context);
    
    if (context.debug) {
      const ctx = context.ctx;
      ctx.save();
      
      // Draw door trigger zone in green with transparency
      ctx.strokeStyle = "#00FF00";
      ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
      ctx.lineWidth = 2;
      
      ctx.fillRect(
        this.boundingBox.getLeft(),
        this.boundingBox.getTop(),
        this.boundingBox.getRight() - this.boundingBox.getLeft(),
        this.boundingBox.getBottom() - this.boundingBox.getTop()
      );
      
      ctx.strokeRect(
        this.boundingBox.getLeft(),
        this.boundingBox.getTop(),
        this.boundingBox.getRight() - this.boundingBox.getLeft(),
        this.boundingBox.getBottom() - this.boundingBox.getTop()
      );
      
      // Draw label showing target scene
      ctx.fillStyle = "#00FF00";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        `→ ${this.targetSceneId}`,
        this.boundingBox.getLeft() + (this.boundingBox.getRight() - this.boundingBox.getLeft()) / 2,
        this.boundingBox.getTop() + (this.boundingBox.getBottom() - this.boundingBox.getTop()) / 2
      );
      
      ctx.restore();
    }
  }
}