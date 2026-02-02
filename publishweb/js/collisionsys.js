import { AbstractCollisionHandler } from "./componentLibrary/AbstractCollisionHandler.js";
import { BoundingBox } from "./componentLibrary/boundingBox.js";
/**
 * Collision system which monitors all
 * collidable entities for collisions between
 * them and signals their respective collision
 * handlers of a collision event.
 */
export class CollisionSystem {
    constructor() {
        this.entities = [];
    }
    addEntity(entity) {
        this.entities.push(entity);
    }
    /**
     * Performs a narrow phase collision check
     * on all entities registered with the system.
     */
    checkCollisions() {
        const collisionPairs = [];
        for (let i = 0; i < this.entities.length; i++) {
            const entityA = this.entities[i];
            const boundsA = entityA === null || entityA === void 0 ? void 0 : entityA.getComponent(BoundingBox);
            if (!entityA || !boundsA)
                continue;
            for (let j = i + 1; j < this.entities.length; j++) {
                const entityB = this.entities[j];
                const boundsB = entityB === null || entityB === void 0 ? void 0 : entityB.getComponent(BoundingBox);
                if (!entityB || !boundsB)
                    continue;
                if (boundsA.collide(boundsB)) {
                    collisionPairs.push({
                        entityA: entityA,
                        entityB: entityB,
                        boundingBoxA: boundsA,
                        boundingBoxB: boundsB
                    });
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
    notifyCollisions(pair) {
        const handlerA = pair.entityA.getComponent(AbstractCollisionHandler);
        const handlerB = pair.entityB.getComponent(AbstractCollisionHandler);
        handlerA === null || handlerA === void 0 ? void 0 : handlerA.handleCollision(pair.entityB, pair.boundingBoxB);
        handlerB === null || handlerB === void 0 ? void 0 : handlerB.handleCollision(pair.entityA, pair.boundingBoxA);
    }
}
