import { GameContext, IComponent, ISize } from "../classinterfaces";

/**
 * Very basic size component, suitable for most entities
 * whose physical composition doesn't really change much.
 * Size components describe the physical size of an entity
 * on the canvas space.
 */
export class BasicSize implements IComponent, ISize {
  scale: number;
  width: number;
  height: number;

  constructor(width: number, height: number, scale: number) {
    this.scale = scale;
    this.width = width * scale;
    this.height = height * scale;
  }

  update(context: GameContext): void {
    return;
  }

  getScale(): number {
    return this.scale;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }
}