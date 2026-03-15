import { GameContext, IRenderer, IPosition, ISize } from "../../classinterfaces.ts";
import { Animator } from "../../animator.ts";
import { InputSystem } from "../../inputsys.ts";
import { InputAction } from "../../inputactionlist.ts";
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { PLAYER_DEATH_ANIMATION_TIME_MS, PlayerLifecycle } from "./playerLifecycle.ts";

/**
 * Animated sprite renderer that uses directional animations
 * based on the EmployeeFullSpriteSheet sprite sheet
 * @author Emma and Primo, Preston, Claude Sonnet 4.6 (for the death animation)
 */
export class AnimatedSpriteRenderer implements IRenderer {
  private spritesheet: HTMLImageElement;
  private positionComponent: IPosition;
  private sizeComponent: ISize;
  private boundingBox: BoundingBox | null;
  private inputSystem: InputSystem;
  private animations: Animator[];
  private currentDirection: number;
  private scale: number;
  private lifecycle: PlayerLifecycle;

  // Death animation
  private soulBloomTimer: number = 0;
  private soulBloomDuration: number = PLAYER_DEATH_ANIMATION_TIME_MS / 1000;
  private wasAboutToDie: boolean = false;

  /**
   * Creates an animated sprite renderer
   * @param spritesheet The sprite sheet image
   * @param positionComponent The position component to get x,y coordinates
   * @param sizeComponent The size component representing the width and height of the full entity,
   *    regardless of its bounding box. This is what is used to draw the sprite.
   * @param boundingBox Bounding box component representing the corners of the actual bounding box.
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
    playerLifecycle: PlayerLifecycle,
    boundingBox?: BoundingBox | null,
  ) {
    this.spritesheet = spritesheet;
    this.positionComponent = positionComponent;
    this.sizeComponent = sizeComponent;
    this.inputSystem = inputSystem;
    this.animations = [];
    this.currentDirection = 0; // default facing down
    this.scale = scale;
    this.lifecycle = playerLifecycle;

    if (boundingBox) {
      this.boundingBox = boundingBox;
    } else {
      this.boundingBox = null;
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
      4, 0.15,      // frame count, frame duration
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
      4, 0.15, 
      0, false, true, false
    ));
    
    // 2 WALK RIGHT
    this.animations.push(new Animator(
      this.spritesheet, 
      0, 221, 
      20, 19, 
      4, 0.15, 
      0, false, true, false
    ));
    
    // 3 WALK UP-RIGHT
    this.animations.push(new Animator(
      this.spritesheet, 
      0, 241, 
      20, 19, 
      4, 0.15, 
      0, false, true, false
    ));
    
    // 4 WALK UP
    this.animations.push(new Animator(
      this.spritesheet, 
      0, 261, 
      20, 19, 
      4, 0.15, 
      0, false, true, false
    ));
    
    // 5 WALK UP-LEFT
    this.animations.push(new Animator(
      this.spritesheet, 
      0, 281, 
      20, 19, 
      4, 0.15, 
      0, false, true, false
    ));
    
    // 6 WALK LEFT
    this.animations.push(new Animator(
      this.spritesheet, 
      0, 301, 
      20, 19, 
      4, 0.15, 
      0, false, true, false
    ));
    
    // 7 WALK DOWN-LEFT
    this.animations.push(new Animator(
      this.spritesheet, 
      0, 321, 
      20, 19, 
      4, 0.15, 
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

    // Detect death
    if (this.lifecycle.isAboutToDie() && !this.wasAboutToDie) {
      // reset timer upon beginning of death
      this.soulBloomTimer = 0;
    }
    this.wasAboutToDie = this.lifecycle.isAboutToDie();

    // Draw sprite (fading out)
    if (this.lifecycle.isAboutToDie()) {
      this.soulBloomTimer += context.clockTick;
      const fadeProgress = Math.min(this.soulBloomTimer / this.soulBloomDuration, 1);
      
      // Fade out the sprite
      context.ctx.save();
      context.ctx.globalAlpha = 1 - fadeProgress * 0.7; // Sprite becomes 30% visible
    }
    
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

    context.ctx.restore();
    if (this.lifecycle.isAboutToDie()) {
      // Draw effect
      this.drawSoulEffect(context.ctx);
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
      if (this.boundingBox) {
        context.ctx.strokeRect(
          this.boundingBox.getLeft(),
          this.boundingBox.getTop(),
          this.boundingBox.getRight() - this.boundingBox.getLeft(),
          this.boundingBox.getBottom() - this.boundingBox.getTop()
        )
      }
      context.ctx.restore();
    }
  }

  private drawSoulEffect(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    const progress = Math.min(this.soulBloomTimer / this.soulBloomDuration, 1);

    const position = {x: this.positionComponent.getPosition().x, y: this.positionComponent.getPosition().y};
    const width = this.sizeComponent.getWidth();
    const height = this.sizeComponent.getHeight();
    
    const centerX = position.x + width / 2;
    const centerY = position.y + height / 2;
    
    // Soul rises upward as it expands
    const riseDistance = 60; // pixels
    const soulY = centerY - (progress * riseDistance);
    
    // Use additive blending for ethereal glow
    const previousComposite = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = 'lighter';
    
    // Multi-layered bloom for depth
    this.drawBloomLayer(ctx, centerX, soulY, progress, 1.0);   // Outer glow
    this.drawBloomLayer(ctx, centerX, soulY, progress, 0.6);   // Mid glow
    this.drawBloomLayer(ctx, centerX, soulY, progress, 0.3);   // Inner bright core
    
    ctx.globalCompositeOperation = previousComposite;
    ctx.restore();
  }

  private drawBloomLayer(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    progress: number,
    sizeMultiplier: number
  ): void {
    const width = this.sizeComponent.getWidth();
    const height = this.sizeComponent.getHeight();

    const baseRadius = Math.max(width, height) / 2;
    
    // Exponential growth for dramatic expansion
    const growthCurve = Math.pow(progress, 0.7); // Slower start, faster end
    const bloomRadius = baseRadius * (1 + growthCurve * 4) * sizeMultiplier;
    
    // Fade out as it expands (soul dissipating)
    const fadeOutCurve = Math.pow(1 - progress, 1.5); // Slower fade at first
    const alpha = 0.8 * fadeOutCurve;
    
    const gradient = ctx.createRadialGradient(
      x, y, 0,
      x, y, bloomRadius
    );
    
    // White/pale blue for ethereal soul color
    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    gradient.addColorStop(0.2, `rgba(240, 248, 255, ${alpha * 0.8})`); // Alice blue tint
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.4})`);
    gradient.addColorStop(0.8, `rgba(240, 248, 255, ${alpha * 0.1})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(
      x - bloomRadius,
      y - bloomRadius,
      bloomRadius * 2,
      bloomRadius * 2
    );
  }

}
