import { IEntity } from "../../classinterfaces.ts";
import { AbstractCollisionHandler } from "../../componentLibrary/AbstractCollisionHandler.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import SceneManager from "../../sceneManager.ts";
import { PlayerController } from "../player/playerController.ts";

export class DoorTriggerCollisionHandler extends AbstractCollisionHandler {
  private sceneManager: SceneManager;
  private targetSceneId: string;
  
  constructor(sceneManager: SceneManager, targetSceneId: string) {
    super();

    this.sceneManager = sceneManager;
    this.targetSceneId = targetSceneId;
  }

  override handleCollision(oth: IEntity, boundingBox: BoundingBox): void {
    if (oth instanceof PlayerController) {
      this.sceneManager.loadScene(this.targetSceneId);
    }
  }
}
