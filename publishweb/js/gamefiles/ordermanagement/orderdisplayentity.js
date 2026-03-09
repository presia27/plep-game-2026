import { Entity } from "../../entity.js";
import { OrderDisplayRenderer } from "./orderdisplayrenderer.js";
/**
 * Entity container for rendering on-screen
 */
export class OrderDisplayEntity extends Entity {
    constructor(x, y, orderLoop, getLevelNumber) {
        super();
        const renderer = new OrderDisplayRenderer(x, y, orderLoop, getLevelNumber);
        this.setRenderer(renderer);
    }
}
