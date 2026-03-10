import { BasicSize } from "../../../componentLibrary/BasicSize.ts";
import { staticPositionComponent } from "../../../componentLibrary/staticPositionComponent.ts";
import { StaticSpriteRenderer } from "../../../componentLibrary/staticSpriteRenderer.ts";
import { Entity } from "../../../entity.ts";
import { ASSET_MANAGER } from "../../main.ts";

/**
 * Store floor grid interior
 * @author Emma Szebenyi
 */
export class FloorGrid extends Entity {

  /**
   * Creates a grid for the store floor
   */
  constructor(
  ) {
    super();
    
    const floor = ASSET_MANAGER.getImageAsset("floorGrid");
    if (floor === null) 
      throw new Error("Failed to load asset for store interior floor grid");
    
    const pos = new staticPositionComponent({x: 0, y: 0});
    const size = new BasicSize(1280, 720, 1);
    const renderer = new StaticSpriteRenderer(floor, 0, 0, 1280, 720, pos, size, null, null, 0.5);
    super.setRenderer(renderer);
  }
}