import AssetManager from "../../assetmanager.ts";
import { BasicSize } from "../../componentLibrary/BasicSize.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { MovementComponent } from "../../componentLibrary/movementComponent.ts";
import { Entity } from "../../entity.ts";
import { XY } from "../../typeinterfaces.ts";
import { MonsterSpriteRenderer } from "./monsterSpriteRenderer.ts";
import { MonsterCollisionFrameResetter, MonsterCollisionHandler } from "./monsterCollisionHandler.ts";
import { MonsterMovementSystem } from "./monsterMovementSystem.ts";
import { IPosition } from "../../classinterfaces.ts";
import { ASSET_MANAGER } from "../main.ts";
import SceneManager from "../../sceneManager.ts";

// CONSTANTS
const MONSTER_SPEED: number = 200;
const MONSTER_WIDTH: number = 20;
const MONSTER_HEIGHT: number = 19;
const MONSTER_BOUND_X: number = 14;
const MONSTER_BOUND_Y: number = 17;
const MONSTER_BOUND_OFFSET_X: number = 13;
const MONSTER_BOUND_OFFSET_Y: number = 11;

/**
 * This is the main entity controller for the monster.
 * Logic is included to add components representing the monster,
 * with the ability to add additional state directly. Any 
 * sharable logic should be added as a component, while
 * state specific to the monster can be added here.
 * 
 * @author Emma Szebenyi
 */
export class MonsterEntity extends Entity {
  constructor(
    defaultXY: XY,
    scale: number,
    playerPos: IPosition,
    recoveryPoints: XY[]
  ) {
    super();

    // ADD ESSENTIAL LOGIC COMPONENTS
    const monsterMovementAndPosition = new MovementComponent(defaultXY);
    const monsterMovementSys = new MonsterMovementSystem(monsterMovementAndPosition, MONSTER_SPEED, playerPos)
    const monsterSize = new BasicSize(MONSTER_WIDTH, MONSTER_HEIGHT, scale);
    const monsterBoundSize = new BasicSize(MONSTER_BOUND_X, MONSTER_BOUND_Y, scale);
    const monsterBoundingBox = new BoundingBox(monsterMovementAndPosition, monsterBoundSize, MONSTER_BOUND_OFFSET_X, MONSTER_BOUND_OFFSET_Y);
    const monsterCollisionHandler = new MonsterCollisionHandler(monsterBoundingBox, monsterMovementAndPosition, monsterSize, monsterMovementSys, recoveryPoints);
    //const updatePointCollisionHandler = new UpdatePointCollisionHandler(monsterMovementSys);
    const frameResetter = new MonsterCollisionFrameResetter(monsterCollisionHandler);
    super.addComponent(monsterMovementAndPosition)
    // super.addComponent(monsterSize);
    // super.addComponent(monsterBoundSize);
    super.addComponent(monsterBoundingBox);
    super.addComponent(frameResetter); // must be added first so it updates before collisions
    super.addComponent(monsterCollisionHandler);
    super.addComponent(monsterMovementSys);
    //super.addComponent(updatePointCollisionHandler);

    const monsterSprite = ASSET_MANAGER.getImageAsset("monster");
    if (monsterSprite === null) {
      throw new Error("Failed to load asset for the monster");
    }
    const renderer = new MonsterSpriteRenderer(monsterSprite, monsterMovementAndPosition, monsterSize, monsterMovementSys, monsterBoundingBox);
    super.setRenderer(renderer);
  }
}