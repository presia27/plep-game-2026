import { Entity } from "../../../entity.js";
import { ASSET_MANAGER } from "../../main.js";
const BOSS_ICON_WIDTH = 20;
const BOSS_ICON_HEIGHT = 23;
export class LoseScreenRender extends Entity {
    constructor(loseText) {
        super();
        super.setRenderer(new Renderer(loseText));
    }
}
class Renderer {
    constructor(loseText) {
        const bossSpritesheet = ASSET_MANAGER.getImageAsset("bossIcons");
        if (bossSpritesheet === null)
            throw new Error("Failed to load asset for the boss icons");
        this.bossIcons = bossSpritesheet;
        this.loseText = loseText;
    }
    draw(context) {
        const ctx = context.ctx;
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.globalAlpha = 0.5; // lower opacity for image
        ctx.drawImage(this.bossIcons, 111, 1, BOSS_ICON_WIDTH, BOSS_ICON_HEIGHT, 510, 125, BOSS_ICON_WIDTH * 17, BOSS_ICON_HEIGHT * 17);
        ctx.globalAlpha = 1; // restore global opacity
        ctx.fillStyle = 'white';
        ctx.font = '40px "Jersey-20", Arial';
        let textToFill = "YOU LOST - " + this.loseText;
        ctx.fillText(textToFill, 250, ctx.canvas.height / 2 + 10);
        ctx.restore();
    }
}
