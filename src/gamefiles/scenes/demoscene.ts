// import GameEngine from "../../gameengine.ts";
// import { XY } from "../../typeinterfaces.ts";
// import { BaseRoomScene } from "./baseRoomScene.ts";

// /**
//  * A complete level with three interconnected rooms:
//  * - Main Store Floor (DemoScene)
//  * - Back Storage Room
//  * - Cold Storage Room
//  *
//  * Each room is connected by doors. Walking through a door
//  * transitions to the next room while preserving state.
//  *
//  * @author Luke
//  */

// // -------------------------------------------------------
// // MAIN STORE FLOOR (converted from your original DemoScene)
// // -------------------------------------------------------
// export class DemoScene extends BaseRoomScene {
//   constructor(game: GameEngine) {
//     super(game);
//   }

//   protected getPlayerSpawnPoint(): XY {
//     return { x: 50, y: 50 };
//   }

//   protected getShelfPositions() {
//     return [
//       { position: { x: 150, y: 150 }, spriteId: "HShelvesNoVines" },
//       { position: { x: 350, y: 150 }, spriteId: "HShelvesNoVines" },
//       { position: { x: 550, y: 150 }, spriteId: "HShelvesNoVines" },
//       { position: { x: 150, y: 500 }, spriteId: "HShelvesNoVines" },
//       { position: { x: 350, y: 500 }, spriteId: "HShelvesNoVines" },
//       { position: { x: 550, y: 500 }, spriteId: "HShelvesNoVines" }
//     ];
//   }

//   protected getDoorTriggers() {
//     return [
//       // Door on the right wall leading to back storage
//       { 
//         position: { x: 740, y: 300 }, 
//         size: { x: 20, y: 80 }, 
//         targetSceneId: "backStorage" 
//       }
//     ];
//   }
// }

// // -------------------------------------------------------
// // BACK STORAGE ROOM
// // -------------------------------------------------------
// export class BackStorageScene extends BaseRoomScene {
//   constructor(game: GameEngine) {
//     super(game);
//   }

//   protected getPlayerSpawnPoint(): XY {
//     // Player enters from the left, so spawn on the left side
//     return { x: 50, y: 300 };
//   }

//   protected getShelfPositions() {
//     return [
//       { position: { x: 200, y: 150 }, spriteId: "HShelvesVines" },
//       { position: { x: 400, y: 150 }, spriteId: "HShelvesVines" },
//       { position: { x: 200, y: 400 }, spriteId: "HShelvesNoVines" },
//       { position: { x: 400, y: 400 }, spriteId: "HShelvesNoVines" },
//     ];
//   }

//   protected getDoorTriggers() {
//     return [
//       // Door on left wall - back to main floor
//       { 
//         position: { x: 10, y: 300 }, 
//         size: { x: 20, y: 80 }, 
//         targetSceneId: "demo" 
//       },
//       // Door on bottom wall - to cold storage
//       { 
//         position: { x: 350, y: 580 }, 
//         size: { x: 80, y: 20 }, 
//         targetSceneId: "coldStorage" 
//       }
//     ];
//   }
// }

// // -------------------------------------------------------
// // COLD STORAGE ROOM
// // -------------------------------------------------------
// export class ColdStorageScene extends BaseRoomScene {
//   constructor(game: GameEngine) {
//     super(game);
//   }

//   protected getPlayerSpawnPoint(): XY {
//     // Player enters from the top, so spawn at the top
//     return { x: 350, y: 50 };
//   }

//   protected getShelfPositions() {
//     // Lots of shelves in the cold storage!
//     return [
//       { position: { x: 100, y: 200 }, spriteId: "HShelvesVines" },
//       { position: { x: 300, y: 200 }, spriteId: "HShelvesVines" },
//       { position: { x: 500, y: 200 }, spriteId: "HShelvesVines" },
//       { position: { x: 100, y: 350 }, spriteId: "HShelvesNoVines" },
//       { position: { x: 300, y: 350 }, spriteId: "HShelvesNoVines" },
//       { position: { x: 500, y: 350 }, spriteId: "HShelvesNoVines" },
//       { position: { x: 100, y: 500 }, spriteId: "HShelvesVines" },
//       { position: { x: 300, y: 500 }, spriteId: "HShelvesVines" },
//       { position: { x: 500, y: 500 }, spriteId: "HShelvesVines" },
//     ];
//   }

//   protected getDoorTriggers() {
//     return [
//       // Door on top wall - back to back storage
//       { 
//         position: { x: 350, y: 10 }, 
//         size: { x: 80, y: 20 }, 
//         targetSceneId: "backStorage" 
//       }
//     ];
//   }
// }