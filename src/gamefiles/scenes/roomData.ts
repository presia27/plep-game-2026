import { XY } from "../../typeinterfaces.ts";
import { ItemType } from "../ordermanagement/itemTypes.ts";

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
  allowedItems: ItemType[];
}

export const PharmaRoom: roomData = {
  sceneId: "pharma",
  defaultSpawn: { x: 50, y: 50 },
  shelves: [
    { position: { x: 150, y: 150 }, spriteId: "HShelvesNoVines" },
    { position: { x: 450, y: 150 }, spriteId: "HShelvesVines" },
    { position: { x: 750, y: 150 }, spriteId: "HShelvesNoVines" },
    { position: { x: 150, y: 500 }, spriteId: "HShelvesVines" },
    { position: { x: 450, y: 500 }, spriteId: "HShelvesNoVines" },
    { position: { x: 750, y: 500 }, spriteId: "HShelvesNoVines" }
  ],
  doors: [
    {
      position: { x: 1200, y: 300 }, 
      size: { x: 20, y: 200 }, 
      targetSceneId: "cleaning" 
    },
    {
      position: { x: 10 , y: 300 },
      size: { x: 20 , y: 200},
      targetSceneId: "delivery"
    }
  ],
  allowedItems: [
    ItemType.TOILETPAPER,
    ItemType.TISSUES,
    ItemType.PAPERTOWEL
  ]
}

export const CleaningRoom: roomData = {
  sceneId: "cleaning",
  defaultSpawn: { x: 50, y: 300 },
  shelves: [
    { position: { x: 200, y: 150 }, spriteId: "HShelvesVines" },
    { position: { x: 650, y: 150 }, spriteId: "HShelvesNoVines" },
    { position: { x: 200, y: 400 }, spriteId: "HShelvesNoVines" },
    { position: { x: 650, y: 400 }, spriteId: "HShelvesVines" },
  ],
  doors: [
    { 
      position: { x: 10, y: 300 }, 
      size: { x: 20, y: 200 }, 
      targetSceneId: "pharma" 
    },
    { 
      position: { x: 1200, y: 300 }, 
      size: { x: 20, y: 200 }, 
      targetSceneId: "food" 
    }
  ],
  allowedItems: [
    ItemType.SPRAY,
    ItemType.SPONGE,
    ItemType.MOP
  ]
}

export const FoodRoom: roomData = {
  sceneId: "food",
  defaultSpawn: { x: 350, y: 50 },
  shelves: [
    { position: { x: 100, y: 200 }, spriteId: "HShelvesVines" },
    { position: { x: 650, y: 200 }, spriteId: "HShelvesVines" },
    { position: { x: 650, y: 450 }, spriteId: "HShelvesVines" },
    { position: { x: 100, y: 450 }, spriteId: "HShelvesNoVines" },
  ],
  doors: [
    { 
      position: { x: 350, y: 10 }, 
      size: { x: 80, y: 20 }, 
      targetSceneId: "cleaning" 
    }
  ],
  allowedItems: [
    ItemType.DUSTER,
    ItemType.VACUUM,
    ItemType.DUSTPAN
  ]
}
export const DeliveryRoom: roomData = {
  sceneId: "delivery",
  defaultSpawn: { x: 350, y: 50 },
  shelves: [
    { position: { x: 100, y: 200 }, spriteId: "HShelvesVines" },
    { position: { x: 650, y: 200 }, spriteId: "HShelvesVines" },
    { position: { x: 650, y: 450 }, spriteId: "HShelvesVines" },
    { position: { x: 100, y: 450 }, spriteId: "HShelvesNoVines" },
  ],
  doors: [
    { 
      position: { x: 350, y: 10 }, 
      size: { x: 80, y: 20 }, 
      targetSceneId: "pharma" 
    }
  ],
  allowedItems: [
  ]
}