export var VehicleState;
(function (VehicleState) {
    VehicleState[VehicleState["DRIVING_IN"] = 0] = "DRIVING_IN";
    VehicleState[VehicleState["WAITING"] = 1] = "WAITING";
    VehicleState[VehicleState["DRIVING_OUT"] = 2] = "DRIVING_OUT";
    VehicleState[VehicleState["DONE"] = 3] = "DONE";
})(VehicleState || (VehicleState = {}));
const EXIT_X = 1400; // far enough off the right side to despawn
export class VehicleMovementSys {
    constructor(movementComponent) {
        this.state = VehicleState.DRIVING_IN;
        this.currentDirection = { x: 1, y: 0 };
        this.movementComponent = movementComponent;
        this.speed = 0;
        this.stopPosition = { x: 515, y: this.movementComponent.getPosition().y }; // the spot the car should stop while waiting for order to be fulfilled (had to hard code this)
        this.observers = [];
    }
    update(context) {
        const vehiclePos = this.movementComponent.getPosition();
        if (this.state === VehicleState.DRIVING_IN) {
            console.debug("Car state is driving in");
            if (vehiclePos.x >= this.stopPosition.x) { // stop the car if it hits 
                this.movementComponent.setPosition(vehiclePos);
                console.debug("Car hit stopping point");
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
            console.debug("Car state is waiting");
            this.speed = 0; // set speed to nothing (not sure if this is right)
            this.movementComponent.setVelocityCommand({
                direction: this.currentDirection,
                magnitude: this.speed
            });
        }
        if (this.state === VehicleState.DRIVING_OUT) {
            console.debug("Car state is now driving out");
            this.moveRight();
            //console.debug("speed: " + this.speed + " x direction: " + this.currentDirection.x);
            this.movementComponent.setVelocityCommand({
                direction: this.currentDirection,
                magnitude: this.speed
            });
            if (vehiclePos.x >= EXIT_X) {
                console.debug("Car hit/passed exit point");
                this.state = VehicleState.DONE;
            }
        }
        if (this.state === VehicleState.DONE) {
            this.speed = 0;
            this.movementComponent.setVelocityCommand({
                direction: this.currentDirection,
                magnitude: this.speed
            });
        }
        //console.debug("Vehicle state: " + this.state);
    }
    moveRight() {
        this.currentDirection = { x: 1, y: 0 };
        this.speed = 200;
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
