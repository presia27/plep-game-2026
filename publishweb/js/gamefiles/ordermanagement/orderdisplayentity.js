import { Entity } from "../../entity.js";
import { OrderDisplayRenderer } from "./orderdisplayrenderer.js";
/**
 * Entity container for rendering on-screen
 */
export class OrderDisplayEntity extends Entity {
    constructor(x, y, orderLoop) {
        super();
        const renderer = new OrderDisplayRenderer(x, y, orderLoop);
        this.setRenderer(renderer);
    }
}
