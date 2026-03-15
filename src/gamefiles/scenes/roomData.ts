import { ISize } from "../../classinterfaces";
import { BasicSize } from "../../componentLibrary/BasicSize.ts";
import { XY } from "../../typeinterfaces.ts";
import { ItemType } from "../ordermanagement/itemTypes.ts";

const DOOR_VERTICAL_LENGTH: number = 200;
const DOOR_HORIZONTAL_LENGTH: number = 200;
const DOOR_THICKNESS: number = 20;

/** Describes a single shelf's position and which sprite to use */
export interface ShelfData {
  position: XY;
  spriteId: string;
  shelfNum: number;
}

/**
 * Directions for doors (derived from sprite design: right=0, down=1, left=2, up=3)
 */
export enum DoorDirection {
  RIGHT = 0,
  DOWN = 1,
  LEFT = 2,
  UP = 3
}

/** 
 * Describes a door trigger's position, size, and which scene it leads to
 */
export interface DoorData {
  position: XY;
  size: XY;
  targetSceneId: string;
  direction: DoorDirection;
}

/**
 * Locations for wall sprites
 */
export enum WallSpriteDirection {
  LEFT = 0,
  RIGHT = 1,
  TOP1 = 2, // 3 diff sprite starting points will be used for the top wall to get diff textures
  TOP2 = 3,
  TOP3 = 4,
  BOTTOM = 5
}

/**
 * Corner sprite types for corner sprites
 */
export enum CornerSpriteType {
  TL = 0,
  TR = 1,
  //BL = 2, // never used
  BR = 2
}

/** 
 * Describes a wall sprite's location and which wall it applies to
 */
export interface WallSpriteData {
  direction: WallSpriteDirection;
  position: XY; // position to be drawn
  size: BasicSize; // destination dimensions
  cornerType?: CornerSpriteType;
  cornerPos?: XY;
}

/**
 * Flickering lights for the store floor
 */
export interface FlickerLightConfig {
  position: XY;
  width: number;       // width of the light pool on the floor
  height: number;      // height of the light pool on the floor
  color: string;       // e.g. "#ffffcc" for warm fluorescent
  minAlpha: number;    // e.g. 0.03
  maxAlpha: number;    // e.g. 0.12
  flickerSpeed: number; // how fast it cycles, e.g. 3.0
}

export interface roomData {
  sceneId: string;
  roomWidth: number;
  roomHeight: number;
  spawnPoints: XY[];
  bloodLocations: XY[];
  monsterSpawns: XY[];
  updatePoints: XY[]; // locations where monster direction can be updated
  shelves: ShelfData[];
  doors: DoorData[];
  allowedItems: ItemType[];
  deliveryEntityPosition?: XY;
  isParkingLot?: boolean;
  isCheckout?: boolean;
  wallSprites: WallSpriteData[];
  lightConfig: FlickerLightConfig[];
}

export const DeliveryRoom: roomData = {
  sceneId: "DELIVERY",
  roomWidth: 1280,
  roomHeight: 720,
  bloodLocations: [],
  spawnPoints: [
    { x: 540, y: 30 },   // from checkout
  ],
  monsterSpawns: [],
  updatePoints: [],
  shelves: [
  ],
  doors: [
    {
      position: { x: 540, y: 20 },
      size: { x: DOOR_HORIZONTAL_LENGTH, y: DOOR_THICKNESS },
      targetSceneId: "CHECKOUT",
      direction: DoorDirection.UP
    }
  ],
  allowedItems: [],
  deliveryEntityPosition: { x: 500, y: 200 },
  isParkingLot: true,
  wallSprites: [],
  lightConfig: []
}

export const CheckoutRoom: roomData = {
  sceneId: "CHECKOUT",
  roomWidth: 1280,
  roomHeight: 720,
  bloodLocations: [
    { x: 50, y: 100 }, { x: 600, y: 200 }, { x: 1100, y: 50 },
    { x: 70, y: 330 }, { x: 350, y: 400 }, { x: 120, y: 510 },
    { x: 200, y: 40 }, { x: 900, y: 600 }, { x: 850,  y: 142 },
    { x: 900, y: 400 },
  ],
  spawnPoints: [
    { x: 540, y: 30 },   // from electronics
    { x: 1130, y: 270 }, // from pharmacy
    { x: 540, y: 570 },  // from delivery
    { x: 640, y: 360 }   // approximate center fo the room
  ],
  monsterSpawns: [],
  updatePoints: [],
  shelves: [],
  doors: [
    {
      position: { x: 540, y: 20 },
      size: { x: DOOR_HORIZONTAL_LENGTH, y: DOOR_THICKNESS },
      targetSceneId: "ELECTRONICS",
      direction: DoorDirection.UP
    },
    {
      position: { x: 1240, y: 260 },
      size: { x: DOOR_THICKNESS, y: DOOR_VERTICAL_LENGTH },
      targetSceneId: "PHARMACY",
      direction: DoorDirection.RIGHT
    },
    {
      position: { x: 540, y: 680 },
      size: { x: DOOR_HORIZONTAL_LENGTH, y: DOOR_THICKNESS },
      targetSceneId: "DELIVERY",
      direction: DoorDirection.DOWN
    },
  ],
  isCheckout: true,
  allowedItems: [],
  wallSprites: [{
    direction: WallSpriteDirection.LEFT,
    position: { x: 0, y: 0 },
    size: new BasicSize(5, 720, 4),
  }],
  lightConfig: [
    // Left column (x center ~170) — no shelves in checkout
    { position: { x: 80,  y: 55  }, width: 180, height: 80, color: "#fffde8", minAlpha: 0.04, maxAlpha: 0.13, flickerSpeed: 2.8 },
    { position: { x: 80,  y: 310 }, width: 180, height: 80, color: "#fffde8", minAlpha: 0.03, maxAlpha: 0.11, flickerSpeed: 4.2 },
    { position: { x: 80,  y: 545 }, width: 180, height: 80, color: "#fffde8", minAlpha: 0.04, maxAlpha: 0.12, flickerSpeed: 3.5 },
    // Center column (x center ~550)
    //{ position: { x: 520, y: 55  }, width: 180, height: 80, color: "#fffde8", minAlpha: 0.03, maxAlpha: 0.10, flickerSpeed: 5.1 },
    { position: { x: 540, y: 310 }, width: 180, height: 80, color: "#fffde8", minAlpha: 0.05, maxAlpha: 0.2, flickerSpeed: 2.3 },
    //{ position: { x: 520, y: 545 }, width: 180, height: 80, color: "#fffde8", minAlpha: 0.03, maxAlpha: 0.11, flickerSpeed: 3.9 },
    // Right column (x center ~1010)
    //{ position: { x: 980, y: 55  }, width: 180, height: 80, color: "#fffde8", minAlpha: 0.04, maxAlpha: 0.12, flickerSpeed: 3.3 },
    { position: { x: 980, y: 310 }, width: 180, height: 80, color: "#fffde8", minAlpha: 0.03, maxAlpha: 0.10, flickerSpeed: 4.8 },
    { position: { x: 980, y: 545 }, width: 180, height: 80, color: "#fffde8", minAlpha: 0.05, maxAlpha: 0.13, flickerSpeed: 2.6 },
  ]
}

export const PharmaRoom: roomData = {
  sceneId: "PHARMACY",
  roomWidth: 1280,
  roomHeight: 720,
  bloodLocations: [
    { x: 100, y: 50 }, { x: 430, y: 70 }, { x: 830, y: 20 },
    { x: 250, y: 300 }, { x: 690, y: 350 }, { x: 1000, y: 200 },
    { x: 450, y: 400 }, { x: 60, y: 500 }, { x: 1100, y: 485 },
  ],
  spawnPoints: [ // left, right, up
    { x: 540, y: 30 },   // from housing
    { x: 30, y: 270 },   // from checkout
    { x: 1130, y: 270 }, // from cleaning
  ],
  monsterSpawns: [
    { x: 1150, y: 280 }
  ],
  updatePoints: [ // 6 points for perimeter, 0 for in between shelves
    { x: 50, y: 40 }, { x: 1150, y: 40 },
    { x: 50, y: 280 }, { x: 1150, y: 280 },
    { x: 50, y: 600 }, { x: 1150, y: 600 }
  ],
  shelves: [
    { position: { x: 150, y: 150 }, spriteId: "AllHShelves", shelfNum: 4 },
    { position: { x: 450, y: 150 }, spriteId: "AllHShelves", shelfNum: 2 },
    { position: { x: 750, y: 150 }, spriteId: "AllHShelves", shelfNum: 8 },
    { position: { x: 150, y: 400 }, spriteId: "AllHShelves", shelfNum: 6 },
    { position: { x: 450, y: 400 }, spriteId: "AllHShelves", shelfNum: 3 },
    { position: { x: 750, y: 400 }, spriteId: "AllHShelves", shelfNum: 1 }
  ],
  doors: [
    {
      position: { x: 540, y: 20 },
      size: { x: DOOR_HORIZONTAL_LENGTH, y: DOOR_THICKNESS },
      targetSceneId: "HOUSING",
      direction: DoorDirection.UP
    },
    {
      position: { x: 20, y: 260 },
      size: { x: DOOR_THICKNESS, y: DOOR_VERTICAL_LENGTH },
      targetSceneId: "CHECKOUT",
      direction: DoorDirection.LEFT
    },
    {
      position: { x: 1240, y: 260 },
      size: { x: DOOR_THICKNESS, y: DOOR_VERTICAL_LENGTH },
      targetSceneId: "CLEANING",
      direction: DoorDirection.RIGHT
    },
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
  ],
  wallSprites: [{
    direction: WallSpriteDirection.BOTTOM,
    position: { x: 0, y: 700 },
    size: new BasicSize(1280, 5, 4)
  }],
  lightConfig: [
    // Left wall aisle (x center ~80, clear of all shelves starting x:150)
    { position: { x: -10, y: 55  }, width: 180, height: 80, color: "#fefee6", minAlpha: 0.04, maxAlpha: 0.13, flickerSpeed: 3.7 },
    { position: { x: -10, y: 310 }, width: 180, height: 80, color: "#fefee6", minAlpha: 0.03, maxAlpha: 0.11, flickerSpeed: 5.3 },
    { position: { x: -10, y: 575 }, width: 180, height: 80, color: "#fefee6", minAlpha: 0.04, maxAlpha: 0.12, flickerSpeed: 2.9 },
    // Between col1 (ends x:438) and col2 (starts x:450) — in row gaps only (gap too narrow for full column)
    { position: { x: 600, y: 55  }, width: 100, height: 70, color: "#fefee6", minAlpha: 0.03, maxAlpha: 0.10, flickerSpeed: 4.1 },
    //{ position: { x: 600, y: 310 }, width: 100, height: 70, color: "#fefee6", minAlpha: 0.04, maxAlpha: 0.12, flickerSpeed: 2.6 },
    // { position: { x: 600, y: 575 }, width: 100, height: 70, color: "#fefee6", minAlpha: 0.03, maxAlpha: 0.09, flickerSpeed: 5.8 },
    // Right wall aisle (x center ~1120, last shelf ends x:1038)
    { position: { x: 1060, y: 55  }, width: 180, height: 80, color: "#fefee6", minAlpha: 0.04, maxAlpha: 0.12, flickerSpeed: 3.2 },
    { position: { x: 1060, y: 310 }, width: 180, height: 80, color: "#fefee6", minAlpha: 0.03, maxAlpha: 0.10, flickerSpeed: 4.9 },
    { position: { x: 1060, y: 575 }, width: 180, height: 80, color: "#fefee6", minAlpha: 0.05, maxAlpha: 0.13, flickerSpeed: 2.4 },
  ]
}

/** Cleaning Section */
export const CleaningRoom: roomData = {
  sceneId: "CLEANING",
  roomWidth: 1280,
  roomHeight: 720,
  bloodLocations: [
    { x: 250, y: 50 },
    { x: 690, y: 350 },
    { x: 1000, y: 200 },
    { x: 450, y: 500 },
    { x: 60, y: 75 }, { x: 480, y: 220 }, { x: 970, y: 300 },
    { x: 1000, y: 560 }, { x: 92, y: 608 }, { x: 1000, y: 200 },
    { x: 725, y: 80 }, { x: 400, y: 570 }, { x: 720, y: 555 },
  ],
  spawnPoints: [ // left, top
    { x: 540, y: 30 },   // from food
    { x: 30, y: 260 },   // from pharmacy
  ],
  monsterSpawns: [
    { x: 600, y: 250 },
    { x: 1150, y: 600 }
  ],
  updatePoints: [ // 8 for perimeter, 0 for in between shelves
    { x: 50, y: 40 }, { x: 600, y: 40 }, { x: 1150, y: 40 },
    { x: 50, y: 280 }, { x: 1150, y: 280 },
    { x: 50, y: 600 }, { x: 600, y: 600 }, { x: 1150, y: 600 }
  ],
  shelves: [
    { position: { x: 200, y: 150 }, spriteId: "AllHShelves", shelfNum: 1 },
    { position: { x: 750, y: 150 }, spriteId: "AllHShelves", shelfNum: 4 },
    { position: { x: 200, y: 400 }, spriteId: "AllHShelves", shelfNum: 5 },
    { position: { x: 750, y: 400 }, spriteId: "AllHShelves", shelfNum: 8 },
  ],
  doors: [
    {
      position: { x: 540, y: 20 },
      size: { x: DOOR_HORIZONTAL_LENGTH, y: DOOR_THICKNESS },
      targetSceneId: "FOOD",
      direction: DoorDirection.UP
    },
    {
      position: { x: 20, y: 260 },
      size: { x: DOOR_THICKNESS, y: DOOR_VERTICAL_LENGTH },
      targetSceneId: "PHARMACY",
      direction: DoorDirection.LEFT
    },
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
  ],
  wallSprites: [{
    cornerType: CornerSpriteType.BR,
    cornerPos: { x: 1260, y: 700 },
    direction: WallSpriteDirection.BOTTOM,
    position: { x: -20, y: 700 },
    size: new BasicSize(1280, 5, 4)
  }, {
    direction: WallSpriteDirection.RIGHT,
    position: { x: 1260, y: -20 },
    size: new BasicSize(5, 720, 4)
  }],
  lightConfig: [
    // Left wall aisle (x center ~80)
    { position: { x: -10, y: 55  }, width: 180, height: 80, color: "#fffff0", minAlpha: 0.03, maxAlpha: 0.12, flickerSpeed: 4.4 },
    { position: { x: -10, y: 310 }, width: 180, height: 80, color: "#fffff0", minAlpha: 0.04, maxAlpha: 0.11, flickerSpeed: 2.7 },
    //{ position: { x: -10, y: 575 }, width: 180, height: 80, color: "#fffff0", minAlpha: 0.03, maxAlpha: 0.13, flickerSpeed: 5.0 },
    // Wide center aisle (x:438–750, center ~504)
    { position: { x: 600, y: 55  }, width: 180, height: 80, color: "#fffff0", minAlpha: 0.04, maxAlpha: 0.12, flickerSpeed: 3.1 },
    { position: { x: 600, y: 310 }, width: 180, height: 80, color: "#fffff0", minAlpha: 0.03, maxAlpha: 0.10, flickerSpeed: 4.6 },
    { position: { x: 600, y: 575 }, width: 180, height: 80, color: "#fffff0", minAlpha: 0.05, maxAlpha: 0.14, flickerSpeed: 2.2 },
    // Right wall aisle (x center ~1120, last shelf ends x:1038)
    //{ position: { x: 1060, y: 55  }, width: 180, height: 80, color: "#fffff0", minAlpha: 0.04, maxAlpha: 0.11, flickerSpeed: 3.8 },
    { position: { x: 1060, y: 310 }, width: 180, height: 80, color: "#fffff0", minAlpha: 0.03, maxAlpha: 0.12, flickerSpeed: 5.5 },
    //{ position: { x: 1060, y: 575 }, width: 180, height: 80, color: "#fffff0", minAlpha: 0.04, maxAlpha: 0.10, flickerSpeed: 2.9 },
  ]
}

/** Food Section */
export const FoodRoom: roomData = {
  sceneId: "FOOD",
  roomWidth: 1280,
  roomHeight: 720,
  bloodLocations: [
    { x: 500, y: 20 },
    { x: 300, y: 350 },
    { x: 850, y: 160 },
    { x: 450, y: 500 },
    { x: 700, y: 50 }, { x: 30, y: 70 }, { x: 830, y: 20 },
    { x: 300, y: 100 }, { x: 690, y: 350 }, { x: 1000, y: 200 },
    { x: 1100, y: 200 }, { x: 32, y: 500 }, { x: 1100, y: 485 },
    { x: 700, y: 300 },
    { x: 25, y: 400 },
    { x: 1000, y: 500 },
    { x: 600, y: 600 },
    { x: 300, y: 650 }
  ],
  spawnPoints: [ // bottom, left
    { x: 30, y: 270 },   // from housing
    { x: 540, y: 570 },  // from cleaning
  ],
  monsterSpawns: [
    { x: 1150, y: 40 },
    { x: 60, y: 280 },
    { x: 600, y: 280 }
  ],
  updatePoints: [ // 6 for perimeter, 0 for in between shelves
    { x: 50, y: 40 }, { x: 1150, y: 40 },
    { x: 50, y: 280 }, { x: 1150, y: 280 },
    { x: 50, y: 600 }, { x: 1150, y: 600 }
  ],
  shelves: [
    { position: { x: 150, y: 150 }, spriteId: "AllHShelves", shelfNum: 2 },
    { position: { x: 450, y: 150 }, spriteId: "AllHShelves", shelfNum: 1 },
    { position: { x: 750, y: 150 }, spriteId: "AllHShelves", shelfNum: 6 },
    { position: { x: 150, y: 400 }, spriteId: "AllHShelves", shelfNum: 7 },
    { position: { x: 450, y: 400 }, spriteId: "AllHShelves", shelfNum: 4 },
    { position: { x: 750, y: 400 }, spriteId: "AllHShelves", shelfNum: 3 }
  ],
  doors: [
    {
      position: { x: 20, y: 260 },
      size: { x: DOOR_THICKNESS, y: DOOR_VERTICAL_LENGTH },
      targetSceneId: "HOUSING",
      direction: DoorDirection.LEFT
    },
    {
      position: { x: 540, y: 680 },
      size: { x: DOOR_HORIZONTAL_LENGTH, y: DOOR_THICKNESS },
      targetSceneId: "CLEANING",
      direction: DoorDirection.DOWN
    },
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
  ],
  wallSprites: [{
    direction: WallSpriteDirection.RIGHT,
    position: { x: 1260, y: 20 },
    size: new BasicSize(5, 720, 4)
  }, {
    cornerType: CornerSpriteType.TR,
    cornerPos: { x: 1260, y: 0 },
    direction: WallSpriteDirection.TOP3,
    position: { x: 0, y: 0 },
    size: new BasicSize(1280, 20, 4)
  }],
  lightConfig: [
    // Left wall aisle (x center ~80)
    { position: { x: -10, y: 55  }, width: 180, height: 80, color: "#fdfff0", minAlpha: 0.04, maxAlpha: 0.12, flickerSpeed: 2.9 },
    { position: { x: -10, y: 310 }, width: 180, height: 80, color: "#fdfff0", minAlpha: 0.03, maxAlpha: 0.10, flickerSpeed: 4.5 },
    { position: { x: -10, y: 575 }, width: 180, height: 80, color: "#fdfff0", minAlpha: 0.05, maxAlpha: 0.13, flickerSpeed: 3.3 },
    // Narrow aisle between col1 and col2 (center ~444, narrow — small ovals)
    { position: { x: 650, y: 65  }, width: 100, height: 65, color: "#fdfff0", minAlpha: 0.03, maxAlpha: 0.09, flickerSpeed: 5.2 },
    { position: { x: 650, y: 320 }, width: 100, height: 65, color: "#fdfff0", minAlpha: 0.04, maxAlpha: 0.11, flickerSpeed: 2.4 },
    { position: { x: 650, y: 585 }, width: 100, height: 65, color: "#fdfff0", minAlpha: 0.03, maxAlpha: 0.10, flickerSpeed: 4.0 },
    // Right wall aisle (x center ~1120)
    { position: { x: 1060, y: 55  }, width: 180, height: 80, color: "#fdfff0", minAlpha: 0.04, maxAlpha: 0.13, flickerSpeed: 3.6 },
    { position: { x: 1060, y: 310 }, width: 180, height: 80, color: "#fdfff0", minAlpha: 0.03, maxAlpha: 0.11, flickerSpeed: 4.7 },
    { position: { x: 1060, y: 575 }, width: 180, height: 80, color: "#fdfff0", minAlpha: 0.04, maxAlpha: 0.12, flickerSpeed: 2.1 },
  ]
}

export const HousingRoom: roomData = {
  sceneId: "HOUSING",
  roomWidth: 1280,
  roomHeight: 720,
  spawnPoints: [
    { x: 30, y: 270 },   // from electronics
    { x: 1130, y: 270 }, // from food
    { x: 540, y: 570 },  // from pharmacy
  ],
  bloodLocations: [
    { x: 500, y: 20 },
    { x: 300, y: 350 },
    { x: 850, y: 160 },
    { x: 450, y: 500 },
    { x: 820, y: 50 }, { x: 30, y: 70 }, { x: 830, y: 20 },
    { x: 320, y: 110 }, { x: 690, y: 210 }, { x: 999, y: 800 },
    { x: 20, y: 270 }, { x: 312, y: 700 }, { x: 1100, y: 485 },
    { x: 1040, y: 130 },
    { x: 123, y: 400 },
    { x: 890, y: 500 },
    { x: 218, y: 600 },
    { x: 430, y: 650 },
  ],
  monsterSpawns: [
    { x: 1100, y: 280 }, { x: 60, y: 600 }, { x: 1100, y: 50 }
  ],
  updatePoints: [
    { x: 50, y: 40 }, { x: 600, y: 40 }, { x: 1200, y: 40 },
    { x: 50, y: 280 }, { x: 1200, y: 280 },
    { x: 50, y: 600 }, { x: 600, y: 600 }, { x: 1200, y: 600 }
  ],
  shelves: [
    { position: { x: 200, y: 150 }, spriteId: "AllHShelves", shelfNum: 3 },
    { position: { x: 750, y: 150 }, spriteId: "AllHShelves", shelfNum: 8 },
    { position: { x: 200, y: 400 }, spriteId: "AllHShelves", shelfNum: 2 },
    { position: { x: 750, y: 400 }, spriteId: "AllHShelves", shelfNum: 7 },
  ],
  doors: [
    {
      position: { x: 20, y: 260 },
      size: { x: DOOR_THICKNESS, y: DOOR_VERTICAL_LENGTH },
      targetSceneId: "ELECTRONICS",
      direction: DoorDirection.LEFT
    },
    {
      position: { x: 1240, y: 260 },
      size: { x: DOOR_THICKNESS, y: DOOR_VERTICAL_LENGTH },
      targetSceneId: "FOOD",
      direction: DoorDirection.RIGHT
    },
    {
      position: { x: 540, y: 680 },
      size: { x: DOOR_HORIZONTAL_LENGTH, y: DOOR_THICKNESS },
      targetSceneId: "PHARMACY",
      direction: DoorDirection.DOWN
    }
  ],
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
  ],
  wallSprites: [{
    direction: WallSpriteDirection.TOP2,
    position: { x: 0, y: 0 },
    size: new BasicSize(1280, 20, 4)
  }],
  lightConfig: [
    // Left wall aisle (x center ~80)
    //{ position: { x: -10, y: 55  }, width: 180, height: 80, color: "#fff8e8", minAlpha: 0.03, maxAlpha: 0.11, flickerSpeed: 3.4 },
    { position: { x: -10, y: 310 }, width: 180, height: 80, color: "#fff8e8", minAlpha: 0.04, maxAlpha: 0.13, flickerSpeed: 5.6 },
    { position: { x: -10, y: 575 }, width: 180, height: 80, color: "#fff8e8", minAlpha: 0.03, maxAlpha: 0.10, flickerSpeed: 2.7 },
    // Wide center aisle (x:438–750, center ~504)
    { position: { x: 525, y: 65 }, width: 180, height: 80, color: "#fff8e8", minAlpha: 0.04, maxAlpha: 0.12, flickerSpeed: 4.3 },
    { position: { x: 525, y: 310 }, width: 180, height: 80, color: "#fff8e8", minAlpha: 0.03, maxAlpha: 0.10, flickerSpeed: 2.5 },
    { position: { x: 525, y: 575 }, width: 180, height: 80, color: "#fff8e8", minAlpha: 0.05, maxAlpha: 0.14, flickerSpeed: 5.1 },
    // Right wall aisle (x center ~1120)
    //{ position: { x: 1060, y: 55  }, width: 180, height: 80, color: "#fff8e8", minAlpha: 0.04, maxAlpha: 0.11, flickerSpeed: 3.9 },
    { position: { x: 1060, y: 310 }, width: 180, height: 80, color: "#fff8e8", minAlpha: 0.03, maxAlpha: 0.12, flickerSpeed: 4.4 },
    { position: { x: 1060, y: 575 }, width: 180, height: 80, color: "#fff8e8", minAlpha: 0.04, maxAlpha: 0.13, flickerSpeed: 2.8 },
  ]
}

export const ElectronicsRoom: roomData = {
  sceneId: "ELECTRONICS",
  roomWidth: 1280,
  roomHeight: 720,
  spawnPoints: [
    { x: 1130, y: 270 }, // from housing
    { x: 540, y: 570 },  // from checkout
  ],
  bloodLocations: [
    { x: 500, y: 20 },
    { x: 300, y: 350 },
    { x: 80, y: 160 },
    { x: 450, y: 500 },
    { x: 1040, y: 102 }, { x: 430, y: 70 }, { x: 830, y: 20 },
    { x: 729, y: 60 }, { x: 690, y: 654 }, { x: 1000, y: 240 },
    { x: 740, y: 390 }, { x: 60, y: 500 }, { x: 1100, y: 485 },
  ],
  monsterSpawns: [
    { x: 60, y: 50 }, { x: 1100, y: 600 }, { x: 60, y: 600 }
  ],
  updatePoints: [
    { x: 50, y: 40 }, { x: 1200, y: 40 },
    { x: 50, y: 600 }, { x: 1200, y: 600 }
  ],
  shelves: [
    { position: { x: 150, y: 250 }, spriteId: "AllHShelves", shelfNum: 8 },
    { position: { x: 450, y: 250 }, spriteId: "AllHShelves", shelfNum: 7 },
    { position: { x: 750, y: 250 }, spriteId: "AllHShelves", shelfNum: 6 },
  ],
  doors: [
    {
      position: { x: 1240, y: 260 },
      size: { x: DOOR_THICKNESS, y: DOOR_VERTICAL_LENGTH },
      targetSceneId: "HOUSING",
      direction: DoorDirection.RIGHT
    },
    {
      position: { x: 540, y: 680 },
      size: { x: DOOR_HORIZONTAL_LENGTH, y: DOOR_THICKNESS },
      targetSceneId: "CHECKOUT",
      direction: DoorDirection.DOWN
    }
  ],
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
  ],
  wallSprites: [{
    direction: WallSpriteDirection.TOP1,
    position: { x: 20, y: 0 },
    size: new BasicSize(1280, 20, 4),
  }, {
    direction: WallSpriteDirection.LEFT,
    position: { x: 0, y: 20 },
    size: new BasicSize(5, 720, 4),
    cornerType: CornerSpriteType.TL,
    cornerPos: { x: 0, y: 0 },
  }],
  lightConfig: [
    // Left wall aisle (x center ~80)
    //{ position: { x: 0, y: 100  }, width: 180, height: 80, color: "#eef5ff", minAlpha: 0.04, maxAlpha: 0.14, flickerSpeed: 4.0 },
    { position: { x: 0, y: 530 }, width: 180, height: 80, color: "#eef5ff", minAlpha: 0.03, maxAlpha: 0.12, flickerSpeed: 2.6 },
    // Narrow aisle between col1 and col2 (center ~444)
    { position: { x: 400, y: 100  }, width: 100, height: 70, color: "#eef5ff", minAlpha: 0.03, maxAlpha: 0.11, flickerSpeed: 5.4 },
    { position: { x: 400, y: 530 }, width: 100, height: 70, color: "#eef5ff", minAlpha: 0.04, maxAlpha: 0.12, flickerSpeed: 3.2 },
    // Narrow aisle between col2 and col3 (center ~744, gap x:738-750 is 12px — light centered on gap)
    { position: { x: 800, y: 100  }, width: 100, height: 70, color: "#eef5ff", minAlpha: 0.04, maxAlpha: 0.13, flickerSpeed: 2.8 },
    //{ position: { x: 800, y: 530 }, width: 100, height: 70, color: "#eef5ff", minAlpha: 0.03, maxAlpha: 0.10, flickerSpeed: 4.7 },
    // Right wall aisle (x center ~1120)
    { position: { x: 1060, y: 100  }, width: 180, height: 80, color: "#eef5ff", minAlpha: 0.04, maxAlpha: 0.12, flickerSpeed: 3.5 },
    { position: { x: 1060, y: 530 }, width: 180, height: 80, color: "#eef5ff", minAlpha: 0.03, maxAlpha: 0.11, flickerSpeed: 5.0 },
  ]
}