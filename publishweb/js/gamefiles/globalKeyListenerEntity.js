/**
 * Special entity used to listen for certain keys to perform
 * certain actions, such as pausing and unpausing the game
 */
import { Entity } from "../entity.js";
import { TOGGLE_PAUSE } from "../gameStateEventTrigger.js";
import { InputAction } from "../inputactionlist.js";
export class GlobalKeyListenerEntity extends Entity {
    constructor(inputSystem, eventTrigger) {
        super();
        this.inputSystem = inputSystem;
        this.eventTrigger = eventTrigger;
    }
    update(context) {
        if (this.inputSystem.isActionActiveSingle(InputAction.PAUSE)) {
            this.eventTrigger.assertChange(null, TOGGLE_PAUSE);
        }
    }
}
