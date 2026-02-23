/**
 * TEMPORARY entity for displaying the boss satisfaction renderer.
 * This code must be moved to the scene manager when 
 * that becomes ready.
 * 
 * AGAIN DO NOT USE IN PRODUCTION!!!!
 * @author Emma Szebenyi
 */

import { Entity } from "../../entity.ts";
import { BossSatisfaction } from "./bossSatisfactionController.ts";
import { SatisfactionRenderer } from "./bossSatisfactionRenderer.ts";

export class TemporarySatisfactionDisplayEntity extends Entity {
  constructor(x: number, y: number, bossSatisfaction: BossSatisfaction) {
    super();

    const renderer = new SatisfactionRenderer(x, y, bossSatisfaction);
    this.setRenderer(renderer);
  }
}
