import { Entity } from "../../../entity.js";
import { ASSET_MANAGER } from "../../main.js";
export class StartScreenRender extends Entity {
    constructor(getTitle) {
        super();
        super.setRenderer(new Renderer(getTitle));
    }
}
class Renderer {
    constructor(getTitle) {
        this.getTitle = getTitle;
    }
    draw(context) {
        const ctx = context.ctx;
        ctx.save();
        // Draw background image
        const bgImage = ASSET_MANAGER.getImageAsset("tempbg");
        if (bgImage) {
            ctx.drawImage(bgImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        else {
            // Fallback to black if image not loaded
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        // Apply dark filter overlay
        ctx.fillStyle = "rgba(0, 0, 20, 0.6)"; // slightly blue/dark tint
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // Draw Title Text
        const title = this.getTitle();
        ctx.textAlign = "center";
        // Title shadow
        ctx.font = "bold 64px 'Trebuchet MS', Arial, sans-serif";
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillText(title, ctx.canvas.width / 2 + 4, ctx.canvas.height / 4 + 4);
        // Title foreground
        ctx.fillStyle = "#FFD700"; // gold color
        ctx.fillText(title, ctx.canvas.width / 2, ctx.canvas.height / 4);
        ctx.restore();
    }
}
