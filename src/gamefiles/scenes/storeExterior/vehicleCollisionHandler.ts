import { IEntity } from "../../../classinterfaces.ts";
import { AbstractCollisionHandler } from "../../../componentLibrary/AbstractCollisionHandler.ts";
import { BoundingBox } from "../../../componentLibrary/boundingBox.ts";
import { MovementComponent } from "../../../componentLibrary/movementComponent.ts";
import { DeliveryController } from "../../deliveryEntity/deliveryController.ts";
import { PlayerController } from "../../player/playerController.ts";
import { VehicleMovementSys, VehicleState } from "./vehicleMovementSystem.ts";
import { VehicleRender } from "./vehicleRenderer.ts";

export class VehicleCollisionHandler extends AbstractCollisionHandler {
  private movementComponent: MovementComponent;
  private movementSys: VehicleMovementSys;
  private boundingBox: BoundingBox;

  constructor(
    movementComponent: MovementComponent,
    movementSys: VehicleMovementSys,
    boundingBox: BoundingBox
  ) {
    super();

    this.movementComponent = movementComponent;
    this.movementSys = movementSys;
    this.boundingBox = boundingBox;
  }
  override handleCollision(other: IEntity, otherBounds: BoundingBox): void {
    const pos = this.movementComponent.getPosition();
    const bbWidth = this.boundingBox.getRight() - this.boundingBox.getLeft();
    const bbHeight = this.boundingBox.getBottom() - this.boundingBox.getTop();
    const xOffset = this.boundingBox.getOffsetX();
    const yOffset = this.boundingBox.getOffsetY();

    const vehicleLeft = this.boundingBox.getLeft();
    const vehicleRight = this.boundingBox.getRight();
    const vehicleTop = this.boundingBox.getTop();
    const vehicleBottom = this.boundingBox.getBottom();

    // IMPLEMENT LATER
    // if (other instanceof DeliveryController) {
    //   console.debug("hit delivery area")
    //   this.movementSys.setVehicleState(VehicleState.WAITING);
    // }

    // if (other instanceof PlayerController) {
    //   const playerLeft = otherBounds.getLeft();
    //   const playerRight = otherBounds.getRight();
    //   const playerTop = otherBounds.getTop();
    //   const playerBottom = otherBounds.getBottom();

    //   const overlapLeft = vehicleRight - playerLeft;
    //   const overlapRight = playerRight - vehicleLeft;
    //   const overlapTop = vehicleBottom - playerTop;
    //   const overlapBottom = playerBottom - vehicleTop;

    //   const minOverlapX = Math.min(overlapLeft, overlapRight);
    //   const minOverlapY = Math.min(overlapTop, overlapBottom);

    //   if (minOverlapX < minOverlapY) {
    //     if (overlapLeft < overlapRight)
    //       pos.x = playerLeft - (xOffset + bbWidth);
    //     else
    //       pos.x = playerRight - xOffset;
    //   } else {
    //     if (overlapTop < overlapBottom)
    //       pos.y = playerTop - (yOffset + bbHeight);
    //     else
    //       pos.y = playerBottom - yOffset;
    //   }
    // }
  }
}