import { loadLevelOne } from "./levelone.js";
import { loadLevelTwo } from "./leveltwo.js";
import { loadLevelThree } from "./levelthree.js";
import { loadLevelFour } from "./levelfour.js";
import { loadLevelFive } from "./levelfive.js";
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
