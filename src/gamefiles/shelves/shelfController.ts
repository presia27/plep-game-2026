import { BasicSize } from "../../componentLibrary/BasicSize.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { ImageRenderer } from "../../componentLibrary/imageRenderer.ts";
import { staticPositionComponent } from "../../componentLibrary/staticPositionComponent.ts";
import { Entity } from "../../entity.ts";
import { XY } from "../../typeinterfaces.ts";

/**
 * Shelf controller entity representing shelf logic and component behavior
 * @author pmo, Preston Sia
 */
export class ShelfController extends Entity {
  constructor(position: XY, spritesheet: HTMLImageElement) {
    super();

    // ADD ESSENTIAL LOGIC COMPONENTS
    const posComp = new staticPositionComponent(position);
    const shelfSize = new BasicSize(spritesheet.width, spritesheet.height, 1.5);
    const shelfBoundingBox = new BoundingBox(posComp, shelfSize);
    super.addComponent(posComp);
    super.addComponent(shelfSize);
    super.addComponent(shelfBoundingBox);

    // REPLACE THIS RENDERER WITH CUSTOM VERSION
    const renderer = new ImageRenderer(spritesheet, posComp, shelfSize);
    super.setRenderer(renderer);
  }
}
