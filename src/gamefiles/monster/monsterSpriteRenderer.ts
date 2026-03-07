import { GameContext, IRenderer, IPosition, ISize } from "../../classinterfaces.ts";
import { Animator } from "../../animator.ts";
import { InputSystem } from "../../inputsys.ts";
import { InputAction } from "../../inputactionlist.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { MonsterMovementSystem } from "./monsterMovementSystem.ts";

const X_START: number = 0;
const Y_START: number = 0;
const Y_OFFSET: number = 20;
const FRAME_COUNT: number = 4;
const FRAME_DUR: number = 0.2; // was set to 0.2 for player
const WIDTH: number = 20
const HEIGHT: number = 19;
const MONSTER_SCALE: number = 5;


/**
 * Animated sprite renderer that uses directional animations
 * based on the Monster sprite sheet - based on animatedSpriteRenderer.ts for player
 *
 * NOTE: This class is probably redundant to have, but we are simply trying to get as much done as we can, so I am
 * not really worried about that right now. We can clean it up + combine the monster/player class later if there is
 * time.
 * @author Emma Szebenyi
 */
export class MonsterSpriteRenderer implements IRenderer {
  private spritesheet: HTMLImageElement;
  private positionComponent: IPosition;
  private sizeComponent: ISize;
  private movementSys: MonsterMovementSystem;
  private boundingBox: BoundingBox | null;
  private animations: Animator[];
  private currentDirection: number;

  /**
   * Creates a monster sprite renderer
   * @param spritesheet The sprite sheet image
   * @param positionComponent The position component to get x,y coordinates
   * @param sizeComponent The size component representing the width and height of the full entity,
   *                      regardless of its bounding box. This is what is used to draw the sprite.
   * @param boundingBox Bounding box component representing the corners of the actual bounding box.
   *    This is used for debugging, hence it is optional
   * @param movementSys The movement system to update movement direction
   */
  constructor(
    spritesheet: HTMLImageElement, 
    positionComponent: IPosition, 
    sizeComponent: ISize,
    movementSys: MonsterMovementSystem,
    boundingBox?: BoundingBox | null
  ) {
    this.spritesheet = spritesheet;
    this.positionComponent = positionComponent;
    this.sizeComponent = sizeComponent;
    this.movementSys = movementSys;
    this.animations = [];
    this.currentDirection = 0; // default facing down

    if (boundingBox) {
      this.boundingBox = boundingBox;
    } else {
      this.boundingBox = null;
    }
    
    this.loadAnimations();
  }

  /**
   * Load all 4 directional animations from the sprite sheet
   */
  private loadAnimations(): void {
    // 0 WALK DOWN
    this.animations.push(new Animator(
      this.spritesheet, 
      X_START, Y_START,           // x, y start
      WIDTH, HEIGHT, // width, height
      FRAME_COUNT, FRAME_DUR,     // frame count, frame duration
      0,           // frame padding
      false,       // reverse
      true,        // loop
      false        // flipflop
    ));
    
    // 1 WALK RIGHT
    this.animations.push(new Animator(
      this.spritesheet, 
      X_START, Y_START + Y_OFFSET,          
      WIDTH, HEIGHT,
      FRAME_COUNT, FRAME_DUR,    
      0, false, true, false       
    ));
    
    // 2 WALK UP
    this.animations.push(new Animator(
      this.spritesheet, 
      X_START, Y_START + Y_OFFSET * 2,          
      WIDTH, HEIGHT, 
      FRAME_COUNT, FRAME_DUR,    
      0, false, true, false       
    ));
    
    // 3 WALK LEFT
    this.animations.push(new Animator(
      this.spritesheet, 
      X_START, Y_START + Y_OFFSET * 3,          
      WIDTH, HEIGHT, 
      FRAME_COUNT, FRAME_DUR,    
      0, false, true, false       
    ));
  } 
  /**
   * Update the current direction based on input and return if moving
   */
  private updateDirection(): boolean {
    const up = this.movementSys.isMovingUp();
    const down = this.movementSys.isMovingDown();
    const left = this.movementSys.isMovingLeft();
    const right = this.movementSys.isMovingRight();

    const isMoving = up || down || left || right;

    // Only update direction if moving
    if (isMoving) {
      if (down) {
        this.currentDirection = 0; // DOWN
      } else if (left) {
        this.currentDirection = 3; // LEFT
      } else if (right) {
        this.currentDirection = 1; // RIGHT
      } else if (up) {
        this.currentDirection = 2; // UP
      }
    }
    
    return isMoving;
  }

  public draw(context: GameContext): void {
    const isMoving = this.updateDirection();
    
    const pos = this.positionComponent.getPosition();
    const animation = this.animations[this.currentDirection];
    
    if (animation) {
      if (isMoving) {
        // Animate when moving
        animation.drawFrame(context.clockTick, context.ctx, pos.x - context.cameraPosition.x, pos.y - context.cameraPosition.y, MONSTER_SCALE);
      } else {
        // Draw static idle frame when not moving (first frame of current direction)
        context.ctx.drawImage(
          this.spritesheet,
          X_START, Y_START + (this.currentDirection * Y_OFFSET), // x, y on spritesheet
          WIDTH, HEIGHT, // source width, height
          pos.x - context.cameraPosition.x, pos.y - context.cameraPosition.y, // destination x, y
          WIDTH * MONSTER_SCALE, HEIGHT * MONSTER_SCALE // destination width, height
        );
      }
    }

    if (context.debug) {
      context.ctx.save();

      // draw the full extent of the entity
      context.ctx.strokeStyle = "#0000cd";
      context.ctx.strokeRect(
        this.positionComponent.getPosition().x - context.cameraPosition.x,
        this.positionComponent.getPosition().y - context.cameraPosition.y,
        this.sizeComponent.getWidth(),
        this.sizeComponent.getHeight(),
      );

      // draw bounding box
      context.ctx.strokeStyle = "#ff0000";
      if (this.boundingBox) {
        context.ctx.strokeRect(
          this.boundingBox.getLeft() - context.cameraPosition.x,
          this.boundingBox.getTop() - context.cameraPosition.y,
          this.boundingBox.getRight() - this.boundingBox.getLeft(),
          this.boundingBox.getBottom() - this.boundingBox.getTop()
        )
      }
      context.ctx.restore();
    }
  }
}
