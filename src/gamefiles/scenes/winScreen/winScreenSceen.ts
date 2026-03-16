import { GameContext, IScene } from "../../../classinterfaces.ts";
import { GAME_RESET_GOTO_MENU, GameStateEventTrigger } from "../../../gameStateEventTrigger.ts";
import { InputSystem } from "../../../inputsys.ts";
import SceneManager from "../../../sceneManager.ts";
import { ASSET_MANAGER } from "../../main.ts";
import { ButtonEntity } from "../buttonEntity.ts";
import { WinScreenRender } from "./winScreenRender.ts";

export class WinScreenScene implements IScene {
  private sceneTrigger: GameStateEventTrigger;
  private inputSystem: InputSystem;
  private canvasWidth: number;
  private canvasHeight: number;

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
  }

  onEnter(sceneManager: SceneManager): void {
    // Return to main menu
    const handleMainMenuClick = () => {
      ASSET_MANAGER.stopAllMusic();
      this.sceneTrigger.assertChange(null, GAME_RESET_GOTO_MENU);
    };

    const mainMenuButton = new ButtonEntity(
      "Return to Menu",
      "transparent",
      "white",
      (this.canvasWidth) / 2 - 150,
      (this.canvasHeight) - 200,
      300,
      50,
      this.inputSystem,
      handleMainMenuClick,
      "center"
    );
    setTimeout(() => {
      sceneManager.addTransientUIEntity(mainMenuButton);
    }, 2500);

    const screenRenderer = new WinScreenRender();
    sceneManager.addEntity(screenRenderer);
  }

  onResume(sceneManager: SceneManager): void {
    
  }

  onExit(): void {
    // Nothing for now, end the game
  }

  update(context: GameContext): void {}
  draw(context: GameContext): void {}
  
}