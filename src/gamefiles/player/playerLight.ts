import { Entity } from "../../entity.ts";
import { ASSET_MANAGER } from "../main.ts";
import { IPosition } from "../../classinterfaces.ts";
import { PlayerLightRenderer } from "./playerLightRenderer.ts";

/**
 * Lights for floor - renders a highlight sprite underneath the player
 * @author Emma Szebenyi
 */
export class PlayerLight extends Entity {
  private playerPosition: IPosition;

  constructor(playerPosition: IPosition) {
    super();
    const empLight = ASSET_MANAGER.getImageAsset("empLight");
    if (empLight === null)
      throw new Error("Failed to load asset for employee light");
    
    const renderer = new PlayerLightRenderer(empLight, playerPosition);
    super.setRenderer(renderer);

    this.playerPosition = playerPosition;
  }
}