import { GameContext, IComponent } from "../classinterfaces.ts";
import { MovementComponent } from "./movementComponent.ts";
import { VelocityCommand } from "../typeinterfaces.ts";
import { InputSystem } from "../inputsys.ts";
import { InputAction } from "../inputactionlist.ts";

/**
 * Player controller component that handles WASD input
 * and translates it into movement commands
 * @author Preston Sia
 */
export class PlayerController implements IComponent {
  private movementComponent: MovementComponent;
  private inputSystem: InputSystem;
  private speed: number;

  constructor(movementComponent: MovementComponent, inputSystem: InputSystem, speed: number = 200) {
    this.movementComponent = movementComponent;
    this.inputSystem = inputSystem;
    this.speed = speed;
  }

  public update(context: GameContext): void {
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
      
      const velocityCommand: VelocityCommand = {
        direction: direction,
        magnitude: this.speed
      };
      this.movementComponent.setVelocityCommand(velocityCommand);
    } else {
      this.movementComponent.setVelocityCommand(null);
    }
  }
}
