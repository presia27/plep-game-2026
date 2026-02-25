/**
 * Item type definitions for the order pickup system
 * Each item corresponds to a frame in the items.png spritesheet
 * @author pmo, claude did most of this one, Preston, Emma
 */

/**
 * Available item types in the game.
 * Each item maps to a specific frame index in the items.png spritesheet.
 */
export enum ItemType {
  // cleaning items
  TOILETPAPER = "TOILETPAPER",
  TISSUES = "TISSUES",
  PAPERTOWEL = "PAPERTOWELS",
  SPRAY = "SPRAY",
  SPONGE = "SPONGE",
  MOP = "MOP",
  DUSTER = "DUSTER",
  VACUUM = "VACUUM",
  DUSTPAN = "DUSTPAN",
  CLEANER = "CLEANER",
  BUCKET = "BUCKET",
  DETERGENT = "DETERGENT",
  // pharmacy items
  PILL = "PILL",
  BANDAID = "BANDAID",
  MEDICINE = "MEDICINE",
  BOW = "BOW",
  HEADBAND = "HEADBAND",
  FIRSTAID = "FIRSTAID",
  TOOTHBRUSH = "TOOTHBRUSH",
  MIRROR = "MIRROR",
  NAILPOLISH = "NAILPOLISH",
  NAILCLIPPERS = "NAILCLIPPERS",
  FLOSS = "FLOSS",
  TOOTHPASTE = "TOOTHPASTE",
  RAZOR = "RAZOR",
  SOAP = "SOAP",
  QTIP = "QTIP",
  SHAMPOO = "SHAMPOO",
  LOTION = "LOTION",
  MOISTURIZER = "MOISTURIZER"
}

/**
 * Metadata for each item type
 */
export interface ItemMetadata {
  type: ItemType;
  name: string;
  spriteFrameX: number;
  spriteFrameY: number;
}

/**
 * All available items with their metadata
 */
export const ALL_ITEMS: ItemMetadata[] = [
  // cleaning items
  { type: ItemType.TOILETPAPER, name: "Toilet Paper",   spriteFrameX: 1, spriteFrameY: 1 },
  { type: ItemType.TISSUES,     name: "Tissues",        spriteFrameX: 1, spriteFrameY: 11 },
  { type: ItemType.PAPERTOWEL,  name: "Paper Towel",    spriteFrameX: 1, spriteFrameY: 21 },
  { type: ItemType.SPRAY,       name: "Spray",          spriteFrameX: 1, spriteFrameY: 31 },
  { type: ItemType.SPONGE,      name: "Sponge",         spriteFrameX: 1, spriteFrameY: 41},
  { type: ItemType.MOP,         name: "Mop",            spriteFrameX: 1, spriteFrameY: 51 },
  { type: ItemType.DUSTER,      name: "Duster",         spriteFrameX: 1, spriteFrameY: 61 },
  { type: ItemType.VACUUM,      name: "Vacuum",         spriteFrameX: 1, spriteFrameY: 71 },
  { type: ItemType.DUSTPAN,     name: "Dustpan",        spriteFrameX: 1, spriteFrameY: 81 },
  { type: ItemType.CLEANER,     name: "Cleaner",        spriteFrameX: 1, spriteFrameY: 91 },
  { type: ItemType.BUCKET,      name: "Bucket",         spriteFrameX: 1, spriteFrameY: 101 },
  { type: ItemType.DETERGENT,   name: "Detergent",      spriteFrameX: 1, spriteFrameY: 111 },
  // pharmacy items
  { type: ItemType.PILL,        name: "Pill",           spriteFrameX: 1, spriteFrameY: 121 },
  { type: ItemType.BANDAID,     name: "Band-Aid",       spriteFrameX: 1, spriteFrameY: 131 },
  { type: ItemType.MEDICINE,    name: "Medicine",       spriteFrameX: 1, spriteFrameY: 141 },
  { type: ItemType.BOW,         name: "Bow",            spriteFrameX: 1, spriteFrameY: 151 },
  { type: ItemType.HEADBAND,    name: "Headband",       spriteFrameX: 1, spriteFrameY: 161 },
  { type: ItemType.FIRSTAID,    name: "First Aid",      spriteFrameX: 1, spriteFrameY: 171 },
  { type: ItemType.TOOTHBRUSH,  name: "Toothbrush",     spriteFrameX: 1, spriteFrameY: 181 },
  { type: ItemType.MIRROR,      name: "Mirror",         spriteFrameX: 1, spriteFrameY: 191 },
  { type: ItemType.NAILPOLISH,  name: "Nail Polish",    spriteFrameX: 1, spriteFrameY: 201 },
  { type: ItemType.NAILCLIPPERS,name: "Nail Clippers",  spriteFrameX: 1, spriteFrameY: 211 },
  { type: ItemType.FLOSS,       name: "Floss",          spriteFrameX: 1, spriteFrameY: 221 },
  { type: ItemType.TOOTHPASTE,  name: "Toothpaste",     spriteFrameX: 1, spriteFrameY: 231 },
  { type: ItemType.RAZOR,       name: "Razor",          spriteFrameX: 1, spriteFrameY: 241 },
  { type: ItemType.SOAP,        name: "Soap",           spriteFrameX: 1, spriteFrameY: 251 },
  { type: ItemType.QTIP,        name: "Q-Tip",          spriteFrameX: 1, spriteFrameY: 261 },
  { type: ItemType.SHAMPOO,     name: "Shampoo",        spriteFrameX: 1, spriteFrameY: 271 },
  { type: ItemType.LOTION,      name: "Lotion",         spriteFrameX: 1, spriteFrameY: 281 },
  { type: ItemType.MOISTURIZER, name: "Moisturizer",    spriteFrameX: 1, spriteFrameY: 291 }
];

/**
 * Get item metadata by type
 */
export function getItemMetadata(type: ItemType): ItemMetadata {
  const item = ALL_ITEMS.find(item => item.type === type);
  if (!item) {
    console.warn(`Item type ${type} not found, returning default`);
    return { type: ItemType.TOILETPAPER, name: "Unknown", spriteFrameX: 0, spriteFrameY: 0 };
  }
  return item;
}
