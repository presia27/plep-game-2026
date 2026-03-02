/**
 * Entity wrapper to display the inventory
 * in the scene
 * @author Preston Sia
 */

import { Entity } from "../../entity.ts";
import { InputSystem } from "../../inputsys.ts";
import { InventoryManager } from "./inventoryManager.ts";
import { InventoryRenderer } from "./inventoryRenderer.ts";
import { InventorySelectorComponent } from "./inventorySelectorComponent.ts";

export class InventoryDisplayEntity extends Entity {
  constructor(x: number, y: number, inventoryMgr: InventoryManager, inputSys: InputSystem) {
    super();
    const selectorComponent = new InventorySelectorComponent(inputSys);
    super.addComponent(selectorComponent);

    const renderer = new InventoryRenderer(x, y, inventoryMgr, selectorComponent);
    this.setRenderer(renderer);
  }
}
