/**
 * Entity wrapper to display the inventory
 * in the scene
 * @author Preston Sia
 */
import { Entity } from "../../entity.js";
import { InventoryRenderer } from "./inventoryRenderer.js";
export class InventoryDisplayEntity extends Entity {
    constructor(x, y, inventoryMgr) {
        super();
        const renderer = new InventoryRenderer(x, y, inventoryMgr);
        this.setRenderer(renderer);
    }
}
