import { BasicSize } from "../../../componentLibrary/BasicSize.js";
import { BoundingBox } from "../../../componentLibrary/boundingBox.js";
import { BasicLifecycle } from "../../../componentLibrary/lifecycle.js";
import { MovementComponent } from "../../../componentLibrary/movementComponent.js";
import { Entity } from "../../../entity.js";
import { OBS_NEW_ACTIVE_ORDER, OBS_ORDER_COMPLETE } from "../../../observerinterfaces.js";
import { ASSET_MANAGER } from "../../main.js";
import { VehicleCollisionHandler } from "./vehicleCollisionHandler.js";
import { VehicleMovementSys, VehicleState } from "./vehicleMovementSystem.js";
import { VehicleRender } from "./vehicleRenderer.js";
import { getVehicleMetadata } from "./vehicleType.js";
const VEHICLE_SCALE = 5;
/**
 * Vehicle entity used for display in the outdoor scene
 *
 * @author Emma Szebenyi
 */
export class VehicleEntity extends Entity {
    /**
     * A vehicle entity that defines vehicle state based on order state
     *
     * @param defaultXY default starting point for the car (far off left side of screen)
     * @param vehicleNum // vehicle number associated with VehicleTypes (for rendering)
     */
    constructor(defaultXY, vehicleNum) {
        super();
        this.defaultXY = { x: defaultXY.x, y: defaultXY.y };
        this.vehicleNum = vehicleNum;
        this.waitToLoad = false;
        const vehicleSprite = ASSET_MANAGER.getImageAsset("vehicles");
        if (vehicleSprite === null)
            throw new Error("Failed to load spritesheet for vehicles");
        this.vehicleMeta = getVehicleMetadata(vehicleNum);
        this.sw = this.vehicleMeta.spriteWidth;
        this.sh = this.vehicleMeta.spriteHeight;
        // set vehicle location, size, and movement system
        const vehicleMovementAndPosition = new MovementComponent(defaultXY);
        this.movPos = vehicleMovementAndPosition;
        this.size = new BasicSize(this.sw, this.sh, VEHICLE_SCALE);
        const vehicleMovementSystem = new VehicleMovementSys(vehicleMovementAndPosition);
        this.vehicleMovementSys = vehicleMovementSystem;
        // create vehicle bounding box and collision handler
        const vehicleBBSize = new BasicSize(this.sw, this.sh / 2, VEHICLE_SCALE);
        const vehicleBB = new BoundingBox(vehicleMovementAndPosition, vehicleBBSize);
        this.bBox = vehicleBB;
        const vehicleCollisionHandler = new VehicleCollisionHandler(vehicleMovementAndPosition, this.vehicleMovementSys, vehicleBB);
        const life = new BasicLifecycle();
        // add components
        super.addComponent(vehicleMovementAndPosition);
        super.addComponent(vehicleBB);
        super.addComponent(vehicleCollisionHandler);
        super.addComponent(vehicleMovementSystem);
        super.addComponent(life);
        // set the sprite renderer initially (will be updated later)
        this.vehicleRenderer = new VehicleRender(vehicleSprite, this.vehicleMeta.spriteFrameX, this.vehicleMeta.spriteFrameY, this.sw, this.sh, vehicleMovementAndPosition, this.size, vehicleBB);
        super.setRenderer(this.vehicleRenderer);
    }
    /**
     * Returns the vehicle movement system
     * @returns the vehicle movement system
     */
    getMovementSystem() {
        return this.vehicleMovementSys;
    }
    /**
     * Get updates from order loop and set behavior based on that
     */
    observerUpdate(data, propertyName) {
        var _a;
        if (OBS_NEW_ACTIVE_ORDER === propertyName) { // new active order arrives
            const newOrderDataCast = data;
            if (newOrderDataCast) {
                const lifecycle = super.getComponent(BasicLifecycle); // get the life cycle for the vehicle
                const currentState = this.getMovementSystem().getVehicleState(); // get the vehicle's current state from VehicleMovementSys
                /** if the vehicle is alive but has not yet hit the exit point (off screen on right) */
                if (lifecycle && lifecycle.isAlive() && currentState !== VehicleState.DONE) {
                    this.waitToLoad = true; // wait to load the next vehicle
                    /** if the vehicle is not alive or the vehicle has hit the exit point (off screen on right) */
                }
                else {
                    this.waitToLoad = false; // allow next vehicle to load
                    this.changeSprite(this.vehicleNum); // change the sprite to give the illusion of a new vehicle
                    (_a = super.getComponent(MovementComponent)) === null || _a === void 0 ? void 0 : _a.setPosition(this.defaultXY); // restore initial position (off screen on left)
                    lifecycle === null || lifecycle === void 0 ? void 0 : lifecycle.revive(); // revive the vehicle (giving the illusion of a new vehicle)
                    this.getMovementSystem().setVehicleState(VehicleState.DRIVING_IN); // set the vehicle's state to drive in
                }
            }
        }
        if (OBS_ORDER_COMPLETE === propertyName) { // if order is completed
            this.getMovementSystem().setVehicleState(VehicleState.DRIVING_OUT); // set the vehicle's state to drive out (from stopping point to off screen on right)
        }
    }
    update(context) {
        var _a;
        super.update(context);
        /** if the vehicle has hit the exit point (far off screen on the right),
         * set the life cycle and kill the existing vehicle
         */
        if (this.getMovementSystem().getVehicleState() === VehicleState.DONE) {
            const lifecycle = super.getComponent(BasicLifecycle);
            lifecycle === null || lifecycle === void 0 ? void 0 : lifecycle.die();
            /** if another car is waiting to load in, update its values
             * (done in update to constantly check vehicle's state)
             */
            // note: in the future, we can make this a helper method
            if (this.waitToLoad) {
                this.waitToLoad = false; // reset wait to load
                this.changeSprite(this.vehicleNum); // change the sprite to give the illusion of a new vehicle
                (_a = super.getComponent(MovementComponent)) === null || _a === void 0 ? void 0 : _a.setPosition(this.defaultXY); // restore initial position (off screen on left)
                lifecycle === null || lifecycle === void 0 ? void 0 : lifecycle.revive(); // revive the vehicle (giving the illusion of a new vehicle)
                this.getMovementSystem().setVehicleState(VehicleState.DRIVING_IN); // set the vehicle's state to drive in
            }
        }
    }
    /**
     * Change the sprite being rendered to a different one using the vehicle type
     * associated with a sprite (vehicle) number
     *
     * @param currentSpriteNum the current sprite number associated w/ vehicle type
     */
    changeSprite(currentSpriteNum) {
        let newSpriteNum = Math.floor(Math.random() * 11) + 1;
        while (newSpriteNum == currentSpriteNum) { // ensure the new sprite isn't the same as the existing one (just for funsies)
            newSpriteNum = Math.floor(Math.random() * 11) + 1;
        }
        this.setSpriteData(newSpriteNum);
    }
    /**
     * Update the vehicle sprite's data based on the sprite (vehicle) number
     * associated with a vehicle type and pass this to the renderer.
     *
     * @param spriteNum sprite (vehicle) number associated w/ vehicle type
     */
    setSpriteData(spriteNum) {
        // get new metadata
        this.vehicleMeta = getVehicleMetadata(spriteNum);
        this.sw = this.vehicleMeta.spriteWidth;
        this.sh = this.vehicleMeta.spriteHeight;
        // update size component + bounding box
        this.size = new BasicSize(this.sw, this.sh, VEHICLE_SCALE);
        const vehicleBBSize = new BasicSize(this.sw, this.sh / 2, VEHICLE_SCALE);
        this.bBox = new BoundingBox(this.movPos, vehicleBBSize);
        // update renderer with new sprite data
        if (this.vehicleRenderer) {
            this.vehicleRenderer.setSprite(this.vehicleMeta.spriteFrameX, this.vehicleMeta.spriteFrameY, this.sw, this.sh, this.size, this.bBox);
        }
    }
}
