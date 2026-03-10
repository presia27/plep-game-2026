import { TOGGLE_PAUSE } from "../../../gameStateEventTrigger.js";
import { ASSET_MANAGER } from "../../main.js";
import { ButtonEntity } from "../buttonEntity.js";
import { SliderEntity } from "../sliderEntity.js";
import { StartScreenRender } from "./startScreenRender.js";
import { STARTSCREEN_SCENEID } from "./startScreenScene.js";
export const SETTINGSSCREEN_SCENEID = "settings";
export class SettingsScreenScene {
    constructor(sceneTrigger, inputSystem, canvasWidth, canvasHeight, isInGame) {
        this.sceneTrigger = sceneTrigger;
        this.inputSystem = inputSystem;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.isInGame = isInGame;
        this.localEntities = [];
    }
    onEnter(sceneManager) {
        /* Control handler functions */
        const handleVolumeChange = (value) => {
            ASSET_MANAGER.setVolume(value);
        };
        const handleBackClick = () => {
            if (this.isInGame) {
                this.sceneTrigger.assertChange(null, TOGGLE_PAUSE);
            }
            else {
                sceneManager.loadScene(STARTSCREEN_SCENEID);
            }
        };
        /* Add controls */
        // Add volume slider
        const slider = new SliderEntity("Volume", (this.canvasWidth / 2) - 150, (this.canvasHeight / 2) - 20, 300, 15, ASSET_MANAGER.getVolume(), this.inputSystem, handleVolumeChange);
        sceneManager.addTransientUIEntity(slider);
        this.localEntities.push(slider);
        const button = new ButtonEntity("BACK", "#9E9E9E", // grey
        "white", (this.canvasWidth / 2) - 100, (this.canvasHeight / 2) + 80, 200, 50, this.inputSystem, handleBackClick);
        sceneManager.addTransientUIEntity(button);
        this.localEntities.push(button);
        /* Add Background */
        const screenRenderer = new StartScreenRender(() => { return "PROJECT RUNNER"; });
        sceneManager.addTransientUIEntity(screenRenderer);
        this.localEntities.push(screenRenderer);
    }
    onResume(sceneManager) {
        console.log("Resuming settings screen");
        // Re-add room entities
        for (const entity of this.localEntities) {
            sceneManager.addTransientUIEntity(entity);
        }
    }
    onExit() { }
    update(context) { }
    draw(context) { }
}
