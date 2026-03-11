import { Entity } from "../../entity.js";
import { ASSET_MANAGER } from "../main.js";
import { PlayerLightRenderer } from "./playerLightRenderer.js";
/**
 * Lights for floor - renders a highlight sprite underneath the player
 * @author Emma Szebenyi
 */
export class PlayerLight extends Entity {
    constructor(playerPosition) {
        super();
        const empLight = ASSET_MANAGER.getImageAsset("empLight");
        if (empLight === null)
            throw new Error("Failed to load asset for employee light");
        const renderer = new PlayerLightRenderer(empLight, playerPosition);
        super.setRenderer(renderer);
        this.playerPosition = playerPosition;
    }
}
