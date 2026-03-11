export class MonsterMovementSystem {
    constructor(movementComponent, speed = 200, playerPosition) {
        this.currentDirection = { x: 1, y: 0 };
        this.pendingDirection = { x: 1, y: 0 };
        this.movementComponent = movementComponent;
        this.speed = speed;
        this.playerPosition = playerPosition;
    }
    update(context) {
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
    applyPendingDirection() {
        this.currentDirection = Object.assign({}, this.pendingDirection);
    }
    getPendingDirection() {
        return this.pendingDirection;
    }
    reverseDirection() {
        this.currentDirection = {
            x: -this.currentDirection.x,
            y: -this.currentDirection.y
        };
    }
    forceDirection(dir) {
        this.currentDirection = Object.assign({}, dir);
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
    moveToward(targetX, targetY) {
        const dx = targetX - this.movementComponent.getPosition().x;
        const dy = targetY - this.movementComponent.getPosition().y;
        const hyp = Math.sqrt(dx * dx + dy * dy);
        if (hyp > 0) {
            // Replace the old diagonal direction with snapped cardinal direction
            if (Math.abs(dx) > Math.abs(dy)) {
                this.pendingDirection = { x: dx > 0 ? 1 : -1, y: 0 };
            }
            else {
                this.pendingDirection = { x: 0, y: dy > 0 ? 1 : -1 };
            }
        }
    }
    // Return whether the monster is moving in specific directions
    isMovingUp() {
        return this.movementComponent.getCurrentDirection().y < 0;
    }
    isMovingDown() {
        return this.movementComponent.getCurrentDirection().y > 0;
    }
    isMovingRight() {
        return this.movementComponent.getCurrentDirection().x > 0;
    }
    isMovingLeft() {
        return this.movementComponent.getCurrentDirection().x < 0;
    }
}
