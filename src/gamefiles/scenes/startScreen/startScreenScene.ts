// import { GameContext, IScene } from "../../../classinterfaces.ts";
// import { GameStateEventTrigger, NEXT_SCENE } from "../../../gameStateEventTrigger.ts";
// import { InputSystem } from "../../../inputsys.ts";
// import SceneManager from "../../../sceneManager.ts";
// import { ASSET_MANAGER } from "../../main.ts";
// import { ButtonEntity } from "../buttonEntity.ts";
// import { StartScreenRender } from "./startScreenRender.ts";

// export class StartScreenScene implements IScene {
//   private sceneTrigger: GameStateEventTrigger;
//   private inputSystem: InputSystem;
//   private canvasWidth: number;
//   private canvasHeight: number;
  
//   constructor(sceneTrigger: GameStateEventTrigger, inputSystem: InputSystem, canvasWidth: number, canvasHeight: number) {
//     this.sceneTrigger = sceneTrigger;
//     this.inputSystem = inputSystem;
//     this.canvasWidth = canvasWidth;
//     this.canvasHeight = canvasHeight;
//   }
    
//   onEnter(sceneManager: SceneManager): void {
//     const screenRenderer = new StartScreenRender();

//     const handleStartGameClick = () => {
//       const bgAudio = ASSET_MANAGER.getAudioAsset("YMCAMusic");
//       // this is temporary just to show off music. It shouldn't be here.
//       if (bgAudio) {
//         bgAudio.play();
//       }
//       this.sceneTrigger.assertChange(null, NEXT_SCENE)
//     }

//     sceneManager.addEntity(new ButtonEntity(
//       "START GAME",
//       "red",
//       "white",
//       (this.canvasWidth / 2) - 100,
//       (this.canvasHeight / 2) + 25,
//       200,
//       50,
//       this.inputSystem,
//       handleStartGameClick
//     ));
//     sceneManager.addEntity(screenRenderer);

//   }

//   onResume(sceneManager: SceneManager): void {
    
//   }

//   onExit(): void {
//     // Game ends, do nothing for noe
//   }

//   update(context: GameContext): void {}

//   draw(context: GameContext): void {}
  
// }
import { GameContext, IScene, IRenderer } from "../../../classinterfaces.ts";
import { GameStateEventTrigger, NEXT_SCENE } from "../../../gameStateEventTrigger.ts";
import { InputSystem } from "../../../inputsys.ts";
import SceneManager from "../../../sceneManager.ts";
import { ASSET_MANAGER } from "../../main.ts";
import { ButtonEntity } from "../buttonEntity.ts";
import { StartScreenRender } from "./startScreenRender.ts";
import { Entity } from "../../../entity.ts";

export class StartScreenScene implements IScene {
  private sceneTrigger: GameStateEventTrigger;
  private inputSystem: InputSystem;
  private canvasWidth: number;
  private canvasHeight: number;
  private currentScreen: "main" | "controls" | "lore";
  private sceneManager: SceneManager | null;
  
  constructor(sceneTrigger: GameStateEventTrigger, inputSystem: InputSystem, canvasWidth: number, canvasHeight: number) {
    console.log("StartScreenScene constructor called");
    this.sceneTrigger = sceneTrigger;
    this.inputSystem = inputSystem;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.currentScreen = "main";
    this.sceneManager = null;
  }
    
  onEnter(sceneManager: SceneManager): void {
    console.log("StartScreenScene onEnter called");
    this.sceneManager = sceneManager;
    this.currentScreen = "main";
    this.renderMainMenu(sceneManager);
  }

  private clearUI(sceneManager: SceneManager): void {
    // Clear room entities (default behavior)
    sceneManager.clearEntities();
    
    // HACK: Access the private uiEntities array through type assertion
    // This clears UI entities which clearEntities() doesn't touch
    (sceneManager as any).uiEntities = [];
  }

  private renderMainMenu(sceneManager: SceneManager): void {
    console.log("renderMainMenu called");
    // Clear ALL entities including UI
    this.clearUI(sceneManager);

    const handleStartGameClick = () => {
      console.log("START GAME clicked!");
      const bgAudio = ASSET_MANAGER.getAudioAsset("YMCAMusic");
      if (bgAudio) {
        bgAudio.play();
      }
      this.sceneTrigger.assertChange(null, NEXT_SCENE);
    };

    const handleControlsClick = () => {
      console.log("CONTROLS clicked!");
      this.currentScreen = "controls";
      this.renderControlsScreen(sceneManager);
    };

    const handleLoreClick = () => {
      console.log("LORE clicked!");
      this.currentScreen = "lore";
      this.renderLoreScreen(sceneManager);
    };

    // IMPORTANT: Add buttons FIRST (they'll be drawn LAST, on top)
    // Because SceneManager draws UI entities in reverse order
    
    // Lore button (right side)
    const loreButton = new ButtonEntity(
      "LORE",
      "#8e44ad",
      "white",
      (this.canvasWidth / 2) + 110,
      (this.canvasHeight / 2) + 90,
      120,
      45,
      this.inputSystem,
      handleLoreClick
    );
    sceneManager.addUIEntity(loreButton);
    console.log("Added LORE button");

    // Controls button (left side)
    const controlsButton = new ButtonEntity(
      "CONTROLS",
      "#2c3e50",
      "white",
      (this.canvasWidth / 2) - 230,
      (this.canvasHeight / 2) + 90,
      120,
      45,
      this.inputSystem,
      handleControlsClick
    );
    sceneManager.addUIEntity(controlsButton);
    console.log("Added CONTROLS button");

    // Start Game button (centered, prominent)
    const startButton = new ButtonEntity(
      "START GAME",
      "#16a085",
      "white",
      (this.canvasWidth / 2) - 100,
      (this.canvasHeight / 2) + 25,
      200,
      50,
      this.inputSystem,
      handleStartGameClick
    );
    sceneManager.addUIEntity(startButton);
    console.log("Added START GAME button at:", (this.canvasWidth / 2) - 100, (this.canvasHeight / 2) + 25);

    // Add background renderer LAST (it will be drawn FIRST, underneath buttons)
    const screenRenderer = new StartScreenRender();
    sceneManager.addUIEntity(screenRenderer);
    console.log("Added background renderer");
    console.log("Total entities added: 4 (3 buttons + background)");
  }

  private renderControlsScreen(sceneManager: SceneManager): void {
    console.log("renderControlsScreen called");
    // Clear ALL entities including UI
    this.clearUI(sceneManager);

    const handleBackClick = () => {
      console.log("BACK clicked from controls!");
      this.currentScreen = "main";
      this.renderMainMenu(sceneManager);
    };

    // Add BACK button FIRST (drawn last, on top)
    sceneManager.addUIEntity(new ButtonEntity(
      "BACK",
      "#c0392b",
      "white",
      (this.canvasWidth / 2) - 75,
      this.canvasHeight - 100,
      150,
      50,
      this.inputSystem,
      handleBackClick
    ));

    // Add controls screen renderer LAST (drawn first, underneath)
    sceneManager.addUIEntity(new ControlsScreenRender());
  }

  private renderLoreScreen(sceneManager: SceneManager): void {
    console.log("renderLoreScreen called");
    // Clear ALL entities including UI
    this.clearUI(sceneManager);

    const handleBackClick = () => {
      console.log("BACK clicked from lore!");
      this.currentScreen = "main";
      this.renderMainMenu(sceneManager);
    };

    // Add BACK button FIRST (drawn last, on top)
    sceneManager.addUIEntity(new ButtonEntity(
      "BACK",
      "#c0392b",
      "white",
      (this.canvasWidth / 2) - 75,
      this.canvasHeight - 100,
      150,
      50,
      this.inputSystem,
      handleBackClick
    ));

    // Add lore screen renderer LAST (drawn first, underneath)
    sceneManager.addUIEntity(new LoreScreenRender());
  }

  onResume(sceneManager: SceneManager): void {
    console.log("StartScreenScene onResume called");
    this.sceneManager = sceneManager;
    // If resuming, show main menu
    this.renderMainMenu(sceneManager);
  }

  onExit(): void {
    console.log("StartScreenScene onExit called");
    // Clean up when leaving start screen
    if (this.sceneManager) {
      this.clearUI(this.sceneManager);
    }
  }

  update(context: GameContext): void {}

  draw(context: GameContext): void {}
  
}

/**
 * Renderer for the controls/information screen
 */
class ControlsScreenRender extends Entity {
  constructor() {
    super();
    super.setRenderer(new ControlsRenderer());
  }
}

class ControlsRenderer implements IRenderer {
  draw(context: GameContext): void {
    const ctx = context.ctx;
    ctx.save();

    // Background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Title
    ctx.fillStyle = "#eee";
    ctx.textAlign = "center";
    ctx.font = "bold 48px Arial";
    ctx.fillText("CONTROLS & GAMEPLAY", ctx.canvas.width / 2, 80);

    // Controls list
    ctx.font = "24px Arial";
    ctx.fillStyle = "#aaa";
    ctx.textAlign = "left";
    
    const controls = [
      "MOVEMENT:",
      "  WASD - Move your character in 8 directions",
      "",
      "ACTIONS:",
      "  E - Interact",
      "",
      "OBJECTIVE:",
      "Collect the items shown in the order list",
      "from the shelves around the store.",
      "Deliver them to the customer at the",
      "delivery zone before time runs out!",
      "",
      "Watch out for monsters roaming the aisles!"
    ];

    let yPos = 160;
    controls.forEach(line => {
      if (line === "") {
        yPos += 15;
      } else if (line.includes(":") && !line.startsWith("  ")) {
        // Section headers
        ctx.fillStyle = "#16a085";
        ctx.font = "bold 28px Arial";
        ctx.fillText(line, ctx.canvas.width / 2 - 250, yPos);
        ctx.fillStyle = "#aaa";
        ctx.font = "24px Arial";
        yPos += 45;
      } else {
        ctx.fillText(line, ctx.canvas.width / 2 - 250, yPos);
        yPos += 35;
      }
    });

    ctx.restore();
  }
}

/**
 * Renderer for the lore/story screen
 */
class LoreScreenRender extends Entity {
  constructor() {
    super();
    super.setRenderer(new LoreRenderer());
  }
}

class LoreRenderer implements IRenderer {
  draw(context: GameContext): void {
    const ctx = context.ctx;
    ctx.save();

    // Background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Title
    ctx.fillStyle = "#eee";
    ctx.textAlign = "center";
    ctx.font = "bold 48px Arial";
    ctx.fillText("THE STORY", ctx.canvas.width / 2, 80);

    // Lore text
    ctx.font = "22px Arial";
    ctx.fillStyle = "#ccc";
    ctx.textAlign = "left";
    
    const loreLines = [
      ""
    ];

    let yPos = 160;
    const lineHeight = 32;
    const leftMargin = ctx.canvas.width / 2 - 300;

    loreLines.forEach(line => {
      if (line === "") {
        yPos += lineHeight * 0.6;
      } else {
        ctx.fillText(line, leftMargin, yPos);
        yPos += lineHeight;
      }
    });

    ctx.restore();
  }
}