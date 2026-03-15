import { GameContext, IComponent } from "../classinterfaces";

/**
 * Types out multiple strings of texts, one by one.
 * Each string is "displayed" at a rate specified by "typeSpeed."
 * Get the live typewritter feed for the string you want by
 * calling getRevealdText(index) where index is the index
 * number of the string you want.
 * 
 * When called from a rendering component, setup your ctx.fillText
 * calls all at once. The strings will draw sequentially with as
 * this component receives update calls from the game engine.
 * 
 * Adapted from the textbox code by Luke Willis
 * 
 * @author Preston Sia (presia27), Luke Willis
 */
export class MultiLineTypewriter implements IComponent {
  private revealSpeed: number; // characters per second
  private texts: string[];
  private currentRevealIndex: number[] = [];
  private elapsedTimes: number[] = [];
  private isRevealing: boolean[] = [];
  private currentTextTrack: number;

  constructor(stringList: string[], typeSpeed: number = 30) {
    this.texts = stringList.slice();
    this.revealSpeed = typeSpeed;
    this.currentTextTrack = 0;

    for (let i = 0; i < this.texts.length; i++) {
      this.currentRevealIndex[i] = 0;
      this.elapsedTimes[i] = 0;
      this.isRevealing[i] = true;
    }
  }

  public update(context: GameContext): void {
    const i = this.currentTextTrack;
    if (this.isRevealing[i]) {
      // Update reveal animation
      (this.elapsedTimes[i] as number) += context.clockTick;
      const targetIndex = Math.floor((this.elapsedTimes[i] as number) * this.revealSpeed);
      if (targetIndex >= (this.texts[i] as string).length) {
        this.currentRevealIndex[i] = (this.texts[i] as string).length;
        this.isRevealing[i] = false;
      } else {
        this.currentRevealIndex[i] = targetIndex;
      }
    } else if (i < this.texts.length) {
      this.currentTextTrack++;
    }
  }

  public getRevealedText(index: number): string {
    const text = this.texts[index];
    if (text) {
      return text.substring(0, this.currentRevealIndex[index]);
    } else {
      return "???";
    }
  }

  public getTextListCount(): number {
    return this.texts.length;
  }
}