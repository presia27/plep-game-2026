export class MessengerService {
    constructor() {
        this.messageQueue = [];
    }
    queueMessage(msg) {
        this.messageQueue.push(msg);
    }
    receiveMessage() {
        const msg = this.messageQueue.splice(0, 1)[0];
        if (msg) {
            return msg;
        }
        else {
            return null;
        }
    }
    queueUrgentMessage(msg) {
        this.messageQueue.unshift(msg);
    }
    getMessageCount() {
        return this.messageQueue.length;
    }
    isEmpty() {
        return this.messageQueue.length === 0;
    }
}
