import { StaticSpriteRenderer } from "../../componentLibrary/staticSpriteRenderer.js";
export class DeliveryRenderer extends StaticSpriteRenderer {
    constructor(image, spriteXstart, spriteYstart, spriteWidth, spriteHeight, positionComponent, sizeComponent, boundingBox) {
        super(image, spriteXstart, spriteYstart, spriteWidth, spriteHeight, positionComponent, sizeComponent, boundingBox);
    }
}
