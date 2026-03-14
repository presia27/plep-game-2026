
import { GameContext, IRenderer } from "../../classinterfaces.ts";
import { BossSatisfaction } from "./bossSatisfactionController.ts";

const PANELWIDTH: number = 172;
const PANELHEIGHT: number = 24;
const BOSS_ICON_WIDTH: number = 20;
const BOSS_ICON_HEIGHT: number = 23;
const ARROW_SX: number = 34;
const ARROW_SY: number = 1;
const ARROW_W: number = 9;
const ARROW_H: number = 9;

export class SatisfactionRenderer implements IRenderer {
  private posX: number;
  private posY: number;
  private bossManager: BossSatisfaction;
  private bossIcons: HTMLImageElement;
  private bossBarSprite: HTMLImageElement;
  private arrow: HTMLImageElement;
  /**
   * 
   * @param posX X position to draw on the canvas
   * @param posY Y position to draw on the canvas
   * @param bossManager Instance of BossSatisfaction holding the satisfaction state from which to draw from
   */
  constructor(posX: number, posY: number, bossManager: BossSatisfaction, bossIcons: HTMLImageElement, bossBarSprite: HTMLImageElement, arrow: HTMLImageElement) {
    this.posX = posX;
    this.posY = posY;
    this.bossManager = bossManager;
    this.bossIcons = bossIcons;
    this.bossBarSprite = bossBarSprite;
    this.arrow = arrow;
  }

  draw(context: GameContext): void {
    // Don't render boss satisfaction when game is paused
    if (context.isPaused) {
      return;
    }

    const ctx = context.ctx;
    ctx.save();

    // draw boss sprite bar
    ctx.drawImage(
      this.bossBarSprite,
      0, 0,
      PANELWIDTH, PANELHEIGHT,
      this.posX, this.posY + 7,
      PANELWIDTH, PANELHEIGHT
    )

    // Draw title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px "Jersey-20", Arial';
    ctx.fillText('Boss Satisfaction', this.posX + 5, this.posY + 2);

    // Get satisfaction state
    const satisfaction = this.bossManager.getSatisfaction();

    // --- Compute horizontal indicator position ---
    // satisfaction=0 → left end of bar, satisfaction=100 → right end of bar
    const t = satisfaction / 100;
    const indicatorX = this.posX + t * PANELWIDTH;
    const clampedX = Math.max(this.posX + ARROW_W / 2, Math.min(this.posX + PANELWIDTH - ARROW_W / 2, indicatorX));

    // --- Draw upward-pointing arrow below the bar ---
    if (satisfaction > 0) {
      ctx.drawImage(
        this.arrow,
        ARROW_SX, ARROW_SY,
        ARROW_W, ARROW_H,
        clampedX - ARROW_W / 2,          // centered horizontally on indicator
        this.posY + 7 + PANELHEIGHT + 2, // just below the bar
        ARROW_W, ARROW_H
      );

      // --- Draw satisfaction number centered on indicator, below arrow ---
      ctx.fillStyle = 'white';
      ctx.font = 'bold 18px "Jersey-20", Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        Math.ceil(satisfaction).toString(),
        clampedX,
        this.posY + PANELHEIGHT
      );
    }      // // Draw arrow displaying current satisfaction
    // if (satisfaction > 0) {
    //   ctx.drawImage(
    //     this.arrow,
    //     34, 1,
    //     9, 9,
    //     (this.posX + PANELWIDTH) - 3 * (100 - satisfaction), this.posY + PANELHEIGHT + 7,
    //     9, 9
    //   )
    //   // Draw satisfaction number
    //   ctx.fillStyle = 'white';
    //   ctx.font = 'bold 18px "Jersey-20", Arial';
    //   ctx.fillText(Math.ceil(satisfaction).toString(), (this.posX + PANELWIDTH) - 3 * (100 - satisfaction), this.posY + PANELHEIGHT - 5);
    // }

    // Get scale factor for boss icon animation
    const iconScale = this.bossManager.getIconScale();
    const scaledWidth = BOSS_ICON_WIDTH * 2 * iconScale;
    const scaledHeight = BOSS_ICON_HEIGHT * 2 * iconScale;
    // Center the scaled icon by offsetting based on size difference
    const scaleOffsetX = (BOSS_ICON_WIDTH * 2 * (iconScale - 1)) / 2;
    const scaleOffsetY = (BOSS_ICON_HEIGHT * 2 * (iconScale - 1)) / 2;


    // Icon sits at left end, vertically centered on the bar
    const iconX = this.posX - scaledWidth + 3- scaleOffsetX; // overlaps left edge
    const iconY = this.posY + 7 + (PANELHEIGHT / 2) - (scaledHeight / 2) - scaleOffsetY;
    let bossSX = 1;
    if (satisfaction >= 90)      bossSX = 1;
    else if (satisfaction >= 80) bossSX = 23;
    else if (satisfaction >= 60) bossSX = 45;
    else if (satisfaction >= 40) bossSX = 67;
    else if (satisfaction >= 20) bossSX = 89;
    else                         bossSX = 111;

    ctx.drawImage(
      this.bossIcons,
      bossSX, 1,
      BOSS_ICON_WIDTH, BOSS_ICON_HEIGHT,
      iconX, iconY,
      scaledWidth, scaledHeight
    );

    ctx.restore();
  }
}