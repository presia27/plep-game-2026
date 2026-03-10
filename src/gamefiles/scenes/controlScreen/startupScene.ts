import { GameContext, IEntity, IScene } from "../../../classinterfaces.ts";
import { GameStateEventTrigger } from "../../../gameStateEventTrigger.ts";
import { InputSystem } from "../../../inputsys.ts";
import SceneManager from "../../../sceneManager";
import { ASSET_MANAGER } from "../../main.ts";
import { ButtonEntity } from "../buttonEntity.ts";
import { SplashScreenRender } from "./splashScreenRender.ts";

export const SPLASHSCREEN_SCENEID = "splash";
export const VOLUMESCREEN_SCENEID = "volume";

export class SplashScreenScene implements IScene {
  private sceneTrigger: GameStateEventTrigger;
  private inputSystem: InputSystem;
  private canvasWidth: number;
  private canvasHeight: number;

  localEntities: IEntity[];

  constructor(
    sceneTrigger: GameStateEventTrigger,
    inputSystem: InputSystem,
    canvasWidth: number,
    canvasHeight: number
  ) {
    this.sceneTrigger = sceneTrigger;
    this.inputSystem = inputSystem;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.localEntities = [];
  }

  onEnter(sceneManager: SceneManager): void {
    /* Control handlers */
    const handleStartClick = () => {
      // Load volume settings scene
      sceneManager.loadScene(VOLUMESCREEN_SCENEID);
    };

    /* Add continue button */
    const startBtn = new ButtonEntity(
      "Press Here to Start",
      "transparent",
      "white",
      (this.canvasWidth / 2) - 150,
      (this.canvasHeight / 2) + 120,
      300,
      60,
      this.inputSystem,
      handleStartClick
    );
    sceneManager.addTransientUIEntity(startBtn);
    this.localEntities.push(startBtn);

    /* Add Background with title image */
    const screenRenderer = new SplashScreenRender(this.canvasWidth, this.canvasHeight);
    sceneManager.addTransientUIEntity(screenRenderer);
    this.localEntities.push(screenRenderer);
  }

  onResume(sceneManager: SceneManager): void {
    // Re-add entities
    for (const entity of this.localEntities) {
      sceneManager.addTransientUIEntity(entity);
    }
  }

  onExit(): void {}

  update(context: GameContext): void {}
  
  draw(context: GameContext): void {}
}
