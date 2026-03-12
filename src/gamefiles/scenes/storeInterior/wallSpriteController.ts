import { IPosition, ISize } from "../../../classinterfaces";
import { BasicSize } from "../../../componentLibrary/BasicSize";
import { staticPositionComponent } from "../../../componentLibrary/staticPositionComponent";
import { StaticSpriteRenderer } from "../../../componentLibrary/staticSpriteRenderer";
import { Entity } from "../../../entity";
import { XY } from "../../../typeinterfaces";
import { ASSET_MANAGER } from "../../main";
import { CornerSpriteType, WallSpriteDirection } from "../roomData";
import { WallSpriteRenderer } from "./wallSpriteRenderer";

const CORNER_SIZE: BasicSize = new BasicSize(5, 5, 4);

/**
 * Controller + renderer for walls in a room. This has no correlation to
 * WallEntity - this is purely for aesthetics
 * @author Emma Szebenyi
 */
export class WallSpriteController extends Entity {
  private wallSXY: XY; // wall spritesheet x + y
  private wallPos: XY; // position to place wall
  private wallSize: BasicSize; // wall size
  private cornerSXY?: XY; // corner spritesheet x + y
  private cornerPos?: XY; // position to place corner

  constructor(
    direction: WallSpriteDirection, // wall type
    wallPos: XY, // position to place wall
    wallSize: BasicSize, // wall size
    cornerType?: CornerSpriteType, // corner type
    cornerPos?: XY, // position to place corner
  ) {
    super();

    /* Load wall data */
    if (direction === WallSpriteDirection.LEFT) {
      this.wallSXY = { x: 1, y: 1 };
    } else if (direction === WallSpriteDirection.RIGHT) {
      this.wallSXY = { x: 8, y: 1 };
    } else if (direction === WallSpriteDirection.TOP) {
      this.wallSXY = { x: 15, y: 1 };
    } else { // BOTTOM wall
      this.wallSXY = { x: 1297, y: 1 };
    }

    this.wallPos = wallPos;
    this.wallSize = wallSize;

    const wallSprite = ASSET_MANAGER.getImageAsset("walls");
    if (wallSprite === null)
      throw new Error("Failed to load asset for walls");

    /* Load corner data (if provided) */
    if (cornerType) {
      if (cornerType === CornerSpriteType.TR) {
        this.cornerSXY = { x: 8, y: 1 };
      } else {
        this.cornerSXY = { x: 1, y: 1 };
      }
    }
    if (cornerPos) {
      this.cornerPos = cornerPos;
    }

    const cornerSprite = ASSET_MANAGER.getImageAsset("corners");
    if (cornerSprite === null)
      throw new Error("Failed to load asset for walls");

    //const render = new StaticSpriteRenderer(wallSprite, sx, 1, sw, sh, pos, size, this.wallBoundingBox);
    //super.setRenderer(render);

    // pick which blood sprite to use based on random number generator
    
    const renderer = new WallSpriteRenderer(
      wallSprite,
      this.wallSXY,
      this.wallPos,
      this.wallSize,
      cornerSprite,
      this.cornerSXY,
      this.cornerPos
    );
    super.setRenderer(renderer)
  }
}