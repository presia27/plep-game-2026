import { GameContext, IScene } from "../../../classinterfaces.ts";
import { GameStateEventTrigger, NEXT_SCENE } from "../../../gameStateEventTrigger.ts";
import SceneManager from "../../../sceneManager.ts";
import { LevelSummary } from "../../levels/levelinterfaces.ts";
import { StatScreenRender } from "./statScreenRender.ts";

export class StatScreenScene implements IScene {
  private sceneTrigger: GameStateEventTrigger;
  private levelSummary: LevelSummary;

  constructor(sceneTrigger: GameStateEventTrigger, levelSummary: LevelSummary) {
    this.sceneTrigger = sceneTrigger;
    this.levelSummary = levelSummary;
  }

  onEnter(sceneManager: SceneManager): void {
    const screenRenderer = new StatScreenRender(this.levelSummary);
    sceneManager.addUIEntity(screenRenderer);

    setTimeout(() => {
      this.onExit();
    }, 6000);
  }

  onResume(sceneManager: SceneManager): void {
    
  }

  onExit(): void {
    this.sceneTrigger.assertChange(null, NEXT_SCENE);
  }

  update(context: GameContext): void {}
  draw(context: GameContext): void {}
  
}