import { IEntity } from "../../classinterfaces.ts";
import { AbstractCollisionHandler } from "../../componentLibrary/AbstractCollisionHandler.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { PlayerController } from "../player/playerController.ts";
import { ItemRenderer } from "./itemRenderer.ts";

export class ItemCollisionHandler extends AbstractCollisionHandler {
  private renderer: ItemRenderer;

  constructor(renderer: ItemRenderer) {
    super();

    this.renderer = renderer;
  }

  override handleCollision(oth: IEntity, boundingBox: BoundingBox): void {
    if (oth instanceof PlayerController) {
      this.renderer.enableHintText(); 
    }

  }
}