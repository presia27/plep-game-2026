import { MSG_SERVICE } from "../main.js";
/**
 * Check if there are any messages.
 * If there are, processes them one by one
 * at a specified interval.
 */
export class CurrentMessageComponent {
    /**
     *
     * @param messageInterval Delay time between each message in seconds
     */
    constructor(messageInterval) {
        this.currentMessage = null;
        this.messageInterval = messageInterval;
        this.lastPromptTime = 0;
    }
    update(context) {
        if (context.gameTime >= this.lastPromptTime + this.messageInterval) {
            if (!MSG_SERVICE.isEmpty()) {
                this.currentMessage = MSG_SERVICE.receiveMessage(); // get message
                this.lastPromptTime = context.gameTime;
                console.log(this.currentMessage);
            }
            else {
                this.currentMessage = null;
            }
        }
    }
    getCurrentMessasge() {
        return this.currentMessage;
    }
}
