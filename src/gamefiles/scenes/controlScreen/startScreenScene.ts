import { GameContext, IEntity, IScene } from "../../../classinterfaces.ts";
import { GameStateEventTrigger, NEXT_SCENE } from "../../../gameStateEventTrigger.ts";
import { InputSystem } from "../../../inputsys.ts";
import SceneManager from "../../../sceneManager";
import { ASSET_MANAGER } from "../../main.ts";
import { ButtonEntity } from "../buttonEntity.ts";
import { SETTINGSSCREEN_SCENEID } from "./settingsScreen.ts";
import { StartScreenRender } from "./startScreenRender.ts";

export const STARTSCREEN_SCENEID = "start"

export class StartScreenScene implements IScene {
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

    /* Start Game Procedure */

    // Start Intro Music Loop: 0 to 12s
    // We store it so we can modify the loop points later
    let introMusicNode = ASSET_MANAGER.playMusic("YMCAMusic", 0, 12);
    const handleStartGameClick = () => {
      
      // Transition music to full loop: 12s to end
      if (introMusicNode) {
        introMusicNode.source.loopStart = 12;
        introMusicNode.source.loopEnd = introMusicNode.source.buffer?.duration || 100;
      } else {
        // Fallback if intro didn't play (e.g. autoplay blocked)
        introMusicNode = ASSET_MANAGER.playMusic("YMCAMusic", 11.8, ASSET_MANAGER.getAudioAsset("YMCAMusic")?.duration || 100, 11.8);
      }

      this.sceneTrigger.assertChange(null, NEXT_SCENE);
    }

    const handleSettingsClick = () => {
      sceneManager.loadScene(SETTINGSSCREEN_SCENEID);
    }

    /* Add buttons */
    const startBtn = new ButtonEntity(
      "START GAME",
      "#4CAF50", // green game-like
      "white",
      (this.canvasWidth / 2) - 100,
      (this.canvasHeight / 2) + 10,
      200,
      50,
      this.inputSystem,
      handleStartGameClick
    );
    sceneManager.addTransientUIEntity(startBtn);
    this.localEntities.push(startBtn);

    const settingsBtn = new ButtonEntity(
      "SETTINGS",
      "#2196F3", // blue
      "white",
      (this.canvasWidth / 2) - 100,
      (this.canvasHeight / 2) + 80,
      200,
      50,
      this.inputSystem,
      handleSettingsClick
    );
    sceneManager.addTransientUIEntity(settingsBtn);
    this.localEntities.push(settingsBtn);

    /* Add Background */
    const screenRenderer = new StartScreenRender(() => {return "PROJECT RUNNER"});
    sceneManager.addTransientUIEntity(screenRenderer);
    this.localEntities.push(screenRenderer);
  }

  onResume(sceneManager: SceneManager): void {
    console.log("Resuming start screen");

    // Re-add room entities
    for (const entity of this.localEntities) {
      sceneManager.addTransientUIEntity(entity);
    }
  }

  onExit(): void {}

  update(context: GameContext): void {}
  draw(context: GameContext): void {}
}