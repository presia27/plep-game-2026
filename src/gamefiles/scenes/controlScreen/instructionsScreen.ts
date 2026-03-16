import { GameContext, IEntity, IScene } from "../../../classinterfaces.ts";
import { GameStateEventTrigger, TOGGLE_PAUSE } from "../../../gameStateEventTrigger.ts";
import { InputSystem } from "../../../inputsys.ts";
import SceneManager from "../../../sceneManager.ts";
import { ButtonEntity } from "../buttonEntity.ts";
import { InstructionsScreenRender } from "./instructionScreenRender.ts";
import { StartScreenRender } from "./startScreenRender.ts";
import { STARTSCREEN_SCENEID } from "./startScreenScene.ts";

export const INSTRUCTIONSCREEN_SCENEID = "instructions"

export class InstructionsScreenScene implements IScene {
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
    const handleBackClick = () => {
      if (this.isInGame) {
        this.sceneTrigger.assertChange(null, TOGGLE_PAUSE);
      }
      else {
        sceneManager.loadScene(STARTSCREEN_SCENEID);
      }
    };

    /* Add back button - added first so it draws last (on top) */
    const button = new ButtonEntity(
      "BACK",
      "transparent",
      "white",
      (this.canvasWidth / 2) - 100,
      (this.canvasHeight / 2) + 180,
      200,
      50,
      this.inputSystem,
      handleBackClick
    );
    sceneManager.addTransientUIEntity(button);
    this.localEntities.push(button);

    /* Add instruction text entity - added second so it draws in middle */
    const instructionsRenderer = new InstructionsScreenRender(
      this.canvasWidth,
      this.canvasHeight
    );
    sceneManager.addTransientUIEntity(instructionsRenderer);
    this.localEntities.push(instructionsRenderer);

    /* Add Background - added last so it draws first (on bottom) */
    const screenRenderer = new StartScreenRender(() => {return "INSRTUCTIONS"});
    sceneManager.addTransientUIEntity(screenRenderer);
    this.localEntities.push(screenRenderer);
  }

  onResume(sceneManager: SceneManager): void {
    console.log("Resuming instructions screen");

    // Re-add room entities
    for (const entity of this.localEntities) {
      sceneManager.addTransientUIEntity(entity);
    }
  }

  onExit(): void {}

  update(context: GameContext): void {}
  draw(context: GameContext): void {}
}