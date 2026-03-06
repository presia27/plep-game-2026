import { GameContext } from "../../../classinterfaces.ts";
import { BasicSize } from "../../../componentLibrary/BasicSize.ts";
import { staticPositionComponent } from "../../../componentLibrary/staticPositionComponent.ts";
import { StaticSpriteRenderer } from "../../../componentLibrary/staticSpriteRenderer.ts";
import { Entity } from "../../../entity.ts";
import { XY } from "../../../typeinterfaces.ts";
import { ASSET_MANAGER } from "../../main.ts";

export const SHELF_SCALE: number = 4;
export const SHELF_WIDTH: number = 68;
export const SHELF_HEIGHT: number = 38;

/**
 * Handles rendering shelf shadows using shelf locations
 * @author Emma Szebenyi
 */
export class ShelfShadow extends Entity {
  private posComp: staticPositionComponent;
  private shelfSize: BasicSize;
  
  constructor(position: XY) {
    super();
    
    this.posComp = new staticPositionComponent(position);
    this.shelfSize = new BasicSize(SHELF_WIDTH, SHELF_HEIGHT, SHELF_SCALE);
    super.addComponent(this.posComp);
    super.addComponent(this.shelfSize);

    const shadow = ASSET_MANAGER.getImageAsset("shelfShadow");
    if (shadow === null) {
      throw new Error("Failed to load asset for shelf shadows");
    }
    const shadowPos = new staticPositionComponent({x: this.posComp.getPosition().x + 2 * SHELF_SCALE, y: this.posComp.getPosition().y + SHELF_HEIGHT * SHELF_SCALE} )
    const shadowDestSize = new BasicSize(SHELF_WIDTH, SHELF_HEIGHT / 3, SHELF_SCALE)
    const shadowRenderer = new StaticSpriteRenderer(shadow, 0, 0, 68, 12, shadowPos, shadowDestSize, null, true, .65);
    super.setRenderer(shadowRenderer);
  }
  /*
  override update(context: GameContext): void {
  }*/
  // override draw(context: GameContext): void {
  //   const shadowPos = new staticPositionComponent({x: this.posComp.getPosition().x + 2 * SHELF_SCALE, y: this.posComp.getPosition().y + SHELF_HEIGHT * SHELF_SCALE} )
    
  //   const ctx = context.ctx;
  //   ctx.save();
    
  //   ctx.fillStyle = "#00000000"; // should be transparent
  //   ctx.shadowColor = "#372e4d";
  //   ctx.shadowBlur = 6;
  //   ctx.shadowOffsetX = 0;  // no horizontal offset
  //   ctx.shadowOffsetY = 8;  // pushes shadow directly downward
    
  //   ctx.fillRect(
  //     shadowPos.getPosition().x,
  //     shadowPos.getPosition().y,
  //     SHELF_WIDTH * SHELF_SCALE,
  //     SHELF_HEIGHT * SHELF_SCALE / 3
  //   );

  //   // reset shadow so it doesn't affect other drawings
  //   ctx.shadowColor = 'transparent';
  //   ctx.shadowBlur = 0;
  //   ctx.shadowOffsetX = 0;
  //   ctx.shadowOffsetY = 0;
  // }

  // public resetShadow(): void {

  // }
}

//not sure if changing the vars to instance vars will cause some PBR issues but we will see