export class VehicleRender {
    constructor(spritesheet, spriteXstart, spriteYstart, spriteWidth, spriteHeight, positionComponent, 
    //movementSys: VehicleMovementSys,
    sizeComponent, boundingBox) {
        this.sprite = spritesheet;
        this.sx = spriteXstart;
        this.sy = spriteYstart;
        this.sw = spriteWidth;
        this.sh = spriteHeight;
        this.pos = positionComponent;
        //this.movSys = movementSys;
        this.size = sizeComponent;
        this.bBox = boundingBox !== null && boundingBox !== void 0 ? boundingBox : null;
        // this.animation = new Animator(
        //   sprite,
        //   sx, sy,
        //   sw, sh,
        //   1, 0.2, 0,
        //   false, true, false
        // )
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
