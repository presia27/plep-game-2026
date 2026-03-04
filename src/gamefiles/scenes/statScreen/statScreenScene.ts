import { GameContext, IScene } from "../../../classinterfaces.ts";
import { GameStateEventTrigger, NEXT_SCENE } from "../../../gameStateEventTrigger.ts";
import SceneManager from "../../../sceneManager.ts";
import { StatScreenRender } from "./statScreenRender.ts";

export class StatScreenScene implements IScene {
  private sceneTrigger: GameStateEventTrigger;

  constructor(sceneTrigger: GameStateEventTrigger) {
    this.sceneTrigger = sceneTrigger;
  }

  onEnter(sceneManager: SceneManager): void {
    const screenRenderer = new StatScreenRender();
    sceneManager.addUIEntity(screenRenderer);

    setTimeout(() => {
      this.onExit();
    }, 5000);
  }

  onResume(sceneManager: SceneManager): void {
    
  }

  onExit(): void {
    this.sceneTrigger.assertChange(null, NEXT_SCENE);
  }

  update(context: GameContext): void {}
  draw(context: GameContext): void {}
  
}