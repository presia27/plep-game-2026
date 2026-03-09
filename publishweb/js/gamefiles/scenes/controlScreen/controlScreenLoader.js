import { SETTINGSSCREEN_SCENEID, SettingsScreenScene } from "./settingsScreen.js";
import { STARTSCREEN_SCENEID, StartScreenScene } from "./startScreenScene.js";
export function loadControlScreen(sceneManager, inputsys, ctx, gsEventTrigger) {
    const startScreen = new StartScreenScene(gsEventTrigger, inputsys, ctx.canvas.width, ctx.canvas.height);
    const settingsScreen = new SettingsScreenScene(gsEventTrigger, inputsys, ctx.canvas.width, ctx.canvas.height, false);
    sceneManager.registerScene(SETTINGSSCREEN_SCENEID, settingsScreen);
    sceneManager.loadScene(STARTSCREEN_SCENEID, startScreen);
}
