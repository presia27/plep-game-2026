import { AbstractCollisionHandler } from "../../componentLibrary/AbstractCollisionHandler.js";
import { PlayerController } from "../player/playerController.js";
export class DoorTriggerCollisionHandler extends AbstractCollisionHandler {
    constructor(sceneManager, targetSceneId) {
        super();
        this.sceneManager = sceneManager;
        this.targetSceneId = targetSceneId;
    }
    handleCollision(oth, boundingBox) {
        if (oth instanceof PlayerController) {
            this.sceneManager.loadScene(this.targetSceneId);
        }
    }
}
