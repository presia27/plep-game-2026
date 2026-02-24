import { AbstractCollisionHandler } from "../../componentLibrary/AbstractCollisionHandler.js";
import { PlayerController } from "../player/playerController.js";
export class ItemCollisionHandler extends AbstractCollisionHandler {
    constructor(renderer) {
        super();
        this.renderer = renderer;
    }
    handleCollision(oth, boundingBox) {
        if (oth instanceof PlayerController) {
            this.renderer.enableHintText();
        }
    }
}
