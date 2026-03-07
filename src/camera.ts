import { IPosition } from "./classinterfaces.ts";
import { XY } from "./typeinterfaces.ts";

/**
 * Camera class tracks a specified position component
 * and updates the camera coordinates accordingly.
 * Other objects, in particular render objects,
 * can read the camera position to make rendering
 * decisions.
 * 
 * This version syncs each coordinate with
 * the coordinate of the tracked position,
 * locking the camera to center on the
 * registered entity.
 * 
 * To change this, please extend this class
 * and override the update method.
 * 
 * @author Preston Sia (presia27)
 */
export class Camera {
  private positionToTrack: IPosition | null;
  private cameraPosition: XY;
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.positionToTrack = null; // set later by registering a position class
    this.cameraPosition = {x: 0, y: 0};
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  public update() {
    if (this.positionToTrack) {
      this.cameraPosition.x = this.positionToTrack.getPosition().x - this.canvasWidth / 2;
      this.cameraPosition.y = this.positionToTrack.getPosition().y - this.canvasHeight / 2;
    }
  }

  public registerPosition(pos: IPosition) {
    this.positionToTrack = pos;
  }

  public getCameraPosition(): XY {
    return this.cameraPosition;
  }
}