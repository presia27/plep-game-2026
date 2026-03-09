import { BasicSize } from "../../../componentLibrary/BasicSize.js";
import { BoundingBox } from "../../../componentLibrary/boundingBox.js";
import { MovementComponent } from "../../../componentLibrary/movementComponent.js";
import { Entity } from "../../../entity.js";
import { ASSET_MANAGER } from "../../main.js";
import { VehicleCollisionHandler } from "./vehicleCollisionHandler.js";
import { VehicleRender } from "./vehicleRenderer.js";
import { getVehicleMetadata } from "./vehicleType.js";
const VEHICLE_SCALE = 5;
export class VehicleEntity extends Entity {
    //private vehicleMovementSys: VehicleMovementSys; 
    constructor(defaultXY, vehicleNum) {
        super();
        this.vehicleNum = vehicleNum;
        const vehicleSprite = ASSET_MANAGER.getImageAsset("vehicles");
        if (vehicleSprite === null)
            throw new Error("Failed to load spritesheet for vehicles");
        const vehicleMeta = getVehicleMetadata(this.vehicleNum);
        const vehicleWidth = vehicleMeta.spriteWidth;
        const vehicleHeight = vehicleMeta.spriteHeight;
        // set vehicle location, size, and movement system
        const vehicleMovementAndPosition = new MovementComponent(defaultXY);
        const vehicleSize = new BasicSize(vehicleWidth, vehicleHeight, VEHICLE_SCALE);
        //this.vehicleMovementSys = new VehicleMovementSys(vehicleMovementAndPosition, deliveryPos);
        // create vehicle bounding box and collision handler
        const vehicleBBSize = new BasicSize(vehicleWidth, vehicleHeight / 2, VEHICLE_SCALE);
        const vehicleBB = new BoundingBox(vehicleMovementAndPosition, vehicleBBSize);
        const vehicleCollisionHandler = new VehicleCollisionHandler(vehicleMovementAndPosition, /*this.vehicleMovementSys, */ vehicleBB);
        // add components
        super.addComponent(vehicleMovementAndPosition);
        super.addComponent(vehicleBB);
        super.addComponent(vehicleCollisionHandler);
        //super.addComponent(this.vehicleMovementSys);
        const renderer = new VehicleRender(vehicleSprite, vehicleMeta.spriteFrameX, vehicleMeta.spriteFrameY, vehicleWidth, vehicleHeight, vehicleMovementAndPosition, 
        //this.vehicleMovementSys,
        vehicleSize, vehicleBB);
        super.setRenderer(renderer);
    }
}
