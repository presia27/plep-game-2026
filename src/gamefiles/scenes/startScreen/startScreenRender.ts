import { GameContext, IRenderer } from "../../../classinterfaces.ts";
import { Entity } from "../../../entity.ts";

export class StartScreenRender extends Entity {
  constructor() {
    super();
  
    super.setRenderer(new Renderer());
  }
}

class Renderer implements IRenderer {
  draw(context: GameContext): void {
      const ctx = context.ctx;
  
      ctx.save();
  
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
      ctx.fillStyle = "white";
      ctx.textAlign = "center"
      ctx.font = "36px Arial"
      ctx.fillText("TEMPORARY START SCREEN", ctx.canvas.width / 2, ctx.canvas.height / 2);
  
      ctx.restore();
    }
}
