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
 * All available items with their metadata
 */
export const ALL_ITEMS = [
    { type: ItemType.TOILETPAPER, name: "Toilet Paper", spriteFrameIndex: 0 },
    { type: ItemType.TISSUES, name: "Tissues", spriteFrameIndex: 1 },
    { type: ItemType.PAPERTOWEL, name: "Paper Towel", spriteFrameIndex: 2 },
    { type: ItemType.SPRAY, name: "Spray", spriteFrameIndex: 3 },
    { type: ItemType.SPONGE, name: "Sponge", spriteFrameIndex: 4 },
    { type: ItemType.MOP, name: "Mop", spriteFrameIndex: 5 },
    { type: ItemType.DUSTER, name: "Duster", spriteFrameIndex: 6 },
    { type: ItemType.VACUUM, name: "Vacuum", spriteFrameIndex: 7 },
    { type: ItemType.DUSTPAN, name: "Dustpan", spriteFrameIndex: 8 },
    { type: ItemType.CLEANER, name: "Cleaner", spriteFrameIndex: 9 },
    { type: ItemType.BUCKET, name: "Bucket", spriteFrameIndex: 10 },
    { type: ItemType.DETERGENT, name: "Detergent", spriteFrameIndex: 11 }
];
/**
 * Get item metadata by type
 */
export function getItemMetadata(type) {
    const item = ALL_ITEMS.find(item => item.type === type);
    if (!item) {
        console.warn(`Item type ${type} not found, returning default`);
        return { type: ItemType.TOILETPAPER, name: "Unknown", spriteFrameIndex: 0 };
    }
    return item;
}
