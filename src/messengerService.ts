export class MessengerService {
  private messageQueue: string[];

  constructor() {
    this.messageQueue = [];
  }

  public queueMessage(msg: string): void {
    this.messageQueue.push(msg);
  }

  public receiveMessage(): string | null {
    const msg = this.messageQueue.splice(0, 1)[0];
    if (msg) {
      return msg;
    } else {
      return null;
    }
  }

  public queueUrgentMessage(msg: string): void {
    this.messageQueue.unshift(msg);
  }

  public getMessageCount(): number {
    return this.messageQueue.length;
  }

  public isEmpty(): boolean {
    return this.messageQueue.length === 0;
  }
}