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
  defaultSpawn: XY;
  shelves: ShelfData[];
  doors: DoorData[];
}

export const PharmaRoom: roomData = {
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
      targetSceneId: "backStorage" 
    }
  ]
}