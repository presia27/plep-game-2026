import { Entity } from "../../entity.ts";
import { CurrentMessageComponent } from "./currentMessageComponent.ts";
import { MessageRenderer } from "./messageRenderer.ts";

const MESSAGE_INTERVAL = 3;

/**
 * Entity wrapper for the message UI AND
 * message controller component which
 * polls for messages and prompts them
 * on screen with the help of the UI
 * renderer.
 */
export class MessageEntity extends Entity {
  constructor() {
    super();

    const msgComponent = new CurrentMessageComponent(MESSAGE_INTERVAL);
    const renderer = new MessageRenderer(msgComponent);

    super.addComponent(msgComponent);
    super.setRenderer(renderer);
  }
}