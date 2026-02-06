import { GameContext, IRenderer, IPosition, ISize } from "../../classinterfaces.ts";
import { Animator } from "../../animator.ts";
import { InputSystem } from "../../inputsys.ts";
import { InputAction } from "../../inputactionlist.ts";

/**
 * Animated sprite renderer that uses directional animations
 * based on the EmployeeFullSpriteSheet sprite sheet
 * @author Emma and Primo, Preston
 */
export class AnimatedSpriteRenderer implements IRenderer {
  private spritesheet: HTMLImageElement;
  private positionComponent: IPosition;
  private sizeComponent: ISize;
  private boundingBoxExtent: ISize | null;
  private inputSystem: InputSystem;
  private animations: Animator[];
  private currentDirection: number;
  private scale: number;

  /**
   * Creates an animated sprite renderer
   * @param spritesheet The sprite sheet image
   * @param positionComponent The position component to get x,y coordinates
   * @param sizeComponent The size component representing the width and height of the full entity,
   *    regardless of its bounding box. This is what is used to draw the sprite.
   * @param boundingBoxExtent Size component representing the width and height of the actual bounding box.
   *    This is used for debugging, hence it is optional
   * @param inputSystem The input system to detect movement direction
   * @param scale Scale factor for drawing
   */
  constructor(
    spritesheet: HTMLImageElement, 
    positionComponent: IPosition, 
    sizeComponent: ISize,
    inputSystem: InputSystem,
    scale: number = 4.0,
    boundingBoxExtent?: ISize | null
  ) {
    this.spritesheet = spritesheet;
    this.positionComponent = positionComponent;
    this.sizeComponent = sizeComponent;
    this.inputSystem = inputSystem;
    this.animations = [];
    this.currentDirection = 0; // default facing down
    this.scale = scale;

    if (boundingBoxExtent) {
      this.boundingBoxExtent = boundingBoxExtent;
    } else {
      this.boundingBoxExtent = null;
    }
    
    this.loadAnimations();
  }

  /**
   * Load all 8 directional animations from the sprite sheet
   */
  private loadAnimations(): void {
    // 0 WALK DOWN
    this.animations.push(new Animator(
      this.spritesheet, 
      0, 181,      // x, y start
      20, 19,      // width, height
      4, 0.2,      // frame count, frame duration
      0,           // frame padding
      false,       // reverse
      true,        // loop
      false        // flipflop
    ));
    
    // 1 WALK DOWN-RIGHT
    this.animations.push(new Animator(
      this.spritesheet, 
      0, 201, 
      20, 19, 
      4, 0.2, 
      0, false, true, false
    ));
    
    // 2 WALK RIGHT
    this.animations.push(new Animator(
      this.spritesheet, 
      0, 221, 
      20, 19, 
      4, 0.2, 
      0, false, true, false
    ));
    
    // 3 WALK UP-RIGHT
    this.animations.push(new Animator(
      this.spritesheet, 
      0, 241, 
      20, 19, 
      4, 0.2, 
      0, false, true, false
    ));
    
    // 4 WALK UP
    this.animations.push(new Animator(
      this.spritesheet, 
      0, 261, 
      20, 19, 
      4, 0.2, 
      0, false, true, false
    ));
    
    // 5 WALK UP-LEFT
    this.animations.push(new Animator(
      this.spritesheet, 
      0, 281, 
      20, 19, 
      4, 0.2, 
      0, false, true, false
    ));
    
    // 6 WALK LEFT
    this.animations.push(new Animator(
      this.spritesheet, 
      0, 301, 
      20, 19, 
      4, 0.2, 
      0, false, true, false
    ));
    
    // 7 WALK DOWN-LEFT
    this.animations.push(new Animator(
      this.spritesheet, 
      0, 321, 
      20, 19, 
      4, 0.2, 
      0, false, true, false
    ));
  }

  /**
   * Update the current direction based on input and return if moving
   */
  private updateDirection(): boolean {
    const up = this.inputSystem.isActionActive(InputAction.MOVE_UP);
    const down = this.inputSystem.isActionActive(InputAction.MOVE_DOWN);
    const left = this.inputSystem.isActionActive(InputAction.MOVE_LEFT);
    const right = this.inputSystem.isActionActive(InputAction.MOVE_RIGHT);

    const isMoving = up || down || left || right;

    // Only update direction if moving
    if (isMoving) {
      // Check diagonal directions first (priority order matters)
      if (down && right) {
        this.currentDirection = 1; // DOWN-RIGHT
      } else if (up && right) {
        this.currentDirection = 3; // UP-RIGHT
      } else if (up && left) {
        this.currentDirection = 5; // UP-LEFT
      } else if (down && left) {
        this.currentDirection = 7; // DOWN-LEFT
      } else if (down) {
        this.currentDirection = 0; // DOWN
      } else if (right) {
        this.currentDirection = 2; // RIGHT
      } else if (up) {
        this.currentDirection = 4; // UP
      } else if (left) {
        this.currentDirection = 6; // LEFT
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
        animation.drawFrame(context.clockTick, context.ctx, pos.x, pos.y, this.scale);
      } else {
        // Draw static idle frame when not moving (first frame of current direction)
        context.ctx.drawImage(
          this.spritesheet,
          0, 181 + (this.currentDirection * 20), // x, y on spritesheet
          20, 19, // source width, height
          pos.x, pos.y, // destination x, y
          20 * this.scale, 19 * this.scale // destination width, height
        );
      }
    }

    if (context.debug) {
      context.ctx.save();

      // draw the full extent of the entity
      context.ctx.strokeStyle = "#0000cd";
      context.ctx.strokeRect(
        this.positionComponent.getPosition().x,
        this.positionComponent.getPosition().y,
        this.sizeComponent.getWidth(),
        this.sizeComponent.getHeight(),
      );

      // draw bounding box
      context.ctx.strokeStyle = "#ff0000";
      if (this.boundingBoxExtent) {
        context.ctx.strokeRect(
          this.positionComponent.getPosition().x,
          this.positionComponent.getPosition().y,
          this.boundingBoxExtent.getWidth(),
          this.boundingBoxExtent.getHeight(),
        );
      }
      context.ctx.restore();
    }
  }
}
