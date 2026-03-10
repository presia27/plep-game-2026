import { IAssetList } from "../typeinterfaces.ts";

/**
 * Please put all assets that need to be loaded here in this file
 * (pretty please, don't put them in main or the scene manager  :-)  )
 * 
 * @author Preston Sia, Emma Szebenyi
 */

/** All player related assets */
export const playerAssets: IAssetList[] = [
  { id: "player", type: "img", location: "./assets/EmployeeFullSpriteSheet.png" }
];

/** All monster assets */
export const monsterAssets: IAssetList[] = [
  { id: "monster", type: "img", location: "./assets/MonsterSpriteSheet.png" }
];

/** All boss assets */
export const bossAssets: IAssetList[] = [
  { id: "satisfactionBar", type: "img", location: "./assets/BossSatisfactionBar.png" },
  { id: "bossIcons", type: "img", location: "./assets/BossSpriteSheet.png" },
];

/** All environment assets, such as shelves, desks, obstacles, background music, and more */
export const environmentAssets: IAssetList[] = [
  { id: "gameMusic", type: "audio", location: "./assets/gameMusic.ogg" },
  { id: "tempbg", type: "img", location: "./assets/tempbg.JPG" },
  { id: "titleScreen", type: "img", location: "./assets/title_screen_v2.png" },
  { id: "titleText", type: "img", location: "./assets/project_runner_title.png" },
  { id: "HShelvesNoVines", type: "img", location: "./assets/HShelvesNoVines.png" }, // OLD horizontal shelf spritesheet - should not be used unless error with new one
  { id: "HShelvesVines", type: "img", location: "./assets/HShelvesVines.png" }, // OLD horizontal shelf spritesheet - should not be used unless error with new one
  { id: "AllHShelves", type: "img", location: "./assets/AllHShelves.png" },
  { id: "arrow", type: "img", location: "./assets/ArrowSpritesheet.png" },
  { id: "floor", type: "img", location: "./assets/StoreFloorTexture.png" },
  { id: "blood", type: "img", location: "./assets/BloodSplatter.png" },
  { id: "shelfShadow", type: "img", location: "./assets/ShelfShadow.png" },
  { id: "parkingLot", type: "img", location: "./assets/ParkingLot.png" },
  { id: "vehicles", type: "img", location: "./assets/VehicleSpritesheet.png" }
];

/** Assets for items */
export const itemAssets: IAssetList[] = [
  { id: "items", type: "img", location: "./assets/items.png" }, // OLD item image - should not be used unless error with new one
  { id: "items2", type: "img", location: "./assets/AllItemsSpritesheet.png" }
];

/** Assets for Delivery */
export const deliveryAssets: IAssetList [] = [
  { id: "deliveryImage", type: "img", location: "./assets/DeliveryArea.png"}
];

/** Sound effects for gameplay events */
export const soundEffects: IAssetList[] = [
  { id: "orderAppear", type: "audio", location: "./assets/Order.ogg" },
  { id: "itemPickup", type: "audio", location: "./assets/PickUp.ogg" },
  { id: "orderComplete", type: "audio", location: "./assets/Success.ogg" },
  { id: "orderWrong", type: "audio", location: "./assets/Wrong.ogg" }
];
