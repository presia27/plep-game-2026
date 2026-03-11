import { BasicSize } from "../../../componentLibrary/BasicSize.js";
import { BoundingBox } from "../../../componentLibrary/boundingBox.js";
import { staticPositionComponent } from "../../../componentLibrary/staticPositionComponent.js";
import { StaticSpriteRenderer } from "../../../componentLibrary/staticSpriteRenderer.js";
import { Entity } from "../../../entity.js";
import { ASSET_MANAGER } from "../../main.js";
export const WIDTH = 35;
export const HEIGHT = 50;
/**
 * Controller + renderer for self checkout
 * @author Emma Szebenyi
 */
export class SelfCheckout extends Entity {
    /**
     * Creates self checkout in checkout room using pre-defined locations
     *
     * @param checkoutPos position where checkout should be placed
     */
    constructor(checkoutPos, sx) {
        super();
        this.sx = sx;
        const checkoutSize = new BasicSize(WIDTH, HEIGHT, 4);
        this.checkoutPos = new staticPositionComponent(checkoutPos);
        const checkoutBBoxSize = new BasicSize(WIDTH, HEIGHT / 2, 4);
        const bBox = new BoundingBox(this.checkoutPos, checkoutBBoxSize);
        super.addComponent(bBox);
        const checkout = ASSET_MANAGER.getImageAsset("selfCheckout");
        if (checkout === null)
            throw new Error("Failed to load asset for self checkout");
        const renderer = new StaticSpriteRenderer(checkout, this.sx, 1, WIDTH, HEIGHT, this.checkoutPos, checkoutSize, bBox);
        super.setRenderer(renderer);
    }
}
