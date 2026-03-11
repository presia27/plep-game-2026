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
  private musicStarted: boolean = false;
  private introMusicNode: { source: AudioBufferSourceNode, gainNode: GainNode } | null = null;

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

    // Music will start on first user interaction (handled in update())
    const handleStartGameClick = () => {
      
      // Transition music to full loop: 12s to end (minus 4s empty space at loop)
      if (this.introMusicNode) {
        this.introMusicNode.source.loopStart = 12;
        this.introMusicNode.source.loopEnd = (this.introMusicNode.source.buffer?.duration || 100) - 4;
      } else {
        // Fallback if intro didn't play (e.g. autoplay blocked)
        this.introMusicNode = ASSET_MANAGER.playMusic("gameMusic", 11.8, (ASSET_MANAGER.getAudioAsset("gameMusic")?.duration || 100) - 4, 11.8);
      }

      this.sceneTrigger.assertChange(null, NEXT_SCENE);
    }

    const handleSettingsClick = () => {
      sceneManager.loadScene(SETTINGSSCREEN_SCENEID);
    }

    /* Add buttons */
    const startBtn = new ButtonEntity(
      "PLAY",
      "transparent",
      "white",
      72,
      (this.canvasHeight) - 272,
      200,
      50,
      this.inputSystem,
      handleStartGameClick,
      "left"
    );
    sceneManager.addTransientUIEntity(startBtn);
    this.localEntities.push(startBtn);

    const settingsBtn = new ButtonEntity(
      "SETTINGS",
      "transparent",
      "white",
      72,
      (this.canvasHeight - 200),
      200,
      50,
      this.inputSystem,
      handleSettingsClick,
      "left"
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

  update(context: GameContext): void {
    // Start music on first user interaction (click or mouse movement)
    if (!this.musicStarted) {
      const hasInteraction = this.inputSystem.getLeftClick() !== null || 
                            this.inputSystem.getCursorPosition() !== null;
      
      if (hasInteraction) {
        // Start Intro Music Loop: 0 to 12s
        this.introMusicNode = ASSET_MANAGER.playMusic("gameMusic", 0, 12);
        this.musicStarted = true;
      }
    }
  }
  
  draw(context: GameContext): void {}
}