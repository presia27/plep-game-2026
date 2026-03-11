import { IPosition } from "../../../classinterfaces.ts";
import { BasicSize } from "../../../componentLibrary/BasicSize.ts";
import { BoundingBox } from "../../../componentLibrary/boundingBox.ts";
import { staticPositionComponent } from "../../../componentLibrary/staticPositionComponent.ts";
import { StaticSpriteRenderer } from "../../../componentLibrary/staticSpriteRenderer.ts";
import { Entity } from "../../../entity.ts";
import { XY } from "../../../typeinterfaces.ts";
import { ASSET_MANAGER } from "../../main.ts";

/**
 * Controller + renderer for shopping cart
 * @author Emma Szebenyi
 */
export class ShoppingCart extends Entity {
  private cartPos: IPosition;
  private sx: number;
  private sw: number;
  private sh: number;

  /**
   * Creates self checkout in checkout room using pre-defined locations
   * 
   * @param checkoutPos position where checkout should be placed
   */
  constructor(
    cartPos: XY,
    sx: number,
    sw: number,
    sh: number
  ) {
    super();

    this.sx = sx;
    this.sw = sw;
    this.sh = sh;

    const cartSize = new BasicSize(this.sw, this.sh, 4);
    this.cartPos = new staticPositionComponent(cartPos);
    const cartBBoxSize = new BasicSize(this.sw, this.sh/2, 4);
    const bBox = new BoundingBox(this.cartPos, cartBBoxSize)
    
    super.addComponent(bBox);
    
    const cart = ASSET_MANAGER.getImageAsset("shoppingCart");
    if (cart === null) 
      throw new Error("Failed to load asset for shopping cart");
    const renderer = new StaticSpriteRenderer(cart, this.sx, 1, this.sw, this.sh, this.cartPos, cartSize, bBox);
    super.setRenderer(renderer)
  }
}
