import { GameContext, IRenderer } from "../../classinterfaces.ts";
import { BossSatisfaction } from "./bossSatisfactionController.ts";

const PANELWIDTH = 100;
const PANELHEIGHT = 25;


export class SatisfactionRenderer implements IRenderer {
  private posX: number;
  private posY: number;
  private bossManager: BossSatisfaction;

  /**
   * 
   * @param posX X position to draw on the canvas
   * @param posY Y position to draw on the canvas
   * @param bossManager Instance of BossSatisfaction holding the satisfaction state from which to draw from
   */
  constructor(posX: number, posY: number, bossManager: BossSatisfaction) {
    this.posX = posX;
    this.posY = posY;
    this.bossManager = bossManager;
  }

  draw(context: GameContext): void {
    const ctx = context.ctx;

    ctx.save();

    // Draw background panel
    // Create linear gradient
    const grad = ctx.createLinearGradient(0,0, 100, 0);
    grad.addColorStop(0, "#730906");
    grad.addColorStop(1, "#023e2b");

    // Fill rectangle with gradient
    ctx.fillStyle = grad;
    ctx.fillRect(this.posX, this.posY, PANELWIDTH, PANELHEIGHT);

    // Draw border
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.posX, this.posY, PANELWIDTH, PANELHEIGHT);

    // Draw title
    ctx.fillStyle = 'black';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Boss Satisfaction', this.posX + 10, this.posY + 25);

    // Get satisfaction state
    const satisfaction = this.bossManager.getSatisfaction();

    // Draw satisfaction number
    ctx.fillText(satisfaction.toString(), this.posX + 20, this.posY + 15);

    ctx.restore();
  }
}