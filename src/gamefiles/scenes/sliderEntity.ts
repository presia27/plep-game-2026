import { GameContext, IRenderer } from "../../classinterfaces.ts";
import { Entity } from "../../entity.ts";
import { InputSystem } from "../../inputsys.ts";
import { ASSET_MANAGER } from "../main.ts";

export class SliderEntity extends Entity {
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private inputsys: InputSystem;
  private onChange: (value: number) => void;
  private value: number; // 0 to 1
  private isDragging: boolean = false;
  private label: string;
  private playedDragSound: boolean = false;

  constructor(
    label: string,
    x: number,
    y: number,
    width: number,
    height: number,
    initialValue: number,
    inputsys: InputSystem,
    onChange: (value: number) => void
  ) {
    super();

    this.label = label;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.value = Math.max(0, Math.min(1, initialValue));
    this.inputsys = inputsys;
    this.onChange = onChange;
  }

  public override update(context: GameContext): void {
    const clickState = this.inputsys.getLeftClick();
    
    if (clickState) {
      const handleX = this.x + (this.value * this.width);
      const handleWidth = 20;
      const handleHeight = this.height + 10;
      const handleY = this.y - 5;
      
      // Check if clicking on the handle
      const isOnHandle = this.containsCursor(
        clickState.x,
        clickState.y,
        handleX - handleWidth / 2,
        handleY,
        handleWidth,
        handleHeight
      );

      // Check if clicking on the track
      const isOnTrack = this.containsCursor(
        clickState.x,
        clickState.y,
        this.x,
        this.y,
        this.width,
        this.height
      );

      if (isOnHandle || (isOnTrack && !this.isDragging)) {
        this.isDragging = true;
        if (!this.playedDragSound) {
          ASSET_MANAGER.playMusic("uiSound");
          this.playedDragSound = true;
        }
      }
    } else {
      this.isDragging = false;
      this.playedDragSound = false;
    }

    // Update slider value while dragging
    if (this.isDragging && clickState) {
      const relativeX = clickState.x - this.x;
      const newValue = Math.max(0, Math.min(1, relativeX / this.width));
      
      if (newValue !== this.value) {
        this.value = newValue;
        this.onChange(this.value);
      }
    }
  }

  public override draw(gameContext: GameContext): void {
    const ctx = gameContext.ctx;

    ctx.save();

    // Draw label
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(this.label, this.x + this.width / 2, this.y - 15);

    // Draw track background
    ctx.fillStyle = "#424242";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Draw filled portion
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(this.x, this.y, this.width * this.value, this.height);

    // Draw track border
    ctx.strokeStyle = "#757575";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // Draw handle
    const handleX = this.x + (this.value * this.width);
    const handleWidth = 20;
    const handleHeight = this.height + 10;
    const handleY = this.y - 5;

    ctx.fillStyle = this.isDragging ? "#66BB6A" : "#FFFFFF";
    ctx.fillRect(handleX - handleWidth / 2, handleY, handleWidth, handleHeight);
    
    ctx.strokeStyle = "#424242";
    ctx.lineWidth = 2;
    ctx.strokeRect(handleX - handleWidth / 2, handleY, handleWidth, handleHeight);

    // Draw percentage value
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "white";
    const percentage = Math.round(this.value * 100) + "%";
    ctx.fillText(percentage, this.x + this.width / 2, this.y + this.height + 25);

    ctx.restore();
  }

  private containsCursor(pointerX: number, pointerY: number, x: number, y: number, w: number, h: number): boolean {
    return pointerX >= x && pointerX <= x + w && pointerY >= y && pointerY <= y + h;
  }
}
