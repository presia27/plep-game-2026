import { OBS_NEW_ACTIVE_ORDER, OBS_ORDER_COMPLETE } from "../../../observerinterfaces.js";
export var VehicleState;
(function (VehicleState) {
    VehicleState[VehicleState["DRIVING_IN"] = 0] = "DRIVING_IN";
    VehicleState[VehicleState["WAITING"] = 1] = "WAITING";
    VehicleState[VehicleState["DRIVING_OUT"] = 2] = "DRIVING_OUT";
    VehicleState[VehicleState["DONE"] = 3] = "DONE";
})(VehicleState || (VehicleState = {}));
const EXIT_X = 1400; // far enough off the right side to despawn
export class VehicleMovementSys {
    constructor(movementComponent, deliveryPosition) {
        this.state = VehicleState.DRIVING_IN;
        this.currentDirection = { x: 1, y: 0 };
        this.pendingDirection = { x: 1, y: 0 };
        this.movementComponent = movementComponent;
        this.deliveryPosition = deliveryPosition;
        this.speed = 0;
        this.activeOrder = null;
    }
    update(context) {
        const targetPos = this.deliveryPosition;
        const vehiclePos = this.movementComponent.getPosition();
        if (this.state === VehicleState.DRIVING_IN) {
            if (vehiclePos.x === targetPos.x) {
                this.movementComponent.setPosition(vehiclePos);
                this.state = VehicleState.WAITING;
            }
            else {
                this.moveRight();
                this.movementComponent.setVelocityCommand({
                    direction: this.currentDirection,
                    magnitude: this.speed
                });
            }
        }
        if (this.state === VehicleState.WAITING) {
            this.speed = 0; // set speed to nothing (not sure if this is right)
            this.movementComponent.setVelocityCommand({
                direction: this.currentDirection,
                magnitude: this.speed
            });
        }
        if (this.state === VehicleState.DRIVING_OUT) {
            this.moveRight();
            this.movementComponent.setVelocityCommand({
                direction: this.currentDirection,
                magnitude: this.speed
            });
            if (vehiclePos.x >= EXIT_X) {
                this.state = VehicleState.DONE;
            }
        }
        //console.debug("Vehicle state: " + this.state);
    }
    moveRight() {
        this.speed = 200;
        this.pendingDirection = { x: 1, y: 0 };
    }
    applyPendingDirection() {
        this.currentDirection = Object.assign({}, this.pendingDirection);
    }
    observerUpdate(data, propertyName) {
        if (OBS_NEW_ACTIVE_ORDER === propertyName) {
            const newOrderDataCast = data;
            if (newOrderDataCast) {
                this.activeOrder = newOrderDataCast;
                this.state = VehicleState.DRIVING_IN;
            }
        }
        if (OBS_ORDER_COMPLETE === propertyName) {
            const completedOrder = data;
            this.activeOrder = null;
            this.state = VehicleState.DRIVING_OUT;
        }
    }
    setVehicleState(state) {
        this.state = state;
    }
    getVehicleState() {
        return this.state;
    }
    getPosition() {
        return this.movementComponent.getPosition();
    }
}
