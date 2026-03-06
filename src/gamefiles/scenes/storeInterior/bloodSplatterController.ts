import { IPosition } from "../../../classinterfaces.ts";
import { BasicSize } from "../../../componentLibrary/BasicSize.ts";
import { staticPositionComponent } from "../../../componentLibrary/staticPositionComponent.ts";
import { StaticSpriteRenderer } from "../../../componentLibrary/staticSpriteRenderer.ts";
import { Entity } from "../../../entity.ts";
import { XY } from "../../../typeinterfaces.ts";
import { ASSET_MANAGER } from "../../main.ts";

/**
 * Controller + renderer for blood splatter in room
 * @author Emma Szebenyi
 */
export class BloodController extends Entity {
  private bloodPos: IPosition;

  /**
   * Creates blood splatter in room using pre-defined locations
   * 
   * @param bloodPos position where blood should be placed in the room
   */
  constructor(
    bloodPos: XY
  ) {
    super();

    const blood = ASSET_MANAGER.getImageAsset("blood");

    if (blood === null) 
      throw new Error("Failed to load asset for blood splatter");
    
    // pick which blood sprite to use based on random number generator
    const splatterID = Math.random(); // will be a number between 0 and 1

    let sx: number = 0;   // starting x on spritesheet
    const sy: number = 1; // starting y on spritesheet (will always be 1 for blood sprites)
    let sw: number = 0;   // sprite width
    let sh: number = 0;   // sprite height

    // pick which blood sprite to use based on random number generator
    if (splatterID >= 0.75) { 
      sx = 1;
      sw = 40;
      sh = 14;
    } else if (splatterID >= 0.5) {
      sx = 43;
      sw = 37;
      sh = 8;
    } else if (splatterID >= 0.25) {
      sx = 82;
      sw = 42;
      sh = 8;
    } else { 
      sx = 126;
      sw = 23;
      sh = 6;
    }

    const bloodSize = new BasicSize(sw, sh, 4);
    this.bloodPos = new staticPositionComponent(bloodPos);
    
    const renderer = new StaticSpriteRenderer(blood, sx, sy, sw, sh, this.bloodPos, bloodSize, null, null, .75);
    super.setRenderer(renderer)
  }
}