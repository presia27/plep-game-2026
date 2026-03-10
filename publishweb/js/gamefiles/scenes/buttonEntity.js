import { Entity } from "../../entity.js";
import { ASSET_MANAGER } from "../main.js";
export class ButtonEntity extends Entity {
    constructor(text, color, textColor, x, y, width, height, inputsys, onClick) {
        super();
        this.isHovering = false;
        this.text = text;
        this.color = color;
        this.textColor = textColor;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.inputsys = inputsys;
        this.onClick = onClick;
    }
    update(context) {
        // Check for hover state
        const cursorPos = this.inputsys.getCursorPosition();
        if (cursorPos) {
            const isInBounds = this.containsCursor(cursorPos.x, cursorPos.y, this.x, this.y, this.width, this.height);
            // Play hover sound when entering button area
            if (isInBounds && !this.isHovering) {
                ASSET_MANAGER.playMusic("uiSound");
                this.isHovering = true;
            }
            else if (!isInBounds && this.isHovering) {
                this.isHovering = false;
            }
        }
        // Check for click
        const clickState = this.inputsys.getLeftClick();
        if (clickState) {
            // Determine if it's in the button area
            const isInBounds = this.containsCursor(clickState.x, clickState.y, this.x, this.y, this.width, this.height);
            if (isInBounds) {
                ASSET_MANAGER.playMusic("uiSound");
                this.onClick();
            }
        }
    }
    draw(gameContext) {
        const ctx = gameContext.ctx;
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = "grey";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = this.textColor;
        ctx.fillText(this.text, this.x + (this.width / 2), this.y + (this.height / 2));
        ctx.restore();
    }
    containsCursor(pointerX, pointerY, x, y, w, h) {
        return pointerX >= x && pointerX <= x + w && pointerY >= y && pointerY <= y + h;
    }
}
