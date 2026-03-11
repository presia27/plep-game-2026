import { BasicSize } from "../../componentLibrary/BasicSize.js";
import { BoundingBox } from "../../componentLibrary/boundingBox.js";
import { staticPositionComponent } from "../../componentLibrary/staticPositionComponent.js";
import { StaticSpriteRenderer } from "../../componentLibrary/staticSpriteRenderer.js";
import { Entity } from "../../entity.js";
export const SHELF_SCALE = 4;
export const SHELF_WIDTH = 72;
export const SHELF_HEIGHT = 38;
/**
 * Shelf controller entity representing shelf logic and component behavior
 * @author pmo, Preston Sia, Emma Szebenyi
 */
export class ShelfController extends Entity {
    constructor(position, spritesheet, shelfNum) {
        super();
        this.shelfNum = shelfNum;
        // ADD ESSENTIAL LOGIC COMPONENTS
        const posComp = new staticPositionComponent(position);
        const shelfSize = new BasicSize(SHELF_WIDTH, SHELF_HEIGHT, SHELF_SCALE);
        const shelfBoundingSize = new BasicSize(SHELF_WIDTH, SHELF_HEIGHT / 2, SHELF_SCALE);
        const shelfBoundingBox = new BoundingBox(posComp, shelfBoundingSize);
        super.addComponent(posComp);
        super.addComponent(shelfSize);
        super.addComponent(shelfBoundingBox);
        let spritesheetXStart = 0;
        let spritesheetYStart = 0;
        if (shelfNum == 1 || shelfNum == 3 || shelfNum == 5 || shelfNum == 7)
            spritesheetXStart = 4;
        else
            spritesheetXStart = 84;
        if (shelfNum == 1 || shelfNum == 2)
            spritesheetYStart = 5;
        else if (shelfNum == 3 || shelfNum == 4)
            spritesheetYStart = 53;
        else if (shelfNum == 5 || shelfNum == 6)
            spritesheetYStart = 101;
        else
            spritesheetYStart = 149;
        // const renderer = new ImageRenderer(spritesheet, posComp, shelfSize);
        // super.setRenderer(renderer);
        //const renderer = new StaticSpriteRenderer(spritesheet, 86, 8, 68, 36, posComp);
        const renderer = new StaticSpriteRenderer(spritesheet, spritesheetXStart, spritesheetYStart, SHELF_WIDTH, SHELF_HEIGHT, posComp, shelfSize);
        super.setRenderer(renderer);
    }
}
