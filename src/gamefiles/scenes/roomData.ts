import { XY } from "../../typeinterfaces.ts";

/** Describes a single shelf's position and which sprite to use */
export interface ShelfData {
  position: XY;
  spriteId: string;
}

/** Describes a door trigger's position, size, and which scene it leads to */
export interface DoorData {
  position: XY;
  size: XY;
  targetSceneId: string;
}

export interface roomData {
  sceneId: string;
  defaultSpawn: XY;
  shelves: ShelfData[];
  doors: DoorData[];
}

export const PharmaRoom: roomData = {
  sceneId: "pharma",
  defaultSpawn: { x: 50, y: 50 },
  shelves: [
    { position: { x: 150, y: 150 }, spriteId: "HShelvesNoVines" },
    { position: { x: 350, y: 150 }, spriteId: "HShelvesVines" },
    { position: { x: 550, y: 150 }, spriteId: "HShelvesNoVines" },
    { position: { x: 150, y: 500 }, spriteId: "HShelvesNoVines" },
    { position: { x: 350, y: 500 }, spriteId: "HShelvesNoVines" },
    { position: { x: 550, y: 500 }, spriteId: "HShelvesNoVines" }
  ],
  doors: [
    {
      position: { x: 740, y: 300 }, 
      size: { x: 20, y: 80 }, 
      targetSceneId: "cleaning" 
    }
  ]
}

export const CleaningRoom: roomData = {
  sceneId: "cleaning",
  defaultSpawn: { x: 50, y: 300 },
  shelves: [
    { position: { x: 200, y: 150 }, spriteId: "HShelvesVines" },
    { position: { x: 400, y: 150 }, spriteId: "HShelvesVines" },
    { position: { x: 200, y: 400 }, spriteId: "HShelvesNoVines" },
    { position: { x: 400, y: 400 }, spriteId: "HShelvesNoVines" },
  ],
  doors: [
    { 
      position: { x: 10, y: 300 }, 
      size: { x: 20, y: 80 }, 
      targetSceneId: "pharma" 
    },
    { 
      position: { x: 350, y: 580 }, 
      size: { x: 80, y: 20 }, 
      targetSceneId: "food" 
    }
  ]
}

export const FoodRoom: roomData = {
  sceneId: "food",
  defaultSpawn: { x: 350, y: 50 },
  shelves: [
    { position: { x: 100, y: 200 }, spriteId: "HShelvesVines" },
    { position: { x: 300, y: 200 }, spriteId: "HShelvesVines" },
    { position: { x: 500, y: 200 }, spriteId: "HShelvesVines" },
    { position: { x: 100, y: 350 }, spriteId: "HShelvesNoVines" },
    { position: { x: 300, y: 350 }, spriteId: "HShelvesNoVines" },
    { position: { x: 500, y: 350 }, spriteId: "HShelvesNoVines" },
    { position: { x: 100, y: 500 }, spriteId: "HShelvesVines" },
    { position: { x: 300, y: 500 }, spriteId: "HShelvesVines" },
    { position: { x: 500, y: 500 }, spriteId: "HShelvesVines" },
  ],
  doors: [
    { 
      position: { x: 350, y: 10 }, 
      size: { x: 80, y: 20 }, 
      targetSceneId: "cleaning" 
    }
  ]
}