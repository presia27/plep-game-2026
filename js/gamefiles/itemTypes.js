/**
 * Item type definitions for the order pickup system
 * Each item corresponds to a frame in the items.png spritesheet
 * @author pmo, claude did most of this one
 */
/**
 * Available item types in the game.
 * Each item maps to a specific frame index in the items.png spritesheet.
 */
export var ItemType;
(function (ItemType) {
    ItemType[ItemType["TOILETPAPER"] = 0] = "TOILETPAPER";
    ItemType[ItemType["TISSUES"] = 1] = "TISSUES";
    ItemType[ItemType["PAPERTOWEL"] = 2] = "PAPERTOWEL";
    ItemType[ItemType["SPRAY"] = 3] = "SPRAY";
    ItemType[ItemType["SPONGE"] = 4] = "SPONGE";
    ItemType[ItemType["MOP"] = 5] = "MOP";
    ItemType[ItemType["DUSTER"] = 6] = "DUSTER";
    ItemType[ItemType["VACUUM"] = 7] = "VACUUM";
    ItemType[ItemType["DUSTPAN"] = 8] = "DUSTPAN";
    ItemType[ItemType["CLEANER"] = 9] = "CLEANER";
    ItemType[ItemType["BUCKET"] = 10] = "BUCKET";
    ItemType[ItemType["DETERGENT"] = 11] = "DETERGENT";
})(ItemType || (ItemType = {}));
/**
 * Item type definitions for the order pickup system
 * Each item corresponds to a frame in the items.png spritesheet
 * @author pmo
 */
/**
 * Available item types in the game.
 * Each item maps to a specific frame index in the items.png spritesheet.
 */
(function (ItemType) {
    ItemType[ItemType["APPLE"] = 0] = "APPLE";
    ItemType[ItemType["BREAD"] = 1] = "BREAD";
    ItemType[ItemType["CHEESE"] = 2] = "CHEESE";
    ItemType[ItemType["MILK"] = 3] = "MILK";
    ItemType[ItemType["EGGS"] = 4] = "EGGS";
    ItemType[ItemType["FISH"] = 5] = "FISH";
    ItemType[ItemType["MEAT"] = 6] = "MEAT";
    ItemType[ItemType["CARROT"] = 7] = "CARROT";
    ItemType[ItemType["TOMATO"] = 8] = "TOMATO";
    ItemType[ItemType["LETTUCE"] = 9] = "LETTUCE";
    ItemType[ItemType["BANANA"] = 10] = "BANANA";
    ItemType[ItemType["ORANGE"] = 11] = "ORANGE";
})(ItemType || (ItemType = {}));
/**
 * All available items with their metadata
 */
export const ALL_ITEMS = [
    { type: ItemType.APPLE, name: "Apple", spriteFrameIndex: 0 },
    { type: ItemType.BREAD, name: "Bread", spriteFrameIndex: 1 },
    { type: ItemType.CHEESE, name: "Cheese", spriteFrameIndex: 2 },
    { type: ItemType.MILK, name: "Milk", spriteFrameIndex: 3 },
    { type: ItemType.EGGS, name: "Eggs", spriteFrameIndex: 4 },
    { type: ItemType.FISH, name: "Fish", spriteFrameIndex: 5 },
    { type: ItemType.MEAT, name: "Meat", spriteFrameIndex: 6 },
    { type: ItemType.CARROT, name: "Carrot", spriteFrameIndex: 7 },
    { type: ItemType.TOMATO, name: "Tomato", spriteFrameIndex: 8 },
    { type: ItemType.LETTUCE, name: "Lettuce", spriteFrameIndex: 9 },
    { type: ItemType.BANANA, name: "Banana", spriteFrameIndex: 10 },
    { type: ItemType.ORANGE, name: "Orange", spriteFrameIndex: 11 }
];
/**
 * Get item metadata by type
 */
export function getItemMetadata(type) {
    const item = ALL_ITEMS.find(item => item.type === type);
    if (!item) {
        console.warn(`Item type ${type} not found, returning default`);
        return { type: ItemType.APPLE, name: "Unknown", spriteFrameIndex: 0 };
    }
    return item;
}
