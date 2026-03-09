import { ASSET_MANAGER } from "../main.js";
import { PlayerController } from "../player/playerController.js";
import { ShelfController, SHELF_SCALE } from "../shelves/shelfController.js";
import { DoorTrigger } from "./doorTrigger.js";
import { BoundingBox } from "../../componentLibrary/boundingBox.js";
import { MovementComponent } from "../../componentLibrary/movementComponent.js";
import { ItemEntity } from "../ordermanagement/itemEntity.js";
import { DeliveryController } from "../deliveryEntity/deliveryController.js";
import { MonsterEntity } from "../monster/monsterEntity.js";
import { StoreFloor } from "./storeInterior/storeFloorController.js";
import { BloodController } from "./storeInterior/bloodSplatterController.js";
import { ShelfShadow } from "./storeInterior/shelfShadowController.js";
import { UpdatePoint } from "../monster/updatePointEntity.js";
import { WallEntity } from "./wallEntity.js";
import { staticPositionComponent } from "../../componentLibrary/staticPositionComponent.js";
import { ParkingLot } from "./storeExterior/parkingLotController.js";
import { Ball } from "./storeExterior/ballController.js";
import { Bush } from "./storeExterior/bushController.js";
import { VehicleEntity } from "./storeExterior/vehicleEntity.js";
/** Coordinate on actual shelves describing where items can be placed before scaling  */
const ITEM_HSHELF_POSITION = [
    { x: 30, y: 20 },
    { x: 8, y: 20 },
    { x: 52, y: 20 }
];
// TODO: i'd like to make it so items exist in diff locations depending on the number of 
// rows the shelf has, since some shelves have only 2 rows and then items spawn looking like 
// they're floating rather than sitting on the shelf
/**
 * Altered base class for all room scenes.
 * Handles all common setup logic so individual rooms only
 * ned to define their data via abstract methods.
 *
 * @author Luke Willis, Claude Sonnet 4.5, Preston Sia
 */
export class BaseRoomScene {
    constructor(game, roomData, allowedRoomIds, orderLoop) {
        this.roomData = roomData;
        this.inputSystem = game.getInputSystem();
        this.collisionSystem = game.getCollisionSystem();
        this.localEntities = [];
        this.orderLoop = orderLoop;
        this.allowedRoomIds = allowedRoomIds;
    }
    /**
     * Loads scene data and adds them as actual instances
     * to the scene manager.
     * @param sceneManager Scene manager
     */
    onEnter(sceneManager) {
        var _a, _b, _c, _d, _e, _f;
        console.log("Loading scene " + this.roomData.sceneId);
        // Attempt to find the current player
        let player;
        const existingPlayer = sceneManager.getLevelEntities().find(entity => entity instanceof PlayerController);
        if (existingPlayer) {
            player = existingPlayer;
            // Reuse existing player, just update spawn point
            player = existingPlayer;
            const movementComponent = player.getComponent(MovementComponent);
            if (movementComponent) {
                this.movePlayer(movementComponent);
                /* Create and load monsters */
                for (const monsterSpawn of this.roomData.monsterSpawns) {
                    const monster = new MonsterEntity(monsterSpawn, 5, movementComponent, this.roomData.updatePoints.slice()); // FIGURE OUT HOW TO INTEGRATE MOVEMENT SYSTEM PROPERLY
                    sceneManager.addEntity(monster);
                    this.localEntities.push(monster);
                    this.collisionSystem.addEntity(monster);
                }
            }
        }
        else {
            player = null;
            console.error("Player not found during scene load");
        }
        /* Create update points */
        for (const updatePoint of this.roomData.updatePoints) {
            const pointTrigger = new UpdatePoint(updatePoint);
            this.localEntities.push(pointTrigger);
            sceneManager.addEntity(pointTrigger);
            this.collisionSystem.addEntity(pointTrigger);
        }
        /* Create walls */
        const topWall = new WallEntity(new staticPositionComponent({ x: 0, y: 0 }), 1280, 3, 5);
        const bottomWall = new WallEntity(new staticPositionComponent({ x: 0, y: 705 }), 1280, 3, 5);
        const leftWall = new WallEntity(new staticPositionComponent({ x: 0, y: 0 }), 3, 720, 5);
        const rightWall = new WallEntity(new staticPositionComponent({ x: 1265, y: 0 }), 3, 720, 5);
        sceneManager.addEntity(topWall);
        sceneManager.addEntity(bottomWall);
        sceneManager.addEntity(leftWall);
        sceneManager.addEntity(rightWall);
        this.localEntities.push(topWall);
        this.localEntities.push(bottomWall);
        this.localEntities.push(leftWall);
        this.localEntities.push(rightWall);
        this.collisionSystem.addEntity(topWall);
        this.collisionSystem.addEntity(bottomWall);
        this.collisionSystem.addEntity(rightWall);
        this.collisionSystem.addEntity(leftWall);
        /* Create and load shelving and add items */
        const allowedItems = this.roomData.allowedItems.slice(); // using slice to get a shallow copy
        for (const shelfData of this.roomData.shelves) {
            const shelfSprite = ASSET_MANAGER.getImageAsset(shelfData.spriteId);
            if (shelfSprite === null) {
                throw new Error(`Failed to load shelf sprite: "${shelfData.spriteId}"`);
            }
            const shelf = new ShelfController(shelfData.position, shelfSprite, shelfData.shelfNum);
            /* Shelf shadow */
            const shelfShadow = new ShelfShadow(shelfData.position);
            this.localEntities.push(shelfShadow);
            sceneManager.addEntity(shelfShadow);
            // if the array has enough items to fill the shelf, retrive as many as will fit up to the max. Otherwise, retrieve whatever's available.
            const numItems = allowedItems.length >= ITEM_HSHELF_POSITION.length ? ITEM_HSHELF_POSITION.length : allowedItems.length;
            const shelfItems = allowedItems.splice(0, numItems);
            for (let i = 0; i < shelfItems.length; i++) {
                const shelfItem = shelfItems[i];
                if (shelfItem) {
                    const itemPos = {
                        x: (_b = (_a = ITEM_HSHELF_POSITION[i]) === null || _a === void 0 ? void 0 : _a.x) !== null && _b !== void 0 ? _b : 0,
                        y: (_d = (_c = ITEM_HSHELF_POSITION[i]) === null || _c === void 0 ? void 0 : _c.y) !== null && _d !== void 0 ? _d : 0
                    };
                    itemPos.x = (itemPos.x * SHELF_SCALE) + shelfData.position.x;
                    itemPos.y = (itemPos.y * SHELF_SCALE) + shelfData.position.y;
                    const itemEntity = new ItemEntity(shelfItem, itemPos);
                    // Register the item as an observer of the order loop
                    (_e = this.orderLoop) === null || _e === void 0 ? void 0 : _e.subscribe(itemEntity);
                    // [hack] also determine if the item should be flashing upon instantiation; this method can be loaded after an order is already made active
                    if (this.orderLoop.getCurrentActiveOrder()) {
                        if ((_f = this.orderLoop.getCurrentActiveOrder()) === null || _f === void 0 ? void 0 : _f.hasItem(itemEntity.getItemType())) {
                            itemEntity.enablePulsing();
                        }
                    }
                    sceneManager.addEntity(itemEntity);
                    this.collisionSystem.addEntity(itemEntity);
                    this.localEntities.push(itemEntity);
                }
            }
            this.localEntities.push(shelf);
            sceneManager.addEntity(shelf);
            this.collisionSystem.addEntity(shelf);
        }
        /* Create door triggers */
        if (player) {
            const playerBoundingBox = player.getComponent(BoundingBox);
            if (!playerBoundingBox) {
                throw new Error("Player is missing a BoundingBox component");
            }
            for (const door of this.roomData.doors) {
                if (this.allowedRoomIds.includes(door.targetSceneId)) {
                    const trigger = new DoorTrigger(door.position, door.size, door.targetSceneId, door.direction, sceneManager, playerBoundingBox);
                    this.localEntities.push(trigger);
                    sceneManager.addEntity(trigger);
                    this.collisionSystem.addEntity(trigger);
                }
            }
        }
        /* Delivery Entity */
        const deliveryPOS = this.roomData.deliveryEntityPosition;
        if (deliveryPOS) {
            const deliveryEntity = new DeliveryController(deliveryPOS, 1);
            this.localEntities.push(deliveryEntity);
            sceneManager.addEntity(deliveryEntity);
            this.collisionSystem.addEntity(deliveryEntity);
            if (this.roomData.isParkingLot) {
                const tempDeliveryPos = { x: -400, y: 200 };
                // const vehicle = new VehicleEntity(
                //   {x: 0, y: this.roomData.deliveryEntityPosition?.y ?? 50}, 
                //   8, 
                //   this.roomData.deliveryEntityPosition ?? tempDeliveryPos
                // )
                // sceneManager.addEntity(vehicle);
                // this.collisionSystem.addEntity(vehicle);
                // this.localEntities.push(vehicle);
                // if (vehicle.getMovementSystem().getPosition().x > 1200) {
                //   const vehicle = new VehicleEntity(
                //   {x: 0, y: this.roomData.deliveryEntityPosition?.y ?? 50}, 
                //   6, 
                //   this.roomData.deliveryEntityPosition ?? tempDeliveryPos
                //   )
                // }
            }
        }
        /* Blood splatters */
        for (const bloodPos of this.roomData.bloodLocations) {
            const blood = new BloodController(bloodPos);
            sceneManager.addEntity(blood);
            this.collisionSystem.addEntity(blood);
            this.localEntities.push(blood);
        }
        /* Floor texture */
        if (this.roomData.isParkingLot) {
            const vehicle = new VehicleEntity({ x: 510, y: 200 }, 8);
            sceneManager.addEntity(vehicle);
            this.collisionSystem.addEntity(vehicle);
            this.localEntities.push(vehicle);
            /** Create bush for collision handling */
            const bush = new Bush();
            sceneManager.addEntity(bush);
            this.localEntities.push(bush);
            this.collisionSystem.addEntity(bush);
            /** Create balls for collision handling */
            const ball1Pos = new staticPositionComponent({ x: 32, y: 37 });
            const ball2Pos = new staticPositionComponent({ x: 352, y: 37 });
            const ball3Pos = new staticPositionComponent({ x: 848, y: 37 });
            const ball4Pos = new staticPositionComponent({ x: 1168, y: 37 });
            const ball1 = new Ball(ball1Pos);
            const ball2 = new Ball(ball2Pos);
            const ball3 = new Ball(ball3Pos);
            const ball4 = new Ball(ball4Pos);
            sceneManager.addEntity(ball1);
            sceneManager.addEntity(ball2);
            sceneManager.addEntity(ball3);
            sceneManager.addEntity(ball4);
            this.localEntities.push(ball1);
            this.localEntities.push(ball2);
            this.localEntities.push(ball3);
            this.localEntities.push(ball4);
            this.collisionSystem.addEntity(ball1);
            this.collisionSystem.addEntity(ball2);
            this.collisionSystem.addEntity(ball3);
            this.collisionSystem.addEntity(ball4);
            // const ballPositions: XY[] = [
            //   { x: 32, y: 37 }, { x: 352, y: 37 },
            //   { x: 848, y: 37 }, { x: 1168, y: 37 }
            // ];
            // for (const ballPos of ballPositions) {
            //   const ball = new Ball(ballPos);
            //   sceneManager.addEntity(ball);
            //   this.localEntities.push(ball);
            //   this.collisionSystem.addEntity(ball);
            //   console.debug("Ball created at " + ballPos.x + ", " + ballPos.y);
            // }
            /** Create parking lot sprite */
            const lot = new ParkingLot();
            sceneManager.addEntity(lot);
            this.collisionSystem.addEntity(lot);
            this.localEntities.push(lot);
        }
        else {
            const floor = new StoreFloor();
            sceneManager.addEntity(floor);
            this.collisionSystem.addEntity(floor);
            this.localEntities.push(floor);
        }
    }
    /**
     * Called when the player returns to this room.
     * Re-registers cached entities with the SceneManager
     * so they get updated and drawn again — without
     * recreating them from scratch.
     */
    onResume(sceneManager) {
        console.log("Resuming " + this.roomData.sceneId);
        // Reposition player
        const existingPlayer = sceneManager.getLevelEntities().find(entity => entity instanceof PlayerController);
        if (existingPlayer) {
            const player = existingPlayer;
            const movementComponent = player.getComponent(MovementComponent);
            if (movementComponent) {
                this.movePlayer(movementComponent);
            }
        }
        // Re-add room entities
        for (const entity of this.localEntities) {
            console.log("Re-adding entity:", entity.constructor.name);
            sceneManager.addEntity(entity);
            this.collisionSystem.addEntity(entity);
        }
        console.log("onResume complete");
    }
    /**
     * Handles exiting the room by removing
     * entities from the core systems.
     */
    onExit() {
        //remove all room entities from collision system when leaving
        for (const entity of this.localEntities) {
            this.collisionSystem.removeEntity(entity);
        }
    }
    update(context) { }
    draw(context) { }
    movePlayer(movementComponent) {
        // if (this.roomData.defaultSpawn) { // if a default spawn is used, 
        //   movementComponent.setPosition({
        //     x: this.roomData.defaultSpawn.x,
        //     y: this.roomData.defaultSpawn.y
        //   });
        // }
        const currentPosition = {
            x: movementComponent.getPosition().x,
            y: movementComponent.getPosition().y
        };
        const spawnPts = this.roomData.spawnPoints.slice();
        // invert coordinates to calculate proper destination
        currentPosition.x = Math.abs(currentPosition.x - this.roomData.roomWidth);
        currentPosition.y = Math.abs(currentPosition.y - this.roomData.roomHeight);
        const nearestPoint = spawnPts.reduce((nearest, candidate) => {
            const distanceTo = (point) => Math.hypot(point.x - currentPosition.x, point.y - currentPosition.y);
            return distanceTo(candidate) < distanceTo(nearest) ? candidate : nearest;
        });
        movementComponent.setPosition({
            x: nearestPoint.x,
            y: nearestPoint.y
        });
    }
}
