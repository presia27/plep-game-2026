import { IComponent, ILifecycle } from "../classinterfaces.ts";

/**
 * Basic lifecycle component that stores the living state of an object.
 * Feel free to implement your own more complex version by extending this version.
 */
export class BasicLifecycle implements IComponent, ILifecycle {
  private alive: boolean = true;

  public isAlive(): boolean {
    return this.alive;
  }

  public die(): void {
    this.alive = false;
  }

  public revive(): void {
    this.alive = true;
  }

  public update(): void {
    return;
  }
}