import { GameContext, IRenderer } from "../../classinterfaces.ts";
import { Entity } from "../../entity.ts";
import { InputSystem } from "../../inputsys.ts";

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

  constructor(
    text: string,
    color: string,
    textColor: string,
    x: number,
    y: number,
    width: number,
    height: number,
    inputsys: InputSystem,
    onClick: () => void
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

  }

  public override update(context: GameContext): void {
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
        this.onClick();
      }
    }
  }

  public override draw(gameContext: GameContext): void {
    const ctx = gameContext.ctx;

    ctx.save();

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = "grey";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = this.textColor;
    ctx.fillText(
      this.text,
      this.x + (this.width / 2),
      this.y + (this.height / 2)
    )

    ctx.restore();
  }

  private containsCursor(pointerX: number, pointerY: number, x: number, y: number, w: number, h: number): boolean {
    return pointerX >= x && pointerX <= x + w && pointerY >= y && pointerY <= y + h;
  }
}
