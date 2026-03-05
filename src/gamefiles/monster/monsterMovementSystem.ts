import { GameContext, IComponent, IPosition } from "../../classinterfaces.ts";
import { MovementComponent } from "../../componentLibrary/movementComponent.ts";
import { VelocityCommand, XY } from "../../typeinterfaces.ts";

export class MonsterMovementSystem implements IComponent {
    private movementComponent: MovementComponent;
    private speed: number;
    private playerPosition: IPosition;
    private currentDirection: {x: number, y: number} = {x: 1, y: 0};
    private pendingDirection: {x: number, y: number} = {x: 1, y: 0};

    constructor(movementComponent: MovementComponent, speed: number = 200, playerPosition: IPosition) {
        this.movementComponent = movementComponent;
        this.speed = speed;
        this.playerPosition = playerPosition;
    }

    public update(context: GameContext): void {
        const direction = {x: 0, y: 0};
        const playerPos = this.playerPosition.getPosition();
        
        this.moveToward(playerPos.x, playerPos.y);
        this.movementComponent.setVelocityCommand({
            direction: this.currentDirection,
            magnitude: this.speed
        });
    }

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
    public forceDirection(dir: {x: number, y: number}): void {
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

    // NOTE: NOT SURE IF THIS IS THE RIGHT WAY TO DO THIS
    public isMovingUp(): boolean {
        if (this.movementComponent.getCurrentDirection().y < 0)
            return true;
        else
            return false;
    }
    public isMovingDown(): boolean {
        if (this.movementComponent.getCurrentDirection().y > 0)
            return true;
        else
            return false;
    }
    public isMovingRight(): boolean {
        if (this.movementComponent.getCurrentDirection().x > 0)
            return true;
        else
            return false;
    }
    public isMovingLeft(): boolean {
        if (this.movementComponent.getCurrentDirection().x < 0)
            return true;
        else
            return false;
    }
}

