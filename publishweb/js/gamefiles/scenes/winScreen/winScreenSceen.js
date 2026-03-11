import { WinScreenRender } from "./winScreenRender.js";
export class WinScreenScene {
    constructor(sceneTrigger) {
        this.sceneTrigger = sceneTrigger;
    }
    onEnter(sceneManager) {
        const screenRenderer = new WinScreenRender();
        sceneManager.addUIEntity(screenRenderer);
        setTimeout(() => {
            this.onExit();
        }, 5000);
    }
    onResume(sceneManager) {
    }
    onExit() {
        // Nothing for now, end the game
    }
    update(context) { }
    draw(context) { }
}
