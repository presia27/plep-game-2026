import { BasicSize } from "../../componentLibrary/BasicSize.js";
import { BoundingBox } from "../../componentLibrary/boundingBox.js";
import { MovementComponent } from "../../componentLibrary/movementComponent.js";
import { Entity } from "../../entity.js";
import { MonsterSpriteRenderer } from "./monsterSpriteRenderer.js";
import { MonsterCollisionFrameResetter, MonsterCollisionHandler } from "./monsterCollisionHandler.js";
import { MonsterMovementSystem } from "./monsterMovementSystem.js";
import { ASSET_MANAGER } from "../main.js";
// CONSTANTS
const MONSTER_SPEED = 200;
const MONSTER_WIDTH = 20;
const MONSTER_HEIGHT = 19;
const MONSTER_BOUND_X = 14;
const MONSTER_BOUND_Y = 17;
const MONSTER_BOUND_OFFSET_X = 13;
const MONSTER_BOUND_OFFSET_Y = 11;
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
    constructor(defaultXY, scale, playerPos, recoveryPoints) {
        super();
        // ADD ESSENTIAL LOGIC COMPONENTS
        const monsterMovementAndPosition = new MovementComponent(defaultXY);
        const monsterMovementSys = new MonsterMovementSystem(monsterMovementAndPosition, MONSTER_SPEED, playerPos);
        const monsterSize = new BasicSize(MONSTER_WIDTH, MONSTER_HEIGHT, scale);
        const monsterBoundSize = new BasicSize(MONSTER_BOUND_X, MONSTER_BOUND_Y, scale);
        const monsterBoundingBox = new BoundingBox(monsterMovementAndPosition, monsterBoundSize, MONSTER_BOUND_OFFSET_X, MONSTER_BOUND_OFFSET_Y);
        const monsterCollisionHandler = new MonsterCollisionHandler(monsterBoundingBox, monsterMovementAndPosition, monsterSize, monsterMovementSys, recoveryPoints);
        //const updatePointCollisionHandler = new UpdatePointCollisionHandler(monsterMovementSys);
        const frameResetter = new MonsterCollisionFrameResetter(monsterCollisionHandler);
        super.addComponent(monsterMovementAndPosition);
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
