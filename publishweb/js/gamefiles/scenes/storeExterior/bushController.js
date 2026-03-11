import { BasicSize } from "../../../componentLibrary/BasicSize.js";
import { BoundingBox } from "../../../componentLibrary/boundingBox.js";
import { staticPositionComponent } from "../../../componentLibrary/staticPositionComponent.js";
import { Entity } from "../../../entity.js";
/**
 * Bush entity for store exterior to deal with player collision
 * @author Emma Szebenyi
 */
export class Bush extends Entity {
    /**
     * Creates a bush entity for the store exterior
     */
    constructor() {
        super();
        /** Add bush bounding box */
        const bushPos = new staticPositionComponent({ x: 410, y: 487 });
        const bushSize = new BasicSize(470, 60, 1);
        this.bushBoundingBox = new BoundingBox(bushPos, bushSize);
        super.addComponent(bushPos);
        super.addComponent(this.bushBoundingBox);
    }
    draw(context) {
        if (context.debug) {
            context.ctx.save();
            // draw bounding box
            context.ctx.strokeStyle = "#ff0000";
            if (this.bushBoundingBox) {
                context.ctx.strokeRect(this.bushBoundingBox.getLeft(), this.bushBoundingBox.getTop(), this.bushBoundingBox.getRight() - this.bushBoundingBox.getLeft(), this.bushBoundingBox.getBottom() - this.bushBoundingBox.getTop());
            }
            context.ctx.restore();
        }
    }
}
