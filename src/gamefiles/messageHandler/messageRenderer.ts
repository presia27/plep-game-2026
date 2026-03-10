import { GameContext, IRenderer } from "../../classinterfaces.ts";
import { CurrentMessageComponent } from "./currentMessageComponent.ts";

export class MessageRenderer implements IRenderer {
  private currentMessageComponent: CurrentMessageComponent;

  constructor(currentMessageComponent: CurrentMessageComponent) {
    this.currentMessageComponent = currentMessageComponent;
  }

  draw(context: GameContext): void {
    const currentMsg = this.currentMessageComponent.getCurrentMessasge();
    const ctx = context.ctx;
    const panelWidth = 640;
    const panelHeight = 50;
    const posX = (ctx.canvas.width / 2) - (panelWidth / 2);
    const posY = ctx.canvas.height - (panelHeight * 2);

    ctx.save();

  if (currentMsg) {
    // draw panels
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(posX, posY, panelWidth, panelHeight);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(posX, posY, panelWidth, panelHeight);

    // draw text
    const textYOffset = 4;
    ctx.fillStyle = "white";
    ctx.font = "bold 24px 'Jersey-20', Arial";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.textAlign = "center";
    ctx.fillText(currentMsg, posX + (panelWidth / 2), posY + (panelHeight / 2 + textYOffset));
    }

    ctx.restore();
  }
}