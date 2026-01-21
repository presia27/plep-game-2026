import { XY } from "../typeinterfaces.ts";
import { GameContext, IComponent, IPosition } from "../classinterfaces.ts";

/**
 * A component that records the position of an entity.
 * This is a slimmed-down version of the MovementComponent
 * for entities that don't move.
 */
export class staticPositionComponent implements IComponent, IPosition {
  private position: XY;

  constructor(position: XY) {
    this.position = position;
  }

  public update(context: GameContext): void {
    return;
  }

  public getPosition(): XY {
    return this.position;
  }

  public setPosition(pos: XY): void {
    this.position = pos;
  }
}