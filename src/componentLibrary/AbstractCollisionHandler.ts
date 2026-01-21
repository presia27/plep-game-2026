import { GameContext, IComponent, IEntity } from "../classinterfaces.ts";
import { BoundingBox } from "./boundingBox.ts";

/**
 * This is an abstract class for handling collision events.
 * Each entity should have its own extended sub-implementation
 * of this class to handle its specific collision behavior.
 * Implement this behavior in an overriding handleCollision()
 * method.
 * 
 * @author Preston Sia
 */
export class AbstractCollisionHandler implements IComponent {
  update(context: GameContext): void {
    return;
  }

  handleCollision(oth: IEntity, boundingBox: BoundingBox): void {
    // empty method to be overridden
  }
}