import { GameContext } from "../../classinterfaces.ts";
import { TextboxManager } from "./textboxManager.ts";
import { Entity } from "../../entity.ts";
import { ASSET_MANAGER } from "../main.ts";
import { BossSatisfaction } from "../bosssatisfaction/bossSatisfactionController.ts";
import { OBS_ORDER_COMPLETE, Observer } from "../../observerinterfaces.ts";
import { Order } from "../ordermanagement/order.ts";



export class BossDialogueController extends Entity implements Observer{
  private textboxManager: TextboxManager;      // Shows the textboxes
  private bossSatisfaction: BossSatisfaction;
  
  private dialogueBoxSmall: HTMLImageElement | null;
  
  // Track state to prevent duplicate messages
  //private previousSatisfaction: number = 50;
  //private hasShown80Satisfaction: boolean = false;
  //private hasShown60Satisfaction: boolean = false;
  private hasShown40Satisfaction: boolean = false;
  private hasShown20Satisfaction: boolean = false;
  private levelStartMessageShown: boolean = false;

  constructor(textboxManager: TextboxManager, bossSatisfaction: BossSatisfaction) {
    super();

    this.textboxManager = textboxManager;
    this.bossSatisfaction = bossSatisfaction;
    this.dialogueBoxSmall = ASSET_MANAGER.getImageAsset("dialogueBoxSmall");
  }

  observerUpdate(data: any, propertyName: string): void {
    if (OBS_ORDER_COMPLETE === propertyName) { //check if order is complete
      if (data) {
        const currentlyActive = data as Order;
        const accuracy = currentlyActive.getFulfillAccuracy();
        const isCorrect = accuracy !== null && accuracy >= 1.0;
        this.onOrderDelivered(isCorrect);
      }
    } 
  }

  // Main update loop - called every frame
  public override update(context: GameContext): void {
    // Show level start message (only once)
    if (!this.levelStartMessageShown) {
      this.showLevelStartMessage();
      this.levelStartMessageShown = true;
    }

    // Check for satisfaction changes
    this.checkSatisfactionChanges();
    
  }

  // Called by GameState when level starts
  public onLevelStart(): void {
    this.levelStartMessageShown = false;
    //this.hasShown80Satisfaction = false;
    //this.hasShown60Satisfaction = false;
    this.hasShown40Satisfaction = false;
    this.hasShown20Satisfaction = false;
  }

  // Called by OrderDeliveryLoop when order delivered
  public onOrderDelivered(success: boolean): void {
    if (success) {
      const msg = this.randomChoice([
        "Finally! That took long enough.",
        "Good. Now onto the next one.",
        "About time...",
      ]);
      this.showSmallMessage(msg, 2.5);
    } else {
      const msg = this.randomChoice([
        "WRONG ITEMS! What are you doing?!",
        "That's not what the customer ordered!",
        "Are you even paying attention?!",
      ]);
      this.showSmallMessage(msg, 3.0);
    }
  }

  // PRIVATE HELPER METHODS
  
  /**
   * Helper method to show a small textbox with preset dimensions
   * @param text Message to display
   * @param duration How long to show the message
   * @param x Optional X position (defaults to 850)
   * @param y Optional Y position (defaults to 570)
   */
  private showSmallMessage(text: string, duration: number, x?: number, y?: number): void {
    this.textboxManager.clearAll();  // Clear any existing messages first
    this.textboxManager
      .showMessage(text, duration)
      .setPosition(x ?? 415, y ?? 15)  // Default small box position
      .setSize(469, 63)                // Small box dimensions
      .setFontSize(16)                  // Smaller text
      .setPadding(20)
      .setBackgroundSprite(this.dialogueBoxSmall);
  }

  private checkSatisfactionChanges(): void {
    const currentSatisfaction = this.bossSatisfaction.getSatisfaction();
    
    // // 80% threshold
    // if (currentSatisfaction < 80 && !this.hasShown80Satisfaction) {
    //   this.showSmallMessage("Not bad... but I expect better.", 3.0);
    //   this.hasShown80Satisfaction = true;
    // }
    
    // // 60% threshold
    // if (currentSatisfaction < 60 && !this.hasShown60Satisfaction) {
    //   this.showSmallMessage("Your performance is slipping...", 3.0);
    //   this.hasShown60Satisfaction = true;
    // }
    
    // 40% threshold - now bigger text!
    if (currentSatisfaction < 40 && !this.hasShown40Satisfaction) {
      this.textboxManager.clearAll();
      this.showSmallMessage("This is UNACCEPTABLE! Pick up the pace!", 3.5);
      this.hasShown40Satisfaction = true;
    }
    
    // 20% threshold - bigger + RED text!
    if (currentSatisfaction < 20 && !this.hasShown20Satisfaction) {
      this.textboxManager.clearAll();
      this.showSmallMessage("One more mistake and you're FIRED!", 4.0);
      this.hasShown20Satisfaction = true;
    }
  }


  private randomChoice(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)]!;
  }

  private showLevelStartMessage(): void {
    this.textboxManager.clearAll();  // Clear any existing messages first
    this.textboxManager
      .showMessage("Your shift begins NOW, husk. Don't disappoint the corporation.", 4.0)
      .setFontSize(30)
      .setPadding(20);
  }
}