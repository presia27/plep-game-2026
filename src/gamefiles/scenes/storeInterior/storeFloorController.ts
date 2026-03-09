import { BasicSize } from "../../../componentLibrary/BasicSize.ts";
import { staticPositionComponent } from "../../../componentLibrary/staticPositionComponent.ts";
import { StaticSpriteRenderer } from "../../../componentLibrary/staticSpriteRenderer.ts";
import { Entity } from "../../../entity.ts";
import { ASSET_MANAGER } from "../../main.ts";

/**
 * Store interior controller entity representing interior UI + any required behavior
 * @author Emma Szebenyi
 */
export class StoreFloor extends Entity {

  /**
   * Creates any store interior entities 
   */
  constructor(
  ) {
    super();
    
    const floor = ASSET_MANAGER.getImageAsset("floor");
    if (floor === null) 
      throw new Error("Failed to load asset for store interior floor texture");
    
    const pos = new staticPositionComponent({x: 0, y: 0});
    const size = new BasicSize(1280, 720, 1);
    const renderer = new StaticSpriteRenderer(floor, 0, 0, 1280, 720, pos, size);
    super.setRenderer(renderer);
  }
}