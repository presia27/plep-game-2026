import { GameContext, IScene } from "../../../classinterfaces.ts";
import { GameStateEventTrigger, NEXT_SCENE } from "../../../gameStateEventTrigger.ts";
import SceneManager from "../../../sceneManager.ts";
import { WinScreenRender } from "./winScreenRender.ts";

export class WinScreenScene implements IScene {
  private sceneTrigger: GameStateEventTrigger;

  constructor(sceneTrigger: GameStateEventTrigger) {
    this.sceneTrigger = sceneTrigger;
  }

  onEnter(sceneManager: SceneManager): void {
    const screenRenderer = new WinScreenRender();
    sceneManager.addUIEntity(screenRenderer);

    setTimeout(() => {
      this.onExit();
    }, 5000);
  }

  onResume(sceneManager: SceneManager): void {
    
  }

  onExit(): void {
    // Nothing for now, end the game
  }

  update(context: GameContext): void {}
  draw(context: GameContext): void {}
  
}