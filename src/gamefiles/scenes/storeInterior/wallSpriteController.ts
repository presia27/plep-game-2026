import { BasicSize } from "../../../componentLibrary/BasicSize.ts";
import { Entity } from "../../../entity.ts";
import { XY } from "../../../typeinterfaces.ts";
import { ASSET_MANAGER } from "../../main.ts";
import { CornerSpriteType, WallSpriteDirection } from "../roomData.ts";
import { WallSpriteRenderer } from "./wallSpriteRenderer.ts";

const CORNER_SIZE: BasicSize = new BasicSize(5, 5, 4);

/**
 * Controller + renderer for walls in a room. This has no correlation to
 * WallEntity - this is purely for aesthetics
 * @author Emma Szebenyi
 */
export class WallSpriteController extends Entity {
  private wallSXY: XY;              // wall spritesheet x + y
  private wallSSize: BasicSize;     // wall sprite size
  private wallPos: XY;              // position to place wall
  private wallSize: BasicSize;      // wall destination size
  private cornerSXY?: XY;           // corner spritesheet x + y
  private cornerPos?: XY;           // position to place corner

  constructor(
    direction: WallSpriteDirection, // wall type
    wallPos: XY,                    // position to place wall
    wallSize: BasicSize,            // wall size
    cornerType?: CornerSpriteType,  // corner type
    cornerPos?: XY,                 // position to place corner
  ) {
    super();

    /* Load wall data */
    if (direction === WallSpriteDirection.LEFT) {
      this.wallSXY = { x: 1, y: 1 };
      this.wallSSize = new BasicSize(5, 720, 1);

    } else if (direction === WallSpriteDirection.RIGHT) {
      this.wallSXY = { x: 8, y: 1 };
      this.wallSSize = new BasicSize(5, 720, 1);

    } else if (direction === WallSpriteDirection.TOP1) {
      this.wallSXY = { x: 1297, y: 1 };
      this.wallSSize = new BasicSize(1280, 20, 1);

    } else if (direction === WallSpriteDirection.TOP2) {
      this.wallSXY = { x: 1611, y: 1 };
      this.wallSSize = new BasicSize(1280, 20, 1);

    } else if (direction === WallSpriteDirection.TOP3) {
      this.wallSXY = { x: 1931, y: 1 };
      this.wallSSize = new BasicSize(1280, 20, 1);

    } else { // BOTTOM wall
      this.wallSXY = { x: 15, y: 1 };
      this.wallSSize = new BasicSize(1280, 5, 1);
    }

    this.wallPos = wallPos;
    this.wallSize = wallSize;

    const wallSprite = ASSET_MANAGER.getImageAsset("walls");
    if (wallSprite === null)
      throw new Error("Failed to load asset for walls");

    /* Load corner data (if provided) */
    if (cornerType === CornerSpriteType.TR) {
      this.cornerSXY = { x: 8, y: 1 };
    } else if (cornerType === CornerSpriteType.BR || cornerType === CornerSpriteType.TL) {
      this.cornerSXY = { x: 1, y: 1 };
    }

    if (cornerPos) {
      this.cornerPos = cornerPos;
    }

    const cornerSprite = ASSET_MANAGER.getImageAsset("corners");
    if (cornerSprite === null)
      throw new Error("Failed to load asset for walls");

    const renderer = new WallSpriteRenderer(
      wallSprite,
      this.wallSXY,
      this.wallSSize,
      this.wallPos,
      this.wallSize,
      cornerSprite,
      this.cornerSXY,
      this.cornerPos
    );
    super.setRenderer(renderer)
  }
}