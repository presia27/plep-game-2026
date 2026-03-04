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
  MOISTURIZER = "MOISTURIZER",
  // food items
  STRAWBERRY = "STRAWBERRY",
  BANANA = "BANANA",
  APPLE = "APPLE",
  BROCCOLI = "BROCCOLI",
  STEAK = "STEAK",
  FISH = "FISH",
  CHEESE = "CHEESE",
  MILK = "MILK",
  BUTTER = "BUTTER",
  CHIPS = "CHIPS",
  COOKIES = "COOKIES",
  SODA = "SODA",
  PASTA = "PASTA",
  BREAD = "BREAD",
  PIZZA = "PIZZA",
  ICECREAM = "ICECREAM",
  // housing items
  LAMP = "LAMP",
  CHAIR = "CHAIR",
  PILLOW = "PILLOW",
  FLOORMIRROR = "FLOORMIRROR",
  PLANT = "PLANT",
  PAINTING = "PAINTING",
  CANDLE = "CANDLE",
  SPOON = "SPOON",
  FORK = "FORK",
  KNIFE = "KNIFE",
  // electronics items
  MOUSE = "MOUSE",
  LAPTOP = "LAPTOP",
  MONITOR = "MONITOR",
  TV = "TV",
  HEADPHONES = "HEADPHONES",
  CONTROLLER = "CONTROLLER",
  SPEAKER = "SPEAKER",
  MICROPHONE = "MICROPHONE",
  PHONE = "PHONE"
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
  { type: ItemType.TISSUES,     name: "Tissues",        spriteFrameX: 11, spriteFrameY: 1 },
  { type: ItemType.PAPERTOWEL,  name: "Paper Towel",    spriteFrameX: 21, spriteFrameY: 1 },
  { type: ItemType.SPRAY,       name: "Spray",          spriteFrameX: 31, spriteFrameY: 1 },
  { type: ItemType.SPONGE,      name: "Sponge",         spriteFrameX: 41, spriteFrameY: 1},
  { type: ItemType.MOP,         name: "Mop",            spriteFrameX: 51, spriteFrameY: 1 },
  { type: ItemType.DUSTER,      name: "Duster",         spriteFrameX: 61, spriteFrameY: 1 },
  { type: ItemType.VACUUM,      name: "Vacuum",         spriteFrameX: 71, spriteFrameY: 1 },
  { type: ItemType.DUSTPAN,     name: "Dustpan",        spriteFrameX: 81, spriteFrameY: 1 },
  { type: ItemType.CLEANER,     name: "Cleaner",        spriteFrameX: 91, spriteFrameY: 1 },
  { type: ItemType.BUCKET,      name: "Bucket",         spriteFrameX: 101, spriteFrameY: 1 },
  { type: ItemType.DETERGENT,   name: "Detergent",      spriteFrameX: 111, spriteFrameY: 1 },
  // pharmacy items
  { type: ItemType.PILL,        name: "Pill",           spriteFrameX: 1, spriteFrameY: 11 },
  { type: ItemType.BANDAID,     name: "Band-Aid",       spriteFrameX: 11, spriteFrameY: 11 },
  { type: ItemType.MEDICINE,    name: "Medicine",       spriteFrameX: 21, spriteFrameY: 11 },
  { type: ItemType.BOW,         name: "Bow",            spriteFrameX: 31, spriteFrameY: 11 },
  { type: ItemType.HEADBAND,    name: "Headband",       spriteFrameX: 41, spriteFrameY: 11 },
  { type: ItemType.FIRSTAID,    name: "First Aid",      spriteFrameX: 51, spriteFrameY: 11 },
  { type: ItemType.TOOTHBRUSH,  name: "Toothbrush",     spriteFrameX: 61, spriteFrameY: 11 },
  { type: ItemType.MIRROR,      name: "Mirror",         spriteFrameX: 71, spriteFrameY: 11 },
  { type: ItemType.NAILPOLISH,  name: "Nail Polish",    spriteFrameX: 81, spriteFrameY: 11 },
  { type: ItemType.NAILCLIPPERS,name: "Nail Clippers",  spriteFrameX: 91, spriteFrameY: 11 },
  { type: ItemType.FLOSS,       name: "Floss",          spriteFrameX: 101, spriteFrameY: 11 },
  { type: ItemType.TOOTHPASTE,  name: "Toothpaste",     spriteFrameX: 111, spriteFrameY: 11 },
  { type: ItemType.RAZOR,       name: "Razor",          spriteFrameX: 121, spriteFrameY: 11 },
  { type: ItemType.SOAP,        name: "Soap",           spriteFrameX: 131, spriteFrameY: 11 },
  { type: ItemType.QTIP,        name: "Q-Tip",          spriteFrameX: 141, spriteFrameY: 11 },
  { type: ItemType.SHAMPOO,     name: "Shampoo",        spriteFrameX: 151, spriteFrameY: 11 },
  { type: ItemType.LOTION,      name: "Lotion",         spriteFrameX: 161, spriteFrameY: 11 },
  { type: ItemType.MOISTURIZER, name: "Moisturizer",    spriteFrameX: 171, spriteFrameY: 11 },
  // food items
  { type: ItemType.STRAWBERRY,  name: "Strawberry",     spriteFrameX: 1, spriteFrameY: 21 },
  { type: ItemType.BANANA,      name: "Banana",         spriteFrameX: 11, spriteFrameY: 21 },
  { type: ItemType.APPLE,       name: "Apple",          spriteFrameX: 21, spriteFrameY: 21 },
  { type: ItemType.BROCCOLI,    name: "Broccoli",       spriteFrameX: 31, spriteFrameY: 21 },
  { type: ItemType.STEAK,       name: "Steak",          spriteFrameX: 41, spriteFrameY: 21 },
  { type: ItemType.FISH,        name: "Fish",           spriteFrameX: 51, spriteFrameY: 21 },
  { type: ItemType.CHEESE,      name: "Cheese",         spriteFrameX: 61, spriteFrameY: 21 },
  { type: ItemType.MILK,        name: "Milk",           spriteFrameX: 71, spriteFrameY: 21 },
  { type: ItemType.BUTTER,      name: "Butter",         spriteFrameX: 81, spriteFrameY: 21 },
  { type: ItemType.CHIPS,       name: "Chips",          spriteFrameX: 91, spriteFrameY: 21 },
  { type: ItemType.COOKIES,     name: "Cookies",        spriteFrameX: 101, spriteFrameY: 21 },
  { type: ItemType.SODA,        name: "Soda",           spriteFrameX: 111, spriteFrameY: 21 },
  { type: ItemType.PASTA,       name: "Pasta",          spriteFrameX: 121, spriteFrameY: 21 },
  { type: ItemType.BREAD,       name: "Bread",          spriteFrameX: 131, spriteFrameY: 21 },
  { type: ItemType.PIZZA,       name: "Pizza",          spriteFrameX: 141, spriteFrameY: 21 },
  { type: ItemType.ICECREAM,    name: "Ice Cream",      spriteFrameX: 151, spriteFrameY: 21 },
  // housing items
  { type: ItemType.LAMP,        name: "Lamp",           spriteFrameX: 1, spriteFrameY: 31 },
  { type: ItemType.CHAIR,       name: "Chair",          spriteFrameX: 11, spriteFrameY: 31 },
  { type: ItemType.PILLOW,      name: "Pillow",         spriteFrameX: 21, spriteFrameY: 31 },
  { type: ItemType.FLOORMIRROR, name: "Floor Mirror",   spriteFrameX: 31, spriteFrameY: 31 },
  { type: ItemType.PLANT,       name: "Plant",          spriteFrameX: 41, spriteFrameY: 31 },
  { type: ItemType.PAINTING,    name: "Painting",       spriteFrameX: 51, spriteFrameY: 31 },
  { type: ItemType.CANDLE,      name: "Candle",         spriteFrameX: 61, spriteFrameY: 31 },
  { type: ItemType.SPOON,       name: "Spoon",          spriteFrameX: 71, spriteFrameY: 31 },
  { type: ItemType.FORK,        name: "Fork",           spriteFrameX: 81, spriteFrameY: 31 },
  { type: ItemType.KNIFE,       name: "Knife",          spriteFrameX: 91, spriteFrameY: 31 },
  // electronics items
  { type: ItemType.MOUSE,       name: "Mouse",          spriteFrameX: 1, spriteFrameY: 41 },
  { type: ItemType.LAPTOP,      name: "Laptop",         spriteFrameX: 11, spriteFrameY: 41 },
  { type: ItemType.MONITOR,     name: "Monitor",        spriteFrameX: 21, spriteFrameY: 41 },
  { type: ItemType.TV,          name: "TV",             spriteFrameX: 31, spriteFrameY: 41 },
  { type: ItemType.HEADPHONES,  name: "Headphones",     spriteFrameX: 41, spriteFrameY: 41 },
  { type: ItemType.CONTROLLER,  name: "Controller",     spriteFrameX: 51, spriteFrameY: 41 },
  { type: ItemType.SPEAKER,     name: "Speaker",        spriteFrameX: 61, spriteFrameY: 41 },
  { type: ItemType.MICROPHONE,  name: "Microphone",     spriteFrameX: 71, spriteFrameY: 41 },
  { type: ItemType.PHONE,       name: "Phone",          spriteFrameX: 81, spriteFrameY: 41 },
]

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
