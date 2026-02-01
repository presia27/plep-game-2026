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
 * Item type definitions for the order pickup system
 * Each item corresponds to a frame in the items.png spritesheet
 * @author pmo
 */

/**
 * Available item types in the game.
 * Each item maps to a specific frame index in the items.png spritesheet.
 */
export enum ItemType {
  APPLE = 0,
  BREAD = 1,
  CHEESE = 2,
  MILK = 3,
  EGGS = 4,
  FISH = 5,
  MEAT = 6,
  CARROT = 7,
  TOMATO = 8,
  LETTUCE = 9,
  BANANA = 10,
  ORANGE = 11
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
export function getItemMetadata(type: ItemType): ItemMetadata {
  const item = ALL_ITEMS.find(item => item.type === type);
  if (!item) {
    console.warn(`Item type ${type} not found, returning default`);
    return { type: ItemType.APPLE, name: "Unknown", spriteFrameIndex: 0 };
  }
  return item;
}
