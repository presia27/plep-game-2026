export class VehicleRender {
    constructor(spritesheet, spriteXstart, spriteYstart, spriteWidth, spriteHeight, positionComponent, sizeComponent, boundingBox) {
        this.sprite = spritesheet;
        this.sx = spriteXstart;
        this.sy = spriteYstart;
        this.sw = spriteWidth;
        this.sh = spriteHeight;
        this.pos = positionComponent;
        this.size = sizeComponent;
        this.bBox = boundingBox !== null && boundingBox !== void 0 ? boundingBox : null;
    }
    /**
     * Change what is rendered based on passed values
     *
     * @param sx starting x on spritesheet
     * @param sy starting y on spritesheet
     * @param sw sprite width
     * @param sh sprite height
     * @param size size of entity
     * @param bBox size of bounding box (if applicable)
     */
    setSprite(sx, sy, sw, sh, size, bBox) {
        this.sx = sx;
        this.sy = sy;
        this.sw = sw;
        this.sh = sh;
        this.size = size;
        this.bBox = bBox !== null && bBox !== void 0 ? bBox : null;
    }
    // extend the functionality of draw to be able to draw hint text
    draw(context) {
        const pos = this.pos.getPosition();
        context.ctx.drawImage(this.sprite, this.sx, this.sy, this.sw, this.sh, this.pos.getPosition().x, this.pos.getPosition().y, this.size.getWidth(), this.size.getHeight());
        if (context.debug) {
            context.ctx.save();
            // draw the full extent of the entity
            context.ctx.strokeStyle = "#0000cd";
            context.ctx.strokeRect(this.pos.getPosition().x, this.pos.getPosition().y, this.size.getWidth(), this.size.getHeight());
            // draw bounding box
            context.ctx.strokeStyle = "#ff0000";
            if (this.bBox) {
                context.ctx.strokeRect(this.bBox.getLeft(), this.bBox.getTop(), this.bBox.getRight() - this.bBox.getLeft(), this.bBox.getBottom() - this.bBox.getTop());
            }
            context.ctx.restore();
        }
    }
}
