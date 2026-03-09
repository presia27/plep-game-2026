import { BasicSize } from "../../../componentLibrary/BasicSize.js";
import { staticPositionComponent } from "../../../componentLibrary/staticPositionComponent.js";
import { StaticSpriteRenderer } from "../../../componentLibrary/staticSpriteRenderer.js";
import { Entity } from "../../../entity.js";
import { ASSET_MANAGER } from "../../main.js";
/**
 * Store exterior controller entity representing interior UI + any required behavior
 * @author Emma Szebenyi
 */
export class ParkingLot extends Entity {
    /**
     * Creates parking lot entity
     */
    constructor() {
        super();
        const lotSprite = ASSET_MANAGER.getImageAsset("parkingLot");
        if (lotSprite === null)
            throw new Error("Failed to load asset for parking lot");
        const pos = new staticPositionComponent({ x: 0, y: 0 });
        const size = new BasicSize(1280, 720, 1);
        const renderer = new StaticSpriteRenderer(lotSprite, 0, 0, 1280, 720, pos, size);
        super.setRenderer(renderer);
    }
}
