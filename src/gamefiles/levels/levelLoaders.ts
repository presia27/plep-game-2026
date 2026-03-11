import { loadLevelOne } from "./levelone.ts";
import { loadLevelTwo } from "./leveltwo.ts";
import { loadLevelThree } from "./levelthree.ts";
import { loadLevelFour } from "./levelfour.ts";
import { loadLevelFive } from "./levelfive.ts";

/**
 * Ordered sequence of available levels in the game
 * This is a list of function references.
 */
export const levelLoaders = [
  loadLevelOne,
  loadLevelTwo,
  loadLevelThree,
  loadLevelFour,
  loadLevelFive
];