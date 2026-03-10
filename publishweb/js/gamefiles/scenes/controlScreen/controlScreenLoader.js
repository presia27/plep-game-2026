import { SETTINGSSCREEN_SCENEID, SettingsScreenScene } from "./settingsScreen.js";
import { STARTSCREEN_SCENEID, StartScreenScene } from "./startScreenScene.js";
import { SPLASHSCREEN_SCENEID, SplashScreenScene } from "./startupScene.js";
import { VOLUMESCREEN_SCENEID, VolumeScreenScene } from "./volumeScene.js";
export function loadControlScreen(sceneManager, inputsys, ctx, gsEventTrigger) {
    // Create all scenes
    const splashScreen = new SplashScreenScene(gsEventTrigger, inputsys, ctx.canvas.width, ctx.canvas.height);
    const volumeScreen = new VolumeScreenScene(gsEventTrigger, inputsys, ctx.canvas.width, ctx.canvas.height);
    const startScreen = new StartScreenScene(gsEventTrigger, inputsys, ctx.canvas.width, ctx.canvas.height);
    const settingsScreen = new SettingsScreenScene(gsEventTrigger, inputsys, ctx.canvas.width, ctx.canvas.height, false);
    // Register all scenes
    sceneManager.registerScene(VOLUMESCREEN_SCENEID, volumeScreen);
    sceneManager.registerScene(STARTSCREEN_SCENEID, startScreen);
    sceneManager.registerScene(SETTINGSSCREEN_SCENEID, settingsScreen);
    // Load splash screen first
    sceneManager.loadScene(SPLASHSCREEN_SCENEID, splashScreen);
}
