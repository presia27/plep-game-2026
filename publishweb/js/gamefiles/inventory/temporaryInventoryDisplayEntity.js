/**
 * TEMPORARY entity for displaying the inventory renderer.
 * This code must be moved to the scene manager when
 * that becomes ready.
 *
 * AGAIN DO NOT USE IN PRODUCTION!!!!
 * @author Preston Sia
 */
import { Entity } from "../../entity.js";
import { InventoryRenderer } from "./inventoryRenderer.js";
export class TemporaryInventoryDisplayEntity extends Entity {
    constructor(x, y, inventoryMgr) {
        super();
        const renderer = new InventoryRenderer(x, y, inventoryMgr);
        this.setRenderer(renderer);
    }
}
