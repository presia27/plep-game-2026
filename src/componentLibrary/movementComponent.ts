import { GameContext, IComponent, IPosition } from "../classinterfaces.ts";
import { XY, VelocityCommand } from "../typeinterfaces.ts";

/**
 * Movement system, written by Claude AI and
 * For reference, speeds are calculated as pixels per second.
 * modified by Preston Sia (presia27)
 */
export class MovementComponent implements IComponent, IPosition {
  private velocity: XY = { x: 0, y: 0 };
  private position: XY;
  private velocityCommand: VelocityCommand | null = null;

  constructor(position: XY, speed: number = 100) {
    this.position = position;
  }

  public setVelocityCommand(command: VelocityCommand | null): void {
    this.velocityCommand = command;
  }

  public update(context: GameContext) {
    if (this.velocityCommand) {
      const direction = this.velocityCommand.direction;
      const speed = this.velocityCommand.magnitude;
      this.velocity.x = direction.x * speed;
      this.velocity.y = direction.y * speed;
    } else {
      this.velocity.x = 0;
      this.velocity.y = 0;
    }

    this.position.x += this.velocity.x * context.clockTick;
    this.position.y += this.velocity.y * context.clockTick;
  }

  public getPosition(): XY {
    return this.position;
  }

  public setPosition(pos: XY): void {
    this.position = pos;
  }

  public getVelocity(): XY {
    return this.velocity;
  }

  public getSpeed(): number {
    return Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
  }

  /**
   * Return a direction vector
   */
  public getCurrentDirection(): XY {
    const magnitude = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

    if (magnitude === 0) return { x: 0, y: 0};
    return {
      x: this.velocity.x / magnitude,
      y: this.velocity.y / magnitude
    }
  }

  /**
   * Return a direction in radians
   */
  public getCurrentDirectionRadians(): number {
    return Math.atan2(this.velocity.y, this.velocity.x);
  }

  /**
   * Return a direction in degrees
   */
  public getCurrentDirectionDegrees(): number {
    return this.getCurrentDirectionRadians() * (180 / Math.PI);
  }
}
