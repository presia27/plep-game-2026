import { GameContext, IComponent, IPosition } from "../../classinterfaces.ts";
import { MovementComponent } from "../../componentLibrary/movementComponent.ts";
import { XY } from "../../typeinterfaces.ts";

export class MonsterMovementSystem implements IComponent {
  private movementComponent: MovementComponent;
  private speed: number;
  private playerPosition: IPosition;
  private currentDirection: { x: number, y: number } = { x: 1, y: 0 };
  private pendingDirection: { x: number, y: number } = { x: 1, y: 0 };

  constructor(movementComponent: MovementComponent, speed: number = 200, playerPosition: IPosition) {
    this.movementComponent = movementComponent;
    this.speed = speed;
    this.playerPosition = playerPosition;
  }

  public update(context: GameContext): void {
    const playerPos = this.playerPosition.getPosition();

    this.moveToward(playerPos.x, playerPos.y);
    this.movementComponent.setVelocityCommand({
      direction: this.currentDirection,
      magnitude: this.speed
    });
  }

  /**
   * Pending direction is the direction the monster wants to move, 
   * but cannot until hitting an update point. 
   */
  public applyPendingDirection(): void {
    this.currentDirection = { ...this.pendingDirection };
  }
  public getPendingDirection(): XY {
    return this.pendingDirection;
  }
  public reverseDirection(): void {
    this.currentDirection = {
      x: -this.currentDirection.x,
      y: -this.currentDirection.y
    };
  }
  public forceDirection(dir: { x: number, y: number }): void {
    this.currentDirection = { ...dir };
  }

  // public moveToward(targetX: number, targetY: number, direction: {x: number, y: number}): void{
  //     const dx = targetX - this.movementComponent.getPosition().x;
  //     const dy = targetY - this.movementComponent.getPosition().y;
  //     const hyp = Math.sqrt(dx * dx + dy * dy);

  //     if (hyp > 0) {
  //         direction.x += dx/hyp;
  //         direction.y += dy/hyp;
  //         const velocityCommand: VelocityCommand = {
  //             direction: direction, 
  //             magnitude: this.speed
  //         };
  //         this.movementComponent.setVelocityCommand(velocityCommand);
  //     } else {
  //         this.movementComponent.setVelocityCommand(null);
  //     }
  // }

  public moveToward(targetX: number, targetY: number): void {
    const dx = targetX - this.movementComponent.getPosition().x;
    const dy = targetY - this.movementComponent.getPosition().y;
    const hyp = Math.sqrt(dx * dx + dy * dy);

    if (hyp > 0) {
      // Replace the old diagonal direction with snapped cardinal direction
      if (Math.abs(dx) > Math.abs(dy)) {
        this.pendingDirection = { x: dx > 0 ? 1 : -1, y: 0 };
      } else {
        this.pendingDirection = { x: 0, y: dy > 0 ? 1 : -1 };
      }
    }
  }

  // Return whether the monster is moving in specific directions
  public isMovingUp(): boolean {
    return this.movementComponent.getCurrentDirection().y < 0;
  }
  public isMovingDown(): boolean {
    return this.movementComponent.getCurrentDirection().y > 0;
  }
  public isMovingRight(): boolean {
    return this.movementComponent.getCurrentDirection().x > 0;
  }
  public isMovingLeft(): boolean {
    return this.movementComponent.getCurrentDirection().x < 0;
  }
}

