import { AbstractCollisionHandler } from "../../../componentLibrary/AbstractCollisionHandler.js";
export class VehicleCollisionHandler extends AbstractCollisionHandler {
    constructor(movementComponent, 
    //movementSys: VehicleMovementSys,
    boundingBox) {
        super();
        this.movementComponent = movementComponent;
        //this.movementSys = movementSys;
        this.boundingBox = boundingBox;
    }
    handleCollision(other, otherBounds) {
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
