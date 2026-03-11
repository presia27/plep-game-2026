import { GameContext, IRenderer } from "../../classinterfaces.ts";
import { BossSatisfaction } from "./bossSatisfactionController.ts";

const PANELWIDTH: number = 300;
const PANELHEIGHT: number = 37;
const BOSS_ICON_WIDTH: number = 20;
const BOSS_ICON_HEIGHT: number = 23;

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
    ctx.fillStyle = 'black';
    ctx.font = 'bold 16px "Jersey-20", Arial';
    ctx.fillText('Boss Satisfaction', this.posX + 5, this.posY + 2);

    // Get satisfaction state
    const satisfaction = this.bossManager.getSatisfaction();

    // Draw arrow displaying current satisfaction
    if (satisfaction > 0) {
      ctx.drawImage(
        this.arrow,
        34, 1,
        9, 9,
        (this.posX + PANELWIDTH) - 3 * (100 - satisfaction), this.posY + PANELHEIGHT + 7,
        9, 9
      )
      // Draw satisfaction number
      ctx.fillStyle = 'white';
      ctx.font = 'bold 18px "Jersey-20", Arial';
      ctx.fillText(Math.ceil(satisfaction).toString(), (this.posX + PANELWIDTH) - 3 * (100 - satisfaction), this.posY + PANELHEIGHT - 5);
    }

    // Get scale factor for boss icon animation
    const iconScale = this.bossManager.getIconScale();
    const scaledWidth = BOSS_ICON_WIDTH * 2 * iconScale;
    const scaledHeight = BOSS_ICON_HEIGHT * 2 * iconScale;
    // Center the scaled icon by offsetting based on size difference
    const scaleOffsetX = (BOSS_ICON_WIDTH * 2 * (iconScale - 1)) / 2;
    const scaleOffsetY = (BOSS_ICON_HEIGHT * 2 * (iconScale - 1)) / 2;

    // Draw boss icon next to satisfaction bar
    // note: ik this is very redundant but idc i am tired ill fix it later (maybe)
    if (satisfaction >= 90) { // pleased
      ctx.drawImage(
      this.bossIcons,
      1, 1,
      BOSS_ICON_WIDTH,
      BOSS_ICON_HEIGHT,
      this.posX - 50 - scaleOffsetX,
      this.posY - scaleOffsetY,
      scaledWidth,
      scaledHeight,
    );
    } else if (satisfaction >= 80) { // neutral
      ctx.drawImage(
      this.bossIcons,
      23, 1,
      BOSS_ICON_WIDTH,
      BOSS_ICON_HEIGHT,
      this.posX - 50 - scaleOffsetX,
      this.posY - scaleOffsetY,
      scaledWidth,
      scaledHeight,
    );
    } else if (satisfaction >= 60) { // annoyed
      ctx.drawImage(
      this.bossIcons,
      45, 1,
      BOSS_ICON_WIDTH,
      BOSS_ICON_HEIGHT,
      this.posX - 50 - scaleOffsetX,
      this.posY - scaleOffsetY,
      scaledWidth,
      scaledHeight,
    );
    } else if (satisfaction >= 40) { // angry
      ctx.drawImage(
      this.bossIcons,
      67, 1,
      BOSS_ICON_WIDTH,
      BOSS_ICON_HEIGHT,
      this.posX - 50 - scaleOffsetX,
      this.posY - scaleOffsetY,
      scaledWidth,
      scaledHeight,
    );
    } else if (satisfaction >= 20) { // rage
      ctx.drawImage(
      this.bossIcons,
      89, 1,
      BOSS_ICON_WIDTH,
      BOSS_ICON_HEIGHT,
      this.posX - 50 - scaleOffsetX,
      this.posY - scaleOffsetY,
      scaledWidth,
      scaledHeight,
    );
    } else { // furious
      ctx.drawImage(
      this.bossIcons,
      111, 1,
      BOSS_ICON_WIDTH,
      BOSS_ICON_HEIGHT,
      this.posX - 50 - scaleOffsetX,
      this.posY - scaleOffsetY,
      scaledWidth,
      scaledHeight,
    );
    }

    ctx.restore();
  }
}