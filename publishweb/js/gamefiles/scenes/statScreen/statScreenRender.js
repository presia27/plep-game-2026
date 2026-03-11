import { Entity } from "../../../entity.js";
export class StatScreenRender extends Entity {
    constructor() {
        super();
        super.setRenderer(new Renderer());
    }
}
class Renderer {
    draw(context) {
        const ctx = context.ctx;
        ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "36px Arial";
        ctx.fillText("Level complete, you are moving on", ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.restore();
    }
}
