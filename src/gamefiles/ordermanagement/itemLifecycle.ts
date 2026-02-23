import { BasicLifecycle } from "../../componentLibrary/lifecycle.ts";

const TIMEOUT_MS = 3000;

export class ItemLifecycle extends BasicLifecycle {
  public override die(): void {
    super.die();
    setTimeout(() => {
      super.revive();
    }, TIMEOUT_MS)
  }
}