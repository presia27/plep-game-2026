import { Entity } from "../../entity.js";
import { ASSET_MANAGER } from "../main.js";
export class SliderEntity extends Entity {
    constructor(label, x, y, width, height, initialValue, inputsys, onChange) {
        super();
        this.isDragging = false;
        this.playedDragSound = false;
        this.label = label;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.value = Math.max(0, Math.min(1, initialValue));
        this.inputsys = inputsys;
        this.onChange = onChange;
    }
    update(context) {
        const clickState = this.inputsys.getLeftClick();
        if (clickState) {
            const handleX = this.x + (this.value * this.width);
            const handleWidth = 20;
            const handleHeight = this.height + 10;
            const handleY = this.y - 5;
            // Check if clicking on the handle
            const isOnHandle = this.containsCursor(clickState.x, clickState.y, handleX - handleWidth / 2, handleY, handleWidth, handleHeight);
            // Check if clicking on the track
            const isOnTrack = this.containsCursor(clickState.x, clickState.y, this.x, this.y, this.width, this.height);
            if (isOnHandle || (isOnTrack && !this.isDragging)) {
                this.isDragging = true;
                if (!this.playedDragSound) {
                    ASSET_MANAGER.playMusic("uiSound");
                    this.playedDragSound = true;
                }
            }
        }
        else {
            this.isDragging = false;
            this.playedDragSound = false;
        }
        // Update slider value while dragging
        if (this.isDragging && clickState) {
            const relativeX = clickState.x - this.x;
            const newValue = Math.max(0, Math.min(1, relativeX / this.width));
            if (newValue !== this.value) {
                this.value = newValue;
                this.onChange(this.value);
            }
        }
    }
    draw(gameContext) {
        const ctx = gameContext.ctx;
        ctx.save();
        // Draw label
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(this.label, this.x + this.width / 2, this.y - 15);
        // Draw track background
        ctx.fillStyle = "#424242";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // Draw filled portion
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(this.x, this.y, this.width * this.value, this.height);
        // Draw track border
        ctx.strokeStyle = "#757575";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        // Draw handle
        const handleX = this.x + (this.value * this.width);
        const handleWidth = 20;
        const handleHeight = this.height + 10;
        const handleY = this.y - 5;
        ctx.fillStyle = this.isDragging ? "#66BB6A" : "#FFFFFF";
        ctx.fillRect(handleX - handleWidth / 2, handleY, handleWidth, handleHeight);
        ctx.strokeStyle = "#424242";
        ctx.lineWidth = 2;
        ctx.strokeRect(handleX - handleWidth / 2, handleY, handleWidth, handleHeight);
        // Draw percentage value
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "white";
        const percentage = Math.round(this.value * 100) + "%";
        ctx.fillText(percentage, this.x + this.width / 2, this.y + this.height + 25);
        ctx.restore();
    }
    containsCursor(pointerX, pointerY, x, y, w, h) {
        return pointerX >= x && pointerX <= x + w && pointerY >= y && pointerY <= y + h;
    }
}
