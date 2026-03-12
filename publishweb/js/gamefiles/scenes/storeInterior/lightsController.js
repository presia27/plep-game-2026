import { BasicSize } from "../../../componentLibrary/BasicSize.js";
import { staticPositionComponent } from "../../../componentLibrary/staticPositionComponent.js";
import { StaticSpriteRenderer } from "../../../componentLibrary/staticSpriteRenderer.js";
import { Entity } from "../../../entity.js";
import { ASSET_MANAGER } from "../../main.js";
/**
 * Lights for floor
 * @author Emma Szebenyi
 */
export class Light extends Entity {
    /**
     * Creates a light for the store floor
     */
    constructor(pos) {
        super();
        const floor = ASSET_MANAGER.getImageAsset("light");
        if (floor === null)
            throw new Error("Failed to load asset for store interior lights");
        const position = new staticPositionComponent({ x: pos.x, y: pos.y });
        const size = new BasicSize(242, 65, 1);
        const renderer = new StaticSpriteRenderer(floor, 0, 0, 242, 65, position, size);
        super.setRenderer(renderer);
    }
}
