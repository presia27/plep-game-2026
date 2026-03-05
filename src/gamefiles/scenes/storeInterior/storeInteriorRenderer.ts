import { GameContext, IRenderer } from "../../../classinterfaces.ts";
import { ASSET_MANAGER } from "../../main.ts";

export class StoreInteriorRenderer implements IRenderer {
  private floor: HTMLImageElement;
  private blood: HTMLImageElement;

  constructor(floor: HTMLImageElement, blood: HTMLImageElement) {
    // put these in the calling class (manager)

    // this.floor = ASSET_MANAGER.getImageAsset("floor");
    // this.blood = ASSET_MANAGER.getImageAsset("blood");
    // if (floor === null) {
    //   throw new Error("Failed to load asset for store interior floor texture");
    // }
    // if (blood === null) {
    //   throw new Error("Failed to load asset for blood splatter");
    // }
    this.floor = floor;
    this.blood = blood;
  }
  draw(context: GameContext): void {
    const ctx = context.ctx;
    ctx.save();

    ctx.drawImage(
      this.floor,
      0, 0,
      1280, 720,
      0, 0,
      1280, 720,
    );

    let numBloodSpots = Math.floor(Math.random() * 4) + 1; // will be a number between 1 and 4
    
    for (let i = 0; i < numBloodSpots; i++) {
      let randXPos = Math.floor(Math.random() * 1280) + 1; // will be a number between 1 and 1280
      let randYPos = Math.floor(Math.random() * 720) + 1; // will be a number between 1 and 720
      
    }

  }
}