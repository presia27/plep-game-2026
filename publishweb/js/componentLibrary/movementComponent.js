/**
 * Movement system, written by Claude AI and
 * For reference, speeds are calculated as pixels per second.
 * modified by Preston Sia (presia27)
 */
export class MovementComponent {
    constructor(position, speed = 100) {
        this.velocity = { x: 0, y: 0 };
        this.velocityCommand = null;
        this.position = position;
    }
    setVelocityCommand(command) {
        this.velocityCommand = command;
    }
    update(context) {
        if (this.velocityCommand) {
            const direction = this.velocityCommand.direction;
            const speed = this.velocityCommand.magnitude;
            this.velocity.x = direction.x * speed;
            this.velocity.y = direction.y * speed;
        }
        else {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
        this.position.x += this.velocity.x * context.clockTick;
        this.position.y += this.velocity.y * context.clockTick;
    }
    getPosition() {
        return this.position;
    }
    setPosition(pos) {
        this.position = pos;
    }
    getVelocity() {
        return this.velocity;
    }
    getSpeed() {
        return Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
    }
    /**
     * Return a direction vector
     */
    getCurrentDirection() {
        const magnitude = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (magnitude === 0)
            return { x: 0, y: 0 };
        return {
            x: this.velocity.x / magnitude,
            y: this.velocity.y / magnitude
        };
    }
    /**
     * Return a direction in radians
     */
    getCurrentDirectionRadians() {
        return Math.atan2(this.velocity.y, this.velocity.x);
    }
    /**
     * Return a direction in degrees
     */
    getCurrentDirectionDegrees() {
        return this.getCurrentDirectionRadians() * (180 / Math.PI);
    }
}
