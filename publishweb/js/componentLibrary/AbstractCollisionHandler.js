/**
 * This is an abstract class for handling collision events.
 * Each entity should have its own extended sub-implementation
 * of this class to handle its specific collision behavior.
 * Implement this behavior in an overriding handleCollision()
 * method.
 *
 * @author Preston Sia
 */
export class AbstractCollisionHandler {
    update(context) {
        return;
    }
    handleCollision(oth, boundingBox) {
        // empty method to be overridden
    }
}
