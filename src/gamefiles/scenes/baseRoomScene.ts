import { GameContext, IEntity, IPosition, IScene } from "../../classinterfaces.ts";
import { CollisionSystem } from "../../collisionsys.ts";
import GameEngine from "../../gameengine.ts";
import { InputSystem } from "../../inputsys.ts";
import SceneManager from "../../sceneManager.ts";
import { XY } from "../../typeinterfaces.ts";
import { ASSET_MANAGER } from "../main.ts";
import { PlayerController } from "../player/playerController.ts";
import { ShelfController, SHELF_WIDTH, SHELF_HEIGHT, SHELF_SCALE } from "../shelves/shelfController.ts";
import { DoorTrigger } from "./doorTrigger.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { MovementComponent } from "../../componentLibrary/movementComponent.ts";
import { DoorData, roomData, ShelfData } from "./roomData.ts";
import { ItemType } from "../ordermanagement/itemTypes.ts";
import { ItemEntity, ITEM_WIDTH, ITEM_HEIGHT } from "../ordermanagement/itemEntity.ts";
import { DeliveryController } from "../deliveryEntity/deliveryController.ts";
import { monsterAssets } from "../assetlist.ts";
import { MonsterEntity } from "../monster/monsterEntity.ts";
import { MonsterMovementSystem } from "../monster/monsterMovementSystem.ts";
import { StoreFloor } from "./storeInterior/storeFloorController.ts";
import { BloodController } from "./storeInterior/bloodSplatterController.ts";
import { ShelfShadow } from "./storeInterior/shelfShadowController.ts";
import { UpdatePoint } from "../monster/updatePointEntity.ts";
import { WallEntity } from "./wallEntity.ts";
import { staticPositionComponent } from "../../componentLibrary/staticPositionComponent.ts";
import { ParkingLot } from "./storeExterior/parkingLotController.ts";
import { Ball } from "./storeExterior/ballController.ts";
import { Bush } from "./storeExterior/bushController.ts";
import { VehicleEntity } from "./storeExterior/vehicleEntity.ts";
import { VehicleState } from "./storeExterior/vehicleMovementSystem.ts";

/** Coordinate on actual shelves describing where items can be placed before scaling  */
const ITEM_HSHELF_POSITION: XY[] = [
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
export class BaseRoomScene implements IScene {
  protected roomData: roomData;

  protected inputSystem: InputSystem;
  protected collisionSystem: CollisionSystem;
  protected localEntities: IEntity[];
  protected allowedRoomIds: string[];

  constructor(game: GameEngine, roomData: roomData, allowedRoomIds: string[]) {
    this.roomData = roomData;

    this.inputSystem = game.getInputSystem();
    this.collisionSystem = game.getCollisionSystem();
    this.localEntities = [];
    this.allowedRoomIds = allowedRoomIds;
  }

  /**
   * Loads scene data and adds them as actual instances
   * to the scene manager.
   * @param sceneManager Scene manager
   */
  onEnter(sceneManager: SceneManager): void {
    console.log("Loading scene " + this.roomData.sceneId);

    // Attempt to find the current player
    let player: PlayerController | null;
    const existingPlayer = sceneManager.getLevelEntities().find(
      entity => entity instanceof PlayerController
    );

    if (existingPlayer) {
      player = existingPlayer as PlayerController;

      // Reuse existing player, just update spawn point
      player = existingPlayer as PlayerController;
      const movementComponent = player.getComponent(MovementComponent);
      if (movementComponent) {
        this.movePlayer(movementComponent);
        /* Create and load monsters */
        for (const monsterSpawn of this.roomData.monsterSpawns) {
          const monster = new MonsterEntity(
            monsterSpawn,
            5,
            movementComponent,
            this.roomData.updatePoints.slice()
          ); // FIGURE OUT HOW TO INTEGRATE MOVEMENT SYSTEM PROPERLY
          sceneManager.addEntity(monster);
          this.localEntities.push(monster);
          this.collisionSystem.addEntity(monster);
        }
      }
    } else {
      player = null;
      console.error("Player not found during scene load");
    }

    /* Create update points */
    for (const updatePoint of this.roomData.updatePoints) {
      const pointTrigger = new UpdatePoint(
        updatePoint
      );
      this.localEntities.push(pointTrigger);
      sceneManager.addEntity(pointTrigger);
      this.collisionSystem.addEntity(pointTrigger);
    }

    /* Create walls */
    const topWall = new WallEntity(
      new staticPositionComponent({ x: 0, y: 0 }),
      1280, 3, 5
    );
    const bottomWall = new WallEntity(
      new staticPositionComponent({ x: 0, y: 705 }),
      1280, 3, 5
    );
    const leftWall = new WallEntity(
      new staticPositionComponent({ x: 0, y: 0 }),
      3, 720, 5
    );
    const rightWall = new WallEntity(
      new staticPositionComponent({ x: 1265, y: 0 }),
      3, 720, 5
    );

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
          const itemPos: XY = {
            x: ITEM_HSHELF_POSITION[i]?.x ?? 0,
            y: ITEM_HSHELF_POSITION[i]?.y ?? 0
          };

          itemPos.x = (itemPos.x * SHELF_SCALE) + shelfData.position.x;
          itemPos.y = (itemPos.y * SHELF_SCALE) + shelfData.position.y;

          const itemEntity = new ItemEntity(shelfItem, itemPos);
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
          const trigger = new DoorTrigger(
            door.position,
            door.size,
            door.targetSceneId,
            door.direction,
            sceneManager,
            playerBoundingBox
          );
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
        const tempDeliveryPos: XY = { x: -400, y: 200 }

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
      const vehicle = new VehicleEntity(
        { x: 510, y: 200 },
        8
      )
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

    } else {
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
  onResume(sceneManager: SceneManager): void {
    console.log("Resuming " + this.roomData.sceneId);
    // Reposition player
    const existingPlayer = sceneManager.getLevelEntities().find(
      entity => entity instanceof PlayerController
    );

    if (existingPlayer) {
      const player = existingPlayer as PlayerController;
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
  onExit(): void {
    //remove all room entities from collision system when leaving
    for (const entity of this.localEntities) {
      this.collisionSystem.removeEntity(entity);
    }
  }

  update(context: GameContext): void {}
  draw(context: GameContext): void {}
  
  private movePlayer(movementComponent: MovementComponent) {
    // if (this.roomData.defaultSpawn) { // if a default spawn is used, 
    //   movementComponent.setPosition({
    //     x: this.roomData.defaultSpawn.x,
    //     y: this.roomData.defaultSpawn.y
    //   });
    // }
    const currentPosition: XY = {
      x: movementComponent.getPosition().x,
      y: movementComponent.getPosition().y
    };
    const spawnPts = this.roomData.spawnPoints.slice();

    // invert coordinates to calculate proper destination
    currentPosition.x = Math.abs(currentPosition.x - this.roomData.roomWidth);
    currentPosition.y = Math.abs(currentPosition.y - this.roomData.roomHeight);

    const nearestPoint = spawnPts.reduce((nearest: XY, candidate: XY) => {
      const distanceTo = (point: XY) => Math.hypot(point.x - currentPosition.x, point.y - currentPosition.y);
      return distanceTo(candidate) < distanceTo(nearest) ? candidate : nearest;
    });
    movementComponent.setPosition({
      x: nearestPoint.x,
      y: nearestPoint.y
    });
  }
  
}
