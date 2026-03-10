import { ASSET_MANAGER } from "../../main.js";
import { ButtonEntity } from "../buttonEntity.js";
import { SliderEntity } from "../sliderEntity.js";
import { StartScreenRender } from "./startScreenRender.js";
import { STARTSCREEN_SCENEID } from "./startScreenScene.js";
export const VOLUMESCREEN_SCENEID = "volume";
export class VolumeScreenScene {
    constructor(sceneTrigger, inputSystem, canvasWidth, canvasHeight) {
        this.musicStarted = false;
        this.startupMusicNode = null;
        this.sceneTrigger = sceneTrigger;
        this.inputSystem = inputSystem;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.localEntities = [];
    }
    onEnter(sceneManager) {
        /* Control handlers */
        const handleVolumeChange = (value) => {
            // Start music on first interaction
            if (!this.musicStarted) {
                const startupBuffer = ASSET_MANAGER.getAudioAsset("startupMusic");
                if (startupBuffer) {
                    this.startupMusicNode = ASSET_MANAGER.playMusic("startupMusic", 0, startupBuffer.duration);
                }
                this.musicStarted = true;
            }
            ASSET_MANAGER.setVolume(value);
        };
        const handleContinueClick = () => {
            // Start music if not already playing
            if (!this.musicStarted) {
                const startupBuffer = ASSET_MANAGER.getAudioAsset("startupMusic");
                if (startupBuffer) {
                    this.startupMusicNode = ASSET_MANAGER.playMusic("startupMusic", 0, startupBuffer.duration);
                }
                this.musicStarted = true;
            }
            // Load main menu
            sceneManager.loadScene(STARTSCREEN_SCENEID);
        };
        /* Add volume slider */
        const slider = new SliderEntity("Volume", (this.canvasWidth / 2) - 150, (this.canvasHeight / 2) - 50, 300, 15, ASSET_MANAGER.getVolume(), this.inputSystem, handleVolumeChange);
        sceneManager.addTransientUIEntity(slider);
        this.localEntities.push(slider);
        /* Add continue button */
        const continueBtn = new ButtonEntity("CONTINUE", "#4CAF50", // green
        "white", (this.canvasWidth / 2) - 100, (this.canvasHeight / 2) + 50, 200, 50, this.inputSystem, handleContinueClick);
        sceneManager.addTransientUIEntity(continueBtn);
        this.localEntities.push(continueBtn);
        /* Add Background */
        const screenRenderer = new StartScreenRender(() => { return "VOLUME SETTINGS"; });
        sceneManager.addTransientUIEntity(screenRenderer);
        this.localEntities.push(screenRenderer);
    }
    onResume(sceneManager) {
        // Re-add room entities
        for (const entity of this.localEntities) {
            sceneManager.addTransientUIEntity(entity);
        }
    }
    onExit() {
        // Clean up music when leaving
        if (this.startupMusicNode) {
            this.startupMusicNode.source.stop();
        }
    }
    update(context) {
        // Start music on first mouse movement as fallback
        if (!this.musicStarted) {
            const hasInteraction = this.inputSystem.getCursorPosition() !== null;
            if (hasInteraction) {
                const startupBuffer = ASSET_MANAGER.getAudioAsset("startupMusic");
                if (startupBuffer) {
                    this.startupMusicNode = ASSET_MANAGER.playMusic("startupMusic", 0, startupBuffer.duration);
                }
                this.musicStarted = true;
            }
        }
    }
    draw(context) { }
}
