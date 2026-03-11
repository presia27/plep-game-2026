import { BasicSize } from "../../../componentLibrary/BasicSize.js";
import { BoundingBox } from "../../../componentLibrary/boundingBox.js";
import { Entity } from "../../../entity.js";
/**
 * Ball entity for store exterior to deal with player collision
 * @author Emma Szebenyi
 */
export class Ball extends Entity {
    constructor(pos) {
        super();
        const ballSize = new BasicSize(80, 40, 1);
        this.ballBoundingBox = new BoundingBox(pos, ballSize, 0, 0);
        super.addComponent(pos);
        super.addComponent(this.ballBoundingBox);
    }
    draw(context) {
        if (context.debug) {
            context.ctx.save();
            context.ctx.strokeStyle = "#ff0000";
            context.ctx.strokeRect(this.ballBoundingBox.getLeft(), this.ballBoundingBox.getTop(), this.ballBoundingBox.getRight() - this.ballBoundingBox.getLeft(), this.ballBoundingBox.getBottom() - this.ballBoundingBox.getTop());
            context.ctx.restore();
        }
    }
}
