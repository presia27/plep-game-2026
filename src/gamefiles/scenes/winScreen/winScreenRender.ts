import { GameContext, IRenderer } from "../../../classinterfaces.ts";
import { MultiLineTypewriter } from "../../../componentLibrary/multiLineTypewriter.ts";
import { Entity } from "../../../entity.ts";
import { ASSET_MANAGER } from "../../main.ts";

export class WinScreenRender extends Entity {

  constructor() {
    super();

    const texts = [
      "CONTRACT: FULFILLED",
      "YOU ARE NOW FREE"
    ];

    const typewriter = new MultiLineTypewriter(texts, 30);
    super.addComponent(typewriter);

    const renderer = new Renderer(typewriter);
    this.setRenderer(renderer);
  }

}

class Renderer implements IRenderer {
  private typewriter: MultiLineTypewriter;
  private bgImage: HTMLImageElement;
  
  private fadeOpacity: number = 1;
  private fadeSpeed: number = 0.5;

  constructor(typewriter: MultiLineTypewriter) {
    this.typewriter = typewriter;

    const image = ASSET_MANAGER.getImageAsset("titleScreen");
    if (image === null) {
      throw new Error("Failed to load asset for the background image");
    }
    this.bgImage = image;
  }

  draw(context: GameContext): void {
    const ctx = context.ctx;

    ctx.save();

    ctx.drawImage(this.bgImage, 0, 0, context.ctx.canvas.width, context.ctx.canvas.height);

    if (this.fadeOpacity > 0) {
      this.fadeOpacity = Math.max(
        this.fadeOpacity - (this.fadeSpeed * context.clockTick),
        0
      );
    }

    ctx.fillStyle = `rgba(0, 0, 0, ${Math.max(this.fadeOpacity, 0.2)})`;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center"
    ctx.font = "36px 'Jersey-20', Arial"
    ctx.fillText(this.typewriter.getRevealedText(0), ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.fillText(this.typewriter.getRevealedText(1), ctx.canvas.width / 2, ctx.canvas.height / 2 + 48);

    ctx.restore();
  }
}
