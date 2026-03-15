import { GameContext, IRenderer } from "../../../classinterfaces.ts";
import { Entity } from "../../../entity.ts";

export class WinScreenRender extends Entity {
  private text: string;
  private revealSpeed: number; // characters per second
  private currentRevealIndex: number;
  private elapsedTime: number;
  private displayTime: number; // time spent displaying (after reveal completes)
  private isRevealing: boolean;

  constructor() {
    super();

    this.text = "YOU WON!";
    this.revealSpeed = 30;
    this.currentRevealIndex = 0;
    this.elapsedTime = 0;
    this.displayTime = 0;
    this.isRevealing = true;
  }

  public override update(context: GameContext): void {
    super.update(context);

    if (this.isRevealing) {
      // Update reveal animation
      this.elapsedTime += context.clockTick;
      const targetIndex = Math.floor(this.elapsedTime * this.revealSpeed);
      if (targetIndex >= this.text.length) {
        this.currentRevealIndex = this.text.length;
        this.isRevealing = false;
      } else {
        this.currentRevealIndex = targetIndex;
      }
    }
  }

  public getRevealedText(): string {
    return this.text.substring(0, this.currentRevealIndex);
  }

  public override draw(context: GameContext): void {
    const ctx = context.ctx;

    ctx.save();

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center"
    ctx.font = "36px 'Jersey-20', Arial"
    ctx.fillText(this.getRevealedText(), ctx.canvas.width / 2, ctx.canvas.height / 2);

    ctx.restore();
  }
}
