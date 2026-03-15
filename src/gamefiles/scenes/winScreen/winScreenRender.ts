import { GameContext, IRenderer } from "../../../classinterfaces.ts";
import { MultiLineTypewriter } from "../../../componentLibrary/multiLineTypewriter.ts";
import { Entity } from "../../../entity.ts";

export class WinScreenRender extends Entity {
  private typewriter: MultiLineTypewriter;

  constructor() {
    super();

    const texts = [
      "CONTRACT: FULFILLED",
      "YOU ARE NOW FREE"
    ];

    const typewriter = new MultiLineTypewriter(texts, 30);
    this.typewriter = typewriter;
    super.addComponent(typewriter);
  }

  public override draw(context: GameContext): void {
    const ctx = context.ctx;

    ctx.save();

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center"
    ctx.font = "36px 'Jersey-20', Arial"
    ctx.fillText(this.typewriter.getRevealedText(0), ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.fillText(this.typewriter.getRevealedText(1), ctx.canvas.width / 2, ctx.canvas.height / 2 + 48);

    ctx.restore();
  }
}
