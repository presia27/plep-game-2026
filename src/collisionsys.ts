import { IEntity } from "./classinterfaces.ts";
import { AbstractCollisionHandler } from "./componentLibrary/AbstractCollisionHandler.ts";
import { BoundingBox } from "./componentLibrary/boundingBox.ts";

/**
 * Describes a pair of entities which have collided
 * and their bounding boxes
 */
interface CollisionPair {
  entityA: IEntity;
  entityB: IEntity;
  boundingBoxA: BoundingBox;
  boundingBoxB: BoundingBox;
}

/**
 * Collision system which monitors all
 * collidable entities for collisions between
 * them and signals their respective collision
 * handlers of a collision event.
 */
export class CollisionSystem {
  private entities: IEntity[] = [];

  public addEntity(entity: IEntity): void {
    this.entities.push(entity);
  }

  /**
   * Performs a narrow phase collision check
   * on all entities registered with the system.
   */
  public checkCollisions(): void {
    const collisionPairs: CollisionPair[] = [];

    for (let i = 0; i < this.entities.length; i++) {
      const entityA = this.entities[i];
      const boundsA = entityA?.getComponent(BoundingBox);
      if (!entityA || !boundsA) continue;

      for (let j = i + 1; j < this.entities.length; j++) {
        const entityB = this.entities[j];
        const boundsB = entityB?.getComponent(BoundingBox);
        if (!entityB || !boundsB) continue;

        if (boundsA.collide(boundsB)) {
          collisionPairs.push({
            entityA: entityA,
            entityB: entityB,
            boundingBoxA: boundsA,
            boundingBoxB: boundsB
          })
        }
      }
    }

    for (const collision of collisionPairs) {
      this.notifyCollisions(collision);
    }
  }

  /**
   * Notifies entities that a collision occured with
   * references to the other entity and bounding box
   * @param pair CollisionPair with the 2 entities that collided
   */
  private notifyCollisions(pair: CollisionPair): void {
    const handlerA = pair.entityA.getComponent(AbstractCollisionHandler);
    const handlerB = pair.entityB.getComponent(AbstractCollisionHandler);
    handlerA?.handleCollision(pair.entityB, pair.boundingBoxB);
    handlerB?.handleCollision(pair.entityA, pair.boundingBoxA);
  }
}