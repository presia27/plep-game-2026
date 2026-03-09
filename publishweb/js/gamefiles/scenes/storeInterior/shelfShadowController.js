import { BasicSize } from "../../../componentLibrary/BasicSize.js";
import { staticPositionComponent } from "../../../componentLibrary/staticPositionComponent.js";
import { StaticSpriteRenderer } from "../../../componentLibrary/staticSpriteRenderer.js";
import { Entity } from "../../../entity.js";
import { ASSET_MANAGER } from "../../main.js";
export const SHELF_SCALE = 4;
export const SHELF_WIDTH = 68;
export const SHELF_HEIGHT = 38;
const SHADOW_X_OFFSET = 2;
/**
 * Handles rendering shelf shadows using shelf locations
 * @author Emma Szebenyi
 */
export class ShelfShadow extends Entity {
    constructor(position) {
        super();
        this.posComp = new staticPositionComponent(position);
        this.shelfSize = new BasicSize(SHELF_WIDTH, SHELF_HEIGHT, SHELF_SCALE);
        super.addComponent(this.posComp);
        super.addComponent(this.shelfSize);
        const shadow = ASSET_MANAGER.getImageAsset("shelfShadow");
        if (shadow === null) {
            throw new Error("Failed to load asset for shelf shadows");
        }
        const shadowPos = new staticPositionComponent({ x: this.posComp.getPosition().x + SHADOW_X_OFFSET * SHELF_SCALE, y: this.posComp.getPosition().y + SHELF_HEIGHT * SHELF_SCALE });
        const shadowDestSize = new BasicSize(SHELF_WIDTH, SHELF_HEIGHT / 3, SHELF_SCALE);
        const shadowRenderer = new StaticSpriteRenderer(shadow, 0, 0, 68, 12, shadowPos, shadowDestSize, null, true, .65);
        super.setRenderer(shadowRenderer);
    }
}
//not sure if changing the vars to instance vars will cause some PBR issues but we will see
