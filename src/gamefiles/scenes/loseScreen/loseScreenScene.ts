import { GameContext, IScene } from "../../../classinterfaces.ts";
import { GameStateEventTrigger } from "../../../gameStateEventTrigger.ts";
import SceneManager from "../../../sceneManager.ts";
import { LoseScreenRender } from "./loseScreenRender.ts";

export class LoseScreenScene implements IScene {
  private sceneTrigger: GameStateEventTrigger;
  private loseText: string;
  
  constructor(sceneTrigger: GameStateEventTrigger, loseText: string) {
    this.sceneTrigger = sceneTrigger;
    this.loseText = loseText;
  }
    
  onEnter(sceneManager: SceneManager): void {
    const screenRenderer = new LoseScreenRender(this.loseText);
    sceneManager.addEntity(screenRenderer);

    setTimeout(() => {
      this.onExit();
    }, 5000);
  }

  onResume(sceneManager: SceneManager): void {
    
  }

  onExit(): void {
    // Game ends, do nothing for now
  }

  update(context: GameContext): void {}

  draw(context: GameContext): void {}
  
}