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
  private speedBias: number;
  private initSpeedBias: number;
  private velocityCommand: VelocityCommand | null = null;

  /**
   * 
   * @param position XY Position coordinate for the default starting position
   * @param speedBiasFactor Increase or decrease entity speed by multiplying by the specified amount (default 1x bias, i.e. no speed change)
   */
  constructor(position: XY, speedBiasFactor: number = 1) {
    this.position = position;
    this.speedBias = Math.max(speedBiasFactor, 0);
    this.initSpeedBias = this.speedBias;
  }

  public setVelocityCommand(command: VelocityCommand | null): void {
    this.velocityCommand = command;
  }

  public update(context: GameContext) {
    if (this.velocityCommand) {
      const direction = this.velocityCommand.direction;
      const speed = this.velocityCommand.magnitude;
      this.velocity.x = direction.x * speed * this.speedBias;
      this.velocity.y = direction.y * speed * this.speedBias;
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

  public getSpeedBias(): number {
    return this.speedBias;
  }

  public setSpeedBias(speed: number): void {
    this.speedBias = Math.max(speed, 0);
  }

  public resetSpeedBias(): void {
    this.speedBias = this.initSpeedBias;
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
