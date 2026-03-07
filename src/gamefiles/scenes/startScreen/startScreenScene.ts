import { GameContext, IScene } from "../../../classinterfaces.ts";
import { GameStateEventTrigger, NEXT_SCENE, TOGGLE_PAUSE } from "../../../gameStateEventTrigger.ts";
import { InputSystem } from "../../../inputsys.ts";
import SceneManager from "../../../sceneManager.ts";
import { ASSET_MANAGER } from "../../main.ts";
import { ButtonEntity } from "../buttonEntity.ts";
import { SliderEntity } from "../sliderEntity.ts";
import { StartScreenRender } from "./startScreenRender.ts";

export class StartScreenScene implements IScene {
  private sceneTrigger: GameStateEventTrigger;
  private inputSystem: InputSystem;
  private canvasWidth: number;
  private canvasHeight: number;

  private sceneManager: SceneManager | null = null;
  private menuState: 'MAIN' | 'SETTINGS' = 'MAIN';
  private inGame: boolean = false;

  constructor(sceneTrigger: GameStateEventTrigger, inputSystem: InputSystem, canvasWidth: number, canvasHeight: number) {
    this.sceneTrigger = sceneTrigger;
    this.inputSystem = inputSystem;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  onEnter(sceneManager: SceneManager): void {
    this.sceneManager = sceneManager;
    this.renderMenu();
  }

  private renderMenu(): void {
    if (!this.sceneManager) return;

    // Clear existing room entities to refresh the UI
    this.sceneManager.clearEntities();

    // 2. Add buttons based on state
    if (this.menuState === 'MAIN') {
      
      // Start Intro Music Loop: 0 to 12s
      // We store it so we can modify the loop points later
      let introMusicNode = ASSET_MANAGER.playMusic("YMCAMusic", 0, 12);

      const handleStartGameClick = () => {
        // Transition music to full loop: 12s to end
        if (introMusicNode) {
          introMusicNode.source.loopStart = 12;
          introMusicNode.source.loopEnd = introMusicNode.source.buffer?.duration || 100;
        } else {
          // Fallback if intro didn't play (e.g. autoplay blocked)
          introMusicNode = ASSET_MANAGER.playMusic("YMCAMusic", 11.8, ASSET_MANAGER.getAudioAsset("YMCAMusic")?.duration || 100, 11.8);
        }

        this.sceneTrigger.assertChange(null, NEXT_SCENE);
      }

      const handleSettingsClick = () => {
        this.menuState = 'SETTINGS';
        this.renderMenu(); // re-render the menu
      }

      this.sceneManager.addEntity(new ButtonEntity(
        "START GAME",
        "#4CAF50", // green game-like
        "white",
        (this.canvasWidth / 2) - 100,
        (this.canvasHeight / 2) + 10,
        200,
        50,
        this.inputSystem,
        handleStartGameClick
      ));

      this.sceneManager.addEntity(new ButtonEntity(
        "SETTINGS",
        "#2196F3", // blue
        "white",
        (this.canvasWidth / 2) - 100,
        (this.canvasHeight / 2) + 80,
        200,
        50,
        this.inputSystem,
        handleSettingsClick
      ));

    } else if (this.menuState === 'SETTINGS') {
      const handleVolumeChange = (value: number) => {
        ASSET_MANAGER.setVolume(value);
      };

      const handleBackClick = () => {
        if (this.inGame) {
          this.sceneTrigger.assertChange(null, TOGGLE_PAUSE);
        } else {
          this.menuState = 'MAIN';
          this.renderMenu();
        }
      };

      // Add volume slider
      this.sceneManager.addEntity(new SliderEntity(
        "Volume",
        (this.canvasWidth / 2) - 150,
        (this.canvasHeight / 2) - 20,
        300,
        15,
        ASSET_MANAGER.getVolume(),
        this.inputSystem,
        handleVolumeChange
      ));

      this.sceneManager.addEntity(new ButtonEntity(
        "BACK",
        "#9E9E9E", // grey
        "white",
        (this.canvasWidth / 2) - 100,
        (this.canvasHeight / 2) + 80,
        200,
        50,
        this.inputSystem,
        handleBackClick
      ));
    }

    // 3. Add background renderer LAST so it's drawn FIRST (due to reverse loop in SceneManager.draw)
    const screenRenderer = new StartScreenRender(() => {
      return this.menuState === 'MAIN' ? 'DELIVERY QUEST' : 'SETTINGS';
    });

    this.sceneManager.addEntity(screenRenderer);
  }

  onResume(sceneManager: SceneManager): void {
    this.sceneManager = sceneManager;
    this.renderMenu();
  }

  public setMenuState(state: 'MAIN' | 'SETTINGS') {
    this.menuState = state;
    if (this.sceneManager) {
      this.renderMenu();
    }
  }

  public setInGame(inGame: boolean) {
    this.inGame = inGame;
  }

  onExit(): void {
    // Game ends, do nothing for noe
  }

  update(context: GameContext): void { }

  draw(context: GameContext): void { }

}