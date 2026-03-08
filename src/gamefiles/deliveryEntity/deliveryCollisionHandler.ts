import { IEntity } from "../../classinterfaces.ts";
import { AbstractCollisionHandler } from "../../componentLibrary/AbstractCollisionHandler.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { ItemRenderer } from "../ordermanagement/itemRenderer";

export class DeliveryCollisionHandler extends AbstractCollisionHandler {
  constructor() {
    super();

  }
  override handleCollision(oth: IEntity, boundingBox: BoundingBox): void {

  }
}