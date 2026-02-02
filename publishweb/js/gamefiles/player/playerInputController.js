import { InputAction } from "../../inputactionlist.js";
/**
 * Player input controller component that handles WASD input
 * and translates it into movement commands
 * @author Preston Sia, pmo
 */
export class PlayerInputController {
    constructor(movementComponent, inputSystem, speed = 200) {
        this.movementComponent = movementComponent;
        this.inputSystem = inputSystem;
        this.speed = speed;
    }
    update(context) {
        const direction = { x: 0, y: 0 };
        // Check WASD input
        if (this.inputSystem.isActionActive(InputAction.MOVE_UP)) {
            direction.y -= 1;
        }
        if (this.inputSystem.isActionActive(InputAction.MOVE_DOWN)) {
            direction.y += 1;
        }
        if (this.inputSystem.isActionActive(InputAction.MOVE_LEFT)) {
            direction.x -= 1;
        }
        if (this.inputSystem.isActionActive(InputAction.MOVE_RIGHT)) {
            direction.x += 1;
        }
        // Normalize diagonal movement
        const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        if (magnitude > 0) {
            direction.x /= magnitude;
            direction.y /= magnitude;
            const velocityCommand = {
                direction: direction,
                magnitude: this.speed
            };
            this.movementComponent.setVelocityCommand(velocityCommand);
        }
        else {
            this.movementComponent.setVelocityCommand(null);
        }
    }
}
