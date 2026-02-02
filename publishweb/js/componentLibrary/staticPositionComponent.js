/**
 * A component that records the position of an entity.
 * This is a slimmed-down version of the MovementComponent
 * for entities that don't move.
 */
export class staticPositionComponent {
    constructor(position) {
        this.position = position;
    }
    update(context) {
        return;
    }
    getPosition() {
        return this.position;
    }
    setPosition(pos) {
        this.position = pos;
    }
}
