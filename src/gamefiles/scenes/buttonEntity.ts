import { GameContext, IRenderer } from "../../classinterfaces.ts";
import { Entity } from "../../entity.ts";
import { InputSystem } from "../../inputsys.ts";
import { ASSET_MANAGER } from "../main.ts";

export class ButtonEntity extends Entity {
  private text: string;
  private color: string;
  private textColor: string;
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private inputsys: InputSystem;
  private onClick: () => void;
  private isHovering: boolean = false;
  private textAlign: "left" | "center";

  constructor(
    text: string,
    color: string,
    textColor: string,
    x: number,
    y: number,
    width: number,
    height: number,
    inputsys: InputSystem,
    onClick: () => void,
    textAlign: "left" | "center" = "center"
  ) {
    super();

    this.text = text;
    this.color = color;
    this.textColor = textColor;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.inputsys = inputsys;
    this.onClick = onClick;
    this.textAlign = textAlign;

  }

  public override update(context: GameContext): void {
    // Check for hover state
    const cursorPos = this.inputsys.getCursorPosition();
    if (cursorPos) {
      const isInBounds = this.containsCursor(
        cursorPos.x,
        cursorPos.y,
        this.x,
        this.y,
        this.width,
        this.height
      );

      // Play hover sound when entering button area
      if (isInBounds && !this.isHovering) {
        ASSET_MANAGER.playMusic("uiSound");
        this.isHovering = true;
      } else if (!isInBounds && this.isHovering) {
        this.isHovering = false;
      }
    }

    // Check for click
    const clickState = this.inputsys.getLeftClick();
    if (clickState) {
      // Determine if it's in the button area
      const isInBounds = this.containsCursor(
        clickState.x,
        clickState.y,
        this.x,
        this.y,
        this.width,
        this.height
      );

      if (isInBounds) {
        ASSET_MANAGER.playMusic("uiSound");
        this.onClick();
      }
    }
  }

  public override draw(gameContext: GameContext): void {
    const ctx = gameContext.ctx;

    ctx.save();

    // Draw background only if not transparent
    if (this.color !== "transparent") {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeStyle = "grey";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    // Set font to Jersey-20
    ctx.font = "bold 48px 'Jersey-20', Arial";
    ctx.textAlign = this.textAlign;
    ctx.textBaseline = "middle";
    
    // Draw text based on alignment
    const textX = this.textAlign === "left" ? this.x : this.x + (this.width / 2);
    ctx.fillStyle = this.textColor;
    ctx.fillText(
      this.text,
      textX,
      this.y + (this.height / 2)
    );

    // Draw hover border for transparent buttons
    if (this.isHovering && this.color === "transparent") {
      const textMetrics = ctx.measureText(this.text);
      const textWidth = textMetrics.width;
      const textHeight = 48; // Approximate height based on font size
      const padding = 20;
      const borderRadius = 10;
      
      let borderX, borderY, borderWidth, borderHeight;
      
      if (this.textAlign === "left") {
        borderX = this.x - padding;
        borderY = this.y + (this.height / 2) - (textHeight / 2) - padding;
      } else {
        borderX = this.x + (this.width / 2) - (textWidth / 2) - padding;
        borderY = this.y + (this.height / 2) - (textHeight / 2) - padding;
      }
      
      borderWidth = textWidth + (padding * 2);
      borderHeight = textHeight + (padding * 2);

      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(borderX, borderY, borderWidth, borderHeight, borderRadius);
      ctx.stroke();
    }

    ctx.restore();
  }

  private containsCursor(pointerX: number, pointerY: number, x: number, y: number, w: number, h: number): boolean {
    return pointerX >= x && pointerX <= x + w && pointerY >= y && pointerY <= y + h;
  }
}
