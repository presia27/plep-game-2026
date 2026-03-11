import { MSG_SERVICE } from "../main.js";
const DEFAULT_CHARS_PER_SECOND = 60;
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
        this.displayLength = 0;
        this.charsPerSecond = DEFAULT_CHARS_PER_SECOND;
    }
    update(context) {
        if (context.gameTime >= this.lastPromptTime + this.messageInterval) {
            if (!MSG_SERVICE.isEmpty()) {
                this.currentMessage = MSG_SERVICE.receiveMessage(); // get message
                this.lastPromptTime = context.gameTime;
                this.displayLength = 0; // reset on new message
                if (context.debug) {
                    console.log("Received MSG: " + this.currentMessage);
                }
            }
            else {
                this.currentMessage = null;
            }
        }
        if (this.currentMessage) {
            this.displayLength = Math.min(this.currentMessage.length, this.displayLength + this.charsPerSecond * context.clockTick);
        }
    }
    getCurrentMessasge() {
        if (!this.currentMessage)
            return null;
        return this.currentMessage.slice(0, Math.floor(this.displayLength));
    }
}
