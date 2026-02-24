import { BasicSize } from "../../componentLibrary/BasicSize.js";
import { BoundingBox } from "../../componentLibrary/boundingBox.js";
import { staticPositionComponent } from "../../componentLibrary/staticPositionComponent.js";
import { StaticSpriteRenderer } from "../../componentLibrary/staticSpriteRenderer.js";
import { Entity } from "../../entity.js";
export const SHELF_SCALE = 4;
export const SHELF_WIDTH = 68;
export const SHELF_HEIGHT = 36;
/**
 * Shelf controller entity representing shelf logic and component behavior
 * @author pmo, Preston Sia, Emma Szebenyi
 */
export class ShelfController extends Entity {
    constructor(position, spritesheet) {
        super();
        // ADD ESSENTIAL LOGIC COMPONENTS
        const posComp = new staticPositionComponent(position);
        const shelfSize = new BasicSize(SHELF_WIDTH, SHELF_HEIGHT, SHELF_SCALE);
        const shelfBoundingBox = new BoundingBox(posComp, shelfSize);
        super.addComponent(posComp);
        super.addComponent(shelfSize);
        super.addComponent(shelfBoundingBox);
        // const renderer = new ImageRenderer(spritesheet, posComp, shelfSize);
        // super.setRenderer(renderer);
        //const renderer = new StaticSpriteRenderer(spritesheet, 86, 8, 68, 36, posComp);
        const renderer = new StaticSpriteRenderer(spritesheet, 86, 8, 68, 36, posComp, shelfSize);
        super.setRenderer(renderer);
    }
}
