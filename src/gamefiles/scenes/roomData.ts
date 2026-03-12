import { ISize } from "../../classinterfaces";
import { BasicSize } from "../../componentLibrary/BasicSize";
import { XY } from "../../typeinterfaces.ts";
import { ItemType } from "../ordermanagement/itemTypes.ts";

const DOOR_VERTICAL_LENGTH: number = 200;
const DOOR_HORIZONTAL_LENGTH: number = 200;
const DOOR_THICKNESS: number= 20;

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
  TOP = 2,
  BOTTOM = 3
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
}

export const DeliveryRoom: roomData = {
  sceneId: "delivery",
  roomWidth: 1280,
  roomHeight: 720,
  bloodLocations: [],
  spawnPoints: [
    { x: 540, y: 30 },   // from checkout
  ],
  monsterSpawns: [],
  updatePoints: [],
  shelves: [
   // { position: { x: 100, y: 200 }, spriteId: "HShelvesVines" }
  ],
  doors: [
    {
      position: { x: 540, y: 20 },
      size: { x: DOOR_HORIZONTAL_LENGTH, y: DOOR_THICKNESS },
      targetSceneId: "checkout",
      direction: DoorDirection.UP
    }
  ],
  allowedItems: [],
  deliveryEntityPosition: { x: 500, y: 200 },
  isParkingLot: true,
  wallSprites: []
}

export const CheckoutRoom: roomData = {
  sceneId: "checkout",
  roomWidth: 1280,
  roomHeight: 720,
  bloodLocations: [
    { x: 50, y: 100 }, { x: 600, y: 200 }, { x: 1100, y: 50 },
    { x: 70, y: 330 }, { x: 350, y: 400 }, { x: 120, y: 510 },
    { x: 200, y: 40 }, { x: 900, y: 600 }, { x: 850, y: 142 },
    { x: 900, y: 400 },
  ],
  spawnPoints: [
    { x: 540, y: 30 },   // from electronics
    { x: 1130, y: 270 }, // from pharmacy
    { x: 540, y: 570 },  // from delivery
  ],
  monsterSpawns: [
    // { x: 60, y: 600 },
  ],
  updatePoints: [
    // {x: 50, y: 40}, {x: 600, y: 40}, {x: 1200, y: 40},  
    // {x: 50, y: 280},                  {x: 1200, y: 280},
    // {x: 50, y: 600}, {x: 600, y: 600}, {x: 1200, y: 600}
  ],
  shelves : [],
  doors: [
    { 
      position: { x: 540, y: 20 },
      size: { x: DOOR_HORIZONTAL_LENGTH, y: DOOR_THICKNESS },
      targetSceneId: "electronics",
      direction: DoorDirection.UP
    },
    {
      position: { x: 1240, y: 270 },
      size: { x: DOOR_THICKNESS, y: DOOR_VERTICAL_LENGTH },
      targetSceneId: "pharmacy",
      direction: DoorDirection.RIGHT
    },
    {
      position: { x: 540, y: 680 },
      size: { x: DOOR_HORIZONTAL_LENGTH, y: DOOR_THICKNESS }, 
      targetSceneId: "delivery",
      direction: DoorDirection.DOWN
    },
  ],
  isCheckout: true,
  allowedItems: [],
  wallSprites: [{
    direction: WallSpriteDirection.LEFT,
    position: {x: 0, y: 0},
    size: new BasicSize(5, 720, 4),
  }]
}

export const PharmaRoom: roomData = {
  sceneId: "pharmacy",
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
    {x: 1150, y: 280}
  ],
  updatePoints: [ // 6 points for perimeter, 0 for in between shelves
    {x: 50, y: 40}, {x: 1150, y: 40},  
    {x: 50, y: 280}, {x: 1150, y: 280},
    {x: 50, y: 600}, {x: 1150, y: 600}
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
      targetSceneId: "housing",
      direction: DoorDirection.UP
    },
    {
      position: { x: 20, y: 270 },
      size: { x: DOOR_THICKNESS, y: DOOR_VERTICAL_LENGTH },
      targetSceneId: "checkout",
      direction: DoorDirection.LEFT
    },
    {
      position: { x: 1240, y: 270 },
      size: { x: DOOR_THICKNESS, y: DOOR_VERTICAL_LENGTH },
      targetSceneId: "cleaning",
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
    position: {x: 0, y: 1260},
    size: new BasicSize(1280, 5, 4),
  }]
}

/** Cleaning Section */
export const CleaningRoom: roomData = {
  sceneId: "cleaning",
  roomWidth: 1280,
  roomHeight: 720,
  bloodLocations: [
    { x: 250, y: 50 },
    { x: 690, y: 350 },
    { x: 1000, y: 200 },
    { x: 450, y: 500 },
    { x: 60, y: 75 }, { x: 480, y: 220 }, { x: 700, y: 360 },
    { x: 1000, y: 560 }, { x: 450, y: 480 }, { x: 1000, y: 200 },
    { x: 1000, y: 100 }, { x: 400, y: 570 }, { x: 720, y: 555 },
  ],
  spawnPoints: [ // left, top
    { x: 540, y: 30 },   // from food
    { x: 30, y: 310 },   // from pharmacy
  ],
  monsterSpawns: [ 
    {x: 600, y: 250}, 
    {x: 1150, y: 600} 
  ],
  updatePoints: [ // 8 for perimeter, 0 for in between shelves
    {x: 50, y: 40}, {x: 600, y: 40}, {x: 1150, y: 40},  
    {x: 50, y: 280},                  {x: 1150, y: 280},
    {x: 50, y: 600}, {x: 600, y: 600}, {x: 1150, y: 600}
  ],
  shelves: [
    { position: { x: 150, y: 150 }, spriteId: "AllHShelves", shelfNum: 1 },
    { position: { x: 750, y: 150 }, spriteId: "AllHShelves", shelfNum: 4 },
    { position: { x: 150, y: 400 }, spriteId: "AllHShelves", shelfNum: 5 },
    { position: { x: 750, y: 400 }, spriteId: "AllHShelves", shelfNum: 8 },
  ],
  doors: [
    {
      position: { x: 540, y: 20 },
      size: { x: DOOR_HORIZONTAL_LENGTH, y: DOOR_THICKNESS },
      targetSceneId: "food",
      direction: DoorDirection.UP
    },
    {
      position: { x: 20, y: 270 },
      size: { x: DOOR_THICKNESS, y: DOOR_VERTICAL_LENGTH },
      targetSceneId: "pharmacy",
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
    direction: WallSpriteDirection.BOTTOM,
    position: {x: -20, y: 1260}, 
    size: new BasicSize(1280, 5, 4),
  }, {
    direction: WallSpriteDirection.RIGHT,
    position: {x: 1260, y: 0},
    size: new BasicSize(5, 720, 4),
    cornerType: CornerSpriteType.BR,
    cornerPos: {x: 1260, y: 700},
  }]
}

/** Food Section */
export const FoodRoom: roomData = {
  sceneId: "food",
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
    {x: 1150, y: 40}, 
    {x: 1150, y: 280}, 
    {x: 600, y: 600}
  ],
  updatePoints: [ // 6 for perimeter, 0 for in between shelves
    {x: 50, y: 40}, {x: 1150, y: 40},  
    {x: 50, y: 280}, {x: 1150, y: 280},
    {x: 50, y: 600}, {x: 1150, y: 600}
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
      position: { x: 20, y: 270 },
      size: { x: DOOR_THICKNESS, y: DOOR_VERTICAL_LENGTH },
      targetSceneId: "housing",
      direction: DoorDirection.LEFT
    },
    {
      position: { x: 540, y: 680 },
      size: { x: DOOR_HORIZONTAL_LENGTH, y: DOOR_THICKNESS },
      targetSceneId: "cleaning",
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
    direction: WallSpriteDirection.TOP,
    position: {x: -20, y: 0},
    size: new BasicSize(1280, 5, 4),
  }, {
    direction: WallSpriteDirection.RIGHT,
    position: {x: 1260, y: 0},
    size: new BasicSize(5, 720, 4),
    cornerType: CornerSpriteType.TR,
    cornerPos: {x: 1260, y: 0},
  }]
}

export const HousingRoom: roomData = {
  sceneId: "housing",
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
    { x: 46, y: 300 },
    { x: 123, y: 400 },
    { x: 890, y: 500 },
    { x: 218, y: 600 }, 
    { x: 430, y: 650 },
  ],
  monsterSpawns: [
    {x: 1100, y: 280}, {x: 60, y: 600}, {x: 1100, y: 50}
  ],
  updatePoints: [
    {x: 50, y: 40}, {x: 600, y: 40}, {x: 1200, y: 40},  
    {x: 50, y: 280},                  {x: 1200, y: 280},
    {x: 50, y: 600}, {x: 600, y: 600}, {x: 1200, y: 600}
  ],
  shelves: [
    { position: { x: 150, y: 150 }, spriteId: "AllHShelves", shelfNum: 3 },
    { position: { x: 750, y: 150 }, spriteId: "AllHShelves", shelfNum: 8 },
    { position: { x: 150, y: 400 }, spriteId: "AllHShelves", shelfNum: 2 },
    { position: { x: 750, y: 400 }, spriteId: "AllHShelves", shelfNum: 7 },
  ],
  doors: [
    { 
      position: { x: 20, y: 270 },
      size: { x: DOOR_THICKNESS, y: DOOR_VERTICAL_LENGTH },
      targetSceneId: "electronics",
      direction: DoorDirection.LEFT
    },
    {
      position: { x: 1240, y: 270 },
      size: { x: DOOR_THICKNESS, y: DOOR_VERTICAL_LENGTH },
      targetSceneId: "food",
      direction: DoorDirection.RIGHT
    },
    {
      position: { x: 540, y: 680 },
      size: { x: DOOR_HORIZONTAL_LENGTH, y: DOOR_THICKNESS },
      targetSceneId: "pharmacy",
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
    direction: WallSpriteDirection.TOP,
    position: {x: 0, y: 0},
    size: new BasicSize(1280, 5, 4)
  }]
}

export const ElectronicsRoom: roomData = {
  sceneId: "electronics",
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
    { x: 490, y: 400 }, { x: 60, y: 500 }, { x: 1100, y: 485 },
  ],
  monsterSpawns: [
    {x: 60, y: 50}, {x: 1100, y: 600}, { x: 60, y: 600}
  ],
  updatePoints: [
    {x: 50, y: 40}, {x: 1200, y: 40},  
    {x: 50, y: 600}, {x: 1200, y: 600}
  ],
  shelves: [
    { position: { x: 150, y: 250 }, spriteId: "AllHShelves", shelfNum: 8 },
    { position: { x: 450, y: 250 }, spriteId: "AllHShelves", shelfNum: 7 },
    { position: { x: 750, y: 250 }, spriteId: "AllHShelves", shelfNum: 6 },
  ],
  doors: [
    {
      position: { x: 1240, y: 270 },
      size: { x: DOOR_THICKNESS, y: DOOR_VERTICAL_LENGTH },
      targetSceneId: "housing",
      direction: DoorDirection.RIGHT
    },
    {
      position: { x: 540, y: 680 },
      size: { x: DOOR_HORIZONTAL_LENGTH, y: DOOR_THICKNESS },
      targetSceneId: "checkout",
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
    direction: WallSpriteDirection.TOP,
    position: {x: 20, y: 0},
    size: new BasicSize(1280, 5, 4),
  }, {
    direction: WallSpriteDirection.LEFT,
    position: {x: 0, y: 20},
    size: new BasicSize(5, 720, 4),
    cornerType: CornerSpriteType.TL,
    cornerPos: {x: 0, y: 0},
  }]
}

