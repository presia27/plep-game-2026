import { NEXT_SCENE } from "../../../gameStateEventTrigger.js";
import { StatScreenRender } from "./statScreenRender.js";
export class StatScreenScene {
    constructor(sceneTrigger) {
        this.sceneTrigger = sceneTrigger;
    }
    onEnter(sceneManager) {
        const screenRenderer = new StatScreenRender();
        sceneManager.addUIEntity(screenRenderer);
        setTimeout(() => {
            this.onExit();
        }, 5000);
    }
    onResume(sceneManager) {
    }
    onExit() {
        this.sceneTrigger.assertChange(null, NEXT_SCENE);
    }
    update(context) { }
    draw(context) { }
}
