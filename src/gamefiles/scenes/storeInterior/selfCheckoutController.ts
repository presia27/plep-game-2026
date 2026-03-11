import { IPosition } from "../../../classinterfaces.ts";
import { BasicSize } from "../../../componentLibrary/BasicSize.ts";
import { BoundingBox } from "../../../componentLibrary/boundingBox.ts";
import { staticPositionComponent } from "../../../componentLibrary/staticPositionComponent.ts";
import { StaticSpriteRenderer } from "../../../componentLibrary/staticSpriteRenderer.ts";
import { Entity } from "../../../entity.ts";
import { XY } from "../../../typeinterfaces.ts";
import { ASSET_MANAGER } from "../../main.ts";

export const WIDTH: number = 35;
export const HEIGHT: number = 50;

/**
 * Controller + renderer for self checkout
 * @author Emma Szebenyi
 */
export class SelfCheckout extends Entity {
  private checkoutPos: IPosition;
  private sx: number;

  /**
   * Creates self checkout in checkout room using pre-defined locations
   * 
   * @param checkoutPos position where checkout should be placed
   */
  constructor(
    checkoutPos: XY,
    sx: number
  ) {
    super();

    this.sx = sx;
    const checkoutSize = new BasicSize(WIDTH, HEIGHT, 4);
    this.checkoutPos = new staticPositionComponent(checkoutPos);
    const checkoutBBoxSize = new BasicSize(WIDTH, HEIGHT/2, 4);
    const bBox = new BoundingBox(this.checkoutPos, checkoutBBoxSize)
    
    super.addComponent(bBox);
    
    const checkout = ASSET_MANAGER.getImageAsset("selfCheckout");
    if (checkout === null) 
      throw new Error("Failed to load asset for self checkout");
    const renderer = new StaticSpriteRenderer(checkout, this.sx, 1, WIDTH, HEIGHT, this.checkoutPos, checkoutSize, bBox);
    super.setRenderer(renderer)
  }
}