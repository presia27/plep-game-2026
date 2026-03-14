import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { BasicSize } from "../../componentLibrary/BasicSize.ts";
import { MovementComponent } from "../../componentLibrary/movementComponent.ts";
import { Entity } from "../../entity.ts";
import SceneManager from "../../sceneManager.ts";
import { GameContext } from "../../classinterfaces.ts";
import { XY } from "../../typeinterfaces.ts";
import { AbstractCollisionHandler } from "../../componentLibrary/AbstractCollisionHandler.ts";
import { DoorTriggerCollisionHandler } from "./doorTriggerCollisionHandler.ts";
import { DoorDirection } from "./roomData.ts";
import { ASSET_MANAGER } from "../main.ts";


///revise///
const ARROW_SIDE_LENGTH: number = 9;
const ARROW_SPRITE_XSTART: number[] = [1, 12, 23, 34];
const ARROW_SPRITE_YSTART: number = 1;

/**
 * An invisible trigger zone placed at a doorway.
 * When the player's bounding box overlaps this trigger,
 * the SceneManager is told to load the target scene.
 *
 * Place these at doorways in each room via getDoorTriggers()
 * in your BaseRoomScene subclass.
 *
 * @author Luke Willis, Claude Sonnet 4.5
 */
export class DoorTrigger extends Entity {
  private boundingBox: BoundingBox;
  private targetSceneId: string;
  private sceneManager: SceneManager;
  private playerBoundingBox: BoundingBox;
  private collisionHandler: AbstractCollisionHandler;
  private direction: DoorDirection;
  private arrowSprite: HTMLImageElement;

  constructor(
    position: XY,
    size: XY,
    targetSceneId: string,
    direction: DoorDirection,
    sceneManager: SceneManager,
    playerBoundingBox: BoundingBox
  ) {
    super();
    this.targetSceneId = targetSceneId;
    this.sceneManager = sceneManager;
    this.playerBoundingBox = playerBoundingBox;
    this.direction = direction;

    // invisible trigger zone — no renderer needed
    const movement = new MovementComponent(position);
    const boundSize = new BasicSize(size.x, size.y, 1);
    this.boundingBox = new BoundingBox(movement, boundSize, 0, 0);
    this.collisionHandler = new DoorTriggerCollisionHandler(sceneManager, targetSceneId);

    super.addComponent(movement);
    super.addComponent(this.boundingBox);
    super.addComponent(this.collisionHandler);

    const arrowSprite = ASSET_MANAGER.getImageAsset("arrow");
    if (arrowSprite === null) {
      throw new Error("Failed to load asset for arrows");
    }
    this.arrowSprite = arrowSprite;
  }

  override update(context: GameContext): void {
  }

  override draw(context: GameContext): void {
    super.draw(context);

    const ctx = context.ctx;
    ctx.save();

    const spriteXStart = ARROW_SPRITE_XSTART[this.direction] ?? 1;
    const drawSideLength = ARROW_SIDE_LENGTH * 2;

    if (this.direction === DoorDirection.DOWN || this.direction === DoorDirection.UP) {
      // Draw a series of horizontal arrows
      const xdraws = [
        this.boundingBox.getLeft(),
        (this.boundingBox.getLeft() + this.boundingBox.getRight()) / 2 - (drawSideLength / 2),
        this.boundingBox.getRight() - drawSideLength
      ];

      for (let i = 0; i < xdraws.length; i++) {
        ctx.drawImage(
          this.arrowSprite,
          spriteXStart,
          ARROW_SPRITE_YSTART,
          ARROW_SIDE_LENGTH,
          ARROW_SIDE_LENGTH,
          xdraws[i] ?? this.boundingBox.getLeft(),
          this.boundingBox.getTop(),
          drawSideLength,
          drawSideLength
        );
      }
    } else {
      // Draw a series of vertical arrows
      const ydraws = [
        this.boundingBox.getTop(),
        (this.boundingBox.getTop() + this.boundingBox.getBottom()) / 2 - (drawSideLength / 2),
        this.boundingBox.getBottom() - drawSideLength
      ];

      for (let i = 0; i < ydraws.length; i++) {
        ctx.drawImage(
          this.arrowSprite,
          spriteXStart,
          ARROW_SPRITE_YSTART,
          ARROW_SIDE_LENGTH,
          ARROW_SIDE_LENGTH,
          this.boundingBox.getLeft(),
          ydraws[i] ?? this.boundingBox.getTop(),
          drawSideLength,
          drawSideLength
        );
      }
    }

    ctx.font = "22px Jersey-20";
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;

    // Draw text
    if (this.direction === DoorDirection.UP) {
      ctx.textAlign = "center";
      ctx.fillText(
        this.targetSceneId,
        (this.boundingBox.getLeft() + this.boundingBox.getRight()) / 2,
        this.boundingBox.getBottom() + 12
      );
      ctx.strokeText(
        this.targetSceneId,
        (this.boundingBox.getLeft() + this.boundingBox.getRight()) / 2,
        this.boundingBox.getBottom() + 12
      );
    } else if (this.direction === DoorDirection.DOWN) {
      ctx.textAlign = "center";
      ctx.fillText(
        this.targetSceneId,
        (this.boundingBox.getLeft() + this.boundingBox.getRight()) / 2,
        this.boundingBox.getTop()
      );
      ctx.strokeText(
        this.targetSceneId,
        (this.boundingBox.getLeft() + this.boundingBox.getRight()) / 2,
        this.boundingBox.getTop()
      );
    } else if (this.direction === DoorDirection.LEFT) {
      ctx.textAlign = "left";
      ctx.fillText(
        this.targetSceneId,
        this.boundingBox.getRight(),
        (this.boundingBox.getTop() + this.boundingBox.getBottom()) / 2 + 6
      );
      ctx.strokeText(
        this.targetSceneId,
        this.boundingBox.getRight(),
        (this.boundingBox.getTop() + this.boundingBox.getBottom()) / 2 + 6
      );
    } else {
      ctx.textAlign = "right";
      ctx.fillText(
        this.targetSceneId,
        this.boundingBox.getLeft(),
        (this.boundingBox.getTop() + this.boundingBox.getBottom()) / 2 + 6
      );
      ctx.strokeText(
        this.targetSceneId,
        this.boundingBox.getLeft(),
        (this.boundingBox.getTop() + this.boundingBox.getBottom()) / 2 + 6
      );
    }
    

    if (context.debug) {
      // Draw door trigger zone in green with transparency
      ctx.strokeStyle = "#00FF00";
      ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
      ctx.lineWidth = 2;
      
      ctx.fillRect(
        this.boundingBox.getLeft(),
        this.boundingBox.getTop(),
        this.boundingBox.getRight() - this.boundingBox.getLeft(),
        this.boundingBox.getBottom() - this.boundingBox.getTop()
      );
      
      ctx.strokeRect(
        this.boundingBox.getLeft(),
        this.boundingBox.getTop(),
        this.boundingBox.getRight() - this.boundingBox.getLeft(),
        this.boundingBox.getBottom() - this.boundingBox.getTop()
      );
      
      // Draw label showing target scene
      ctx.fillStyle = "#00FF00";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        `→ ${this.targetSceneId}`,
        this.boundingBox.getLeft() + (this.boundingBox.getRight() - this.boundingBox.getLeft()) / 2,
        this.boundingBox.getTop() + (this.boundingBox.getBottom() - this.boundingBox.getTop()) / 2
      );
    }

    ctx.restore();
  }
}