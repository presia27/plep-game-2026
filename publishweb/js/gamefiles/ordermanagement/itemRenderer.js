import { StaticSpriteRenderer } from "../../componentLibrary/staticSpriteRenderer.js";
export class ItemRenderer extends StaticSpriteRenderer {
    constructor(image, spriteXstart, spriteYstart, spriteWidth, spriteHeight, positionComponent, sizeComponent, boundingBox) {
        super(image, spriteXstart, spriteYstart, spriteWidth, spriteHeight, positionComponent, sizeComponent, boundingBox);
        this.showHintText = false;
    }
    enableHintText() {
        this.showHintText = true;
    }
    // extend the functionality of draw to be able to draw hint text
    draw(context) {
        super.draw(context);
        if (this.showHintText) {
            const ctx = context.ctx;
            const positionX = this.positionComponent.getPosition().x + (this.sizeComponent.getWidth() / 2);
            const positionY = this.positionComponent.getPosition().y - 8;
            ctx.save();
            ctx.textAlign = "center";
            ctx.fillStyle = '#000000';
            ctx.fillText("PRESS E TO PICKUP", positionX, positionY);
            ctx.restore();
            // Once everything is drawn, reset temporary state used when a collision occurs
            this.showHintText = false;
        }
    }
}
