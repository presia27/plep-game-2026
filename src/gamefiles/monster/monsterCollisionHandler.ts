import { GameContext, IComponent, IEntity } from "../../classinterfaces.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { AbstractCollisionHandler } from "../../componentLibrary/AbstractCollisionHandler.ts";
import { MovementComponent } from "../../componentLibrary/movementComponent.ts";
import { ISize } from "../../classinterfaces.ts";
import { ShelfController } from "../shelves/shelfController.ts";
import { InputSystem } from "../../inputsys.ts";
import { PlayerController } from "../player/playerController.ts";
import { MonsterMovementSystem } from "./monsterMovementSystem.ts";
import { UpdatePoint } from "./updatePointEntity.ts";
import { WallEntity } from "../scenes/wallEntity.ts";
import { XY } from "../../typeinterfaces.ts";

/* dont let the monster update its position on an update point more than once in the span of sthis amount of frames */
const UPDATE_POINT_COOLDOWN_FRAMES: number = 30;
/* if the monster doesnt hit an update point within this amt of time, it is stuck */ 
const STUCK_THRESHOLD_FRAMES: number = 1500; 

const AXIS_ALIGN_THRESHOLD: number = 10;

/**
 * Monster collision handler that prevents the monster from moving through solid objects
 * Based on the player collision handler
 * @author Emma Szebenyi, Claude Sonnet 4.6
 */
export class MonsterCollisionHandler extends AbstractCollisionHandler {
  private boundingBox: BoundingBox;
  private movementComponent: MovementComponent;
  private sizeComponent: ISize;
  private movementSys: MonsterMovementSystem;

  private hitWallThisFrame: boolean = false; // flag to check if the monster has hit a wall 

  private updatePointCooldown: number = 0; 
  //private readonly UPDATE_POINT_COOLDOWN_FRAMES: number = 30; // dont let the monster update its position on an update point more than once in the span of sthis amount of frames

  private framesWithoutUpdatePoint: number = 0;
  //private readonly STUCK_THRESHOLD_FRAMES: number = 1500; // if the monster doesnt hit an update point within this amt of time, it is stuck
  
  // points the monster can walk to if it gets stuck
  private RECOVERY_POINTS: XY[] = [
    {x: 50, y: 40}, {x: 1150, y: 40}, 
    {x: 50, y: 600}, {x: 1150, y: 600}, 
    {x: 600, y: 350}
  ]; 
  
  private isRecovering: boolean = false;
  private recoveryTarget: XY | null = null;
  
  /**
   * A monster collision handler that deals with moving around the room
   * 
   * @param boundingBox the bounding box for the monster
   * @param movementComponent movement system
   * @param sizeComponent size of monster
   * @param movementSys movement system
   */
  constructor(boundingBox: BoundingBox, movementComponent: MovementComponent, sizeComponent: ISize, movementSys: MonsterMovementSystem) {
    super();
    this.boundingBox = boundingBox;
    this.movementComponent = movementComponent;
    this.sizeComponent = sizeComponent;
    this.movementSys = movementSys;
  }

  override handleCollision(other: IEntity, otherBounds: BoundingBox): void {
    this.hitWallThisFrame = false;
    const pos = this.movementComponent.getPosition();
    const bbWidth = this.boundingBox.getRight() - this.boundingBox.getLeft();
    const bbHeight = this.boundingBox.getBottom() - this.boundingBox.getTop();
    const xOffset = this.boundingBox.getOffsetX();
    const yOffset = this.boundingBox.getOffsetY();

    const monsterLeft = this.boundingBox.getLeft();
    const monsterRight = this.boundingBox.getRight();
    const monsterTop = this.boundingBox.getTop();
    const monsterBottom = this.boundingBox.getBottom();

    // Do not allow walking through the following objects
    if (other instanceof ShelfController) {
      // ... existing position correction code ...
      //this.movementSys.applyPendingDirection();
      const shelfLeft = otherBounds.getLeft();
      const shelfRight = otherBounds.getRight();
      const shelfTop = otherBounds.getTop();
      const shelfBottom = otherBounds.getBottom();

      // Calculate overlap on each axis
      const overlapLeft = monsterRight - shelfLeft;
      const overlapRight = shelfRight - monsterLeft;
      const overlapTop = monsterBottom - shelfTop;
      const overlapBottom = shelfBottom - monsterTop;

      // Find the smallest overlap to determine which side to push out from
      const minOverlapX = Math.min(overlapLeft, overlapRight);
      const minOverlapY = Math.min(overlapTop, overlapBottom);

      // Push the monster out on the axis with smallest penetration
      if (minOverlapX < minOverlapY) {
        if (overlapLeft < overlapRight) {
          pos.x = shelfLeft - (xOffset + bbWidth);
        } else {
          pos.x = shelfRight - xOffset;
        }
      } else {
        if (overlapTop < overlapBottom) {
          pos.y = shelfTop - (yOffset + bbHeight);
        } else {
          pos.y = shelfBottom - yOffset;
        }
      }
      this.movementComponent.setPosition(pos);
      this.incrementStuckTimer();
    }

    // handle player collision
    if (other instanceof PlayerController) {
      const player = other as PlayerController;
      console.log("Monster ran into player");
    }

    if (other instanceof WallEntity && this.updatePointCooldown <= 0) {
      const wallLeft = otherBounds.getLeft();
      const wallRight = otherBounds.getRight();
      const wallTop = otherBounds.getTop();
      const wallBottom = otherBounds.getBottom();

      const overlapLeft = monsterRight - wallLeft;
      const overlapRight = wallRight - monsterLeft;
      const overlapTop = monsterBottom - wallTop;
      const overlapBottom = wallBottom - monsterTop;

      const minOverlapX = Math.min(overlapLeft, overlapRight);
      const minOverlapY = Math.min(overlapTop, overlapBottom);

      if (minOverlapX < minOverlapY) {
        if (overlapLeft < overlapRight)
          pos.x = wallLeft - (xOffset + bbWidth);
        else
          pos.x = wallRight - xOffset;
      } else {
        if (overlapTop < overlapBottom)
          pos.y = wallTop - (yOffset + bbHeight);
        else
          pos.y = wallBottom - yOffset;
      }
      this.movementComponent.setPosition(pos);
      this.movementSys.reverseDirection();
      this.hitWallThisFrame = true;
      this.updatePointCooldown = UPDATE_POINT_COOLDOWN_FRAMES;
      this.incrementStuckTimer();
    }

    if (other instanceof UpdatePoint && !this.hitWallThisFrame && this.updatePointCooldown <= 0 && this.isRecovering == false) {
      const snapPos = other.getPosition();
      const monsterPos = this.movementComponent.getPosition();
      const newDir = this.movementSys.getPendingDirection();

      const SNAP_THRESHOLD = 5;

      if (newDir.x !== 0) {
        // Moving horizontally, snap Y if close enough
        if (Math.abs(monsterPos.y - snapPos.y) < SNAP_THRESHOLD)
          monsterPos.y = snapPos.y;
      } else {
        // Moving vertically, snap X if close enough
        if (Math.abs(monsterPos.x - snapPos.x) < SNAP_THRESHOLD)
          monsterPos.x = snapPos.x;
      }

      this.movementComponent.setPosition(monsterPos);
      this.movementSys.applyPendingDirection();
      this.updatePointCooldown = UPDATE_POINT_COOLDOWN_FRAMES;
      this.resetStuckTimer();
    }

    if (this.isRecovering) {
      this.walkToNearestCorner();
    }
  }

  public decrementCooldown(): void {
    if (this.updatePointCooldown > 0) this.updatePointCooldown--;
  }

  public resetHitWall(): void {
    this.hitWallThisFrame = false;
  }

  public incrementStuckTimer(): void {
    if (this.isRecovering) return;
    this.framesWithoutUpdatePoint++;
    if (this.framesWithoutUpdatePoint >= STUCK_THRESHOLD_FRAMES) {
      this.isRecovering = true;
      this.walkToNearestCorner();
    }
  }

  public resetStuckTimer(): void {
    this.framesWithoutUpdatePoint = 0;
    this.isRecovering = false;
  }

  private walkToNearestCorner(): void {
    const monsterPos = this.movementComponent.getPosition();
    let nearest: XY | null = null;
    let nearestDist = Infinity;

    
    for (const point of this.RECOVERY_POINTS) {
      const px = point.x;
      const py = point.y;
      const dist = Math.sqrt((px - monsterPos.x) ** 2 + (py - monsterPos.y) ** 2);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = point;
      }
    }

    if (nearest) {
      const dx = nearest.x - monsterPos.x;
      const dy = nearest.y - monsterPos.y;

      // Check if we've reached the target
      if (Math.abs(dx) < AXIS_ALIGN_THRESHOLD && Math.abs(dy) < AXIS_ALIGN_THRESHOLD) {
        this.resetStuckTimer(); // exit recovery mode
        return;
      }
      
      // First align on whichever axis is further, then the other
      if (Math.abs(dx) > AXIS_ALIGN_THRESHOLD) {
        // Walk horizontally first
        this.movementSys.forceDirection({ x: dx > 0 ? 1 : -1, y: 0 });
      } else if (Math.abs(dy) > AXIS_ALIGN_THRESHOLD) {
        // Then walk vertically
        this.movementSys.forceDirection({ x: 0, y: dy > 0 ? 1 : -1 });
      }
    }
    
  }
}

export class MonsterCollisionFrameResetter implements IComponent {
  private handler: MonsterCollisionHandler;

  constructor(handler: MonsterCollisionHandler) {
    this.handler = handler;
  }

  public update(context: GameContext): void {
    this.handler.resetHitWall();
    this.handler.decrementCooldown();
    this.handler.incrementStuckTimer();
  }
}
