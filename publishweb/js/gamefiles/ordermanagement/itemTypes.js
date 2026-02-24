/**
 * Item type definitions for the order pickup system
 * Each item corresponds to a frame in the items.png spritesheet
 * @author pmo, claude did most of this one, Preston
 */
/**
 * Available item types in the game.
 * Each item maps to a specific frame index in the items.png spritesheet.
 */
export var ItemType;
(function (ItemType) {
    ItemType["TOILETPAPER"] = "TOILETPAPER";
    ItemType["TISSUES"] = "TISSUES";
    ItemType["PAPERTOWEL"] = "PAPERTOWELS";
    ItemType["SPRAY"] = "SPRAY";
    ItemType["SPONGE"] = "SPONGE";
    ItemType["MOP"] = "MOP";
    ItemType["DUSTER"] = "DUSTER";
    ItemType["VACUUM"] = "VACUUM";
    ItemType["DUSTPAN"] = "DUSTPAN";
    ItemType["CLEANER"] = "CLEANER";
    ItemType["BUCKET"] = "BUCKET";
    ItemType["DETERGENT"] = "DETERGENT";
})(ItemType || (ItemType = {}));
/**
 * All available items with their metadata
 */
export const ALL_ITEMS = [
    { type: ItemType.TOILETPAPER, name: "Toilet Paper", spriteFrameX: 0, spriteFrameY: 0 },
    { type: ItemType.TISSUES, name: "Tissues", spriteFrameX: 60, spriteFrameY: 0 },
    { type: ItemType.PAPERTOWEL, name: "Paper Towel", spriteFrameX: 120, spriteFrameY: 0 },
    { type: ItemType.SPRAY, name: "Spray", spriteFrameX: 180, spriteFrameY: 0 },
    { type: ItemType.SPONGE, name: "Sponge", spriteFrameX: 0, spriteFrameY: 58 },
    { type: ItemType.MOP, name: "Mop", spriteFrameX: 60, spriteFrameY: 58 },
    { type: ItemType.DUSTER, name: "Duster", spriteFrameX: 120, spriteFrameY: 58 },
    { type: ItemType.VACUUM, name: "Vacuum", spriteFrameX: 180, spriteFrameY: 58 },
    { type: ItemType.DUSTPAN, name: "Dustpan", spriteFrameX: 0, spriteFrameY: 116 },
    { type: ItemType.CLEANER, name: "Cleaner", spriteFrameX: 60, spriteFrameY: 116 },
    { type: ItemType.BUCKET, name: "Bucket", spriteFrameX: 120, spriteFrameY: 116 },
    { type: ItemType.DETERGENT, name: "Detergent", spriteFrameX: 180, spriteFrameY: 116 }
];
/**
 * Get item metadata by type
 */
export function getItemMetadata(type) {
    const item = ALL_ITEMS.find(item => item.type === type);
    if (!item) {
        console.warn(`Item type ${type} not found, returning default`);
        return { type: ItemType.TOILETPAPER, name: "Unknown", spriteFrameX: 0, spriteFrameY: 0 };
    }
    return item;
}
