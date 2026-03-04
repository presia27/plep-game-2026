/**
 * Entity wrapper to display the inventory
 * in the scene
 * @author Preston Sia
 */
import { Entity } from "../../entity.js";
import { InventoryRenderer } from "./inventoryRenderer.js";
import { InventorySelectorComponent } from "./inventorySelectorComponent.js";
export class InventoryDisplayEntity extends Entity {
    constructor(x, y, inventoryMgr, inputSys) {
        super();
        const selectorComponent = new InventorySelectorComponent(inputSys, inventoryMgr);
        super.addComponent(selectorComponent);
        const renderer = new InventoryRenderer(x, y, inventoryMgr);
        this.setRenderer(renderer);
    }
}
