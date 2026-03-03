import { GameContext, IComponent } from "../../classinterfaces.ts";
import { MSG_SERVICE } from "../main.ts";

/**
 * Check if there are any messages.
 * If there are, processes them one by one
 * at a specified interval.
 */
export class CurrentMessageComponent implements IComponent {
  private currentMessage: string | null;
  private messageInterval: number; // delay time between each message in seconds
  private lastPromptTime: number;
  
  /**
   * 
   * @param messageInterval Delay time between each message in seconds
   */
  constructor(messageInterval: number) {
    this.currentMessage = null;
    this.messageInterval = messageInterval;
    this.lastPromptTime = 0;
  }

  update(context: GameContext): void {
    if (context.gameTime >= this.lastPromptTime + this.messageInterval) {
      if (!MSG_SERVICE.isEmpty()) {
        this.currentMessage = MSG_SERVICE.receiveMessage(); // get message
        this.lastPromptTime = context.gameTime;
        console.log(this.currentMessage);
      } else {
        this.currentMessage = null;
      }
    } 
  }

  public getCurrentMessasge(): string | null {
    return this.currentMessage;
  }
}