import { NEXT_SCENE } from "../../../gameStateEventTrigger.js";
import { ASSET_MANAGER } from "../../main.js";
import { ButtonEntity } from "../buttonEntity.js";
import { SETTINGSSCREEN_SCENEID } from "./settingsScreen.js";
import { StartScreenRender } from "./startScreenRender.js";
export const STARTSCREEN_SCENEID = "start";
export class StartScreenScene {
    constructor(sceneTrigger, inputSystem, canvasWidth, canvasHeight) {
        this.musicStarted = false;
        this.introMusicNode = null;
        this.sceneTrigger = sceneTrigger;
        this.inputSystem = inputSystem;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.localEntities = [];
    }
    onEnter(sceneManager) {
        /* Start Game Procedure */
        // Music will start on first user interaction (handled in update())
        const handleStartGameClick = () => {
            var _a, _b;
            // Transition music to full loop: 12s to end
            if (this.introMusicNode) {
                this.introMusicNode.source.loopStart = 12;
                this.introMusicNode.source.loopEnd = ((_a = this.introMusicNode.source.buffer) === null || _a === void 0 ? void 0 : _a.duration) || 100;
            }
            else {
                // Fallback if intro didn't play (e.g. autoplay blocked)
                this.introMusicNode = ASSET_MANAGER.playMusic("gameMusic", 11.8, ((_b = ASSET_MANAGER.getAudioAsset("gameMusic")) === null || _b === void 0 ? void 0 : _b.duration) || 100, 11.8);
            }
            this.sceneTrigger.assertChange(null, NEXT_SCENE);
        };
        const handleSettingsClick = () => {
            sceneManager.loadScene(SETTINGSSCREEN_SCENEID);
        };
        /* Add buttons */
        const startBtn = new ButtonEntity("START GAME", "#4CAF50", // green game-like
        "white", (this.canvasWidth / 2) - 100, (this.canvasHeight / 2) + 10, 200, 50, this.inputSystem, handleStartGameClick);
        sceneManager.addTransientUIEntity(startBtn);
        this.localEntities.push(startBtn);
        const settingsBtn = new ButtonEntity("SETTINGS", "#2196F3", // blue
        "white", (this.canvasWidth / 2) - 100, (this.canvasHeight / 2) + 80, 200, 50, this.inputSystem, handleSettingsClick);
        sceneManager.addTransientUIEntity(settingsBtn);
        this.localEntities.push(settingsBtn);
        /* Add Background */
        const screenRenderer = new StartScreenRender(() => { return "PROJECT RUNNER"; });
        sceneManager.addTransientUIEntity(screenRenderer);
        this.localEntities.push(screenRenderer);
    }
    onResume(sceneManager) {
        console.log("Resuming start screen");
        // Re-add room entities
        for (const entity of this.localEntities) {
            sceneManager.addTransientUIEntity(entity);
        }
    }
    onExit() { }
    update(context) {
        // Start music on first user interaction (click or mouse movement)
        if (!this.musicStarted) {
            const hasInteraction = this.inputSystem.getLeftClick() !== null ||
                this.inputSystem.getCursorPosition() !== null;
            if (hasInteraction) {
                // Start Intro Music Loop: 0 to 12s
                this.introMusicNode = ASSET_MANAGER.playMusic("gameMusic", 0, 12);
                this.musicStarted = true;
            }
        }
    }
    draw(context) { }
}
