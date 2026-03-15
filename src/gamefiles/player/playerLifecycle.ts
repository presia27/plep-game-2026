import { BasicLifecycle } from "../../componentLibrary/lifecycle.ts";

export const PLAYER_DEATH_ANIMATION_TIME_MS = 2000;

export class PlayerLifecycle extends BasicLifecycle {
  private aboutToDie = false;

  public override die(): void {
    this.aboutToDie = true;
    setTimeout(() => {
      super.die();
    }, PLAYER_DEATH_ANIMATION_TIME_MS);
  }

  public isAboutToDie(): boolean {
    return this.aboutToDie;
  }
}