/**
 * Basic lifecycle component that stores the living state of an object.
 * Feel free to implement your own more complex version by extending this version.
 */
export class BasicLifecycle {
    constructor() {
        this.alive = true;
    }
    isAlive() {
        return this.alive;
    }
    die() {
        this.alive = false;
    }
    revive() {
        this.alive = true;
    }
    update() {
        return;
    }
}
