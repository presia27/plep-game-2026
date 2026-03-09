/**
 * Special entity used to listen for certain keys to perform
 * certain actions, such as pausing and unpausing the game
 */

import { GameContext } from "../classinterfaces";
import { Entity } from "../entity.ts";
import { GameStateEventTrigger, TOGGLE_PAUSE } from "../gameStateEventTrigger.ts";
import { InputAction } from "../inputactionlist.ts";
import { InputSystem } from "../inputsys.ts";

export class GlobalKeyListenerEntity extends Entity {
  private inputSystem: InputSystem;
  private eventTrigger: GameStateEventTrigger;

  constructor(inputSystem: InputSystem, eventTrigger: GameStateEventTrigger) {
    super();

    this.inputSystem = inputSystem;
    this.eventTrigger = eventTrigger;
  }

  public override update(context: GameContext): void {
    if (this.inputSystem.isActionActiveSingle(InputAction.PAUSE)) {
      this.eventTrigger.assertChange(null, TOGGLE_PAUSE);
    }
  }
}
