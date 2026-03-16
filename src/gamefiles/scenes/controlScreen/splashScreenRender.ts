import { GameContext, IRenderer } from "../../../classinterfaces.ts";
import { Entity } from "../../../entity.ts";
import { ASSET_MANAGER } from "../../main.ts";

export class SplashScreenRender extends Entity {
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

    // Draw solid black background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw title image in center
    const titleImg = ASSET_MANAGER.getImageAsset("titleImage");
    if (titleImg) {
      const scale = 4;
      const imgWidth = titleImg.width * scale;
      const imgHeight = titleImg.height * scale;
      const x = (this.canvasWidth / 2) - (imgWidth / 2);
      const y = (this.canvasHeight / 2) - (imgHeight / 2) - 150; // Moved up more
      
      ctx.drawImage(titleImg, x, y, imgWidth, imgHeight);
    }

    ctx.textAlign = "center";
    ctx.font = "bold 16px 'Jersey-20', monospace";
    ctx.fillStyle = "white";

    ctx.fillText(
      "COPYRIGHT (C) 2026 PLEP DEVELOPERS",
      ctx.canvas.width / 2,
      ctx.canvas.height - 40
    );
    ctx.fillText(
      "THE PERSONS, EVENTS, CHARACTERS AND FIRMS IN THIS GAME ARE FICTICIOUS.",
      ctx.canvas.width / 2,
      ctx.canvas.height - 26
    );
    ctx.fillText(
      "ANY SIMILARITY TO ACTUAL PERSONS, LIVING OR DEAD, OR TO ACTUAL EVENTS OR FIRMS IS PURELY COINCIDENTAL.",
      ctx.canvas.width / 2,
      ctx.canvas.height - 12
    );

    ctx.restore();
  }
}
