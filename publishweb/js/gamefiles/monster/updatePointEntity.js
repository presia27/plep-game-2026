import { BasicSize } from "../../componentLibrary/BasicSize.js";
import { BoundingBox } from "../../componentLibrary/boundingBox.js";
import { Entity } from "../../entity.js";
import { staticPositionComponent } from "../../componentLibrary/staticPositionComponent.js";
/**
 * Update point class for monster entity to determine when the monster is allowed to change direction.
 * Handles spawning of these points and detection of monster collision.
 *
 * @author Emma Szebenyi
 */
export class UpdatePoint extends Entity {
    /**
     * A point on the canvas where the monster is allowed to change direction
     *
     * @param updatePoint A point on the canvas where the monster is allowed to change direction
     */
    constructor(updatePoint) {
        super();
        this.updatePoint = updatePoint;
        // create static position component for bounding box + for entity
        const pointPosition = new staticPositionComponent({ x: updatePoint.x, y: updatePoint.y });
        // set size + scale of bounding box
        const updatePointBBSize = new BasicSize(5, 5, 5);
        // instantiate bounding box
        this.updatePointBB = new BoundingBox(pointPosition, updatePointBBSize);
        // NOTE: not sure if i should add this.updatePoint or pointPosition, since they seem to be the same thing to me.. but apparently theyre not
        super.addComponent(pointPosition);
        super.addComponent(this.updatePointBB);
    }
    getPosition() {
        return this.updatePoint;
    }
    draw(context) {
        if (context.debug) {
            context.ctx.save();
            // draw the full extent of the entity
            context.ctx.strokeStyle = "#e30282";
            context.ctx.strokeRect(this.updatePoint.x, this.updatePoint.y, 2, 2);
            // draw bounding box
            context.ctx.strokeStyle = "#197d61";
            if (this.updatePointBB) {
                context.ctx.strokeRect(this.updatePointBB.getLeft(), this.updatePointBB.getTop(), this.updatePointBB.getRight() - this.updatePointBB.getLeft(), this.updatePointBB.getBottom() - this.updatePointBB.getTop());
            }
            context.ctx.restore();
        }
    }
}
