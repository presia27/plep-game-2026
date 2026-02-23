/**
 * TEMPORARY entity for displaying the boss satisfaction renderer.
 * This code must be moved to the scene manager when
 * that becomes ready.
 *
 * AGAIN DO NOT USE IN PRODUCTION!!!!
 * @author Emma Szebenyi
 */
import { Entity } from "../../entity.js";
import { SatisfactionRenderer } from "./bossSatisfactionRenderer.js";
export class TemporarySatisfactionDisplayEntity extends Entity {
    constructor(x, y, bossSatisfaction) {
        super();
        const renderer = new SatisfactionRenderer(x, y, bossSatisfaction);
        this.setRenderer(renderer);
    }
}
