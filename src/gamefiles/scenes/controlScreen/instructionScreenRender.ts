import { GameContext, IRenderer } from "../../../classinterfaces.ts";
import { Entity } from "../../../entity.ts";

export class InstructionsScreenRender extends Entity {
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    super();
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    super.setRenderer(new Renderer(canvasWidth, canvasHeight));
  }
}

class Renderer implements IRenderer {
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  draw(context: GameContext): void {
    const ctx = context.ctx;
    ctx.save();

    // Set text styling
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    
    // Title
    ctx.font = "bold 98px 'Jersey-20', monospace";
    ctx.fillText("HOW TO PLAY", this.canvasWidth / 2, (this.canvasHeight / 2) - 225);

    // Instructions body
    ctx.font = "32px 'Jersey-20', monospace";
    const lineHeight = 30;
    let yOffset = (this.canvasHeight / 2) - 70;

    // Game instructions
    const instructions = [
      "WASD to Move",
      "E to Pick Up Items",
      "Q to Drop Items",
      "F to Deliver Items",
      "Collect Items on time,", 
      "avoiding the antiquated husks!",
      "",
      "Good luck, runner!"
    ];

    instructions.forEach((line) => {
      ctx.fillText(line, this.canvasWidth / 3, yOffset);
      yOffset += lineHeight;
    });
    
    //reset
    yOffset = (this.canvasHeight / 2) - 70;


    const lore = [
        "Living in the year 2167,",
        "You are tredging through by working for",
        "a megaconglomerate with advanced",
        "technology to transport your soul",
        "into a husk. Stay cautious, for those",
        "lost will try to steal your soul",
        "as their own.",
        "",
        "Be wary, young traveler. May you",
        "return from this experience alive."
    ];



    lore.forEach((line) => {
        ctx.fillText(line, this.canvasWidth-(this.canvasWidth/3), yOffset - 50);
        yOffset += lineHeight;
    });

    //reset
    yOffset = (this.canvasHeight / 2) - 70;

    ctx.restore();
  }
}