import { GameContext, IScene } from "../../../classinterfaces.ts";
import { GameStateEventTrigger } from "../../../gameStateEventTrigger.ts";
import SceneManager from "../../../sceneManager.ts";
import { LoseScreenRender } from "./loseScreenRender.ts";

export class LoseScreenScene implements IScene {
  private sceneTrigger: GameStateEventTrigger;
  
  constructor(sceneTrigger: GameStateEventTrigger) {
    this.sceneTrigger = sceneTrigger;
  }
    
  onEnter(sceneManager: SceneManager): void {
    const screenRenderer = new LoseScreenRender();
    sceneManager.addEntity(screenRenderer);

    setTimeout(() => {
      this.onExit();
    }, 5000);
  }

  onResume(sceneManager: SceneManager): void {
    throw new Error("Method not implemented.");
  }

  onExit(): void {
    // Game ends, do nothing for noe
  }

  update(context: GameContext): void {}

  draw(context: GameContext): void {}
  
}