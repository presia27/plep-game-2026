import { GameContext, IComponent } from "../../classinterfaces.ts";
import { TextboxManager } from "./textboxManager.ts";
import { OrderDeliveryLoop } from "../ordermanagement/orderloopsys.ts";
import { Entity } from "../../entity.ts";



export class BossDialogueController extends Entity implements IComponent {
  private textboxManager: TextboxManager;      // Shows the textboxes
  private orderLoop: OrderDeliveryLoop;        // Gets satisfaction/time data
  
  // Timing for random quips
  private timeSinceLastQuip: number = 0;
  private quipInterval: number = 30;
  
  // Array of random boss messages
  private bossQuips: string[] = [
    "meow mewo i am the evik boss...",
    "You call that fast?...",
    // etc.
  ];
  
  // Track state to prevent duplicate messages
  private previousSatisfaction: number = 50;
  private hasShown30SecWarning: boolean = false;
  private hasShown10SecWarning: boolean = false;
  private levelStartMessageShown: boolean = false;

  constructor(textboxManager: TextboxManager, orderLoop: OrderDeliveryLoop) {
    super();

    this.textboxManager = textboxManager;
    this.orderLoop = orderLoop;
  }

  // Main update loop - called every frame
  public override update(context: GameContext): void {
    // Show level start message (only once)
    if (!this.levelStartMessageShown) {
      this.showLevelStartMessage();
      this.levelStartMessageShown = true;
    }

    // Check for random quips
    this.updateRandomQuips(context);
    
    // Check for satisfaction changes
    this.checkSatisfactionChanges();
    
    // Check for time warnings
    this.checkTimeWarnings();
  }

  // Called by GameState when level starts
  public onLevelStart(): void {
    this.levelStartMessageShown = false;
    this.hasShown30SecWarning = false;
    this.hasShown10SecWarning = false;
  }

  // Called by OrderDeliveryLoop when order delivered
  public onOrderDelivered(success: boolean): void {
    if (success) {
      const msg = this.randomChoice([
        "Finally! That took long enough.",
        "Good. Now get the next one.",
        "About time...",
      ]);
      this.textboxManager.showMessage(msg, 2.5);
    } else {
      const msg = this.randomChoice([
        "WRONG ITEMS! What are you doing?!",
        "That's not what the customer ordered!",
        "Are you even paying attention?!",
      ]);
      this.textboxManager.showMessage(msg, 3.0);
    }
  }

  // Called by OrderDeliveryLoop when new order generated
  public onNewOrder(): void {
    this.hasShown30SecWarning = false;
    this.hasShown10SecWarning = false;
  }

  // PRIVATE HELPER METHODS
  
  private updateRandomQuips(context: GameContext): void {
    this.timeSinceLastQuip += context.clockTick;
    
    if (this.timeSinceLastQuip >= this.quipInterval) {
      const quip = this.randomChoice(this.bossQuips);
      this.textboxManager.showMessage(quip, 4.0);
      
      this.timeSinceLastQuip = 0;
      this.quipInterval = 25 + Math.random() * 10; // Randomize 25-35 sec
    }
  }

  private checkSatisfactionChanges(): void {
    const currentSatisfaction = this.orderLoop.getSatisfaction();
    
    // Only show message if crossed a threshold (80, 60, 40, 20)
    if (this.hasThresholdChanged(this.previousSatisfaction, currentSatisfaction)) {
      this.showSatisfactionMessage(currentSatisfaction);
    }
    
    this.previousSatisfaction = currentSatisfaction;
  }

  private checkTimeWarnings(): void {
    const timeRemaining = this.orderLoop.getTimeRemaining();
    
    if (timeRemaining <= 30 && !this.hasShown30SecWarning) {
      this.textboxManager.showMessage("30 seconds left! Move it!", 3.0);
      this.hasShown30SecWarning = true;
    }
    
    if (timeRemaining <= 10 && !this.hasShown10SecWarning) {
      this.textboxManager.showMessage("TEN SECONDS! HURRY!", 2.0);
      this.hasShown10SecWarning = true;
    }
  }

  private showSatisfactionMessage(satisfaction: number): void {
    if (satisfaction >= 80) {
      this.textboxManager.showMessage("Excellent work! Keep it up!", 3.0);
    } else if (satisfaction >= 60) {
      this.textboxManager.showMessage("Not bad... but I expect better.", 3.0);
    } else if (satisfaction >= 40) {
      this.textboxManager.showMessage("Your performance is slipping...", 3.0);
    } else if (satisfaction >= 20) {
      this.textboxManager.showMessage("This is UNACCEPTABLE! Pick up the pace!", 3.5);
    } else {
      this.textboxManager.showMessage("One more mistake and you're FIRED!", 4.0);
    }
  }

  private hasThresholdChanged(oldVal: number, newVal: number): boolean {
    const oldThreshold = Math.floor(oldVal / 20) * 20;
    const newThreshold = Math.floor(newVal / 20) * 20;
    return oldThreshold !== newThreshold;
  }

  private randomChoice(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)]!;
  }

  private showLevelStartMessage(): void {
    this.textboxManager
      .showMessage("Your shift begins NOW. Don't disappoint me.", 4.0)
      .setFontSize(35)  // Make it bigger! (default is 16)
      .setPadding(20);
  }
}