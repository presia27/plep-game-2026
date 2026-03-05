import { XY } from "../../typeinterfaces.ts";
import { ItemType } from "../ordermanagement/itemTypes.ts";

/** Describes a single shelf's position and which sprite to use */
export interface ShelfData {
  position: XY;
  spriteId: string;
  shelfNum: number;
}

/** Describes a door trigger's position, size, and which scene it leads to */
export interface DoorData {
  position: XY;
  size: XY;
  targetSceneId: string;
}

export interface roomData {
  sceneId: string;
  bloodLocations: XY[];
  defaultSpawn: XY;
  monsterSpawns: XY[];
  updatePoints: XY[]; // locations where monster direction can be updated
  shelves: ShelfData[];
  doors: DoorData[];
  allowedItems: ItemType[];
  deliveryEntityPosition?: XY;
}

export const PharmaRoom: roomData = {
  sceneId: "pharma",
  bloodLocations: [
    { x: 250, y: 50 },
    { x: 690, y: 350 },
    { x: 1000, y: 200 },
    { x: 450, y: 500 },
  ],
  defaultSpawn: { x: 50, y: 50 },
  monsterSpawns: [ {x: 900, y: 600}, {x: 575, y: 300} ],
  updatePoints: [ {x: 150, y: 300}, {x: 400, y: 300}, {x: 900, y: 300}, {x: 900, y: 600} ],
  shelves: [
    { position: { x: 150, y: 150 }, spriteId: "AllHShelves", shelfNum: 4 },
    { position: { x: 450, y: 150 }, spriteId: "AllHShelves", shelfNum: 2 },
    { position: { x: 750, y: 150 }, spriteId: "AllHShelves", shelfNum: 8 },
    { position: { x: 150, y: 500 }, spriteId: "AllHShelves", shelfNum: 6 },
    { position: { x: 450, y: 500 }, spriteId: "AllHShelves", shelfNum: 3 },
    { position: { x: 750, y: 500 }, spriteId: "AllHShelves", shelfNum: 1 }
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
    ItemType.PILL,
    ItemType.BANDAID,
    ItemType.MEDICINE,
    ItemType.BOW,
    ItemType.HEADBAND,
    ItemType.FIRSTAID,
    ItemType.TOOTHBRUSH,
    ItemType.MIRROR,
    ItemType.NAILPOLISH,
    ItemType.NAILCLIPPERS,
    ItemType.FLOSS,
    ItemType.TOOTHPASTE,
    ItemType.RAZOR,
    ItemType.SOAP,
    ItemType.QTIP,
    ItemType.SHAMPOO,
    ItemType.LOTION,
    ItemType.MOISTURIZER
  ]
}

export const CleaningRoom: roomData = {
  sceneId: "cleaning",
  bloodLocations: [
    { x: 250, y: 50 },
    { x: 690, y: 350 },
    { x: 1000, y: 200 },
    { x: 450, y: 500 },
  ],
  defaultSpawn: { x: 50, y: 300 },
  monsterSpawns: [ {x: 900, y: 600}, {x: 575, y: 300} ],
  updatePoints: [ {x: 150, y: 300}, {x: 400, y: 300}, {x: 900, y: 300}, {x: 900, y: 600} ],
  shelves: [
    { position: { x: 200, y: 150 }, spriteId: "AllHShelves", shelfNum: 1 },
    { position: { x: 650, y: 150 }, spriteId: "AllHShelves", shelfNum: 4 },
    { position: { x: 200, y: 400 }, spriteId: "AllHShelves", shelfNum: 5 },
    { position: { x: 650, y: 400 }, spriteId: "AllHShelves", shelfNum: 8 },
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
    ItemType.TOILETPAPER,
    ItemType.TISSUES,
    ItemType.PAPERTOWEL,
    ItemType.SPRAY,
    ItemType.SPONGE,
    ItemType.MOP,
    ItemType.DUSTER,
    ItemType.VACUUM,
    ItemType.DUSTPAN,
    ItemType.CLEANER,
    ItemType.BUCKET,
    ItemType.DETERGENT,
  ]
}

export const FoodRoom: roomData = {
  sceneId: "food",
  bloodLocations: [
    { x: 250, y: 50 },
    { x: 690, y: 350 },
    { x: 1000, y: 200 },
    { x: 450, y: 500 },
  ],
  defaultSpawn: { x: 350, y: 50 },
  monsterSpawns: [ {x: 900, y: 600}, {x: 575, y: 300} ],
  updatePoints: [ {x: 150, y: 300}, {x: 400, y: 300}, {x: 900, y: 300}, {x: 900, y: 600} ],
  shelves: [
    { position: { x: 100, y: 200 }, spriteId: "AllHShelves", shelfNum: 2 },
    { position: { x: 650, y: 200 }, spriteId: "AllHShelves", shelfNum: 3 },
    { position: { x: 650, y: 450 }, spriteId: "AllHShelves", shelfNum: 7 },
    { position: { x: 100, y: 450 }, spriteId: "AllHShelves", shelfNum: 6 },
  ],
  doors: [
    { 
      position: { x: 350, y: 10 }, 
      size: { x: 80, y: 20 }, 
      targetSceneId: "cleaning" 
    }
  ],
  allowedItems: [
    ItemType.STRAWBERRY,
    ItemType.BANANA,
    ItemType.APPLE,
    ItemType.BROCCOLI,
    ItemType.STEAK,
    ItemType.FISH,
    ItemType.CHEESE,
    ItemType.MILK,
    ItemType.BUTTER,
    ItemType.CHIPS,
    ItemType.COOKIES,
    ItemType.SODA,
    ItemType.PASTA,
    ItemType.BREAD,
    ItemType.PIZZA,
    ItemType.ICECREAM
  ]
}
export const DeliveryRoom: roomData = {
  sceneId: "delivery",
  bloodLocations: [],
  defaultSpawn: { x: 350, y: 50 },
  monsterSpawns: [],
  updatePoints: [],
  shelves: [
   // { position: { x: 100, y: 200 }, spriteId: "HShelvesVines" }
  ],
  doors: [
    { 
      position: { x: 350, y: 10 }, 
      size: { x: 80, y: 20 }, 
      targetSceneId: "pharma" 
    }
  ],
  allowedItems: [],
  
  deliveryEntityPosition: { x: 50, y: 300 }
}

// housing allowed items
/*
allowedItems: [
    ItemType.LAMP,
    ItemType.CHAIR,
    ItemType.PILLOW,
    ItemType.FLOORMIRROR,
    ItemType.PLANT,
    ItemType.PAINTING,
    ItemType.CANDLE,
    ItemType.SPOON,
    ItemType.FORK,
    ItemType.KNIFE
  ]
*/

// electronics allowed items
/*
allowedItems: [
    ItemType.MOUSE,
    ItemType.LAPTOP,
    ItemType.MONITOR,
    ItemType.TV,
    ItemType.HEADPHONES,
    ItemType.CONTROLLER,
    ItemType.SPEAKER,
    ItemType.MICROPHONE,
    ItemType.PHONE
  ]
*/
