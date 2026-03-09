import GameEngine from "../../../gameengine.ts";
import { GameStateEventTrigger } from "../../../gameStateEventTrigger.ts";
import { InputSystem } from "../../../inputsys.ts";
import SceneManager from "../../../sceneManager.ts";
import { SettingsScreenScene } from "./settingsScreen.ts";
import { StartScreenScene } from "./startScreenScene.ts";

export function loadControlScreen(
  sceneManager: SceneManager,
  inputsys: InputSystem,
  ctx: CanvasRenderingContext2D,
  gsEventTrigger: GameStateEventTrigger
) {
  const startScreen = new StartScreenScene(gsEventTrigger, inputsys, ctx.canvas.width, ctx.canvas.height);
  const settingsScreen = new SettingsScreenScene(gsEventTrigger, inputsys, ctx.canvas.width, ctx.canvas.height, false);

  sceneManager.registerScene("settings", settingsScreen);
  sceneManager.loadScene("start", startScreen);
}
