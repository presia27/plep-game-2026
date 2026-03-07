import { GameContext } from "../../../classinterfaces.ts";
import { BasicSize } from "../../../componentLibrary/BasicSize.ts";
import { staticPositionComponent } from "../../../componentLibrary/staticPositionComponent.ts";
import { StaticSpriteRenderer } from "../../../componentLibrary/staticSpriteRenderer.ts";
import { Entity } from "../../../entity.ts";
import { XY } from "../../../typeinterfaces.ts";
import { ASSET_MANAGER } from "../../main.ts";



/**
 * Handles rendering shelf shadows using shelf locations
 * @author Emma Szebenyi
 */
export class Vignette extends Entity {
  constructor() {
    super();
  }
  override draw(context: GameContext): void {
    const ctx = context.ctx;

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const gradient = ctx.createRadialGradient(
      centerX, centerY, height * 0.3,  // inner circle - start of dark edge
      centerX, centerY, Math.sqrt(centerX ** 2 + centerY ** 2) // outer circle - end of dark edge
    );

    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');    // transparent center
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');  // dark edges

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
}

