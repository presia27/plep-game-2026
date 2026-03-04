import { GameContext, IScene } from "../../../classinterfaces.ts";
import { GameStateEventTrigger, NEXT_SCENE } from "../../../gameStateEventTrigger.ts";
import { InputSystem } from "../../../inputsys.ts";
import SceneManager from "../../../sceneManager.ts";
import { ASSET_MANAGER } from "../../main.ts";
import { ButtonEntity } from "../buttonEntity.ts";
import { StartScreenRender } from "./startScreenRender.ts";

export class StartScreenScene implements IScene {
  private sceneTrigger: GameStateEventTrigger;
  private inputSystem: InputSystem;
  private canvasWidth: number;
  private canvasHeight: number;
  
  constructor(sceneTrigger: GameStateEventTrigger, inputSystem: InputSystem, canvasWidth: number, canvasHeight: number) {
    this.sceneTrigger = sceneTrigger;
    this.inputSystem = inputSystem;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }
    
  onEnter(sceneManager: SceneManager): void {
    const screenRenderer = new StartScreenRender();

    const handleStartGameClick = () => {
      const bgAudio = ASSET_MANAGER.getAudioAsset("YMCAMusic");
      // this is temporary just to show off music. It shouldn't be here.
      if (bgAudio) {
        bgAudio.play();
      }
      this.sceneTrigger.assertChange(null, NEXT_SCENE)
    }

    sceneManager.addEntity(new ButtonEntity(
      "START GAME",
      "red",
      "white",
      (this.canvasWidth / 2) - 100,
      (this.canvasHeight / 2) + 25,
      200,
      50,
      this.inputSystem,
      handleStartGameClick
    ));
    sceneManager.addEntity(screenRenderer);

  }

  onResume(sceneManager: SceneManager): void {
    
  }

  onExit(): void {
    // Game ends, do nothing for noe
  }

  update(context: GameContext): void {}

  draw(context: GameContext): void {}
  
}