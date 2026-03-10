import { IPosition } from "../../../classinterfaces.ts";
import { BasicSize } from "../../../componentLibrary/BasicSize.ts";
import { BoundingBox } from "../../../componentLibrary/boundingBox.ts";
import { MovementComponent } from "../../../componentLibrary/movementComponent.ts";
import { Entity } from "../../../entity.ts";
import { XY } from "../../../typeinterfaces.ts";
import { ASSET_MANAGER } from "../../main.ts";
import { VehicleCollisionHandler } from "./vehicleCollisionHandler.ts";
import { VehicleMovementSys } from "./vehicleMovementSystem.ts";
import { VehicleRender } from "./vehicleRenderer.ts";
import { getVehicleMetadata, VehicleType } from "./vehicleType.ts";

const VEHICLE_SCALE: number = 5;

export class VehicleEntity extends Entity {
  private vehicleNum: number;
  private vehicleMovementSys: VehicleMovementSys; 
  constructor(
    defaultXY: XY,
    vehicleNum: number, // will be some random value to pick the car we want to use
    //deliveryPos: XY
  ) {
    super();
    
    this.vehicleNum = vehicleNum;

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
    const vehicleBBSize = new BasicSize(vehicleWidth, vehicleHeight/2, VEHICLE_SCALE);
    const vehicleBB = new BoundingBox(vehicleMovementAndPosition, vehicleBBSize);
    const vehicleCollisionHandler = new VehicleCollisionHandler(vehicleMovementAndPosition, this.vehicleMovementSys, vehicleBB);
    //const lifecycle = new BasicLifecycle();

    // add components
    super.addComponent(vehicleMovementAndPosition);
    super.addComponent(vehicleBB);
    super.addComponent(vehicleCollisionHandler);
    super.addComponent(vehicleMovementSystem);
    //super.addComponent(lifecycle);

    const renderer = new VehicleRender(
      vehicleSprite,
      vehicleMeta.spriteFrameX,
      vehicleMeta.spriteFrameY,
      vehicleWidth,
      vehicleHeight,
      vehicleMovementAndPosition,
      //this.vehicleMovementSys,
      vehicleSize,
      vehicleBB
    )

    super.setRenderer(renderer);
  }
  public getMovementSystem(): VehicleMovementSys {
    return this.vehicleMovementSys;
  }
}