import { INVENTORY_MAX_SLOTS } from "../../gameState.js";
import { InputAction } from "../../inputactionlist.js";
export class InventorySelectorComponent {
    constructor(inputSystem, inventory) {
        this.inputSystem = inputSystem;
        this.inventory = inventory;
    }
    update(context) {
        var _a;
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
            if (this.inputSystem.isActionActiveSingle((_a = inventoryInputActions[i]) !== null && _a !== void 0 ? _a : InputAction.INVENTORY1)) {
                this.inventory.setSlot(i);
            }
        }
        // TEST TEST TEMPORARY
        if (this.inputSystem.isActionActiveSingle(InputAction.DROP)) {
            this.inventory.dropItemInHand();
        }
    }
}
