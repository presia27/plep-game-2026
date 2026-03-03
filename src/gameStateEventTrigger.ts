
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
  private actionHandler: (data: any, eventType: string) => void;

  /**
   * 
   * @param actionFunction Reference to a function that should handle the change
   */
  constructor(actionFunction: (data: any, eventType: string) => void) {
    this.actionHandler = actionFunction;
  }

  public assertChange(data: any, eventType: string) {
    this.actionHandler(data, eventType);
  }
}