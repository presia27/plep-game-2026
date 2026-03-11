import { BoundingBox } from "../../componentLibrary/boundingBox.js";
import { BasicSize } from "../../componentLibrary/BasicSize.js";
import { Entity } from "../../entity.js";
/**
 * Abstract base class for wall entities.
 * Extend this for each individual wall side.
 */
export class WallEntity extends Entity {
    constructor(pos, width, height, scale) {
        super();
        const size = new BasicSize(width, height, scale);
        this.wallBoundingBox = new BoundingBox(pos, size, 0, 0);
        super.addComponent(pos);
        super.addComponent(this.wallBoundingBox);
    }
    draw(context) {
        super.draw(context);
        if (context.debug) {
            context.ctx.save();
            context.ctx.strokeStyle = "#197d61";
            context.ctx.strokeRect(this.wallBoundingBox.getLeft(), this.wallBoundingBox.getTop(), this.wallBoundingBox.getRight() - this.wallBoundingBox.getLeft(), this.wallBoundingBox.getBottom() - this.wallBoundingBox.getTop());
            context.ctx.restore();
        }
    }
}
