import { GameContext, IEntity, IScene } from "../../../classinterfaces.ts";
import { GameStateEventTrigger, TOGGLE_PAUSE } from "../../../gameStateEventTrigger.ts";
import { InputSystem } from "../../../inputsys.ts";
import SceneManager from "../../../sceneManager";
import { ASSET_MANAGER } from "../../main.ts";
import { ButtonEntity } from "../buttonEntity.ts";
import { SliderEntity } from "../sliderEntity.ts";
import { StartScreenRender } from "./startScreenRender.ts";
import { STARTSCREEN_SCENEID } from "./startScreenScene.ts";

export const SETTINGSSCREEN_SCENEID = "settings"

export class SettingsScreenScene implements IScene {
  private sceneTrigger: GameStateEventTrigger;
  private inputSystem: InputSystem;
  private canvasWidth: number;
  private canvasHeight: number;
  private isInGame: boolean;

  localEntities: IEntity[];

  constructor(
    sceneTrigger: GameStateEventTrigger,
    inputSystem: InputSystem,
    canvasWidth: number,
    canvasHeight: number,
    isInGame: boolean
  ) {
    this.sceneTrigger = sceneTrigger;
    this.inputSystem = inputSystem;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.isInGame = isInGame;
    this.localEntities = [];
  }

  onEnter(sceneManager: SceneManager): void {
    /* Control handler functions */
    const handleVolumeChange = (value: number) => {
      ASSET_MANAGER.setVolume(value);
    };
    
    const handleBackClick = () => {
      if (this.isInGame) {
        this.sceneTrigger.assertChange(null, TOGGLE_PAUSE);
      }
      else {
        sceneManager.loadScene(STARTSCREEN_SCENEID);
      }
    };

    /* Add controls */
    // Add volume slider
    const slider = new SliderEntity(
      "Volume",
      (this.canvasWidth / 2) - 150,
      (this.canvasHeight / 2) - 20,
      300,
      15,
      ASSET_MANAGER.getVolume(),
      this.inputSystem,
      handleVolumeChange
    );
    sceneManager.addEntity(slider);
    this.localEntities.push(slider)

    const button = new ButtonEntity(
      "BACK",
      "#9E9E9E", // grey
      "white",
      (this.canvasWidth / 2) - 100,
      (this.canvasHeight / 2) + 80,
      200,
      50,
      this.inputSystem,
      handleBackClick
    );
    sceneManager.addEntity(button);
    this.localEntities.push(button);

    /* Add Background */
    const screenRenderer = new StartScreenRender(() => {return "PROJECT RUNNER"});
    sceneManager.addEntity(screenRenderer);
    this.localEntities.push(screenRenderer);
  }

  onResume(sceneManager: SceneManager): void {
    console.log("Resuming settings screen");

    // Re-add room entities
    for (const entity of this.localEntities) {
      sceneManager.addEntity(entity);
    }
  }

  onExit(): void {}

  update(context: GameContext): void {}
  draw(context: GameContext): void {}
}