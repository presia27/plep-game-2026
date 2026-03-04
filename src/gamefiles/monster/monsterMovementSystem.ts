import { GameContext, IComponent, IPosition } from "../../classinterfaces.ts";
import { MovementComponent } from "../../componentLibrary/movementComponent.ts";
import { VelocityCommand } from "../../typeinterfaces.ts";

export class MonsterMovementSystem implements IComponent {
    private movementComponent: MovementComponent;
    private speed: number;
    private playerPosition: IPosition;

    constructor(movementComponent: MovementComponent, speed: number = 200, playerPosition: IPosition) {
        this.movementComponent = movementComponent;
        this.speed = speed;
        this.playerPosition = playerPosition;
    }

    public update(context: GameContext): void {
        const direction = {x: 0, y: 0};
        const playerPos = this.playerPosition.getPosition();

        
        /*
        let opposite: number = playerPos.y - this.movementComponent.getPosition().y;
        let adjacent: number = playerPos.x - this.movementComponent.getPosition().x;
        let angle: number = Math.atan(opposite/adjacent) * 180 / Math.PI;
        if (this.movementComponent.getPosition().x > playerPos.x)
            angle += 180;

        let vx = this.movementComponent.getVelocity().x * Math.cos(angle);
        let vy = this.movementComponent.getVelocity().y * Math.sin(angle);

        let magnitude = Math.sqrt(vx * vx + vy * vy);
        direction.x += vx/magnitude;
        direction.y += vy/magnitude;
        */
       this.moveToward(playerPos.x, playerPos.y, direction);
        
        // if (this.isMovingUp())
        //     direction.y -= 1;
        // else if (this.isMovingDown())
        //     direction.y +=1;
        // else if (this.isMovingRight())
        //     direction.x += 1;
        // else if (this.isMovingLeft())
        //     direction.x -=1;
    }

    public moveToward(targetX: number, targetY: number, direction: {x: number, y: number}): void{
        const dx = targetX - this.movementComponent.getPosition().x;
        const dy = targetY - this.movementComponent.getPosition().y;
        const hyp = Math.sqrt(dx * dx + dy * dy);

        if (hyp > 0) {
            direction.x += dx/hyp;
            direction.y += dy/hyp;
            const velocityCommand: VelocityCommand = {
                direction: direction, 
                magnitude: this.speed
            };
            this.movementComponent.setVelocityCommand(velocityCommand);
        } else {
            this.movementComponent.setVelocityCommand(null);
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

