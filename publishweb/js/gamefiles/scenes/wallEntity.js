import { BoundingBox } from "../../componentLibrary/boundingBox.js";
import { BasicSize } from "../../componentLibrary/BasicSize.js";
import { Entity } from "../../entity.js";
import { ASSET_MANAGER } from "../main.js";
const SCALE = 3;
const SY = 1;
/**
 * Abstract base class for wall entities.
 * Extend this for each individual wall side.
 */
export class WallEntity extends Entity {
    // sx, sw, sh values to be used when implementing sprites later on
    constructor(pos, width, height, sx, sw, sh) {
        super();
        const size = new BasicSize(width, height, SCALE);
        this.wallBoundingBox = new BoundingBox(pos, size, 0, 0);
        super.addComponent(pos);
        super.addComponent(this.wallBoundingBox);
        const wallSprite = ASSET_MANAGER.getImageAsset("walls");
        if (wallSprite === null)
            throw new Error("Failed to load asset for walls");
        //const render = new StaticSpriteRenderer(wallSprite, sx, 1, sw, sh, pos, size, this.wallBoundingBox);
        //super.setRenderer(render);
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
