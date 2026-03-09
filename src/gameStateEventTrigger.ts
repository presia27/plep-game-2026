import { GameState } from "./gameState.ts";

/**
 * Allows inverted control-flow
 * to allow entities and controllers
 * to indicate to GameState that
 * an event prompting a change in
 * state has occured. This includes
 * changes to levels and UI screens.
 * 
 * In simpler terms, this allows
 * any class with a reference to this
 * object to communicate to GameState
 * that a scene needs changing.
 * 
 * @author Preston Sia (presia27)
 */
export class GameStateEventTrigger {
  private gameState: GameState;

  /**
   * 
   * @param actionFunction Reference to a function that should handle the change
   */
  constructor(gameState: GameState) {
    this.gameState = gameState;
  }

  public assertChange(data: any, eventType: string) {
    this.gameState.stateChangeHandler(data, eventType);
  }
}

/* Event types */
export const LEVEL_OVER = "LEVEL_OVER";
export const NEXT_SCENE = "NEXT_SCENE";
export const TOGGLE_PAUSE = "TOGGLE_PAUSE";
