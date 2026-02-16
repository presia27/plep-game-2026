/**
 * TEMPORARY entity for displaying the inventory renderer.
 * This code must be moved to the scene manager when 
 * that becomes ready.
 * 
 * AGAIN DO NOT USE IN PRODUCTION!!!!
 * @author Preston Sia
 */

import { Entity } from "../../entity.ts";
import { InventoryManager } from "./inventoryManager.ts";
import { InventoryRenderer } from "./inventoryRenderer.ts";

export class TemporaryInventoryDisplayEntity extends Entity {
  constructor(x: number, y: number, inventoryMgr: InventoryManager) {
    super();

    const renderer = new InventoryRenderer(x, y, inventoryMgr);
    this.setRenderer(renderer);
  }
}
