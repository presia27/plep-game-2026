import { ItemType } from "../ordermanagement/itemTypes.js";
const DOOR_VERTICAL_LENGTH = 200;
const DOOR_HORIZONTAL_LENGTH = 200;
const DOOR_THICKNESS = 20;
/**
 * Directions for doors (derived from sprite design: right=0, down=1, left=2, up=3)
 */
export var DoorDirection;
(function (DoorDirection) {
    DoorDirection[DoorDirection["RIGHT"] = 0] = "RIGHT";
    DoorDirection[DoorDirection["DOWN"] = 1] = "DOWN";
    DoorDirection[DoorDirection["LEFT"] = 2] = "LEFT";
    DoorDirection[DoorDirection["UP"] = 3] = "UP";
})(DoorDirection || (DoorDirection = {}));
export const DeliveryRoom = {
    sceneId: "delivery",
    roomWidth: 1280,
    roomHeight: 720,
    bloodLocations: [],
    spawnPoints: [
        { x: 540, y: 30 }, // from checkout
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
    isParkingLot: true
};
export const CheckoutRoom = {
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
        { x: 540, y: 30 }, // from electronics
        { x: 1130, y: 270 }, // from pharmacy
        { x: 540, y: 570 }, // from delivery
    ],
    monsterSpawns: [
        { x: 60, y: 600 },
    ],
    updatePoints: [
        { x: 50, y: 40 }, { x: 600, y: 40 }, { x: 1200, y: 40 },
        { x: 50, y: 280 }, { x: 1200, y: 280 },
        { x: 50, y: 600 }, { x: 600, y: 600 }, { x: 1200, y: 600 }
    ],
    shelves: [],
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
    allowedItems: [],
};
export const PharmaRoom = {
    sceneId: "pharmacy",
    roomWidth: 1280,
    roomHeight: 720,
    bloodLocations: [
        { x: 100, y: 50 }, { x: 430, y: 70 }, { x: 830, y: 20 },
        { x: 250, y: 300 }, { x: 690, y: 350 }, { x: 1000, y: 200 },
        { x: 450, y: 400 }, { x: 60, y: 500 }, { x: 1100, y: 485 },
    ],
    spawnPoints: [
        { x: 540, y: 30 }, // from housing
        { x: 30, y: 270 }, // from checkout
        { x: 1130, y: 270 }, // from cleaning
    ],
    monsterSpawns: [
        { x: 1150, y: 280 }
    ],
    updatePoints: [
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
};
/** Cleaning Section */
export const CleaningRoom = {
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
    spawnPoints: [
        { x: 540, y: 30 }, // from food
        { x: 30, y: 310 }, // from pharmacy
    ],
    monsterSpawns: [
        { x: 600, y: 250 },
        { x: 1150, y: 600 }
    ],
    updatePoints: [
        { x: 50, y: 40 }, { x: 600, y: 40 }, { x: 1150, y: 40 },
        { x: 50, y: 280 }, { x: 1150, y: 280 },
        { x: 50, y: 600 }, { x: 600, y: 600 }, { x: 1150, y: 600 }
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
};
/** Food Section */
export const FoodRoom = {
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
    spawnPoints: [
        { x: 30, y: 270 }, // from housing
        { x: 540, y: 570 }, // from cleaning
    ],
    monsterSpawns: [
        { x: 1150, y: 40 },
        { x: 1150, y: 280 },
        { x: 600, y: 600 }
    ],
    updatePoints: [
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
};
export const HousingRoom = {
    sceneId: "housing",
    roomWidth: 1280,
    roomHeight: 720,
    spawnPoints: [
        { x: 30, y: 270 }, // from electronics
        { x: 1130, y: 270 }, // from food
        { x: 540, y: 570 }, // from pharmacy
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
        { x: 1100, y: 280 }, { x: 60, y: 600 }, { x: 1100, y: 50 }
    ],
    updatePoints: [
        { x: 50, y: 40 }, { x: 600, y: 40 }, { x: 1200, y: 40 },
        { x: 50, y: 280 }, { x: 1200, y: 280 },
        { x: 50, y: 600 }, { x: 600, y: 600 }, { x: 1200, y: 600 }
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
    ]
};
export const ElectronicsRoom = {
    sceneId: "electronics",
    roomWidth: 1280,
    roomHeight: 720,
    spawnPoints: [
        { x: 1130, y: 270 }, // from housing
        { x: 540, y: 570 }, // from checkout
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
    ]
};
