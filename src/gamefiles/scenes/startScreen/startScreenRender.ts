import { GameContext, IScene, IRenderer } from "../../../classinterfaces.ts";
import { Entity } from "../../../entity.ts";
import { ASSET_MANAGER } from "../../main.ts";

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
    
      // try to load background image, fall back to solid color if not avail
      const backgroundImage = ASSET_MANAGER.getImageAsset("startScreenBackground");

      if (backgroundImage) {
        //draw image
        ctx.drawImage(backgroundImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
      } else { //background color
        ctx.fillStyle = "#381c40"
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }

  
      //game title
      ctx.fillStyle = "#debae8";
      ctx.textAlign = "center"
      ctx.font = "bold 64px Arial"
      ctx.fillText("PLEP GAME!", ctx.canvas.width / 2, ctx.canvas.height / 2 - 100);
  
      //subtitle
      ctx.font = "24px Arial";
      ctx.fillStyle = "#aaa";
      ctx.fillText("Survive the rush! :P", ctx.canvas.width / 2, ctx.canvas.height / 2 - 40);
      ctx.restore();
    }
}

