import { GameContext, IRenderer } from "../../../classinterfaces.ts";
import { Entity } from "../../../entity.ts";
import { ASSET_MANAGER } from "../../main.ts";

export class StartScreenRender extends Entity {
  constructor(getTitle: () => string) {
    super();

    super.setRenderer(new Renderer(getTitle));
  }
}

class Renderer implements IRenderer {
  private getTitle: () => string;

  constructor(getTitle: () => string) {
    this.getTitle = getTitle;
  }

  draw(context: GameContext): void {
    const ctx = context.ctx;

    ctx.save();

    // Draw background image
    const bgImage = ASSET_MANAGER.getImageAsset("tempbg");
    if (bgImage) {
      ctx.drawImage(bgImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
    } else {
      // Fallback to black if image not loaded
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // Apply dark filter overlay
    ctx.fillStyle = "rgba(0, 0, 20, 0.6)"; // slightly blue/dark tint
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw Title Text
    const title = this.getTitle();

    ctx.textAlign = "left"
    const txtBorderOffset = 64;

    // Title shadow
    ctx.font = "bold 64px 'Jersey-20', monospace"
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    //ctx.fillText(title, ctx.canvas.width / 2 + 4, ctx.canvas.height / 4 + 4);
    ctx.fillText(title, txtBorderOffset + 4, ctx.canvas.height - txtBorderOffset + 4);

    // Title foreground
    ctx.fillStyle = "#9cb3c5"; // gold color
    //ctx.fillText(title, ctx.canvas.width / 2, ctx.canvas.height / 4);
    ctx.fillText(title, txtBorderOffset, ctx.canvas.height - (txtBorderOffset));

    ctx.restore();
  }
}
