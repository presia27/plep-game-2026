import { GameContext, IComponent, IPosition } from "../../../classinterfaces.ts";
import { MovementComponent } from "../../../componentLibrary/movementComponent.ts";
import { OBS_NEW_ACTIVE_ORDER, OBS_ORDER_COMPLETE, Observable, Observer } from "../../../observerinterfaces.ts";
import { XY } from "../../../typeinterfaces.ts";
import { Order } from "../../ordermanagement/order.ts";

export enum VehicleState {
  DRIVING_IN,
  WAITING,
  DRIVING_OUT,
  DONE
}
const EXIT_X: number = 1400; // far enough off the right side to despawn

export class VehicleMovementSys implements IComponent, Observer, Observable {
  private movementComponent: MovementComponent;
  private stopPosition: XY;
  private state: VehicleState = VehicleState.DRIVING_IN;
  private speed: number;
  private currentDirection: XY = { x: 1, y: 0 };
  private observers: Observer[];
  private activeOrder: Order | null;

  constructor(
    movementComponent: MovementComponent,
  ) {
    this.movementComponent = movementComponent;
    this.speed = 0;
    this.activeOrder = null;
    this.stopPosition = {x: 515, y: this.movementComponent.getPosition().y};
    this.observers = [];
  }

  public update(context: GameContext): void {
    const vehiclePos = this.movementComponent.getPosition();
    
    if (this.state === VehicleState.DRIVING_IN) {
      console.debug("Car state is driving in");
      if (vehiclePos.x >= this.stopPosition.x) { // stop the car if it hits 
        this.movementComponent.setPosition(vehiclePos);
        console.debug("Car hit stopping point");
        this.state = VehicleState.WAITING;
      } else {
        this.moveRight();
        this.movementComponent.setVelocityCommand({ // FULFILL BUTTON IS F
          direction: this.currentDirection,
          magnitude: this.speed
        })
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
      })
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

  public moveRight(): void {
    this.currentDirection = { x: 1, y: 0 };
    this.speed = 200;
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
      //this.activeOrder = null;
      this.state = VehicleState.DRIVING_OUT;
    }
  }

  public subscribe(observer: Observer): void {
    this.observers.push(observer);
  }

  public unsubscribe(observer: Observer): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  public notifyObservers(data: any, notificationType: string): void {
    for (const observer of this.observers) {
      observer.observerUpdate(data, notificationType);
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