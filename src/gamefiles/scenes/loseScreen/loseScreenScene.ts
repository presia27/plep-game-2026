import { GameContext, IScene, IRenderer } from "../../../classinterfaces.ts";
import { GAME_RESET_GOTO_MENU, GAME_RESET_REPLAY, GameStateEventTrigger, NEXT_SCENE } from "../../../gameStateEventTrigger.ts";
import { InputSystem } from "../../../inputsys.ts";
import SceneManager from "../../../sceneManager.ts";
import { ButtonEntity } from "../buttonEntity.ts";
import { STARTSCREEN_SCENEID, StartScreenScene } from "../controlScreen/startScreenScene.ts";
import { LoseScreenRender } from "./loseScreenRender.ts";
import { ASSET_MANAGER } from "../../main.ts";
import { Entity } from "../../../entity.ts";
import { BasicLifecycle } from "../../../componentLibrary/lifecycle.ts";

class ConfirmationDialog extends Entity {
  constructor(message: string) {
    super();
    super.setRenderer(new ConfirmationRenderer(message));
    super.addComponent(new BasicLifecycle());
  }
}

class ConfirmationRenderer implements IRenderer {
  private message: string;

  constructor(message: string) {
    this.message = message;
  }

  draw(context: GameContext): void {
    const ctx = context.ctx;
    
    ctx.save();
    
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Dialog (or dialogue? i actually dont know) box
    const boxWidth = 600;
    const boxHeight = 200;
    const boxX = (ctx.canvas.width - boxWidth) / 2;
    const boxY = (ctx.canvas.height - boxHeight) / 2;
    
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
    
    // Message text
    ctx.fillStyle = 'white';
    ctx.font = '24px "Jersey-20", Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.message, ctx.canvas.width / 2, boxY + 60);
    ctx.fillText("Game progress will be lost.", ctx.canvas.width / 2, boxY + 95);
    
    ctx.restore();
  }
}

export class LoseScreenScene implements IScene {
  private sceneTrigger: GameStateEventTrigger;
  private loseText: string;
  private inputSystem: InputSystem;
  private canvasWidth: number;
  private canvasHeight: number;
  private showingConfirmation: boolean;
  private tryAgainBtn: ButtonEntity | null;
  private backToMenuBtn: ButtonEntity | null;
  private confirmDialog: ConfirmationDialog | null;
  private yesBtn: ButtonEntity | null;
  private noBtn: ButtonEntity | null;
  
  constructor(
    sceneTrigger: GameStateEventTrigger,
    loseText: string,
    inputSystem: InputSystem,
    canvasWidth: number,
    canvasHeight: number
  ) {
    this.sceneTrigger = sceneTrigger;
    this.loseText = loseText;
    this.inputSystem = inputSystem;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.showingConfirmation = false;
    this.tryAgainBtn = null;
    this.backToMenuBtn = null;
    this.confirmDialog = null;
    this.yesBtn = null;
    this.noBtn = null;
  }
    
  onEnter(sceneManager: SceneManager): void {
    const screenRenderer = new LoseScreenRender(this.loseText);
    sceneManager.addEntity(screenRenderer);

    // Try Again button - replays the current level
    const handleTryAgainClick = () => {
      this.sceneTrigger.assertChange(null, GAME_RESET_REPLAY);
    };

    this.tryAgainBtn = new ButtonEntity(
      "TRY AGAIN",
      "transparent",
      "white",
      72,
      (this.canvasHeight) - 200,
      200,
      50,
      this.inputSystem,
      handleTryAgainClick,
      "left"
    );
    sceneManager.addTransientUIEntity(this.tryAgainBtn);

    // Back to Menu button - shows confirmation dialogue to inform player of potential progress loss
    const handleBackToMenuClick = () => {
      this.showConfirmation(sceneManager);
    };

    this.backToMenuBtn = new ButtonEntity(
      "BACK TO MENU",
      "transparent",
      "white",
      72,
      (this.canvasHeight) - 128,
      200,
      50,
      this.inputSystem,
      handleBackToMenuClick,
      "left"
    );
    sceneManager.addTransientUIEntity(this.backToMenuBtn);
  }

  private showConfirmation(sceneManager: SceneManager): void {
    if (this.showingConfirmation) return;
    
    this.showingConfirmation = true;
    
    // Hide original buttons
    if (this.tryAgainBtn) {
      const lifecycle = this.tryAgainBtn.getComponent(BasicLifecycle);
      if (lifecycle) lifecycle.die();
    }
    if (this.backToMenuBtn) {
      const lifecycle = this.backToMenuBtn.getComponent(BasicLifecycle);
      if (lifecycle) lifecycle.die();
    }
    
    // Add buttons BEFORE dialog so they render on top (entities draw in reverse order)
    // Yes button - actually go back to menu
    const handleYesClick = () => {
      ASSET_MANAGER.stopAllMusic();
      // const startScreen = new StartScreenScene(
      //   this.sceneTrigger,
      //   this.inputSystem,
      //   this.canvasWidth,
      //   this.canvasHeight
      // );
      // sceneManager.loadScene(STARTSCREEN_SCENEID, startScreen);
      this.sceneTrigger.assertChange(null, GAME_RESET_GOTO_MENU);
    };
    
    this.yesBtn = new ButtonEntity(
      "YES",
      "transparent",
      "white",
      (this.canvasWidth / 2) - 120,
      (this.canvasHeight / 2) + 30,
      100,
      50,
      this.inputSystem,
      handleYesClick,
      "center"
    );
    sceneManager.addTransientUIEntity(this.yesBtn);
    
    // No button - cancel and go back
    const handleNoClick = () => {
      this.hideConfirmation(sceneManager);
    };
    
    this.noBtn = new ButtonEntity(
      "NO",
      "transparent",
      "white",
      (this.canvasWidth / 2) + 20,
      (this.canvasHeight / 2) + 30,
      100,
      50,
      this.inputSystem,
      handleNoClick,
      "center"
    );
    sceneManager.addTransientUIEntity(this.noBtn);
    
    // Add confirmation dialog LAST so it draws first (as background)
    this.confirmDialog = new ConfirmationDialog("Are you sure you want to go back to menu?");
    sceneManager.addTransientUIEntity(this.confirmDialog);
  }

  private hideConfirmation(sceneManager: SceneManager): void {
    if (!this.showingConfirmation) return;
    
    this.showingConfirmation = false;
    
    // Remove confirmation dialog and buttons
    if (this.confirmDialog) {
      const lifecycle = this.confirmDialog.getComponent(BasicLifecycle);
      if (lifecycle) lifecycle.die();
    }
    if (this.yesBtn) {
      const lifecycle = this.yesBtn.getComponent(BasicLifecycle);
      if (lifecycle) lifecycle.die();
    }
    if (this.noBtn) {
      const lifecycle = this.noBtn.getComponent(BasicLifecycle);
      if (lifecycle) lifecycle.die();
    }
    
    // Re-create original buttons
    const handleTryAgainClick = () => {
      this.sceneTrigger.assertChange(null, NEXT_SCENE);
    };

    this.tryAgainBtn = new ButtonEntity(
      "TRY AGAIN",
      "transparent",
      "white",
      72,
      (this.canvasHeight) - 200,
      200,
      50,
      this.inputSystem,
      handleTryAgainClick,
      "left"
    );
    sceneManager.addTransientUIEntity(this.tryAgainBtn);

    const handleBackToMenuClick = () => {
      this.showConfirmation(sceneManager);
    };

    this.backToMenuBtn = new ButtonEntity(
      "BACK TO MENU",
      "transparent",
      "white",
      72,
      (this.canvasHeight) - 128,
      200,
      50,
      this.inputSystem,
      handleBackToMenuClick,
      "left"
    );
    sceneManager.addTransientUIEntity(this.backToMenuBtn);
  }

  onResume(sceneManager: SceneManager): void {
    
  }

  onExit(): void {
    // Game ends, do nothing for now
  }

  update(context: GameContext): void {}

  draw(context: GameContext): void {}
  
}