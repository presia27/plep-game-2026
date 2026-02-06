import { BasicSize } from "../../componentLibrary/BasicSize.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { staticPositionComponent } from "../../componentLibrary/staticPositionComponent.ts";
import { StaticSpriteRenderer } from "../../componentLibrary/staticSpriteRenderer.ts";
import { Entity } from "../../entity.ts";
import { XY } from "../../typeinterfaces.ts";

const SHELF_SCALE: number = 4;

/**
 * Shelf controller entity representing shelf logic and component behavior
 * @author pmo, Preston Sia, Emma Szebenyi
 */
export class ShelfController extends Entity {
  constructor(position: XY, spritesheet: HTMLImageElement) {
    super();

    // ADD ESSENTIAL LOGIC COMPONENTS
    const posComp = new staticPositionComponent(position);
    const shelfSize = new BasicSize(68, 36, SHELF_SCALE);
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
