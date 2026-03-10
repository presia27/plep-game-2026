import { Entity } from "../../../entity.js";
export class StartupScreenRender extends Entity {
    constructor() {
        super();
        super.setRenderer(new Renderer());
    }
}
class Renderer {
    draw(context) {
        const ctx = context.ctx;
        ctx.save();
        // Draw solid black background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
    }
}
