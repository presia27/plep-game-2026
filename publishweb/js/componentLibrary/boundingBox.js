/**
 *
 */
export class BoundingBox {
    /**
     *
     * @param x Initial X coordinate
     * @param y Initial Y coordinate
     * @param width Initial width
     * @param height Initial height
     * @param positionMgr Component that holds the current X-Y position of an entity
     */
    constructor(positionMgr, sizeMgr, offsetX, offsetY) {
        this.left = positionMgr.getPosition().x;
        this.top = positionMgr.getPosition().y;
        this.right = this.left + sizeMgr.getWidth();
        this.bottom = this.top + sizeMgr.getHeight();
        this.positionMgr = positionMgr;
        this.sizeMgr = sizeMgr;
        this.offsetX = offsetX ? offsetX : 0;
        this.offsetY = offsetY ? offsetY : 0;
    }
    update(context) {
        this.left = this.positionMgr.getPosition().x;
        this.top = this.positionMgr.getPosition().y;
        this.right = this.left + this.sizeMgr.getWidth();
        this.bottom = this.top + this.sizeMgr.getHeight();
        this.applyOffsets();
    }
    getLeft() {
        return this.left;
    }
    getTop() {
        return this.top;
    }
    getRight() {
        return this.right;
    }
    getBottom() {
        return this.bottom;
    }
    getOffsetX() {
        return this.offsetX;
    }
    getOffsetY() {
        return this.offsetY;
    }
    applyOffsets() {
        this.left = this.left + this.offsetX;
        this.right = this.right + this.offsetX;
        this.top = this.top + this.offsetY;
        this.bottom = this.bottom + this.offsetY;
    }
    collide(oth) {
        if (this.right > oth.getLeft() && this.left < oth.getRight()
            && this.top < oth.getBottom() && this.bottom > oth.getTop()) {
            return true;
        }
        return false;
    }
}
