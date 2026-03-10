import { Entity } from "../../../entity.js";
import { ASSET_MANAGER } from "../../main.js";
export class SplashScreenRender extends Entity {
    constructor(canvasWidth, canvasHeight) {
        super();
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        super.setRenderer(new Renderer(canvasWidth, canvasHeight));
    }
}
class Renderer {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }
    draw(context) {
        const ctx = context.ctx;
        ctx.save();
        // Draw solid black background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // Draw title image in center
        const titleImg = ASSET_MANAGER.getImageAsset("titleImage");
        if (titleImg) {
            const scale = 4;
            const imgWidth = titleImg.width * scale;
            const imgHeight = titleImg.height * scale;
            const x = (this.canvasWidth / 2) - (imgWidth / 2);
            const y = (this.canvasHeight / 2) - (imgHeight / 2) - 150; // Moved up more
            ctx.drawImage(titleImg, x, y, imgWidth, imgHeight);
        }
        ctx.restore();
    }
}
