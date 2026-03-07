/**
 * Entity for displaying the boss satisfaction renderer.
 * 
 * @author Emma Szebenyi
 */

import { Entity } from "../../entity.ts";
import { ASSET_MANAGER } from "../main.ts";
import { BossSatisfaction } from "./bossSatisfactionController.ts";
import { SatisfactionRenderer } from "./bossSatisfactionRenderer.ts";

export class SatisfactionDisplayEntity extends Entity {
  private bossSatisfaction: BossSatisfaction;
  constructor(
    x: number,
    y: number,
    bossSatisfaction: BossSatisfaction
  ) {
    super();

    this.bossSatisfaction = bossSatisfaction;

    const bossSpritesheet = ASSET_MANAGER.getImageAsset("bossIcons");
    const satisfactionBar = ASSET_MANAGER.getImageAsset("satisfactionBar");
    const arrow = ASSET_MANAGER.getImageAsset("arrow");
    
    if (bossSpritesheet === null) 
        throw new Error("Failed to load asset for the boss icons");
    if (satisfactionBar === null) 
        throw new Error("Failed to load asset for the satisfaction bar sprite");
    if (arrow === null) 
        throw new Error("Failed to load asset for the arrow sprite");
    
    const renderer = new SatisfactionRenderer(x, y, this.bossSatisfaction, bossSpritesheet, satisfactionBar, arrow);
    super.setRenderer(renderer);
  }
}
