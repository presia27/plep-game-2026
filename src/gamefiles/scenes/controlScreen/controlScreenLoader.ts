import GameEngine from "../../../gameengine.ts";
import { GameStateEventTrigger } from "../../../gameStateEventTrigger.ts";
import { InputSystem } from "../../../inputsys.ts";
import SceneManager from "../../../sceneManager.ts";
import { SETTINGSSCREEN_SCENEID, SettingsScreenScene } from "./settingsScreen.ts";
import { STARTSCREEN_SCENEID, StartScreenScene } from "./startScreenScene.ts";
import { SPLASHSCREEN_SCENEID, SplashScreenScene } from "./startupScene.ts";
import { VOLUMESCREEN_SCENEID, VolumeScreenScene } from "./volumeScene.ts";
import { INSTRUCTIONSCREEN_SCENEID, InstructionsScreenScene } from "./instructionsScreen.ts";

export function loadControlScreen(
  sceneManager: SceneManager,
  inputsys: InputSystem,
  ctx: CanvasRenderingContext2D,
  gsEventTrigger: GameStateEventTrigger
) {
  // Create all scenes
  const splashScreen = new SplashScreenScene(gsEventTrigger, inputsys, ctx.canvas.width, ctx.canvas.height);
  const volumeScreen = new VolumeScreenScene(gsEventTrigger, inputsys, ctx.canvas.width, ctx.canvas.height);
  const startScreen = new StartScreenScene(gsEventTrigger, inputsys, ctx.canvas.width, ctx.canvas.height);
  const settingsScreen = new SettingsScreenScene(gsEventTrigger, inputsys, ctx.canvas.width, ctx.canvas.height, false);
  const instructionsScreen = new InstructionsScreenScene(gsEventTrigger, inputsys, ctx.canvas.width, ctx.canvas.height, false);

  // Register all scenes
  sceneManager.registerScene(VOLUMESCREEN_SCENEID, volumeScreen);
  sceneManager.registerScene(STARTSCREEN_SCENEID, startScreen);
  sceneManager.registerScene(SETTINGSSCREEN_SCENEID, settingsScreen);
  sceneManager.registerScene(INSTRUCTIONSCREEN_SCENEID, instructionsScreen);
  
  // Load splash screen first
  sceneManager.loadScene(SPLASHSCREEN_SCENEID, splashScreen);
}
