/**
 * Simple image renderer component that draws an image at the entity's position
 * @author Preston Sia
 */
export class ImageRenderer {
    constructor(image, positionComponent, sizeComponent = null) {
        this.image = image;
        this.positionComponent = positionComponent;
        this.sizeComponent = sizeComponent;
    }
    draw(context) {
        const pos = this.positionComponent.getPosition();
        if (this.sizeComponent) {
            const width = this.sizeComponent.getWidth();
            const height = this.sizeComponent.getHeight();
            context.ctx.drawImage(this.image, pos.x, pos.y, width, height);
        }
        else {
            // Draw with natural image size
            context.ctx.drawImage(this.image, pos.x, pos.y);
        }
    }
}
