import { GameContext, IComponent } from "../../classinterfaces.ts";
import { INVENTORY_MAX_SLOTS } from "../../gameState.ts";
import { InputAction } from "../../inputactionlist.ts";
import { InputSystem } from "../../inputsys.ts";
import { InventoryManager } from "./inventoryManager.ts";

export class InventorySelectorComponent implements IComponent {
  private inputSystem: InputSystem;
  private inventory: InventoryManager

  constructor(
    inputSystem: InputSystem,
    inventory: InventoryManager
  ) {
    this.inputSystem = inputSystem;
    this.inventory = inventory
  }

  update(context: GameContext): void {
    const inventoryInputActions = [
      InputAction.INVENTORY1,
      InputAction.INVENTORY2,
      InputAction.INVENTORY3,
      InputAction.INVENTORY4,
      InputAction.INVENTORY5,
      InputAction.INVENTORY6
    ];
    for (let i = 0; i < INVENTORY_MAX_SLOTS; i++) {
      // If there are more inventory slots than inputs registered above, then it just won't register for now
      if (this.inputSystem.isActionActiveSingle(inventoryInputActions[i] ?? InputAction.INVENTORY1)) {
        this.inventory.setSlot(i);
      }
    }

    // TEST TEST TEMPORARY
    if (this.inputSystem.isActionActiveSingle(InputAction.DROP)) {
      this.inventory.dropItemInHand();
    }
    
  }

}