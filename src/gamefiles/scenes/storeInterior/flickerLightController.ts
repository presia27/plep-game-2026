import { staticPositionComponent } from "../../../componentLibrary/staticPositionComponent.ts";
import { Entity } from "../../../entity.ts";
import { FlickerLightConfig } from "../roomData.ts";
import { FlickerLightRenderer } from "./flickerLightRenderer.ts";

/**
 * A decorative flickering fluorescent light pool on the floor.
 * Add via sceneManager.addEntity() so it renders under the player.
 * @author Claude
 */
export class FlickerLightController extends Entity {
  constructor(config: FlickerLightConfig) {
    super();
    const pos = new staticPositionComponent(config.position);
    super.addComponent(pos);
    super.setRenderer(new FlickerLightRenderer(config));
  }
}