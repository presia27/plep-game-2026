import { BasicSize } from "../../componentLibrary/BasicSize.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { staticPositionComponent } from "../../componentLibrary/staticPositionComponent.ts";
import { StaticSpriteRenderer } from "../../componentLibrary/staticSpriteRenderer.ts";
import { Entity } from "../../entity.ts";
import { XY } from "../../typeinterfaces.ts";

export const SHELF_SCALE: number = 4;
export const SHELF_WIDTH: number = 72;
export const SHELF_HEIGHT: number = 38;

/**
 * Shelf controller entity representing shelf logic and component behavior
 * @author pmo, Preston Sia, Emma Szebenyi
 */
export class ShelfController extends Entity {
  private shelfNum: number;

  constructor(position: XY, spritesheet: HTMLImageElement, shelfNum: number) {
    super();
    this.shelfNum = shelfNum;
    
    // ADD ESSENTIAL LOGIC COMPONENTS
    const posComp = new staticPositionComponent(position);
    const shelfSize = new BasicSize(SHELF_WIDTH, SHELF_HEIGHT, SHELF_SCALE);
    const shelfBoundingSize = new BasicSize(SHELF_WIDTH, SHELF_HEIGHT/2, SHELF_SCALE)
    const shelfBoundingBox = new BoundingBox(posComp, shelfBoundingSize);
    super.addComponent(posComp);
    super.addComponent(shelfSize);
    super.addComponent(shelfBoundingBox);

    let spritesheetXStart: number = 0;
    let spritesheetYStart: number = 0;
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
