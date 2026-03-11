import { GameContext, IPosition, IRenderer } from "../../classinterfaces.ts";

const LIGHT_WIDTH = 70;
const LIGHT_HEIGHT = 19;
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 19;
const SCALE = 5;

/**
 * Renderer for the player light sprite
 */
export class PlayerLightRenderer implements IRenderer {
  private sprite: HTMLImageElement;
  private playerPosition: IPosition;

  constructor(sprite: HTMLImageElement, playerPosition: IPosition) {
    this.sprite = sprite;
    this.playerPosition = playerPosition;
  }

  public draw(context: GameContext): void {
    const pos = this.playerPosition.getPosition();


    // center the light under the player horizontally
    const drawX = pos.x - (LIGHT_WIDTH / 2) + (PLAYER_WIDTH * SCALE / 2); 
    // place it just below the player's feet
    const drawY = pos.y + (PLAYER_HEIGHT * SCALE) - (LIGHT_HEIGHT / 2); 
    
    context.ctx.save();
    context.ctx.globalAlpha = 0.6; // slight transparency so it doesn't overpower the scene
    context.ctx.drawImage(
      this.sprite,
      //0, 0,                    // source x, y
      //LIGHT_WIDTH, LIGHT_HEIGHT, // source width, height
      drawX, drawY            // destination x, y
      //LIGHT_WIDTH, LIGHT_HEIGHT  // destination width, height
    );
    context.ctx.globalAlpha = 1;
    context.ctx.restore();
  }
}