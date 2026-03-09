import { GameContext, IComponent, IPosition } from "../../../classinterfaces.ts";
import { MovementComponent } from "../../../componentLibrary/movementComponent.ts";
import { OBS_NEW_ACTIVE_ORDER, OBS_ORDER_COMPLETE, Observer } from "../../../observerinterfaces.ts";
import { XY } from "../../../typeinterfaces.ts";
import { Order } from "../../ordermanagement/order.ts";

export enum VehicleState {
  DRIVING_IN,
  WAITING,
  DRIVING_OUT,
  DONE
}
const EXIT_X: number = 1400; // far enough off the right side to despawn

export class VehicleMovementSys implements IComponent, Observer {
  private movementComponent: MovementComponent;
  private deliveryPosition: XY;
  private state: VehicleState = VehicleState.DRIVING_IN;
  private speed: number;
  private currentDirection: XY = { x: 1, y: 0 };
  private pendingDirection: XY = { x: 1, y: 0 };
  private activeOrder: Order | null;

  constructor(
    movementComponent: MovementComponent,
    deliveryPosition: XY
  ) {
    this.movementComponent = movementComponent;
    this.deliveryPosition = deliveryPosition;
    this.speed = 0;
    this.activeOrder = null;
  }

  public update(context: GameContext): void {
    const targetPos = this.deliveryPosition;
    const vehiclePos = this.movementComponent.getPosition();
    
    if (this.state === VehicleState.DRIVING_IN) {
      if (vehiclePos.x === targetPos.x) {
        this.movementComponent.setPosition(vehiclePos);
        this.state = VehicleState.WAITING;
      } else {
        this.moveRight();
        this.movementComponent.setVelocityCommand({
          direction: this.currentDirection,
          magnitude: this.speed
        })
      }
    }

    if (this.state === VehicleState.WAITING) {
      this.speed = 0; // set speed to nothing (not sure if this is right)
      this.movementComponent.setVelocityCommand({
        direction: this.currentDirection,
        magnitude: this.speed
      })
    }

    if (this.state === VehicleState.DRIVING_OUT) {
      this.moveRight();
      this.movementComponent.setVelocityCommand({
        direction: this.currentDirection,
        magnitude: this.speed
      })
      if (vehiclePos.x >= EXIT_X) {
        this.state = VehicleState.DONE;
      }
    }
    //console.debug("Vehicle state: " + this.state);
  }

  public moveRight(): void {
    this.speed = 200;
    this.pendingDirection = { x: 1, y: 0 };
  }

  public applyPendingDirection(): void {
    this.currentDirection = { ...this.pendingDirection };
  }

  public observerUpdate(data: any, propertyName: string): void {
    if (OBS_NEW_ACTIVE_ORDER === propertyName) {
      const newOrderDataCast = data as Order;
      if (newOrderDataCast) {
        this.activeOrder = newOrderDataCast;
        this.state = VehicleState.DRIVING_IN;
      }
    }

    if (OBS_ORDER_COMPLETE === propertyName) {
      const completedOrder = data as Order;
      this.activeOrder = null;
      this.state = VehicleState.DRIVING_OUT;
    }
  }

  public setVehicleState(state: VehicleState): void {
    this.state = state;
  }

  public getVehicleState(): VehicleState {
    return this.state;
  }

  public getPosition(): XY {
    return this.movementComponent.getPosition();
  }
}