import { IPosition } from "../../../classinterfaces.ts";
import { BasicSize } from "../../../componentLibrary/BasicSize.ts";
import { BoundingBox } from "../../../componentLibrary/boundingBox.ts";
import { BasicLifecycle } from "../../../componentLibrary/lifecycle.ts";
import { MovementComponent } from "../../../componentLibrary/movementComponent.ts";
import { Entity } from "../../../entity.ts";
import { OBS_NEW_ACTIVE_ORDER, OBS_ORDER_COMPLETE, Observer } from "../../../observerinterfaces.ts";
import SceneManager from "../../../sceneManager.ts";
import { XY } from "../../../typeinterfaces.ts";
import { ASSET_MANAGER } from "../../main.ts";
import { Order } from "../../ordermanagement/order.ts";
import { VehicleCollisionHandler } from "./vehicleCollisionHandler.ts";
import { VehicleMovementSys, VehicleState } from "./vehicleMovementSystem.ts";
import { VehicleRender } from "./vehicleRenderer.ts";
import { getVehicleMetadata, VehicleType } from "./vehicleType.ts";

const VEHICLE_SCALE: number = 5;

export class VehicleEntity extends Entity implements Observer {
  private vehicleNum: number;
  private vehicleMovementSys: VehicleMovementSys;
  private defaultXY: XY;
  //private sceneMgr: SceneManager;
  constructor(
    defaultXY: XY,
    vehicleNum: number // will be some random value to pick the car we want to use
    //sceneMgr: SceneManager // to create another vehicle (ew)
  ) {
    super();
    this.defaultXY = { x: defaultXY.x, y: defaultXY.y };
    this.vehicleNum = vehicleNum;
    //this.sceneMgr = sceneMgr;

    const vehicleSprite = ASSET_MANAGER.getImageAsset("vehicles");
    if (vehicleSprite === null)
      throw new Error("Failed to load spritesheet for vehicles");

    const vehicleMeta = getVehicleMetadata(this.vehicleNum)
    const vehicleWidth = vehicleMeta.spriteWidth;
    const vehicleHeight = vehicleMeta.spriteHeight;

    // set vehicle location, size, and movement system
    const vehicleMovementAndPosition = new MovementComponent(defaultXY);
    const vehicleSize = new BasicSize(vehicleWidth, vehicleHeight, VEHICLE_SCALE);
    const vehicleMovementSystem = new VehicleMovementSys(vehicleMovementAndPosition);
    this.vehicleMovementSys = vehicleMovementSystem;

    // create vehicle bounding box and collision handler
    const vehicleBBSize = new BasicSize(vehicleWidth, vehicleHeight / 2, VEHICLE_SCALE);
    const vehicleBB = new BoundingBox(vehicleMovementAndPosition, vehicleBBSize);
    const vehicleCollisionHandler = new VehicleCollisionHandler(vehicleMovementAndPosition, this.vehicleMovementSys, vehicleBB);
    const life = new BasicLifecycle();
    //this.lifecycle = new BasicLifecycle();
    
    // add components
    super.addComponent(vehicleMovementAndPosition);
    super.addComponent(vehicleBB);
    super.addComponent(vehicleCollisionHandler);
    super.addComponent(vehicleMovementSystem);
    super.addComponent(life);

    const renderer = new VehicleRender(
      vehicleSprite,
      vehicleMeta.spriteFrameX,
      vehicleMeta.spriteFrameY,
      vehicleWidth,
      vehicleHeight,
      vehicleMovementAndPosition,
      vehicleSize,
      vehicleBB
    )

    super.setRenderer(renderer);
  }
  public getMovementSystem(): VehicleMovementSys {
    return this.vehicleMovementSys;
  }

  public observerUpdate(data: any, propertyName: string): void {
    if (OBS_NEW_ACTIVE_ORDER === propertyName) {
      const newOrderDataCast = data as Order;
      if (newOrderDataCast) {
        this.getMovementSystem().setVehicleState(VehicleState.DRIVING_IN);
        const lifecycle = super.getComponent(BasicLifecycle);
        if (lifecycle && !lifecycle.isAlive()) { // if life cycle exists and entity is dead
          super.getComponent(MovementComponent)?.setPosition(this.defaultXY); // restore initial position
          lifecycle.revive();
        }
        
        // const spriteNum = Math.random() * (12 - 1) + 1
        // const vehicle = new VehicleEntity({ x: -200, y: 200 }, spriteNum, this.sceneMgr);

        // this.sceneMgr.collisionSystem.addEntity(vehicle);
        // this.localEntities.push(vehicle);
        // this.orderLoop?.subscribe(vehicle.getMovementSystem());
      }
    }
    if (OBS_ORDER_COMPLETE === propertyName) {
      const completedOrder = data as Order;
      this.getMovementSystem().setVehicleState(VehicleState.DRIVING_OUT);
      const lifecycle = super.getComponent(BasicLifecycle);
      if (lifecycle && lifecycle.isAlive()) {
        lifecycle.die(); // kill the vehicle if order completed
      }
    }
  }
}