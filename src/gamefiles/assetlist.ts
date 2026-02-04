import { IAssetList } from "../typeinterfaces.ts";

/**
 * Please put all assets that need to be loaded here in this file
 * (pretty please, don't put them in main or the scene manager  :-)  )
 * 
 * @author Preston Sia
 */

/** All player related assets */
export const playerAssets: IAssetList[] = [
  { id: "player", type: "img", location: "./assets/EmployeeFullSpriteSheet.png" }
];

/** All environment assets, such as shelves, desks, obstacles, background music, and more */
export const environmentAssets: IAssetList[] = [
  { id: "shelf", type: "img", location: "./assets/shelf.JPG" }
];

/** Assets for items */
export const itemAssets: IAssetList[] = [
  { id: "items", type: "img", location: "./assets/items.png" }
];
