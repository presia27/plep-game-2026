import { LoseScreenRender } from "./loseScreenRender.js";
export class LoseScreenScene {
    constructor(sceneTrigger, loseText) {
        this.sceneTrigger = sceneTrigger;
        this.loseText = loseText;
    }
    onEnter(sceneManager) {
        const screenRenderer = new LoseScreenRender(this.loseText);
        sceneManager.addEntity(screenRenderer);
        setTimeout(() => {
            this.onExit();
        }, 5000);
    }
    onResume(sceneManager) {
    }
    onExit() {
        // Game ends, do nothing for now
    }
    update(context) { }
    draw(context) { }
}
