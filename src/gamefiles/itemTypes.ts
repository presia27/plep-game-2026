/**
 * Item type definitions for the order pickup system
 * Each item corresponds to a frame in the items.png spritesheet
 * @author pmo, claude did most of this one
 */

/**
 * Available item types in the game.
 * Each item maps to a specific frame index in the items.png spritesheet.
 */
export enum ItemType {
  TOILETPAPER = 0,
  TISSUES = 1,
  PAPERTOWEL = 2,
  SPRAY = 3,
  SPONGE = 4,
  MOP = 5,
  DUSTER = 6,
  VACUUM = 7,
  DUSTPAN = 8,
  CLEANER = 9,
  BUCKET = 10,
  DETERGENT = 11
}

/**
 * Metadata for each item type
 */
export interface ItemMetadata {
  type: ItemType;
  name: string;
  spriteFrameIndex: number;
}

/**
 * All available items with their metadata
 */
export const ALL_ITEMS: ItemMetadata[] = [
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
export function getItemMetadata(type: ItemType): ItemMetadata {
  const item = ALL_ITEMS.find(item => item.type === type);
  if (!item) {
    console.warn(`Item type ${type} not found, returning default`);
    return { type: ItemType.TOILETPAPER, name: "Unknown", spriteFrameIndex: 0 };
  }
  return item;
}
