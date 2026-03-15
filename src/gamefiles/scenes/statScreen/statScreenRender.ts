import { GameContext, IRenderer } from "../../../classinterfaces.ts";
import { MultiLineTypewriter } from "../../../componentLibrary/multiLineTypewriter.ts";
import { Entity } from "../../../entity.ts";
import { LevelSummary } from "../../levels/levelinterfaces.ts";

export class StatScreenRender extends Entity {
  constructor(levelSummary: LevelSummary) {
    super();

    const textString = [
      `SHIFT COMPLETE. SUMMARY:`,
      `Quota: ${levelSummary.quota}`,
      `Orders fulfilled: ${levelSummary.ordersFulfilled}`,
      `Average accuracy: ${(levelSummary.avgAccuracy * 100).toFixed(2)}%`,
      `Boss satisfaction: ${levelSummary.bossSatisfaction.toFixed(2)}`,
      `Health: ${levelSummary.playerHealth}/${levelSummary.playerMaxHealth}`,
      'PERFORMANCE: SATISFACTORY',
      'YOU ARE MOVING ON'
    ];

    const typewriter: MultiLineTypewriter = new MultiLineTypewriter(textString, 120);
    this.addComponent(typewriter);
  
    super.setRenderer(new Renderer(typewriter));
  }
}

class Renderer implements IRenderer {
  private typewriter: MultiLineTypewriter;
  constructor(typewriter: MultiLineTypewriter) {
    this.typewriter = typewriter;
  }

  draw(context: GameContext): void {
    const ctx = context.ctx;
    const xOffset = 128;
    const yOffset = 192;
    const heightOffset = 36;

    ctx.save();

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.font = "48px 'Jersey-20', Arial";
    ctx.fillText(
      this.typewriter.getRevealedText(0),
      xOffset,
      yOffset,
    );
    ctx.font = "28px 'Jersey-20', Arial";
    ctx.fillText(
      this.typewriter.getRevealedText(1),
      xOffset,
      yOffset + heightOffset,
    );
    ctx.fillText(
      this.typewriter.getRevealedText(2),
      xOffset,
      yOffset + heightOffset * 2,
    );
    ctx.fillText(
      this.typewriter.getRevealedText(3),
      xOffset,
      yOffset + heightOffset * 3,
    );
    ctx.fillText(
      this.typewriter.getRevealedText(4),
      xOffset,
      yOffset + heightOffset * 4,
    );
    ctx.fillText(
      this.typewriter.getRevealedText(5),
      xOffset,
      yOffset + heightOffset * 5,
    );
    ctx.fillText(
      '===============================================',
      xOffset,
      yOffset + heightOffset * 6,
    );
    ctx.font = "48px 'Jersey-20', Arial";
    ctx.fillText(
      this.typewriter.getRevealedText(6),
      xOffset,
      yOffset + heightOffset * 7,
    );
    ctx.fillText(
      this.typewriter.getRevealedText(7),
      xOffset,
      yOffset + heightOffset * 8,
    );

    ctx.restore();
  }

}
