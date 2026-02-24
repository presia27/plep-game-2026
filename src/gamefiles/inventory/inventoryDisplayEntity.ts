/**
 * Entity wrapper to display the inventory
 * in the scene
 * @author Preston Sia
 */

import { Entity } from "../../entity.ts";
import { InventoryManager } from "./inventoryManager.ts";
import { InventoryRenderer } from "./inventoryRenderer.ts";

export class InventoryDisplayEntity extends Entity {
  constructor(x: number, y: number, inventoryMgr: InventoryManager) {
    super();

    const renderer = new InventoryRenderer(x, y, inventoryMgr);
    this.setRenderer(renderer);
  }
}
