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
    constructor(positionMgr, sizeMgr) {
        this.left = positionMgr.getPosition().x;
        this.top = positionMgr.getPosition().y;
        this.right = this.left + sizeMgr.getWidth();
        this.bottom = this.top + sizeMgr.getHeight();
        this.positionMgr = positionMgr;
        this.sizeMgr = sizeMgr;
    }
    update(context) {
        this.left = this.positionMgr.getPosition().x;
        this.top = this.positionMgr.getPosition().y;
        this.right = this.left + this.sizeMgr.getWidth();
        this.bottom = this.top + this.sizeMgr.getHeight();
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
    collide(oth) {
        if (this.right > oth.getLeft() && this.left < oth.getRight()
            && this.top < oth.getBottom() && this.bottom > oth.getTop()) {
            return true;
        }
        return false;
    }
}
